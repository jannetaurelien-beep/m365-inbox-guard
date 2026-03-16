import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, MoreVertical, Plus, Users as UsersIcon, Mail, Building2, Shield, TrendingUp, Sparkles, Eye, Edit, RefreshCw, UserX, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockUsers, User } from '@/lib/mock-data';
import { exportService } from '@/lib/services';

// Couleurs pour les avatars
const avatarColors = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

export default function Users() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgence, setFilterAgence] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAgence = filterAgence === 'all' || user.agence === filterAgence;
    const matchesType = filterType === 'all' || user.typeBoite === filterType;

    return matchesSearch && matchesAgence && matchesType;
  });

  const agences = Array.from(new Set(mockUsers.map(u => u.agence)));
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const sharedMailboxes = mockUsers.filter(u => u.typeBoite === 'partagee').length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header futuriste */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                  </span>
                  <span className="text-sm text-white/80">Synchronisé avec Microsoft 365</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold">Utilisateurs</h1>
              <p className="text-white/70 text-lg">Gestion des comptes et boîtes mail</p>
            </div>
            
            <Button 
              onClick={() => navigate('/creer-utilisateur')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
          
          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <UsersIcon className="h-4 w-4 text-cyan-300" />
                <span className="text-sm text-white/70">Total</span>
              </div>
              <p className="text-3xl font-bold">{mockUsers.length}</p>
              <div className="flex items-center gap-1 mt-1 text-emerald-300 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>+5 ce mois</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-300" />
                <span className="text-sm text-white/70">Actifs</span>
              </div>
              <p className="text-3xl font-bold">{activeUsers}</p>
              <div className="flex items-center gap-1 mt-1 text-white/60 text-xs">
                <Sparkles className="h-3 w-3" />
                <span>{Math.round((activeUsers / mockUsers.length) * 100)}% du total</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-amber-300" />
                <span className="text-sm text-white/70">Boîtes partagées</span>
              </div>
              <p className="text-3xl font-bold">{sharedMailboxes}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-rose-300" />
                <span className="text-sm text-white/70">Agences</span>
              </div>
              <p className="text-3xl font-bold">{agences.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, UPN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={filterAgence} onValueChange={setFilterAgence}>
              <SelectTrigger className="w-44">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Agence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les agences</SelectItem>
                {agences.map(agence => (
                  <SelectItem key={agence} value={agence}>{agence}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-44">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="nominative">Nominative</SelectItem>
                <SelectItem value="partagee">Partagée</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => exportService.exportUsersToCSV(filteredUsers)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        
        {/* Résultats et filtres actifs */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredUsers.length}</span> utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            {filterAgence !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {filterAgence}
                <button onClick={() => setFilterAgence('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {filterType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {filterType === 'nominative' ? 'Nominative' : 'Partagée'}
                <button onClick={() => setFilterType('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Table des utilisateurs */}
      {filteredUsers.length > 0 ? (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[280px]">Utilisateur</TableHead>
                <TableHead>Métier</TableHead>
                <TableHead>Agence</TableHead>
                <TableHead>Licence</TableHead>
                <TableHead>Stockage</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <UserRow key={user.id} user={user} colorIndex={index} />
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="p-12 text-center bg-card/80 backdrop-blur-sm border-border/50">
          <div className="p-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 inline-block mb-4">
            <UsersIcon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-muted-foreground">Modifiez vos critères de recherche ou créez un nouvel utilisateur</p>
        </Card>
      )}
    </div>
  );
}

function UserRow({ user, colorIndex }: { user: User; colorIndex: number }) {
  const navigate = useNavigate();
  const storagePercent = (user.stockage.utiliseGo / user.stockage.quotaGo) * 100;
  const avatarColor = avatarColors[colorIndex % avatarColors.length];

  const getStorageColor = () => {
    if (storagePercent >= 90) return 'bg-destructive';
    if (storagePercent >= 70) return 'bg-chart-4';
    return 'bg-primary';
  };

  return (
    <TableRow
      className="group cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={() => navigate(`/utilisateurs/${user.id}`)}
    >
      {/* Avatar + Nom + Email */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
              {user.prenom.charAt(0)}{user.nom.charAt(0)}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`}></div>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </TableCell>

      {/* Métier */}
      <TableCell>
        <span className="text-sm text-muted-foreground">{user.metier}</span>
      </TableCell>

      {/* Agence */}
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-sm">{user.agence}</span>
        </div>
      </TableCell>

      {/* Licence */}
      <TableCell>
        <Badge variant="outline" className="font-normal text-xs">
          {user.licence.label.replace('Microsoft 365 ', '')}
        </Badge>
      </TableCell>

      {/* Stockage */}
      <TableCell>
        <div className="w-28">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{user.stockage.utiliseGo} Go</span>
            <span className="text-muted-foreground/60">/ {user.stockage.quotaGo}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${getStorageColor()} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(storagePercent, 100)}%` }}
            ></div>
          </div>
        </div>
      </TableCell>

      {/* Statut + Type */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge
            variant={user.status === 'active' ? 'default' : 'secondary'}
            className={`text-xs ${user.status === 'active' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' : ''}`}
          >
            {user.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
          {user.typeBoite === 'partagee' && (
            <Badge variant="outline" className="text-xs border-accent text-accent-foreground/70">
              Partagée
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate(`/utilisateurs/${user.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                Voir la fiche
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Changer licence
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <UserX className="h-4 w-4 mr-2" />
                Désactiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </TableCell>
    </TableRow>
  );
}
