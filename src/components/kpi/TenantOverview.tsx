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
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      title: 'E-mails envoyés',
      value: data.totals.sent.toLocaleString(),
      icon: Send,
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/20',
    },
    {
      title: 'Délai médian (P50)',
      value: `${Math.round(data.external.first_reply_p50_min)} min`,
      icon: Clock,
      gradient: 'from-orange-500 to-amber-500',
      shadowColor: 'shadow-orange-500/20',
    },
    {
      title: 'Réponses dans SLA',
      value: `${Math.round(data.external.within_sla)}%`,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      title: 'Backlog moyen',
      value: Math.round(data.external.avg_backlog_total).toLocaleString(),
      icon: Inbox,
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/20',
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
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={kpi.title} 
              className={`hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br ${kpi.gradient} animate-scale-in`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-2">{kpi.title}</p>
                    <p className="text-4xl font-bold text-white tracking-tight">{kpi.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertes */}
      {data.alerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Alertes & Notifications</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.alerts.map((alert, idx) => (
              <Alert key={idx} variant={getAlertVariant(alert.type)} className="border-l-4 animate-slide-in" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle className="text-base font-semibold mb-1">{alert.title}</AlertTitle>
                    <AlertDescription className="text-sm">{alert.detail}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Top utilisateurs */}
      {data.topUsers.length > 0 && (
        <Card className="border-2">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              Top utilisateurs (externes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topUsers.map((user, idx) => {
                const sla = user.metrics.external.first_reply_within_sla || 0;
                const backlog = user.metrics.external.backlog_total || 0;
                const volume = user.metrics.external.received + user.metrics.external.sent;

                const slaColor = sla >= 80 ? 'text-green-600 bg-green-100' : sla >= 60 ? 'text-orange-600 bg-orange-100' : 'text-red-600 bg-red-100';
                const backlogColor = backlog < 20 ? 'text-green-600 bg-green-100' : backlog < 40 ? 'text-orange-600 bg-orange-100' : 'text-red-600 bg-red-100';

                return (
                  <div 
                    key={user.userId} 
                    className="flex items-center gap-6 p-5 rounded-2xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 border border-border/50 hover:border-primary/30 hover:shadow-lg animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
                        {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg text-foreground truncate">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.upn}</p>
                      {user.department && (
                        <p className="text-xs text-muted-foreground mt-1">{user.department}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`${slaColor} px-3 py-1.5 text-sm font-semibold`}>
                        SLA {Math.round(sla)}%
                      </Badge>
                      <Badge variant="outline" className={`${backlogColor} px-3 py-1.5 text-sm font-semibold`}>
                        {backlog} backlog
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1.5 text-sm font-semibold">
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
