import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserPlus, Pencil, Trash2, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type PermissionLevel = 'lecture' | 'modification' | 'admin';

interface SharePointUser {
  id: string;
  displayName: string;
  email: string;
  permission: PermissionLevel;
  lastAccess?: string;
}

const mockUsers: SharePointUser[] = [
  { id: '1', displayName: 'Marie Dubois', email: 'marie.dubois@entreprise.fr', permission: 'admin', lastAccess: '2025-11-18' },
  { id: '2', displayName: 'Jean Martin', email: 'jean.martin@entreprise.fr', permission: 'modification', lastAccess: '2025-11-17' },
  { id: '3', displayName: 'Sophie Bernard', email: 'sophie.bernard@entreprise.fr', permission: 'lecture', lastAccess: '2025-11-15' },
  { id: '4', displayName: 'Luc Petit', email: 'luc.petit@entreprise.fr', permission: 'modification', lastAccess: '2025-11-16' },
];

const permissionLabels: Record<PermissionLevel, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  lecture: { label: 'Lecture', variant: 'secondary' },
  modification: { label: 'Modification', variant: 'default' },
  admin: { label: 'Admin', variant: 'destructive' },
};

export default function SharePointPermissions() {
  const [users, setUsers] = useState<SharePointUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SharePointUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPermission, setNewUserPermission] = useState<PermissionLevel>('lecture');

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPermission = (user: SharePointUser) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSavePermission = (permission: PermissionLevel) => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, permission } : u)));
      toast({
        title: 'Permissions mises à jour',
        description: `Les droits de ${selectedUser.displayName} ont été modifiés.`,
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleRemoveUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers(users.filter((u) => u.id !== userId));
    toast({
      title: 'Utilisateur retiré',
      description: `${user?.displayName} n'a plus accès au SharePoint.`,
    });
  };

  const handleAddUser = () => {
    if (!newUserEmail) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email.',
        variant: 'destructive',
      });
      return;
    }

    const newUser: SharePointUser = {
      id: `new-${Date.now()}`,
      displayName: newUserEmail.split('@')[0],
      email: newUserEmail,
      permission: newUserPermission,
    };

    setUsers([...users, newUser]);
    toast({
      title: 'Utilisateur ajouté',
      description: `${newUser.email} a été ajouté avec les droits ${permissionLabels[newUserPermission].label}.`,
    });
    setIsAddDialogOpen(false);
    setNewUserEmail('');
    setNewUserPermission('lecture');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Droits SharePoint</h1>
        <p className="text-muted-foreground mt-2">Gérez les accès et permissions du SharePoint partagé</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Utilisateurs et permissions</CardTitle>
              <CardDescription>Contrôlez les accès au SharePoint par compte</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur</DialogTitle>
                  <DialogDescription>Ajoutez un nouveau compte avec des permissions spécifiques</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="utilisateur@entreprise.fr"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permission">Niveau de permission</Label>
                    <Select value={newUserPermission} onValueChange={(value) => setNewUserPermission(value as PermissionLevel)}>
                      <SelectTrigger id="permission">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="modification">Modification</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Dernier accès</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.displayName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={permissionLabels[user.permission].variant}>
                          <Shield className="h-3 w-3 mr-1" />
                          {permissionLabels[user.permission].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastAccess ? new Date(user.lastAccess).toLocaleDateString('fr-FR') : 'Jamais'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPermission(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les permissions</DialogTitle>
            <DialogDescription>
              Modifiez le niveau d'accès de {selectedUser?.displayName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Niveau de permission</Label>
              <Select
                value={selectedUser?.permission}
                onValueChange={(value) => handleSavePermission(value as PermissionLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="modification">Modification</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
