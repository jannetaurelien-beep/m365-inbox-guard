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
      {/* En-tête avec stats globales */}
      <div className="flex justify-between items-start gap-4">
        <div className="grid grid-cols-3 gap-4 flex-1">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Total groupes</p>
              <p className="text-2xl font-bold">{groups.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">SLA moyen</p>
              <p className="text-2xl font-bold">
                {Math.round(groupsData.reduce((sum, g) => sum + g.avgSla, 0) / groupsData.length)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Emails totaux</p>
              <p className="text-2xl font-bold">
                {groupsData.reduce((sum, g) => sum + g.totalReceived + g.totalSent, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
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

      {/* Graphique SLA avec couleurs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance SLA par groupe</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={groupsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="shortName" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                label={{ value: 'SLA %', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number) => [`${value}%`, 'SLA']}
                labelFormatter={(label) => {
                  const group = groupsData.find(g => g.shortName === label);
                  return group ? group.name : label;
                }}
              />
              <Bar 
                dataKey="avgSla" 
                radius={[8, 8, 0, 0]}
              >
                {groupsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cartes des groupes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groupsData.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-all duration-200 border-l-4" style={{ borderLeftColor: group.color }}>
            <CardContent className="pt-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.memberCount} membres</p>
                  </div>
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: group.color }}
                  >
                    {group.avgSla}%
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reçus</p>
                    <p className="text-sm font-semibold">{group.totalReceived.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Envoyés</p>
                    <p className="text-sm font-semibold">{group.totalSent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Backlog</p>
                    <p className="text-sm font-semibold">{group.avgBacklog}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Délai P50</p>
                    <p className="text-sm font-semibold">{group.avgDelayP50} min</p>
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