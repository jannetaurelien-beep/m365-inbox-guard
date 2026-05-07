import {
  Users, Mail, HardDrive, CreditCard, TrendingUp, TrendingDown,
  UserPlus, Activity, AlertCircle, CheckCircle2, Clock,
  Zap, Shield, Target, BarChart3, Globe, Building2,
  ArrowUpRight, Calendar, ChevronRight, Cpu,
  Server, Layers, ArrowRight, Radio, Hash, Terminal, Database
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { mockUsers } from '@/lib/mock-data';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ── Animated counter ──
function useAnimatedValue(target: number, duration = 1000) {
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
  { name: 'E3', label: 'Microsoft 365 E3', used: 8, total: 25 },
  { name: 'STD', label: 'Business Standard', used: 12, total: 25 },
  { name: 'APP', label: 'Apps for Business', used: 5, total: 25 },
];

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } }
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-md p-2.5 shadow-xl text-xs font-mono">
      <p className="font-semibold text-foreground mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-3 py-0.5">
          <div className="w-1.5 h-1.5" style={{ backgroundColor: p.stroke || p.fill }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="font-semibold text-foreground tabular-nums ml-auto">{p.value?.toLocaleString('fr-FR')}</span>
        </div>
      ))}
    </div>
  );
};

// ── Section header (technical style) ──
function SectionHeader({ id, title, subtitle, icon: Icon, action }: any) {
  return (
    <div className="flex items-end justify-between mb-2 pb-2 border-b border-border/60">
      <div className="flex items-center gap-2.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{id}</span>
        <span className="text-foreground font-semibold text-sm">{title}</span>
        {subtitle && <span className="text-xs text-muted-foreground">· {subtitle}</span>}
      </div>
      {action}
    </div>
  );
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

  const activities = [
    { code: 'MBX.CREATE', action: 'Nouvelle boîte créée', user: 'paul.martin', time: '14:32', icon: Users, level: 'info' as const },
    { code: 'LIC.UPGRADE', action: 'Licence mise à niveau', user: 'marie.dubois', time: '11:08', icon: CreditCard, level: 'info' as const },
    { code: 'STG.ARCHIVE', action: 'Archivage terminé', user: 'compta@exemple.fr', time: '08:45', icon: HardDrive, level: 'warn' as const },
    { code: 'OOO.ENABLE', action: 'Message d\'absence activé', user: 'sophie.lefevre', time: '08:12', icon: Calendar, level: 'info' as const },
    { code: 'AUTO.RUN', action: 'Automatisation déclenchée', user: 'system', time: '06:00', icon: Zap, level: 'ok' as const },
  ];

  const levelStyle: Record<string, { dot: string; text: string }> = {
    ok: { dot: 'bg-accent', text: 'text-accent' },
    info: { dot: 'bg-primary', text: 'text-primary' },
    warn: { dot: 'bg-warning', text: 'text-warning' },
    err: { dot: 'bg-destructive', text: 'text-destructive' },
  };

  const kpis = [
    {
      id: 'M01', label: 'Utilisateurs actifs', value: animActiveUsers, suffix: '',
      icon: Users, trend: '+5.2%', positive: true,
      sub: `${activeUsers} / ${totalUsers}`, ratio: activeUsers / totalUsers,
      spark: sparkData(1),
    },
    {
      id: 'M02', label: 'Boîtes partagées', value: animSharedMailboxes, suffix: '',
      icon: Mail, trend: `${Math.round((sharedMailboxes / totalUsers) * 100)}%`, positive: true,
      sub: 'du parc total', ratio: sharedMailboxes / totalUsers,
      spark: sparkData(2),
    },
    {
      id: 'M03', label: 'Stockage moyen', value: animAvgStorage, suffix: 'Go',
      icon: HardDrive, trend: '−2.1%', positive: false,
      sub: 'optimisé ce mois', ratio: avgStorage / 50,
      spark: sparkData(3),
    },
    {
      id: 'M04', label: 'Licences actives', value: animLicenses, suffix: '',
      icon: CreditCard, trend: '100%', positive: true,
      sub: 'E3 · BS · Apps', ratio: 1,
      spark: sparkData(4),
    },
  ];

  const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false });
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <motion.div className="space-y-5 pb-10" variants={stagger} initial="hidden" animate="show">

      {/* ─── HEADER (technical bar) ─── */}
      <motion.div variants={fadeUp}>
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-stretch divide-x divide-border">
            {/* Left: identity */}
            <div className="flex-1 p-5 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Online</span>
                </div>
                <span className="text-border">·</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">SYS / Microsoft 365</span>
                <span className="text-border">·</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">v2.4.1</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Tableau de bord
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {totalUsers} utilisateurs · SLA 92% · sync 2 min · uptime 99.8%
              </p>
            </div>

            {/* Middle: live clock */}
            <div className="hidden md:flex flex-col justify-center px-6 py-5 min-w-[180px]">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Heure système</span>
              <span className="font-mono text-2xl font-bold text-foreground tabular-nums tracking-tight mt-1">{timeStr}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 capitalize">{dateStr}</span>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 p-5">
              <Button variant="outline" onClick={() => navigate('/performance-kpi')} className="gap-2 h-9 text-xs font-medium">
                <BarChart3 className="h-3.5 w-3.5" /> KPI
              </Button>
              <Button onClick={() => navigate('/actions')} className="gap-2 h-9 text-xs font-medium shadow-sm">
                <UserPlus className="h-3.5 w-3.5" /> Actions
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* status strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border divide-x divide-border">
            {[
              { label: 'Disponibilité', value: '99.80', unit: '%', dot: 'bg-accent' },
              { label: 'Temps réponse', value: '4.2', unit: 'h', dot: 'bg-primary' },
              { label: 'Automations', value: '23', unit: '', dot: 'bg-warning' },
              { label: 'Demandes', value: '12', unit: 'open', dot: 'bg-warning' },
            ].map((s, i) => (
              <div key={i} className="px-5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-base font-bold text-foreground tabular-nums">{s.value}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── KPI METRICS ─── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" variants={stagger}>
        {kpis.map((kpi, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Card className="group relative overflow-hidden border-border hover:border-foreground/30 transition-colors rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{kpi.id}</span>
                  </div>
                  <span className={`font-mono text-[10px] tabular-nums ${kpi.positive ? 'text-accent' : 'text-destructive'} flex items-center gap-0.5`}>
                    {kpi.positive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {kpi.trend}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-foreground tabular-nums tracking-tight font-mono">{kpi.value}</span>
                  <span className="text-xs text-muted-foreground font-mono">{kpi.suffix}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-mono">{kpi.sub}</p>

                {/* progress bar */}
                <div className="mt-3 h-0.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(kpi.ratio * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>

                {/* sparkline */}
                <div className="h-8 -mx-1 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpi.spark} margin={{ top: 1, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`sp${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="hsl(var(--foreground))" strokeOpacity={0.6} strokeWidth={1} fill={`url(#sp${i})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── ALERTS STRIP ─── */}
      <motion.div variants={fadeUp}>
        <div className="rounded-xl border border-border bg-card overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border md:grid md:grid-cols-3">
          {[
            { icon: AlertCircle, code: 'ERR.STG-090', title: '3 boîtes critiques', desc: 'stockage > 90%', color: 'text-destructive', dot: 'bg-destructive' },
            { icon: Clock, code: 'WRN.SLA-PND', title: '12 demandes en attente', desc: 'moy. 2.5 jours', color: 'text-warning', dot: 'bg-warning' },
            { icon: CheckCircle2, code: 'OK.SLA-92', title: 'SLA 92% respecté', desc: 'cible 90%', color: 'text-accent', dot: 'bg-accent' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer group">
              <div className={`h-1.5 w-1.5 rounded-full ${a.dot} flex-shrink-0`} />
              <a.icon className={`h-4 w-4 ${a.color} flex-shrink-0`} strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{a.code}</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{a.desc}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── MAIN CHARTS ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Email activity */}
        <motion.div className="xl:col-span-8" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="border-border rounded-xl">
            <CardContent className="p-5">
              <SectionHeader
                id="C01"
                icon={Activity}
                title="Activité des emails"
                subtitle="volume quotidien"
                action={
                  <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                    <TabsList className="h-7 bg-muted/40 p-0.5">
                      <TabsTrigger value="7j" className="text-[10px] h-6 px-2.5 font-mono">7J</TabsTrigger>
                      <TabsTrigger value="30j" className="text-[10px] h-6 px-2.5 font-mono">30J</TabsTrigger>
                      <TabsTrigger value="90j" className="text-[10px] h-6 px-2.5 font-mono">90J</TabsTrigger>
                    </TabsList>
                  </Tabs>
                }
              />
              <div className="flex gap-5 my-3">
                {[
                  { label: 'Envoyés', value: '12 400', stroke: 'hsl(var(--primary))' },
                  { label: 'Reçus', value: '18 700', stroke: 'hsl(var(--accent))' },
                  { label: 'Traités', value: '15 200', stroke: 'hsl(var(--warning))' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2 w-2" style={{ backgroundColor: s.stroke }} />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                    <span className="font-mono text-sm font-bold text-foreground tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gEnvoyes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gRecus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gTraites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={9} tickMargin={8} axisLine={false} tickLine={false} className="font-mono" />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} tickMargin={4} axisLine={false} tickLine={false} className="font-mono" />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--accent))" fill="url(#gRecus)" strokeWidth={1.5} dot={false} />
                  <Area type="monotone" dataKey="traites" name="Traités" stroke="hsl(var(--warning))" fill="url(#gTraites)" strokeWidth={1.5} dot={false} />
                  <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--primary))" fill="url(#gEnvoyes)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <motion.div className="xl:col-span-4 space-y-5" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {/* Storage breakdown */}
          <Card className="border-border rounded-xl">
            <CardContent className="p-5">
              <SectionHeader id="C02" icon={Database} title="Stockage" subtitle="par tranche" />
              <div className="space-y-3 mt-3">
                {storageData.map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">{s.name}</span>
                      <span className="font-bold text-foreground tabular-nums">{s.value.toString().padStart(2, '0')}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-foreground/70"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, value: '99.8%', label: 'Dispo' },
              { icon: Target, value: '4.2h', label: 'Réponse' },
              { icon: Zap, value: '156', label: 'Actions' },
              { icon: Layers, value: '23', label: 'Auto' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-3 border-border rounded-lg hover:border-foreground/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <s.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={2} />
                    <div className="min-w-0">
                      <div className="text-base font-bold text-foreground leading-tight tabular-nums font-mono">{s.value}</div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-mono">{s.label}</div>
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
          <Card className="h-full border-border rounded-xl">
            <CardContent className="p-5">
              <SectionHeader
                id="C03"
                icon={Globe}
                title="Domaines"
                subtitle="performance email"
                action={
                  <Button variant="ghost" size="sm" onClick={() => navigate('/performance-kpi')} className="text-[10px] gap-1 h-6 font-mono uppercase tracking-wider">
                    Détails <ArrowUpRight className="h-3 w-3" />
                  </Button>
                }
              />
              <div className="mt-2 divide-y divide-border/60">
                {domainData.map((d, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors cursor-pointer group"
                    onClick={() => navigate('/performance-kpi')}
                    whileHover={{ x: 2 }}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">0{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate font-mono">@{d.domain}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{d.users} users · {d.emails.toLocaleString('fr-FR')} msg</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${d.sla >= 90 ? 'bg-accent' : 'bg-warning'}`}
                          style={{ width: `${d.sla}%` }}
                        />
                      </div>
                      <span className={`font-mono text-sm font-bold tabular-nums w-10 text-right ${d.sla >= 90 ? 'text-accent' : 'text-warning'}`}>
                        {d.sla}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Licenses */}
        <motion.div className="lg:col-span-3" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full border-border rounded-xl">
            <CardContent className="p-5 flex flex-col h-full">
              <SectionHeader id="C04" icon={CreditCard} title="Licences" subtitle="usage" />
              <div className="flex-1 mt-3 space-y-3">
                {licenseData.map((l, i) => {
                  const pct = (l.used / l.total) * 100;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{l.name}</span>
                          <span className="text-xs text-foreground">{l.label}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-foreground tabular-nums">{l.used}<span className="text-muted-foreground">/{l.total}</span></span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-foreground/70"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button className="w-full mt-4 h-8 text-[10px] font-mono uppercase tracking-wider" variant="outline" onClick={() => navigate('/licences')}>
                Gérer
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed - log style */}
        <motion.div className="lg:col-span-4" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full border-border rounded-xl">
            <CardContent className="p-5">
              <SectionHeader id="C05" icon={Terminal} title="Journal d'activité" subtitle="temps réel" />
              <div className="mt-3 divide-y divide-border/40">
                {activities.map((act, i) => {
                  const lvl = levelStyle[act.level];
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2.5 py-2 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{act.time}</span>
                      <div className={`h-1.5 w-1.5 rounded-full ${lvl.dot} flex-shrink-0`} />
                      <span className={`font-mono text-[9px] uppercase tracking-wider ${lvl.text} w-20 truncate`}>{act.code}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate">{act.action}</p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">{act.user}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <Button className="w-full mt-3 h-8 text-[10px] font-mono uppercase tracking-wider" variant="outline" onClick={() => navigate('/demandes')}>
                Voir tous les logs
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
