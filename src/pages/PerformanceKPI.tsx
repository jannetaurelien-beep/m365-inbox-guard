import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, X, TrendingUp, Mail, BarChart3, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIFilters } from '@/components/kpi/KPIFilters';
import { TenantOverview } from '@/components/kpi/TenantOverview';
import { UsersList } from '@/components/kpi/UsersList';
import { UserDetail } from '@/components/kpi/UserDetail';
import { fetchTenantOverview, fetchUsersList, fetchUserDetail } from '@/lib/api/kpi-api';
import { TenantOverviewResponse, UsersListResponse, UserDetailResponse, AccountFilterType, FocusFilterType, GroupByType } from '@/lib/types/kpi';
import { useToast } from '@/hooks/use-toast';

export default function PerformanceKPI() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // État des filtres
  const [periodDays, setPeriodDays] = useState(30);
  const [accountFilter, setAccountFilter] = useState<AccountFilterType>('all');
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [focusFilter, setFocusFilter] = useState<FocusFilterType>('all');
  const [groupBy, setGroupBy] = useState<GroupByType>('day');

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
        description: `Impossible de charger les données tenant: ${message}`,
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
        description: `Impossible de charger la liste des utilisateurs: ${message}`,
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
        description: `Impossible de charger les détails utilisateur: ${message}`,
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

  // Extraire les départements uniques pour le filtre
  const departments = useMemo(() => {
    if (!usersData) return [];
    const depts = new Set<string>();
    usersData.users.forEach((u) => {
      if (u.department) depts.add(u.department);
    });
    return Array.from(depts).sort();
  }, [usersData]);

  // Filtrer les users localement
  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    
    let filtered = [...usersData.users];

    // Recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.displayName.toLowerCase().includes(searchLower) ||
          u.upn.toLowerCase().includes(searchLower)
      );
    }

    // Département
    if (departmentFilter) {
      filtered = filtered.filter((u) => u.department === departmentFilter);
    }

    // Focus
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
  }, [usersData, search, departmentFilter, focusFilter]);

  // Handlers
  const handleSelectUser = (userId: string) => {
    setSearchParams({ userId });
  };

  const handleClearUser = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[2400px] mx-auto">
        {/* Header minimaliste */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Performance KPI</h1>
                  <p className="text-sm text-muted-foreground">Analyse des boîtes mail Microsoft 365</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={loadTenantOverview} 
                  disabled={loadingTenant}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingTenant ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal avec tabs */}
        <div className="p-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="overview" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2">
                <Users className="h-4 w-4" />
                Analyse détaillée
              </TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble globale */}
            <TabsContent value="overview" className="space-y-6">
              {loadingTenant && (
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full" />
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
            </TabsContent>

            {/* Analyse détaillée avec filtres */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-12 gap-6">
                {/* Filtres sidebar */}
                <div className="col-span-3 space-y-6">
                  <Card>
                    <CardContent className="pt-6">
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
                        focusFilter={focusFilter}
                        onFocusFilterChange={setFocusFilter}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Liste des utilisateurs */}
                <div className={selectedUserId ? 'col-span-5' : 'col-span-9'}>
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">Boîtes mail</h2>
                          <p className="text-sm text-muted-foreground">{filteredUsers.length} résultats</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={loadUsersList} 
                          disabled={loadingUsers}
                        >
                          <RefreshCw className={`h-4 w-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>

                      {loadingUsers && (
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                          ))}
                        </div>
                      )}

                      {usersError && (
                        <Alert variant="destructive">
                          <AlertDescription>{usersError}</AlertDescription>
                        </Alert>
                      )}

                      {!loadingUsers && !usersError && filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                          <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                          <p className="text-muted-foreground">Aucune boîte mail trouvée</p>
                        </div>
                      )}

                      {!loadingUsers && !usersError && filteredUsers.length > 0 && (
                        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                          <UsersList
                            users={filteredUsers}
                            selectedUserId={selectedUserId}
                            onSelectUser={handleSelectUser}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Détail utilisateur */}
                {selectedUserId && (
                  <div className="col-span-4">
                    <Card className="h-full">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-foreground">Détail</h2>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={handleClearUser}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {loadingUserDetail && (
                          <div className="space-y-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-64 w-full" />
                          </div>
                        )}

                        {userDetailError && (
                          <Alert variant="destructive">
                            <AlertDescription>{userDetailError}</AlertDescription>
                          </Alert>
                        )}

                        {!loadingUserDetail && !userDetailError && userDetailData && (
                          <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                            <UserDetail
                              data={userDetailData}
                              groupBy={groupBy}
                              onGroupByChange={setGroupBy}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
