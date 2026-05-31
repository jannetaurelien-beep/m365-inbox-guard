import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Shield, ShieldX, GitBranch, User } from "lucide-react";
import { identityDomain, rightsSeverity, shortIdentity } from "./utils";
import type { FsAccessRule } from "./types";

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  high: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  low: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
};

function splitRights(rights: string): string[] {
  return rights
    .split(/[,;|+]/)
    .map((r) => r.trim())
    .filter(Boolean);
}

export function FilesAclIdentityCard({
  identity,
  rules,
}: {
  identity: string;
  rules: FsAccessRule[];
}) {
  const hasDeny = rules.some((r) => r.Type === "Deny");
  const allInherited = rules.every((r) => r.Inherited);
  const domain = identityDomain(identity);
  const short = shortIdentity(identity);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card/60 p-3 transition hover:bg-card",
        hasDeny
          ? "border-rose-500/30"
          : allInherited
            ? "border-border/60 opacity-90"
            : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "grid h-6 w-6 place-items-center rounded-md text-white",
                hasDeny
                  ? "bg-gradient-to-br from-rose-500 to-red-600"
                  : "bg-gradient-to-br from-slate-500 to-slate-700",
              )}
            >
              <User className="h-3 w-3" />
            </div>
            <p className="truncate font-mono text-sm font-semibold">{short}</p>
          </div>
          {domain && (
            <p className="mt-0.5 truncate pl-7 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {domain}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {hasDeny ? (
            <Badge variant="outline" className="gap-1 border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300">
              <ShieldX className="h-3 w-3" />
              Deny
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <Shield className="h-3 w-3" />
              Allow
            </Badge>
          )}
          {allInherited && (
            <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground">
              <GitBranch className="h-3 w-3" />
              hérité
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {rules.flatMap((r, i) =>
          splitRights(r.Rights).map((right, j) => {
            const sev = r.Type === "Deny" ? "critical" : rightsSeverity(right);
            return (
              <span
                key={`${i}-${j}-${right}`}
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                  SEVERITY_STYLES[sev],
                  r.Inherited && "opacity-70",
                )}
                title={r.Inherited ? "Hérité" : "Explicite"}
              >
                {right}
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}
