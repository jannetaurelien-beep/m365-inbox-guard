import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Plus, Users, Trash2, Edit, Search, ChevronRight, ChevronLeft, UserPlus, UserMinus, Sparkles, Target, Mail, X, Check, ArrowLeftRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface GroupManagementProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onCreateGroup: (name: string, description: string, userIds: string[]) => void;
  onUpdateGroup: (groupId: string, userIds: string[]) => void;
  onDeleteGroup: (groupId: string) => void;
}

const avatarColors = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-indigo-500 to-blue-500',
  'from-fuchsia-500 to-pink-500',
  'from-lime-500 to-green-500',
];

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

export function GroupManagement({ groups, users, onCreateGroup, onUpdateGroup, onDeleteGroup }: GroupManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSelected, setSearchSelected] = useState('');

  const handleCreate = () => {
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName, newGroupDescription, selectedUserIds);
      setNewGroupName('');
      setNewGroupDescription('');
      setSelectedUserIds([]);
      setIsCreateOpen(false);
    }
  };

  const handleUpdate = () => {
    if (editingGroup) {
      onUpdateGroup(editingGroup.id, selectedUserIds);
      setEditingGroup(null);
      setSelectedUserIds([]);
    }
  };

  const openEdit = (group: UserGroup) => {
    setEditingGroup(group);
    setSelectedUserIds([...group.userIds]);
    setSearchTerm('');
    setSearchSelected('');
  };

  const addUser = (userId: string) => {
    if (!selectedUserIds.includes(userId)) {
      setSelectedUserIds(prev => [...prev, userId]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUserIds(prev => prev.filter(id => id !== userId));
  };

  const addAllFiltered = () => {
    const filteredIds = availableUsers.map(u => u.userId);
    setSelectedUserIds(prev => [...new Set([...prev, ...filteredIds])]);
  };

  const removeAllSelected = () => {
    setSelectedUserIds([]);
  };

  // Utilisateurs disponibles (non sélectionnés)
  const availableUsers = useMemo(() => {
    return users
      .filter(u => !selectedUserIds.includes(u.userId))
      .filter(u => 
        u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.upn.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [users, selectedUserIds, searchTerm]);

  // Utilisateurs sélectionnés
  const selectedUsers = useMemo(() => {
    return users
      .filter(u => selectedUserIds.includes(u.userId))
      .filter(u => 
        u.displayName.toLowerCase().includes(searchSelected.toLowerCase()) ||
        u.upn.toLowerCase().includes(searchSelected.toLowerCase())
      );
  }, [users, selectedUserIds, searchSelected]);

  const UserCard = ({ user, isSelected, onAction }: { user: MailUserSummary; isSelected: boolean; onAction: () => void }) => {
    const sla = user.metrics.external.first_reply_within_sla || 0;
    const colorClass = getAvatarColor(user.displayName);
    
    return (
      <div 
        className={cn(
          "group relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer",
          isSelected 
            ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 hover:border-emerald-500/50" 
            : "bg-gradient-to-r from-background to-primary/5 border-primary/10 hover:border-primary/30 hover:shadow-md"
        )}
        onClick={onAction}
      >
        <Avatar className={cn("h-11 w-11 ring-2 transition-all", isSelected ? "ring-emerald-500/30" : "ring-primary/20 group-hover:ring-primary/40")}>
          <AvatarFallback className={cn("bg-gradient-to-br text-white font-semibold", colorClass)}>
            {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{user.displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
          {user.jobTitle && (
            <Badge variant="outline" className="mt-1 text-xs py-0 h-5 bg-background/50">
              {user.jobTitle}
            </Badge>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium",
              sla >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
              sla >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/30" :
              "bg-red-500/10 text-red-600 border-red-500/30"
            )}
          >
            <Target className="h-3 w-3 mr-1" />
            {Math.round(sla)}%
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {user.metrics.external.received}
          </span>
        </div>

        {/* Action button overlay */}
        <div className={cn(
          "absolute inset-y-0 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
        )}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            isSelected 
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" 
              : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
          )}>
            {isSelected ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          </div>
        </div>
      </div>
    );
  };

  const UserSelector = () => (
    <div className="grid grid-cols-2 gap-4 h-[500px]">
      {/* Colonne gauche - Utilisateurs disponibles */}
      <div className="flex flex-col border-2 border-primary/10 rounded-2xl overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Disponibles</h4>
                <p className="text-xs text-muted-foreground">{availableUsers.length} utilisateurs</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={addAllFiltered}
              disabled={availableUsers.length === 0}
              className="text-xs h-7 gap-1 text-primary hover:text-primary hover:bg-primary/10"
            >
              <ChevronRight className="h-3 w-3" />
              Tout ajouter
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 bg-background/50 border-primary/20"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            {availableUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Aucun utilisateur disponible</p>
              </div>
            ) : (
              availableUsers.map(user => (
                <UserCard 
                  key={user.userId} 
                  user={user} 
                  isSelected={false} 
                  onAction={() => addUser(user.userId)} 
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Colonne droite - Utilisateurs sélectionnés */}
      <div className="flex flex-col border-2 border-emerald-500/20 rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-500/5 to-teal-500/5">
        <div className="p-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Sélectionnés</h4>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">{selectedUserIds.length} membres</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeAllSelected}
              disabled={selectedUserIds.length === 0}
              className="text-xs h-7 gap-1 text-red-500 hover:text-red-500 hover:bg-red-500/10"
            >
              <X className="h-3 w-3" />
              Tout retirer
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
            <Input
              placeholder="Rechercher dans la sélection..."
              value={searchSelected}
              onChange={(e) => setSearchSelected(e.target.value)}
              className="pl-9 h-9 bg-background/50 border-emerald-500/20 focus:border-emerald-500/40"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            {selectedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <ArrowLeftRight className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm text-center">Cliquez sur les utilisateurs<br />à gauche pour les ajouter</p>
              </div>
            ) : (
              selectedUsers.map(user => (
                <UserCard 
                  key={user.userId} 
                  user={user} 
                  isSelected={true} 
                  onAction={() => removeUser(user.userId)} 
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Gestion des groupes
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Organisez vos utilisateurs en groupes pour une analyse simplifiée
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setSearchTerm('');
            setSearchSelected('');
            setSelectedUserIds([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button size="default" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Plus className="h-4 w-4" />
              Nouveau groupe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Créer un nouveau groupe
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groupName" className="text-sm font-medium">Nom du groupe *</Label>
                  <Input
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Ex: Commerciaux TLS..."
                    className="h-11 bg-gradient-to-r from-background to-primary/5 border-primary/20 focus:border-primary/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupDescription" className="text-sm font-medium">Description</Label>
                  <Input
                    id="groupDescription"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Description facultative..."
                    className="h-11 bg-gradient-to-r from-background to-primary/5 border-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Sélectionner les membres
                </Label>
                <UserSelector />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {selectedUserIds.length} membre{selectedUserIds.length > 1 ? 's' : ''} sélectionné{selectedUserIds.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsCreateOpen(false);
                    setSearchTerm('');
                    setSearchSelected('');
                    setSelectedUserIds([]);
                  }}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleCreate} 
                    disabled={!newGroupName.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Créer le groupe
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <p className="text-lg font-semibold">Aucun groupe créé</p>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              Créez votre premier groupe pour organiser vos utilisateurs et faciliter l'analyse des performances
            </p>
            <Button 
              className="mt-6 gap-2 bg-gradient-to-r from-primary to-accent"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Créer un groupe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, idx) => {
            const colorClass = avatarColors[idx % avatarColors.length];
            const groupUsers = users.filter(u => group.userIds.includes(u.userId));
            const avgSla = groupUsers.length > 0 
              ? groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / groupUsers.length 
              : 0;
            
            return (
              <Card 
                key={group.id} 
                className={cn(
                  "overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2",
                  "bg-gradient-to-br from-background to-primary/5 border-primary/10 hover:border-primary/30"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg", colorClass)}>
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{group.name}</CardTitle>
                        {group.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{group.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(group)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteGroup(group.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Avatars preview */}
                  <div className="flex items-center gap-1">
                    {groupUsers.slice(0, 5).map((user, i) => (
                      <Avatar 
                        key={user.userId} 
                        className={cn(
                          "h-8 w-8 ring-2 ring-background",
                          i > 0 && "-ml-2"
                        )}
                      >
                        <AvatarFallback className={cn("bg-gradient-to-br text-white text-xs font-medium", getAvatarColor(user.displayName))}>
                          {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {groupUsers.length > 5 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium -ml-2 ring-2 ring-background">
                        +{groupUsers.length - 5}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1.5 bg-primary/10 text-primary border-primary/20">
                      <Users className="h-3 w-3" />
                      {group.userIds.length} membre{group.userIds.length > 1 ? 's' : ''}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        avgSla >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                        avgSla >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/30" :
                        "bg-red-500/10 text-red-600 border-red-500/30"
                      )}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      {Math.round(avgSla)}% SLA
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {editingGroup && (
        <Dialog open={!!editingGroup} onOpenChange={(open) => {
          if (!open) {
            setEditingGroup(null);
            setSearchTerm('');
            setSearchSelected('');
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                Modifier : {editingGroup.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Gérer les membres du groupe
                </Label>
                <UserSelector />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {selectedUserIds.length} membre{selectedUserIds.length > 1 ? 's' : ''} sélectionné{selectedUserIds.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setEditingGroup(null);
                    setSearchTerm('');
                    setSearchSelected('');
                  }}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleUpdate}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
