import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Building2, MapPin, Mail, Phone, Globe, Users as UsersIcon, CreditCard,
  TrendingUp, Briefcase, Edit, Star, MoreVertical, Plus, Monitor, Laptop, Smartphone,
  Server, Network, FileText, Calendar, Activity, Shield, MessageSquare, Paperclip,
  CheckCircle2, AlertTriangle, Clock, ChevronRight, Trash2, Download, Search,
  HardDrive, Wifi, Printer, Cpu, FolderOpen, Sparkles, PhoneCall, Bell, Router, Tv, Camera,
  Ticket, UserCog, Heart, Wrench, Briefcase as BriefcaseIcon, Headphones
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClients, Client } from '@/lib/mock-data/clients';
import { toast } from 'sonner';
import { enrichedParc, type EnrichedDevice } from '@/lib/mock-data/parc-details';
import { DeviceDetailSheet } from '@/components/clients/DeviceDetailSheet';


interface AgenceContact {
  nom: string;
  role: string;
  email: string;
  telephone: string;
}

interface Agence {
  id: string;
  nom: string;
  ville: string;
  adresse: string;
  codePostal: string;
  utilisateurs: number;
  responsable: string;
  telephone: string;
  contact?: AgenceContact;
}

interface Ticket {
  id: string;
  reference: string;
  sujet: string;
  agence: string;
  priorite: 'basse' | 'normale' | 'haute' | 'critique';
  status: 'ouvert' | 'en-cours' | 'resolu' | 'ferme';
  ouvertLe: string;
  fermeLe?: string;
  assignee: string;
  categorie: 'incident' | 'demande' | 'maintenance';
}

type ParcCategorie = 'serveur' | 'poste' | 'mobile' | 'telephonie' | 'alarme' | 'reseau' | 'lien-internet' | 'imprimante' | 'videosurveillance' | 'autre';

interface AppareilParc {
  id: string;
  nom: string;
  categorie: ParcCategorie;
  utilisateur?: string;
  os: string;
  modele: string;
  numeroSerie: string;
  status: 'actif' | 'maintenance' | 'hors-service';
  dernierVu: string;
  fournisseur?: string;
  contrat?: string;
  notes?: string;
}

const CATEGORIES: { value: ParcCategorie; label: string; icon: any; color: string }[] = [
  { value: 'serveur', label: 'Serveurs', icon: Server, color: 'from-violet-500 to-purple-600' },
  { value: 'poste', label: 'Postes utilisateurs', icon: Laptop, color: 'from-blue-500 to-indigo-600' },
  { value: 'mobile', label: 'Mobiles & tablettes', icon: Smartphone, color: 'from-emerald-500 to-teal-600' },
  { value: 'telephonie', label: 'Téléphonie', icon: PhoneCall, color: 'from-cyan-500 to-sky-600' },
  { value: 'alarme', label: 'Alarme & sécurité', icon: Bell, color: 'from-rose-500 to-red-600' },
  { value: 'videosurveillance', label: 'Vidéosurveillance', icon: Camera, color: 'from-fuchsia-500 to-pink-600' },
  { value: 'reseau', label: 'Réseau & switch', icon: Network, color: 'from-amber-500 to-orange-600' },
  { value: 'lien-internet', label: 'Liens internet', icon: Wifi, color: 'from-lime-500 to-emerald-600' },
  { value: 'imprimante', label: 'Impression', icon: Printer, color: 'from-slate-500 to-zinc-600' },
  { value: 'autre', label: 'Autre', icon: HardDrive, color: 'from-stone-500 to-neutral-600' },
];

const initialAgences: Record<string, Agence[]> = {
  c1: [
    { id: 'a1', nom: 'Siège Paris', ville: 'Paris', adresse: '12 rue de la République', codePostal: '75001', utilisateurs: 78, responsable: 'Marie Dubois', telephone: '+33 1 42 86 00 00',
      contact: { nom: 'Marie Dubois', role: 'DSI', email: 'm.dubois@acme.fr', telephone: '+33 1 42 86 00 12' } },
    { id: 'a2', nom: 'Agence Lyon', ville: 'Lyon', adresse: '5 cours Vitton', codePostal: '69006', utilisateurs: 42, responsable: 'Thomas Bernard', telephone: '+33 4 72 14 00 00',
      contact: { nom: 'Thomas Bernard', role: 'Resp. agence', email: 't.bernard@acme.fr', telephone: '+33 4 72 14 00 21' } },
    { id: 'a3', nom: 'Agence Marseille', ville: 'Marseille', adresse: '88 La Canebière', codePostal: '13001', utilisateurs: 22, responsable: 'Sarah Martin', telephone: '+33 4 91 13 00 00',
      contact: { nom: 'Sarah Martin', role: 'Office Manager', email: 's.martin@acme.fr', telephone: '+33 4 91 13 00 18' } },
  ],
};

