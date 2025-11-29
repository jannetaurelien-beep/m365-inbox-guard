import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GroupPerformance } from '@/lib/types/kpi';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Mail, Send, Inbox, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface GroupPerformanceViewProps {
  groupPerformance: GroupPerformance;
}

export function GroupPerformanceView({ groupPerformance }: GroupPerformanceViewProps) {
  const { group, metrics, users, avgScore } = groupPerformance;
  const ext = metrics.external;
  const sla = ext.first_reply_within_sla || 0;
  const backlog = ext.backlog_total || 0;

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

  return (
    <div className="space-y-6">
      {/* En-tête du groupe */}
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getScoreGradient(avgScore || 0)}`} />
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Users className="h-6 w-6" />
                {group.name}
              </CardTitle>
              {group.description && (
                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(avgScore || 0)}`}>
                {(avgScore || 0).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Score moyen</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">
              {users.length} membre{users.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Métriques globales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.total.received.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Emails reçus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Send className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.total.sent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Emails envoyés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Inbox className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{backlog.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Backlog total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{sla.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">SLA respecté</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des membres */}
      <Card>
        <CardHeader>
          <CardTitle>Membres du groupe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => {
              const userBacklog = user.metrics.external.backlog_total || 0;
              const userSla = user.metrics.external.first_reply_within_sla || 0;

              return (
                <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium">{user.displayName}</div>
                    <div className="text-sm text-muted-foreground">{user.upn}</div>
                    {user.jobTitle && (
                      <div className="text-xs text-muted-foreground mt-1">{user.jobTitle}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{userSla.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">SLA</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{userBacklog}</div>
                      <div className="text-xs text-muted-foreground">Backlog</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
