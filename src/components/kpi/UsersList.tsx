import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MailUserSummary } from '@/lib/types/kpi';
import { cn } from '@/lib/utils';
import { Mail, TrendingUp, TrendingDown, Inbox, Clock, Send, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';

type SortOption = 'name-asc' | 'name-desc' | 'score-desc' | 'score-asc' | 'sla-desc' | 'sla-asc' | 'backlog-asc' | 'backlog-desc';

interface UsersListProps {
  users: MailUserSummary[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  viewMode?: 'grid' | 'list';
}

export function UsersList({ users, selectedUserId, onSelectUser, viewMode = 'grid' }: UsersListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');

  const estimateScore = (user: MailUserSummary): number => {
    const sla = user.metrics.external.first_reply_within_sla || 0;
    const backlog = Math.min(user.metrics.external.backlog_total || 0, 80);
    return Math.round(0.6 * sla + 0.4 * (100 - backlog));
  };

  // Filtrer et trier les utilisateurs
  const sortedAndFilteredUsers = useMemo(() => {
    // Filtrer
    let filtered = users;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = users.filter(u =>
        u.displayName.toLowerCase().includes(query) ||
        u.upn.toLowerCase().includes(query) ||
        u.agency?.toLowerCase().includes(query) ||
        u.department?.toLowerCase().includes(query)
      );
    }

    // Trier
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.displayName.localeCompare(b.displayName);
        case 'name-desc':
          return b.displayName.localeCompare(a.displayName);
        case 'score-desc':
          return estimateScore(b) - estimateScore(a);
        case 'score-asc':
          return estimateScore(a) - estimateScore(b);
        case 'sla-desc':
          return (b.metrics.external.first_reply_within_sla || 0) - (a.metrics.external.first_reply_within_sla || 0);
        case 'sla-asc':
          return (a.metrics.external.first_reply_within_sla || 0) - (b.metrics.external.first_reply_within_sla || 0);
        case 'backlog-asc':
          return (a.metrics.external.backlog_total || 0) - (b.metrics.external.backlog_total || 0);
        case 'backlog-desc':
          return (b.metrics.external.backlog_total || 0) - (a.metrics.external.backlog_total || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [users, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredUsers.slice(start, start + itemsPerPage);
  }, [sortedAndFilteredUsers, currentPage, itemsPerPage]);

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
      <div className="space-y-4">
        {/* Barre de recherche, tri et pagination */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, agence..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score-desc">Score (décroissant)</SelectItem>
              <SelectItem value="score-asc">Score (croissant)</SelectItem>
              <SelectItem value="sla-desc">SLA (décroissant)</SelectItem>
              <SelectItem value="sla-asc">SLA (croissant)</SelectItem>
              <SelectItem value="backlog-asc">Backlog (croissant)</SelectItem>
              <SelectItem value="backlog-desc">Backlog (décroissant)</SelectItem>
              <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Afficher</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {paginatedUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {paginatedUsers.map((user) => {
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, sortedAndFilteredUsers.length)} sur {sortedAndFilteredUsers.length} utilisateurs
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
            <span className="text-sm">
              Page {currentPage} sur {totalPages}
            </span>
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
      </div>
    );
  }

  // Vue grille
  return (
    <div className="space-y-4">
      {/* Barre de recherche, tri et pagination */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email, agence..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
          <SelectTrigger className="w-48">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score-desc">Score (décroissant)</SelectItem>
            <SelectItem value="score-asc">Score (croissant)</SelectItem>
            <SelectItem value="sla-desc">SLA (décroissant)</SelectItem>
            <SelectItem value="sla-asc">SLA (croissant)</SelectItem>
            <SelectItem value="backlog-asc">Backlog (croissant)</SelectItem>
            <SelectItem value="backlog-desc">Backlog (décroissant)</SelectItem>
            <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Afficher</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {paginatedUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun utilisateur trouvé
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedUsers.map((user) => {
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

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, sortedAndFilteredUsers.length)} sur {sortedAndFilteredUsers.length} utilisateurs
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
          <span className="text-sm">
            Page {currentPage} sur {totalPages}
          </span>
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
    </div>
  );
}