const ficherClient = [
  { id: 'f1', nom: 'Contrat-cadre-2024.pdf', taille: '1.2 Mo', date: '12/03/2024', type: 'Contrat' },
  { id: 'f2', nom: 'Audit-securite-Q1.docx', taille: '845 Ko', date: '02/04/2026', type: 'Audit' },
  { id: 'f3', nom: 'Inventaire-parc.xlsx', taille: '2.4 Mo', date: '18/04/2026', type: 'Inventaire' },
  { id: 'f4', nom: 'Plan-migration-365.pdf', taille: '3.1 Mo', date: '21/04/2026', type: 'Projet' },
];

const initialTickets: Ticket[] = [
  { id: 't1', reference: 'TIC-2026-0142', sujet: 'Boîte mail bloquée — quota dépassé', agence: 'Paris', priorite: 'haute', status: 'en-cours', ouvertLe: '2026-05-13T09:14', assignee: 'Tech support N2', categorie: 'incident' },
  { id: 't2', reference: 'TIC-2026-0141', sujet: 'Demande nouvel utilisateur — RH', agence: 'Lyon', priorite: 'normale', status: 'ouvert', ouvertLe: '2026-05-12T15:30', assignee: 'Service desk', categorie: 'demande' },
  { id: 't3', reference: 'TIC-2026-0140', sujet: 'Imprimante HS — remplacement toner', agence: 'Marseille', priorite: 'basse', status: 'ouvert', ouvertLe: '2026-05-12T11:02', assignee: 'Tech terrain', categorie: 'maintenance' },
  { id: 't4', reference: 'TIC-2026-0139', sujet: 'Lien internet instable matin', agence: 'Paris', priorite: 'critique', status: 'en-cours', ouvertLe: '2026-05-11T08:42', assignee: 'NOC', categorie: 'incident' },
  { id: 't5', reference: 'TIC-2026-0136', sujet: 'Création licence E5 dirigeant', agence: 'Paris', priorite: 'normale', status: 'ouvert', ouvertLe: '2026-05-10T17:00', assignee: 'M365 admin', categorie: 'demande' },
  { id: 't6', reference: 'TIC-2026-0135', sujet: 'Problème VPN', agence: 'Lyon', priorite: 'haute', status: 'ouvert', ouvertLe: '2026-05-10T10:20', assignee: 'Réseau N2', categorie: 'incident' },
  // Historique
  { id: 't7', reference: 'TIC-2026-0128', sujet: 'Migration boîte partagée', agence: 'Paris', priorite: 'normale', status: 'resolu', ouvertLe: '2026-05-04T09:00', fermeLe: '2026-05-05T16:30', assignee: 'M365 admin', categorie: 'demande' },
  { id: 't8', reference: 'TIC-2026-0119', sujet: 'Caméra hall principal HS', agence: 'Marseille', priorite: 'haute', status: 'ferme', ouvertLe: '2026-04-28T08:15', fermeLe: '2026-04-29T11:00', assignee: 'Tech terrain', categorie: 'maintenance' },
  { id: 't9', reference: 'TIC-2026-0112', sujet: 'Reset mot de passe AD', agence: 'Lyon', priorite: 'basse', status: 'ferme', ouvertLe: '2026-04-22T14:00', fermeLe: '2026-04-22T14:18', assignee: 'Service desk', categorie: 'demande' },
  { id: 't10', reference: 'TIC-2026-0098', sujet: 'Audit sécurité trimestriel', agence: 'Paris', priorite: 'normale', status: 'resolu', ouvertLe: '2026-04-10T09:00', fermeLe: '2026-04-15T18:00', assignee: 'RSSI', categorie: 'demande' },
];

