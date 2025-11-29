import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Plus, Users, Trash2, Edit } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Groupes d'utilisateurs</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau groupe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un groupe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Nom du groupe</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: Commerciaux TLS"
                />
              </div>
              <div>
                <Label htmlFor="groupDescription">Description (optionnel)</Label>
                <Input
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Description du groupe"
                />
              </div>
              <div>
                <Label>Sélectionner les utilisateurs</Label>
                <ScrollArea className="h-[300px] border rounded-md p-4 mt-2">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.userId} className="flex items-center space-x-2">
                        <Checkbox
                          id={user.userId}
                          checked={selectedUserIds.includes(user.userId)}
                          onCheckedChange={() => toggleUser(user.userId)}
                        />
                        <label htmlFor={user.userId} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs text-muted-foreground">{user.upn}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreate}>Créer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {group.name}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(group)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteGroup(group.id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              {group.description && (
                <p className="text-sm text-muted-foreground">{group.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                {group.userIds.length} membre{group.userIds.length > 1 ? 's' : ''}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingGroup && (
        <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le groupe: {editingGroup.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Sélectionner les utilisateurs</Label>
                <ScrollArea className="h-[300px] border rounded-md p-4 mt-2">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.userId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${user.userId}`}
                          checked={selectedUserIds.includes(user.userId)}
                          onCheckedChange={() => toggleUser(user.userId)}
                        />
                        <label htmlFor={`edit-${user.userId}`} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-xs text-muted-foreground">{user.upn}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingGroup(null)}>
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
