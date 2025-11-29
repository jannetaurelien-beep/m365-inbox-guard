import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GroupPerformance } from '@/lib/types/kpi';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Mail, Send, Inbox, TrendingUp, Clock, Award, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GroupPerformanceViewProps {
  groupPerformance: GroupPerformance;
}

export function GroupPerformanceView({ groupPerformance }: GroupPerformanceViewProps) {
  const { group, metrics, users, avgScore } = groupPerformance;
  const ext = metrics.external;
  const sla = ext.first_reply_within_sla || 0;
  const backlog = ext.backlog_total || 0;
  const delayP50 = ext.first_reply_p50_min || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreBgGradient = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/20';
    if (score >= 60) return 'from-yellow-500/20 to-orange-500/20';
    return 'from-red-500/20 to-rose-500/20';
  };

  // Données pour le graphique comparatif des membres
  const membersData = users
    .map(user => ({
      name: user.displayName.split(' ')[0], // Prénom seulement
      fullName: user.displayName,
      sla: user.metrics.external.first_reply_within_sla || 0,
      backlog: user.metrics.external.backlog_total || 0,
    }))
    .sort((a, b) => b.sla - a.sla)
    .slice(0, 10); // Top 10

  return (
    <div className="space-y-6">
      {/* En-tête du groupe avec score */}
      <Card className={`relative overflow-hidden bg-gradient-to-br ${getScoreBgGradient(avgScore || 0)} border-2`}>
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getScoreGradient(avgScore || 0)}`} />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{group.name}</CardTitle>
                {group.description && (
                  <p className="text-muted-foreground">{group.description}</p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant="secondary" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {users.length} membre{users.length > 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    Performance globale
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Score principal */}
            <div className="text-center bg-background/60 backdrop-blur rounded-2xl p-6 border-2 shadow-lg min-w-[140px]">
              <Target className={`h-8 w-8 mx-auto mb-2 ${getScoreColor(avgScore || 0)}`} />
              <div className={`text-5xl font-bold ${getScoreColor(avgScore || 0)}`}>
                {(avgScore || 0).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Score moyen</div>
              <Progress 
                value={avgScore || 0} 
                className="mt-3 h-2"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-blue-500/40" />
            </div>
            <div className="text-3xl font-bold mb-1">{metrics.total.received.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Emails reçus</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500/40" />
            </div>
            <div className="text-3xl font-bold mb-1">{metrics.total.sent.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Emails envoyés</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
                <Inbox className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-orange-500/40" />
            </div>
            <div className="text-3xl font-bold mb-1">{backlog.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Backlog total</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-purple-500/40" />
            </div>
            <div className="text-3xl font-bold mb-1">{sla.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">SLA respecté</div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Temps de réponse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Délai médian (P50)</span>
                <span className="text-xl font-bold">{delayP50} min</span>
              </div>
              <Progress 
                value={Math.max(0, 100 - Math.min(delayP50, 100))} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taux de respect SLA</span>
                <span className={`text-xl font-bold ${sla >= 80 ? 'text-green-600' : sla >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                  {sla.toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={sla} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Comparaison Top 10 membres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={membersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(label) => membersData.find(m => m.name === label)?.fullName}
                  formatter={(value: number) => [`${value}%`, 'SLA']}
                />
                <Bar 
                  dataKey="sla" 
                  fill="hsl(var(--primary))" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Liste détaillée des membres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Détail des membres ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Nom</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Fonction</th>
                  <th className="text-center p-3 font-semibold">SLA</th>
                  <th className="text-center p-3 font-semibold">Backlog</th>
                  <th className="text-center p-3 font-semibold">Reçus</th>
                  <th className="text-center p-3 font-semibold">Envoyés</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userSla = user.metrics.external.first_reply_within_sla || 0;
                  const userBacklog = user.metrics.external.backlog_total || 0;

                  return (
                    <tr key={user.userId} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{user.displayName}</td>
                      <td className="p-3 text-muted-foreground text-xs">{user.upn}</td>
                      <td className="p-3 text-muted-foreground text-xs">{user.jobTitle || '-'}</td>
                      <td className="text-center p-3">
                        <span className={
                          userSla >= 80 
                            ? 'text-green-600 font-semibold' 
                            : userSla >= 60 
                              ? 'text-orange-600 font-semibold' 
                              : 'text-red-600 font-semibold'
                        }>
                          {userSla.toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className={
                          userBacklog < 20 
                            ? 'text-green-600 font-semibold' 
                            : userBacklog < 40 
                              ? 'text-orange-600 font-semibold' 
                              : 'text-red-600 font-semibold'
                        }>
                          {userBacklog}
                        </span>
                      </td>
                      <td className="text-center p-3 tabular-nums">{user.metrics.external.received}</td>
                      <td className="text-center p-3 tabular-nums">{user.metrics.external.sent}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}