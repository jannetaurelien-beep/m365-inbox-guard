import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, Archive, TrendingUp, Shield, 
  Activity, Calendar, Clock, Send, Inbox, HardDrive, Crown, Zap, 
  ChevronRight, ExternalLink, Copy, CheckCircle2, Globe, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { User } from '@/lib/mock-data';
import { userService, licenseService, mailboxService } from '@/lib/services';
import { PasswordSection } from '@/components/user-detail/PasswordSection';
import { AliasSection } from '@/components/user-detail/AliasSection';
import { MembersSection } from '@/components/user-detail/MembersSection';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
};

function StatCard({ icon: Icon, label, value, sub, color = 'primary', delay = 0 }: {
  icon: any; label: string; value: string | number; sub?: string; color?: string; delay?: number;
}) {
  const colorMap: Record<string, string> = {
    primary: 'from-primary/15 to-primary/5 text-primary border-primary/20',
    accent: 'from-accent/15 to-accent/5 text-accent border-accent/20',
    warning: 'from-warning/15 to-warning/5 text-warning border-warning/20',
    destructive: 'from-destructive/15 to-destructive/5 text-destructive border-destructive/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className={`relative overflow-hidden border bg-gradient-to-br ${colorMap[color]} hover:shadow-lg transition-all duration-300 group cursor-default`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
            </div>
            <div className="p-2.5 rounded-xl bg-background/80 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CopyableText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors group/copy">
      <span>{text}</span>
      {copied ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-0 group-hover/copy:opacity-60 transition-opacity" />
      )}
    </button>
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
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { loadUser(); }, [id]);

  const loadUser = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await userService.getUser(id);
      setUser(data || null);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeLicense = async () => {
    if (!user || !selectedLicense) return;
    try {
      await licenseService.upgradeLicense(user.id, selectedLicense);
      toast.success("Demande d'upgrade envoyée");
      addNotification({ type: 'info', title: "Demande d'upgrade de licence", message: `Demande d'upgrade pour ${user.prenom} ${user.nom}`, actionUrl: '/licences' });
      setShowUpgradeDialog(false);
    } catch { toast.error("Erreur lors de l'upgrade"); }
  };

  const handleRequestArchive = async () => {
    if (!user) return;
    try {
      await mailboxService.requestArchive(user.id, '2020-01-01', '2023-12-31');
      toast.success("Demande d'archivage créée");
      addNotification({ type: 'info', title: "Demande d'archivage", message: `Demande d'archivage pour ${user.prenom} ${user.nom}`, actionUrl: '/demandes' });
      setShowArchiveDialog(false);
    } catch { toast.error('Erreur lors de la demande'); }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Mail className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Utilisateur introuvable</h2>
        <Button onClick={() => navigate('/utilisateurs')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la liste
        </Button>
      </div>
    );
  }

  const storagePercent = (user.stockage.utiliseGo / user.stockage.quotaGo) * 100;
  const licenses = licenseService.getLicenses();
  const storageColor = storagePercent > 90 ? 'destructive' : storagePercent > 70 ? 'warning' : 'accent';

  const chartData = user.activite.envoyes.map((e, i) => ({
    date: e.date.slice(5),
    envoyes: e.count,
    recus: user.activite.recus[i]?.count || 0,
  }));

  const totalSent = user.activite.envoyes.reduce((s, e) => s + e.count, 0);
  const totalReceived = user.activite.recus.reduce((s, e) => s + e.count, 0);
  const avgDaily = Math.round((totalSent + totalReceived) / Math.max(user.activite.envoyes.length, 1));

  return (
    <motion.div className="space-y-6" initial="initial" animate="animate" variants={stagger}>
      {/* Breadcrumb header */}
      <motion.div {...fadeUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/utilisateurs')} className="rounded-xl hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => navigate('/utilisateurs')}>Utilisateurs</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{user.prenom} {user.nom}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUpgradeDialog(true)} className="rounded-xl">
            <TrendingUp className="h-4 w-4 mr-1.5" /> Upgrade
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowArchiveDialog(true)} className="rounded-xl">
            <Archive className="h-4 w-4 mr-1.5" /> Archiver
          </Button>
        </div>
      </motion.div>

      {/* Hero card */}
      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <Card className="relative overflow-hidden border-0 shadow-lg">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          
          <CardContent className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
                <img
                  src={user.avatarUrl}
                  alt={`${user.prenom} ${user.nom}`}
                  className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover ring-2 ring-background shadow-xl"
                />
                <div className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-background ${user.status === 'active' ? 'bg-accent' : 'bg-muted-foreground'}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                      {user.prenom} {user.nom}
                    </h1>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="rounded-lg px-3">
                      {user.status === 'active' ? '● Actif' : '○ Inactif'}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg px-3">
                      {user.typeBoite === 'nominative' ? 'Nominative' : 'Partagée'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-lg">{user.metier}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Email</p>
                      <CopyableText text={user.email} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Téléphone</p>
                      <CopyableText text={user.telephone} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Agence</p>
                      <p className="text-sm font-medium">{user.agence}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
                    <Crown className="h-4 w-4 text-warning shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Licence</p>
                      <p className="text-sm font-medium">{user.licence.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Send} label="Envoyés" value={totalSent} sub={`${chartData.length} jours`} color="primary" delay={0.1} />
        <StatCard icon={Inbox} label="Reçus" value={totalReceived} sub={`${chartData.length} jours`} color="accent" delay={0.15} />
        <StatCard icon={Activity} label="Moy/jour" value={avgDaily} sub="emails" color="primary" delay={0.2} />
        <StatCard icon={HardDrive} label="Stockage" value={`${user.stockage.utiliseGo} Go`} sub={`/ ${user.stockage.quotaGo} Go`} color={storageColor} delay={0.25} />
      </div>

      {/* Storage bar - full width */}
      <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Utilisation du stockage</span>
              </div>
              <span className="text-sm font-semibold">
                {storagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="relative">
              <Progress value={storagePercent} className="h-3 rounded-full" />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{user.stockage.utiliseGo} Go utilisés</span>
              <span>{(user.stockage.quotaGo - user.stockage.utiliseGo).toFixed(1)} Go disponibles</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <Activity className="h-4 w-4" /> Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4" /> Sécurité
            </TabsTrigger>
            <TabsTrigger value="audit" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <Clock className="h-4 w-4" /> Audit
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="mt-6">
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Activity chart */}
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Activité emails
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">Volume d'emails envoyés et reçus</p>
                      </div>
                      <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                        <TabsList className="h-9">
                          <TabsTrigger value="7j" className="text-xs px-3">7j</TabsTrigger>
                          <TabsTrigger value="30j" className="text-xs px-3">30j</TabsTrigger>
                          <TabsTrigger value="90j" className="text-xs px-3">90j</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradReceived" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px -10px hsl(var(--foreground) / 0.1)',
                          }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#gradSent)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#gradReceived)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Ratio chart */}
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Zap className="h-5 w-5 text-warning" />
                      Ratio envoi/réception par jour
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                        <Bar dataKey="envoyes" name="Envoyés" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="recus" name="Reçus" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Aliases & Members in grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AliasSection userId={user.id} aliases={user.aliases} onUpdate={loadUser} />
                  {user.boitePartagee.estPartagee && user.boitePartagee.membres && (
                    <MembersSection mailboxId={user.id} members={user.boitePartagee.membres} onUpdate={loadUser} />
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* SECURITY TAB */}
            <TabsContent value="security" className="mt-6">
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <PasswordSection userId={user.id} />
                
                {/* Security overview card */}
                <Card className="overflow-hidden">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">État de sécurité</h3>
                        <p className="text-sm text-muted-foreground">Résumé des protections actives</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      {[
                        { label: 'Authentification MFA', status: true, detail: 'Microsoft Authenticator' },
                        { label: 'Mot de passe fort', status: true, detail: 'Dernière modification il y a 45 jours' },
                        { label: 'Accès conditionnel', status: true, detail: 'Politique standard appliquée' },
                        { label: 'Session active', status: user.status === 'active', detail: user.status === 'active' ? 'Dernière connexion aujourd\'hui' : 'Aucune session active' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.status ? 'bg-accent' : 'bg-muted-foreground'}`} />
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.detail}</p>
                            </div>
                          </div>
                          <Badge variant={item.status ? 'default' : 'secondary'} className="text-[10px]">
                            {item.status ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* AUDIT TAB */}
            <TabsContent value="audit" className="mt-6">
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Journal d'audit</h3>
                        <p className="text-sm text-muted-foreground">Historique des actions et modifications</p>
                      </div>
                    </div>
                    
                    {user.auditLog.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 rounded-2xl bg-muted/50 mb-4">
                          <Clock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Aucune activité récente</p>
                        <p className="text-xs text-muted-foreground mt-1">Les actions seront enregistrées ici</p>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />
                        
                        <div className="space-y-1">
                          {user.auditLog.map((log, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="relative flex items-start gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors group"
                            >
                              {/* Timeline dot */}
                              <div className={`relative z-10 w-[10px] h-[10px] rounded-full mt-1.5 ring-4 ring-background ${
                                log.status === 'success' ? 'bg-accent' : 'bg-destructive'
                              }`} />
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-medium">{log.action}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                                  </div>
                                  <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="shrink-0 text-[10px]">
                                    {log.status === 'success' ? 'Succès' : 'Erreur'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(log.date).toLocaleDateString('fr-FR')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(log.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span>par {log.user}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      {/* Dialogs */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Upgrade de licence
            </DialogTitle>
            <DialogDescription>Sélectionnez la nouvelle licence pour {user.prenom} {user.nom}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedLicense} onValueChange={setSelectedLicense}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choisir une licence" /></SelectTrigger>
              <SelectContent>
                {licenses.map((lic) => (
                  <SelectItem key={lic.skuId} value={lic.skuId}>{lic.label} — {lic.prixMensuel}€/mois</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLicense && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
                <p className="font-medium text-primary">{licenses.find(l => l.skuId === selectedLicense)?.label}</p>
                <p className="text-muted-foreground mt-1">{licenses.find(l => l.skuId === selectedLicense)?.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)} className="rounded-xl">Annuler</Button>
            <Button onClick={handleUpgradeLicense} disabled={!selectedLicense} className="rounded-xl">Confirmer l'upgrade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-primary" /> Demande d'archivage
            </DialogTitle>
            <DialogDescription>Archivage des emails anciens pour libérer de l'espace</DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl text-sm space-y-2">
            <p className="font-medium text-warning">⚠️ Action importante</p>
            <p className="text-muted-foreground">Les emails de plus de 2 ans seront archivés. Cette opération libérera environ {Math.round(user.stockage.utiliseGo * 0.3)} Go d'espace.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)} className="rounded-xl">Annuler</Button>
            <Button onClick={handleRequestArchive} className="rounded-xl">Créer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
