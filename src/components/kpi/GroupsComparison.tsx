import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileDown } from 'lucide-react';
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
          <p className="text-lg font-medium text-muted-foreground">Aucun groupe créé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec export */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            exportGroupsToCSV(groups, users, `groupes-${new Date().toISOString().split('T')[0]}.csv`);
            onExportSuccess?.(`${groups.length} groupes exportés`);
          }}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Graphique SLA simplifié */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance SLA</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}%`, 'SLA']}
              />
              <Bar 
                dataKey="avgSla" 
                radius={[6, 6, 0, 0]}
              >
                {groupsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cartes récapitulatives */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groupsData.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div 
                  className="h-10 w-1 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: group.color }} 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{group.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">{group.memberCount} membres</p>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">SLA</p>
                      <p className={`text-xl font-bold ${
                        group.avgSla >= 80 ? 'text-green-600' : 
                        group.avgSla >= 60 ? 'text-orange-600' : 
                        'text-red-600'
                      }`}>
                        {group.avgSla}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Emails</p>
                      <p className="text-lg font-semibold">
                        {(group.totalReceived + group.totalSent).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}