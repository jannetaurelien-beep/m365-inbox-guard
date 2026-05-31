import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { useAgent } from "./AgentContext";
import { FilesScanHeader } from "./files/FilesScanHeader";
import { FilesScanLauncher, type ScanFormState } from "./files/FilesScanLauncher";
import { FilesTreeSummary } from "./files/FilesTreeSummary";
import { FilesTreeFilters, initialFilters, type FiltersState } from "./files/FilesTreeFilters";
import { FilesFolderNodeCard } from "./files/FilesFolderNodeCard";
import { FilesEmptyState } from "./files/FilesEmptyState";
import { buildTree, collectAllPaths, flattenTree } from "./files/utils";
import { mockScanResult } from "./files/mock-scan";
import type { FolderNode, ScanResult } from "./files/types";

/**
 * BACKEND BRANCHEMENT
 * -------------------
 * Cette page est branchée sur le contrat réel AutoCore:
 *   - GET  /api/agent/scan/fs_scan_tree/latest/        → charge `scan`
 *   - POST /api/agent/scan/fs_scan_tree/trigger/       → déclenche un scan
 *
 * Pour intégration : remplacer `fetchLatestScan` et `triggerScan` par les vrais appels
 * (ex. via le client API existant). Le mock conserve strictement le contrat ScanResult,
 * donc le passage en prod ne nécessite aucune refonte UI.
 */
async function fetchLatestScan(): Promise<ScanResult> {
  // TODO: brancher sur l'API réelle GET /api/agent/scan/fs_scan_tree/latest/
  await new Promise((r) => setTimeout(r, 200));
  return mockScanResult;
}

async function triggerScan(_payload: ScanFormState): Promise<{ task_id: number }> {
  // TODO: brancher sur l'API réelle POST /api/agent/scan/fs_scan_tree/trigger/
  await new Promise((r) => setTimeout(r, 800));
  return { task_id: Date.now() };
}

