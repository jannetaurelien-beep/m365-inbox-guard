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
  'hsl(217, 91%, 60%)',  // Bleu vif
  'hsl(142, 71%, 45%)',  // Vert moderne
  'hsl(262, 83%, 58%)',  // Violet
  'hsl(31, 97%, 52%)',   // Orange
  'hsl(340, 82%, 52%)',  // Rose/Rouge
  'hsl(199, 89%, 48%)',  // Cyan
  'hsl(48, 96%, 53%)',   // Jaune
  'hsl(152, 69%, 31%)',  // Vert foncé
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
    <div className="space-y-6">
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

      {/* Cartes des groupes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groupsData.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow" style={{ borderTop: `4px solid ${group.color}` }}>
            <CardHeader>
              <CardTitle className="text-base">{group.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{group.memberCount} membres</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">SLA moyen</span>
                <span className="text-lg font-bold">{group.avgSla}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Backlog moyen</span>
                <span className="text-sm font-medium">{group.avgBacklog}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}