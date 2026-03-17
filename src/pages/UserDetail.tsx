import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Mail, Phone, MapPin, Shield, TrendingUp, Archive,
  Cloud, Monitor, ShieldCheck, Clock, Briefcase, Send, Building2,
  Globe, Key, Fingerprint, AlertTriangle, Plus, Settings, ChevronDown,
  Eye, EyeOff, RotateCcw, Users, Lock, Activity, Server, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '@/lib/mock-data';
import { userService, licenseService, mailboxService } from '@/lib/services';
import { EditableField } from '@/components/user-detail/EditableField';
import { MembersSection } from '@/components/user-detail/MembersSection';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

const avatarColors = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

const sections = [
  { id: 'identity', label: 'Identité', icon: Cloud },
  { id: 'contact', label: 'Contact', icon: MapPin },
  { id: 'mailbox', label: 'Boîte mail', icon: Mail },
  { id: 'access', label: 'Accès', icon: Globe },
  { id: 'security', label: 'Sécurité', icon: ShieldCheck },
  { id: 'activity', label: 'Activité', icon: Activity },
];

// Collapsible section component
function Section({ id, icon: Icon, title, subtitle, defaultOpen = true, badge, action, children }: {
  id: string; icon: React.ElementType; title: string; subtitle?: string;
  defaultOpen?: boolean; badge?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-24"
    >
      <Card className="overflow-hidden border-border/40 bg-card/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10">
              <Icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">{title}</h3>
                {badge}
              </div>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              open && "rotate-180"
            )} />
          </div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-0">
                <Separator className="mb-5" />
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Quick stat pill
function StatPill({ icon: Icon, label, value, color = 'primary' }: {
  icon: React.ElementType; label: string; value: string; color?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/30">
      <div className={cn("p-1.5 rounded-lg", `bg-${color}/10`)}>
        <Icon className={cn("h-3.5 w-3.5", `text-${color}`)} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
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
  const [activeSection, setActiveSection] = useState('identity');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState('');

  useEffect(() => { loadUser(); }, [id]);

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [user]);

  const loadUser = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await userService.getUser(id);
      setUser(data || null);
    } catch { toast.error('Erreur lors du chargement'); }
    finally { setLoading(false); }
  };

  const handleUpgradeLicense = async () => {
    if (!user || !selectedLicense) return;
    try {
      await licenseService.upgradeLicense(user.id, selectedLicense);
      toast.success('Demande d\'upgrade envoyée');
      addNotification({ type: 'info', title: 'Upgrade de licence', message: `Upgrade pour ${user.prenom} ${user.nom}`, actionUrl: '/licences' });
      setShowUpgradeDialog(false);
    } catch { toast.error('Erreur lors de l\'upgrade'); }
  };

  const handleRequestArchive = async () => {
    if (!user) return;
    try {
      await mailboxService.requestArchive(user.id, '2020-01-01', '2023-12-31');
      toast.success('Demande d\'archivage créée');
      addNotification({ type: 'info', title: 'Archivage', message: `Archivage pour ${user.prenom} ${user.nom}`, actionUrl: '/demandes' });
      setShowArchiveDialog(false);
    } catch { toast.error('Erreur lors de la demande'); }
  };

  const handleFieldSave = (field: string, value: string) => {
    toast.success(`Champ "${field}" mis à jour`);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Compact Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/utilisateurs')} className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                {user.prenom.charAt(0)}{user.nom.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{user.prenom} {user.nom}</h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}
              className={user.status === 'active' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' : ''}>
              {user.status === 'active' ? '● Actif' : '○ Inactif'}
            </Badge>
            <Badge variant="outline">{user.typeBoite === 'nominative' ? 'Nominative' : 'Partagée'}</Badge>
          </div>
        </div>

        {/* Section nav pills */}
        <div className="flex items-center gap-1 px-6 pb-2 overflow-x-auto scrollbar-hide">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                activeSection === id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <StatPill icon={Mail} label="Stockage" value={`${user.stockage.utiliseGo.toFixed(1)} / ${user.stockage.quotaGo} Go`} />
          <StatPill icon={Key} label="Licence" value={user.licence.label?.split(' ')[0] || '—'} />
          <StatPill icon={Building2} label="Agence" value={user.agence || '—'} />
          <StatPill icon={Shield} label="MFA" value="Non configuré" color="destructive" />
        </motion.div>

        {/* === IDENTITY SECTION === */}
        <Section
          id="identity"
          icon={Cloud}
          title="Identité Microsoft 365"
          subtitle="Azure AD — survolez un champ pour le modifier"
          badge={<Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Synchronisé</Badge>}
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" /> Compte Azure AD
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <EditableField label="UPN (login Azure)" value={user.upn} onSave={(v) => handleFieldSave('UPN', v)} />
                <EditableField label="Type de compte" value="Membre" onSave={(v) => handleFieldSave('Type', v)} />
                <EditableField label="ID Azure" value="0a5fee42-479a-44c8-b321-8ec4a6eacbde" editable={false} />
                <EditableField label="Localisation d'utilisation" value="" onSave={(v) => handleFieldSave('Localisation', v)} />
                <EditableField label="Créé le" value="07 décembre 2023" editable={false} />
                <EditableField label="Dernier changement mdp" value="07 décembre 2023" editable={false} />
              </div>
            </div>

            <Separator className="opacity-50" />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5" /> Informations professionnelles
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <EditableField label="Prénom" value={user.prenom} onSave={(v) => handleFieldSave('Prénom', v)} />
                <EditableField label="Nom" value={user.nom} onSave={(v) => handleFieldSave('Nom', v)} />
                <EditableField label="Entreprise" value="" onSave={(v) => handleFieldSave('Entreprise', v)} />
                <EditableField label="Département" value="" onSave={(v) => handleFieldSave('Département', v)} />
                <EditableField label="Poste" value={user.metier} onSave={(v) => handleFieldSave('Poste', v)} />
                <EditableField label="ID employé" value="" onSave={(v) => handleFieldSave('ID employé', v)} />
                <EditableField label="Bureau" value="" onSave={(v) => handleFieldSave('Bureau', v)} />
              </div>
            </div>
          </div>
        </Section>

        {/* === CONTACT SECTION === */}
        <Section id="contact" icon={MapPin} title="Coordonnées" subtitle="Téléphone, adresse et localisation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <EditableField label="Email principal" value={user.email} onSave={(v) => handleFieldSave('Email', v)} />
            <EditableField label="Téléphone mobile" value="" onSave={(v) => handleFieldSave('Tel mobile', v)} />
            <EditableField label="Téléphones professionnels" value={user.telephone} onSave={(v) => handleFieldSave('Tel pro', v)} />
            <EditableField label="Adresse" value="" onSave={(v) => handleFieldSave('Adresse', v)} />
            <EditableField label="Ville" value="" onSave={(v) => handleFieldSave('Ville', v)} />
            <EditableField label="Code postal" value="" onSave={(v) => handleFieldSave('Code postal', v)} />
            <EditableField label="Région / État" value="" onSave={(v) => handleFieldSave('Région', v)} />
            <EditableField label="Pays" value="" onSave={(v) => handleFieldSave('Pays', v)} />
          </div>
        </Section>

        {/* === MAILBOX SECTION === */}
        <Section
          id="mailbox"
          icon={Mail}
          title="Boîte mail & Licence"
          subtitle="Stockage, licence M365, aliases et transferts"
          action={
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowUpgradeDialog(true)}>
                <TrendingUp className="h-3 w-3 mr-1" /> Upgrade
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowArchiveDialog(true)}>
                <Archive className="h-3 w-3 mr-1" /> Archiver
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Storage bar */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Stockage utilisé</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {user.stockage.utiliseGo.toFixed(2)} / {user.stockage.quotaGo.toFixed(2)} Go
                </span>
              </div>
              <Progress value={storagePercent} className="h-2.5" />
              <p className="text-xs text-muted-foreground mt-1.5">{storagePercent.toFixed(1)}% utilisé</p>
            </div>

            {/* License */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Licence Microsoft 365</p>
              <p className="font-semibold">{user.licence.label || '—'}</p>
            </div>

            {/* Aliases */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aliases</h4>
                <Button variant="ghost" size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" /> Ajouter</Button>
              </div>
              {user.aliases.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Aucun alias configuré</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.aliases.map((alias) => (
                    <Badge key={alias} variant="outline" className="font-mono text-xs py-1.5 px-3">
                      {alias}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator className="opacity-50" />

            {/* Transfer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <EditableField label="Adresse de transfert" value="" onSave={(v) => handleFieldSave('Transfert', v)} />
              <EditableField label="Redirection" value="Non" onSave={(v) => handleFieldSave('Redirection', v)} />
            </div>

            {/* Members if shared */}
            {user.boitePartagee.estPartagee && user.boitePartagee.membres && (
              <>
                <Separator className="opacity-50" />
                <MembersSection mailboxId={user.id} members={user.boitePartagee.membres} onUpdate={loadUser} />
              </>
            )}
          </div>
        </Section>

        {/* === ACCESS SECTION === */}
        <Section id="access" icon={Globe} title="Accès & Messagerie" subtitle="Serveur, VPN, messages d'absence">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <EditableField label="Serveur" value="" onSave={(v) => handleFieldSave('Serveur', v)} />
            <EditableField label="Droits serveur" value="" onSave={(v) => handleFieldSave('Droits serveur', v)} />
            <EditableField label="VPN" value="Non" onSave={(v) => handleFieldSave('VPN', v)} />
            <EditableField label="Jours VPN" value="" onSave={(v) => handleFieldSave('Jours VPN', v)} />
            <EditableField label="Message d'absence (int.)" value="" onSave={(v) => handleFieldSave('Absence int', v)} />
            <EditableField label="Message d'absence (ext.)" value="" onSave={(v) => handleFieldSave('Absence ext', v)} />
            <EditableField label="Archivage" value="" onSave={(v) => handleFieldSave('Archivage', v)} />
            <EditableField label="Alias principal" value="Non" onSave={(v) => handleFieldSave('Alias principal', v)} />
          </div>
        </Section>

        {/* === SECURITY SECTION === */}
        <Section
          id="security"
          icon={ShieldCheck}
          title="Sécurité"
          subtitle="Mot de passe, MFA et appareils"
          badge={<Badge variant="destructive" className="text-[10px]">MFA désactivé</Badge>}
        >
          <div className="space-y-6">
            {/* Password management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start gap-2 h-12">
                <Eye className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">Révéler le mot de passe</p>
                  <p className="text-[10px] text-muted-foreground">Nécessite rôle ADMIN</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-12">
                <RotateCcw className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">Réinitialiser le mot de passe</p>
                  <p className="text-[10px] text-muted-foreground">Génère un mdp temporaire</p>
                </div>
              </Button>
            </div>

            {/* MFA Warning */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Double authentification non configurée</p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1">
                    Cet utilisateur n'est protégé que par son mot de passe. Recommandation : activer le MFA.
                  </p>
                </div>
              </div>
            </div>

            {/* Devices */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5" /> Appareils Azure AD
              </h4>
              <p className="text-sm text-muted-foreground italic">Aucun appareil enregistré</p>
            </div>
          </div>
        </Section>

        {/* === ACTIVITY SECTION === */}
        <Section
          id="activity"
          icon={Activity}
          title="Activité"
          subtitle="Trafic email et journal d'audit"
          defaultOpen={false}
          badge={<Badge variant="outline" className="text-[10px]">{user.auditLog.length} entrée{user.auditLog.length > 1 ? 's' : ''}</Badge>}
        >
          <div className="space-y-6">
            {/* Chart */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Trafic emails (30 jours)</h4>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={user.activite.envoyes.map((e, i) => ({
                  date: e.date,
                  envoyes: e.count,
                  recus: user.activite.recus[i]?.count || 0,
                }))}>
                  <defs>
                    <linearGradient id="gSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gRecv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }} />
                  <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#gSent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#gRecv)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <Separator className="opacity-50" />

            {/* Audit Log */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Journal d'audit</h4>
              {user.auditLog.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Aucune action enregistrée</p>
              ) : (
                <div className="space-y-2">
                  {user.auditLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/20">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-[10px] h-5">
                            {log.status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{log.user} · {new Date(log.date).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
      </div>

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
