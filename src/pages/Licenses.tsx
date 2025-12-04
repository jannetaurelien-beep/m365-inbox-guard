import { useState } from 'react';
import { Users, BarChart3, PieChart, Zap, Crown, Shield, Sparkles, ChevronRight, Search, Download, Filter, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockLicenses, mockUsers } from '@/lib/mock-data';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

// Couleurs futuristes pour les licences
const licenseColors = [
  { bg: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/30', accent: '#3b82f6', light: 'bg-blue-50 text-blue-700 border-blue-200' },
  { bg: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/30', accent: '#10b981', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { bg: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30', accent: '#f59e0b', light: 'bg-amber-50 text-amber-700 border-amber-200' },
  { bg: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/30', accent: '#f43f5e', light: 'bg-rose-50 text-rose-700 border-rose-200' },
  { bg: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30', accent: '#8b5cf6', light: 'bg-violet-50 text-violet-700 border-violet-200' },
  { bg: 'from-cyan-500 to-teal-600', glow: 'shadow-cyan-500/30', accent: '#06b6d4', light: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { bg: 'from-indigo-500 to-indigo-600', glow: 'shadow-indigo-500/30', accent: '#6366f1', light: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { bg: 'from-pink-500 to-pink-600', glow: 'shadow-pink-500/30', accent: '#ec4899', light: 'bg-pink-50 text-pink-700 border-pink-200' },
];

// Données enrichies pour les licences
const enrichedLicenses = mockLicenses.map((license, index) => {
  const usersWithLicense = mockUsers.filter(u => u.licence.label === license.label);
  const colorScheme = licenseColors[index % licenseColors.length];
  const userCount = usersWithLicense.length > 0 ? usersWithLicense.length : Math.floor(Math.random() * 200) + 20;
  return {
    ...license,
    userCount,
    totalSeats: userCount + Math.floor(Math.random() * 50) + 10,
    users: usersWithLicense.length > 0 ? usersWithLicense : mockUsers.slice(0, Math.min(5, mockUsers.length)),
    ...colorScheme,
    trend: Math.floor(Math.random() * 20) - 5,
  };
});

// Données pour les graphiques
const pieData = enrichedLicenses.map((l, i) => ({
  name: l.label.replace('Microsoft 365 ', '').replace('Exchange Online ', 'Exchange '),
  value: l.userCount,
  color: licenseColors[i % licenseColors.length].accent
}));

const barData = enrichedLicenses.slice(0, 8).map((l, i) => ({
  name: l.label.replace('Microsoft 365 ', '').replace('Exchange Online ', 'Exchange '),
  comptes: l.userCount,
  fill: licenseColors[i % licenseColors.length].accent
}));

const trendData = [
  { month: 'Jan', total: 480 },
  { month: 'Fév', total: 495 },
  { month: 'Mar', total: 510 },
  { month: 'Avr', total: 525 },
  { month: 'Mai', total: 535 },
  { month: 'Juin', total: 542 },
];

export default function Licenses() {
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [graphLimit, setGraphLimit] = useState('8');

  const totalUsers = enrichedLicenses.reduce((acc, l) => acc + l.userCount, 0);
  const topLicense = enrichedLicenses.reduce((a, b) => a.userCount > b.userCount ? a : b);

  const selectedLicenseData = selectedLicense !== 'all' 
    ? enrichedLicenses.find(l => l.skuId === selectedLicense) 
    : null;

  const displayedUsers = selectedLicenseData 
    ? selectedLicenseData.users 
    : mockUsers;

  const filteredUsers = displayedUsers.filter(u => 
    `${u.prenom} ${u.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-xl">
          <p className="font-semibold">{payload[0].name || payload[0].payload?.name}</p>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{payload[0].value}</span> comptes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Crown className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm text-white/80">Synchronisé avec Microsoft 365</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold">Licences</h1>
              <p className="text-white/70 text-lg">Vue d'ensemble Microsoft 365</p>
            </div>
            
            {/* Search & Export */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input 
                  placeholder="Recherche nom / UPN / licence..." 
                  className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedLicense} onValueChange={setSelectedLicense}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Toutes les licences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les licences</SelectItem>
                  {enrichedLicenses.map(l => (
                    <SelectItem key={l.skuId} value={l.skuId}>{l.label.replace('Microsoft 365 ', '')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          
          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-cyan-300" />
                <span className="text-sm text-white/70">Total comptes</span>
              </div>
              <p className="text-4xl font-bold">{totalUsers}</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-300 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+12% ce mois</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-emerald-300" />
                <span className="text-sm text-white/70">Licences distinctes</span>
              </div>
              <p className="text-4xl font-bold">{enrichedLicenses.length}</p>
              <div className="flex items-center gap-1 mt-2 text-white/60 text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Types actifs</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-300" />
                <span className="text-sm text-white/70">Top licence</span>
              </div>
              <p className="text-2xl font-bold truncate">{topLicense.label.replace('Microsoft 365 ', '')}</p>
              <div className="flex items-center gap-1 mt-2 text-amber-300 text-sm">
                <span>({topLicense.userCount} comptes)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card/80 backdrop-blur-sm border border-border/50 p-1.5 rounded-2xl shadow-lg">
          <TabsTrigger 
            value="overview" 
            className="rounded-xl px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            className="rounded-xl px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
          >
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Sélecteur de graphiques */}
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Graphiques :</span>
            <Select value={graphLimit} onValueChange={setGraphLimit}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="8">Top 8</SelectItem>
                <SelectItem value="all">Tous</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">(les autres sont masquées pour la lisibilité)</span>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition des licences - Pie Chart */}
            <Card className="p-6 bg-gradient-to-br from-card via-card to-blue-500/5 border-border/50 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <span>Répartition par licence</span>
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData.slice(0, graphLimit === 'all' ? pieData.length : parseInt(graphLimit))}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ value }) => value}
                      labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                    >
                      {pieData.slice(0, graphLimit === 'all' ? pieData.length : parseInt(graphLimit)).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke="hsl(var(--card))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value) => <span className="text-sm">{value}</span>}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Comptes par licence - Bar Chart */}
            <Card className="p-6 bg-gradient-to-br from-card via-card to-emerald-500/5 border-border/50 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span>Comptes par licence</span>
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData.slice(0, graphLimit === 'all' ? barData.length : parseInt(graphLimit))} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      angle={-20}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="comptes" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    >
                      {barData.slice(0, graphLimit === 'all' ? barData.length : parseInt(graphLimit)).map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Évolution mensuelle */}
            <Card className="p-6 bg-gradient-to-br from-card via-card to-violet-500/5 border-border/50 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span>Évolution mensuelle</span>
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'hsl(var(--border))' }} />
                    <YAxis tickLine={false} axisLine={{ stroke: 'hsl(var(--border))' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fill="url(#colorTrend)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Taux d'utilisation radial */}
            <Card className="p-6 bg-gradient-to-br from-card via-card to-amber-500/5 border-border/50 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/30">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span>Taux d'utilisation</span>
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="90%" 
                    data={enrichedLicenses.slice(0, 5).map((l, i) => ({
                      name: l.label.replace('Microsoft 365 ', '').replace('Exchange Online ', 'Exch.'),
                      value: Math.round((l.userCount / l.totalSeats) * 100),
                      fill: licenseColors[i % licenseColors.length].accent
                    }))}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background={{ fill: 'hsl(var(--muted))' }}
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <Legend 
                      iconSize={10} 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      formatter={(value) => <span className="text-xs">{value}</span>}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Détails - Liste des utilisateurs */}
        <TabsContent value="details" className="space-y-6">
          {/* Liste des licences avec badges */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedLicense === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${selectedLicense === 'all' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' : 'hover:bg-muted'}`}
              onClick={() => setSelectedLicense('all')}
            >
              Toutes ({totalUsers})
            </Badge>
            {enrichedLicenses.map((license, index) => (
              <Badge 
                key={license.skuId}
                variant={selectedLicense === license.skuId ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 text-sm transition-all ${selectedLicense === license.skuId ? `bg-gradient-to-r ${license.bg} text-white shadow-lg` : `hover:${license.light}`}`}
                onClick={() => setSelectedLicense(license.skuId)}
              >
                {license.label.replace('Microsoft 365 ', '')} ({license.userCount})
              </Badge>
            ))}
          </div>

          {/* Tableau des utilisateurs */}
          <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border">
                    <th className="text-left p-4 font-semibold text-sm">Utilisateur</th>
                    <th className="text-left p-4 font-semibold text-sm">Email / UPN</th>
                    <th className="text-left p-4 font-semibold text-sm">Licence</th>
                    <th className="text-left p-4 font-semibold text-sm">Agence</th>
                    <th className="text-left p-4 font-semibold text-sm">Statut</th>
                    <th className="text-right p-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, 15).map((user, index) => {
                    const userLicenseColor = enrichedLicenses.find(l => l.label === user.licence.label) || enrichedLicenses[0];
                    return (
                      <tr 
                        key={user.id} 
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${userLicenseColor.bg} flex items-center justify-center text-white font-bold shadow-lg`}>
                              {user.prenom.charAt(0)}{user.nom.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{user.prenom} {user.nom}</p>
                              <p className="text-xs text-muted-foreground">{user.metier}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.upn}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={userLicenseColor.light}>
                            {user.licence.label.replace('Microsoft 365 ', '')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{user.agence}</span>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                          >
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredUsers.length > 15 && (
              <div className="p-4 bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">
                  Affichage de 15 sur {filteredUsers.length} utilisateurs
                </p>
                <Button variant="link" className="text-primary">
                  Voir tous les utilisateurs
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
