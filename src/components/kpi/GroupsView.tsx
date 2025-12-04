import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserGroup, MailUserSummary } from '@/lib/types/kpi';
import { Users, ChevronDown, Trash2, Edit, Mail, Send, Target, Inbox, Sparkles, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportGroupMembersToCSV } from '@/lib/export-utils';
import { Progress } from '@/components/ui/progress';
import { getGroupColor, getGroupIcon, groupColorPresets } from './GroupCustomization';
import { FileDown } from 'lucide-react';

interface GroupsViewProps {
  groups: UserGroup[];
  users: MailUserSummary[];
  onSelectGroup: (groupId: string) => void;
  onEditGroup: (group: UserGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onExportSuccess?: (message: string) => void;
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-indigo-500 to-blue-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
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

  if (groups.length === 0) {
    return (
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <p className="text-lg font-semibold">Aucun groupe créé</p>
          <p className="text-sm text-muted-foreground mt-1">Créez un groupe pour organiser vos utilisateurs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5 stagger-fade-in">
      {groups.map((group, idx) => {
        const metrics = getGroupMetrics(group);
        const isExpanded = expandedGroups.has(group.id);
        const colorPreset = getGroupColor(group.color);
        const GroupIcon = getGroupIcon(group.icon);
        const slaProgress = Math.round(metrics.avgSla);

        // Get color classes based on group color
        const colorClasses = {
          gradient: colorPreset.gradient,
          bg: `from-${colorPreset.value}-500/10 to-${colorPreset.value}-500/5`,
          border: `border-${colorPreset.value}-500/20`,
          text: `text-${colorPreset.value}-600 dark:text-${colorPreset.value}-400`,
        };

        return (
          <Card 
            key={group.id} 
            className={cn(
              "overflow-hidden transition-all duration-300 border-2 hover:shadow-xl",
              `bg-gradient-to-br ${colorClasses.bg} ${colorClasses.border}`
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                {/* Info groupe */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105",
                    colorPreset.gradient
                  )}>
                    <GroupIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className={cn("text-xl truncate", colorClasses.text)}>{group.name}</CardTitle>
                      <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-background/60 border">
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-semibold">{metrics.userCount}</span>
                      </Badge>
                    </div>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{group.description}</p>
                    )}
                    {/* Avatars preview */}
                    <div className="flex items-center gap-1 mt-3">
                      {metrics.users.slice(0, 6).map((user, i) => (
                        <Avatar 
                          key={user.userId} 
                          className={cn(
                            "h-8 w-8 ring-2 ring-background transition-transform hover:scale-110 hover:z-10",
                            i > 0 && "-ml-2"
                          )}
                        >
                          <AvatarFallback className={cn("bg-gradient-to-br text-white text-xs font-medium", getAvatarColor(user.displayName))}>
                            {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {metrics.users.length > 6 && (
                        <div className="h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-xs font-medium -ml-2 ring-2 ring-background border">
                          +{metrics.users.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditGroup(group)}
                    className="h-9 w-9 p-0 hover:bg-background/60"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteGroup(group.id)}
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGroup(group.id)}
                    className={cn("h-9 w-9 p-0 hover:bg-background/60 transition-transform", isExpanded && "rotate-180")}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Métriques résumées - Design moderne */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                <div className="bg-background/70 backdrop-blur rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Target className="h-3.5 w-3.5 text-emerald-500" />
                    SLA moyen
                  </div>
                  <div className={cn(
                    "text-2xl font-bold",
                    metrics.avgSla >= 80 ? 'text-emerald-500' : metrics.avgSla >= 60 ? 'text-amber-500' : 'text-red-500'
                  )}>
                    {Math.round(metrics.avgSla)}%
                  </div>
                  <Progress 
                    value={slaProgress} 
                    className={cn(
                      "mt-2 h-1.5",
                      metrics.avgSla >= 80 ? '[&>div]:bg-emerald-500' : metrics.avgSla >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                    )} 
                  />
                </div>

                <div className="bg-background/70 backdrop-blur rounded-xl p-4 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Inbox className="h-3.5 w-3.5 text-violet-500" />
                    Backlog moyen
                  </div>
                  <div className={cn(
                    "text-2xl font-bold",
                    metrics.avgBacklog < 20 ? 'text-emerald-500' : metrics.avgBacklog < 40 ? 'text-amber-500' : 'text-red-500'
                  )}>
                    {Math.round(metrics.avgBacklog)}
                  </div>
                </div>

                <div className="bg-background/70 backdrop-blur rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    Reçus
                  </div>
                  <div className="text-2xl font-bold text-blue-500">
                    {metrics.totalReceived.toLocaleString()}
                  </div>
                </div>

                <div className="bg-background/70 backdrop-blur rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Send className="h-3.5 w-3.5 text-amber-500" />
                    Envoyés
                  </div>
                  <div className="text-2xl font-bold text-amber-500">
                    {metrics.totalSent.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0 border-t border-border/50 tab-slide-in">
                {metrics.users.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground bg-background/30 rounded-xl mt-4">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    Aucun membre dans ce groupe
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Membres du groupe ({metrics.users.length})
                      </h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            exportGroupMembersToCSV(group, users);
                            onExportSuccess?.(`${metrics.users.length} membres exportés`);
                          }}
                          className="gap-2 bg-background/50"
                        >
                          <FileDown className="h-4 w-4" />
                          Exporter
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onSelectGroup(group.id)}
                          className={cn("gap-2 bg-gradient-to-r shadow-lg", colorPreset.gradient)}
                        >
                          <BarChart3 className="h-4 w-4" />
                          Voir performances
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {metrics.users.map((user) => {
                        const sla = user.metrics.external.first_reply_within_sla || 0;
                        const backlog = user.metrics.external.backlog_total || 0;
                        const avatarColor = getAvatarColor(user.displayName);

                        return (
                          <div
                            key={user.userId}
                            className="flex items-center gap-4 p-4 rounded-xl bg-background/60 backdrop-blur border border-border/50 hover:border-primary/30 hover:bg-background/80 transition-all duration-200 group"
                          >
                            <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                              <AvatarFallback className={cn("bg-gradient-to-br text-white font-semibold", avatarColor)}>
                                {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.displayName}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.upn}</p>
                              {user.jobTitle && (
                                <Badge variant="outline" className="mt-1 text-xs bg-background/50">
                                  {user.jobTitle}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <p className="font-bold tabular-nums text-blue-500">{user.metrics.external.received}</p>
                                <p className="text-xs text-muted-foreground">Reçus</p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold tabular-nums text-amber-500">{user.metrics.external.sent}</p>
                                <p className="text-xs text-muted-foreground">Envoyés</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "text-center px-3 py-2 rounded-xl border",
                                sla >= 80 ? "bg-emerald-500/10 border-emerald-500/30" :
                                sla >= 60 ? "bg-amber-500/10 border-amber-500/30" :
                                "bg-red-500/10 border-red-500/30"
                              )}>
                                <div className={cn(
                                  "text-sm font-bold tabular-nums",
                                  sla >= 80 ? "text-emerald-500" : sla >= 60 ? "text-amber-500" : "text-red-500"
                                )}>
                                  {Math.round(sla)}%
                                </div>
                                <div className="text-xs text-muted-foreground">SLA</div>
                              </div>
                              <div className={cn(
                                "text-center px-3 py-2 rounded-xl border",
                                backlog < 20 ? "bg-emerald-500/10 border-emerald-500/30" :
                                backlog < 40 ? "bg-amber-500/10 border-amber-500/30" :
                                "bg-red-500/10 border-red-500/30"
                              )}>
                                <div className={cn(
                                  "text-sm font-bold tabular-nums",
                                  backlog < 20 ? "text-emerald-500" : backlog < 40 ? "text-amber-500" : "text-red-500"
                                )}>
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