const utilisateursClient = [
  { id: 'u1', nom: 'Marie Dubois', email: 'm.dubois@acme.fr', role: 'DSI', agence: 'Paris', status: 'active', licence: 'E5' },
  { id: 'u2', nom: 'Thomas Bernard', email: 't.bernard@acme.fr', role: 'Resp. agence', agence: 'Lyon', status: 'active', licence: 'E3' },
  { id: 'u3', nom: 'Sophie Lemoine', email: 's.lemoine@acme.fr', role: 'Comptable', agence: 'Paris', status: 'active', licence: 'E3' },
  { id: 'u4', nom: 'Pierre Roux', email: 'p.roux@acme.fr', role: 'Commercial', agence: 'Marseille', status: 'active', licence: 'E3' },
  { id: 'u5', nom: 'Julie Garnier', email: 'j.garnier@acme.fr', role: 'RH', agence: 'Paris', status: 'inactive', licence: 'E1' },
];

const initialParc: EnrichedDevice[] = enrichedParc;

const parcInformatique = initialParc;


const activites = [
  { id: 'ac1', icon: CheckCircle2, color: 'text-emerald-500', titre: 'Migration Exchange terminée', date: 'Il y a 2 jours', user: 'Système' },
  { id: 'ac2', icon: Plus, color: 'text-blue-500', titre: '5 nouveaux utilisateurs créés', date: 'Il y a 4 jours', user: 'Marie D.' },
  { id: 'ac3', icon: AlertTriangle, color: 'text-amber-500', titre: 'Quota stockage à 85%', date: 'Il y a 5 jours', user: 'Système' },
  { id: 'ac4', icon: Shield, color: 'text-violet-500', titre: 'Audit sécurité planifié', date: 'Il y a 1 semaine', user: 'Tech support' },
  { id: 'ac5', icon: CreditCard, color: 'text-cyan-500', titre: 'Renouvellement contrat Premium', date: 'Il y a 2 semaines', user: 'Commercial' },
];

