import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Users, ChevronDown, ChevronUp, Trash2, Edit, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupsViewProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onSelectGroup: (groupId: string) => void;
  onEditGroup: (group: UserGroup) => void;
  onDeleteGroup: (groupId: string) => void;
}

export function GroupsView({ groups, users, onSelectGroup, onEditGroup, onDeleteGroup }: GroupsViewProps) {
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

  const getSlaColor = (sla: number) => {
    if (sla >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (sla >= 60) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getBacklogColor = (backlog: number) => {
    if (backlog < 20) return 'bg-green-100 text-green-700 border-green-200';
    if (backlog < 40) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
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

        return (
          <Card key={group.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {metrics.userCount} membre{metrics.userCount > 1 ? 's' : ''}
                  </Badge>
                  
                  <Badge variant="outline" className={getSlaColor(metrics.avgSla)}>
                    SLA: {Math.round(metrics.avgSla)}%
                  </Badge>
                  
                  <Badge variant="outline" className={getBacklogColor(metrics.avgBacklog)}>
                    Backlog: {Math.round(metrics.avgBacklog)}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditGroup(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteGroup(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroup(group.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-6">
                {metrics.users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun membre dans ce groupe
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b">
                      <h4 className="font-semibold text-sm">Membres du groupe</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectGroup(group.id)}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Voir les performances
                      </Button>
                    </div>

                    <div className="grid gap-3">
                      {metrics.users.map((user) => {
                        const sla = user.metrics.external.first_reply_within_sla || 0;
                        const backlog = user.metrics.external.backlog_total || 0;

                        return (
                          <div
                            key={user.userId}
                            className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-sm">
                                {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{user.displayName}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
                              {user.jobTitle && (
                                <Badge variant="outline" className="text-xs mt-1">{user.jobTitle}</Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-center">
                                <p className="font-semibold">{user.metrics.external.received}</p>
                                <p className="text-xs text-muted-foreground">Reçus</p>
                              </div>
                              <div className="text-center">
                                <p className="font-semibold">{user.metrics.external.sent}</p>
                                <p className="text-xs text-muted-foreground">Envoyés</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn('text-xs', getSlaColor(sla))}>
                                {Math.round(sla)}%
                              </Badge>
                              <Badge variant="outline" className={cn('text-xs', getBacklogColor(backlog))}>
                                {backlog}
                              </Badge>
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
