import { 
  Users, Mail, HardDrive, CreditCard, TrendingUp, TrendingDown, 
  UserPlus, Activity, AlertCircle, CheckCircle2, Clock, 
  Zap, Shield, Target, BarChart3, PieChart, Globe, Building2,
  ArrowUpRight, ArrowDownRight, Sparkles, Calendar, ChevronRight,
  Flame, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { mockUsers } from '@/lib/mock-data';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const generateChartData = (days: number) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      envoyes: Math.floor(Math.random() * 500) + 200,
      recus: Math.floor(Math.random() * 800) + 400,
      traites: Math.floor(Math.random() * 600) + 300,
    });
  }
  return data;
};

const generateStorageData = () => [
  { name: '< 10 Go', value: 35, color: 'hsl(var(--accent))' },
  { name: '10-30 Go', value: 40, color: 'hsl(var(--primary))' },
  { name: '30-50 Go', value: 18, color: 'hsl(var(--warning))' },
  { name: '> 50 Go', value: 7, color: 'hsl(var(--destructive))' },
];

const generateDomainData = () => [
  { domain: '@comtesse.fr', users: 42, sla: 94, emails: 15240 },
  { domain: '@adi-industrie.fr', users: 28, sla: 89, emails: 9850 },
  { domain: '@partenaires.fr', users: 15, sla: 91, emails: 4320 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 32 },
  show: { 
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 }
  }
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
  
  const storageData = useMemo(() => generateStorageData(), []);
  const domainData = useMemo(() => generateDomainData(), []);

  const kpiCards = [
    {
      title: 'Utilisateurs actifs',
      value: activeUsers,
      icon: Users,
      trend: { value: '+5.2%', positive: true },
      subtitle: 'vs mois dernier',
      progress: 75,
      gradient: 'from-[hsl(160,60%,45%)] to-[hsl(160,60%,60%)]',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      borderColor: 'border-accent/40',
    },
    {
      title: 'Boîtes partagées',
      value: sharedMailboxes,
      icon: Mail,
      trend: { value: `${Math.round((sharedMailboxes / totalUsers) * 100)}%`, positive: true },
      subtitle: `sur ${totalUsers} boîtes`,
      progress: Math.round((sharedMailboxes / totalUsers) * 100),
      gradient: 'from-[hsl(210,100%,45%)] to-[hsl(210,100%,60%)]',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      borderColor: 'border-primary/40',
    },
    {
      title: 'Stockage moyen',
      value: `${avgStorage} Go`,
      icon: HardDrive,
      trend: { value: '-2.1%', positive: false },
      subtitle: 'Optimisé',
      progress: 60,
      gradient: 'from-[hsl(35,95%,55%)] to-[hsl(35,95%,65%)]',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      borderColor: 'border-warning/40',
    },
    {
      title: 'Licences actives',
      value: activeUsers,
      icon: CreditCard,
      trend: { value: '100%', positive: true },
      subtitle: 'E3, Business Standard...',
      progress: 100,
      gradient: 'from-[hsl(270,70%,55%)] to-[hsl(270,70%,70%)]',
      iconBg: 'bg-[hsl(270,70%,55%)]/10',
      iconColor: 'text-[hsl(270,70%,55%)]',
      borderColor: 'border-[hsl(270,70%,55%)]/40',
    },
  ];

  const alerts = [
    { 
      icon: AlertCircle, 
      title: '3 boîtes critiques', 
      desc: 'Stockage supérieur à 90%', 
      type: 'destructive' as const,
      action: 'Voir',
    },
    { 
      icon: Clock, 
      title: '12 demandes en attente', 
      desc: 'Moyenne: 2.5 jours', 
      type: 'warning' as const,
      action: 'Traiter',
    },
    { 
      icon: CheckCircle2, 
      title: 'SLA: 92% respecté', 
      desc: 'Objectif: 90%', 
      type: 'accent' as const,
      action: 'Stats',
    },
  ];

  const activities = [
    { action: 'Nouvelle boîte créée', user: 'Paul Martin', time: 'Il y a 2h', icon: Users, color: 'bg-accent/10', textColor: 'text-accent' },
    { action: 'Licence mise à niveau', user: 'Marie Dubois', time: 'Il y a 5h', icon: CreditCard, color: 'bg-primary/10', textColor: 'text-primary' },
    { action: 'Archivage terminé', user: 'Compta@exemple.fr', time: 'Hier', icon: HardDrive, color: 'bg-warning/10', textColor: 'text-warning' },
    { action: 'Message d\'absence activé', user: 'Sophie Lefèvre', time: 'Hier', icon: Calendar, color: 'bg-primary/10', textColor: 'text-primary' },
    { action: 'Automatisation déclenchée', user: 'Système', time: 'Il y a 2j', icon: Zap, color: 'bg-accent/10', textColor: 'text-accent' },
  ];

  const quickStats = [
    { icon: Shield, value: '99.8%', label: 'Disponibilité', color: 'text-accent' },
    { icon: Target, value: '4.2h', label: 'Temps de réponse moyen', color: 'text-primary' },
    { icon: CheckCircle2, value: '156', label: 'Actions ce mois', color: 'text-accent' },
    { icon: Activity, value: '23', label: 'Automatisations actives', color: 'text-warning' },
  ];

  return (
    <motion.div 
      className="space-y-8 pb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero Header */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl p-8 text-primary-foreground shadow-xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210,100%,42%)] via-[hsl(210,100%,48%)] to-[hsl(160,60%,45%)]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(0,0%,100%,0.08)] rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(160,60%,45%,0.2)] rounded-full blur-3xl -ml-36 -mb-36" />
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[hsl(270,70%,60%,0.1)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-3">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="h-10 w-10 rounded-xl bg-[hsl(0,0%,100%,0.2)] backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              </motion.div>
              <motion.p 
                className="text-[hsl(0,0%,100%,0.85)] text-base max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Vue d'ensemble de votre tenant Microsoft 365 · Données en temps réel
              </motion.p>
              <motion.div 
                className="flex items-center gap-3 mt-4 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 bg-[hsl(0,0%,100%,0.15)] backdrop-blur-md rounded-full px-4 py-2 border border-[hsl(0,0%,100%,0.1)]">
                  <div className="h-2 w-2 rounded-full bg-[hsl(120,60%,60%)] animate-pulse" />
                  <span>Dernière mise à jour: Il y a 2 min</span>
                </div>
                <div className="flex items-center gap-2 bg-[hsl(0,0%,100%,0.15)] backdrop-blur-md rounded-full px-4 py-2 border border-[hsl(0,0%,100%,0.1)]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Systèmes opérationnels</span>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                onClick={() => navigate('/actions')} 
                className="bg-[hsl(0,0%,100%)] text-[hsl(210,100%,45%)] hover:bg-[hsl(0,0%,100%,0.9)] gap-2 shadow-lg font-semibold"
              >
                <UserPlus className="h-4 w-4" />
                Actions rapides
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={container}
      >
        {kpiCards.map((kpi, i) => (
          <motion.div key={i} variants={item}>
            <Card className={`relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-b-2 ${kpi.borderColor}`}>
              {/* Subtle gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
              
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <motion.div 
                  className={`h-11 w-11 rounded-2xl ${kpi.iconBg} flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-foreground tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${kpi.trend.positive ? 'bg-accent/10 text-accent hover:bg-accent/20' : 'bg-destructive/10 text-destructive hover:bg-destructive/20'} gap-1 font-semibold`}>
                    {kpi.trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.trend.value}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{kpi.subtitle}</span>
                </div>
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${kpi.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${kpi.progress}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts Strip */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={container}
      >
        {alerts.map((alert, i) => {
          const colorMap = {
            destructive: { bg: 'bg-destructive/5', border: 'border-destructive/30', text: 'text-destructive', icon: 'text-destructive' },
            warning: { bg: 'bg-warning/5', border: 'border-warning/30', text: 'text-warning', icon: 'text-warning' },
            accent: { bg: 'bg-accent/5', border: 'border-accent/30', text: 'text-accent', icon: 'text-accent' },
          };
          const c = colorMap[alert.type];
          return (
            <motion.div key={i} variants={item}>
              <Card className={`${c.bg} border ${c.border} hover:shadow-md transition-all duration-200`}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={`h-9 w-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <alert.icon className={`h-4 w-4 ${c.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                  </div>
                  <Button size="sm" variant="ghost" className={`${c.text} h-8 text-xs font-semibold`}>
                    {alert.action}
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={container}>
        {/* Email Activity Chart */}
        <motion.div className="lg:col-span-2" variants={slideUp}>
          <Card className="shadow-card hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Activité des emails</CardTitle>
                    <p className="text-sm text-muted-foreground">Volume des messages par jour</p>
                  </div>
                </div>
                <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                  <TabsList className="bg-muted/60">
                    <TabsTrigger value="7j" className="text-xs">7j</TabsTrigger>
                    <TabsTrigger value="30j" className="text-xs">30j</TabsTrigger>
                    <TabsTrigger value="90j" className="text-xs">90j</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEnvoyes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRecus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTraites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-lg)',
                      fontSize: '13px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '13px' }} iconType="circle" />
                  <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEnvoyes)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="recus" name="Reçus" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRecus)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="traites" name="Traités" stroke="hsl(var(--warning))" fillOpacity={1} fill="url(#colorTraites)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Storage Pie */}
        <motion.div variants={slideUp}>
          <Card className="shadow-card hover:shadow-xl transition-shadow duration-300 h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <CardTitle className="text-lg">Stockage</CardTitle>
                  <p className="text-sm text-muted-foreground">Distribution</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={190}>
                <RechartsPie>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '10px',
                      fontSize: '13px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="space-y-2.5 mt-4">
                {storageData.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm group cursor-default">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-card" style={{ backgroundColor: s.color, }} />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{s.name}</span>
                    </div>
                    <span className="font-bold text-foreground">{s.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Domain Performance */}
      <motion.div variants={slideUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <Card className="shadow-card hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Performance par domaine</CardTitle>
                  <p className="text-sm text-muted-foreground">Vue d'ensemble des domaines email</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/performance-kpi')} className="gap-1.5">
                Détails
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {domainData.map((domain, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate('/performance-kpi')}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow">
                    <Building2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{domain.domain}</h4>
                      <Badge variant="outline" className="text-xs font-medium">{domain.users} utilisateurs</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{domain.emails.toLocaleString('fr-FR')} emails/mois</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{domain.sla}%</div>
                      <div className="text-xs text-muted-foreground">SLA</div>
                    </div>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${domain.sla >= 90 ? 'bg-accent/10' : 'bg-warning/10'}`}>
                      <Target className={`h-5 w-5 ${domain.sla >= 90 ? 'text-accent' : 'text-warning'}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Grid - Licenses & Activity */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* Licenses */}
        <motion.div variants={slideUp}>
          <Card className="shadow-card hover:shadow-xl transition-shadow duration-300 h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Répartition des licences</CardTitle>
                  <p className="text-sm text-muted-foreground">Par type de licence</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: 'Microsoft 365 E3', count: 8, total: 25, gradient: 'from-[hsl(210,100%,45%)] to-[hsl(210,100%,60%)]', color: 'text-primary' },
                { label: 'Business Standard', count: 12, total: 25, gradient: 'from-[hsl(160,60%,45%)] to-[hsl(160,60%,60%)]', color: 'text-accent' },
                { label: 'Apps for Business', count: 5, total: 25, gradient: 'from-[hsl(35,95%,55%)] to-[hsl(35,95%,65%)]', color: 'text-warning' },
              ].map((lic, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm">{lic.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold ${lic.color}`}>{lic.count}</span>
                      <span className="text-sm text-muted-foreground">/ {lic.total}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${lic.gradient}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(lic.count / lic.total) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/licences')}>
                Gérer les licences
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={slideUp}>
          <Card className="shadow-card hover:shadow-xl transition-shadow duration-300 h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
                  <p className="text-sm text-muted-foreground">Dernières actions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {activities.map((act, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className={`w-9 h-9 rounded-xl ${act.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <act.icon className={`h-4 w-4 ${act.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{act.action}</p>
                    <p className="text-xs text-muted-foreground">{act.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{act.time}</span>
                </motion.div>
              ))}
              <Button className="w-full mt-3" variant="outline" onClick={() => navigate('/demandes')}>
                Voir toutes les activités
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Stats Footer */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {quickStats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="p-5 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group border-transparent hover:border-primary/10">
              <motion.div
                whileHover={{ scale: 1.15, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2.5`} />
              </motion.div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
