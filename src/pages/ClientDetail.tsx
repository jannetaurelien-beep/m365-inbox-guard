import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Building2, MapPin, Mail, Phone, Globe, Users as UsersIcon, CreditCard,
  TrendingUp, Briefcase, Edit, Star, MoreVertical, Plus, Monitor, Laptop, Smartphone,
  Server, Network, FileText, Calendar, Activity, Shield, MessageSquare, Paperclip,
  CheckCircle2, AlertTriangle, Clock, ChevronRight, Trash2, Download, Search,
  HardDrive, Wifi, Printer, Cpu, FolderOpen, Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockClients, Client } from '@/lib/mock-data/clients';
import { toast } from 'sonner';

interface Agence {
  id: string;
  nom: string;
  ville: string;
  adresse: string;
  codePostal: string;
  utilisateurs: number;
  responsable: string;
  telephone: string;
}

interface AppareilParc {
  id: string;
  nom: string;
  type: 'laptop' | 'desktop' | 'mobile' | 'server' | 'printer' | 'network';
  utilisateur?: string;
  os: string;
  modele: string;
  numeroSerie: string;
  status: 'actif' | 'maintenance' | 'hors-service';
  dernierVu: string;
}

const initialAgences: Record<string, Agence[]> = {
  c1: [
    { id: 'a1', nom: 'Siège Paris', ville: 'Paris', adresse: '12 rue de la République', codePostal: '75001', utilisateurs: 78, responsable: 'Marie Dubois', telephone: '+33 1 42 86 00 00' },
    { id: 'a2', nom: 'Agence Lyon', ville: 'Lyon', adresse: '5 cours Vitton', codePostal: '69006', utilisateurs: 42, responsable: 'Thomas Bernard', telephone: '+33 4 72 14 00 00' },
    { id: 'a3', nom: 'Agence Marseille', ville: 'Marseille', adresse: '88 La Canebière', codePostal: '13001', utilisateurs: 22, responsable: 'Sarah Martin', telephone: '+33 4 91 13 00 00' },
  ],
};

const utilisateursClient = [
  { id: 'u1', nom: 'Marie Dubois', email: 'm.dubois@acme.fr', role: 'DSI', agence: 'Paris', status: 'active', licence: 'E5' },
  { id: 'u2', nom: 'Thomas Bernard', email: 't.bernard@acme.fr', role: 'Resp. agence', agence: 'Lyon', status: 'active', licence: 'E3' },
  { id: 'u3', nom: 'Sophie Lemoine', email: 's.lemoine@acme.fr', role: 'Comptable', agence: 'Paris', status: 'active', licence: 'E3' },
  { id: 'u4', nom: 'Pierre Roux', email: 'p.roux@acme.fr', role: 'Commercial', agence: 'Marseille', status: 'active', licence: 'E3' },
  { id: 'u5', nom: 'Julie Garnier', email: 'j.garnier@acme.fr', role: 'RH', agence: 'Paris', status: 'inactive', licence: 'E1' },
];

const parcInformatique: AppareilParc[] = [
  { id: 'd1', nom: 'PC-MARIE-01', type: 'laptop', utilisateur: 'Marie Dubois', os: 'Windows 11 Pro', modele: 'Dell XPS 15', numeroSerie: 'SN-DXP15-001', status: 'actif', dernierVu: 'il y a 2 min' },
  { id: 'd2', nom: 'PC-THOMAS-02', type: 'laptop', utilisateur: 'Thomas Bernard', os: 'Windows 11 Pro', modele: 'HP EliteBook', numeroSerie: 'SN-HP-EB-042', status: 'actif', dernierVu: 'il y a 12 min' },
  { id: 'd3', nom: 'SERVER-AD-01', type: 'server', os: 'Windows Server 2022', modele: 'Dell PowerEdge R750', numeroSerie: 'SN-PER-750-A', status: 'actif', dernierVu: 'en ligne' },
  { id: 'd4', nom: 'NAS-FILES-01', type: 'server', os: 'Synology DSM 7', modele: 'Synology RS1221+', numeroSerie: 'SN-RS1221-X', status: 'actif', dernierVu: 'en ligne' },
  { id: 'd5', nom: 'IPHONE-SOPHIE', type: 'mobile', utilisateur: 'Sophie Lemoine', os: 'iOS 17', modele: 'iPhone 15', numeroSerie: 'SN-IP15-008', status: 'actif', dernierVu: 'il y a 1h' },
  { id: 'd6', nom: 'PRINTER-PARIS-01', type: 'printer', os: '—', modele: 'HP LaserJet Pro', numeroSerie: 'SN-HPLJ-211', status: 'maintenance', dernierVu: 'il y a 3h' },
  { id: 'd7', nom: 'SWITCH-CORE-01', type: 'network', os: 'Cisco IOS', modele: 'Cisco Catalyst 9300', numeroSerie: 'SN-C9300-A', status: 'actif', dernierVu: 'en ligne' },
];

