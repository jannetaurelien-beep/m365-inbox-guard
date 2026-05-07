import {
  Users, Mail, HardDrive, CreditCard, TrendingUp, TrendingDown,
  UserPlus, Activity, AlertCircle, CheckCircle2, Clock,
  Zap, Shield, Target, BarChart3, Globe, Building2,
  ArrowUpRight, Sparkles, Calendar, ChevronRight,
  Server, Layers, ArrowRight, CircleDot, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { mockUsers } from '@/lib/mock-data';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ── Animated counter hook ──
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

// ── Data generators ──
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
  Array.from({ length: 14 }, (_, i) => ({ v: Math.round(50 + Math.sin(i * 0.6 + seed) * 25 + Math.random() * 15) }));

const storageData = [
  { name: '< 10 Go', value: 35, fill: 'hsl(var(--accent))' },
  { name: '10-30 Go', value: 40, fill: 'hsl(var(--primary))' },
  { name: '30-50 Go', value: 18, fill: 'hsl(var(--warning))' },
  { name: '> 50 Go', value: 7, fill: 'hsl(var(--destructive))' },
];

const domainData = [
  { domain: '@comtesse.fr', users: 42, sla: 94, emails: 15240 },
  { domain: '@adi-industrie.fr', users: 28, sla: 89, emails: 9850 },
  { domain: '@partenaires.fr', users: 15, sla: 91, emails: 4320 },
];

const licenseData = [
  { name: 'E3', used: 8, total: 25, fill: 'hsl(var(--primary))' },
  { name: 'Std', used: 12, total: 25, fill: 'hsl(var(--accent))' },
  { name: 'Apps', used: 5, total: 25, fill: 'hsl(var(--warning))' },
];

// ── Motion variants ──
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 22 } }
};

