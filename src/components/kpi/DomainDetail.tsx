import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Mail, Clock, AlertCircle, Globe } from 'lucide-react';
import { MailUserSummary } from '@/lib/types/kpi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DomainDetailProps {
  domain: string;
  users: MailUserSummary[];
  onBack: () => void;
}

export function DomainDetail({ domain, users, onBack }: DomainDetailProps) {
  const getScoreColor = (sla: number) => {
    if (sla >= 80) return 'text-green-500';
    if (sla >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (sla: number) => {
    if (sla >= 80) return 'from-green-500 to-emerald-500';
    if (sla >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  // Calculer les stats globales du domaine
  const totalReceived = users.reduce((sum, u) => sum + u.metrics.total.received, 0);
  const totalSent = users.reduce((sum, u) => sum + u.metrics.total.sent, 0);
  const totalBacklog = users.reduce((sum, u) => sum + (u.metrics.external.backlog_total || 0), 0);
  const avgSla = users.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / users.length;

  // Trier par SLA (meilleurs scores en premier)
  const sortedUsers = [...users].sort((a, b) => 
    (b.metrics.external.first_reply_within_sla || 0) - (a.metrics.external.first_reply_within_sla || 0)
  );

  // Données pour le graphique de comparaison
  const comparisonData = sortedUsers.map(user => ({
    name: user.displayName.split(' ').slice(0, 2).join(' '),
    SLA: user.metrics.external.first_reply_within_sla || 0,
    Backlog: user.metrics.external.backlog_total || 0,
    Reçus: user.metrics.total.received,
  }));

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            {domain}
          </h2>
          <p className="text-sm text-muted-foreground">
            {users.length} utilisateur{users.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalReceived.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Emails reçus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Emails envoyés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <AlertCircle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalBacklog.toLocaleString()}</div>
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
                <div className={`text-2xl font-bold ${getScoreColor(avgSla)}`}>
                  {avgSla.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">SLA moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de comparaison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance comparative des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="SLA" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey="Backlog" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="Reçus" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Liste des membres */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedUsers.map((user, index) => {
              const sla = user.metrics.external.first_reply_within_sla || 0;
              const backlog = user.metrics.external.backlog_total || 0;
              const received = user.metrics.total.received;

              return (
                <div key={user.userId} className="relative">
                  <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-lg bg-gradient-to-b ${getScoreGradient(sla)}`} />
                  
                  <div className="pl-4 pr-4 py-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.displayName}</span>
                          {index === 0 && (
                            <Badge variant="default" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Top performer
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.upn}</div>
                        {user.jobTitle && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {user.jobTitle} {user.agency && `• ${user.agency}`}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(sla)}`}>
                          {sla.toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Score SLA</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">SLA respecté</span>
                        <span className="font-medium">{sla.toFixed(0)}%</span>
                      </div>
                      <Progress value={sla} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{received.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Reçus</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{backlog.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Backlog</div>
                        </div>
                      </div>
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
