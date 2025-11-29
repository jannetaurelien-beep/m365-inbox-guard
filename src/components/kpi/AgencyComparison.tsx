import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgencyMetrics } from '@/lib/types/kpi';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Mail, Clock, AlertCircle } from 'lucide-react';

interface AgencyComparisonProps {
  agencies: AgencyMetrics[];
}

export function AgencyComparison({ agencies }: AgencyComparisonProps) {
  const sortedByScore = [...agencies].sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));
  const maxScore = Math.max(...agencies.map(a => a.avgScore || 0));

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedByScore.map((agency, index) => {
          const score = agency.avgScore || 0;
          const sla = agency.metrics.external.first_reply_within_sla || 0;
          const backlog = agency.metrics.external.backlog_total || 0;

          return (
            <Card key={agency.agency} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getScoreGradient(score)}`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {agency.agency}
                      {index === 0 && (
                        <Badge variant="default" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          #1
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {agency.userCount} boîte{agency.userCount > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      SLA respecté
                    </span>
                    <span className="font-medium">{sla.toFixed(0)}%</span>
                  </div>
                  <Progress value={sla} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <div className="text-2xl font-bold">
                      {agency.metrics.total.received.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Reçus
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {backlog.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Backlog
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
