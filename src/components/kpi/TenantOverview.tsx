import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { TenantOverviewResponse, UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Mail, Send, Clock, CheckCircle2, Inbox, AlertTriangle, Info, AlertCircle, ArrowUp, ArrowDown, Users, Search, ChevronLeft, ChevronRight, TrendingUp, Zap, Target, Activity } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getGroupColor, getGroupIcon } from './GroupCustomization';

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
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      trend: '+12%',
      trendUp: true,
      ringColor: 'ring-blue-500/20',
    },
    {
      title: 'E-mails envoyés',
      value: data.totals.sent.toLocaleString(),
      icon: Send,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      trend: '+8%',
      trendUp: true,
      ringColor: 'ring-emerald-500/20',
    },
    {
      title: 'Délai médian (P50)',
      value: `${Math.round(data.external.first_reply_p50_min)} min`,
      icon: Clock,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-500/10 to-amber-500/10',
      iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500',
      trend: '-5%',
      trendUp: false,
      ringColor: 'ring-orange-500/20',
    },
    {
      title: 'Réponses dans SLA',
      value: `${Math.round(data.external.within_sla)}%`,
      icon: Target,
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500',
      trend: '+3%',
      trendUp: true,
      ringColor: 'ring-violet-500/20',
      progress: Math.round(data.external.within_sla),
    },
    {
      title: 'Backlog moyen',
      value: Math.round(data.external.avg_backlog_total).toLocaleString(),
      icon: Inbox,
      gradient: 'from-rose-500 to-pink-500',
      bgGradient: 'from-rose-500/10 to-pink-500/10',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
      trend: '-15%',
      trendUp: false,
      ringColor: 'ring-rose-500/20',
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

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-500/10 to-transparent';
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent';
      default:
        return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent';
    }
  };

  const groupColors = [
    { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-600' },
    { gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10', text: 'text-violet-600' },
    { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
    { gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', text: 'text-rose-600' },
    { gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500/10', text: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid - Design coloré et moderne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={kpi.title} 
              className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-1 ${kpi.ringColor} bg-gradient-to-br ${kpi.bgGradient}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${kpi.gradient} rounded-full blur-3xl opacity-20`} />
              
              <CardContent className="p-5 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${kpi.iconBg} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`gap-1 ${kpi.trendUp ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'}`}
                  >
                    {kpi.trendUp ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {kpi.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent`}>
                    {kpi.value}
                  </p>
                  {kpi.progress !== undefined && (
                    <div className="mt-3">
                      <Progress value={kpi.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Utilisateurs actifs', value: data.topUsers.length, icon: Users, color: 'blue' },
          { label: 'Groupes', value: groups.length, icon: Activity, color: 'violet' },
          { label: 'Alertes', value: data.alerts.length, icon: AlertTriangle, color: 'amber' },
          { label: 'Performance', value: `${Math.round(data.external.within_sla)}%`, icon: Zap, color: 'emerald' },
        ].map((stat, idx) => (
          <div 
            key={stat.label}
            className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-${stat.color}-500/5 to-${stat.color}-500/10 border border-${stat.color}-500/10`}
          >
            <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Groupes créés */}
      {groupsPerformance.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5 overflow-hidden">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Groupes
              </span>
              <Badge variant="secondary" className="ml-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                {groups.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {groupsPerformance.map((gp) => {
              const colorPreset = getGroupColor(gp.group.color);
              const GroupIcon = getGroupIcon(gp.group.icon);
              const slaColor = gp.avgSla >= 80 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : gp.avgSla >= 60 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30';
              const backlogColor = gp.avgBacklog < 20 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : gp.avgBacklog < 40 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30';

              return (
                <div 
                  key={gp.group.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-primary/20 bg-gradient-to-r from-${colorPreset.value}-500/5 to-${colorPreset.value}-500/10 hover:shadow-md transition-all duration-300 cursor-pointer group`}
                  onClick={() => onSelectGroup?.(gp.group.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorPreset.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      <GroupIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm text-${colorPreset.value}-600 dark:text-${colorPreset.value}-400 truncate`}>{gp.group.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {gp.userCount} membre{gp.userCount > 1 ? 's' : ''} • {gp.totalReceived.toLocaleString()} emails
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`${slaColor} text-xs font-medium`}>
                      <Target className="h-3 w-3 mr-1" />
                      {Math.round(gp.avgSla)}%
                    </Badge>
                    <Badge variant="outline" className={`${backlogColor} text-xs font-medium`}>
                      <Inbox className="h-3 w-3 mr-1" />
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-red-500/5 overflow-hidden">
            <CardHeader className="border-b border-red-500/10">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Alertes
                </span>
                <Badge variant="secondary" className="ml-2 bg-red-500/10 text-red-600 border-red-500/20">
                  {data.alerts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {data.alerts.map((alert, idx) => (
                <Alert key={idx} className={`${getAlertStyles(alert.type)} border-0`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.type === 'critical' ? 'bg-red-500/20 text-red-500' :
                      alert.type === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <AlertTitle className="text-sm font-semibold">{alert.title}</AlertTitle>
                      <AlertDescription className="text-sm text-muted-foreground">{alert.detail}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Top utilisateurs */}
        {data.topUsers.length > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5 overflow-hidden">
            <CardHeader className="border-b border-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Top utilisateurs
                  </span>
                </CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {filteredTopUsers.length} / {data.topUsers.length}
                </Badge>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 bg-background/50 border-primary/20 focus:border-primary/40"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
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

                    const slaColor = sla >= 80 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : sla >= 60 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30';
                    const backlogColor = backlog < 20 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : backlog < 40 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30';

                    const rankBg = actualIdx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
                                   actualIdx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                                   actualIdx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                                   'bg-gradient-to-br from-primary/80 to-primary';

                    return (
                      <div 
                        key={user.userId} 
                        className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full ${rankBg} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                            {actualIdx + 1}
                          </div>
                          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground text-sm font-medium">
                              {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={`${slaColor} text-xs font-medium`}>
                            {Math.round(sla)}%
                          </Badge>
                          <Badge variant="outline" className={`${backlogColor} text-xs font-medium`}>
                            {backlog}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} sur {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="border-primary/20 hover:border-primary/40 hover:bg-primary/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="border-primary/20 hover:border-primary/40 hover:bg-primary/10"
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
