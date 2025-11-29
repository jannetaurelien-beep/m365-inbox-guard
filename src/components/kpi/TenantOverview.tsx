import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TenantOverviewResponse } from '@/lib/types/kpi';
import { Mail, Send, Clock, CheckCircle2, Inbox, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface TenantOverviewProps {
  data: TenantOverviewResponse;
}

export function TenantOverview({ data }: TenantOverviewProps) {
  const kpiCards = [
    {
      title: 'E-mails reçus',
      value: data.totals.received.toLocaleString(),
      icon: Mail,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'E-mails envoyés',
      value: data.totals.sent.toLocaleString(),
      icon: Send,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Délai médian (P50)',
      value: `${Math.round(data.external.first_reply_p50_min)} min`,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Réponses dans SLA',
      value: `${Math.round(data.external.within_sla)}%`,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Backlog moyen',
      value: Math.round(data.external.avg_backlog_total).toLocaleString(),
      icon: Inbox,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string): "default" | "destructive" => {
    return type === 'critical' ? 'destructive' : 'default';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-card-hover transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">{kpi.title}</p>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertes */}
      {data.alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Alertes</h3>
          {data.alerts.map((alert, idx) => (
            <Alert key={idx} variant={getAlertVariant(alert.type)}>
              {getAlertIcon(alert.type)}
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.detail}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Top utilisateurs */}
      {data.topUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top utilisateurs (externes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topUsers.map((user) => {
                const sla = user.metrics.external.first_reply_within_sla || 0;
                const backlog = user.metrics.external.backlog_total || 0;
                const volume = user.metrics.external.received + user.metrics.external.sent;

                const slaColor = sla >= 80 ? 'text-green-600 bg-green-100' : sla >= 60 ? 'text-orange-600 bg-orange-100' : 'text-red-600 bg-red-100';
                const backlogColor = backlog < 20 ? 'text-green-600 bg-green-100' : backlog < 40 ? 'text-orange-600 bg-orange-100' : 'text-red-600 bg-red-100';

                return (
                  <div key={user.userId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.upn}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={slaColor}>
                        SLA {Math.round(sla)}%
                      </Badge>
                      <Badge variant="outline" className={backlogColor}>
                        {backlog} backlog
                      </Badge>
                      <Badge variant="secondary">
                        {volume.toLocaleString()} e-mails
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
