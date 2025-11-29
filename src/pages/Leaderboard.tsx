import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, TrendingUp, Award, Zap, Star, Crown, Medal, Target, Calendar } from 'lucide-react';
import { fetchUsersList } from '@/lib/api/kpi-api';
import { calculateScoresAndRanking, getAgencyRanking, getBadgeInfo, REWARD_TIERS, UserScore } from '@/lib/scoring-system';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<UserScore[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [periodDays, setPeriodDays] = useState(30);

  useEffect(() => {
    loadScores();
  }, [periodDays]);

  const loadScores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsersList(periodDays);
      const calculatedScores = calculateScoresAndRanking(data.users);
      setScores(calculatedScores);
    } catch (err) {
      setError('Erreur lors du chargement des scores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agencies = useMemo(() => {
    const agencySet = new Set(scores.map(s => s.agency).filter(Boolean));
    return Array.from(agencySet).sort();
  }, [scores]);

  const agencyRankings = useMemo(() => getAgencyRanking(scores), [scores]);

  const filteredScores = useMemo(() => {
    if (selectedAgency === 'all') return scores;
    return scores.filter(s => s.agency === selectedAgency);
  }, [scores, selectedAgency]);

  const topThree = filteredScores.slice(0, 3);
  const restOfLeaderboard = filteredScores.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header avec titre et filtres */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Classement & Compétition</h1>
                <p className="text-muted-foreground">Système de points et récompenses</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={periodDays.toString()} onValueChange={(val) => setPeriodDays(Number(val))}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 derniers jours</SelectItem>
                <SelectItem value="30">30 derniers jours</SelectItem>
                <SelectItem value="90">90 derniers jours</SelectItem>
                <SelectItem value="180">6 mois</SelectItem>
                <SelectItem value="365">Année complète</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Podium des 3 premiers */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card/95 to-muted/30">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  Top 3 du mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {/* 2ème place */}
                  {topThree[1] && (
                    <div className="flex flex-col items-center pt-12">
                      <div className="relative">
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold shadow-lg">
                          2
                        </div>
                        <Avatar className="h-24 w-24 border-4 border-gray-300 shadow-xl">
                          <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 text-2xl font-bold">
                            {topThree[1].displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="font-bold text-lg mt-4 text-center">{topThree[1].displayName}</h3>
                      <p className="text-sm text-muted-foreground">{topThree[1].agency}</p>
                      <div className="mt-4 text-center">
                        <div className="text-3xl font-bold text-gray-500">{topThree[1].totalPoints}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      <Badge className="mt-3 bg-gradient-to-r from-gray-300 to-gray-400 text-white border-0">
                        🥈 Argent
                      </Badge>
                    </div>
                  )}

                  {/* 1ère place - Champion */}
                  {topThree[0] && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <Crown className="h-10 w-10 text-yellow-500 drop-shadow-lg" />
                        </div>
                        <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-xl text-lg">
                          1
                        </div>
                        <Avatar className="h-32 w-32 border-4 border-yellow-400 shadow-2xl">
                          <AvatarFallback className="bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-800 text-3xl font-bold">
                            {topThree[0].displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="font-bold text-xl mt-6 text-center">{topThree[0].displayName}</h3>
                      <p className="text-sm text-muted-foreground">{topThree[0].agency}</p>
                      <div className="mt-4 text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                          {topThree[0].totalPoints}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      <Badge className="mt-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 text-sm px-4">
                        🏆 Champion
                      </Badge>
                    </div>
                  )}

                  {/* 3ème place */}
                  {topThree[2] && (
                    <div className="flex flex-col items-center pt-12">
                      <div className="relative">
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                          3
                        </div>
                        <Avatar className="h-24 w-24 border-4 border-orange-400 shadow-xl">
                          <AvatarFallback className="bg-gradient-to-br from-orange-200 to-orange-300 text-orange-700 text-2xl font-bold">
                            {topThree[2].displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="font-bold text-lg mt-4 text-center">{topThree[2].displayName}</h3>
                      <p className="text-sm text-muted-foreground">{topThree[2].agency}</p>
                      <div className="mt-4 text-center">
                        <div className="text-3xl font-bold text-orange-600">{topThree[2].totalPoints}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      <Badge className="mt-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white border-0">
                        🥉 Bronze
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="global" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="global">
                  <Trophy className="h-4 w-4 mr-2" />
                  Classement global
                </TabsTrigger>
                <TabsTrigger value="agencies">
                  <Target className="h-4 w-4 mr-2" />
                  Par agence
                </TabsTrigger>
                <TabsTrigger value="rewards">
                  <Award className="h-4 w-4 mr-2" />
                  Récompenses
                </TabsTrigger>
              </TabsList>

              {/* Classement global */}
              <TabsContent value="global" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Classement complet</CardTitle>
                      <Select value={selectedAgency} onValueChange={setSelectedAgency}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Toutes les agences" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les agences</SelectItem>
                          {agencies.map(agency => (
                            <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {restOfLeaderboard.map((score) => {
                        const badgeInfo = getBadgeInfo(score.badge);
                        
                        return (
                          <div key={score.userId} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="w-12 text-center">
                              <div className="text-2xl font-bold text-muted-foreground">
                                #{score.rank}
                              </div>
                            </div>

                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                                {score.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold truncate">{score.displayName}</p>
                                {badgeInfo && (
                                  <Badge variant="outline" className={`${badgeInfo.textColor} border-0 text-xs`}>
                                    {badgeInfo.label}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{score.agency} • {score.jobTitle}</p>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <div className="font-semibold text-blue-600">{score.slaPoints}</div>
                                <div className="text-xs text-muted-foreground">SLA</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-green-600">{score.backlogPoints}</div>
                                <div className="text-xs text-muted-foreground">Backlog</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-orange-600">{score.reactivityPoints}</div>
                                <div className="text-xs text-muted-foreground">Réactivité</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-purple-600">{score.volumePoints}</div>
                                <div className="text-xs text-muted-foreground">Volume</div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold">{score.totalPoints}</div>
                              <div className="text-xs text-muted-foreground">points</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Par agence */}
              <TabsContent value="agencies" className="space-y-4">
                {Array.from(agencyRankings.entries()).map(([agency, agencyScores]) => (
                  <Card key={agency}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {agency}
                        <Badge variant="secondary">{agencyScores.length} membres</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {agencyScores.slice(0, 5).map((score) => (
                          <div key={score.userId} className="flex items-center gap-4 p-3 rounded-lg border">
                            <div className="w-8 text-center font-bold text-lg text-muted-foreground">
                              #{score.rank}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-sm">
                                {score.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{score.displayName}</p>
                              <p className="text-xs text-muted-foreground">{score.jobTitle}</p>
                            </div>
                            <div className="text-xl font-bold">{score.totalPoints}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Récompenses */}
              <TabsContent value="rewards">
                <div className="grid gap-6 md:grid-cols-2">
                  {REWARD_TIERS.map((tier, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          {tier.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{tier.minPoints} points minimum</span>
                          </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Récompense :</p>
                          <p className="text-sm text-muted-foreground">{tier.reward}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {scores.filter(s => s.totalPoints >= tier.minPoints).length} personne(s) éligible(s)
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Système de points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold">SLA</h4>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mb-1">40 pts max</p>
                        <p className="text-xs text-muted-foreground">Performance du SLA</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold">Backlog</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-1">25 pts max</p>
                        <p className="text-xs text-muted-foreground">Gestion du backlog</p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-orange-600" />
                          <h4 className="font-semibold">Réactivité</h4>
                        </div>
                        <p className="text-2xl font-bold text-orange-600 mb-1">20 pts max</p>
                        <p className="text-xs text-muted-foreground">Temps de réponse</p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <h4 className="font-semibold">Volume</h4>
                        </div>
                        <p className="text-2xl font-bold text-purple-600 mb-1">15 pts max</p>
                        <p className="text-xs text-muted-foreground">Volume traité</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
