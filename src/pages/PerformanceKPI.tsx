import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, X, Settings, Download, Filter as FilterIcon, Grid3x3, List } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Extraire les départements uniques
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
                      focusFilter={focusFilter}
                      onFocusFilterChange={setFocusFilter}
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
