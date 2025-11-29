import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Plus, Users, Trash2, Edit, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GroupManagementProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onCreateGroup: (name: string, description: string, userIds: string[]) => void;
  onUpdateGroup: (groupId: string, userIds: string[]) => void;
  onDeleteGroup: (groupId: string) => void;
}

export function GroupManagement({ groups, users, onCreateGroup, onUpdateGroup, onDeleteGroup }: GroupManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
  };

  const toggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.upn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Gestion des groupes</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Organisez vos utilisateurs en groupes pour une analyse simplifiée
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau groupe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau groupe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Nom du groupe *</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: Commerciaux TLS, Support Technique..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupDescription">Description</Label>
                <Input
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Description facultative du groupe"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Sélectionner les utilisateurs</Label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.userId} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={user.userId}
                          checked={selectedUserIds.includes(user.userId)}
                          onCheckedChange={() => toggleUser(user.userId)}
                          className="mt-1"
                        />
                        <label htmlFor={user.userId} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs text-muted-foreground">{user.upn}</div>
                          {user.jobTitle && (
                            <div className="text-xs text-muted-foreground mt-0.5">{user.jobTitle}</div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="text-sm text-muted-foreground mt-2">
                  {selectedUserIds.length} utilisateur{selectedUserIds.length > 1 ? 's' : ''} sélectionné{selectedUserIds.length > 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsCreateOpen(false);
                  setSearchTerm('');
                }}>
                  Annuler
                </Button>
                <Button onClick={handleCreate} disabled={!newGroupName.trim()}>
                  Créer le groupe
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Aucun groupe créé</p>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              Créez votre premier groupe pour organiser vos utilisateurs et faciliter l'analyse des performances
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-primary" />
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
                      className="h-8 w-8 p-0"
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
              <CardContent>
                <Badge variant="secondary" className="gap-1.5">
                  <Users className="h-3 w-3" />
                  {group.userIds.length} membre{group.userIds.length > 1 ? 's' : ''}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingGroup && (
        <Dialog open={!!editingGroup} onOpenChange={() => {
          setEditingGroup(null);
          setSearchTerm('');
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le groupe : {editingGroup.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Membres du groupe</Label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                <ScrollArea className="h-[350px] border rounded-lg p-4">
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.userId} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={`edit-${user.userId}`}
                          checked={selectedUserIds.includes(user.userId)}
                          onCheckedChange={() => toggleUser(user.userId)}
                          className="mt-1"
                        />
                        <label htmlFor={`edit-${user.userId}`} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs text-muted-foreground">{user.upn}</div>
                          {user.jobTitle && (
                            <div className="text-xs text-muted-foreground mt-0.5">{user.jobTitle}</div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="text-sm text-muted-foreground mt-2">
                  {selectedUserIds.length} utilisateur{selectedUserIds.length > 1 ? 's' : ''} sélectionné{selectedUserIds.length > 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setEditingGroup(null);
                  setSearchTerm('');
                }}>
                  Annuler
                </Button>
                <Button onClick={handleUpdate}>Enregistrer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}