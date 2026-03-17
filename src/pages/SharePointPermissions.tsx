import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserPlus, Pencil, Trash2, Folder, ChevronRight, Users, Lock, Eye, Edit3, ShieldCheck, MoreHorizontal, Home, Globe, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

type PermissionLevel = 'lecture' | 'ecriture' | 'acces_complet';

interface SharePointUser {
  id: string;
  displayName: string;
  email: string;
  permission: PermissionLevel;
  lastAccess?: string;
  avatar?: string;
}

interface SharePointFolder {
  id: string;
  name: string;
  path: string;
  users: SharePointUser[];
  icon?: string;
  itemCount?: number;
  lastModified?: string;
}

const mockFolders: SharePointFolder[] = [
  {
    id: '1',
    name: 'Documents RH',
    path: '/sites/entreprise/Documents partages/RH',
    itemCount: 47,
    lastModified: '2025-11-18',
    users: [
      { id: '1', displayName: 'Marie Dubois', email: 'marie.dubois@entreprise.fr', permission: 'acces_complet', lastAccess: '2025-11-18' },
      { id: '2', displayName: 'Jean Martin', email: 'jean.martin@entreprise.fr', permission: 'ecriture', lastAccess: '2025-11-17' },
    ],
  },
  {
    id: '2',
    name: 'Comptabilité',
    path: '/sites/entreprise/Documents partages/Comptabilite',
    itemCount: 123,
    lastModified: '2025-11-16',
    users: [
      { id: '3', displayName: 'Sophie Bernard', email: 'sophie.bernard@entreprise.fr', permission: 'lecture', lastAccess: '2025-11-15' },
      { id: '4', displayName: 'Luc Petit', email: 'luc.petit@entreprise.fr', permission: 'ecriture', lastAccess: '2025-11-16' },
    ],
  },
  {
    id: '3',
    name: 'Projets',
    path: '/sites/entreprise/Documents partages/Projets',
    itemCount: 89,
    lastModified: '2025-11-18',
    users: [
      { id: '5', displayName: 'Emma Leroy', email: 'emma.leroy@entreprise.fr', permission: 'acces_complet', lastAccess: '2025-11-18' },
    ],
  },
  {
    id: '4',
    name: 'Marketing',
    path: '/sites/entreprise/Documents partages/Marketing',
    itemCount: 34,
    lastModified: '2025-11-14',
    users: [
      { id: '2', displayName: 'Jean Martin', email: 'jean.martin@entreprise.fr', permission: 'lecture', lastAccess: '2025-11-12' },
    ],
  },
];

const permissionConfig: Record<PermissionLevel, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  lecture: { label: 'Peut afficher', icon: <Eye className="h-3.5 w-3.5" />, color: 'text-muted-foreground', description: 'Lecture seule' },
  ecriture: { label: 'Peut modifier', icon: <Edit3 className="h-3.5 w-3.5" />, color: 'text-primary', description: 'Lecture et écriture' },
  acces_complet: { label: 'Contrôle total', icon: <ShieldCheck className="h-3.5 w-3.5" />, color: 'text-destructive', description: 'Accès complet' },
};

