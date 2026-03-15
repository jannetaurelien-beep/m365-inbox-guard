import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Filter as FilterIcon, Grid3x3, List, Building2, Users as UsersIcon, Globe, Plus, FileDown, Palette, UserPlus, Activity, TrendingUp, Mail, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIFilters } from '@/components/kpi/KPIFilters';
import { TenantOverview } from '@/components/kpi/TenantOverview';
import { UsersList } from '@/components/kpi/UsersList';
import { UserDetail } from '@/components/kpi/UserDetail';
import { AgencyComparison } from '@/components/kpi/AgencyComparison';
import { AgencyDetail } from '@/components/kpi/AgencyDetail';
import { DomainComparison } from '@/components/kpi/DomainComparison';
import { DomainDetail } from '@/components/kpi/DomainDetail';
import { GroupsView } from '@/components/kpi/GroupsView';
import { GroupsComparison } from '@/components/kpi/GroupsComparison';
import { GroupPerformanceView } from '@/components/kpi/GroupPerformanceView';
import { GroupCustomization, getGroupColor, getGroupIcon } from '@/components/kpi/GroupCustomization';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { fetchTenantOverview, fetchUsersList, fetchUserDetail } from '@/lib/api/kpi-api';
import { exportUsersToCSV, exportGroupsToCSV } from '@/lib/export-utils';
import { TenantOverviewResponse, UsersListResponse, UserDetailResponse, AccountFilterType, FocusFilterType, GroupByType, UserGroup, AgencyMetrics, DomainMetrics, GroupPerformance, MailUserMetricsSub } from '@/lib/types/kpi';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mini stat card component
function MiniStat({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5",
        "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={cn("rounded-xl p-2.5", color)}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      <div className={cn("absolute bottom-0 left-0 right-0 h-1", color, "opacity-60")} />
    </motion.div>
  );
}

