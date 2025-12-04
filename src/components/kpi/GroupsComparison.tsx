import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileDown } from 'lucide-react';
import { exportGroupsToCSV } from '@/lib/export-utils';
import { getGroupColor, getGroupIcon, groupColorPresets } from './GroupCustomization';
import { cn } from '@/lib/utils';

interface GroupsComparisonProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onExportSuccess?: (message: string) => void;
}

// Fallback colors for charts
const CHART_COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 71%, 45%)',
  'hsl(262, 83%, 58%)',
  'hsl(31, 97%, 52%)',
  'hsl(340, 82%, 52%)',
  'hsl(199, 89%, 48%)',
  'hsl(48, 96%, 53%)',
  'hsl(152, 69%, 31%)',
];

// Map color preset values to HSL colors for charts
const colorToHsl: Record<string, string> = {
  blue: 'hsl(217, 91%, 60%)',
  violet: 'hsl(262, 83%, 58%)',
  emerald: 'hsl(152, 76%, 46%)',
  amber: 'hsl(38, 92%, 50%)',
  rose: 'hsl(350, 89%, 60%)',
  indigo: 'hsl(239, 84%, 67%)',
  cyan: 'hsl(189, 94%, 43%)',
  fuchsia: 'hsl(292, 84%, 61%)',
  lime: 'hsl(84, 81%, 44%)',
  red: 'hsl(0, 84%, 60%)',
  slate: 'hsl(215, 16%, 47%)',
  teal: 'hsl(173, 80%, 40%)',
};

export function GroupsComparison({ groups, users, onExportSuccess }: GroupsComparisonProps) {
  // Calculer les métriques pour chaque groupe
  const groupsData = groups.map((group, index) => {
    const groupUsers = users.filter(u => group.userIds.includes(u.userId));
    const colorPreset = getGroupColor(group.color);
    const chartColor = colorToHsl[group.color || 'blue'] || CHART_COLORS[index % CHART_COLORS.length];
    
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
        color: chartColor,
        colorPreset,
        icon: group.icon,
        group
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
      color: chartColor,
      colorPreset,
      icon: group.icon,
      group
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

      {/* Graphiques de comparaison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Graphique SLA */}
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

        {/* Graphique répartition des emails */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition des emails par groupe</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={volumeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {volumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Emails']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cartes des groupes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-fade-in">
        {groupsData.map((group) => {
          const GroupIcon = getGroupIcon(group.icon);
          return (
            <Card 
              key={group.id} 
              className={cn(
                "hover:shadow-xl transition-all duration-300 border-l-4 hover:-translate-y-1",
                `bg-gradient-to-br from-${group.colorPreset.value}-500/5 to-background`
              )} 
              style={{ borderLeftColor: group.color }}
            >
              <CardContent className="pt-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", group.colorPreset.gradient)}
                      >
                        <GroupIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.memberCount} membres</p>
                      </div>
                    </div>
                    <div 
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg",
                        group.avgSla >= 80 ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                        group.avgSla >= 60 ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                        "bg-gradient-to-br from-red-500 to-rose-500"
                      )}
                    >
                      {group.avgSla}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Reçus</p>
                      <p className="text-sm font-semibold text-blue-600">{group.totalReceived.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Envoyés</p>
                      <p className="text-sm font-semibold text-emerald-600">{group.totalSent.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Backlog</p>
                      <p className="text-sm font-semibold text-violet-600">{group.avgBacklog}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Délai P50</p>
                      <p className="text-sm font-semibold text-amber-600">{group.avgDelayP50} min</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}