const categoryMap = Object.fromEntries(CATEGORIES.map(c => [c.value, c])) as Record<ParcCategorie, typeof CATEGORIES[number]>;

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
  const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null);
  const [showPicker, setShowPicker] = useState(true);
  const [categorieFilter, setCategorieFilter] = useState<ParcCategorie | 'all'>('all');
  const [parc, setParc] = useState<EnrichedDevice[]>(initialParc);
  const [deviceDialog, setDeviceDialog] = useState(false);
  const [newDevice, setNewDevice] = useState<Partial<EnrichedDevice>>({ categorie: 'poste', status: 'actif' });
  const [selectedDevice, setSelectedDevice] = useState<EnrichedDevice | null>(null);
  const [deviceSheet, setDeviceSheet] = useState(false);
  const [tickets] = useState<Ticket[]>(initialTickets);
  const [activeTab, setActiveTab] = useState<string>('agences');
  const [contactDialog, setContactDialog] = useState(false);
  const [contactDraft, setContactDraft] = useState<AgenceContact>({ nom: '', role: '', email: '', telephone: '' });
  const [contactAgenceId, setContactAgenceId] = useState<string | null>(null);

  const agenceFilter = selectedAgence?.ville;
  const scopedUsers = agenceFilter ? utilisateursClient.filter(u => u.agence === agenceFilter) : utilisateursClient;
  const scopedDevices = agenceFilter ? parc.filter(d => d.agence === agenceFilter) : parc;
  const scopedTickets = agenceFilter ? tickets.filter(t => t.agence === agenceFilter) : tickets;
  const openTickets = scopedTickets.filter(t => t.status === 'ouvert' || t.status === 'en-cours');
  const closedTickets = scopedTickets.filter(t => t.status === 'resolu' || t.status === 'ferme');

  const pickAgence = (a: Agence) => {
    setSelectedAgence(a);
    setShowPicker(false);
    setActiveTab('users');
  };

  const openContactEditor = (a: Agence) => {
    setContactAgenceId(a.id);
    setContactDraft(a.contact || { nom: a.responsable, role: 'Contact agence', email: '', telephone: a.telephone });
    setContactDialog(true);
  };

  const saveContact = () => {
    if (!contactAgenceId) return;
    setAgences(prev => prev.map(a => a.id === contactAgenceId ? { ...a, contact: { ...contactDraft } } : a));
    if (selectedAgence?.id === contactAgenceId) {
      setSelectedAgence({ ...selectedAgence, contact: { ...contactDraft } });
    }
    setContactDialog(false);
    toast.success('Contact agence mis à jour');
  };

  // Synthèse globale du client
  const totalPostes = parc.filter(d => d.categorie === 'poste' || d.categorie === 'serveur').length;
  const devicesEnPanne = parc.filter(d => d.status === 'hors-service').length;
  const devicesMaint = parc.filter(d => d.status === 'maintenance').length;
  const sante: { label: string; color: string; dot: string } =
    devicesEnPanne > 0 ? { label: 'Critique', color: 'text-rose-500', dot: 'bg-rose-500' }
    : devicesMaint > 2 ? { label: 'À surveiller', color: 'text-amber-500', dot: 'bg-amber-500' }
    : { label: 'Opérationnel', color: 'text-emerald-500', dot: 'bg-emerald-500' };
  const ticketsOuvertsClient = tickets.filter(t => t.status === 'ouvert' || t.status === 'en-cours').length;
  const derniereIntervention = tickets.find(t => t.fermeLe);

  const filteredUsers = useMemo(
    () => scopedUsers.filter(u => u.nom.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())),
    [searchUser, scopedUsers]
  );
  const filteredDevices = useMemo(
    () => scopedDevices.filter(d => (categorieFilter === 'all' || d.categorie === categorieFilter) && (d.nom.toLowerCase().includes(searchDevice.toLowerCase()) || (d.utilisateur || '').toLowerCase().includes(searchDevice.toLowerCase()))),
    [searchDevice, scopedDevices]
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

      {/* Hero header (compact) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-4 text-white"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-4 flex-wrap">
          {/* Identité */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${client.logoColor} flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20 flex-shrink-0`}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold truncate">{client.nom}</h1>
                {client.contrats?.map(c => <Badge key={c} variant="outline" className="text-[10px] h-5 bg-white/15 text-white border-white/25">{c}</Badge>)}
                <Badge variant="outline" className="text-[10px] h-5 bg-white/15 text-white border-white/25 capitalize">{client.status}</Badge>
              </div>
              <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="h-3 w-3" />{client.secteur}
                <span>·</span>
                <MapPin className="h-3 w-3" />{client.ville}
                <span>·</span>
                Depuis {new Date(client.depuis).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* KPI inline */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: UsersIcon, label: 'Users', value: client.utilisateurs },
              { icon: CreditCard, label: 'Lic.', value: client.licences },
              { icon: Building2, label: 'Agences', value: agences.length },
              { icon: Monitor, label: 'Parc', value: parc.length },
              { icon: TrendingUp, label: 'CA', value: `${(client.ca / 1000).toFixed(1)}k€` },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 flex items-center gap-2">
                <s.icon className="h-3.5 w-3.5 text-white/80" />
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold leading-none">{s.value}</span>
                  <span className="text-[10px] text-white/70">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5">
            <Button size="sm" className="h-8 bg-white/20 hover:bg-white/30 text-white border border-white/30">
              <Edit className="h-3.5 w-3.5 mr-1.5" />Modifier
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Star className="h-4 w-4 mr-2" />Favori</DropdownMenuItem>
                <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Exporter fiche</DropdownMenuItem>
                <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Envoyer email</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Archiver</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Sélecteur d'agence (vue d'entrée) */}
      {showPicker && agences.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* SYNTHÈSE CLIENT — Cockpit annulaire */}
          <Card className="p-5 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-5">
              {/* Identité */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Synthèse client</span>
                </div>
                <h3 className="text-lg font-bold leading-tight">{client.nom}</h3>
                <p className="text-xs text-muted-foreground">Portefeuille <span className="font-mono font-semibold text-foreground">GRCS</span> · {client.secteur}</p>
                <div className="space-y-1 pt-1 text-xs">
                  <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-muted-foreground" /><a href={`mailto:${client.email}`} className="text-primary hover:underline truncate">{client.email}</a></p>
                  <p className="flex items-center gap-1.5"><Headphones className="h-3 w-3 text-muted-foreground" /><span className="font-mono">{client.telephone}</span><span className="text-muted-foreground">· Commercial</span></p>
                  <p className="flex items-start gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground mt-0.5" /><span>{client.adresse}, {client.codePostal} {client.ville}</span></p>
                </div>
              </div>

              {/* Support */}
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-amber-500/15"><Ticket className="h-3.5 w-3.5 text-amber-600" /></div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Support</span>
                </div>
                <p className="text-3xl font-bold leading-none">{ticketsOuvertsClient}<span className="text-sm font-normal text-muted-foreground ml-1">tickets ouverts</span></p>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>{tickets.filter(t => t.priorite === 'critique' && (t.status === 'ouvert' || t.status === 'en-cours')).length} critique(s) · {tickets.filter(t => t.priorite === 'haute' && (t.status === 'ouvert' || t.status === 'en-cours')).length} haute(s)</p>
                  {derniereIntervention && (
                    <p className="flex items-center gap-1"><Wrench className="h-3 w-3" />Dernière interv. : <span className="text-foreground">{new Date(derniereIntervention.fermeLe!).toLocaleDateString('fr-FR')}</span></p>
                  )}
                </div>
              </div>

              {/* Infra IT */}
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-blue-500/15"><Server className="h-3.5 w-3.5 text-blue-600" /></div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Infra IT</span>
                </div>
                <p className="text-3xl font-bold leading-none">{totalPostes}<span className="text-sm font-normal text-muted-foreground ml-1">postes & serveurs</span></p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/60 ${sante.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sante.dot} animate-pulse`} />
                    {sante.label}
                  </span>
                  <span className="text-muted-foreground">{parc.length} équipt.</span>
                </div>
              </div>

              {/* Affectation */}
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-violet-500/15"><BriefcaseIcon className="h-3.5 w-3.5 text-violet-600" /></div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Affectation</span>
                </div>
                <p className="text-sm font-semibold">{client.contact.nom}</p>
                <p className="text-xs text-muted-foreground">{client.contact.role} principal</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />{agences.length} agence(s)
                  <span>·</span>
                  <UsersIcon className="h-3 w-3" />{client.utilisateurs} util.
                </div>
              </div>
            </div>
          </Card>

          {/* PICKER AGENCES */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
            <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-primary/10"><Building2 className="h-4 w-4 text-primary" /></div>
                  <h2 className="text-lg font-semibold">Choisissez une agence</h2>
                </div>
                <p className="text-sm text-muted-foreground">Filtre les utilisateurs, le parc IT et les tickets sur cette agence.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => { setShowPicker(false); setSelectedAgence(null); setActiveTab('users'); }}>
                  <FolderOpen className="h-4 w-4 mr-2" />Voir toutes les ressources
                </Button>
                <Button size="sm" onClick={() => navigate(`/clients/${id}/supervision`)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  <Activity className="h-4 w-4 mr-2" />Supervision globale
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {agences.map(a => {
                const usersCount = utilisateursClient.filter(u => u.agence === a.ville).length;
                const devicesCount = parcInformatique.filter(d => d.agence === a.ville).length;
                const ticketsCount = tickets.filter(t => t.agence === a.ville && (t.status === 'ouvert' || t.status === 'en-cours')).length;
                const c = a.contact;
                return (
                  <div
                    key={a.id}
                    className="group relative text-left p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted/30 hover:border-primary/50 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <button onClick={() => pickAgence(a)} className="text-left w-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-semibold">{a.nom}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{a.codePostal} {a.ville}</p>
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/50 text-xs">
                        <div><span className="font-bold text-base">{usersCount}</span><p className="text-muted-foreground text-[10px]">util.</p></div>
                        <div><span className="font-bold text-base">{devicesCount}</span><p className="text-muted-foreground text-[10px]">appareils</p></div>
                        <div><span className={`font-bold text-base ${ticketsCount > 0 ? 'text-amber-600' : ''}`}>{ticketsCount}</span><p className="text-muted-foreground text-[10px]">tickets</p></div>
                      </div>
                    </button>
                    <div className="mt-3 p-2.5 rounded-lg bg-muted/40 border border-border/40">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarFallback className="text-[10px] bg-gradient-to-br from-violet-500 to-purple-600 text-white">{c ? c.nom.split(' ').map(w => w[0]).join('').slice(0,2) : '?'}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{c?.nom || 'Aucun contact'}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{c?.role || '—'}</p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7 flex-shrink-0" onClick={(e) => { e.stopPropagation(); openContactEditor(a); }}>
                          <UserCog className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3" onClick={(e) => { e.stopPropagation(); navigate(`/clients/${id}/supervision?agence=${a.ville}`); }}>
                      <Activity className="h-3.5 w-3.5 mr-1.5" />Supervision agence
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Bandeau filtre actif */}
      {!showPicker && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between gap-3 p-3 px-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3 text-sm">
            {selectedAgence ? (
              <>
                <Badge className="bg-primary/15 text-primary border-primary/30">
                  <Building2 className="h-3 w-3 mr-1" />Agence : {selectedAgence.nom}
                </Badge>
                <span className="text-muted-foreground">Utilisateurs, Parc IT et Tickets filtrés sur cette agence.</span>
              </>
            ) : (
              <>
                <Badge variant="outline" className="border-border">
                  <FolderOpen className="h-3 w-3 mr-1" />Vue globale du client
                </Badge>
                <span className="text-muted-foreground">Toutes les ressources sont affichées.</span>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => { setShowPicker(true); setSelectedAgence(null); }}>
            <Building2 className="h-3.5 w-3.5 mr-1.5" />Changer d'agence
          </Button>
        </motion.div>
      )}

      {/* Main grid : sidebar + tabs */}
      {!showPicker && (
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
            {(() => {
              const c = selectedAgence?.contact;
              const displayed = c ? c : { nom: client.contact.nom, role: client.contact.role + ' principal', email: client.email, telephone: client.telephone };
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">{selectedAgence ? `Contact ${selectedAgence.nom}` : 'Contact principal'}</h3>
                    {selectedAgence && (
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openContactEditor(selectedAgence)}>
                        <UserCog className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12"><AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">{displayed.nom.split(' ').map(w => w[0]).join('').slice(0,2)}</AvatarFallback></Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{displayed.nom}</p>
                      <p className="text-xs text-muted-foreground truncate">{displayed.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1" asChild><a href={`mailto:${displayed.email}`}><Mail className="h-3.5 w-3.5 mr-1" />Email</a></Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild><a href={`tel:${displayed.telephone}`}><Phone className="h-3.5 w-3.5 mr-1" />Appeler</a></Button>
                  </div>
                </>
              );
            })()}
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-4">
              <TabsTrigger value="agences"><Building2 className="h-4 w-4 mr-1.5" />Agences</TabsTrigger>
              <TabsTrigger value="users"><UsersIcon className="h-4 w-4 mr-1.5" />Utilisateurs</TabsTrigger>
              <TabsTrigger value="parc"><Monitor className="h-4 w-4 mr-1.5" />Parc IT</TabsTrigger>
              <TabsTrigger value="tickets">
                <Ticket className="h-4 w-4 mr-1.5" />Tickets
                {openTickets.length > 0 && <Badge className="ml-1.5 h-4 px-1 text-[10px] bg-amber-500/20 text-amber-700 border-amber-500/30">{openTickets.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="files"><FolderOpen className="h-4 w-4 mr-1.5" />Fichiers & Contrats</TabsTrigger>
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
                        </div>
                        <div className="mt-3 p-2.5 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-7 w-7 flex-shrink-0">
                              <AvatarFallback className="text-[10px] bg-gradient-to-br from-violet-500 to-purple-600 text-white">{a.contact ? a.contact.nom.split(' ').map(w => w[0]).join('').slice(0,2) : '?'}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{a.contact?.nom || a.responsable || 'Aucun contact'}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{a.contact?.role || 'Responsable agence'}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs flex-shrink-0" onClick={() => openContactEditor(a)}>
                            <UserCog className="h-3.5 w-3.5 mr-1" />Éditer
                          </Button>
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
              {(() => {
                const FAMILIES: { id: string; label: string; icon: any; color: string; cats: ParcCategorie[] }[] = [
                  { id: 'endpoints', label: 'Endpoints', icon: Laptop, color: 'from-blue-500 to-indigo-600', cats: ['poste', 'mobile'] },
                  { id: 'infra', label: 'Infrastructure', icon: Server, color: 'from-violet-500 to-purple-600', cats: ['serveur', 'reseau', 'lien-internet'] },
                  { id: 'comm', label: 'Communication', icon: PhoneCall, color: 'from-cyan-500 to-sky-600', cats: ['telephonie', 'imprimante'] },
                  { id: 'security', label: 'Sécurité physique', icon: Shield, color: 'from-rose-500 to-red-600', cats: ['alarme', 'videosurveillance'] },
                ];
                const activeFamily = FAMILIES.find(f => categorieFilter !== 'all' && f.cats.includes(categorieFilter as ParcCategorie));
                return (
                  <>
                    {/* 4 familles */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <button
                        onClick={() => setCategorieFilter('all')}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${categorieFilter === 'all' ? 'border-primary bg-primary/5 shadow-md' : 'border-border/50 bg-card/80 hover:border-primary/40'}`}
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center flex-shrink-0">
                          <Cpu className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-2xl font-bold leading-none">{scopedDevices.length}</p>
                          <p className="text-xs text-muted-foreground mt-1">Vue globale</p>
                        </div>
                      </button>
                      {FAMILIES.map(f => {
                        const count = scopedDevices.filter(d => f.cats.includes(d.categorie)).length;
                        const active = activeFamily?.id === f.id;
                        const Icon = f.icon;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setCategorieFilter(f.cats[0])}
                            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${active ? 'border-primary bg-primary/5 shadow-md' : 'border-border/50 bg-card/80 hover:border-primary/40'}`}
                          >
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-2xl font-bold leading-none">{count}</p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">{f.label}</p>
                              <p className="text-[10px] text-muted-foreground/70 truncate">{f.cats.map(c => categoryMap[c].label).join(' · ')}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Sous-catégories de la famille active */}
                    {activeFamily && (
                      <div className="flex items-center gap-2 flex-wrap p-2 rounded-xl bg-muted/40 border border-border/50">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground px-2">{activeFamily.label} :</span>
                        {activeFamily.cats.map(cat => {
                          const c = categoryMap[cat];
                          const count = scopedDevices.filter(d => d.categorie === cat).length;
                          const Icon = c.icon;
                          const active = categorieFilter === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => setCategorieFilter(cat)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card hover:bg-card/80 text-foreground border border-border/50'}`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {c.label}
                              <span className={`ml-0.5 px-1.5 py-0.5 rounded text-[10px] ${active ? 'bg-primary-foreground/20' : 'bg-muted'}`}>{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}

              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Inventaire {categorieFilter !== 'all' && <span className="text-primary">· {categoryMap[categorieFilter].label}</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">{filteredDevices.length} équipement(s){agenceFilter ? ` · ${agenceFilter}` : ''}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." value={searchDevice} onChange={e => setSearchDevice(e.target.value)} className="pl-9" /></div>
                    {categorieFilter !== 'all' && <Button variant="outline" onClick={() => setCategorieFilter('all')}>Réinitialiser</Button>}
                    <Dialog open={deviceDialog} onOpenChange={setDeviceDialog}>
                      <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Ajouter un équipement</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader><DialogTitle>Nouvel équipement</DialogTitle></DialogHeader>
                        <div className="grid grid-cols-2 gap-3 py-2">
                          <div className="col-span-2">
                            <Label>Catégorie *</Label>
                            <Select value={newDevice.categorie} onValueChange={v => setNewDevice({ ...newDevice, categorie: v as ParcCategorie })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div><Label>Nom / Identifiant *</Label><Input value={newDevice.nom || ''} onChange={e => setNewDevice({ ...newDevice, nom: e.target.value })} placeholder="PC-DUPONT-01" /></div>
                          <div><Label>Modèle</Label><Input value={newDevice.modele || ''} onChange={e => setNewDevice({ ...newDevice, modele: e.target.value })} placeholder="Dell XPS 15" /></div>
                          <div><Label>OS / Firmware</Label><Input value={newDevice.os || ''} onChange={e => setNewDevice({ ...newDevice, os: e.target.value })} placeholder="Windows 11 Pro" /></div>
                          <div><Label>N° série</Label><Input value={newDevice.numeroSerie || ''} onChange={e => setNewDevice({ ...newDevice, numeroSerie: e.target.value })} /></div>
                          <div><Label>Utilisateur</Label><Input value={newDevice.utilisateur || ''} onChange={e => setNewDevice({ ...newDevice, utilisateur: e.target.value })} placeholder="Optionnel" /></div>
                          <div>
                            <Label>Agence</Label>
                            <Select value={newDevice.agence} onValueChange={v => setNewDevice({ ...newDevice, agence: v })}>
                              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                              <SelectContent>
                                {agences.map(a => <SelectItem key={a.id} value={a.ville}>{a.nom}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div><Label>Fournisseur</Label><Input value={newDevice.fournisseur || ''} onChange={e => setNewDevice({ ...newDevice, fournisseur: e.target.value })} /></div>
                          <div className="col-span-2"><Label>Contrat / SLA</Label><Input value={newDevice.contrat || ''} onChange={e => setNewDevice({ ...newDevice, contrat: e.target.value })} placeholder="GTR 4h, télésurveillance, ProSupport..." /></div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeviceDialog(false)}>Annuler</Button>
                          <Button onClick={() => {
                            if (!newDevice.nom || !newDevice.categorie) { toast.error('Nom et catégorie obligatoires'); return; }
                            const d = {
                              id: `d-${Date.now()}`, nom: newDevice.nom!, categorie: newDevice.categorie!,
                              utilisateur: newDevice.utilisateur, os: newDevice.os || '—', modele: newDevice.modele || '—',
                              numeroSerie: newDevice.numeroSerie || '—', status: (newDevice.status as any) || 'actif',
                              dernierVu: 'à l\'instant', agence: newDevice.agence || (agences[0]?.ville || '—'),
                              fournisseur: newDevice.fournisseur, contrat: newDevice.contrat,
                            };
                            setParc([d, ...parc]);
                            setNewDevice({ categorie: 'poste', status: 'actif' });
                            setDeviceDialog(false);
                            toast.success('Équipement ajouté');
                          }}>Ajouter</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Table>
                  <TableHeader><TableRow><TableHead>Équipement</TableHead><TableHead>Catégorie</TableHead><TableHead>Modèle / OS</TableHead><TableHead>Utilisateur</TableHead><TableHead>Agence</TableHead><TableHead>Fournisseur</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredDevices.map(d => {
                      const cat = categoryMap[d.categorie];
                      const Icon = cat.icon;
                      return (
                        <TableRow key={d.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => { setSelectedDevice(d); setDeviceSheet(true); }}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-md bg-gradient-to-br ${cat.color}`}><Icon className="h-4 w-4 text-white" /></div>
                              <div>
                                <span className="text-sm font-medium block">{d.nom}</span>
                                <code className="text-[10px] text-muted-foreground">{d.numeroSerie}</code>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{cat.label}</Badge></TableCell>
                          <TableCell><div className="text-sm">{d.modele}</div><div className="text-xs text-muted-foreground">{d.os}</div></TableCell>
                          <TableCell className="text-sm">{d.utilisateur || <span className="text-muted-foreground italic">—</span>}</TableCell>
                          <TableCell className="text-sm">{d.agence}</TableCell>
                          <TableCell className="text-sm">{d.fournisseur || '—'}{d.contrat && <div className="text-[10px] text-muted-foreground">{d.contrat}</div>}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${
                              d.status === 'actif' ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' :
                              d.status === 'maintenance' ? 'bg-amber-500/15 text-amber-700 border-amber-500/30' :
                              'bg-destructive/15 text-destructive border-destructive/30'
                            }`}>{d.status}</Badge>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{d.dernierVu}</div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredDevices.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">Aucun équipement dans cette catégorie</TableCell></TableRow>
                    )}
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

            {/* CONTRATS */}
            <TabsContent value="contracts" className="space-y-4">
              <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Contrat & facturation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                    <p className="text-xs uppercase text-muted-foreground tracking-wider mb-2">Contrats actifs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {client.contrats?.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>) || <span className="text-sm text-muted-foreground">Aucun</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">Renouvellement automatique annuel</p>
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
      )}

      <DeviceDetailSheet device={selectedDevice} open={deviceSheet} onOpenChange={setDeviceSheet} />
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
