import { HardDrive, Clock, Layers, Shield, ShieldOff, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ScanResult } from "./types";

export function FilesScanHeader({
  agentLabel,
  scan,
  depth,
  includeAcl,
}: {
  agentLabel: string;
  scan: ScanResult | null;
  depth: number;
  includeAcl: boolean;
}) {
  const lastScan = scan?.scanned_at
    ? new Date(scan.scanned_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })
    : "Jamais";

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-6 shadow-sm">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-lime-500/20 to-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent blur-3xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <HardDrive className="h-7 w-7" />
          </div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Console d'audit NTFS
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Fichiers & droits NTFS</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Scannez une arborescence, visualisez les propriétaires, les ACL et les dossiers sensibles,
              puis identifiez rapidement les expositions anormales.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <Server className="h-3 w-3" />
          Agent · {agentLabel}
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Clock className="h-3 w-3" />
          Dernier scan · {lastScan}
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Layers className="h-3 w-3" />
          Profondeur · {depth}
        </Badge>
        <Badge
          variant="outline"
          className={
            includeAcl
              ? "gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "gap-1.5 border-muted-foreground/30 text-muted-foreground"
          }
        >
          {includeAcl ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
          {includeAcl ? "ACL incluses" : "ACL non incluses"}
        </Badge>
        {scan?.duration != null && (
          <Badge variant="outline" className="gap-1.5">
            Durée · {scan.duration}s
          </Badge>
        )}
        {scan?.count != null && (
          <Badge variant="outline" className="gap-1.5">
            {scan.count} dossiers
          </Badge>
        )}
      </div>
    </div>
  );
}
