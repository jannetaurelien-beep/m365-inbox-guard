import {
  Users, Mail, HardDrive, CreditCard, TrendingUp, TrendingDown,
  Activity, AlertCircle, CheckCircle2, Clock, Zap, Shield,
  BarChart3, Sparkles, ArrowUpRight, Calendar, ChevronRight,
  Sun, Moon, Cloud, Rocket, Bell, Star, Server, Globe, Plus,
  Search, Filter, MoreHorizontal, Inbox, Send, ShieldCheck, Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';
import { mockUsers } from '@/lib/mock-data';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Animated counter ──
function useAnimatedValue(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);
  return value;
}

const generateChartData = (days: number) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const base = Math.sin(i * 0.3) * 150;
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      envoyes: Math.floor(Math.abs(base) + Math.random() * 200 + 300),
      recus: Math.floor(Math.abs(base + 50) + Math.random() * 300 + 500),
      traites: Math.floor(Math.abs(base + 20) + Math.random() * 250 + 350),
    });
  }
  return data;
};

const sparkData = (seed: number) =>
  Array.from({ length: 20 }, (_, i) => ({ v: Math.round(50 + Math.sin(i * 0.6 + seed) * 25 + Math.random() * 12) }));

const storageData = [
  { name: '< 10 Go', value: 35 },
  { name: '10-30 Go', value: 40 },
  { name: '30-50 Go', value: 18 },
  { name: '> 50 Go', value: 7 },
];

const domainData = [
  { domain: 'comtesse.fr', users: 42, sla: 94, emails: 15240 },
  { domain: 'adi-industrie.fr', users: 28, sla: 89, emails: 9850 },
  { domain: 'partenaires.fr', users: 15, sla: 91, emails: 4320 },
];

const licenseData = [
  { name: 'Microsoft 365 E3', short: 'E3', used: 18, total: 25, tone: 'primary' as const },
  { name: 'Business Standard', short: 'BS', used: 12, total: 25, tone: 'accent' as const },
  { name: 'Apps for Business', short: 'APP', used: 5, total: 25, tone: 'warning' as const },
];

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 26 } }
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-3 py-0.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="font-semibold text-foreground tabular-nums ml-auto">{p.value?.toLocaleString('fr-FR')}</span>
        </div>
      ))}
    </div>
  );
};

function getGreeting(hour: number) {
  if (hour < 6) return { text: 'Bonne nuit', icon: Moon, accent: 'from-indigo-500/30 via-violet-500/15 to-transparent' };
  if (hour < 12) return { text: 'Bonjour', icon: Sun, accent: 'from-amber-400/30 via-orange-400/15 to-transparent' };
  if (hour < 18) return { text: 'Bon après-midi', icon: Cloud, accent: 'from-sky-400/30 via-cyan-400/15 to-transparent' };
  return { text: 'Bonsoir', icon: Moon, accent: 'from-violet-500/30 via-indigo-500/15 to-transparent' };
}