function UserInitials({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = [
    'bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div className={`h-8 w-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
      {initials}
    </div>
  );
}

export default function SharePointPermissions() {
  const { addNotification } = useNotifications();
  const [folders, setFolders] = useState<SharePointFolder[]>(mockFolders);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
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
      toast({ title: 'Permissions mises à jour', description: `Les droits de ${selectedUser.displayName} ont été modifiés.` });
      addNotification({ type: 'success', title: 'Permissions modifiées', message: `Droits de ${selectedUser.displayName} mis à jour sur ${currentFolder.name}`, actionUrl: '/sharepoint' });
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
      toast({ title: 'Accès révoqué', description: `${user?.displayName} n'a plus accès à ${currentFolder.name}.` });
      addNotification({ type: 'warning', title: 'Accès révoqué', message: `${user?.displayName} retiré de ${currentFolder.name}`, actionUrl: '/sharepoint' });
    }
  };

  const handleAddUser = () => {
    if (!newUserEmail || !currentFolder) {
      toast({ title: 'Erreur', description: 'Veuillez entrer une adresse email.', variant: 'destructive' });
      return;
    }
    const newUser: SharePointUser = {
      id: `new-${Date.now()}`,
      displayName: newUserEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: newUserEmail,
      permission: newUserPermission,
    };
    setFolders(folders.map((folder) =>
      folder.id === activeFolder ? { ...folder, users: [...folder.users, newUser] } : folder
    ));
    toast({ title: 'Utilisateur ajouté', description: `${newUser.email} a été ajouté à ${currentFolder.name}.` });
    addNotification({ type: 'success', title: 'Utilisateur ajouté', message: `${newUser.email} ajouté à ${currentFolder.name}`, actionUrl: '/sharepoint' });
    setIsAddDialogOpen(false);
    setNewUserEmail('');
    setNewUserPermission('lecture');
  };

  return (
    <div className="space-y-0">
      {/* SharePoint-style top bar */}
      <div className="bg-[hsl(215,28%,14%)] text-white px-6 py-3 -mx-6 -mt-6 mb-0 flex items-center gap-3">
        <Globe className="h-5 w-5 text-blue-400" />
        <span className="font-semibold text-sm">SharePoint</span>
        <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        <span className="text-sm text-white/70">Entreprise</span>
        <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        <span className="text-sm text-white/70">Documents partagés</span>
        {currentFolder && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            <span className="text-sm text-white/90">{currentFolder.name}</span>
          </>
        )}
      </div>

      {/* Command bar */}
      <div className="bg-card border-b border-border px-6 py-2.5 -mx-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground hover:text-foreground" onClick={() => setActiveFolder(null)}>
              <Home className="h-3.5 w-3.5" />
              Retour
            </Button>
          )}
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Gérer l'accès
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-56 text-xs bg-muted/50 border-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 -mx-6 px-6">
        <AnimatePresence mode="wait">
          {!activeFolder ? (
            /* Folder grid view */
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Documents partagés</h2>
                <span className="text-xs text-muted-foreground">{folders.length} dossiers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id)}
                    className="group text-left bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                        <Folder className="h-6 w-6 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">{folder.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{folder.itemCount} éléments</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{folder.users.length} accès</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {folder.lastModified && new Date(folder.lastModified).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Folder detail / permissions panel */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Folder header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-500/10">
                    <Folder className="h-7 w-7 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{currentFolder?.name}</h2>
                    <p className="text-xs text-muted-foreground font-mono">{currentFolder?.path}</p>
                  </div>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 text-xs">
                      <UserPlus className="h-3.5 w-3.5" />
                      Accorder l'accès
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Accorder l'accès</DialogTitle>
                      <DialogDescription>Ajouter un utilisateur à « {currentFolder?.name} »</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-medium">Nom ou adresse e-mail</Label>
                        <Input id="email" type="email" placeholder="utilisateur@entreprise.fr" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="permission" className="text-xs font-medium">Niveau d'autorisation</Label>
                        <Select value={newUserPermission} onValueChange={(v) => setNewUserPermission(v as PermissionLevel)}>
                          <SelectTrigger id="permission"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lecture">Peut afficher</SelectItem>
                            <SelectItem value="ecriture">Peut modifier</SelectItem>
                            <SelectItem value="acces_complet">Contrôle total</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                      <Button onClick={handleAddUser}>Accorder</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Info bar */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500/5 border border-blue-500/10 text-xs text-blue-600 dark:text-blue-400">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>{currentFolder?.users.length} personne(s) ont accès à ce dossier · {currentFolder?.itemCount} éléments</span>
              </div>

              {/* Users list - SharePoint style */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* List header */}
                <div className="grid grid-cols-[1fr_140px_140px_40px] gap-4 px-4 py-2.5 bg-muted/30 border-b border-border text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  <span>Nom</span>
                  <span>Autorisation</span>
                  <span>Dernier accès</span>
                  <span />
                </div>

                {/* User rows */}
                <div className="divide-y divide-border/50">
                  {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-[1fr_140px_140px_40px] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <UserInitials name={user.displayName} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`${permissionConfig[user.permission].color}`}>
                          {permissionConfig[user.permission].icon}
                        </span>
                        <span className="text-xs text-foreground">{permissionConfig[user.permission].label}</span>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {user.lastAccess ? new Date(user.lastAccess).toLocaleDateString('fr-FR') : '—'}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEditPermission(user)} className="gap-2 text-xs">
                            <Pencil className="h-3.5 w-3.5" /> Modifier les autorisations
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveUser(user.id)} className="gap-2 text-xs text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer l'accès
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  )) : (
                    <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Aucun utilisateur trouvé
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les autorisations</DialogTitle>
            <DialogDescription>Changer le niveau d'accès de {selectedUser?.displayName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {(Object.entries(permissionConfig) as [PermissionLevel, typeof permissionConfig[PermissionLevel]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleSavePermission(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                  selectedUser?.permission === key
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }`}
              >
                <span className={config.color}>{config.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