const ficherClient = [
  { id: 'f1', nom: 'Contrat-cadre-2024.pdf', taille: '1.2 Mo', date: '12/03/2024', type: 'Contrat' },
  { id: 'f2', nom: 'Audit-securite-Q1.docx', taille: '845 Ko', date: '02/04/2026', type: 'Audit' },
  { id: 'f3', nom: 'Inventaire-parc.xlsx', taille: '2.4 Mo', date: '18/04/2026', type: 'Inventaire' },
  { id: 'f4', nom: 'Plan-migration-365.pdf', taille: '3.1 Mo', date: '21/04/2026', type: 'Projet' },
];

const activites = [
  { id: 'ac1', icon: CheckCircle2, color: 'text-emerald-500', titre: 'Migration Exchange terminée', date: 'Il y a 2 jours', user: 'Système' },
  { id: 'ac2', icon: Plus, color: 'text-blue-500', titre: '5 nouveaux utilisateurs créés', date: 'Il y a 4 jours', user: 'Marie D.' },
  { id: 'ac3', icon: AlertTriangle, color: 'text-amber-500', titre: 'Quota stockage à 85%', date: 'Il y a 5 jours', user: 'Système' },
  { id: 'ac4', icon: Shield, color: 'text-violet-500', titre: 'Audit sécurité planifié', date: 'Il y a 1 semaine', user: 'Tech support' },
  { id: 'ac5', icon: CreditCard, color: 'text-cyan-500', titre: 'Renouvellement contrat Premium', date: 'Il y a 2 semaines', user: 'Commercial' },
];

const deviceIcons: Record<AppareilParc['type'], any> = {
  laptop: Laptop, desktop: Monitor, mobile: Smartphone, server: Server, printer: Printer, network: Network,
};

