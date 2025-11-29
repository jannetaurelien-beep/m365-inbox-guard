import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, X, Settings, Download, Filter as FilterIcon, Grid3x3, List, Building2, Users as UsersIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIFilters } from '@/components/kpi/KPIFilters';
import { TenantOverview } from '@/components/kpi/TenantOverview';
import { UsersList } from '@/components/kpi/UsersList';
import { UserDetail } from '@/components/kpi/UserDetail';
import { AgencyComparison } from '@/components/kpi/AgencyComparison';
import { AgencyDetail } from '@/components/kpi/AgencyDetail';
import { GroupManagement } from '@/components/kpi/GroupManagement';
import { GroupPerformanceView } from '@/components/kpi/GroupPerformanceView';
import { fetchTenantOverview, fetchUsersList, fetchUserDetail } from '@/lib/api/kpi-api';
import { TenantOverviewResponse, UsersListResponse, UserDetailResponse, AccountFilterType, FocusFilterType, GroupByType, UserGroup, AgencyMetrics, GroupPerformance, MailUserMetricsSub } from '@/lib/types/kpi';
import { useToast } from '@/hooks/use-toast';

export default function PerformanceKPI() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('overview');

  // État des filtres
  const [periodDays, setPeriodDays] = useState(30);
  const [accountFilter, setAccountFilter] = useState<AccountFilterType>('all');
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [agencyFilter, setAgencyFilter] = useState<string | null>(null);
  const [jobTitleFilter, setJobTitleFilter] = useState<string | null>(null);
  const [focusFilter, setFocusFilter] = useState<FocusFilterType>('all');
  const [groupBy, setGroupBy] = useState<GroupByType>('day');
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);

  // Groupes d'utilisateurs
  const [userGroups, setUserGroups] = useState<UserGroup[]>([
    {
      id: 'group-1',
      name: 'Commerciaux TLS',
      description: 'Équipe commerciale TLS',
      userIds: ['user-1', 'user-2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'group-2',
      name: 'Support Technique',
      description: 'Équipe support technique',
      userIds: ['user-3', 'user-5'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // Données
  const [tenantData, setTenantData] = useState<TenantOverviewResponse | null>(null);
  const [usersData, setUsersData] = useState<UsersListResponse | null>(null);
  const [userDetailData, setUserDetailData] = useState<UserDetailResponse | null>(null);

  // Loading states
  const [loadingTenant, setLoadingTenant] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  // Errors
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userDetailError, setUserDetailError] = useState<string | null>(null);

  // User sélectionné
  const selectedUserId = searchParams.get('userId');

  // Conversion accountFilter -> accountType pour l'API
  const getAccountType = (): string | null => {
    if (accountFilter === 'user') return 'Utilisateur';
    if (accountFilter === 'shared') return 'Boîte partagée';
    return null;
  };

  // Fetch tenant overview
  const loadTenantOverview = async () => {
    setLoadingTenant(true);
    setTenantError(null);
    try {
      const data = await fetchTenantOverview(periodDays, undefined, getAccountType(), domainFilter);
      setTenantData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setTenantError(message);
      toast({
        title: 'Erreur',
        description: `Impossible de charger les données: ${message}`,
        variant: 'destructive',
      });
    } finally {
      setLoadingTenant(false);
    }
  };

  // Fetch users list
  const loadUsersList = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const data = await fetchUsersList(periodDays, undefined, getAccountType(), domainFilter);
      setUsersData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setUsersError(message);
      toast({
        title: 'Erreur',
        description: `Impossible de charger les utilisateurs: ${message}`,
        variant: 'destructive',
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch user detail
  const loadUserDetail = async (userId: string) => {
    setLoadingUserDetail(true);
    setUserDetailError(null);
    try {
      const data = await fetchUserDetail(userId, periodDays, groupBy);
      setUserDetailData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setUserDetailError(message);
      toast({
        title: 'Erreur',
        description: `Impossible de charger les détails: ${message}`,
        variant: 'destructive',
      });
    } finally {
      setLoadingUserDetail(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTenantOverview();
    loadUsersList();
  }, [periodDays, accountFilter, domainFilter]);

  // Load user detail si userId présent
  useEffect(() => {
    if (selectedUserId) {
      loadUserDetail(selectedUserId);
    } else {
      setUserDetailData(null);
    }
  }, [selectedUserId, periodDays, groupBy]);

  // Extraire les départements et agences uniques
  const departments = useMemo(() => {
    if (!usersData) return [];
    const depts = new Set<string>();
    usersData.users.forEach((u) => {
      if (u.department) depts.add(u.department);
    });
    return Array.from(depts).sort();
  }, [usersData]);

  const agencies = useMemo(() => {
    if (!usersData) return [];
    const agcs = new Set<string>();
    usersData.users.forEach((u) => {
      if (u.agency) agcs.add(u.agency);
    });
    return Array.from(agcs).sort();
  }, [usersData]);

  const jobTitles = useMemo(() => {
    if (!usersData) return [];
    const jobs = new Set<string>();
    usersData.users.forEach((u) => {
      if (u.jobTitle) jobs.add(u.jobTitle);
    });
    return Array.from(jobs).sort();
  }, [usersData]);

  // Calculer les métriques par agence
  const agencyMetrics = useMemo((): AgencyMetrics[] => {
    if (!usersData) return [];

    const metricsMap = new Map<string, {
      users: typeof usersData.users;
      metrics: { total: MailUserMetricsSub; external: MailUserMetricsSub; internal: MailUserMetricsSub };
    }>();

    usersData.users.forEach((user) => {
      const agency = user.agency || 'Non assigné';
      if (!metricsMap.has(agency)) {
        metricsMap.set(agency, {
          users: [],
          metrics: {
            total: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 },
            external: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 },
            internal: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 },
          },
        });
      }

      const agencyData = metricsMap.get(agency)!;
      agencyData.users.push(user);

      // Agréger les métriques
      ['total', 'external', 'internal'].forEach((type) => {
        const metricType = type as 'total' | 'external' | 'internal';
        const userMetrics = user.metrics[metricType];
        const agencyMetrics = agencyData.metrics[metricType];

        agencyMetrics.received += userMetrics.received;
        agencyMetrics.sent += userMetrics.sent;
        agencyMetrics.backlog_total += userMetrics.backlog_total || 0;
        agencyMetrics.backlog_unread += userMetrics.backlog_unread || 0;
        agencyMetrics.backlog_flagged += userMetrics.backlog_flagged || 0;
      });
    });

    // Calculer les moyennes et scores
    return Array.from(metricsMap.entries()).map(([agency, data]) => {
      const userCount = data.users.length;
      const avgSla = data.users.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / userCount;
      const avgBacklog = data.metrics.external.backlog_total / userCount;
      
      // Score basé sur SLA et backlog
      const slaScore = avgSla;
      const backlogScore = Math.max(0, 100 - (avgBacklog / 50) * 100);
      const avgScore = (slaScore * 0.6 + backlogScore * 0.4);

      // Calculer la moyenne pour first_reply_within_sla
      data.metrics.external.first_reply_within_sla = avgSla;

      return {
        agency,
        userCount,
        metrics: data.metrics,
        avgScore,
      };
    });
  }, [usersData]);

  // Calculer la performance d'un groupe
  const getGroupPerformance = (groupId: string): GroupPerformance | null => {
    const group = userGroups.find(g => g.id === groupId);
    if (!group || !usersData) return null;

    const groupUsers = usersData.users.filter(u => group.userIds.includes(u.userId));
    if (groupUsers.length === 0) return null;

    const metrics = {
      total: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 },
      external: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 },
      internal: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 },
    };

    groupUsers.forEach((user) => {
      ['total', 'external', 'internal'].forEach((type) => {
        const metricType = type as 'total' | 'external' | 'internal';
        const userMetrics = user.metrics[metricType];
        const groupMetrics = metrics[metricType];

        groupMetrics.received += userMetrics.received;
        groupMetrics.sent += userMetrics.sent;
        groupMetrics.backlog_total += userMetrics.backlog_total || 0;
        groupMetrics.backlog_unread += userMetrics.backlog_unread || 0;
        groupMetrics.backlog_flagged += userMetrics.backlog_flagged || 0;
      });
    });

    const avgSla = groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / groupUsers.length;
    metrics.external.first_reply_within_sla = avgSla;

    const avgBacklog = metrics.external.backlog_total / groupUsers.length;
    const slaScore = avgSla;
    const backlogScore = Math.max(0, 100 - (avgBacklog / 50) * 100);
    const avgScore = (slaScore * 0.6 + backlogScore * 0.4);

    return {
      group,
      metrics,
      users: groupUsers,
      avgScore,
    };
  };

  // Filtrer les users localement
  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    
    let filtered = [...usersData.users];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.displayName.toLowerCase().includes(searchLower) ||
          u.upn.toLowerCase().includes(searchLower)
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter((u) => u.department === departmentFilter);
    }

    if (agencyFilter) {
      filtered = filtered.filter((u) => u.agency === agencyFilter);
    }

    if (jobTitleFilter) {
      filtered = filtered.filter((u) => u.jobTitle === jobTitleFilter);
    }

    if (groupFilter) {
      const group = userGroups.find(g => g.id === groupFilter);
      if (group) {
        filtered = filtered.filter((u) => group.userIds.includes(u.userId));
      }
    }

    if (focusFilter !== 'all') {
      filtered = filtered.filter((u) => {
        const backlog = u.metrics.external.backlog_total || 0;
        const sla = u.metrics.external.first_reply_within_sla || 0;

        if (focusFilter === 'high-backlog') return backlog >= 30;
        if (focusFilter === 'low-sla') return sla <= 70;
        if (focusFilter === 'anomalies') return backlog >= 50 || sla <= 60;
        return true;
      });
    }

    return filtered;
  }, [usersData, search, departmentFilter, agencyFilter, jobTitleFilter, groupFilter, focusFilter]);

  // Handlers pour les groupes
  const handleCreateGroup = (name: string, description: string, userIds: string[]) => {
    const newGroup: UserGroup = {
      id: `group-${Date.now()}`,
      name,
      description,
      userIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserGroups([...userGroups, newGroup]);
    toast({ title: 'Groupe créé', description: `Le groupe "${name}" a été créé avec succès.` });
  };

  const handleUpdateGroup = (groupId: string, userIds: string[]) => {
    setUserGroups(userGroups.map(g => 
      g.id === groupId ? { ...g, userIds, updatedAt: new Date().toISOString() } : g
    ));
    toast({ title: 'Groupe mis à jour', description: 'Les membres du groupe ont été mis à jour.' });
  };

  const handleDeleteGroup = (groupId: string) => {
    setUserGroups(userGroups.filter(g => g.id !== groupId));
    if (groupFilter === groupId) setGroupFilter(null);
    toast({ title: 'Groupe supprimé', description: 'Le groupe a été supprimé.' });
  };

  // Handlers
  const handleSelectUser = (userId: string) => {
    setSearchParams({ userId });
  };

  const handleClearUser = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header global fixe */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold tracking-tight">Performance Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Données en temps réel
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <KPIFilters
                      periodDays={periodDays}
                      onPeriodChange={setPeriodDays}
                      accountFilter={accountFilter}
                      onAccountFilterChange={setAccountFilter}
                      domains={tenantData?.tenant.domains || []}
                      domainFilter={domainFilter}
                      onDomainFilterChange={setDomainFilter}
                      search={search}
                      onSearchChange={setSearch}
                      departments={departments}
                      departmentFilter={departmentFilter}
                      onDepartmentFilterChange={setDepartmentFilter}
                      agencies={agencies}
                      agencyFilter={agencyFilter}
                      onAgencyFilterChange={setAgencyFilter}
                      jobTitles={jobTitles}
                      jobTitleFilter={jobTitleFilter}
                      onJobTitleFilterChange={setJobTitleFilter}
                      focusFilter={focusFilter}
                      onFocusFilterChange={setFocusFilter}
                      groups={userGroups}
                      groupFilter={groupFilter}
                      onGroupFilterChange={setGroupFilter}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadTenantOverview}
                disabled={loadingTenant}
              >
                <RefreshCw className={`h-4 w-4 ${loadingTenant ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="agencies">
              <Building2 className="h-4 w-4 mr-2" />
              Comparaison agences
            </TabsTrigger>
            <TabsTrigger value="groups">
              <UsersIcon className="h-4 w-4 mr-2" />
              Groupes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Vue d'ensemble */}
            {loadingTenant && (
              <div className="grid gap-6">
                <Skeleton className="h-48 w-full" />
              </div>
            )}
            {tenantError && (
              <Alert variant="destructive">
                <AlertDescription>{tenantError}</AlertDescription>
              </Alert>
            )}
            {!loadingTenant && !tenantError && tenantData && (
              <TenantOverview data={tenantData} />
            )}

            {/* Liste des boîtes mail */}
            <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Boîtes mail</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredUsers.length} boîte{filteredUsers.length > 1 ? 's' : ''} • {periodDays} derniers jours
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsersList}
              disabled={loadingUsers}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {loadingUsers && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          )}

          {usersError && (
            <Alert variant="destructive">
              <AlertDescription>{usersError}</AlertDescription>
            </Alert>
          )}

          {!loadingUsers && !usersError && filteredUsers.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FilterIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">Aucune boîte mail trouvée</p>
                <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos filtres</p>
              </CardContent>
            </Card>
          )}

            {!loadingUsers && !usersError && filteredUsers.length > 0 && (
              <UsersList
                users={filteredUsers}
                selectedUserId={selectedUserId}
                onSelectUser={handleSelectUser}
                viewMode={viewMode}
              />
            )}
            </div>
          </TabsContent>

          <TabsContent value="agencies" className="space-y-6 mt-6">
            {loadingUsers ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : selectedAgency ? (
              <AgencyDetail 
                agency={selectedAgency}
                users={usersData?.users.filter(u => u.agency === selectedAgency) || []}
                onBack={() => setSelectedAgency(null)}
              />
            ) : (
              <AgencyComparison 
                agencies={agencyMetrics}
                onSelectAgency={setSelectedAgency}
              />
            )}
          </TabsContent>

          <TabsContent value="groups" className="space-y-6 mt-6">
            {usersData && (
              <>
                <GroupManagement
                  groups={userGroups}
                  users={usersData.users}
                  onCreateGroup={handleCreateGroup}
                  onUpdateGroup={handleUpdateGroup}
                  onDeleteGroup={handleDeleteGroup}
                />

                {groupFilter && getGroupPerformance(groupFilter) && (
                  <div className="mt-6">
                    <GroupPerformanceView groupPerformance={getGroupPerformance(groupFilter)!} />
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de détail utilisateur */}
      {selectedUserId && (
        <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && handleClearUser()}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Analyse détaillée</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {loadingUserDetail && (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              )}

              {userDetailError && (
                <Alert variant="destructive">
                  <AlertDescription>{userDetailError}</AlertDescription>
                </Alert>
              )}

              {!loadingUserDetail && !userDetailError && userDetailData && (
                <UserDetail
                  data={userDetailData}
                  groupBy={groupBy}
                  onGroupByChange={setGroupBy}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