export default function Files() {
  const { agent } = useAgent();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [lastForm, setLastForm] = useState<ScanFormState>({
    agentId: agent.id,
    path: "\\\\SRV-FILE01\\Partage",
    maxDepth: 3,
    includePermissions: true,
  });

  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [expandedAclPaths, setExpandedAclPaths] = useState<Set<string>>(new Set());

  // === Chargement initial ===
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchLatestScan()
      .then((s) => {
        if (!alive) return;
        setScan(s);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // === Arbre ===
  const roots = useMemo<FolderNode[]>(
    () => (scan?.items ? buildTree(scan.items) : []),
    [scan],
  );
  const allNodes = useMemo(() => flattenTree(roots), [roots]);

  // Ouvre les racines par défaut au premier chargement
  useEffect(() => {
    if (roots.length && expandedPaths.size === 0) {
      setExpandedPaths(new Set(roots.map((r) => r.FullName)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roots.length]);

  // === Filtres ===
  const owners = useMemo(
    () => Array.from(new Set(allNodes.map((n) => n.Owner))).sort(),
    [allNodes],
  );
  const depths = useMemo(
    () => Array.from(new Set(allNodes.map((n) => n.Depth))).sort((a, b) => a - b),
    [allNodes],
  );

  const matches = (n: FolderNode) => {
    const q = filters.query.trim().toLowerCase();
    if (q && !n.Name.toLowerCase().includes(q) && !n.FullName.toLowerCase().includes(q))
      return false;
    if (filters.onlyDenied && !n.flags.accessDenied) return false;
    if (filters.onlySensitive && !n.flags.sensitive) return false;
    if (filters.onlyExplicit && !n.flags.hasExplicit) return false;
    if (filters.onlyFullControl && !n.flags.hasFullControlExplicit) return false;
    if (filters.onlyDeny && !n.flags.hasDeny) return false;
    if (filters.owner !== "all") {
      const ownerEmpty = !n.Owner || n.Owner.trim() === "";
      if (filters.owner === "__empty__" ? !ownerEmpty : n.Owner !== filters.owner) return false;
    }
    if (filters.depth !== "all" && String(n.Depth) !== filters.depth) return false;
    return true;
  };

  // Pour préserver l'arbre, on garde tout ancêtre d'un nœud qui matche.
  const visiblePaths = useMemo(() => {
    const visible = new Set<string>();
    const visit = (n: FolderNode): boolean => {
      const childOk = n.children.map(visit).some(Boolean);
      const ok = matches(n) || childOk;
      if (ok) visible.add(n.FullName);
      return ok;
    };
    roots.forEach(visit);
    return visible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roots, filters]);

  // Auto-expand quand on filtre
  useEffect(() => {
    const hasFilter =
      filters.query ||
      filters.onlyDenied ||
      filters.onlySensitive ||
      filters.onlyExplicit ||
      filters.onlyFullControl ||
      filters.onlyDeny ||
      filters.owner !== "all" ||
      filters.depth !== "all";
    if (hasFilter && visiblePaths.size) {
      setExpandedPaths(new Set(visiblePaths));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const visibleRoots = roots.filter((r) => visiblePaths.has(r.FullName));

  // === Points d'attention ===
  const attention = useMemo(
    () =>
      [...allNodes]
        .filter((n) => n.flags.sensitive || n.flags.accessDenied)
        .sort((a, b) => b.flags.sensitivityScore - a.flags.sensitivityScore)
        .slice(0, 5),
    [allNodes],
  );

  // === Actions ===
  const handleToggle = (p: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };
  const handleToggleAcl = (p: string) => {
    setExpandedAclPaths((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };
  const expandAll = () => setExpandedPaths(new Set(collectAllPaths(roots)));
  const collapseAll = () => setExpandedPaths(new Set());

  const handleTrigger = async (state: ScanFormState) => {
    setLastForm(state);
    setRunning(true);
    try {
      const res = await triggerScan(state);
      toast({
        title: "Scan déclenché",
        description: `Tâche #${res.task_id} envoyée à l'agent.`,
      });
      // En vrai : on poll ensuite GET /latest/ jusqu'au statut final.
      const s = await fetchLatestScan();
      setScan({ ...s, agent_label: state.agentId });
    } catch (e) {
      toast({
        title: "Échec du déclenchement",
        description: e instanceof Error ? e.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  // === États ===
  const renderTreeArea = () => {
    if (loading) return <FilesEmptyState variant="running" />;
    if (!scan || !scan.items) return <FilesEmptyState variant="no-scan" />;
    if (scan.status === "failed" || scan.status === "timeout")
      return (
        <FilesEmptyState
          variant="failed"
          message={scan.error ?? "Le scan ne s'est pas terminé correctement."}
          detail={scan.error ?? undefined}
        />
      );
    if (scan.status === "running" || scan.status === "pending")
      return <FilesEmptyState variant="running" />;
    if (allNodes.length === 0) return <FilesEmptyState variant="empty" />;
    if (visibleRoots.length === 0)
      return (
        <Card className="border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun dossier ne correspond aux filtres actuels.
          </p>
        </Card>
      );
    return (
      <div className="space-y-2">
        {visibleRoots.map((r) => (
          <FilesFolderNodeCard
            key={r.FullName}
            node={r}
            expandedPaths={expandedPaths}
            expandedAclPaths={expandedAclPaths}
            visiblePaths={visiblePaths}
            onToggle={handleToggle}
            onToggleAcl={handleToggleAcl}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <FilesScanHeader
        agentLabel={scan?.agent_label ?? agent.hostname}
        scan={scan}
        depth={lastForm.maxDepth}
        includeAcl={lastForm.includePermissions}
      />

      <FilesScanLauncher
        defaultAgent={agent}
        running={running || scan?.status === "running" || scan?.status === "pending"}
        status={scan?.status ?? undefined}
        onTrigger={handleTrigger}
      />

      {scan?.warnings && scan.warnings.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5 p-3">
          <div className="flex items-start gap-2 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-300">
                Scan terminé avec {scan.warnings.length} avertissement(s)
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-amber-700/80 dark:text-amber-300/80">
                {scan.warnings.slice(0, 3).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {allNodes.length > 0 && (
        <>
          <FilesTreeSummary roots={roots} allNodes={allNodes} />

          {attention.length > 0 && (
            <Card className="overflow-hidden border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-card to-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Points d'attention</p>
                  <p className="text-xs text-muted-foreground">
                    Dossiers à vérifier en priorité, triés par score de sensibilité.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {attention.map((n) => (
                  <button
                    key={n.FullName}
                    type="button"
                    onClick={() => {
                      // Déplie tous les ancêtres pour mettre en évidence le nœud
                      const next = new Set(expandedPaths);
                      let p: string | null = n.parentPath;
                      while (p) {
                        next.add(p);
                        const parent = allNodes.find((x) => x.FullName === p);
                        p = parent?.parentPath ?? null;
                      }
                      next.add(n.FullName);
                      setExpandedPaths(next);
                    }}
                    className="group flex items-start justify-between gap-2 rounded-lg border bg-card/60 p-2.5 text-left transition hover:border-orange-500/40 hover:bg-card"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{n.Name}</p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        {n.FullName}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Badge
                        variant="outline"
                        className="border-orange-500/40 bg-orange-500/15 text-orange-700 dark:text-orange-300"
                      >
                        {n.flags.sensitivityScore}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          <FilesTreeFilters
            state={filters}
            onChange={setFilters}
            owners={owners}
            depths={depths}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
            activeCount={visiblePaths.size}
          />
        </>
      )}

      {renderTreeArea()}
    </div>
  );
}
