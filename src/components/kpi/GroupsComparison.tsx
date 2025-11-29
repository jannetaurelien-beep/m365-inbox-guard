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
      {/* KPIs en cartes */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Groupes actifs</p>
                <p className="text-2xl font-bold">{groups.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total membres</p>
                <p className="text-2xl font-bold">{groupsData.reduce((sum, g) => sum + g.memberCount, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA moyen global</p>
                <p className="text-2xl font-bold">
                  {groupsData.length > 0 ? Math.round(groupsData.reduce((sum, g) => sum + g.avgSla, 0) / groupsData.length) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails totaux</p>
                <p className="text-2xl font-bold">
                  {groupsData.reduce((sum, g) => sum + g.totalReceived + g.totalSent, 0).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500 opacity-30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques de comparaison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyse comparative détaillée
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
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="radar">Vue globale</TabsTrigger>
              <TabsTrigger value="table">Tableau</TabsTrigger>
            </TabsList>

            {/* Onglet Performance - SLA et Backlog */}
            <TabsContent value="performance" className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-primary rounded" />
                  Taux de respect du SLA par groupe
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={groupsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="category" dataKey="shortName" />
                    <YAxis type="number" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value}%`, 'SLA']}
                      labelFormatter={(label) => groupsData.find(g => g.shortName === label)?.name}
                    />
                    <Bar 
                      dataKey="avgSla" 
                      name="SLA (%)" 
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Objectif : maintenir un SLA ≥ 80%
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-destructive rounded" />
                  Backlog moyen par groupe
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={groupsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="category" dataKey="shortName" />
                    <YAxis type="number" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value} emails`, 'Backlog']}
                      labelFormatter={(label) => groupsData.find(g => g.shortName === label)?.name}
                    />
                    <Bar 
                      dataKey="avgBacklog" 
                      name="Backlog moyen" 
                      fill="hsl(var(--destructive))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Objectif : maintenir un backlog {"<"} 20 emails
                </p>
              </div>
            </TabsContent>

            {/* Onglet Volume */}
            <TabsContent value="volume" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-4">Répartition du volume total</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={volumeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {volumeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} emails`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4">Volume emails reçus vs envoyés</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={groupsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="shortName" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        labelFormatter={(label) => groupsData.find(g => g.shortName === label)?.name}
                      />
                      <Legend />
                      <Bar dataKey="totalReceived" name="Reçus" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="totalSent" name="Envoyés" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-4">Délai de réponse moyen (P50)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="shortName" />
                    <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value} min`, 'Délai moyen']}
                      labelFormatter={(label) => groupsData.find(g => g.shortName === label)?.name}
                    />
                    <Bar 
                      dataKey="avgDelayP50" 
                      name="Délai (min)" 
                      fill="hsl(var(--chart-3))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Onglet Radar - Vue globale */}
            <TabsContent value="radar">
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={500}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {groupsData.map((group, index) => (
                      <Radar
                        key={group.id}
                        name={group.name}
                        dataKey={group.name}
                        stroke={group.color}
                        fill={group.color}
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    ))}
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg max-w-2xl">
                  <p className="text-sm text-muted-foreground">
                    <strong>Légende :</strong> Ce graphique compare les groupes sur 4 dimensions clés :
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li><strong>SLA</strong> : Taux de respect des délais de réponse (0-100%)</li>
                    <li><strong>Réactivité</strong> : Rapidité de réponse calculée sur le P50 (0-100)</li>
                    <li><strong>Gestion backlog</strong> : Capacité à maintenir un backlog faible (0-100)</li>
                    <li><strong>Volume traité</strong> : Part du volume total traité par le groupe (0-100)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Tableau */}
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Groupe</th>
                      <th className="text-center p-3 font-semibold">Membres</th>
                      <th className="text-center p-3 font-semibold">SLA moyen</th>
                      <th className="text-center p-3 font-semibold">Backlog moyen</th>
                      <th className="text-center p-3 font-semibold">Délai P50</th>
                      <th className="text-center p-3 font-semibold">Emails reçus</th>
                      <th className="text-center p-3 font-semibold">Emails envoyés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupsData.map((group) => (
                      <tr key={group.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />
                            <span className="font-medium">{group.name}</span>
                          </div>
                        </td>
                        <td className="text-center p-3">{group.memberCount}</td>
                        <td className="text-center p-3">
                          <span className={
                            group.avgSla >= 80 
                              ? 'text-green-600 font-semibold' 
                              : group.avgSla >= 60 
                                ? 'text-orange-600 font-semibold' 
                                : 'text-red-600 font-semibold'
                          }>
                            {group.avgSla}%
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className={
                            group.avgBacklog < 20 
                              ? 'text-green-600 font-semibold' 
                              : group.avgBacklog < 40 
                                ? 'text-orange-600 font-semibold' 
                                : 'text-red-600 font-semibold'
                          }>
                            {group.avgBacklog}
                          </span>
                        </td>
                        <td className="text-center p-3">{group.avgDelayP50} min</td>
                        <td className="text-center p-3">{group.totalReceived.toLocaleString()}</td>
                        <td className="text-center p-3">{group.totalSent.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}