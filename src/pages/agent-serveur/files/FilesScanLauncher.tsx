import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FolderTree, Loader2, Play, Server } from "lucide-react";
import { enrichedAgents, type Agent } from "../AgentContext";
import { cn } from "@/lib/utils";

const EXAMPLE_PATHS = ["C:\\Partages", "D:\\Data", "\\\\SRV-FICHIERS\\Finance"];

export type ScanFormState = {
  agentId: string;
  path: string;
  maxDepth: number;
  includePermissions: boolean;
};

export function FilesScanLauncher({
  defaultAgent,
  running,
  status,
  onTrigger,
}: {
  defaultAgent: Agent;
  running: boolean;
  status?: string | null;
  onTrigger: (state: ScanFormState) => void;
}) {
  const [agentId, setAgentId] = useState(defaultAgent.id);
  const [path, setPath] = useState("\\\\SRV-FILE01\\Partage");
  const [depth, setDepth] = useState(3);
  const [includeAcl, setIncludeAcl] = useState(true);

  const onlineAgents = enrichedAgents.filter(
    (a) => a.status === "online" && a.capabilities.includes("files"),
  );
  const selectedAgent = enrichedAgents.find((a) => a.id === agentId);
  const disabled = running || !path.trim() || !selectedAgent || selectedAgent.status !== "online";

  return (
    <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/[0.02] p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-lime-500 to-emerald-600 text-white shadow-md">
            <FolderTree className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Lancer un scan NTFS</h3>
            <p className="text-xs text-muted-foreground">
              Analyse récursive avec collecte optionnelle des ACL.
            </p>
          </div>
        </div>
        {status && (
          <Badge variant="outline" className="capitalize">
            statut · {status}
          </Badge>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Agent */}
        <div className="space-y-2 lg:col-span-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Agent cible
          </Label>
          <Select value={agentId} onValueChange={setAgentId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {onlineAgents.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Aucun agent en ligne avec capacité fichiers
                </div>
              )}
              {onlineAgents.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  <span className="flex items-center gap-2">
                    <Server className="h-3.5 w-3.5 text-emerald-500" />
                    {a.hostname}
                    <span className="text-xs text-muted-foreground">· {a.ip}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAgent && selectedAgent.status !== "online" && (
            <p className="flex items-center gap-1.5 text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              Cet agent n'est pas en ligne.
            </p>
          )}
        </div>

        {/* Path */}
        <div className="space-y-2 lg:col-span-8">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Chemin racine
          </Label>
          <Input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="\\SRV-FICHIERS\Partage"
            className="font-mono text-sm"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Exemples :</span>
            {EXAMPLE_PATHS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPath(p)}
                className="rounded-md border border-dashed border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Depth */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profondeur maximale
            </Label>
            <Badge variant="secondary" className="font-mono">
              {depth}
            </Badge>
          </div>
          <Slider
            min={1}
            max={8}
            step={1}
            value={[depth]}
            onValueChange={(v) => setDepth(v[0])}
            className="py-2"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>1 · racine</span>
            <span>4 · équilibré</span>
            <span>8 · profond</span>
          </div>
        </div>

        {/* ACL */}
        <div className="lg:col-span-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ACL NTFS
          </Label>
          <div
            className={cn(
              "mt-2 flex items-center justify-between rounded-xl border p-3 transition",
              includeAcl
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-border bg-muted/30",
            )}
          >
            <div>
              <p className="text-sm font-medium">Inclure les droits NTFS</p>
              <p className="text-xs text-muted-foreground">Allonge le scan.</p>
            </div>
            <Switch checked={includeAcl} onCheckedChange={setIncludeAcl} />
          </div>
        </div>

        {/* Action */}
        <div className="flex items-end lg:col-span-3">
          <Button
            disabled={disabled}
            onClick={() =>
              onTrigger({ agentId: agentId, path, maxDepth: depth, includePermissions: includeAcl })
            }
            className="h-11 w-full gap-2 bg-gradient-to-r from-lime-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:from-lime-500 hover:to-emerald-700"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scan en cours…
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Lancer le scan
              </>
            )}
          </Button>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-[11px] text-amber-700 dark:text-amber-300">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Une profondeur élevée combinée à la collecte des ACL peut considérablement allonger la durée du scan.
      </p>
    </Card>
  );
}
