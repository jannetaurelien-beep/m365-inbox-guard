import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, Mail, Phone, MapPin, Shield, TrendingUp, Archive,
  Cloud, Monitor, ShieldCheck, Clock, Briefcase, Send, Building2,
  Globe, Key, Fingerprint, AlertTriangle, Plus, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { User } from '@/lib/mock-data';
import { userService, licenseService, mailboxService } from '@/lib/services';
import { PasswordSection } from '@/components/user-detail/PasswordSection';
import { AliasSection } from '@/components/user-detail/AliasSection';
import { MembersSection } from '@/components/user-detail/MembersSection';
import { EditableField } from '@/components/user-detail/EditableField';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';

const avatarColors = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

function SectionHeader({ icon: Icon, title, subtitle, action }: {
  icon: React.ElementType; title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function FieldGroup({ title, icon: Icon, children }: {
  title: string; icon?: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {children}
      </div>
    </div>
  );
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'7j' | '30j' | '90j'>('30j');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState('');

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await userService.getUser(id);
      setUser(data || null);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeLicense = async () => {
    if (!user || !selectedLicense) return;
    try {
      await licenseService.upgradeLicense(user.id, selectedLicense);
      toast.success('Demande d\'upgrade envoyée');
      addNotification({ type: 'info', title: 'Upgrade de licence', message: `Upgrade pour ${user.prenom} ${user.nom}`, actionUrl: '/licences' });
      setShowUpgradeDialog(false);
    } catch {
      toast.error('Erreur lors de l\'upgrade');
    }
  };

  const handleRequestArchive = async () => {
    if (!user) return;
    try {
      await mailboxService.requestArchive(user.id, '2020-01-01', '2023-12-31');
      toast.success('Demande d\'archivage créée');
      addNotification({ type: 'info', title: 'Archivage', message: `Archivage pour ${user.prenom} ${user.nom}`, actionUrl: '/demandes' });
      setShowArchiveDialog(false);
    } catch {
      toast.error('Erreur lors de la demande');
    }
  };

  const handleFieldSave = (field: string, value: string) => {
    toast.success(`Champ "${field}" mis à jour`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Utilisateur introuvable</h2>
        <Button onClick={() => navigate('/utilisateurs')}>Retour à la liste</Button>
      </div>
    );
  }

  const storagePercent = (user.stockage.utiliseGo / user.stockage.quotaGo) * 100;
  const licenses = licenseService.getLicenses();
  const colorIdx = parseInt(user.id.replace(/\D/g, ''), 10) || 0;
  const avatarColor = avatarColors[colorIdx % avatarColors.length];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/utilisateurs')} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Fiche utilisateur</h1>
              <p className="text-white/70">Détails et gestion</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Identity Card */}
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-xl -mt-8 relative z-10 mx-4">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
              {user.prenom.charAt(0)}{user.nom.charAt(0)}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-card ${user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{user.prenom} {user.nom}</h2>
                <p className="text-muted-foreground">{user.metier}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}
                    className={user.status === 'active' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' : ''}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                  <Badge variant="outline">{user.typeBoite === 'nominative' ? 'Nominative' : 'Partagée'}</Badge>
                  {user.agence && <Badge variant="outline">Client : {user.agence.toLowerCase()}</Badge>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="text-sm font-medium">{user.telephone || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Agence</p>
                  <p className="text-sm font-medium">{user.agence || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="microsoft365" className="px-4">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl h-auto flex-wrap gap-1">
          <TabsTrigger value="microsoft365" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
            <Cloud className="h-4 w-4" /> Microsoft 365
          </TabsTrigger>
          <TabsTrigger value="mailbox" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
            <Mail className="h-4 w-4" /> Boîte mail
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
            <Globe className="h-4 w-4" /> Accès & Messagerie
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
            <ShieldCheck className="h-4 w-4" /> Sécurité
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
            <Clock className="h-4 w-4" /> Activité
          </TabsTrigger>
        </TabsList>

        {/* Microsoft 365 Tab */}
        <TabsContent value="microsoft365" className="space-y-6 mt-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <SectionHeader
              icon={Cloud}
              title="Microsoft 365"
              subtitle="Données synchronisées depuis Azure AD — survolez un champ pour le modifier"
              action={
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                  Compte actif
                </Badge>
              }
            />

            <div className="space-y-8">
              <FieldGroup title="Identité Azure AD" icon={Fingerprint}>
                <EditableField label="UPN (login Azure)" value={user.upn} onSave={(v) => handleFieldSave('UPN', v)} />
                <EditableField label="Type de compte" value="Membre" onSave={(v) => handleFieldSave('Type', v)} />
                <EditableField label="ID Azure" value="0a5fee42-479a-44c8-b321-8ec4a6eacbde" editable={false} />
                <EditableField label="Localisation d'utilisation" value="" onSave={(v) => handleFieldSave('Localisation', v)} />
                <EditableField label="Créé le" value="07 décembre 2023" editable={false} />
                <EditableField label="Dernier changement de mot de passe" value="07 décembre 2023" editable={false} />
              </FieldGroup>

              <Separator />

              <FieldGroup title="Nom & Prénom" icon={Briefcase}>
                <EditableField label="Prénom" value={user.prenom} onSave={(v) => handleFieldSave('Prénom', v)} />
                <EditableField label="Nom" value={user.nom} onSave={(v) => handleFieldSave('Nom', v)} />
              </FieldGroup>

              <Separator />

              <FieldGroup title="Informations professionnelles" icon={Building2}>
                <EditableField label="Entreprise" value="" onSave={(v) => handleFieldSave('Entreprise', v)} />
                <EditableField label="Département" value="" onSave={(v) => handleFieldSave('Département', v)} />
                <EditableField label="Poste" value={user.metier} onSave={(v) => handleFieldSave('Poste', v)} />
                <EditableField label="ID employé" value="" onSave={(v) => handleFieldSave('ID employé', v)} />
                <EditableField label="Bureau" value="" onSave={(v) => handleFieldSave('Bureau', v)} />
              </FieldGroup>

              <Separator />

              <FieldGroup title="Coordonnées" icon={MapPin}>
                <EditableField label="Téléphone mobile" value="" onSave={(v) => handleFieldSave('Tel mobile', v)} />
                <EditableField label="Téléphones professionnels" value={user.telephone} onSave={(v) => handleFieldSave('Tel pro', v)} />
                <EditableField label="Adresse" value="" onSave={(v) => handleFieldSave('Adresse', v)} />
                <EditableField label="Ville" value="" onSave={(v) => handleFieldSave('Ville', v)} />
                <EditableField label="Code postal" value="" onSave={(v) => handleFieldSave('Code postal', v)} />
                <EditableField label="Région / État" value="" onSave={(v) => handleFieldSave('Région', v)} />
                <EditableField label="Pays" value="" onSave={(v) => handleFieldSave('Pays', v)} />
              </FieldGroup>

              <Separator />

              <FieldGroup title="Transfert de boîte mail" icon={Send}>
                <EditableField label="Adresse de transfert (vide = désactiver)" value="" onSave={(v) => handleFieldSave('Transfert', v)} />
              </FieldGroup>
            </div>
          </Card>
        </TabsContent>

        {/* Boîte mail Tab */}
        <TabsContent value="mailbox" className="space-y-6 mt-6">
          {/* Storage & License */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                <SectionHeader icon={Mail} title="Boîte mail" subtitle="Stockage et licence" />
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Stockage</span>
                      <span className="text-sm text-muted-foreground">
                        {user.stockage.utiliseGo.toFixed(2)} Go / {user.stockage.quotaGo.toFixed(2)} Go
                      </span>
                    </div>
                    <Progress value={storagePercent} className="h-3" />
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Licences M365</p>
                    <p className="font-semibold">{user.licence.label || '—'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeDialog(true)}>
                      <TrendingUp className="h-4 w-4 mr-2" /> Upgrade licence
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setShowArchiveDialog(true)}>
                      <Archive className="h-4 w-4 mr-2" /> Demander archivage
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
              <SectionHeader icon={Settings} title="Actions" />
              <p className="text-sm text-muted-foreground mb-4">
                Les actions (mot de passe, alias, membres) seront branchées sur les endpoints REST.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Changer mot de passe</Button>
                <Button variant="outline" size="sm">Gérer alias</Button>
              </div>
            </Card>
          </div>

          {/* Aliases, Transfers, License sections */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <SectionHeader icon={Mail} title="Boîte mail" subtitle="Aliases, transferts et licence" />

            <div className="space-y-6">
              {/* Aliases */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aliases</h4>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter</Button>
                </div>
                {user.aliases.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun alias configuré.</p>
                ) : (
                  <div className="space-y-2">
                    {user.aliases.map((alias) => (
                      <div key={alias} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">{alias}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Transfer */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transfert / Redirection</h4>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Configurer</Button>
                </div>
                <p className="text-sm text-muted-foreground">Aucun transfert configuré.</p>
              </div>

              <Separator />

              {/* License */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Licence</h4>
                  <Button variant="outline" size="sm" onClick={() => setShowUpgradeDialog(true)}>
                    <Pencil className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                </div>
                <p className="text-sm">{user.licence.label || 'Aucune licence assignée.'}</p>
              </div>
            </div>
          </Card>

          {/* Members (if shared) */}
          {user.boitePartagee.estPartagee && user.boitePartagee.membres && (
            <MembersSection mailboxId={user.id} members={user.boitePartagee.membres} onUpdate={loadUser} />
          )}
        </TabsContent>

        {/* Accès & Messagerie Tab */}
        <TabsContent value="access" className="space-y-6 mt-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <SectionHeader icon={Globe} title="Accès & Messagerie" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <EditableField label="Serveur" value="" onSave={(v) => handleFieldSave('Serveur', v)} />
              <EditableField label="Droits serveur" value="" onSave={(v) => handleFieldSave('Droits serveur', v)} />
              <EditableField label="VPN" value="Non" onSave={(v) => handleFieldSave('VPN', v)} />
              <EditableField label="Jours VPN" value="" onSave={(v) => handleFieldSave('Jours VPN', v)} />
              <EditableField label="Message d'absence (int.)" value="" onSave={(v) => handleFieldSave('Absence int', v)} />
              <EditableField label="Message d'absence (ext.)" value="" onSave={(v) => handleFieldSave('Absence ext', v)} />
              <EditableField label="Redirection" value="Non" onSave={(v) => handleFieldSave('Redirection', v)} />
              <EditableField label="Transfert" value="Non" onSave={(v) => handleFieldSave('Transfert', v)} />
              <EditableField label="Archivage" value="" onSave={(v) => handleFieldSave('Archivage', v)} />
              <EditableField label="Alias principal" value="Non" onSave={(v) => handleFieldSave('Alias principal', v)} />
            </div>
          </Card>
        </TabsContent>

        {/* Sécurité Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PasswordSection userId={user.id} />

            {/* MFA */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
              <SectionHeader
                icon={Fingerprint}
                title="Double authentification (MFA)"
                subtitle="Méthodes d'authentification configurées"
                action={
                  <Badge variant="destructive">MFA non configuré</Badge>
                }
              />
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Aucune méthode MFA configurée. Cet utilisateur n'est protégé que par son mot de passe.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Devices */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <SectionHeader
              icon={Monitor}
              title="Appareils Azure AD"
              subtitle="Enregistrés / joints au tenant"
              action={<Badge variant="outline">0 appareil</Badge>}
            />
            <p className="text-sm text-muted-foreground">Aucun appareil enregistré.</p>
          </Card>
        </TabsContent>

        {/* Activité Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          {/* Email Activity Chart */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <SectionHeader icon={TrendingUp} title="Activité emails" subtitle="Messages envoyés et reçus" />
              <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as '7j' | '30j' | '90j')}>
                <TabsList>
                  <TabsTrigger value="7j">7j</TabsTrigger>
                  <TabsTrigger value="30j">30j</TabsTrigger>
                  <TabsTrigger value="90j">90j</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={user.activite.envoyes.map((e, i) => ({
                date: e.date,
                envoyes: e.count,
                recus: user.activite.recus[i]?.count || 0,
              }))}>
                <defs>
                  <linearGradient id="colorEnvoyes2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRecus2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }} />
                <Legend />
                <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEnvoyes2)" strokeWidth={2} />
                <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRecus2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Audit Log */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <SectionHeader
              icon={Clock}
              title="Journal d'activité"
              subtitle="Historique des modifications et synchronisations"
              action={<Badge variant="outline">{user.auditLog.length} entrée{user.auditLog.length > 1 ? 's' : ''}</Badge>}
            />
            <div className="space-y-3">
              {user.auditLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune action enregistrée pour cet utilisateur.</p>
              ) : (
                user.auditLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>{log.status}</Badge>
                        <span className="text-xs text-muted-foreground">{log.user}</span>
                        <span className="text-xs text-muted-foreground">{new Date(log.date).toLocaleString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog upgrade licence */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade de licence</DialogTitle>
            <DialogDescription>Sélectionnez la nouvelle licence pour cet utilisateur</DialogDescription>
          </DialogHeader>
          <Select value={selectedLicense} onValueChange={setSelectedLicense}>
            <SelectTrigger><SelectValue placeholder="Choisir une licence" /></SelectTrigger>
            <SelectContent>
              {licenses.map((lic) => (
                <SelectItem key={lic.skuId} value={lic.skuId}>{lic.label} - {lic.prixMensuel}€/mois</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLicense && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium">{licenses.find(l => l.skuId === selectedLicense)?.description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>Annuler</Button>
            <Button onClick={handleUpgradeLicense} disabled={!selectedLicense}>Confirmer l'upgrade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog archivage */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demande d'archivage</DialogTitle>
            <DialogDescription>Les emails de plus de 2 ans seront archivés automatiquement.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>Annuler</Button>
            <Button onClick={handleRequestArchive}>Créer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Small helper used in mailbox tab
function Pencil({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
