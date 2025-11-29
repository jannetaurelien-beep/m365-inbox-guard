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
              "p-4 cursor-pointer hover:shadow-card-hover transition-smooth animate-fade-in",
              isSelected && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => onSelectUser(user.userId)}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                  {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Info principale */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <p className="font-semibold text-foreground truncate">{user.displayName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.upn}</p>
                  {user.department && (
                    <p className="text-xs text-muted-foreground mt-1">{user.department}</p>
                  )}
                </div>

                {/* Métriques en badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getSLABadgeColor(sla)}>
                    SLA {sla}%
                  </Badge>
                  <Badge variant="outline" className={getBacklogBadgeColor(backlog)}>
                    {backlog} backlog
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {received} reçus
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {sent} envoyés
                  </Badge>
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0">
                <div className={cn("px-3 py-1.5 rounded-lg font-bold text-sm", getScoreBadgeColor(score))}>
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
