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
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { mockUsers } from '@/lib/mock-data';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Animated counter hook ──
function useAnimatedValue(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
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
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } }
};

// ── Radial gauge component ──
function RadialGauge({ value, max, color, label, size = 80 }: { value: number; max: number; color: string; label: string; size?: number }) {
  const percentage = (value / max) * 100;
  const data = [{ value: percentage, fill: color }];
  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer>
          <RadialBarChart innerRadius="75%" outerRadius="100%" data={data} startAngle={90} endAngle={-270} barSize={6}>
            <RadialBar background dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

// ── Custom tooltip ──
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value?.toLocaleString('fr-FR')}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'7j' | '30j' | '90j'>('30j');
  
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
    { action: 'Message d\'absence activé', user: 'Sophie Lefèvre', time: 'Hier', icon: Calendar, variant: 'primary' as const },
    { action: 'Automatisation déclenchée', user: 'Système', time: 'Il y a 2j', icon: Zap, variant: 'accent' as const },
  ];

  const variantColors: Record<string, { bg: string; text: string }> = {
    accent: { bg: 'bg-accent/10', text: 'text-accent' },
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
  };

  return (
    <motion.div className="space-y-6 pb-8" variants={stagger} initial="hidden" animate="show">

      {/* ─── HEADER ─── */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {/* Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Tableau de bord</h1>
                    <p className="text-sm text-muted-foreground">Microsoft 365 · Vue d'ensemble en temps réel</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-3">
                  <Badge variant="outline" className="gap-1.5 font-normal bg-accent/5 border-accent/20 text-accent">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    En ligne
                  </Badge>
                  <Badge variant="outline" className="gap-1.5 font-normal">
                    <Clock className="h-3 w-3" />
                    Mis à jour il y a 2 min
                  </Badge>
                </div>
              </div>
              <Button onClick={() => navigate('/actions')} className="gap-2 shadow-sm">
                <UserPlus className="h-4 w-4" />
                Actions rapides
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── KPI METRICS ─── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {[
          { 
            label: 'Utilisateurs actifs', value: animActiveUsers, suffix: '',
            icon: Users, trend: '+5.2%', positive: true, 
            sub: `sur ${totalUsers} comptes`,
            color: 'text-accent', bg: 'bg-accent/8', border: 'hover:border-accent/30',
            gauge: { value: activeUsers, max: totalUsers, color: 'hsl(var(--accent))' }
          },
          { 
            label: 'Boîtes partagées', value: animSharedMailboxes, suffix: '',
            icon: Mail, trend: `${Math.round((sharedMailboxes / totalUsers) * 100)}%`, positive: true,
            sub: 'du total des boîtes',
            color: 'text-primary', bg: 'bg-primary/8', border: 'hover:border-primary/30',
            gauge: { value: sharedMailboxes, max: totalUsers, color: 'hsl(var(--primary))' }
          },
          { 
            label: 'Stockage moyen', value: animAvgStorage, suffix: ' Go',
            icon: HardDrive, trend: '-2.1%', positive: false,
            sub: 'Optimisé ce mois',
            color: 'text-warning', bg: 'bg-warning/8', border: 'hover:border-warning/30',
            gauge: { value: avgStorage, max: 50, color: 'hsl(var(--warning))' }
          },
          { 
            label: 'Licences actives', value: animLicenses, suffix: '',
            icon: CreditCard, trend: '100%', positive: true,
            sub: 'E3, Business Standard',
            color: 'text-primary', bg: 'bg-primary/8', border: 'hover:border-primary/30',
            gauge: { value: activeUsers, max: 30, color: 'hsl(var(--primary))' }
          },
        ].map((kpi, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Card className={`group transition-all duration-300 hover:shadow-lg ${kpi.border} cursor-default`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-9 w-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <RadialGauge 
                    value={kpi.gauge.value} 
                    max={kpi.gauge.max} 
                    color={kpi.gauge.color} 
                    label="" 
                    size={44} 
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground tabular-nums">{kpi.value}{kpi.suffix}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 h-5 font-semibold ${kpi.positive ? 'bg-accent/10 text-accent hover:bg-accent/15' : 'bg-destructive/10 text-destructive hover:bg-destructive/15'}`}>
                      {kpi.positive ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                      {kpi.trend}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── ALERTS ─── */}
      <motion.div variants={fadeUp}>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { icon: AlertCircle, title: '3 boîtes critiques', desc: 'Stockage > 90%', color: 'destructive' },
            { icon: Clock, title: '12 demandes en attente', desc: 'Moy. 2.5 jours', color: 'warning' },
            { icon: CheckCircle2, title: 'SLA: 92% respecté', desc: 'Objectif: 90%', color: 'accent' },
          ].map((alert, i) => (
            <motion.div 
              key={i} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-${alert.color}/5 border-${alert.color}/20 hover:border-${alert.color}/40 transition-colors cursor-pointer min-w-fit flex-1`}
              whileHover={{ scale: 1.01 }}
            >
              <alert.icon className={`h-4 w-4 text-${alert.color} flex-shrink-0`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.desc}</p>
              </div>
              <ChevronRight className={`h-4 w-4 text-${alert.color} flex-shrink-0 ml-auto`} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── MAIN CHARTS ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Email activity - 8 cols */}
        <motion.div className="xl:col-span-8" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Activité des emails
                  </CardTitle>
                  <CardDescription>Volume quotidien des messages</CardDescription>
                </div>
                <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="7j" className="text-xs h-6 px-2.5">7 jours</TabsTrigger>
                    <TabsTrigger value="30j" className="text-xs h-6 px-2.5">30 jours</TabsTrigger>
                    <TabsTrigger value="90j" className="text-xs h-6 px-2.5">90 jours</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {/* Mini summary */}
              <div className="flex gap-4 mt-3">
                {[
                  { label: 'Envoyés', value: '12.4k', color: 'bg-primary' },
                  { label: 'Reçus', value: '18.7k', color: 'bg-accent' },
                  { label: 'Traités', value: '15.2k', color: 'bg-warning' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${s.color}`} />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <span className="text-xs font-semibold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
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

        {/* Right column - Storage + Quick stats */}
        <motion.div className="xl:col-span-4 space-y-6" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {/* Storage breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Server className="h-4 w-4 text-warning" />
                Stockage
              </CardTitle>
              <CardDescription>Répartition par tranche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {storageData.map((s, i) => {
                const barWidth = `${s.value}%`;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{s.name}</span>
                      <span className="font-semibold text-foreground">{s.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.fill }}
                        initial={{ width: 0 }}
                        whileInView={{ width: barWidth }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, value: '99.8%', label: 'Dispo.', color: 'text-accent', bg: 'bg-accent/8' },
              { icon: Target, value: '4.2h', label: 'Réponse', color: 'text-primary', bg: 'bg-primary/8' },
              { icon: Zap, value: '156', label: 'Actions', color: 'text-warning', bg: 'bg-warning/8' },
              { icon: Layers, value: '23', label: 'Auto.', color: 'text-primary', bg: 'bg-primary/8' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-3 hover:shadow-md transition-shadow cursor-default group">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground leading-tight">{s.value}</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Domains */}
        <motion.div className="lg:col-span-5" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-accent" />
                    Domaines
                  </CardTitle>
                  <CardDescription>Performance email par domaine</CardDescription>
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
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/40 hover:border-primary/15 transition-all cursor-pointer group"
                  onClick={() => navigate('/performance-kpi')}
                  whileHover={{ x: 2 }}
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.domain}</p>
                    <p className="text-xs text-muted-foreground">{d.users} users · {d.emails.toLocaleString('fr-FR')} emails</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-bold ${d.sla >= 90 ? 'text-accent' : 'text-warning'}`}>{d.sla}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase">SLA</div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Licenses */}
        <motion.div className="lg:col-span-3" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Licences
              </CardTitle>
              <CardDescription>Utilisation par type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={licenseData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 25]} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={35} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="used" name="Utilisées" radius={[0, 4, 4, 0]} barSize={14}>
                    {licenseData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {licenseData.map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.fill }} />
                      <span className="text-muted-foreground">{l.name === 'E3' ? 'Microsoft 365 E3' : l.name === 'Std' ? 'Business Standard' : 'Apps for Business'}</span>
                    </div>
                    <span className="font-semibold text-foreground">{l.used}/{l.total}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 h-8 text-xs" variant="outline" onClick={() => navigate('/licences')}>
                Gérer les licences
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div className="lg:col-span-4" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" />
                Activité récente
              </CardTitle>
              <CardDescription>Dernières actions effectuées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-0.5">
                  {activities.map((act, i) => {
                    const c = variantColors[act.variant];
                    return (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer relative"
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className={`w-[35px] h-[35px] rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                          <act.icon className={`h-4 w-4 ${c.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{act.action}</p>
                          <p className="text-xs text-muted-foreground">{act.user}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{act.time}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <Button className="w-full mt-3 h-8 text-xs" variant="outline" onClick={() => navigate('/demandes')}>
                Tout voir
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
