import { useState } from 'react';
import { Check, TrendingUp, Users, BarChart3, PieChart, Zap, Crown, Shield, Sparkles, ChevronRight, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Area
} from 'recharts';

// Couleurs futuristes pour les licences
const licenseColors = [
  { bg: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30', accent: '#8b5cf6' },
  { bg: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/30', accent: '#06b6d4' },
  { bg: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30', accent: '#10b981' },
  { bg: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30', accent: '#f59e0b' },
  { bg: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/30', accent: '#f43f5e' },
];

// Données enrichies pour les licences
const enrichedLicenses = mockLicenses.map((license, index) => {
  const usersWithLicense = mockUsers.filter(u => u.licence.label === license.label);
  const colorScheme = licenseColors[index % licenseColors.length];
  return {
    ...license,
    userCount: usersWithLicense.length || Math.floor(Math.random() * 50) + 10,
    totalSeats: Math.floor(Math.random() * 100) + 50,
    usedStorage: Math.floor(Math.random() * 80) + 20,
    users: usersWithLicense.length > 0 ? usersWithLicense : mockUsers.slice(0, 5),
    ...colorScheme,
    trend: Math.floor(Math.random() * 20) - 5,
    monthlyGrowth: [
      { month: 'Jan', count: Math.floor(Math.random() * 30) + 20 },
      { month: 'Fév', count: Math.floor(Math.random() * 30) + 25 },
      { month: 'Mar', count: Math.floor(Math.random() * 30) + 30 },
      { month: 'Avr', count: Math.floor(Math.random() * 30) + 35 },
      { month: 'Mai', count: Math.floor(Math.random() * 30) + 40 },
      { month: 'Juin', count: Math.floor(Math.random() * 30) + 45 },
    ]
  };
});

// Données pour les graphiques
const pieData = enrichedLicenses.map((l, i) => ({
  name: l.label.split(' ').slice(-1)[0],
  value: l.userCount,
  color: licenseColors[i % licenseColors.length].accent
}));

const barData = enrichedLicenses.map(l => ({
  name: l.label.split(' ').slice(-1)[0],
  utilisés: l.userCount,
  disponibles: l.totalSeats - l.userCount,
}));

const radialData = enrichedLicenses.map((l, i) => ({
  name: l.label.split(' ').slice(-1)[0],
  value: Math.round((l.userCount / l.totalSeats) * 100),
  fill: licenseColors[i % licenseColors.length].accent
}));

export default function Licenses() {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const totalUsers = enrichedLicenses.reduce((acc, l) => acc + l.userCount, 0);
  const totalSeats = enrichedLicenses.reduce((acc, l) => acc + l.totalSeats, 0);
  const utilizationRate = Math.round((totalUsers / totalSeats) * 100);

  const selectedLicenseData = selectedLicense 
    ? enrichedLicenses.find(l => l.skuId === selectedLicense) 
    : null;

  const filteredUsers = selectedLicenseData?.users.filter(u => 
    `${u.prenom} ${u.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header futuriste */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
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
          
          <h1 className="text-4xl font-bold mb-2">Gestion des Licences</h1>
          <p className="text-white/70 text-lg mb-6">Catalogue et suivi des licences Microsoft 365</p>
          
          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-cyan-300" />
                <span className="text-sm text-white/70">Utilisateurs</span>
              </div>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-300" />
                <span className="text-sm text-white/70">Licences actives</span>
              </div>
              <p className="text-3xl font-bold">{enrichedLicenses.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-amber-300" />
                <span className="text-sm text-white/70">Sièges totaux</span>
              </div>
              <p className="text-3xl font-bold">{totalSeats}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-rose-300" />
                <span className="text-sm text-white/70">Utilisation</span>
              </div>
              <p className="text-3xl font-bold">{utilizationRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1 rounded-2xl">
          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <PieChart className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="licenses" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <Crown className="h-4 w-4 mr-2" />
            Catalogue
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition des licences */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
                  <PieChart className="h-4 w-4 text-white" />
                </div>
                Répartition des licences
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }} 
                    />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Utilisation par licence */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                Utilisation par licence
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="utilisés" stackId="a" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="disponibles" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Taux d'utilisation radial */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                Taux d'utilisation
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="90%" 
                    data={radialData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }} 
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Évolution mensuelle */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                Évolution mensuelle
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrichedLicenses[0].monthlyGrowth}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fill="url(#colorGrowth)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Catalogue des licences */}
        <TabsContent value="licenses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedLicenses.map((license, index) => (
              <Card 
                key={license.skuId} 
                className={`relative overflow-hidden p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${license.glow} ${selectedLicense === license.skuId ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedLicense(selectedLicense === license.skuId ? null : license.skuId)}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${license.bg} opacity-10`}></div>
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${license.bg} shadow-lg`}>
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{license.prixMensuel}€</p>
                      <p className="text-xs text-muted-foreground">par mois</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{license.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{license.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-background/50 rounded-xl p-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                        Utilisateurs
                      </div>
                      <p className="text-lg font-bold">{license.userCount}</p>
                    </div>
                    <div className="bg-background/50 rounded-xl p-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Shield className="h-3 w-3" />
                        Sièges
                      </div>
                      <p className="text-lg font-bold">{license.totalSeats}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Utilisation</span>
                      <span className="font-medium">{Math.round((license.userCount / license.totalSeats) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${license.bg} rounded-full transition-all duration-500`}
                        style={{ width: `${(license.userCount / license.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Trend badge */}
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`${license.trend >= 0 ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-rose-600 border-rose-200 bg-rose-50'}`}
                    >
                      <TrendingUp className={`h-3 w-3 mr-1 ${license.trend < 0 ? 'rotate-180' : ''}`} />
                      {license.trend >= 0 ? '+' : ''}{license.trend}% ce mois
                    </Badge>
                    <Badge variant="secondary" className="bg-background/50">
                      {license.stockageGo} Go
                    </Badge>
                  </div>

                  {/* Features preview */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="space-y-2">
                      {license.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`p-1 rounded-full bg-gradient-to-r ${license.bg}`}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-muted-foreground line-clamp-1">{feature}</span>
                        </div>
                      ))}
                      {license.features.length > 3 && (
                        <p className="text-xs text-muted-foreground ml-6">+{license.features.length - 3} autres fonctionnalités</p>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <Button 
                    className={`w-full mt-4 bg-gradient-to-r ${license.bg} hover:opacity-90 text-white shadow-lg`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLicense(license.skuId);
                      setActiveTab('users');
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Voir les utilisateurs
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Utilisateurs par licence */}
        <TabsContent value="users" className="space-y-6">
          {/* Sélecteur de licence */}
          <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
            <div className="flex flex-wrap gap-3">
              {enrichedLicenses.map((license) => (
                <Button
                  key={license.skuId}
                  variant={selectedLicense === license.skuId ? "default" : "outline"}
                  className={`${selectedLicense === license.skuId ? `bg-gradient-to-r ${license.bg} text-white` : ''}`}
                  onClick={() => setSelectedLicense(license.skuId)}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {license.label.split(' ').slice(-1)[0]}
                  <Badge variant="secondary" className="ml-2 bg-background/20">
                    {license.userCount}
                  </Badge>
                </Button>
              ))}
            </div>
          </Card>

          {selectedLicenseData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info licence */}
              <Card className={`p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-xl ${selectedLicenseData.glow}`}>
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedLicenseData.bg} mb-4 inline-block`}>
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{selectedLicenseData.label}</h3>
                <p className="text-muted-foreground mb-4">{selectedLicenseData.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Prix mensuel</span>
                    <span className="font-bold text-lg">{selectedLicenseData.prixMensuel}€</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Stockage</span>
                    <span className="font-bold">{selectedLicenseData.stockageGo} Go</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Utilisateurs</span>
                    <span className="font-bold">{selectedLicenseData.userCount} / {selectedLicenseData.totalSeats}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="font-medium mb-3">Fonctionnalités</h4>
                  <div className="space-y-2">
                    {selectedLicenseData.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className={`p-1 rounded-full bg-gradient-to-r ${selectedLicenseData.bg} mt-0.5`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Liste des utilisateurs */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher un utilisateur..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>

                <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50">
                  <div className="space-y-3">
                    {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                      <div 
                        key={user.id} 
                        className="flex items-center gap-4 p-4 bg-background/50 rounded-xl hover:bg-background/80 transition-colors cursor-pointer group"
                      >
                        <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${selectedLicenseData.bg} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {user.prenom.charAt(0)}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${user.status === 'active' ? 'bg-emerald-500' : 'bg-muted'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{user.prenom} {user.nom}</h4>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? `bg-gradient-to-r ${selectedLicenseData.bg}` : ''}>
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{user.metier}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    )) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucun utilisateur trouvé</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center bg-gradient-to-br from-card to-card/80 border-border/50">
              <div className="p-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 inline-block mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sélectionnez une licence</h3>
              <p className="text-muted-foreground">Choisissez une licence ci-dessus pour voir les utilisateurs associés</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Assistant d'upgrade */}
      <Card className="p-6 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 border-violet-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Assistant d'upgrade intelligent</h3>
            <p className="text-muted-foreground">
              Besoin d'aide pour optimiser vos licences ? Notre assistant IA analyse vos usages et vous recommande les meilleures options.
            </p>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30">
            <Zap className="h-5 w-5 mr-2" />
            Démarrer l'assistant
          </Button>
        </div>
      </Card>
    </div>
  );
}