const statusStyles: Record<Client['status'], string> = {
  actif: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  prospect: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  inactif: 'bg-muted text-muted-foreground border-border',
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = mockClients.find(c => c.id === id);

  const [agences, setAgences] = useState<Agence[]>(initialAgences[id || ''] || []);
  const [agenceDialog, setAgenceDialog] = useState(false);
  const [newAgence, setNewAgence] = useState<Partial<Agence>>({});
  const [searchUser, setSearchUser] = useState('');
  const [searchDevice, setSearchDevice] = useState('');

  const filteredUsers = useMemo(
    () => utilisateursClient.filter(u => u.nom.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())),
    [searchUser]
  );
  const filteredDevices = useMemo(
    () => parcInformatique.filter(d => d.nom.toLowerCase().includes(searchDevice.toLowerCase()) || (d.utilisateur || '').toLowerCase().includes(searchDevice.toLowerCase())),
    [searchDevice]
  );

  if (!client) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Client introuvable</h2>
        <Button onClick={() => navigate('/clients')} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux clients
        </Button>
      </div>
    );
  }

  const initials = client.nom.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const addAgence = () => {
    if (!newAgence.nom || !newAgence.ville) {
      toast.error('Nom et ville obligatoires');
      return;
    }
    const a: Agence = {
      id: `a-${Date.now()}`,
      nom: newAgence.nom!, ville: newAgence.ville!,
      adresse: newAgence.adresse || '', codePostal: newAgence.codePostal || '',
      utilisateurs: 0, responsable: newAgence.responsable || '—', telephone: newAgence.telephone || '—',
    };
    setAgences([...agences, a]);
    setNewAgence({});
    setAgenceDialog(false);
    toast.success(`Agence "${a.nom}" créée`);
  };

  const removeAgence = (aid: string) => {
    setAgences(agences.filter(a => a.id !== aid));
    toast.success('Agence supprimée');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/clients" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Clients
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{client.nom}</span>
      </div>

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${client.logoColor} flex items-center justify-center text-white font-bold text-2xl shadow-2xl ring-4 ring-white/20`}>
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`text-xs ${statusStyles[client.status]} border-white/20 bg-white/10 text-white`}>
                  {client.status}
                </Badge>
                <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">{client.contrat}</Badge>
                <span className="text-xs text-white/70">Client depuis {new Date(client.depuis).toLocaleDateString('fr-FR')}</span>
              </div>
              <h1 className="text-4xl font-bold">{client.nom}</h1>
              <p className="text-white/70 text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> {client.secteur}
                <span className="mx-2">·</span>
                <MapPin className="h-4 w-4" /> {client.ville}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
              <Edit className="h-4 w-4 mr-2" /> Modifier
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Star className="h-4 w-4 mr-2" /> Favori
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Exporter fiche</DropdownMenuItem>
                <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Envoyer email</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Archiver</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* KPI strip */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
          {[
            { icon: UsersIcon, label: 'Utilisateurs', value: client.utilisateurs },
            { icon: CreditCard, label: 'Licences', value: client.licences },
            { icon: Building2, label: 'Agences', value: agences.length },
            { icon: Monitor, label: 'Parc', value: parcInformatique.length },
            { icon: TrendingUp, label: 'CA / mois', value: `${(client.ca / 1000).toFixed(1)}k€` },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 mb-1">
                <s.icon className="h-3.5 w-3.5 text-white/80" />
                <span className="text-xs text-white/70">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main grid : sidebar + tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Coordonnées
            </h3>
            <div className="space-y-3 text-sm">
              <InfoRow icon={MapPin} label="Adresse">
                {client.adresse}<br />
                <span className="text-muted-foreground">{client.codePostal} {client.ville}, {client.pays}</span>
              </InfoRow>
              <InfoRow icon={Mail} label="Email"><a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a></InfoRow>
              <InfoRow icon={Phone} label="Téléphone">{client.telephone}</InfoRow>
              <InfoRow icon={Globe} label="Site web"><a href={`https://${client.siteWeb}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{client.siteWeb}</a></InfoRow>
            </div>
          </Card>

          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
            <h3 className="text-sm font-semibold mb-4">Contact principal</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">{client.contact.nom.split(' ').map(w => w[0]).join('')}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold text-sm">{client.contact.nom}</p>
                <p className="text-xs text-muted-foreground">{client.contact.role}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1"><Mail className="h-3.5 w-3.5 mr-1" />Email</Button>
              <Button size="sm" variant="outline" className="flex-1"><Phone className="h-3.5 w-3.5 mr-1" />Appeler</Button>
            </div>
          </Card>

          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
            <h3 className="text-sm font-semibold mb-3">Utilisation des licences</h3>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold">{client.utilisateurs}<span className="text-sm font-normal text-muted-foreground">/{client.licences}</span></span>
              <span className="text-xs text-muted-foreground">{Math.round((client.utilisateurs / Math.max(client.licences, 1)) * 100)}%</span>
            </div>
            <Progress value={(client.utilisateurs / Math.max(client.licences, 1)) * 100} />
            <p className="text-xs text-muted-foreground mt-3">
              {client.licences - client.utilisateurs} licence(s) disponibles
            </p>
          </Card>

          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
            <h3 className="text-sm font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {client.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"><Plus className="h-3 w-3 mr-1" />Tag</Button>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div>
          <Tabs defaultValue="agences" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
              <TabsTrigger value="agences"><Building2 className="h-4 w-4 mr-1.5" />Agences</TabsTrigger>
              <TabsTrigger value="users"><UsersIcon className="h-4 w-4 mr-1.5" />Utilisateurs</TabsTrigger>
              <TabsTrigger value="parc"><Monitor className="h-4 w-4 mr-1.5" />Parc IT</TabsTrigger>
              <TabsTrigger value="files"><FolderOpen className="h-4 w-4 mr-1.5" />Fichiers</TabsTrigger>
              <TabsTrigger value="activity"><Activity className="h-4 w-4 mr-1.5" />Activité</TabsTrigger>
              <TabsTrigger value="contracts"><FileText className="h-4 w-4 mr-1.5" />Contrats</TabsTrigger>
            </TabsList>

            {/* AGENCES */}
            <TabsContent value="agences" className="space-y-4">
              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Agences de l'entreprise</h3>
                    <p className="text-sm text-muted-foreground">{agences.length} agence(s) enregistrée(s)</p>
                  </div>
                  <Dialog open={agenceDialog} onOpenChange={setAgenceDialog}>
                    <DialogTrigger asChild>
                      <Button><Plus className="h-4 w-4 mr-2" />Créer une agence</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Nouvelle agence</DialogTitle></DialogHeader>
                      <div className="grid grid-cols-2 gap-3 py-2">
                        <div className="col-span-2"><Label>Nom *</Label><Input value={newAgence.nom || ''} onChange={e => setNewAgence({ ...newAgence, nom: e.target.value })} placeholder="Agence Bordeaux" /></div>
                        <div><Label>Ville *</Label><Input value={newAgence.ville || ''} onChange={e => setNewAgence({ ...newAgence, ville: e.target.value })} placeholder="Bordeaux" /></div>
                        <div><Label>Code postal</Label><Input value={newAgence.codePostal || ''} onChange={e => setNewAgence({ ...newAgence, codePostal: e.target.value })} placeholder="33000" /></div>
                        <div className="col-span-2"><Label>Adresse</Label><Input value={newAgence.adresse || ''} onChange={e => setNewAgence({ ...newAgence, adresse: e.target.value })} placeholder="14 cours du Médoc" /></div>
                        <div><Label>Responsable</Label><Input value={newAgence.responsable || ''} onChange={e => setNewAgence({ ...newAgence, responsable: e.target.value })} /></div>
                        <div><Label>Téléphone</Label><Input value={newAgence.telephone || ''} onChange={e => setNewAgence({ ...newAgence, telephone: e.target.value })} /></div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAgenceDialog(false)}>Annuler</Button>
                        <Button onClick={addAgence}>Créer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {agences.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Aucune agence pour ce client</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {agences.map(a => (
                      <Card key={a.id} className="p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all border-border/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10"><Building2 className="h-4 w-4 text-primary" /></div>
                            <div>
                              <p className="font-semibold text-sm">{a.nom}</p>
                              <p className="text-xs text-muted-foreground">{a.codePostal} {a.ville}</p>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeAgence(a.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-3 mt-2">
                          <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{a.adresse || '—'}</p>
                          <p className="flex items-center gap-1.5"><UsersIcon className="h-3 w-3" />{a.utilisateurs} utilisateurs</p>
                          <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{a.telephone}</p>
                          <p className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" />Resp. {a.responsable}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* UTILISATEURS */}
            <TabsContent value="users" className="space-y-4">
              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">Utilisateurs du client</h3>
                    <p className="text-sm text-muted-foreground">{filteredUsers.length} utilisateur(s)</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." value={searchUser} onChange={e => setSearchUser(e.target.value)} className="pl-9" /></div>
                    <Button variant="outline" onClick={() => navigate('/utilisateurs')}><FolderOpen className="h-4 w-4 mr-2" />Voir tout</Button>
                  </div>
                </div>
                <Table>
                  <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>Rôle</TableHead><TableHead>Agence</TableHead><TableHead>Licence</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredUsers.map(u => (
                      <TableRow key={u.id} className="cursor-pointer hover:bg-muted/40" onClick={() => navigate(`/utilisateurs/${u.id}`)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">{u.nom.split(' ').map(w => w[0]).join('')}</AvatarFallback></Avatar>
                            <div><p className="text-sm font-medium">{u.nom}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{u.role}</TableCell>
                        <TableCell className="text-sm">{u.agence}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{u.licence}</Badge></TableCell>
                        <TableCell><Badge className={`text-xs ${u.status === 'active' ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' : 'bg-muted text-muted-foreground'}`}>{u.status === 'active' ? 'Actif' : 'Inactif'}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* PARC IT */}
            <TabsContent value="parc" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Laptop, label: 'Postes', value: parcInformatique.filter(d => d.type === 'laptop' || d.type === 'desktop').length, color: 'from-blue-500 to-indigo-600' },
                  { icon: Server, label: 'Serveurs', value: parcInformatique.filter(d => d.type === 'server').length, color: 'from-violet-500 to-purple-600' },
                  { icon: Smartphone, label: 'Mobiles', value: parcInformatique.filter(d => d.type === 'mobile').length, color: 'from-emerald-500 to-teal-600' },
                  { icon: Network, label: 'Réseau', value: parcInformatique.filter(d => d.type === 'network' || d.type === 'printer').length, color: 'from-amber-500 to-orange-600' },
                ].map((s, i) => (
                  <Card key={i} className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}><s.icon className="h-5 w-5 text-white" /></div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">Inventaire du parc</h3>
                    <p className="text-sm text-muted-foreground">{filteredDevices.length} appareil(s)</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." value={searchDevice} onChange={e => setSearchDevice(e.target.value)} className="pl-9" /></div>
                    <Button><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
                  </div>
                </div>
                <Table>
                  <TableHeader><TableRow><TableHead>Appareil</TableHead><TableHead>Modèle / OS</TableHead><TableHead>Utilisateur</TableHead><TableHead>N° série</TableHead><TableHead>Statut</TableHead><TableHead>Dernière connexion</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredDevices.map(d => {
                      const Icon = deviceIcons[d.type];
                      return (
                        <TableRow key={d.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-md bg-muted"><Icon className="h-4 w-4 text-muted-foreground" /></div>
                              <span className="text-sm font-medium">{d.nom}</span>
                            </div>
                          </TableCell>
                          <TableCell><div className="text-sm">{d.modele}</div><div className="text-xs text-muted-foreground">{d.os}</div></TableCell>
                          <TableCell className="text-sm">{d.utilisateur || <span className="text-muted-foreground italic">—</span>}</TableCell>
                          <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{d.numeroSerie}</code></TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${
                              d.status === 'actif' ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' :
                              d.status === 'maintenance' ? 'bg-amber-500/15 text-amber-700 border-amber-500/30' :
                              'bg-destructive/15 text-destructive border-destructive/30'
                            }`}>{d.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{d.dernierVu}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* FICHIERS */}
            <TabsContent value="files" className="space-y-4">
              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Fichiers & documents</h3>
                    <p className="text-sm text-muted-foreground">{ficherClient.length} fichier(s)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/fichiers-serveur')}><HardDrive className="h-4 w-4 mr-2" />Fichiers serveur</Button>
                    <Button><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ficherClient.map(f => (
                    <Card key={f.id} className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow border-border/50">
                      <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.nom}</p>
                        <p className="text-xs text-muted-foreground">{f.taille} · {f.date} · <Badge variant="outline" className="text-[10px] py-0 px-1.5">{f.type}</Badge></p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* ACTIVITÉ */}
            <TabsContent value="activity" className="space-y-4">
              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Journal d'activité</h3>
                <div className="space-y-3">
                  {activites.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40">
                      <div className="p-2 rounded-lg bg-muted"><a.icon className={`h-4 w-4 ${a.color}`} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{a.titre}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-3 w-3" />{a.date} · par {a.user}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* CONTRATS */}
            <TabsContent value="contracts" className="space-y-4">
              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Contrat & facturation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1">Contrat actuel</p>
                    <p className="text-2xl font-bold">{client.contrat}</p>
                    <p className="text-sm text-muted-foreground mt-2">Renouvellement automatique annuel</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold">{(client.ca / 1000).toFixed(1)}k€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                    <p className="text-sm text-emerald-600 mt-2">+12% sur 6 mois</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1">Date de début</p>
                    <p className="text-2xl font-bold">{new Date(client.depuis).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1">Prochaine facture</p>
                    <p className="text-2xl font-bold">01/06/2026</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1.5 rounded-md bg-muted mt-0.5"><Icon className="h-3.5 w-3.5 text-muted-foreground" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
