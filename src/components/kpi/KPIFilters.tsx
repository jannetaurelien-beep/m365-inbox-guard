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
  focusFilter,
  onFocusFilterChange,
}: KPIFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Filter className="h-5 w-5 text-primary" />
        Filtres
      </div>

      {/* Période */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Période
        </Label>
        <Select value={String(periodDays)} onValueChange={(v) => onPeriodChange(Number(v))}>
          <SelectTrigger>
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
        <Label>Type de compte</Label>
        <Select value={accountFilter} onValueChange={(v) => onAccountFilterChange(v as AccountFilterType)}>
          <SelectTrigger>
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
          <Label>Domaine</Label>
          <Select value={domainFilter || "all"} onValueChange={(v) => onDomainFilterChange(v === "all" ? null : v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les domaines</SelectItem>
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
        <div className="text-sm font-medium text-muted-foreground">Filtres de liste</div>

        {/* Recherche */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Recherche
          </Label>
          <Input
            placeholder="Nom ou email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Département */}
        {departments.length > 0 && (
          <div className="space-y-2">
            <Label>Département</Label>
            <Select value={departmentFilter || "all"} onValueChange={(v) => onDepartmentFilterChange(v === "all" ? null : v)}>
              <SelectTrigger>
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
          <Label>Focus</Label>
          <Select value={focusFilter} onValueChange={(v) => onFocusFilterChange(v as FocusFilterType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="high-backlog">Backlog élevé (&gt;30)</SelectItem>
              <SelectItem value="low-sla">SLA faible (&lt;70%)</SelectItem>
              <SelectItem value="anomalies">Anomalies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
