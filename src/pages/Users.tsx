import { useState } from 'react';
import { Search, Filter, Download, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Progress } from '@/components/ui/progress';

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgence, setFilterAgence] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterAgence} onValueChange={setFilterAgence}>
            <SelectTrigger className="w-full md:w-48">
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
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="nominative">Nominative</SelectItem>
              <SelectItem value="partagee">Partagée</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  const storagePercent = (user.stockage.utiliseGo / user.stockage.quotaGo) * 100;

  return (
    <Card className="p-6 shadow-card hover:shadow-card-hover transition-smooth">
      <div className="flex items-start gap-4">
        <img
          src={user.avatarUrl}
          alt={`${user.prenom} ${user.nom}`}
          className="w-16 h-16 rounded-xl object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold">
                  {user.prenom} {user.nom}
                </h3>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
                <Badge variant="outline">
                  {user.typeBoite === 'nominative' ? 'Nominative' : 'Partagée'}
                </Badge>
              </div>
              
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <span className="font-medium">{user.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Métier:</span>{' '}
                  <span className="font-medium">{user.metier}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Agence:</span>{' '}
                  <span className="font-medium">{user.agence}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Licence:</span>{' '}
                  <span className="font-medium">{user.licence.label}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Stockage</span>
                  <span className="font-medium">
                    {user.stockage.utiliseGo} Go / {user.stockage.quotaGo} Go
                  </span>
                </div>
                <Progress value={storagePercent} className="h-2" />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Voir la fiche</DropdownMenuItem>
                <DropdownMenuItem>Modifier</DropdownMenuItem>
                <DropdownMenuItem>Changer licence</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Désactiver
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