const toneMap: Record<string, { bg: string; text: string; ring: string; soft: string; gradient: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/15', soft: 'bg-primary/5', gradient: 'from-primary/20 to-primary/5' },
  accent: { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/15', soft: 'bg-accent/5', gradient: 'from-accent/20 to-accent/5' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/15', soft: 'bg-warning/5', gradient: 'from-warning/20 to-warning/5' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive', ring: 'ring-destructive/15', soft: 'bg-destructive/5', gradient: 'from-destructive/20 to-destructive/5' },
};

// ─── Loading skeleton ───
function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-12">
      <Skeleton className="h-48 w-full rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Skeleton className="xl:col-span-8 h-96 rounded-2xl" />
        <Skeleton className="xl:col-span-4 h-96 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[0,1,2].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'7j' | '30j' | '90j'>('30j');
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const sharedMailboxes = mockUsers.filter(u => u.typeBoite === 'partagee').length;
  const avgStorage = Math.round(mockUsers.reduce((acc, u) => acc + u.stockage.utiliseGo, 0) / totalUsers);

  const chartData = useMemo(() => generateChartData(
    chartPeriod === '7j' ? 7 : chartPeriod === '30j' ? 30 : 90
  ), [chartPeriod]);

  const animActive = useAnimatedValue(activeUsers);
  const animShared = useAnimatedValue(sharedMailboxes);
  const animAvg = useAnimatedValue(avgStorage);
  const animLic = useAnimatedValue(35);

  const greeting = getGreeting(now.getHours());

  const kpis = [
    { label: 'Utilisateurs actifs', value: animActive, suffix: '', icon: Users, trend: 5.2, positive: true, sub: `sur ${totalUsers} comptes`, spark: sparkData(1), tone: 'primary' as const },
    { label: 'Boîtes partagées', value: animShared, suffix: '', icon: Inbox, trend: 8.4, positive: true, sub: 'du parc total', spark: sparkData(2), tone: 'accent' as const },
    { label: 'Stockage moyen', value: animAvg, suffix: 'Go', icon: HardDrive, trend: 2.1, positive: false, sub: 'optimisé ce mois', spark: sparkData(3), tone: 'warning' as const },
    { label: 'Licences attribuées', value: animLic, suffix: '/75', icon: CreditCard, trend: 12, positive: true, sub: 'E3 · BS · Apps', spark: sparkData(4), tone: 'primary' as const },
  ];

  const activities = [
    { action: 'Nouvelle boîte créée', user: 'Paul Martin', time: 'il y a 12 min', icon: Users, tone: 'primary' as const },
    { action: 'Licence E3 attribuée', user: 'Marie Dubois', time: 'il y a 1 h', icon: CreditCard, tone: 'accent' as const },
    { action: 'Archivage terminé', user: 'compta@exemple.fr', time: 'il y a 3 h', icon: HardDrive, tone: 'warning' as const },
    { action: 'Message d\'absence activé', user: 'Sophie Lefèvre', time: 'il y a 5 h', icon: Calendar, tone: 'primary' as const },
    { action: 'Automatisation déclenchée', user: 'Système', time: 'il y a 8 h', icon: Zap, tone: 'accent' as const },
  ];

  const quickActions = [
    { label: 'Créer un utilisateur', icon: Users, path: '/utilisateurs/nouveau', tone: 'primary' as const },
    { label: 'Attribuer licence', icon: CreditCard, path: '/licences', tone: 'accent' as const },
    { label: 'Audit sécurité', icon: ShieldCheck, path: '/cybersecurity', tone: 'warning' as const },
    { label: 'Nouvelle automation', icon: Zap, path: '/automations', tone: 'primary' as const },
  ];

  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const slaScore = 92;

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div className="space-y-6 pb-12" variants={stagger} initial="hidden" animate="show">

      {/* ─── HERO ─── */}
      <motion.div variants={fadeUp}>
        <div className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${greeting.accent} backdrop-blur-sm`}>
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline" className="rounded-full bg-background/70 backdrop-blur border-border/60 gap-1.5 px-3 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-[11px] font-medium">Tous les services en ligne</span>
                </Badge>
                <Badge variant="outline" className="rounded-full bg-background/70 backdrop-blur border-border/60 px-3 py-1">
                  <span className="text-[11px] font-medium capitalize">{dateStr} · {timeStr}</span>
                </Badge>
                <Badge variant="outline" className="rounded-full bg-background/70 backdrop-blur border-border/60 px-3 py-1 gap-1.5">
                  <Server className="h-3 w-3" />
                  <span className="text-[11px] font-medium">Tenant : IT-GRCS</span>
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-2">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  className="h-14 w-14 rounded-2xl bg-background/80 backdrop-blur flex items-center justify-center shadow-sm border border-border/40"
                >
                  <greeting.icon className="h-7 w-7 text-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {greeting.text}, Antoine
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ rotate: [0, 14, -8, 14, 0] }}
                      transition={{ duration: 1.4, delay: 0.6 }}
                    >👋</motion.span>
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Voici un aperçu de votre environnement Microsoft 365 aujourd'hui.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <Button onClick={() => navigate('/actions')} className="rounded-full gap-2 shadow-md">
                  <Rocket className="h-4 w-4" /> Nouvelle action
                </Button>
                <Button variant="outline" onClick={() => navigate('/performance-kpi')} className="rounded-full gap-2 bg-background/70 backdrop-blur">
                  <BarChart3 className="h-4 w-4" /> Voir les KPI
                </Button>
                <Button variant="ghost" onClick={() => navigate('/demandes')} className="rounded-full gap-2">
                  <Bell className="h-4 w-4" /> 12 demandes ouvertes
                </Button>
              </div>
            </div>

            {/* SLA radial */}
            <div className="flex items-center justify-center lg:justify-end">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.3 }}
                className="relative h-52 w-52"
              >
                <ResponsiveContainer>
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={[{ value: slaScore, fill: 'hsl(var(--accent))' }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'hsl(var(--muted))' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score SLA</span>
                  <span className="text-5xl font-bold text-foreground tabular-nums">{slaScore}<span className="text-lg text-muted-foreground">%</span></span>
                  <Badge className="mt-1 bg-accent/15 text-accent border-0 rounded-full text-[10px]">
                    <Star className="h-2.5 w-2.5 mr-1" /> Excellent
                  </Badge>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── KPI CARDS ─── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {kpis.map((kpi, i) => {
          const t = toneMap[kpi.tone];
          return (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}>
              <Card className="group relative overflow-hidden border-border rounded-2xl shadow-sm hover:shadow-lg transition-all">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.gradient}`} />
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${t.soft} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="p-5 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-11 w-11 rounded-2xl ${t.bg} ${t.text} flex items-center justify-center ring-4 ${t.ring}`}>
                      <kpi.icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <Badge variant="outline" className={`rounded-full gap-0.5 text-[10px] border-0 ${kpi.positive ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
                      {kpi.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {kpi.trend}%
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{kpi.value}</span>
                    <span className="text-sm text-muted-foreground">{kpi.suffix}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>

                  <div className="h-10 -mx-1 mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={kpi.spark} margin={{ top: 1, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`sp${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" className={t.text} stroke="currentColor" strokeWidth={2} fill={`url(#sp${i})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── QUICK ACTIONS ─── */}
      <motion.div variants={fadeUp}>
        <Card className="border-border rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Actions rapides</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-xs rounded-full" onClick={() => navigate('/actions')}>
                Tout voir <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((qa, i) => {
                const t = toneMap[qa.tone];
                return (
                  <motion.button
                    key={i}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(qa.path)}
                    className={`group relative overflow-hidden flex items-center gap-3 p-3 rounded-xl border border-border ${t.soft} hover:border-primary/30 transition-all text-left`}
                  >
                    <div className={`h-10 w-10 rounded-xl ${t.bg} ${t.text} flex items-center justify-center flex-shrink-0`}>
                      <qa.icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{qa.label}</p>
                      <p className="text-[11px] text-muted-foreground">Lancer</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── MAIN GRID : chart + activity ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <motion.div className="xl:col-span-8" variants={fadeUp}>
          <Card className="border-border rounded-2xl shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Activité messagerie</h2>
                    <p className="text-xs text-muted-foreground">Volumes envoyés, reçus et traités</p>
                  </div>
                </div>
                <Tabs value={chartPeriod} onValueChange={(v: any) => setChartPeriod(v)}>
                  <TabsList className="rounded-full h-8">
                    <TabsTrigger value="7j" className="rounded-full text-xs px-3">7 j</TabsTrigger>
                    <TabsTrigger value="30j" className="rounded-full text-xs px-3">30 j</TabsTrigger>
                    <TabsTrigger value="90j" className="rounded-full text-xs px-3">90 j</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gRecus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gEnvoyes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gTraites" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#gRecus)" />
                    <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#gEnvoyes)" />
                    <Area type="monotone" dataKey="traites" name="Traités" stroke="hsl(var(--warning))" strokeWidth={2.5} fill="url(#gTraites)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                {[
                  { label: 'Reçus', value: chartData.reduce((a, b) => a + b.recus, 0), color: 'bg-primary' },
                  { label: 'Envoyés', value: chartData.reduce((a, b) => a + b.envoyes, 0), color: 'bg-accent' },
                  { label: 'Traités', value: chartData.reduce((a, b) => a + b.traites, 0), color: 'bg-warning' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${s.color}`} />
                    <div>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-semibold text-foreground tabular-nums">{s.value.toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div className="xl:col-span-4" variants={fadeUp}>
          <Card className="border-border rounded-2xl shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Activité récente</h2>
                    <p className="text-xs text-muted-foreground">Derniers événements du tenant</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-[19px] top-1 bottom-1 w-px bg-border" />
                <div className="space-y-4">
                  {activities.map((a, i) => {
                    const t = toneMap[a.tone];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="relative flex gap-3 items-start group cursor-pointer"
                      >
                        <div className={`relative z-10 h-10 w-10 rounded-full ${t.bg} ${t.text} flex items-center justify-center ring-4 ring-background flex-shrink-0`}>
                          <a.icon className="h-4 w-4" strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{a.action}</p>
                          <p className="text-xs text-muted-foreground truncate">{a.user}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {a.time}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full rounded-full mt-5" onClick={() => navigate('/notifications')}>
                Voir tout le journal <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── BOTTOM GRID : licences / stockage / domaines ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Licences */}
        <motion.div variants={fadeUp}>
          <Card className="border-border rounded-2xl shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Licences M365</h2>
                    <p className="text-xs text-muted-foreground">Utilisation par offre</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={() => navigate('/licences')}>
                  Gérer <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Button>
              </div>

              <div className="space-y-4">
                {licenseData.map((l, i) => {
                  const t = toneMap[l.tone];
                  const pct = Math.round((l.used / l.total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`h-6 w-6 rounded-md ${t.bg} ${t.text} text-[10px] font-bold flex items-center justify-center`}>{l.short}</span>
                          <span className="text-sm text-foreground">{l.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          <span className="font-semibold text-foreground">{l.used}</span> / {l.total}
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${t.bg.replace('/10', '')} ${t.text.replace('text-', 'bg-')}`}
                          style={{ backgroundColor: 'currentColor' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total attribué</p>
                  <p className="text-xl font-bold text-foreground tabular-nums">35<span className="text-sm text-muted-foreground"> / 75</span></p>
                </div>
                <Badge className="bg-accent/15 text-accent border-0 rounded-full">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> 40 disponibles
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stockage */}
        <motion.div variants={fadeUp}>
          <Card className="border-border rounded-2xl shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
                    <HardDrive className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Répartition stockage</h2>
                    <p className="text-xs text-muted-foreground">Par tranche d'utilisation</p>
                  </div>
                </div>
              </div>

              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storageData} layout="vertical" margin={{ top: 5, right: 10, left: 50, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={60} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                    <Bar dataKey="value" name="Utilisateurs" radius={[0, 8, 8, 0]}>
                      {storageData.map((_, i) => (
                        <Cell key={i} fill={['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--destructive))'][i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-[11px] text-muted-foreground">Moyenne</p>
                  <p className="text-base font-semibold text-foreground tabular-nums">{avgStorage} Go</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground">Plafond</p>
                  <p className="text-base font-semibold text-foreground tabular-nums">50 Go</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Domaines */}
        <motion.div variants={fadeUp}>
          <Card className="border-border rounded-2xl shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Domaines</h2>
                    <p className="text-xs text-muted-foreground">Performance par domaine</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {domainData.map((d, i) => {
                  const slaColor = d.sla >= 90 ? 'text-accent' : d.sla >= 80 ? 'text-warning' : 'text-destructive';
                  const slaBg = d.sla >= 90 ? 'bg-accent/10' : d.sla >= 80 ? 'bg-warning/10' : 'bg-destructive/10';
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-border">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground text-xs font-semibold">
                          {d.domain.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{d.domain}</p>
                        <p className="text-[11px] text-muted-foreground">{d.users} utilisateurs · {d.emails.toLocaleString('fr-FR')} mails</p>
                      </div>
                      <Badge className={`${slaBg} ${slaColor} border-0 rounded-full tabular-nums`}>
                        {d.sla}%
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>

              <Button variant="outline" size="sm" className="w-full rounded-full mt-4" onClick={() => navigate('/performance-kpi')}>
                Comparer les domaines <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── ALERTS BAND ─── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: AlertCircle, title: '3 boîtes critiques', desc: 'Stockage > 90%', tone: 'destructive' as const, cta: 'Voir' },
          { icon: Clock, title: '12 demandes en attente', desc: 'Délai moyen 2,5 j', tone: 'warning' as const, cta: 'Traiter' },
          { icon: ShieldCheck, title: 'Score sécurité 87/100', desc: 'Bon niveau global', tone: 'accent' as const, cta: 'Auditer' },
        ].map((a, i) => {
          const t = toneMap[a.tone];
          return (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -2 }}>
              <Card className="border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-2xl ${t.bg} ${t.text} flex items-center justify-center flex-shrink-0`}>
                    <a.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full gap-1 text-xs flex-shrink-0">
                    {a.cta} <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

    </motion.div>
  );
}
