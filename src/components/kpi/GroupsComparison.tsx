import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { BarChart3, Radar as RadarIcon, TrendingUp, FileDown } from 'lucide-react';
import { exportGroupsToCSV } from '@/lib/export-utils';

interface GroupsComparisonProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onExportSuccess?: (message: string) => void;
}

export function GroupsComparison({ groups, users, onExportSuccess }: GroupsComparisonProps) {
  // Calculer les métriques pour chaque groupe
  const groupsData = groups.map(group => {
    const groupUsers = users.filter(u => group.userIds.includes(u.userId));
    
    if (groupUsers.length === 0) {
      return {
        name: group.name,
        avgSla: 0,
        avgBacklog: 0,
        totalReceived: 0,
        totalSent: 0,
        avgDelayP50: 0,
        memberCount: 0
      };
    }

    const avgSla = groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / groupUsers.length;
    const avgBacklog = groupUsers.reduce((sum, u) => sum + (u.metrics.external.backlog_total || 0), 0) / groupUsers.length;
    const totalReceived = groupUsers.reduce((sum, u) => sum + u.metrics.external.received, 0);
    const totalSent = groupUsers.reduce((sum, u) => sum + u.metrics.external.sent, 0);
    const avgDelayP50 = groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_p50_min || 0), 0) / groupUsers.length;

    return {
      name: group.name,
      avgSla: Math.round(avgSla),
      avgBacklog: Math.round(avgBacklog),
      totalReceived,
      totalSent,
      avgDelayP50: Math.round(avgDelayP50),
      memberCount: groupUsers.length
    };
  });

  // Données pour le radar chart
  const radarData = groupsData.map(g => ({
    group: g.name.length > 15 ? g.name.substring(0, 15) + '...' : g.name,
    SLA: g.avgSla,
    'Réactivité': Math.max(0, 100 - g.avgDelayP50),
    'Volume': Math.min(100, (g.totalReceived + g.totalSent) / 50),
    'Efficacité': Math.max(0, 100 - g.avgBacklog),
  }));

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparaison des groupes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bars" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bars">
                <BarChart3 className="h-4 w-4 mr-2" />
                Barres
              </TabsTrigger>
              <TabsTrigger value="radar">
                <RadarIcon className="h-4 w-4 mr-2" />
                Radar
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Métriques
              </TabsTrigger>
            </TabsList>

            {/* Graphique en barres - SLA et Backlog */}
            <TabsContent value="bars" className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-4">Performance SLA et Backlog</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgSla" name="SLA moyen (%)" fill="hsl(var(--primary))" />
                    <Bar dataKey="avgBacklog" name="Backlog moyen" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-4">Volume d'emails</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalReceived" name="Emails reçus" fill="#3b82f6" />
                    <Bar dataKey="totalSent" name="Emails envoyés" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Graphique radar */}
            <TabsContent value="radar">
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={500}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="group" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      name="Performance globale" 
                      dataKey="SLA" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Légende :</strong> Le graphique radar compare les groupes sur plusieurs dimensions de performance. 
                  Plus la zone est grande, meilleure est la performance globale du groupe.
                </p>
              </div>
            </TabsContent>

            {/* Métriques détaillées */}
            <TabsContent value="metrics">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Délai de réponse moyen (P50)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgDelayP50" name="Délai moyen (min)" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>

                <h4 className="text-sm font-semibold mt-6">Nombre de membres par groupe</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="memberCount" name="Nombre de membres" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tableau récapitulatif */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tableau récapitulatif</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportGroupsToCSV(groups, users, `comparaison-groupes-${new Date().toISOString().split('T')[0]}.csv`);
                onExportSuccess?.(`Tableau de ${groups.length} groupes exporté`);
              }}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exporter tableau
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Groupe</th>
                  <th className="text-center p-3">Membres</th>
                  <th className="text-center p-3">SLA moyen</th>
                  <th className="text-center p-3">Backlog moyen</th>
                  <th className="text-center p-3">Délai P50 (min)</th>
                  <th className="text-center p-3">Emails reçus</th>
                  <th className="text-center p-3">Emails envoyés</th>
                </tr>
              </thead>
              <tbody>
                {groupsData.map((group, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{group.name}</td>
                    <td className="text-center p-3">{group.memberCount}</td>
                    <td className="text-center p-3">
                      <span className={group.avgSla >= 80 ? 'text-green-600 font-semibold' : group.avgSla >= 60 ? 'text-orange-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {group.avgSla}%
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <span className={group.avgBacklog < 20 ? 'text-green-600 font-semibold' : group.avgBacklog < 40 ? 'text-orange-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {group.avgBacklog}
                      </span>
                    </td>
                    <td className="text-center p-3">{group.avgDelayP50}</td>
                    <td className="text-center p-3">{group.totalReceived.toLocaleString()}</td>
                    <td className="text-center p-3">{group.totalSent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
