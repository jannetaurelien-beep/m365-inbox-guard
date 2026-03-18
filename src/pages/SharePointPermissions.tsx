import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserPlus, Pencil, Trash2, Folder, ChevronRight, ChevronDown, Users, Lock, Eye, Edit3, ShieldCheck, MoreHorizontal, Globe, Info, Shield, Link2, AlertTriangle, HardDrive, RefreshCw, Download, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ──
type PermissionLevel = 'proprietaire' | 'membre' | 'visiteur';

interface SharePointUser {
  id: string;
  displayName: string;
  email: string;
  permission: PermissionLevel;
  lastAccess?: string;
  groups?: string[];
}

interface SharePointSite {
  name: string;
  url: string;
  library: string;
}

interface SharingLink {
  id: string;
  name: string;
  sharedBy: string;
  sharedWith: string;
  type: 'direct' | 'lien';
  permission: PermissionLevel;
}

// ── Mock Data ──
const siteInfo: SharePointSite = {
  name: 'Sharepoint-Aradoc',
  url: 'sharepoint-aradoc',
  library: 'spartion',
};

const mockUsers: SharePointUser[] = [
  { id: '1', displayName: 'Propriétaire de Sharepoint-Aradoc', email: 'proprietaire@entreprise.fr', permission: 'proprietaire', lastAccess: '2025-11-18', groups: ['Propriétaires', 'Membres'] },
  { id: '2', displayName: 'Jean Martin', email: 'jean.martin@entreprise.fr', permission: 'membre', lastAccess: '2025-11-17', groups: ['Membres'] },
  { id: '3', displayName: 'Sophie Bernard', email: 'sophie.bernard@entreprise.fr', permission: 'visiteur', lastAccess: '2025-11-15', groups: ['Visiteurs'] },
  { id: '4', displayName: 'Emma Leroy', email: 'emma.leroy@entreprise.fr', permission: 'membre', lastAccess: '2025-11-16', groups: ['Membres'] },
];

const mockSharingLinks: SharingLink[] = [
  { id: '1', name: 'Propriétaire de Sharepoint-Aradoc', sharedBy: 'Propriétaire de Sharepoint-Aradoc', sharedWith: 'Groupe', type: 'direct', permission: 'proprietaire' },
  { id: '2', name: 'Sharepoint-Aradoc – Visiteurs', sharedBy: 'Système', sharedWith: 'Groupe', type: 'direct', permission: 'visiteur' },
  { id: '3', name: 'Sharepoint-Aradoc – Membres', sharedBy: 'Système', sharedWith: 'Groupe', type: 'direct', permission: 'membre' },
];

