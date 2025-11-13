import { useState } from 'react';
import { Folder, Users, Lock, Unlock, MoreVertical, UserPlus, UsersRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface ServerGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: UserPermission[];
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

const mockGroups: ServerGroup[] = [
  {
    id: '1',
    name: 'Équipe Comptabilité',
    description: 'Accès aux ressources financières',
    memberCount: 3,
    members: [
      { userId: '1', userName: 'Jean Dupont', userEmail: 'jean.dupont@company.com', permission: 'full' },
      { userId: '2', userName: 'Marie Martin', userEmail: 'marie.martin@company.com', permission: 'write' },
      { userId: '6', userName: 'Claire Dubois', userEmail: 'claire.dubois@company.com', permission: 'read' },
    ],
  },
  {
    id: '2',
    name: 'Direction',
    description: 'Accès administrateur complet',
    memberCount: 2,
    members: [
      { userId: '3', userName: 'Pierre Leroy', userEmail: 'pierre.leroy@company.com', permission: 'full' },
      { userId: '4', userName: 'Sophie Bernard', userEmail: 'sophie.bernard@company.com', permission: 'full' },
    ],
  },
  {
    id: '3',
    name: 'Techniciens IT',
    description: 'Support technique et maintenance',
    memberCount: 4,
    members: [
      { userId: '5', userName: 'Lucas Petit', userEmail: 'lucas.petit@company.com', permission: 'write' },
      { userId: '7', userName: 'Antoine Moreau', userEmail: 'antoine.moreau@company.com', permission: 'write' },
      { userId: '8', userName: 'Emma Laurent', userEmail: 'emma.laurent@company.com', permission: 'read' },
      { userId: '9', userName: 'Thomas Girard', userEmail: 'thomas.girard@company.com', permission: 'read' },
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
  const [groups, setGroups] = useState<ServerGroup[]>(mockGroups);
  const [selectedFolder, setSelectedFolder] = useState<ServerFolder | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ServerGroup | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'folder' | 'group'>('folder');

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

  const handleGroupPermissionChange = (groupId: string, userId: string, newPermission: Permission) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.map(member =>
            member.userId === userId ? { ...member, permission: newPermission } : member
          ),
        };
      }
      return group;
    }));
    toast.success('Permissions mises à jour');
  };

  const handleRemoveGroupMember = (groupId: string, userId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.filter(member => member.userId !== userId),
          memberCount: group.members.length - 1,
        };
      }
      return group;
    }));
    toast.success('Membre retiré du groupe');
  };

  const openPermissionDialog = (folder: ServerFolder) => {
    setSelectedFolder(folder);
    setDialogType('folder');
    setIsPermissionDialogOpen(true);
  };

  const openGroupDialog = (group: ServerGroup) => {
    setSelectedGroup(group);
    setDialogType('group');
    setIsPermissionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fichiers Serveur</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les dossiers partagés, groupes et permissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="folders" className="w-full">
        <TabsList>
          <TabsTrigger value="folders">
            <Folder className="h-4 w-4 mr-2" />
            Dossiers
          </TabsTrigger>
          <TabsTrigger value="groups">
            <UsersRound className="h-4 w-4 mr-2" />
            Groupes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="folders" className="space-y-6 mt-6">
          <div className="flex justify-end">
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
        </TabsContent>

        <TabsContent value="groups" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button>
              <UsersRound className="h-4 w-4 mr-2" />
              Nouveau groupe
            </Button>
          </div>

          <div className="grid gap-6">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <UsersRound className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGroupDialog(group)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Gérer les membres
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
                        <TableHead>Rôle</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.members.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            Aucun membre dans ce groupe
                          </TableCell>
                        </TableRow>
                      ) : (
                        group.members.map((member) => (
                          <TableRow key={member.userId}>
                            <TableCell className="font-medium">{member.userName}</TableCell>
                            <TableCell className="text-muted-foreground">{member.userEmail}</TableCell>
                            <TableCell>
                              <Select
                                value={member.permission}
                                onValueChange={(value) => handleGroupPermissionChange(group.id, member.userId, value as Permission)}
                              >
                                <SelectTrigger className="w-[160px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="read">
                                    <div className="flex items-center gap-2">
                                      <Lock className="h-3 w-3" />
                                      Membre
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="write">
                                    <div className="flex items-center gap-2">
                                      <Unlock className="h-3 w-3" />
                                      Modérateur
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="full">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-3 w-3" />
                                      Administrateur
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
                                    onClick={() => handleRemoveGroupMember(group.id, member.userId)}
                                  >
                                    Retirer du groupe
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
        </TabsContent>
      </Tabs>

      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'folder' ? 'Ajouter un utilisateur' : 'Ajouter un membre'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'folder' 
                ? `Sélectionnez un utilisateur et définissez ses permissions pour le dossier "${selectedFolder?.name}"`
                : `Sélectionnez un utilisateur à ajouter au groupe "${selectedGroup?.name}"`
              }
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
              <label className="text-sm font-medium">
                {dialogType === 'folder' ? 'Permission' : 'Rôle'}
              </label>
              <Select defaultValue="read">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dialogType === 'folder' ? (
                    <>
                      <SelectItem value="read">Lecture seule</SelectItem>
                      <SelectItem value="write">Écriture</SelectItem>
                      <SelectItem value="full">Contrôle total</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="read">Membre</SelectItem>
                      <SelectItem value="write">Modérateur</SelectItem>
                      <SelectItem value="full">Administrateur</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                toast.success(dialogType === 'folder' ? 'Utilisateur ajouté avec succès' : 'Membre ajouté avec succès');
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
