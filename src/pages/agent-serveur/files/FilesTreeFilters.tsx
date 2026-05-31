import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsDown, ChevronsUp, Search, X } from "lucide-react";

export type FiltersState = {
  query: string;
  onlyDenied: boolean;
  onlySensitive: boolean;
  onlyExplicit: boolean;
  onlyFullControl: boolean;
  onlyDeny: boolean;
  owner: string; // "all" or owner string
  depth: string; // "all" or "0".."N"
};

export const initialFilters: FiltersState = {
  query: "",
  onlyDenied: false,
  onlySensitive: false,
  onlyExplicit: false,
  onlyFullControl: false,
  onlyDeny: false,
  owner: "all",
  depth: "all",
};

const TOGGLES: { key: keyof FiltersState; label: string; cls: string }[] = [
  { key: "onlyDenied", label: "Accès refusé", cls: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300" },
  { key: "onlySensitive", label: "Droits sensibles", cls: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300" },
  { key: "onlyFullControl", label: "FullControl", cls: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300" },
  { key: "onlyDeny", label: "Deny", cls: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300" },
  { key: "onlyExplicit", label: "ACL explicites", cls: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
];

export function FilesTreeFilters({
  state,
  onChange,
  owners,
  depths,
  onExpandAll,
  onCollapseAll,
  activeCount,
}: {
  state: FiltersState;
  onChange: (s: FiltersState) => void;
  owners: string[];
  depths: number[];
  onExpandAll: () => void;
  onCollapseAll: () => void;
  activeCount: number;
}) {
  const update = <K extends keyof FiltersState>(k: K, v: FiltersState[K]) =>
    onChange({ ...state, [k]: v });

  const hasActiveFilters =
    state.query.trim() !== "" ||
    state.onlyDenied ||
    state.onlySensitive ||
    state.onlyExplicit ||
    state.onlyFullControl ||
    state.onlyDeny ||
    state.owner !== "all" ||
    state.depth !== "all";

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={state.query}
            onChange={(e) => update("query", e.target.value)}
            placeholder="Rechercher un dossier ou un chemin…"
            className="h-9 pl-9"
          />
        </div>

        <Select value={state.owner} onValueChange={(v) => update("owner", v)}>
          <SelectTrigger className="h-9 w-[200px]">
            <SelectValue placeholder="Propriétaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous propriétaires</SelectItem>
            <SelectItem value="__empty__">— (vide)</SelectItem>
            {owners.filter((o) => o && o.trim() !== "").map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={state.depth} onValueChange={(v) => update("depth", v)}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Profondeur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes profondeurs</SelectItem>
            {depths.map((d) => (
              <SelectItem key={d} value={String(d)}>
                Niveau {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {activeCount} affichés
          </Badge>
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={onExpandAll}>
            <ChevronsDown className="h-3.5 w-3.5" />
            Tout développer
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={onCollapseAll}>
            <ChevronsUp className="h-3.5 w-3.5" />
            Tout réduire
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {TOGGLES.map((t) => {
          const active = state[t.key] as boolean;
          return (
            <button
              key={t.key as string}
              type="button"
              onClick={() => update(t.key, !active as never)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                active
                  ? t.cls
                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange(initialFilters)}
            className="ml-1 flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            <X className="h-3 w-3" />
            Réinitialiser
          </button>
        )}
      </div>
    </Card>
  );
}