const permissionConfig: Record<PermissionLevel, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  proprietaire: { label: 'Propriétaire', icon: <ShieldCheck className="h-3 w-3" />, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  membre: { label: 'Membre', icon: <Edit3 className="h-3 w-3" />, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  visiteur: { label: 'Visiteur', icon: <Eye className="h-3 w-3" />, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
};

// ── Sub-components ──
function UserInitials({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div className={`h-8 w-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
      {initials}
    </div>
  );
}

function KPICard({ title, value, subtitle, icon, variant = 'default' }: {
  title: string; value: string | number; subtitle: string; icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  const variantStyles: Record<string, string> = {
    default: 'from-primary/10 to-primary/5 border-primary/20',
    success: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    warning: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
    danger: 'from-rose-500/10 to-rose-500/5 border-rose-500/20',
    info: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
    neutral: 'from-muted to-muted/50 border-border',
  };
  const iconStyles: Record<string, string> = {
    default: 'text-primary', success: 'text-emerald-500', warning: 'text-amber-500',
    danger: 'text-rose-500', info: 'text-cyan-500', neutral: 'text-muted-foreground',
  };
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${variantStyles[variant]} p-4 transition-all hover:shadow-md group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg bg-card/60 ${iconStyles[variant]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const size = 140;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {data.map((segment, i) => {
          const segmentLength = (segment.value / total) * circumference;
          const offset = (cumulative / total) * circumference;
          cumulative += segment.value;
          return (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={segment.color} strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={-offset}
              className="transition-all duration-700"
              strokeLinecap="round"
            />
          );
        })}
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          className="fill-foreground text-lg font-bold rotate-90 origin-center" style={{ fontSize: '20px' }}>
          {total}
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.label}</span>
            <span className="font-semibold text-foreground ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollapsibleSection({ title, subtitle, children, defaultOpen = true, count }: {
  title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean; count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {count !== undefined && (
              <Badge variant="secondary" className="text-[10px] h-5">{count}</Badge>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-0' : '-rotate-90'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="border-t border-border">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GroupCard({ title, users, color }: { title: string; users: SharePointUser[]; color: string }) {
  return (
    <div className={`rounded-lg border ${color} p-4 flex-1 min-w-[200px]`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      {users.length > 0 ? (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-2">
              <UserInitials name={u.displayName} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{u.displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
              </div>
              {u.permission === 'proprietaire' && (
                <Badge variant="outline" className="text-[9px] ml-auto shrink-0 border-primary/30 text-primary">Affichage</Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">Aucun profil détecté</p>
      )}
    </div>
  );
}

// ── Main Component ──
export default function SharePointPermissions() {
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState<SharePointUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'explorer' | 'access'>('overview');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPermission, setNewUserPermission] = useState<PermissionLevel>('visiteur');
  const [selectedUser, setSelectedUser] = useState<SharePointUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const proprietaires = users.filter(u => u.permission === 'proprietaire');
  const membres = users.filter(u => u.permission === 'membre');
  const visiteurs = users.filter(u => u.permission === 'visiteur');

  const filteredUsers = users.filter(u =>
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUserEmail) { toast({ title: 'Erreur', description: 'Veuillez entrer une adresse email.', variant: 'destructive' }); return; }
    const newUser: SharePointUser = {
      id: `new-${Date.now()}`, displayName: newUserEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: newUserEmail, permission: newUserPermission,
    };
    setUsers([...users, newUser]);
    toast({ title: 'Utilisateur ajouté', description: `${newUser.email} a été ajouté.` });
    addNotification({ type: 'success', title: 'Utilisateur ajouté', message: `${newUser.email} ajouté au site`, actionUrl: '/sharepoint' });
    setIsAddDialogOpen(false); setNewUserEmail(''); setNewUserPermission('visiteur');
  };

  const handleRemoveUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: 'Accès révoqué', description: `${user?.displayName} a été retiré.` });
    addNotification({ type: 'warning', title: 'Accès révoqué', message: `${user?.displayName} retiré du site`, actionUrl: '/sharepoint' });
  };

  const handleSavePermission = (permission: PermissionLevel) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, permission } : u));
      toast({ title: 'Permissions mises à jour', description: `Les droits de ${selectedUser.displayName} ont été modifiés.` });
      setIsEditDialogOpen(false); setSelectedUser(null);
    }
  };

  const donutData = [
    { label: 'Propriétaires', value: proprietaires.length, color: 'hsl(210, 100%, 45%)' },
    { label: 'Membres', value: membres.length, color: 'hsl(160, 60%, 45%)' },
    { label: 'Visiteurs', value: visiteurs.length, color: 'hsl(35, 95%, 55%)' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Vue d\'ensemble' },
    { id: 'explorer' as const, label: 'Explorateur' },
    { id: 'access' as const, label: 'Accès par utilisateur' },
  ];

  return (
    <div className="space-y-0 -mx-6 -mt-6">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(170,45%,28%)] via-[hsl(180,35%,22%)] to-[hsl(200,40%,18%)] px-8 py-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
            <Globe className="h-3.5 w-3.5" />
            <span>SharePoint</span>
          </div>
          <h1 className="text-xl font-bold">Pilotage SharePoint</h1>
          <p className="text-sm text-white/70 mt-1">Visualisez les accès, les liens de partage, les membres et l'utilisation du site</p>
          <div className="flex items-center gap-3 mt-4">
            <Button size="sm" variant="secondary" className="text-xs gap-1.5 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur">
              <RefreshCw className="h-3 w-3" /> Actualiser
            </Button>
            <Button size="sm" variant="secondary" className="text-xs gap-1.5 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur">
              <Download className="h-3 w-3" /> Télécharger les droits
            </Button>
          </div>
        </div>
      </div>

      {/* ── Site Info ── */}
      <div className="bg-card border-b border-border px-8 py-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-foreground">{siteInfo.name}</span>
          <span>·</span>
          <span>SharePoint Online</span>
          <span>·</span>
          <span>Racine (/)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Site</Label>
            <Input value={siteInfo.url} readOnly className="mt-1 h-8 text-xs bg-muted/30 border-border" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Bibliothèque</Label>
            <Input value={siteInfo.library} readOnly className="mt-1 h-8 text-xs bg-muted/30 border-border" />
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-card border-b border-border px-8">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Info Banner ── */}
      <div className="px-8 pt-5">
        <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-blue-700 dark:text-blue-400">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>Les membres, droits et les partages de ce site s'appliquent à partir de l'élément courant et de ses enfants immédiats (jusqu'à 50 éléments) issus du site SharePoint.</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-8 py-5 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <KPICard title="Utilisateurs résolus" value={users.length} subtitle="Comptes associés détectés" icon={<Users className="h-4 w-4" />} variant="default" />
                <KPICard title="Partages directs" value={mockSharingLinks.length} subtitle="Autorisations directes détectées" icon={<Link2 className="h-4 w-4" />} variant="success" />
                <KPICard title="Accès invités" value={0} subtitle="Nombre de guests sur ce site" icon={<Globe className="h-4 w-4" />} variant="info" />
                <KPICard title="Liens actifs" value={0} subtitle="Liens de partage actuels validés" icon={<Lock className="h-4 w-4" />} variant="warning" />
                <KPICard title="Alertes sécurité" value={0} subtitle="Alertes de sécurité" icon={<AlertTriangle className="h-4 w-4" />} variant="danger" />
                <KPICard title="Occupation" value="0%" subtitle="En Mo" icon={<HardDrive className="h-4 w-4" />} variant="neutral" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Donut */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Répartition des droits</h3>
                  <p className="text-xs text-muted-foreground mb-5">Aperçu, modification et contrôle total des permissions niveau site/parent</p>
                  <DonutChart data={donutData} />
                </div>

                {/* Sharing modes + storage */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">Modes de partage et capacité</h3>
                    <p className="text-xs text-muted-foreground mb-4">Répartition des modes de partage de la bibliothèque ou liste</p>
                    <div className="flex items-end gap-8 h-28">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-14 bg-[hsl(180,35%,30%)] rounded-t" style={{ height: `${Math.max(20, membres.length * 30)}px` }} />
                        <span className="text-[10px] text-muted-foreground">Hérités</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-14 bg-[hsl(180,35%,30%)] rounded-t" style={{ height: `${Math.max(10, mockSharingLinks.length * 15)}px` }} />
                        <span className="text-[10px] text-muted-foreground">Directs</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-14 bg-muted rounded-t" style={{ height: '10px' }} />
                        <span className="text-[10px] text-muted-foreground">Liens</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Occupation de la bibliothèque</span>
                      <span className="font-semibold text-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                    <p className="text-[10px] text-muted-foreground mt-1">x.xx Utilisé sur 25 620,00 Go</p>
                  </div>
                </div>
              </div>

              {/* Users + Sharing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Resolved Users */}
                <CollapsibleSection title="Utilisateurs résolus"
                  subtitle="Personnes détectées directement ou via des groupes SharePoint en RBAC de permission ouverte"
                  count={users.length}>
                  <div className="divide-y divide-border/50">
                    {filteredUsers.map((user, i) => (
                      <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group">
                        <UserInitials name={user.displayName} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">{user.displayName}</p>
                            {user.groups?.map(g => (
                              <Badge key={g} variant="outline" className={`text-[9px] h-4 ${permissionConfig[user.permission].bgColor} ${permissionConfig[user.permission].color} border`}>
                                {g}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }} className="gap-2 text-xs">
                              <Pencil className="h-3.5 w-3.5" /> Modifier les autorisations
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveUser(user.id)} className="gap-2 text-xs text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Supprimer l'accès
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    ))}
                  </div>
                </CollapsibleSection>

                {/* Active Shares */}
                <CollapsibleSection title="Partages en cours"
                  subtitle="Vue synthétique des propriétaires, membres, visiteurs, partages directs et invités au niveau courant"
                  count={mockSharingLinks.length}>
                  <div className="p-5 space-y-4">
                    {/* Role-based groups */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Attributions créées par rôle</p>
                      <div className="flex gap-3 flex-wrap">
                        <GroupCard title="Propriétaires" users={proprietaires} color="border-blue-500/20 bg-blue-500/5" />
                        <GroupCard title="Membres" users={membres} color="border-emerald-500/20 bg-emerald-500/5" />
                        <GroupCard title="Visiteurs" users={visiteurs} color="border-amber-500/20 bg-amber-500/5" />
                      </div>
                    </div>

                    {/* Direct shares */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Partages directs</p>
                      <div className="space-y-2">
                        {mockSharingLinks.map(link => (
                          <div key={link.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded bg-muted">
                                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">{link.name}</p>
                                <p className="text-[10px] text-muted-foreground">{link.sharedBy}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={`text-[9px] ${permissionConfig[link.permission].bgColor} ${permissionConfig[link.permission].color} border`}>
                              {permissionConfig[link.permission].label}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>

              {/* Shared Elements */}
              <CollapsibleSection title="Éléments actuellement partagés"
                subtitle="Enfants du dossier courant marqués comme partagés par SharePoint"
                defaultOpen={false} count={0}>
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Aucun enfant partagé détecté sur cet élément courant
                </div>
              </CollapsibleSection>
            </motion.div>
          )}

          {activeTab === 'explorer' && (
            <motion.div key="explorer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-3 text-amber-500/50" />
                <p className="font-medium text-foreground">Explorateur de dossiers</p>
                <p className="text-xs mt-1">Parcourez l'arborescence du site et inspectez les permissions par dossier</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'access' && (
            <motion.div key="access" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Rechercher un utilisateur..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-64 text-xs" />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 text-xs"><UserPlus className="h-3.5 w-3.5" /> Accorder l'accès</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Accorder l'accès</DialogTitle>
                      <DialogDescription>Ajouter un utilisateur au site SharePoint</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs">Adresse e-mail</Label>
                        <Input id="email" type="email" placeholder="utilisateur@entreprise.fr" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perm" className="text-xs">Niveau d'autorisation</Label>
                        <Select value={newUserPermission} onValueChange={v => setNewUserPermission(v as PermissionLevel)}>
                          <SelectTrigger id="perm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="proprietaire">Propriétaire</SelectItem>
                            <SelectItem value="membre">Membre</SelectItem>
                            <SelectItem value="visiteur">Visiteur</SelectItem>
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

              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-[1fr_120px_120px_120px_40px] gap-4 px-5 py-2.5 bg-muted/30 border-b border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <span>Utilisateur</span><span>Rôle</span><span>Groupes</span><span>Dernier accès</span><span />
                </div>
                <div className="divide-y divide-border/50">
                  {filteredUsers.map((user, i) => (
                    <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-[1fr_120px_120px_120px_40px] gap-4 px-5 py-3 items-center hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <UserInitials name={user.displayName} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] w-fit ${permissionConfig[user.permission].bgColor} ${permissionConfig[user.permission].color} border`}>
                        {permissionConfig[user.permission].icon}
                        <span className="ml-1">{permissionConfig[user.permission].label}</span>
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {user.groups?.map(g => (
                          <Badge key={g} variant="secondary" className="text-[9px] h-4">{g}</Badge>
                        ))}
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
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }} className="gap-2 text-xs">
                            <Pencil className="h-3.5 w-3.5" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveUser(user.id)} className="gap-2 text-xs text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Permission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les autorisations</DialogTitle>
            <DialogDescription>Changer le rôle de {selectedUser?.displayName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {(Object.entries(permissionConfig) as [PermissionLevel, typeof permissionConfig[PermissionLevel]][]).map(([key, config]) => (
              <button key={key} onClick={() => handleSavePermission(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                  selectedUser?.permission === key ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }`}>
                <span className={config.color}>{config.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{config.label}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
