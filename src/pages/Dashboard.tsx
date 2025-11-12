import { Users, Mail, HardDrive, CreditCard, TrendingUp, TrendingDown, UserPlus } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockUsers } from '@/lib/mock-data';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const generateChartData = (days: number) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      envoyes: Math.floor(Math.random() * 500) + 200,
      recus: Math.floor(Math.random() * 800) + 400,
    });
  }
  return data;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'7j' | '30j' | '90j'>('30j');
  
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const sharedMailboxes = mockUsers.filter(u => u.typeBoite === 'partagee').length;
  const avgStorage = Math.round(mockUsers.reduce((acc, u) => acc + u.stockage.utiliseGo, 0) / totalUsers);

  const chartData = generateChartData(chartPeriod === '7j' ? 7 : chartPeriod === '30j' ? 30 : 90);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre tenant Microsoft 365</p>
        </div>
        <Button onClick={() => navigate('/actions')} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Voir toutes les actions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Utilisateurs actifs"
          value={activeUsers}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <KPICard
          title="Boîtes partagées"
          value={sharedMailboxes}
          icon={Mail}
          description={`Sur ${totalUsers} boîtes totales`}
        />
        <KPICard
          title="Stockage moyen"
          value={`${avgStorage} Go`}
          icon={HardDrive}
          trend={{ value: -2.1, isPositive: false }}
        />
        <KPICard
          title="Licences actives"
          value={activeUsers}
          icon={CreditCard}
          description="E3, Business Standard..."
        />
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Activité des emails</h2>
            <p className="text-sm text-muted-foreground mt-1">Volume des messages envoyés et reçus</p>
          </div>
          <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="7j">7 jours</TabsTrigger>
              <TabsTrigger value="30j">30 jours</TabsTrigger>
              <TabsTrigger value="90j">90 jours</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEnvoyes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRecus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
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
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Répartition des licences</h3>
          <div className="space-y-4">
            {[
              { label: 'Microsoft 365 E3', count: 8, color: 'bg-primary' },
              { label: 'Business Standard', count: 12, color: 'bg-accent' },
              { label: 'Apps for Business', count: 5, color: 'bg-warning' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.count} licences</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-smooth`}
                    style={{ width: `${(item.count / 25) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
          <div className="space-y-4">
            {[
              { action: 'Nouvelle boîte créée', user: 'Paul Martin', time: 'Il y a 2h', icon: Users },
              { action: 'Licence mise à niveau', user: 'Marie Dubois', time: 'Il y a 5h', icon: CreditCard },
              { action: 'Archivage terminé', user: 'Compta@exemple.fr', time: 'Hier', icon: HardDrive },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.user}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