// Group member dialog (shared between create/edit)
function GroupMemberList({ users, selectedIds, onToggle }: { users: any[]; selectedIds: string[]; onToggle: (id: string) => void }) {
  return (
    <ScrollArea className="h-[350px] rounded-xl border bg-card/50 p-3">
      <div className="space-y-1.5">
        {users.map((user) => {
          const isSelected = selectedIds.includes(user.userId);
          const sla = user.metrics.external.first_reply_within_sla || 0;
          return (
            <div
              key={user.userId}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                isSelected
                  ? "bg-primary/8 border border-primary/20 shadow-sm"
                  : "hover:bg-muted/50 border border-transparent"
              )}
              onClick={() => onToggle(user.userId)}
            >
              <Checkbox checked={isSelected} className="pointer-events-none" />
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user.displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.upn}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-mono",
                  sla >= 80 ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800" :
                  sla >= 60 ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800" :
                  "text-destructive border-destructive/20 bg-destructive/5"
                )}
              >
                {Math.round(sla)}%
              </Badge>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default function PerformanceKPI() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('overview');

  // Filters
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
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Group dialogs
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [groupFormName, setGroupFormName] = useState('');
  const [groupFormDescription, setGroupFormDescription] = useState('');
  const [groupFormUserIds, setGroupFormUserIds] = useState<string[]>([]);
  const [groupFormIcon, setGroupFormIcon] = useState('users');
  const [groupFormColor, setGroupFormColor] = useState('blue');
  const [groupDialogTab, setGroupDialogTab] = useState<'customize' | 'members'>('customize');

  // Groups
  const [userGroups, setUserGroups] = useState<UserGroup[]>([
    { id: 'group-1', name: 'Commerciaux TLS', description: 'Équipe commerciale TLS', icon: 'briefcase', color: 'blue', userIds: ['user-1', 'user-2', 'user-8'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'group-2', name: 'Support Technique', description: 'Équipe support technique', icon: 'headphones', color: 'violet', userIds: ['user-3', 'user-5', 'user-9'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'group-3', name: 'Direction Paris', description: 'Équipe de direction Paris', icon: 'crown', color: 'amber', userIds: ['user-4', 'user-6', 'user-10'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'group-4', name: 'Service Client', description: 'Équipe service client', icon: 'heart', color: 'emerald', userIds: ['user-7', 'user-11', 'user-12', 'user-13'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'group-5', name: 'Marketing', description: 'Équipe marketing et communication', icon: 'rocket', color: 'rose', userIds: ['user-14', 'user-15'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'group-6', name: 'Comptabilité', description: 'Service comptabilité et finance', icon: 'target', color: 'indigo', userIds: ['user-16', 'user-17', 'user-18'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]);

  // Data
  const [tenantData, setTenantData] = useState<TenantOverviewResponse | null>(null);
  const [usersData, setUsersData] = useState<UsersListResponse | null>(null);
  const [userDetailData, setUserDetailData] = useState<UserDetailResponse | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userDetailError, setUserDetailError] = useState<string | null>(null);

  const selectedUserId = searchParams.get('userId');

  const getAccountType = (): string | null => {
    if (accountFilter === 'user') return 'Utilisateur';
    if (accountFilter === 'shared') return 'Boîte partagée';
    return null;
  };

  const loadTenantOverview = async () => {
    setLoadingTenant(true);
    setTenantError(null);
    try {
      const data = await fetchTenantOverview(periodDays, undefined, getAccountType(), domainFilter);
      setTenantData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setTenantError(message);
      toast({ title: 'Erreur', description: `Impossible de charger les données: ${message}`, variant: 'destructive' });
    } finally {
      setLoadingTenant(false);
    }
  };

  const loadUsersList = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const data = await fetchUsersList(periodDays, undefined, getAccountType(), domainFilter);
      setUsersData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setUsersError(message);
      toast({ title: 'Erreur', description: `Impossible de charger les utilisateurs: ${message}`, variant: 'destructive' });
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadUserDetail = async (userId: string) => {
    setLoadingUserDetail(true);
    setUserDetailError(null);
    try {
      const data = await fetchUserDetail(userId, periodDays, groupBy);
      setUserDetailData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setUserDetailError(message);
      toast({ title: 'Erreur', description: `Impossible de charger les détails: ${message}`, variant: 'destructive' });
    } finally {
      setLoadingUserDetail(false);
    }
  };

  useEffect(() => { loadTenantOverview(); loadUsersList(); }, [periodDays, accountFilter, domainFilter]);
  useEffect(() => {
    if (selectedUserId) loadUserDetail(selectedUserId);
    else setUserDetailData(null);
  }, [selectedUserId, periodDays, groupBy]);

  const departments = useMemo(() => {
    if (!usersData) return [];
    return Array.from(new Set(usersData.users.map(u => u.department).filter(Boolean) as string[])).sort();
  }, [usersData]);

  const agencies = useMemo(() => {
    if (!usersData) return [];
    return Array.from(new Set(usersData.users.map(u => u.agency).filter(Boolean) as string[])).sort();
  }, [usersData]);

  const jobTitles = useMemo(() => {
    if (!usersData) return [];
    return Array.from(new Set(usersData.users.map(u => u.jobTitle).filter(Boolean) as string[])).sort();
  }, [usersData]);

  // Aggregate metrics helpers
  const aggregateMetrics = (users: typeof usersData extends { users: infer U } ? U : never[]) => {
    const metrics = {
      total: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 } as MailUserMetricsSub,
      external: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 } as MailUserMetricsSub,
      internal: { received: 0, sent: 0, backlog_total: 0, backlog_unread: 0, backlog_flagged: 0, first_reply_p50_min: 0, first_reply_p90_min: 0, first_reply_within_sla: 0, samples: 0 } as MailUserMetricsSub,
    };
    (users as any[]).forEach((user: any) => {
      (['total', 'external', 'internal'] as const).forEach(type => {
        const um = user.metrics[type];
        const gm = metrics[type];
        gm.received += um.received;
        gm.sent += um.sent;
        gm.backlog_total += um.backlog_total || 0;
        gm.backlog_unread = (gm.backlog_unread || 0) + (um.backlog_unread || 0);
        gm.backlog_flagged = (gm.backlog_flagged || 0) + (um.backlog_flagged || 0);
      });
    });
    return metrics;
  };

  const computeScore = (users: any[], metrics: any) => {
    const count = users.length;
    if (!count) return 0;
    const avgSla = users.reduce((s: number, u: any) => s + (u.metrics.external.first_reply_within_sla || 0), 0) / count;
    const avgBacklog = metrics.external.backlog_total / count;
    metrics.external.first_reply_within_sla = avgSla;
    return avgSla * 0.6 + Math.max(0, 100 - (avgBacklog / 50) * 100) * 0.4;
  };

  const domainMetrics = useMemo((): DomainMetrics[] => {
    if (!usersData) return [];
    const map = new Map<string, any[]>();
    usersData.users.forEach(u => {
      const d = u.upn.split('@')[1] || 'unknown';
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(u);
    });
    return Array.from(map.entries()).map(([domain, users]) => {
      const metrics = aggregateMetrics(users);
      return { domain, userCount: users.length, metrics, avgScore: computeScore(users, metrics) };
    });
  }, [usersData]);

  const agencyMetrics = useMemo((): AgencyMetrics[] => {
    if (!usersData) return [];
    const map = new Map<string, any[]>();
    usersData.users.forEach(u => {
      const a = u.agency || 'Non assigné';
      if (!map.has(a)) map.set(a, []);
      map.get(a)!.push(u);
    });
    return Array.from(map.entries()).map(([agency, users]) => {
      const metrics = aggregateMetrics(users);
      return { agency, userCount: users.length, metrics, avgScore: computeScore(users, metrics) };
    });
  }, [usersData]);

  const getGroupPerformance = (groupId: string): GroupPerformance | null => {
    const group = userGroups.find(g => g.id === groupId);
    if (!group || !usersData) return null;
    const groupUsers = usersData.users.filter(u => group.userIds.includes(u.userId));
    if (!groupUsers.length) return null;
    const metrics = aggregateMetrics(groupUsers);
    return { group, metrics, users: groupUsers, avgScore: computeScore(groupUsers, metrics) };
  };

  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    let filtered = [...usersData.users];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(u => u.displayName.toLowerCase().includes(s) || u.upn.toLowerCase().includes(s));
    }
    if (departmentFilter) filtered = filtered.filter(u => u.department === departmentFilter);
    if (agencyFilter) filtered = filtered.filter(u => u.agency === agencyFilter);
    if (jobTitleFilter) filtered = filtered.filter(u => u.jobTitle === jobTitleFilter);
    if (groupFilter) {
      const group = userGroups.find(g => g.id === groupFilter);
      if (group) filtered = filtered.filter(u => group.userIds.includes(u.userId));
    }
    if (focusFilter !== 'all') {
      filtered = filtered.filter(u => {
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

  // Group handlers
  const handleCreateGroup = (name: string, description: string, userIds: string[], icon?: string, color?: string) => {
    setUserGroups([...userGroups, {
      id: `group-${Date.now()}`, name, description, icon: icon || 'users', color: color || 'blue',
      userIds, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }]);
    toast({ title: 'Groupe créé', description: `Le groupe "${name}" a été créé.` });
  };

  const handleDeleteGroup = (groupId: string) => {
    setUserGroups(userGroups.filter(g => g.id !== groupId));
    if (groupFilter === groupId) setGroupFilter(null);
    toast({ title: 'Groupe supprimé' });
  };

  const openCreateGroupDialog = () => {
    setGroupFormName(''); setGroupFormDescription(''); setGroupFormUserIds([]);
    setGroupFormIcon('users'); setGroupFormColor('blue'); setGroupDialogTab('customize');
    setIsCreateGroupOpen(true);
  };

  const openEditGroupDialog = (group: UserGroup) => {
    setEditingGroup(group); setGroupFormName(group.name);
    setGroupFormDescription(group.description || ''); setGroupFormUserIds([...group.userIds]);
    setGroupFormIcon(group.icon || 'users'); setGroupFormColor(group.color || 'blue');
    setGroupDialogTab('customize'); setIsEditGroupOpen(true);
  };

  const handleSaveGroup = () => {
    if (!groupFormName.trim()) return;
    if (editingGroup) {
      setUserGroups(userGroups.map(g => g.id === editingGroup.id
        ? { ...g, name: groupFormName, description: groupFormDescription, userIds: groupFormUserIds, icon: groupFormIcon, color: groupFormColor, updatedAt: new Date().toISOString() }
        : g
      ));
      toast({ title: 'Groupe modifié' });
      setIsEditGroupOpen(false);
    } else {
      handleCreateGroup(groupFormName, groupFormDescription, groupFormUserIds, groupFormIcon, groupFormColor);
      setIsCreateGroupOpen(false);
    }
    setEditingGroup(null);
  };

  const toggleUserInGroup = (userId: string) => {
    setGroupFormUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleSelectUser = (userId: string) => setSearchParams({ userId });
  const handleClearUser = () => setSearchParams({});

  // Quick stats from tenant data
  const totalReceived = tenantData?.totals.received || 0;
  const totalSent = tenantData?.totals.sent || 0;
  const avgSla = tenantData?.external.within_sla || 0;
  const avgReplyMin = tenantData?.external.first_reply_p50_min || 0;

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
    { id: 'domains', label: 'Domaines', icon: Globe },
    { id: 'agencies', label: 'Agences', icon: Building2 },
    { id: 'groups', label: 'Groupes', icon: UsersIcon },
  ];

  // Group dialog content (shared)
  const renderGroupDialog = (isOpen: boolean, onClose: (v: boolean) => void, title: string, actionLabel: string) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl">
        <DialogHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", getGroupColor(groupFormColor).gradient)}>
              {(() => { const Icon = getGroupIcon(groupFormIcon); return <Icon className="h-5 w-5 text-primary-foreground" />; })()}
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Personnalisez et ajoutez des membres</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={groupDialogTab} onValueChange={(v) => setGroupDialogTab(v as any)} className="mt-3">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="customize" className="gap-2 text-xs"><Palette className="h-3.5 w-3.5" />Personnaliser</TabsTrigger>
            <TabsTrigger value="members" className="gap-2 text-xs"><UserPlus className="h-3.5 w-3.5" />Membres ({groupFormUserIds.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Nom *</Label>
                <Input value={groupFormName} onChange={(e) => setGroupFormName(e.target.value)} placeholder="Ex: Commerciaux TLS" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Description</Label>
                <Input value={groupFormDescription} onChange={(e) => setGroupFormDescription(e.target.value)} placeholder="Description optionnelle..." className="h-10" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <Label className="text-xs font-medium mb-3 block">Apparence</Label>
              <GroupCustomization icon={groupFormIcon} color={groupFormColor} onIconChange={setGroupFormIcon} onColorChange={setGroupFormColor} />
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Sélectionner les membres</Label>
                <Badge variant="secondary" className="text-xs">{groupFormUserIds.length} sélectionné{groupFormUserIds.length > 1 ? 's' : ''}</Badge>
              </div>
              {usersData && <GroupMemberList users={usersData.users} selectedIds={groupFormUserIds} onToggle={toggleUserInGroup} />}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-3 border-t border-border/50 mt-3">
          <Button variant="outline" size="sm" onClick={() => onClose(false)}>Annuler</Button>
          <Button size="sm" onClick={handleSaveGroup} disabled={!groupFormName.trim()}>{actionLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Clean header */}
      <div className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Performance</h1>
                  <p className="text-[11px] text-muted-foreground">{periodDays}j • {filteredUsers.length} boîtes</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                </span>
                <span className="text-[11px] font-medium text-accent">Live</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    <FilterIcon className="h-3.5 w-3.5" />Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader><SheetTitle>Filtres avancés</SheetTitle></SheetHeader>
                  <div className="mt-6">
                    <KPIFilters
                      periodDays={periodDays} onPeriodChange={setPeriodDays}
                      accountFilter={accountFilter} onAccountFilterChange={setAccountFilter}
                      domains={tenantData?.tenant.domains || []} domainFilter={domainFilter} onDomainFilterChange={setDomainFilter}
                      search={search} onSearchChange={setSearch}
                      departments={departments} departmentFilter={departmentFilter} onDepartmentFilterChange={setDepartmentFilter}
                      agencies={agencies} agencyFilter={agencyFilter} onAgencyFilterChange={setAgencyFilter}
                      jobTitles={jobTitles} jobTitleFilter={jobTitleFilter} onJobTitleFilterChange={setJobTitleFilter}
                      focusFilter={focusFilter} onFocusFilterChange={setFocusFilter}
                      groups={userGroups} groupFilter={groupFilter} onGroupFilterChange={setGroupFilter}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center border border-border/60 rounded-lg overflow-hidden">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" className="h-8 w-8 p-0 rounded-none" onClick={() => setViewMode('grid')}>
                  <Grid3x3 className="h-3.5 w-3.5" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" className="h-8 w-8 p-0 rounded-none" onClick={() => setViewMode('list')}>
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={loadTenantOverview} disabled={loadingTenant}>
                <RefreshCw className={cn("h-3.5 w-3.5", loadingTenant && "animate-spin")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-5 space-y-5">
        {/* Quick Stats Row */}
        {tenantData && !loadingTenant && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniStat icon={Mail} label="Reçus" value={totalReceived.toLocaleString()} sub={`${periodDays} derniers jours`} color="bg-primary" />
            <MiniStat icon={TrendingUp} label="Envoyés" value={totalSent.toLocaleString()} sub={`Ratio ${totalSent ? (totalReceived / totalSent).toFixed(1) : '0'}:1`} color="bg-accent" />
            <MiniStat icon={Clock} label="SLA moyen" value={`${Math.round(avgSla)}%`} sub="Réponse dans les délais" color={avgSla >= 75 ? "bg-accent" : "bg-warning"} />
            <MiniStat icon={Activity} label="Réponse P50" value={`${Math.round(avgReplyMin)}min`} sub="Temps médian" color="bg-primary" />
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => {
          setActiveTab(val);
          if (val !== 'groups') setGroupFilter(null);
        }}>
          <TabsList className="h-10 bg-muted/50 p-0.5">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-5 mt-5">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {loadingTenant && <Skeleton className="h-48 w-full rounded-2xl" />}
                {tenantError && <Alert variant="destructive"><AlertDescription>{tenantError}</AlertDescription></Alert>}
                {!loadingTenant && !tenantError && tenantData && (
                  <TenantOverview
                    data={tenantData} groups={userGroups} users={usersData?.users || []}
                    onSelectGroup={(groupId) => { setActiveTab('groups'); setGroupFilter(groupId); }}
                  />
                )}
              </motion.div>

              {/* Users section */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold">Boîtes mail</h2>
                    <p className="text-xs text-muted-foreground">{filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"
                      onClick={() => {
                        if (usersData) {
                          exportUsersToCSV(filteredUsers, `utilisateurs-kpi-${new Date().toISOString().split('T')[0]}.csv`);
                          toast({ title: 'Export réussi', description: `${filteredUsers.length} utilisateurs exportés` });
                        }
                      }}
                      disabled={!usersData || filteredUsers.length === 0}
                    >
                      <FileDown className="h-3.5 w-3.5" />CSV
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={loadUsersList} disabled={loadingUsers}>
                      <RefreshCw className={cn("h-3.5 w-3.5", loadingUsers && "animate-spin")} />
                    </Button>
                  </div>
                </div>

                {loadingUsers && (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-2'}>
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                  </div>
                )}
                {usersError && <Alert variant="destructive"><AlertDescription>{usersError}</AlertDescription></Alert>}
                {!loadingUsers && !usersError && filteredUsers.length === 0 && (
                  <Card className="rounded-2xl border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <FilterIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">Aucun résultat</p>
                      <p className="text-xs text-muted-foreground mt-1">Modifiez vos filtres</p>
                    </CardContent>
                  </Card>
                )}
                {!loadingUsers && !usersError && filteredUsers.length > 0 && (
                  <UsersList users={filteredUsers} selectedUserId={selectedUserId} onSelectUser={handleSelectUser} viewMode={viewMode} />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="domains" className="space-y-5 mt-5">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {loadingUsers ? (
                  <div className="grid gap-3 md:grid-cols-2">{[1, 2].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}</div>
                ) : selectedDomain ? (
                  <DomainDetail domain={selectedDomain} users={usersData?.users.filter(u => u.upn.endsWith(`@${selectedDomain}`)) || []} onBack={() => setSelectedDomain(null)} />
                ) : (
                  <DomainComparison domains={domainMetrics} onSelectDomain={setSelectedDomain} />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="agencies" className="space-y-5 mt-5">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {loadingUsers ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}</div>
                ) : selectedAgency ? (
                  <AgencyDetail agency={selectedAgency} users={usersData?.users.filter(u => u.agency === selectedAgency) || []} onBack={() => setSelectedAgency(null)} />
                ) : (
                  <AgencyComparison agencies={agencyMetrics} onSelectAgency={setSelectedAgency} />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-5 mt-5">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {usersData && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold">Groupes</h2>
                        <p className="text-xs text-muted-foreground">{userGroups.length} groupe{userGroups.length > 1 ? 's' : ''} configuré{userGroups.length > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"
                          onClick={() => {
                            exportGroupsToCSV(userGroups, usersData.users, `groupes-kpi-${new Date().toISOString().split('T')[0]}.csv`);
                            toast({ title: 'Export réussi' });
                          }}
                          disabled={userGroups.length === 0}
                        >
                          <FileDown className="h-3.5 w-3.5" />Export
                        </Button>
                        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={openCreateGroupDialog}>
                          <Plus className="h-3.5 w-3.5" />Nouveau
                        </Button>
                      </div>
                    </div>

                    {userGroups.length > 0 && (
                      <GroupsComparison
                        groups={userGroups} users={usersData.users}
                        onExportSuccess={(message) => toast({ title: 'Export réussi', description: message })}
                      />
                    )}

                    <GroupsView
                      groups={userGroups} users={usersData.users}
                      onSelectGroup={(groupId) => setGroupFilter(groupId)}
                      onEditGroup={openEditGroupDialog}
                      onDeleteGroup={handleDeleteGroup}
                      onExportSuccess={(message) => toast({ title: 'Export réussi', description: message })}
                    />

                    {groupFilter && getGroupPerformance(groupFilter) && (
                      <div className="mt-4">
                        <Button variant="outline" size="sm" onClick={() => setGroupFilter(null)} className="mb-3 h-8 text-xs">
                          ← Retour
                        </Button>
                        <GroupPerformanceView groupPerformance={getGroupPerformance(groupFilter)!} />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* User detail sheet */}
      {selectedUserId && (
        <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && handleClearUser()}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader><SheetTitle>Analyse détaillée</SheetTitle></SheetHeader>
            <div className="mt-6">
              {loadingUserDetail && <div className="space-y-3"><Skeleton className="h-28 w-full rounded-xl" /><Skeleton className="h-56 w-full rounded-xl" /></div>}
              {userDetailError && <Alert variant="destructive"><AlertDescription>{userDetailError}</AlertDescription></Alert>}
              {!loadingUserDetail && !userDetailError && userDetailData && (
                <UserDetail data={userDetailData} groupBy={groupBy} onGroupByChange={setGroupBy} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Group dialogs */}
      {renderGroupDialog(isCreateGroupOpen, setIsCreateGroupOpen, 'Nouveau groupe', 'Créer')}
      {renderGroupDialog(isEditGroupOpen, setIsEditGroupOpen, 'Modifier le groupe', 'Enregistrer')}
    </div>
  );
}
