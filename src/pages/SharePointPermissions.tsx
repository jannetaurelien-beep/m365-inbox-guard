import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Pencil, Trash2, Shield, Folder } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

type PermissionLevel = 'lecture' | 'ecriture' | 'acces_complet';

interface SharePointUser {
  id: string;
  displayName: string;
  email: string;
  permission: PermissionLevel;
  lastAccess?: string;
}

interface SharePointFolder {
  id: string;
  name: string;
  path: string;
  users: SharePointUser[];
}

const mockFolders: SharePointFolder[] = [
  {
    id: '1',
    name: 'Documents RH',
    path: '/Partage/RH',
    users: [
      { id: '1', displayName: 'Marie Dubois', email: 'marie.dubois@entreprise.fr', permission: 'acces_complet', lastAccess: '2025-11-18' },
      { id: '2', displayName: 'Jean Martin', email: 'jean.martin@entreprise.fr', permission: 'ecriture', lastAccess: '2025-11-17' },
    ],
  },
  {
    id: '2',
    name: 'Comptabilité',
    path: '/Partage/Comptabilite',
    users: [
      { id: '3', displayName: 'Sophie Bernard', email: 'sophie.bernard@entreprise.fr', permission: 'lecture', lastAccess: '2025-11-15' },
      { id: '4', displayName: 'Luc Petit', email: 'luc.petit@entreprise.fr', permission: 'ecriture', lastAccess: '2025-11-16' },
    ],
  },
  {
    id: '3',
    name: 'Projets',
    path: '/Partage/Projets',
    users: [
      { id: '5', displayName: 'Emma Leroy', email: 'emma.leroy@entreprise.fr', permission: 'acces_complet', lastAccess: '2025-11-18' },
    ],
  },
];

const permissionLabels: Record<PermissionLevel, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  lecture: { label: 'Lecture', variant: 'secondary' },
  ecriture: { label: 'Écriture', variant: 'default' },
  acces_complet: { label: 'Accès complet', variant: 'destructive' },
};

export default function SharePointPermissions() {
  const { addNotification } = useNotifications();
  const [folders, setFolders] = useState<SharePointFolder[]>(mockFolders);
  const [activeFolder, setActiveFolder] = useState<string>(mockFolders[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SharePointUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPermission, setNewUserPermission] = useState<PermissionLevel>('lecture');

  const currentFolder = folders.find(f => f.id === activeFolder);
  const users = currentFolder?.users || [];

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
    if (selectedUser && currentFolder) {
      setFolders(folders.map((folder) => 
        folder.id === activeFolder
          ? { ...folder, users: folder.users.map((u) => (u.id === selectedUser.id ? { ...u, permission } : u)) }
          : folder
      ));
      toast({
        title: 'Permissions mises à jour',
        description: `Les droits de ${selectedUser.displayName} ont été modifiés pour ${currentFolder.name}.`,
      });
      addNotification({
        type: 'success',
        title: 'Permissions modifiées',
        message: `Droits de ${selectedUser.displayName} mis à jour sur ${currentFolder.name}`,
        actionUrl: '/sharepoint'
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleRemoveUser = (userId: string) => {
    if (currentFolder) {
      const user = users.find((u) => u.id === userId);
      setFolders(folders.map((folder) => 
        folder.id === activeFolder
          ? { ...folder, users: folder.users.filter((u) => u.id !== userId) }
          : folder
      ));
      toast({
        title: 'Utilisateur retiré',
        description: `${user?.displayName} n'a plus accès à ${currentFolder.name}.`,
      });
      addNotification({
        type: 'warning',
        title: 'Accès révoqué',
        message: `${user?.displayName} retiré de ${currentFolder.name}`,
        actionUrl: '/sharepoint'
      });
    }
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

    if (!currentFolder) return;

    const newUser: SharePointUser = {
      id: `new-${Date.now()}`,
      displayName: newUserEmail.split('@')[0],
      email: newUserEmail,
      permission: newUserPermission,
    };

    setFolders(folders.map((folder) => 
      folder.id === activeFolder
        ? { ...folder, users: [...folder.users, newUser] }
        : folder
    ));
    toast({
      title: 'Utilisateur ajouté',
      description: `${newUser.email} a été ajouté à ${currentFolder.name} avec les droits ${permissionLabels[newUserPermission].label}.`,
    });
    addNotification({
      type: 'success',
      title: 'Utilisateur ajouté',
      message: `${newUser.email} ajouté à ${currentFolder.name}`,
      actionUrl: '/sharepoint'
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
              <CardTitle>Dossiers partagés</CardTitle>
              <CardDescription>Gérez les accès aux dossiers SharePoint</CardDescription>
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
                  <DialogDescription>Ajoutez un nouveau compte au dossier {currentFolder?.name}</DialogDescription>
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
                        <SelectItem value="ecriture">Écriture</SelectItem>
                        <SelectItem value="acces_complet">Accès complet</SelectItem>
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
          <Tabs value={activeFolder} onValueChange={setActiveFolder}>
            <TabsList className="w-full justify-start">
              {folders.map((folder) => (
                <TabsTrigger key={folder.id} value={folder.id}>
                  <Folder className="h-4 w-4 mr-2" />
                  {folder.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {folders.map((folder) => (
              <TabsContent key={folder.id} value={folder.id} className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Chemin:</span>
                  <code className="bg-muted px-2 py-1 rounded">{folder.path}</code>
                </div>

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
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Aucun utilisateur trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
                        <SelectItem value="ecriture">Écriture</SelectItem>
                        <SelectItem value="acces_complet">Accès complet</SelectItem>
                      </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
