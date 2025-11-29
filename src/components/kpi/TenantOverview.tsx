import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TenantOverviewResponse, UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Mail, Send, Clock, CheckCircle2, Inbox, AlertTriangle, Info, AlertCircle, ArrowUp, ArrowDown, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

interface TenantOverviewProps {
  data: TenantOverviewResponse;
  groups?: UserGroup[];
  users?: MailUserSummary[];
  onSelectGroup?: (groupId: string) => void;
}

export function TenantOverview({ data, groups = [], users = [], onSelectGroup }: TenantOverviewProps) {
  const [userSearch, setUserSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filtrer et paginer les top users
  const filteredTopUsers = useMemo(() => {
    if (!userSearch) return data.topUsers;
    const searchLower = userSearch.toLowerCase();
    return data.topUsers.filter(u => 
      u.displayName.toLowerCase().includes(searchLower) || 
      u.upn.toLowerCase().includes(searchLower)
    );
  }, [data.topUsers, userSearch]);
  
  const totalPages = Math.ceil(filteredTopUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredTopUsers.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredTopUsers, currentPage]);
  
  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch]);
  // Calculer les performances des groupes
  const groupsPerformance = groups.map(group => {
    const groupUsers = users.filter(u => group.userIds.includes(u.userId));
    const totalReceived = groupUsers.reduce((sum, u) => sum + u.metrics.external.received, 0);
    const totalSent = groupUsers.reduce((sum, u) => sum + u.metrics.external.sent, 0);
    const avgSla = groupUsers.length > 0 
      ? groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / groupUsers.length 
      : 0;
    const avgBacklog = groupUsers.length > 0
      ? groupUsers.reduce((sum, u) => sum + (u.metrics.external.backlog_total || 0), 0) / groupUsers.length
      : 0;
    
    return {
      group,
      userCount: groupUsers.length,
      avgSla,
      avgBacklog,
      totalReceived,
      totalSent,
    };
  });

  const kpiCards = [
    {
      title: 'E-mails reçus',
      value: data.totals.received.toLocaleString(),
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'E-mails envoyés',
      value: data.totals.sent.toLocaleString(),
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Délai médian (P50)',
      value: `${Math.round(data.external.first_reply_p50_min)} min`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '-5%',
      trendUp: false,
    },
    {
      title: 'Réponses dans SLA',
      value: `${Math.round(data.external.within_sla)}%`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+3%',
      trendUp: true,
    },
    {
      title: 'Backlog moyen',
      value: Math.round(data.external.avg_backlog_total).toLocaleString(),
      icon: Inbox,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '-15%',
      trendUp: false,
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertVariant = (type: string): "default" | "destructive" => {
    return type === 'critical' ? 'destructive' : 'default';
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid - Design professionnel épuré */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    {kpi.trendUp ? (
                      <ArrowUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-orange-600" />
                    )}
                    {kpi.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Groupes créés */}
      {groupsPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Groupes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupsPerformance.map((gp) => {
              const slaColor = gp.avgSla >= 80 ? 'bg-green-100 text-green-700' : gp.avgSla >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700';
              const backlogColor = gp.avgBacklog < 20 ? 'bg-green-100 text-green-700' : gp.avgBacklog < 40 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700';

              return (
                <div 
                  key={gp.group.id} 
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onSelectGroup?.(gp.group.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{gp.group.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {gp.userCount} membre{gp.userCount > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`${slaColor} border-0 text-xs`}>
                      {Math.round(gp.avgSla)}%
                    </Badge>
                    <Badge variant="outline" className={`${backlogColor} border-0 text-xs`}>
                      {Math.round(gp.avgBacklog)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Layout 2 colonnes pour alertes et top users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes */}
        {data.alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Alertes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.alerts.map((alert, idx) => (
                <Alert key={idx} variant={getAlertVariant(alert.type)} className="border-l-4">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-1">
                      <AlertTitle className="text-sm font-semibold">{alert.title}</AlertTitle>
                      <AlertDescription className="text-sm">{alert.detail}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Top utilisateurs */}
        {data.topUsers.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Top utilisateurs (externes)</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {filteredTopUsers.length} / {data.topUsers.length}
                </div>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {paginatedUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                <>
                  {paginatedUsers.map((user, idx) => {
                    const actualIdx = (currentPage - 1) * itemsPerPage + idx;
                const sla = user.metrics.external.first_reply_within_sla || 0;
                const backlog = user.metrics.external.backlog_total || 0;
                const volume = user.metrics.external.received + user.metrics.external.sent;

                const slaColor = sla >= 80 ? 'bg-green-100 text-green-700' : sla >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700';
                const backlogColor = backlog < 20 ? 'bg-green-100 text-green-700' : backlog < 40 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700';

                return (
                  <div key={user.userId} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                        {actualIdx + 1}
                      </div>
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-muted text-foreground text-sm font-medium">
                          {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`${slaColor} border-0 text-xs`}>
                        {Math.round(sla)}%
                      </Badge>
                      <Badge variant="outline" className={`${backlogColor} border-0 text-xs`}>
                        {backlog}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
