import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MailUserSummary } from '@/lib/types/kpi';
import { cn } from '@/lib/utils';
import { Mail, TrendingUp, TrendingDown, Inbox, Clock, Send } from 'lucide-react';

interface UsersListProps {
  users: MailUserSummary[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  viewMode?: 'grid' | 'list';
}

export function UsersList({ users, selectedUserId, onSelectUser, viewMode = 'grid' }: UsersListProps) {
  const estimateScore = (user: MailUserSummary): number => {
    const sla = user.metrics.external.first_reply_within_sla || 0;
    const backlog = Math.min(user.metrics.external.backlog_total || 0, 80);
    return Math.round(0.6 * sla + 0.4 * (100 - backlog));
  };

  const getSLAColor = (sla: number) => {
    if (sla >= 80) return { bg: 'bg-green-500', text: 'text-green-700' };
    if (sla >= 60) return { bg: 'bg-orange-500', text: 'text-orange-700' };
    return { bg: 'bg-red-500', text: 'text-red-700' };
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {users.map((user) => {
          const sla = Math.round(user.metrics.external.first_reply_within_sla || 0);
          const backlog = user.metrics.external.backlog_total || 0;
          const received = user.metrics.external.received || 0;
          const sent = user.metrics.external.sent || 0;
          const score = estimateScore(user);
          const isSelected = user.userId === selectedUserId;
          const slaColor = getSLAColor(sla);

          return (
            <Card
              key={user.userId}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onSelectUser(user.userId)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                      {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm truncate">{user.displayName}</p>
                {user.jobTitle && (
                  <Badge variant="outline" className="text-xs">{user.jobTitle}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
              {(user.agency || user.location) && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {user.agency && user.location ? `${user.agency} • ${user.location}` : user.agency || user.location}
                </p>
              )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={cn("w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center", getScoreGradient(score))}>
                        <span className="text-2xl font-bold text-white">{score}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Score</p>
                    </div>

                    <div className="space-y-2 w-32">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">SLA</span>
                        <span className={slaColor.text + " font-semibold"}>{sla}%</span>
                      </div>
                      <Progress value={sla} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Backlog</span>
                        <span className="font-semibold">{backlog}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-lg">{received}</p>
                        <p className="text-xs text-muted-foreground">Reçus</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">{sent}</p>
                        <p className="text-xs text-muted-foreground">Envoyés</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Vue grille
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {users.map((user) => {
        const sla = Math.round(user.metrics.external.first_reply_within_sla || 0);
        const backlog = user.metrics.external.backlog_total || 0;
        const received = user.metrics.external.received || 0;
        const sent = user.metrics.external.sent || 0;
        const score = estimateScore(user);
        const isSelected = user.userId === selectedUserId;
        const slaColor = getSLAColor(sla);
        const delayP50 = user.metrics.external.first_reply_p50_min || 0;

        return (
          <Card
            key={user.userId}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
              isSelected && "ring-2 ring-primary shadow-lg"
            )}
            onClick={() => onSelectUser(user.userId)}
          >
            <CardContent className="p-6">
              {/* Header avec avatar et score */}
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
                    {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", getScoreGradient(score))}>
                  <span className="text-xl font-bold text-white">{score}</span>
                </div>
              </div>

              {/* Info utilisateur */}
              <div className="mb-4">
                <h3 className="font-semibold text-sm truncate mb-1">{user.displayName}</h3>
                <p className="text-xs text-muted-foreground truncate mb-2">{user.upn}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {user.jobTitle && (
                    <Badge variant="outline" className="text-xs">{user.jobTitle}</Badge>
                  )}
                  {user.agency && (
                    <Badge variant="secondary" className="text-xs">{user.agency}</Badge>
                  )}
                </div>
              </div>

              {/* SLA Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Performance SLA</span>
                  <span className={cn("font-bold", slaColor.text)}>{sla}%</span>
                </div>
                <Progress value={sla} className="h-2" />
              </div>

              {/* Métriques en grille */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reçus</p>
                    <p className="text-sm font-bold">{received}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Send className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Envoyés</p>
                    <p className="text-sm font-bold">{sent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Délai</p>
                    <p className="text-sm font-bold">{Math.round(delayP50)}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Inbox className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Backlog</p>
                    <p className="text-sm font-bold">{backlog}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
