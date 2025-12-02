import { 
  Users, Mail, HardDrive, CreditCard, TrendingUp, TrendingDown, 
  UserPlus, Activity, AlertCircle, CheckCircle2, Clock, 
  Zap, Shield, Target, BarChart3, PieChart, Globe, Building2,
  ArrowUpRight, ArrowDownRight, Sparkles, Calendar
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

  return (
    <div className="space-y-8 pb-8">
      {/* Header avec dégradé */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-8 text-white shadow-card-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl -ml-36 -mb-36" />
        
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              <h1 className="text-4xl font-bold">Tableau de bord</h1>
            </div>
            <p className="text-white/90 text-lg max-w-2xl">
              Vue d'ensemble de votre tenant Microsoft 365 · Données en temps réel
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-4 w-4" />
                <span>Dernière mise à jour: Il y a 2 min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Tous les systèmes opérationnels</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/actions')} 
            className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            Actions rapides
          </Button>
        </div>
      </div>

      {/* KPI Cards - Version enrichie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-l-4 border-l-accent shadow-card hover:shadow-card-hover transition-smooth animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeUsers}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-accent/10 text-accent hover:bg-accent/20 gap-1">
                <TrendingUp className="h-3 w-3" />
                +5.2%
              </Badge>
              <span className="text-xs text-muted-foreground">vs mois dernier</span>
            </div>
            <Progress value={75} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-primary shadow-card hover:shadow-card-hover transition-smooth animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Boîtes partagées
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{sharedMailboxes}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Sur {totalUsers} boîtes totales
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-smooth"
                  style={{ width: `${(sharedMailboxes / totalUsers) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium">{Math.round((sharedMailboxes / totalUsers) * 100)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-warning shadow-card hover:shadow-card-hover transition-smooth animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stockage moyen
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{avgStorage} Go</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="gap-1 text-destructive border-destructive/30">
                <TrendingDown className="h-3 w-3" />
                -2.1%
              </Badge>
              <span className="text-xs text-muted-foreground">Optimisé</span>
            </div>
            <Progress value={60} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-primary shadow-card hover:shadow-card-hover transition-smooth animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Licences actives
            </CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-2">
              E3, Business Standard...
            </p>
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 h-1.5 bg-primary/20 rounded-full">
                  <div className="h-full bg-primary rounded-full w-full" />
                </div>
              ))}
              <div className="flex-1 h-1.5 bg-muted rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes importantes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-destructive bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">3 boîtes critiques</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Stockage supérieur à 90%</p>
            </div>
            <Button size="sm" variant="ghost" className="text-destructive h-8">Voir</Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Clock className="h-5 w-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">12 demandes en attente</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Moyenne: 2.5 jours</p>
            </div>
            <Button size="sm" variant="ghost" className="text-warning h-8">Traiter</Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent bg-accent/5">
          <CardContent className="flex items-start gap-3 p-4">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">SLA: 92% respecté</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Objectif: 90%</p>
            </div>
            <Button size="sm" variant="ghost" className="text-accent h-8">Stats</Button>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique activité email - 2 colonnes */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Activité des emails</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Volume des messages par jour</p>
                </div>
              </div>
              <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                <TabsList>
                  <TabsTrigger value="7j">7j</TabsTrigger>
                  <TabsTrigger value="30j">30j</TabsTrigger>
                  <TabsTrigger value="90j">90j</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEnvoyes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTraites" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickMargin={8}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="envoyes"
                  name="Envoyés"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorEnvoyes)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="recus"
                  name="Reçus"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorRecus)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="traites"
                  name="Traités"
                  stroke="hsl(var(--warning))"
                  fillOpacity={1}
                  fill="url(#colorTraites)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution du stockage - 1 colonne */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle>Stockage</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Distribution</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPie>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {storageData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance par domaine */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl">Performance par domaine</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble des domaines email</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/performance-kpi')}>
              Détails
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainData.map((domain, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/5 hover:border-accent/30 transition-smooth cursor-pointer"
                onClick={() => navigate('/performance-kpi')}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{domain.domain}</h4>
                    <Badge variant="outline" className="text-xs">{domain.users} utilisateurs</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{domain.emails.toLocaleString('fr-FR')} emails/mois</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{domain.sla}%</div>
                    <div className="text-xs text-muted-foreground">SLA</div>
                  </div>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    domain.sla >= 90 ? 'bg-accent/10' : 'bg-warning/10'
                  }`}>
                    <Target className={`h-5 w-5 ${
                      domain.sla >= 90 ? 'text-accent' : 'text-warning'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section inférieure - Licences et Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des licences */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Répartition des licences</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Par type de licence</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: 'Microsoft 365 E3', count: 8, total: 25, color: 'bg-primary', textColor: 'text-primary' },
              { label: 'Business Standard', count: 12, total: 25, color: 'bg-accent', textColor: 'text-accent' },
              { label: 'Apps for Business', count: 5, total: 25, color: 'bg-warning', textColor: 'text-warning' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${item.textColor}`}>{item.count}</span>
                    <span className="text-sm text-muted-foreground">/ {item.total}</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-smooth`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                  <span className="absolute right-2 top-0 text-[10px] font-semibold text-muted-foreground">
                    {Math.round((item.count / item.total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/licences')}>
              Gérer les licences
            </Button>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Activité récente</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Dernières actions</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { 
                action: 'Nouvelle boîte créée', 
                user: 'Paul Martin', 
                time: 'Il y a 2h', 
                icon: Users,
                color: 'bg-accent',
                textColor: 'text-accent'
              },
              { 
                action: 'Licence mise à niveau', 
                user: 'Marie Dubois', 
                time: 'Il y a 5h', 
                icon: CreditCard,
                color: 'bg-primary',
                textColor: 'text-primary'
              },
              { 
                action: 'Archivage terminé', 
                user: 'Compta@exemple.fr', 
                time: 'Hier', 
                icon: HardDrive,
                color: 'bg-warning',
                textColor: 'text-warning'
              },
              { 
                action: 'Message d\'absence activé', 
                user: 'Sophie Lefèvre', 
                time: 'Hier', 
                icon: Calendar,
                color: 'bg-primary',
                textColor: 'text-primary'
              },
              { 
                action: 'Automatisation déclenchée', 
                user: 'Système', 
                time: 'Il y a 2j', 
                icon: Zap,
                color: 'bg-accent',
                textColor: 'text-accent'
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-smooth cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color}/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-smooth`}>
                  <item.icon className={`h-5 w-5 ${item.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.user}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/demandes')}>
              Voir toutes les activités
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick stats footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center hover:shadow-card-hover transition-smooth cursor-pointer">
          <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">99.8%</div>
          <div className="text-xs text-muted-foreground">Disponibilité</div>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-card-hover transition-smooth cursor-pointer">
          <Target className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">4.2h</div>
          <div className="text-xs text-muted-foreground">Temps de réponse moyen</div>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-card-hover transition-smooth cursor-pointer">
          <CheckCircle2 className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">156</div>
          <div className="text-xs text-muted-foreground">Actions ce mois</div>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-card-hover transition-smooth cursor-pointer">
          <Activity className="h-8 w-8 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">23</div>
          <div className="text-xs text-muted-foreground">Automatisations actives</div>
        </Card>
      </div>
    </div>
  );
}
