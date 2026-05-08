import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users, BarChart3, PieChart, Zap, Crown, Shield, Sparkles, ChevronRight,
  Search, Download, TrendingUp, Eye, Layers, Award, ArrowUpRight, Gauge
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockLicenses, mockUsers } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import {
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar, PolarAngleAxis,
  AreaChart, Area, CartesianGrid
} from 'recharts';

// Palette via tokens sémantiques
const tonePalette = [
  { token: 'primary', color: 'hsl(var(--primary))', bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20' },
  { token: 'accent', color: 'hsl(var(--accent))', bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/20' },
  { token: 'warning', color: 'hsl(var(--warning))', bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/20' },
  { token: 'destructive', color: 'hsl(var(--destructive))', bg: 'bg-destructive/10', text: 'text-destructive', ring: 'ring-destructive/20' },
];

const enrichedLicenses = mockLicenses.map((license, index) => {
  const usersWithLicense = mockUsers.filter(u => u.licence.label === license.label);
  const tone = tonePalette[index % tonePalette.length];
  const userCount = usersWithLicense.length > 0 ? usersWithLicense.length : Math.floor(Math.random() * 200) + 20;
  return {
    ...license,
    userCount,
    totalSeats: userCount + Math.floor(Math.random() * 50) + 10,
    users: usersWithLicense.length > 0 ? usersWithLicense : mockUsers.slice(0, Math.min(5, mockUsers.length)),
    tone,
    trend: Math.floor(Math.random() * 20) - 5,
  };
});

const trendData = [
  { month: 'Jan', total: 480 },
  { month: 'Fév', total: 495 },
  { month: 'Mar', total: 510 },
  { month: 'Avr', total: 525 },
  { month: 'Mai', total: 535 },
  { month: 'Juin', total: 542 },
];

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 24 } }
};

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

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-xl text-xs">
      {label && <p className="font-semibold text-foreground mb-1.5">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.payload?.color || p.fill || p.stroke }} />
          <span className="text-muted-foreground">{p.name || p.payload?.name}</span>
          <span className="font-bold text-foreground tabular-nums ml-auto">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Licenses() {
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [graphLimit, setGraphLimit] = useState('8');

  const totalUsers = enrichedLicenses.reduce((acc, l) => acc + l.userCount, 0);
  const totalSeats = enrichedLicenses.reduce((acc, l) => acc + l.totalSeats, 0);
  const usagePct = Math.round((totalUsers / totalSeats) * 100);
  const topLicense = enrichedLicenses.reduce((a, b) => a.userCount > b.userCount ? a : b);

  const animTotal = useAnimatedValue(totalUsers);
  const animUsage = useAnimatedValue(usagePct);

  const limit = graphLimit === 'all' ? enrichedLicenses.length : parseInt(graphLimit);

  const pieData = useMemo(() => enrichedLicenses.slice(0, limit).map((l) => ({
    name: l.label.replace('Microsoft 365 ', '').replace('Exchange Online ', 'Exchange '),
    value: l.userCount,
    color: l.tone.color,
  })), [limit]);

  const barData = useMemo(() => enrichedLicenses.slice(0, limit).map((l) => ({
    name: l.label.replace('Microsoft 365 ', '').replace('Exchange Online ', 'Exch. '),
    comptes: l.userCount,
    color: l.tone.color,
  })), [limit]);

  const selectedLicenseData = selectedLicense !== 'all'
    ? enrichedLicenses.find(l => l.skuId === selectedLicense)
    : null;

  const displayedUsers = selectedLicenseData ? selectedLicenseData.users : mockUsers;
  const filteredUsers = displayedUsers.filter(u =>
    `${u.prenom} ${u.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div className="space-y-6 pb-12" variants={stagger} initial="hidden" animate="show">

      {/* ─── HERO ─── */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-accent/10 to-warning/10 backdrop-blur-sm">
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

          <div className="relative p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="rounded-full bg-background/60 backdrop-blur border-border/60 gap-1.5 px-3 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-[11px] font-medium">Synchronisé avec Microsoft 365</span>
                </Badge>
                <Badge variant="outline" className="rounded-full bg-background/60 backdrop-blur border-border/60 px-3 py-1">
                  <Crown className="h-3 w-3 mr-1 text-warning" />
                  <span className="text-[11px] font-medium">{enrichedLicenses.length} types actifs</span>
                </Badge>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  className="h-12 w-12 rounded-2xl bg-background/70 backdrop-blur flex items-center justify-center shadow-sm"
                >
                  <Layers className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    Gestion des licences
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pilotez votre parc Microsoft 365 — utilisation, attribution et tendances.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    className="pl-10 w-72 rounded-full bg-background/70 backdrop-blur border-border/60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedLicense} onValueChange={setSelectedLicense}>
                  <SelectTrigger className="w-56 rounded-full bg-background/70 backdrop-blur border-border/60">
                    <SelectValue placeholder="Toutes les licences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les licences</SelectItem>
                    {enrichedLicenses.map(l => (
                      <SelectItem key={l.skuId} value={l.skuId}>{l.label.replace('Microsoft 365 ', '')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="rounded-full gap-2 bg-background/70 backdrop-blur">
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
              </div>
            </div>

            {/* Gauge usage global */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative h-48 w-48">
                <ResponsiveContainer>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[{ value: usagePct, fill: 'hsl(var(--primary))' }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'hsl(var(--muted))' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Usage global</span>
                  <span className="text-4xl font-bold text-foreground tabular-nums">{animUsage}<span className="text-lg text-muted-foreground">%</span></span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{totalUsers} / {totalSeats} sièges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── KPI ─── */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {[
          { icon: Users, label: 'Comptes attribués', value: animTotal, sub: '+12% ce mois', trend: 12, tone: tonePalette[0] },
          { icon: Shield, label: 'Licences distinctes', value: enrichedLicenses.length, sub: 'types actifs', trend: 0, tone: tonePalette[1] },
          { icon: Award, label: 'Top licence', value: topLicense.userCount, sub: topLicense.label.replace('Microsoft 365 ', ''), trend: 8, tone: tonePalette[2] },
          { icon: Gauge, label: 'Sièges disponibles', value: totalSeats - totalUsers, sub: `sur ${totalSeats}`, trend: -3, tone: tonePalette[3] },
        ].map((kpi, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}>
            <Card className="group relative overflow-hidden border-border rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className={`absolute inset-x-0 top-0 h-1 ${kpi.tone.bg.replace('/10', '/50')}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-11 w-11 rounded-2xl ${kpi.tone.bg} ${kpi.tone.text} flex items-center justify-center ring-4 ${kpi.tone.ring}`}>
                    <kpi.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  {kpi.trend !== 0 && (
                    <Badge variant="outline" className={`rounded-full gap-0.5 text-[10px] border-0 ${kpi.trend > 0 ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
                      <TrendingUp className="h-3 w-3" /> {Math.abs(kpi.trend)}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight mt-1">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{kpi.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── TABS ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="rounded-full bg-muted p-1 h-10">
          <TabsTrigger value="overview" className="rounded-full px-5 gap-2 data-[state=active]:shadow-sm">
            <PieChart className="h-4 w-4" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="details" className="rounded-full px-5 gap-2 data-[state=active]:shadow-sm">
            <Eye className="h-4 w-4" /> Détails utilisateurs
          </TabsTrigger>
        </TabsList>

        {/* ─── VUE D'ENSEMBLE ─── */}
        <TabsContent value="overview" className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Afficher :</span>
            <Select value={graphLimit} onValueChange={setGraphLimit}>
              <SelectTrigger className="w-32 h-8 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="8">Top 8</SelectItem>
                <SelectItem value="all">Tous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Pie */}
            <motion.div variants={fadeUp} className="xl:col-span-5">
              <Card className="border-border rounded-2xl shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <PieChart className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Répartition par licence</h3>
                      <p className="text-xs text-muted-foreground">Part de chaque type</p>
                    </div>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={115}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="hsl(var(--card))"
                          strokeWidth={3}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {pieData.slice(0, 6).map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="text-muted-foreground truncate flex-1">{p.name}</span>
                        <span className="font-bold text-foreground tabular-nums">{p.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bar */}
            <motion.div variants={fadeUp} className="xl:col-span-7">
              <Card className="border-border rounded-2xl shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Comptes par licence</h3>
                      <p className="text-xs text-muted-foreground">Volume d'attribution</p>
                    </div>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                          tickLine={false}
                          axisLine={false}
                          angle={-20}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
                        <Bar dataKey="comptes" radius={[10, 10, 0, 0]} maxBarSize={50}>
                          {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trend */}
            <motion.div variants={fadeUp} className="xl:col-span-7">
              <Card className="border-border rounded-2xl shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Évolution mensuelle</h3>
                      <p className="text-xs text-muted-foreground">Total comptes attribués</p>
                    </div>
                  </div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#colorTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top usage list */}
            <motion.div variants={fadeUp} className="xl:col-span-5">
              <Card className="border-border rounded-2xl shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Taux d'utilisation</h3>
                      <p className="text-xs text-muted-foreground">Sièges utilisés / disponibles</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {enrichedLicenses.slice(0, 5).map((l, i) => {
                      const pct = Math.round((l.userCount / l.totalSeats) * 100);
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-foreground font-medium truncate flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.tone.color }} />
                              {l.label.replace('Microsoft 365 ', '')}
                            </span>
                            <span className="font-bold text-foreground tabular-nums flex-shrink-0">
                              {l.userCount}<span className="text-muted-foreground">/{l.totalSeats}</span>
                              <span className="ml-2 text-muted-foreground">({pct}%)</span>
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: l.tone.color }}
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
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ─── DÉTAILS ─── */}
        <TabsContent value="details" className="space-y-5">
          {/* Filtres badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedLicense === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs transition-all ${
                selectedLicense === 'all' ? 'bg-foreground text-background hover:bg-foreground/90' : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedLicense('all')}
            >
              Toutes <span className="ml-1.5 opacity-70">({totalUsers})</span>
            </Badge>
            {enrichedLicenses.map((license) => {
              const active = selectedLicense === license.skuId;
              return (
                <Badge
                  key={license.skuId}
                  variant="outline"
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs transition-all border ${
                    active
                      ? `${license.tone.bg} ${license.tone.text} border-transparent ring-2 ${license.tone.ring}`
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedLicense(license.skuId)}
                >
                  <span className="h-1.5 w-1.5 rounded-full mr-2" style={{ backgroundColor: license.tone.color }} />
                  {license.label.replace('Microsoft 365 ', '')}
                  <span className="ml-1.5 opacity-70">({license.userCount})</span>
                </Badge>
              );
            })}
          </div>

          {/* Liste utilisateurs */}
          <Card className="border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Utilisateur</th>
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Email</th>
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Licence</th>
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Agence</th>
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Statut</th>
                    <th className="text-right p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, 15).map((user) => {
                    const userLicense = enrichedLicenses.find(l => l.label === user.licence.label) || enrichedLicenses[0];
                    return (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-10 h-10 rounded-2xl ${userLicense.tone.bg} ${userLicense.tone.text} flex items-center justify-center font-bold text-sm ring-2 ${userLicense.tone.ring}`}
                            >
                              {user.prenom.charAt(0)}{user.nom.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{user.prenom} {user.nom}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.metier}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`rounded-full ${userLicense.tone.bg} ${userLicense.tone.text} border-transparent`}>
                            {user.licence.label.replace('Microsoft 365 ', '')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-foreground">{user.agence}</span>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`rounded-full border-transparent ${
                              user.status === 'active' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.status === 'active' ? 'bg-accent' : 'bg-muted-foreground'}`} />
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full gap-1">
                            <Eye className="h-3.5 w-3.5" /> Voir
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredUsers.length > 15 && (
              <div className="p-4 bg-muted/30 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Affichage de 15 sur <span className="font-semibold text-foreground">{filteredUsers.length}</span> utilisateurs
                </p>
                <Button variant="outline" size="sm" className="rounded-full gap-1">
                  Voir tous <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
