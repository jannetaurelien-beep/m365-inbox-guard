import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, Search } from 'lucide-react';
import { AccountFilterType, FocusFilterType } from '@/lib/types/kpi';

interface KPIFiltersProps {
  periodDays: number;
  onPeriodChange: (value: number) => void;
  accountFilter: AccountFilterType;
  onAccountFilterChange: (value: AccountFilterType) => void;
  domains: string[];
  domainFilter: string | null;
  onDomainFilterChange: (value: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
  departments: string[];
  departmentFilter: string | null;
  onDepartmentFilterChange: (value: string | null) => void;
  agencies: string[];
  agencyFilter: string | null;
  onAgencyFilterChange: (value: string | null) => void;
  focusFilter: FocusFilterType;
  onFocusFilterChange: (value: FocusFilterType) => void;
}

export function KPIFilters({
  periodDays,
  onPeriodChange,
  accountFilter,
  onAccountFilterChange,
  domains,
  domainFilter,
  onDomainFilterChange,
  search,
  onSearchChange,
  departments,
  departmentFilter,
  onDepartmentFilterChange,
  agencies,
  agencyFilter,
  onAgencyFilterChange,
  focusFilter,
  onFocusFilterChange,
}: KPIFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm text-foreground">Filtres</h3>
      </div>

      {/* Période */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          Période
        </Label>
        <Select value={String(periodDays)} onValueChange={(v) => onPeriodChange(Number(v))}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 jours</SelectItem>
            <SelectItem value="30">30 jours</SelectItem>
            <SelectItem value="90">90 jours</SelectItem>
            <SelectItem value="180">180 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type de compte */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Type de compte</Label>
        <Select value={accountFilter} onValueChange={(v) => onAccountFilterChange(v as AccountFilterType)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="user">Utilisateurs</SelectItem>
            <SelectItem value="shared">Boîtes partagées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Domaine */}
      {domains.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Domaine</Label>
          <Select value={domainFilter || "all"} onValueChange={(v) => onDomainFilterChange(v === "all" ? null : v)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="border-t pt-4 space-y-4">
        {/* Recherche */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-2">
            <Search className="h-3 w-3" />
            Recherche
          </Label>
          <Input
            placeholder="Nom ou email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Agence */}
        {agencies.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Agence</Label>
            <Select value={agencyFilter || "all"} onValueChange={(v) => onAgencyFilterChange(v === "all" ? null : v)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {agencies.map((agency) => (
                  <SelectItem key={agency} value={agency}>
                    {agency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Département */}
        {departments.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Département</Label>
            <Select value={departmentFilter || "all"} onValueChange={(v) => onDepartmentFilterChange(v === "all" ? null : v)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Focus */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Focus</Label>
          <Select value={focusFilter} onValueChange={(v) => onFocusFilterChange(v as FocusFilterType)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="high-backlog">Backlog élevé</SelectItem>
              <SelectItem value="low-sla">SLA faible</SelectItem>
              <SelectItem value="anomalies">Anomalies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
