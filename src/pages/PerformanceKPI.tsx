import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, X, TrendingUp, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-[2000px] mx-auto p-8 space-y-8">
        {/* Header avec effet glassmorphism */}
        <div className="flex items-center justify-between p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary-foreground" />
              </div>
              Indice de Performance
            </h1>
            <p className="text-lg text-muted-foreground ml-[72px]">
              Pilotage KPI e-mail Microsoft 365 - Analyse temps réel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="lg"
              onClick={loadTenantOverview} 
              disabled={loadingTenant}
              className="rounded-xl hover:shadow-lg transition-all"
            >
              <RefreshCw className={`h-5 w-5 ${loadingTenant ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Vue globale tenant */}
        {loadingTenant && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
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

        {/* Layout principal : Filtres | Liste | Détail */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Filtres (sidebar gauche) */}
          <Card className="xl:col-span-3 rounded-3xl border-2 shadow-xl">
            <CardContent className="pt-8 px-6">
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

          {/* Liste des utilisateurs */}
          <div className={selectedUserId ? 'xl:col-span-5' : 'xl:col-span-9'}>
            <Card className="rounded-3xl border-2 shadow-xl">
              <CardContent className="pt-8 px-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    Boîtes mail ({filteredUsers.length})
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="lg"
                    onClick={loadUsersList} 
                    disabled={loadingUsers}
                    className="rounded-xl"
                  >
                    <RefreshCw className={`h-5 w-5 ${loadingUsers ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {loadingUsers && (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                    ))}
                  </div>
                )}

                {usersError && (
                  <Alert variant="destructive">
                    <AlertDescription>{usersError}</AlertDescription>
                  </Alert>
                )}

                {!loadingUsers && !usersError && filteredUsers.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <Mail className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-lg text-muted-foreground">Aucune boîte mail trouvée</p>
                  </div>
                )}

                {!loadingUsers && !usersError && filteredUsers.length > 0 && (
                  <div className="max-h-[1000px] overflow-y-auto pr-2 space-y-3">
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

          {/* Détail utilisateur (panel droit) */}
          {selectedUserId && (
            <div className="xl:col-span-4">
              <Card className="rounded-3xl border-2 shadow-xl">
                <CardContent className="pt-8 px-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      Détail utilisateur
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      onClick={handleClearUser}
                      className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {loadingUserDetail && (
                    <div className="space-y-6">
                      <Skeleton className="h-40 w-full rounded-2xl" />
                      <Skeleton className="h-80 w-full rounded-2xl" />
                      <Skeleton className="h-80 w-full rounded-2xl" />
                    </div>
                  )}

                  {userDetailError && (
                    <Alert variant="destructive">
                      <AlertDescription>{userDetailError}</AlertDescription>
                    </Alert>
                  )}

                  {!loadingUserDetail && !userDetailError && userDetailData && (
                    <div className="max-h-[1000px] overflow-y-auto pr-2">
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
      </div>
    </div>
  );
}