// ── Custom tooltip ──
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover/95 backdrop-blur-xl border border-border/60 rounded-xl p-3 shadow-2xl text-sm">
      <p className="font-semibold text-foreground mb-1.5 text-xs uppercase tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
          <span className="text-muted-foreground text-xs">{p.name}</span>
          <span className="font-semibold text-foreground tabular-nums ml-auto">{p.value?.toLocaleString('fr-FR')}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'7j' | '30j' | '90j'>('30j');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
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

  const activities = [
    { action: 'Nouvelle boîte créée', user: 'Paul Martin', time: 'Il y a 2h', icon: Users, variant: 'accent' as const },
    { action: 'Licence mise à niveau', user: 'Marie Dubois', time: 'Il y a 5h', icon: CreditCard, variant: 'primary' as const },
    { action: 'Archivage terminé', user: 'Compta@exemple.fr', time: 'Hier', icon: HardDrive, variant: 'warning' as const },
    { action: "Message d'absence activé", user: 'Sophie Lefèvre', time: 'Hier', icon: Calendar, variant: 'primary' as const },
    { action: 'Automatisation déclenchée', user: 'Système', time: 'Il y a 2j', icon: Zap, variant: 'accent' as const },
  ];

  const variantColors: Record<string, { bg: string; text: string; ring: string }> = {
    accent: { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/20' },
    primary: { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/20' },
  };

  const kpis = [
    {
      label: 'Utilisateurs actifs', value: animActiveUsers, suffix: '',
      icon: Users, trend: '+5.2%', positive: true,
      sub: `${activeUsers} / ${totalUsers} comptes`,
      tone: 'accent', spark: sparkData(1),
    },
    {
      label: 'Boîtes partagées', value: animSharedMailboxes, suffix: '',
      icon: Mail, trend: `${Math.round((sharedMailboxes / totalUsers) * 100)}%`, positive: true,
      sub: 'du total des boîtes',
      tone: 'primary', spark: sparkData(2),
    },
    {
      label: 'Stockage moyen', value: animAvgStorage, suffix: ' Go',
      icon: HardDrive, trend: '-2.1%', positive: false,
      sub: 'Optimisé ce mois',
      tone: 'warning', spark: sparkData(3),
    },
    {
      label: 'Licences actives', value: animLicenses, suffix: '',
      icon: CreditCard, trend: '100%', positive: true,
      sub: 'E3, Business Standard',
      tone: 'primary', spark: sparkData(4),
    },
  ];

  const toneMap: Record<string, { text: string; stroke: string; bg: string; chip: string }> = {
    accent: { text: 'text-accent', stroke: 'hsl(var(--accent))', bg: 'bg-accent/10', chip: 'bg-accent/10 text-accent' },
    primary: { text: 'text-primary', stroke: 'hsl(var(--primary))', bg: 'bg-primary/10', chip: 'bg-primary/10 text-primary' },
    warning: { text: 'text-warning', stroke: 'hsl(var(--warning))', bg: 'bg-warning/10', chip: 'bg-warning/10 text-warning' },
  };

  const greeting = (() => {
    const h = now.getHours();
    if (h < 6) return 'Bonne nuit';
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  })();

  return (
    <motion.div className="space-y-6 pb-10" variants={stagger} initial="hidden" animate="show">

      {/* ─── HERO ─── */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/30">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

          <div className="relative p-7 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                    Tableau de bord · Microsoft 365
                  </span>
                </div>

                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.05]">
                    {greeting}, <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">tout va bien</span>.
                  </h1>
                  <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                    {totalUsers} utilisateurs supervisés · SLA 92% · Synchronisé{' '}
                    <span className="text-foreground font-medium">il y a 2 min</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <Button onClick={() => navigate('/actions')} className="gap-2 shadow-md h-10 rounded-xl">
                    <UserPlus className="h-4 w-4" />
                    Actions rapides
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/performance-kpi')} className="gap-2 h-10 rounded-xl">
                    <BarChart3 className="h-4 w-4" />
                    Voir les KPI
                  </Button>
                </div>
              </div>

              {/* Live clock card */}
              <div className="flex items-center gap-4">
                {[
                  { v: '99.8%', l: 'Disponibilité', tone: 'accent' },
                  { v: '4.2h', l: 'Temps réponse', tone: 'primary' },
                  { v: '23', l: 'Automations', tone: 'warning' },
                ].map((s, i) => (
                  <div key={i} className="hidden md:flex flex-col items-end gap-0.5 px-4 border-l border-border/60 first:border-l-0 first:pl-0">
                    <span className={`text-2xl font-bold ${toneMap[s.tone].text} tabular-nums`}>{s.v}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── KPI METRICS ─── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {kpis.map((kpi, i) => {
          const t = toneMap[kpi.tone];
          return (
            <motion.div key={i} variants={fadeUp}>
              <Card className="group relative overflow-hidden border-border/60 hover:border-border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${t.text} opacity-40`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl ${t.bg} flex items-center justify-center ring-1 ring-inset ring-border/50`}>
                      <kpi.icon className={`h-4.5 w-4.5 ${t.text}`} />
                    </div>
                    <Badge className={`text-[10px] px-2 h-5 font-semibold border-0 ${kpi.positive ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
                      {kpi.positive ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                      {kpi.trend}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">{kpi.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{kpi.value}</span>
                      <span className="text-sm text-muted-foreground font-medium">{kpi.suffix}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
                  </div>

                  {/* Sparkline */}
                  <div className="h-10 -mx-1 mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={kpi.spark} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`sp${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={t.stroke} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={t.stroke} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={1.5} fill={`url(#sp${i})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── ALERTS STRIP ─── */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: AlertCircle, title: '3 boîtes critiques', desc: 'Stockage > 90%', color: 'destructive' },
            { icon: Clock, title: '12 demandes en attente', desc: 'Moy. 2.5 jours', color: 'warning' },
            { icon: CheckCircle2, title: 'SLA: 92% respecté', desc: 'Objectif: 90%', color: 'accent' },
          ].map((alert, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-${alert.color}/5 border-${alert.color}/20 hover:border-${alert.color}/40 hover:bg-${alert.color}/10 transition-all cursor-pointer group`}
              whileHover={{ y: -2 }}
            >
              <div className={`h-9 w-9 rounded-xl bg-${alert.color}/15 flex items-center justify-center flex-shrink-0`}>
                <alert.icon className={`h-4 w-4 text-${alert.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.desc}</p>
              </div>
              <ChevronRight className={`h-4 w-4 text-${alert.color} flex-shrink-0 group-hover:translate-x-0.5 transition-transform`} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── MAIN CHARTS ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Email activity */}
        <motion.div className="xl:col-span-8" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full border-border/60 overflow-hidden">
            <CardHeader className="pb-2 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-inset ring-primary/20">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Activité des emails</CardTitle>
                    <CardDescription className="text-xs">Volume quotidien des messages</CardDescription>
                  </div>
                </div>
                <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                  <TabsList className="h-8 bg-background/80 border border-border/60">
                    <TabsTrigger value="7j" className="text-xs h-6 px-3">7j</TabsTrigger>
                    <TabsTrigger value="30j" className="text-xs h-6 px-3">30j</TabsTrigger>
                    <TabsTrigger value="90j" className="text-xs h-6 px-3">90j</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex gap-5 mt-4">
                {[
                  { label: 'Envoyés', value: '12.4k', color: 'bg-primary', text: 'text-primary' },
                  { label: 'Reçus', value: '18.7k', color: 'bg-accent', text: 'text-accent' },
                  { label: 'Traités', value: '15.2k', color: 'bg-warning', text: 'text-warning' },
                ].map((s, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <div className={`h-2 w-2 rounded-full ${s.color}`} />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                    <span className={`text-sm font-bold ${s.text} tabular-nums`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gEnvoyes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gRecus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gTraites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickMargin={8} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickMargin={4} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--accent))" fill="url(#gRecus)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="traites" name="Traités" stroke="hsl(var(--warning))" fill="url(#gTraites)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--primary))" fill="url(#gEnvoyes)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <motion.div className="xl:col-span-4 space-y-5" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {/* Storage breakdown */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-warning/10 flex items-center justify-center ring-1 ring-inset ring-warning/20">
                  <Server className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Stockage</CardTitle>
                  <CardDescription className="text-xs">Répartition par tranche</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {storageData.map((s, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-bold text-foreground tabular-nums">{s.value}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.fill }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, value: '99.8%', label: 'Dispo.', color: 'text-accent', bg: 'bg-accent/10' },
              { icon: Target, value: '4.2h', label: 'Réponse', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Zap, value: '156', label: 'Actions', color: 'text-warning', bg: 'bg-warning/10' },
              { icon: Layers, value: '23', label: 'Auto.', color: 'text-primary', bg: 'bg-primary/10' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -2 }}>
                <Card className="p-3.5 border-border/60 hover:shadow-md transition-all cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground leading-tight tabular-nums">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── DOMAINS + LICENSES + ACTIVITY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Domains */}
        <motion.div className="lg:col-span-5" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center ring-1 ring-inset ring-accent/20">
                    <Globe className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Domaines</CardTitle>
                    <CardDescription className="text-xs">Performance email par domaine</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/performance-kpi')} className="text-xs gap-1 h-7">
                  Détails <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {domainData.map((d, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-muted/40 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => navigate('/performance-kpi')}
                  whileHover={{ x: 3 }}
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{d.domain}</p>
                    <p className="text-xs text-muted-foreground">{d.users} users · {d.emails.toLocaleString('fr-FR')} emails</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xl font-bold tabular-nums ${d.sla >= 90 ? 'text-accent' : 'text-warning'}`}>{d.sla}<span className="text-xs">%</span></div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">SLA</div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Licenses */}
        <motion.div className="lg:col-span-3" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-inset ring-primary/20">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Licences</CardTitle>
                  <CardDescription className="text-xs">Utilisation par type</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={licenseData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 25]} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={35} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="used" name="Utilisées" radius={[0, 6, 6, 0]} barSize={14}>
                    {licenseData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3 pt-3 border-t border-border/40">
                {licenseData.map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.fill }} />
                      <span className="text-muted-foreground">{l.name === 'E3' ? 'Microsoft 365 E3' : l.name === 'Std' ? 'Business Standard' : 'Apps for Business'}</span>
                    </div>
                    <span className="font-bold text-foreground tabular-nums">{l.used}/{l.total}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 h-8 text-xs rounded-lg" variant="outline" onClick={() => navigate('/licences')}>
                Gérer les licences
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div className="lg:col-span-4" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center ring-1 ring-inset ring-accent/20">
                  <Activity className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Activité récente</CardTitle>
                  <CardDescription className="text-xs">Dernières actions effectuées</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                <div className="space-y-1">
                  {activities.map((act, i) => {
                    const c = variantColors[act.variant];
                    return (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer relative"
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className={`w-9 h-9 rounded-xl ${c.bg} ring-2 ring-background flex items-center justify-center flex-shrink-0 z-10`}>
                          <act.icon className={`h-4 w-4 ${c.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{act.action}</p>
                          <p className="text-xs text-muted-foreground">{act.user}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">{act.time}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <Button className="w-full mt-3 h-8 text-xs rounded-lg" variant="outline" onClick={() => navigate('/demandes')}>
                Tout voir
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
