import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MailUserSummary } from '@/lib/types/kpi';
import { cn } from '@/lib/utils';

interface UsersListProps {
  users: MailUserSummary[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function UsersList({ users, selectedUserId, onSelectUser }: UsersListProps) {
  const estimateScore = (user: MailUserSummary): number => {
    const sla = user.metrics.external.first_reply_within_sla || 0;
    const backlog = Math.min(user.metrics.external.backlog_total || 0, 80);
    return Math.round(0.6 * sla + 0.4 * (100 - backlog));
  };

  const getSLABadgeColor = (sla: number) => {
    if (sla >= 80) return 'text-green-600 bg-green-100';
    if (sla >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getBacklogBadgeColor = (backlog: number) => {
    if (backlog < 20) return 'text-green-600 bg-green-100';
    if (backlog < 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    if (score >= 60) return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
    return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
  };

  return (
    <div className="space-y-2">
      {users.map((user) => {
        const sla = Math.round(user.metrics.external.first_reply_within_sla || 0);
        const backlog = user.metrics.external.backlog_total || 0;
        const received = user.metrics.external.received || 0;
        const sent = user.metrics.external.sent || 0;
        const score = estimateScore(user);
        const isSelected = user.userId === selectedUserId;

        return (
          <Card
            key={user.userId}
            className={cn(
              "p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fade-in rounded-2xl border-2",
              isSelected && "ring-4 ring-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 border-primary"
            )}
            onClick={() => onSelectUser(user.userId)}
          >
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <Avatar className="h-16 w-16 shrink-0 ring-2 ring-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-xl">
                  {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Info principale */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <p className="font-bold text-lg text-foreground truncate">{user.displayName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.upn}</p>
                  {user.department && (
                    <Badge variant="secondary" className="mt-2">
                      {user.department}
                    </Badge>
                  )}
                </div>

                {/* Métriques en badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={`${getSLABadgeColor(sla)} px-3 py-1.5 text-sm font-semibold`}>
                    SLA {sla}%
                  </Badge>
                  <Badge variant="outline" className={`${getBacklogBadgeColor(backlog)} px-3 py-1.5 text-sm font-semibold`}>
                    {backlog} backlog
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                    ↓ {received}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                    ↑ {sent}
                  </Badge>
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0">
                <div className={cn("px-5 py-3 rounded-2xl font-bold text-2xl shadow-lg", getScoreBadgeColor(score))}>
                  {score}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
