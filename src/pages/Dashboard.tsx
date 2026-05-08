import {
  Users, Mail, HardDrive, CreditCard, TrendingUp, TrendingDown,
  UserPlus, Activity, AlertCircle, CheckCircle2, Clock,
  Zap, Shield, Target, BarChart3, Globe, Sparkles,
  ArrowUpRight, Calendar, ChevronRight, Sun, Moon, Cloud,
  Layers, ArrowRight, Rocket, Bell, Star, Flame
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { mockUsers } from '@/lib/mock-data';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ── Animated counter ──
function useAnimatedValue(target: number, duration = 1200) {
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
  { name: '< 10 Go', value: 35, color: 'hsl(var(--accent))' },
  { name: '10-30 Go', value: 40, color: 'hsl(var(--primary))' },
  { name: '30-50 Go', value: 18, color: 'hsl(var(--warning))' },
  { name: '> 50 Go', value: 7, color: 'hsl(var(--destructive))' },
];

const domainData = [
  { domain: 'comtesse.fr', users: 42, sla: 94, emails: 15240 },
  { domain: 'adi-industrie.fr', users: 28, sla: 89, emails: 9850 },
  { domain: 'partenaires.fr', users: 15, sla: 91, emails: 4320 },
];

const licenseData = [
  { name: 'E3', label: 'Microsoft 365 E3', used: 8, total: 25, color: 'hsl(var(--primary))' },
  { name: 'STD', label: 'Business Standard', used: 12, total: 25, color: 'hsl(var(--accent))' },
  { name: 'APP', label: 'Apps for Business', used: 5, total: 25, color: 'hsl(var(--warning))' },
];

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } }
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
  if (hour < 6) return { text: 'Bonne nuit', icon: Moon, color: 'from-indigo-500/20 to-purple-500/10' };
  if (hour < 12) return { text: 'Bonjour', icon: Sun, color: 'from-amber-400/20 to-orange-400/10' };
  if (hour < 18) return { text: 'Bon après-midi', icon: Cloud, color: 'from-sky-400/20 to-cyan-400/10' };
  return { text: 'Bonsoir', icon: Moon, color: 'from-violet-500/20 to-indigo-500/10' };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'7j' | '30j' | '90j'>('30j');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const sharedMailboxes = mockUsers.filter(u => u.typeBoite === 'partagee').length;
  const avgStorage = Math.round(mockUsers.reduce((acc, u) => acc + u.stockage.utiliseGo, 0) / totalUsers);

  const chartData = useMemo(() => generateChartData(
    chartPeriod === '7j' ? 7 : chartPeriod === '30j' ? 30 : 90
  ), [chartPeriod]);

  const animActiveUsers = useAnimatedValue(activeUsers);
  const animSharedMailboxes = useAnimatedValue(sharedMailboxes);
  const animAvgStorage = useAnimatedValue(avgStorage);
  const animLicenses = useAnimatedValue(activeUsers);

  const greeting = getGreeting(now.getHours());

  const activities = [
    { action: 'Nouvelle boîte créée', user: 'Paul Martin', time: 'il y a 12 min', icon: Users, tone: 'primary' as const },
    { action: 'Licence mise à niveau', user: 'Marie Dubois', time: 'il y a 1 h', icon: CreditCard, tone: 'accent' as const },
    { action: 'Archivage terminé', user: 'compta@exemple.fr', time: 'il y a 3 h', icon: HardDrive, tone: 'warning' as const },
    { action: 'Message d\'absence activé', user: 'Sophie Lefèvre', time: 'il y a 5 h', icon: Calendar, tone: 'primary' as const },
    { action: 'Automatisation déclenchée', user: 'Système', time: 'il y a 8 h', icon: Zap, tone: 'accent' as const },
  ];

  const toneClasses: Record<string, { bg: string; text: string; ring: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20' },
    accent: { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/20' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/20' },
    destructive: { bg: 'bg-destructive/10', text: 'text-destructive', ring: 'ring-destructive/20' },
  };

  const kpis = [
    {
      label: 'Utilisateurs actifs', value: animActiveUsers, suffix: '',
      icon: Users, trend: 5.2, positive: true,
      sub: `sur ${totalUsers} comptes`, ratio: activeUsers / totalUsers,
      spark: sparkData(1), tone: 'primary' as const,
      emoji: '👥',
    },
    {
      label: 'Boîtes partagées', value: animSharedMailboxes, suffix: '',
      icon: Mail, trend: Math.round((sharedMailboxes / totalUsers) * 100), positive: true,
      sub: 'du parc total', ratio: sharedMailboxes / totalUsers,
      spark: sparkData(2), tone: 'accent' as const,
      emoji: '📬',
    },
    {
      label: 'Stockage moyen', value: animAvgStorage, suffix: 'Go',
      icon: HardDrive, trend: 2.1, positive: false,
      sub: 'optimisé ce mois', ratio: avgStorage / 50,
      spark: sparkData(3), tone: 'warning' as const,
      emoji: '💾',
    },
    {
      label: 'Licences actives', value: animLicenses, suffix: '',
      icon: CreditCard, trend: 100, positive: true,
      sub: 'E3 · BS · Apps', ratio: 1,
      spark: sparkData(4), tone: 'primary' as const,
      emoji: '🎟️',
    },
  ];

  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const slaScore = 92;

  return (
    <motion.div className="space-y-6 pb-12" variants={stagger} initial="hidden" animate="show">

      {/* ─── HERO ─── */}
      <motion.div variants={fadeUp}>
        <div className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${greeting.color} backdrop-blur-sm`}>
          {/* decorative blobs */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

          <div className="relative p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Greeting */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="rounded-full bg-background/60 backdrop-blur border-border/60 gap-1.5 px-3 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-[11px] font-medium">Tous les services en ligne</span>
                </Badge>
                <Badge variant="outline" className="rounded-full bg-background/60 backdrop-blur border-border/60 px-3 py-1">
                  <span className="text-[11px] font-medium capitalize">{dateStr} · {timeStr}</span>
                </Badge>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  className="h-12 w-12 rounded-2xl bg-background/70 backdrop-blur flex items-center justify-center shadow-sm"
                >
                  <greeting.icon className="h-6 w-6 text-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {greeting.text}, Antoine 👋
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
                <Button variant="outline" onClick={() => navigate('/performance-kpi')} className="rounded-full gap-2 bg-background/60 backdrop-blur">
                  <BarChart3 className="h-4 w-4" /> Voir les KPI
                </Button>
                <Button variant="ghost" onClick={() => navigate('/demandes')} className="rounded-full gap-2">
                  <Bell className="h-4 w-4" /> 12 demandes ouvertes
                </Button>
              </div>
            </div>

            {/* SLA radial */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative h-48 w-48">
                <ResponsiveContainer>
                  <RadialBarChart
                    innerRadius="70%"
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
                  <span className="text-4xl font-bold text-foreground tabular-nums">{slaScore}<span className="text-lg text-muted-foreground">%</span></span>
                  <Badge className="mt-1 bg-accent/15 text-accent border-0 rounded-full text-[10px]">
                    <Star className="h-2.5 w-2.5 mr-1" /> Excellent
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── KPI CARDS ─── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {kpis.map((kpi, i) => {
          const t = toneClasses[kpi.tone];
          return (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}>
              <Card className="group relative overflow-hidden border-border rounded-2xl shadow-sm hover:shadow-lg transition-all">
                {/* tinted top accent */}
                <div className={`absolute inset-x-0 top-0 h-1 ${t.bg.replace('/10', '/50')}`} />
                <CardContent className="p-5">
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

                  {/* sparkline */}
                  <div className="h-10 -mx-1 mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={kpi.spark} margin={{ top: 1, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`sp${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          className={t.text}
                          stroke="currentColor"
                          strokeWidth={2}
                          fill={`url(#sp${i})`}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── ALERTS ─── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: AlertCircle, title: '3 boîtes critiques', desc: 'Stockage > 90% — action rapide recommandée', tone: 'destructive' as const, cta: 'Voir' },
          { icon: Clock, title: '12 demandes en attente', desc: 'Délai moyen 2,5 jours', tone: 'warning' as const, cta: 'Traiter' },
          { icon: CheckCircle2, title: 'SLA 92% respecté', desc: 'Cible 90% atteinte ce mois', tone: 'accent' as const, cta: 'Détails' },
        ].map((a, i) => {
          const t = toneClasses[a.tone];
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

      {/* ─── MAIN GRID ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Email activity */}
        <motion.div className="xl:col-span-8" variants={fadeUp}>
          <Card className="border-border rounded-2xl shadow-sm h-full">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Activité des emails</h3>
                    <p className="text-xs text-muted-foreground">Volume quotidien envoyés / reçus / traités</p>
                  </div>
                </div>
                <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                  <TabsList className="h-8 rounded-full bg-muted p-0.5">
                    <TabsTrigger value="7j" className="text-[11px] h-7 px-3 rounded-full">7 jours</TabsTrigger>
                    <TabsTrigger value="30j" className="text-[11px] h-7 px-3 rounded-full">30 jours</TabsTrigger>
                    <TabsTrigger value="90j" className="text-[11px] h-7 px-3 rounded-full">90 jours</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex flex-wrap gap-5 mb-3">
                {[
                  { label: 'Envoyés', value: '12 400', color: 'hsl(var(--primary))' },
                  { label: 'Reçus', value: '18 700', color: 'hsl(var(--accent))' },
                  { label: 'Traités', value: '15 200', color: 'hsl(var(--warning))' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <span className="text-sm font-bold text-foreground tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gEnvoyes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gRecus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gTraites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickMargin={8} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickMargin={4} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--accent))" fill="url(#gRecus)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="traites" name="Traités" stroke="hsl(var(--warning))" fill="url(#gTraites)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--primary))" fill="url(#gEnvoyes)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <motion.div className="xl:col-span-4 space-y-5" variants={fadeUp}>
          {/* Storage */}
          <Card className="border-border rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Stockage</h3>
                  <p className="text-xs text-muted-foreground">Répartition par tranche</p>
                </div>
              </div>
              <div className="space-y-3">
                {storageData.map((s, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </span>
                      <span className="font-bold text-foreground tabular-nums">{s.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, value: '99.8%', label: 'Disponibilité', tone: 'accent' as const },
              { icon: Target, value: '4.2 h', label: 'Réponse', tone: 'primary' as const },
              { icon: Zap, value: '156', label: 'Actions', tone: 'warning' as const },
              { icon: Flame, value: '23', label: 'Automations', tone: 'destructive' as const },
            ].map((s, i) => {
              const t = toneClasses[s.tone];
              return (
                <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.03 }}>
                  <Card className="p-4 border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl ${t.bg} ${t.text} flex items-center justify-center flex-shrink-0`}>
                        <s.icon className="h-4 w-4" strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-bold text-foreground leading-tight tabular-nums">{s.value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ─── DOMAINS + LICENSES + ACTIVITY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Domains */}
        <motion.div className="lg:col-span-5" variants={fadeUp}>
          <Card className="h-full border-border rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Top domaines</h3>
                    <p className="text-xs text-muted-foreground">Performance email</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/performance-kpi')} className="rounded-full text-xs gap-1">
                  Détails <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-2">
                {domainData.map((d, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate('/performance-kpi')}
                    whileHover={{ x: 3 }}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm
                      ${i === 0 ? 'bg-warning/15 text-warning' : i === 1 ? 'bg-muted text-muted-foreground' : 'bg-accent/10 text-accent'}`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">@{d.domain}</p>
                      <p className="text-xs text-muted-foreground">{d.users} utilisateurs · {d.emails.toLocaleString('fr-FR')} messages</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-sm font-bold tabular-nums ${d.sla >= 90 ? 'text-accent' : 'text-warning'}`}>
                        {d.sla}%
                      </span>
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${d.sla >= 90 ? 'bg-accent' : 'bg-warning'}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.sla}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Licenses */}
        <motion.div className="lg:col-span-3" variants={fadeUp}>
          <Card className="h-full border-border rounded-2xl shadow-sm">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Licences</h3>
                  <p className="text-xs text-muted-foreground">Usage actuel</p>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                {licenseData.map((l, i) => {
                  const pct = (l.used / l.total) * 100;
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{l.label}</span>
                        <span className="text-xs font-bold text-foreground tabular-nums flex-shrink-0">
                          {l.used}<span className="text-muted-foreground">/{l.total}</span>
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: l.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button className="w-full mt-5 rounded-full" variant="outline" onClick={() => navigate('/licences')}>
                Gérer les licences
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div className="lg:col-span-4" variants={fadeUp}>
          <Card className="h-full border-border rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Activité récente</h3>
                  <p className="text-xs text-muted-foreground">Dernières actions du jour</p>
                </div>
              </div>
              <div className="space-y-1">
                {activities.map((act, i) => {
                  const t = toneClasses[act.tone];
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className={`h-9 w-9 rounded-xl ${t.bg} ${t.text} flex items-center justify-center flex-shrink-0`}>
                        <act.icon className="h-4 w-4" strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{act.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{act.user}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{act.time}</span>
                    </motion.div>
                  );
                })}
              </div>
              <Button className="w-full mt-4 rounded-full" variant="outline" onClick={() => navigate('/demandes')}>
                Voir toute l'activité
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
