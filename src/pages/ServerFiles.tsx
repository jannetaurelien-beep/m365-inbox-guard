import { useState } from 'react';
import { Folder, Users, Lock, Unlock, MoreVertical, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type Permission = 'read' | 'write' | 'full';

interface UserPermission {
  userId: string;
  userName: string;
  userEmail: string;
  permission: Permission;
}

interface ServerFolder {
  id: string;
  name: string;
  path: string;
  size: string;
  permissions: UserPermission[];
}

const mockFolders: ServerFolder[] = [
  {
    id: '1',
    name: 'Documents Comptabilité',
    path: '/srv/comptabilite',
    size: '2.4 Go',
    permissions: [
      { userId: '1', userName: 'Jean Dupont', userEmail: 'jean.dupont@company.com', permission: 'full' },
      { userId: '2', userName: 'Marie Martin', userEmail: 'marie.martin@company.com', permission: 'read' },
    ],
  },
  {
    id: '2',
    name: 'Ressources Humaines',
    path: '/srv/rh',
    size: '1.8 Go',
    permissions: [
      { userId: '3', userName: 'Pierre Leroy', userEmail: 'pierre.leroy@company.com', permission: 'full' },
      { userId: '4', userName: 'Sophie Bernard', userEmail: 'sophie.bernard@company.com', permission: 'write' },
    ],
  },
  {
    id: '3',
    name: 'Projets Clients',
    path: '/srv/projets',
    size: '5.2 Go',
    permissions: [
      { userId: '1', userName: 'Jean Dupont', userEmail: 'jean.dupont@company.com', permission: 'write' },
      { userId: '5', userName: 'Lucas Petit', userEmail: 'lucas.petit@company.com', permission: 'read' },
    ],
  },
  {
    id: '4',
    name: 'Archives 2024',
    path: '/srv/archives/2024',
    size: '8.7 Go',
    permissions: [
      { userId: '2', userName: 'Marie Martin', userEmail: 'marie.martin@company.com', permission: 'read' },
    ],
  },
];

const permissionLabels: Record<Permission, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  read: { label: 'Lecture', variant: 'secondary' },
  write: { label: 'Écriture', variant: 'default' },
  full: { label: 'Contrôle total', variant: 'outline' },
};

export default function ServerFiles() {
  const [folders, setFolders] = useState<ServerFolder[]>(mockFolders);
  const [selectedFolder, setSelectedFolder] = useState<ServerFolder | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const handlePermissionChange = (folderId: string, userId: string, newPermission: Permission) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          permissions: folder.permissions.map(perm =>
            perm.userId === userId ? { ...perm, permission: newPermission } : perm
          ),
        };
      }
      return folder;
    }));
    toast.success('Permissions mises à jour');
  };

  const handleRemovePermission = (folderId: string, userId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          permissions: folder.permissions.filter(perm => perm.userId !== userId),
        };
      }
      return folder;
    }));
    toast.success('Utilisateur retiré du dossier');
  };

  const openPermissionDialog = (folder: ServerFolder) => {
    setSelectedFolder(folder);
    setIsPermissionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fichiers Serveur</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les dossiers partagés et les permissions des utilisateurs
          </p>
        </div>
        <Button>
          <Folder className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>
      </div>

      <div className="grid gap-6">
        {folders.map((folder) => (
          <Card key={folder.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{folder.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{folder.size}</Badge>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {folder.permissions.length} utilisateur{folder.permissions.length > 1 ? 's' : ''}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPermissionDialog(folder)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Gérer les accès
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {folder.permissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Aucun utilisateur n'a accès à ce dossier
                      </TableCell>
                    </TableRow>
                  ) : (
                    folder.permissions.map((perm) => (
                      <TableRow key={perm.userId}>
                        <TableCell className="font-medium">{perm.userName}</TableCell>
                        <TableCell className="text-muted-foreground">{perm.userEmail}</TableCell>
                        <TableCell>
                          <Select
                            value={perm.permission}
                            onValueChange={(value) => handlePermissionChange(folder.id, perm.userId, value as Permission)}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="read">
                                <div className="flex items-center gap-2">
                                  <Lock className="h-3 w-3" />
                                  Lecture seule
                                </div>
                              </SelectItem>
                              <SelectItem value="write">
                                <div className="flex items-center gap-2">
                                  <Unlock className="h-3 w-3" />
                                  Écriture
                                </div>
                              </SelectItem>
                              <SelectItem value="full">
                                <div className="flex items-center gap-2">
                                  <Users className="h-3 w-3" />
                                  Contrôle total
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemovePermission(folder.id, perm.userId)}
                              >
                                Retirer l'accès
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Sélectionnez un utilisateur et définissez ses permissions pour le dossier "{selectedFolder?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Utilisateur</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Jean Dupont - jean.dupont@company.com</SelectItem>
                  <SelectItem value="2">Marie Martin - marie.martin@company.com</SelectItem>
                  <SelectItem value="3">Pierre Leroy - pierre.leroy@company.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Permission</label>
              <Select defaultValue="read">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Lecture seule</SelectItem>
                  <SelectItem value="write">Écriture</SelectItem>
                  <SelectItem value="full">Contrôle total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                toast.success('Utilisateur ajouté avec succès');
                setIsPermissionDialogOpen(false);
              }}>
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
