import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, FileDown, TrendingUp, Users } from 'lucide-react';
import { exportGroupsToCSV } from '@/lib/export-utils';

interface GroupsComparisonProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onExportSuccess?: (message: string) => void;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function GroupsComparison({ groups, users, onExportSuccess }: GroupsComparisonProps) {
  // Calculer les métriques pour chaque groupe
  const groupsData = groups.map((group, index) => {
    const groupUsers = users.filter(u => group.userIds.includes(u.userId));
    
    if (groupUsers.length === 0) {
      return {
        id: group.id,
        name: group.name,
        shortName: group.name.length > 12 ? group.name.substring(0, 12) + '...' : group.name,
        avgSla: 0,
        avgBacklog: 0,
        totalReceived: 0,
        totalSent: 0,
        avgDelayP50: 0,
        memberCount: 0,
        color: COLORS[index % COLORS.length]
      };
    }

    const avgSla = groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / groupUsers.length;
    const avgBacklog = groupUsers.reduce((sum, u) => sum + (u.metrics.external.backlog_total || 0), 0) / groupUsers.length;
    const totalReceived = groupUsers.reduce((sum, u) => sum + u.metrics.external.received, 0);
    const totalSent = groupUsers.reduce((sum, u) => sum + u.metrics.external.sent, 0);
    const avgDelayP50 = groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_p50_min || 0), 0) / groupUsers.length;

    return {
      id: group.id,
      name: group.name,
      shortName: group.name.length > 12 ? group.name.substring(0, 12) + '...' : group.name,
      avgSla: Math.round(avgSla),
      avgBacklog: Math.round(avgBacklog),
      totalReceived,
      totalSent,
      avgDelayP50: Math.round(avgDelayP50),
      memberCount: groupUsers.length,
      color: COLORS[index % COLORS.length]
    };
  });

  // Données pour le graphique radar - Performance globale
  const radarData = [
    {
      metric: 'SLA',
      ...Object.fromEntries(groupsData.map(g => [g.name, g.avgSla]))
    },
    {
      metric: 'Réactivité',
      ...Object.fromEntries(groupsData.map(g => [g.name, Math.max(0, 100 - Math.min(g.avgDelayP50, 100))]))
    },
    {
      metric: 'Gestion backlog',
      ...Object.fromEntries(groupsData.map(g => [g.name, Math.max(0, 100 - Math.min(g.avgBacklog * 2, 100))]))
    },
    {
      metric: 'Volume traité',
      ...Object.fromEntries(groupsData.map(g => [g.name, Math.min(100, ((g.totalReceived + g.totalSent) / Math.max(...groupsData.map(x => x.totalReceived + x.totalSent))) * 100)]))
    }
  ];

  // Données pour le pie chart - Répartition des emails
  const volumeData = groupsData.map(g => ({
    name: g.name,
    value: g.totalReceived + g.totalSent,
    color: g.color
  })).filter(g => g.value > 0);

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Aucune comparaison disponible</p>
          <p className="text-sm text-muted-foreground mt-1">Créez au moins un groupe pour voir les graphiques</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Graphique principal simplifié */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparaison des groupes
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportGroupsToCSV(groups, users, `comparaison-groupes-${new Date().toISOString().split('T')[0]}.csv`);
                onExportSuccess?.(`Comparaison de ${groups.length} groupes exportée`);
              }}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sla" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sla">Performance SLA</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>

            {/* Onglet SLA */}
            <TabsContent value="sla" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={groupsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Bar 
                    dataKey="avgSla" 
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                  >
                    {groupsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Onglet Volume */}
            <TabsContent value="volume" className="space-y-4">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={volumeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {volumeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value.toLocaleString()} emails`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tableau récapitulatif simple */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des groupes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groupsData.map((group) => (
              <div 
                key={group.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="h-4 w-4 rounded-full" 
                    style={{ backgroundColor: group.color }} 
                  />
                  <div>
                    <p className="font-semibold">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{group.memberCount} membres</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">SLA</p>
                    <p className={`text-lg font-bold ${
                      group.avgSla >= 80 ? 'text-green-600' : 
                      group.avgSla >= 60 ? 'text-orange-600' : 
                      'text-red-600'
                    }`}>
                      {group.avgSla}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Emails</p>
                    <p className="text-lg font-bold">
                      {(group.totalReceived + group.totalSent).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}