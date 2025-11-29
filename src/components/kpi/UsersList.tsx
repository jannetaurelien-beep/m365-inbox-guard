import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MailUserSummary } from '@/lib/types/kpi';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

  const getSLAColor = (sla: number) => {
    if (sla >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (sla >= 60) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getBacklogColor = (backlog: number) => {
    if (backlog < 20) return 'text-green-700 bg-green-50 border-green-200';
    if (backlog < 40) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100';
    if (score >= 60) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const getPerformanceTrend = (score: number) => {
    if (score >= 80) return { icon: TrendingUp, color: 'text-green-600' };
    if (score >= 60) return { icon: Minus, color: 'text-orange-600' };
    return { icon: TrendingDown, color: 'text-red-600' };
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
        const trend = getPerformanceTrend(score);
        const TrendIcon = trend.icon;

        return (
          <Card
            key={user.userId}
            className={cn(
              "p-4 cursor-pointer hover:shadow-md transition-all border",
              isSelected && "ring-2 ring-primary bg-primary/5 border-primary"
            )}
            onClick={() => onSelectUser(user.userId)}
          >
            <div className="flex items-center gap-4">
              {/* Avatar et info */}
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-muted text-foreground font-medium">
                  {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground truncate">{user.displayName}</p>
                  {user.department && (
                    <Badge variant="secondary" className="text-xs">{user.department}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
                
                {/* Métriques compactes */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>↓ {received}</span>
                  <span>•</span>
                  <span>↑ {sent}</span>
                </div>
              </div>

              {/* Badges KPI */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={`${getSLAColor(sla)} text-xs font-semibold`}>
                  {sla}%
                </Badge>
                <Badge variant="outline" className={`${getBacklogColor(backlog)} text-xs font-semibold`}>
                  {backlog}
                </Badge>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                  <div className={cn("px-2 py-1 rounded-md font-bold text-sm", getScoreColor(score))}>
                    {score}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
