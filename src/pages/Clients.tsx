import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, Building2, MapPin, Mail, Phone, Globe, Users as UsersIcon, CreditCard, TrendingUp, Briefcase, Sparkles, MoreVertical, Eye, Edit, Trash2, LayoutGrid, List, Filter, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const statusStyles: Record<Client['status'], string> = {
  actif: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  prospect: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  inactif: 'bg-muted text-muted-foreground border-border',
};

import { mockClients, Client, CONTRAT_TYPES, ContratType } from '@/lib/mock-data/clients';

const contratMap = Object.fromEntries(CONTRAT_TYPES.map(c => [c.value, c])) as Record<ContratType, typeof CONTRAT_TYPES[number]>;

function ContratBadges({ contrats, max = 3 }: { contrats: ContratType[]; max?: number }) {
  if (!contrats?.length) return <Badge variant="outline" className="text-xs text-muted-foreground">Aucun contrat</Badge>;
  const visible = contrats.slice(0, max);
  const rest = contrats.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map(c => {
        const meta = contratMap[c];
        return <Badge key={c} variant="outline" className={`text-[10px] h-5 px-1.5 ${meta.color}`}>{meta.short}</Badge>;
      })}
      {rest > 0 && <Badge variant="outline" className="text-[10px] h-5 px-1.5">+{rest}</Badge>}
    </div>
  );
}

function ClientLogo({ client, size = 'md' }: { client: Client; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-10 h-10 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' };
  const initials = client.nom.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${client.logoColor} flex items-center justify-center text-white font-bold shadow-lg shadow-black/10 ring-2 ring-white/40 dark:ring-white/10 flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function Clients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contratFilter, setContratFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => mockClients.filter(c => {
    const s = search.toLowerCase();
    const matchSearch = !s || c.nom.toLowerCase().includes(s) || c.ville.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.codePostal.includes(s);
    return matchSearch && (statusFilter === 'all' || c.status === statusFilter) && (contratFilter === 'all' || c.contrats?.includes(contratFilter as ContratType));
  }), [search, statusFilter, contratFilter]);

  const totalCa = mockClients.reduce((s, c) => s + c.ca, 0);
  const totalUsers = mockClients.reduce((s, c) => s + c.utilisateurs, 0);
  const actifs = mockClients.filter(c => c.status === 'actif').length;
  const prospects = mockClients.filter(c => c.status === 'prospect').length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
                  </span>
                  <span className="text-sm text-white/80">Portefeuille client en temps réel</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold">Mes clients</h1>
              <p className="text-white/70 text-lg">Tous vos comptes, contrats et contacts au même endroit</p>
            </div>
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau client
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: Building2, label: 'Clients', value: mockClients.length, hint: `${actifs} actifs`, color: 'text-cyan-300' },
              { icon: UsersIcon, label: 'Utilisateurs gérés', value: totalUsers, hint: 'tous comptes', color: 'text-emerald-300' },
              { icon: TrendingUp, label: 'CA mensuel', value: `${(totalCa / 1000).toFixed(1)}k€`, hint: '+12% vs M-1', color: 'text-amber-300' },
              { icon: Sparkles, label: 'Prospects', value: prospects, hint: 'à convertir', color: 'text-fuchsia-300' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className="text-sm text-white/70">{s.label}</span>
                </div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-xs text-white/60 mt-1">{s.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher par nom, ville, code postal, email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-background/50" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><Filter className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="actif">Actifs</SelectItem>
                <SelectItem value="prospect">Prospects</SelectItem>
                <SelectItem value="inactif">Inactifs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contratFilter} onValueChange={setContratFilter}>
              <SelectTrigger className="w-40"><CreditCard className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous contrats</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Essentiel">Essentiel</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-md border border-border bg-background/50 p-1">
              <Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} className="h-8 px-3"><LayoutGrid className="h-4 w-4" /></Button>
              <Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} className="h-8 px-3"><List className="h-4 w-4" /></Button>
            </div>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> client{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
      </Card>

      {/* Vue Grid */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(client => (
            <Card key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${client.logoColor}`} />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ClientLogo client={client} />
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{client.nom}</h3>
                      <p className="text-xs text-muted-foreground">{client.secteur}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Voir la fiche</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                      <DropdownMenuItem><Star className="h-4 w-4 mr-2" />Favori</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Archiver</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className={`text-xs ${statusStyles[client.status]}`}>{client.status}</Badge>
                  <Badge variant="outline" className={`text-xs ${contratStyles[client.contrat]}`}>{client.contrat}</Badge>
                  {client.tags.slice(0, 1).map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-xs leading-relaxed">{client.adresse}, {client.codePostal} {client.ville}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">{client.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">{client.siteWeb}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-lg font-bold">{client.utilisateurs}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Users</p>
                  </div>
                  <div className="text-center border-x border-border/50">
                    <p className="text-lg font-bold">{client.licences}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Licences</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{(client.ca / 1000).toFixed(1)}k€</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">CA/mois</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Vue Liste */}
      {view === 'list' && (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[280px]">Client</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Contrat</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">CA/mois</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(client => (
                <TableRow key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="group cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ClientLogo client={client} size="sm" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{client.nom}</p>
                        <p className="text-xs text-muted-foreground">{client.secteur}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{client.ville}</div>
                    <div className="text-xs text-muted-foreground">{client.codePostal} · {client.pays}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{client.contact.nom}</div>
                    <div className="text-xs text-muted-foreground">{client.contact.role}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${contratStyles[client.contrat]}`}>{client.contrat}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{client.utilisateurs}</TableCell>
                  <TableCell className="text-right font-medium">{(client.ca / 1000).toFixed(1)}k€</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusStyles[client.status]}`}>{client.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filtered.length === 0 && (
        <Card className="p-12 text-center bg-card/80 backdrop-blur-sm border-border/50">
          <div className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-600 inline-block mb-4">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucun client trouvé</h3>
          <p className="text-muted-foreground">Ajustez vos filtres ou ajoutez un nouveau client</p>
        </Card>
      )}
    </div>
  );
}
