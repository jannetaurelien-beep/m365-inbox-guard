import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Users, ChevronDown, ChevronUp, Trash2, Edit, TrendingUp, FileDown, Mail, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportGroupMembersToCSV } from '@/lib/export-utils';
import { Progress } from '@/components/ui/progress';

interface GroupsViewProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onSelectGroup: (groupId: string) => void;
  onEditGroup: (group: UserGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onExportSuccess?: (message: string) => void;
}

export function GroupsView({ groups, users, onSelectGroup, onEditGroup, onDeleteGroup, onExportSuccess }: GroupsViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const getGroupMetrics = (group: UserGroup) => {
    const groupUsers = users.filter(u => group.userIds.includes(u.userId));
    
    if (groupUsers.length === 0) {
      return {
        userCount: 0,
        avgSla: 0,
        avgBacklog: 0,
        totalReceived: 0,
        totalSent: 0,
        users: []
      };
    }

    const avgSla = groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / groupUsers.length;
    const avgBacklog = groupUsers.reduce((sum, u) => sum + (u.metrics.external.backlog_total || 0), 0) / groupUsers.length;
    const totalReceived = groupUsers.reduce((sum, u) => sum + u.metrics.external.received, 0);
    const totalSent = groupUsers.reduce((sum, u) => sum + u.metrics.external.sent, 0);

    return {
      userCount: groupUsers.length,
      avgSla,
      avgBacklog,
      totalReceived,
      totalSent,
      users: groupUsers
    };
  };

  const getSlaColorClass = (sla: number) => {
    if (sla >= 80) return 'text-green-600 dark:text-green-400';
    if (sla >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBacklogColorClass = (backlog: number) => {
    if (backlog < 20) return 'text-green-600 dark:text-green-400';
    if (backlog < 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceGradient = (sla: number) => {
    if (sla >= 80) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    if (sla >= 60) return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30';
    return 'from-red-500/20 to-rose-500/20 border-red-500/30';
  };

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">Aucun groupe créé</p>
          <p className="text-sm text-muted-foreground mt-1">Créez un groupe pour organiser vos utilisateurs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const metrics = getGroupMetrics(group);
        const isExpanded = expandedGroups.has(group.id);
        const slaProgress = Math.round(metrics.avgSla);

        return (
          <Card 
            key={group.id} 
            className={cn(
              "overflow-hidden transition-all duration-200",
              "bg-gradient-to-br border-2",
              getPerformanceGradient(metrics.avgSla)
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                {/* Info groupe */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 truncate">{group.name}</CardTitle>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                    )}
                  </div>
                </div>

                {/* Actions et badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-semibold">{metrics.userCount}</span>
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditGroup(group)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteGroup(group.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGroup(group.id)}
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Métriques résumées */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-background/60 backdrop-blur rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">SLA moyen</div>
                  <div className={cn("text-xl font-bold", getSlaColorClass(metrics.avgSla))}>
                    {Math.round(metrics.avgSla)}%
                  </div>
                  <Progress value={slaProgress} className="mt-2 h-1.5" />
                </div>

                <div className="bg-background/60 backdrop-blur rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Backlog moyen</div>
                  <div className={cn("text-xl font-bold", getBacklogColorClass(metrics.avgBacklog))}>
                    {Math.round(metrics.avgBacklog)}
                  </div>
                </div>

                <div className="bg-background/60 backdrop-blur rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Reçus
                  </div>
                  <div className="text-xl font-bold">
                    {metrics.totalReceived.toLocaleString()}
                  </div>
                </div>

                <div className="bg-background/60 backdrop-blur rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Send className="h-3 w-3" />
                    Envoyés
                  </div>
                  <div className="text-xl font-bold">
                    {metrics.totalSent.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                {metrics.users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                    Aucun membre dans ce groupe
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <h4 className="font-semibold text-sm">Membres du groupe ({metrics.users.length})</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            exportGroupMembersToCSV(group, users);
                            onExportSuccess?.(`${metrics.users.length} membres exportés`);
                          }}
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Exporter
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onSelectGroup(group.id)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Voir performances
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {metrics.users.map((user) => {
                        const sla = user.metrics.external.first_reply_within_sla || 0;
                        const backlog = user.metrics.external.backlog_total || 0;

                        return (
                          <div
                            key={user.userId}
                            className="flex items-center gap-3 p-3 rounded-lg bg-background/60 backdrop-blur border hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold text-sm">
                                {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{user.displayName}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
                              {user.jobTitle && (
                                <p className="text-xs text-muted-foreground mt-0.5">{user.jobTitle}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-center">
                                <p className="font-semibold tabular-nums">{user.metrics.external.received}</p>
                                <p className="text-xs text-muted-foreground">Reçus</p>
                              </div>
                              <div className="text-center">
                                <p className="font-semibold tabular-nums">{user.metrics.external.sent}</p>
                                <p className="text-xs text-muted-foreground">Envoyés</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="text-center px-2 py-1 rounded bg-background border">
                                <div className={cn("text-sm font-bold tabular-nums", getSlaColorClass(sla))}>
                                  {Math.round(sla)}%
                                </div>
                                <div className="text-xs text-muted-foreground">SLA</div>
                              </div>
                              <div className="text-center px-2 py-1 rounded bg-background border">
                                <div className={cn("text-sm font-bold tabular-nums", getBacklogColorClass(backlog))}>
                                  {backlog}
                                </div>
                                <div className="text-xs text-muted-foreground">Backlog</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}