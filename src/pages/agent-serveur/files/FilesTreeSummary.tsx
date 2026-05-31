import { StatTile } from "../_shared";
import { FolderTree, FolderRoot, ShieldAlert, ShieldX, Users, GitBranch } from "lucide-react";
import type { FolderNode } from "./types";

export function FilesTreeSummary({
  roots,
  allNodes,
}: {
  roots: FolderNode[];
  allNodes: FolderNode[];
}) {
  const denied = allNodes.filter((n) => n.flags.accessDenied).length;
  const sensitive = allNodes.filter((n) => n.flags.sensitive).length;

  const identities = new Set<string>();
  let inherited = 0;
  let explicit = 0;
  for (const n of allNodes) {
    for (const a of n.Access ?? []) {
      identities.add(a.Identity);
      if (a.Inherited) inherited++;
      else explicit++;
    }
  }
  const ratio =
    inherited + explicit === 0
      ? "—"
      : `${Math.round((inherited / (inherited + explicit)) * 100)}% hér.`;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <StatTile
        label="Dossiers analysés"
        value={allNodes.length}
        icon={FolderTree}
        accent="from-cyan-500 to-blue-600"
        delay={0}
      />
      <StatTile
        label="Racines"
        value={roots.length}
        icon={FolderRoot}
        accent="from-violet-500 to-fuchsia-600"
        delay={0.05}
      />
      <StatTile
        label="Accès refusés"
        value={denied}
        hint={denied ? "À investiguer" : "Aucun"}
        icon={ShieldX}
        accent="from-rose-500 to-red-600"
        delay={0.1}
      />
      <StatTile
        label="Droits sensibles"
        value={sensitive}
        hint={sensitive ? "Audit recommandé" : "RAS"}
        icon={ShieldAlert}
        accent="from-orange-500 to-amber-600"
        delay={0.15}
      />
      <StatTile
        label="Identités distinctes"
        value={identities.size}
        icon={Users}
        accent="from-emerald-500 to-teal-600"
        delay={0.2}
      />
      <StatTile
        label="Ratio ACL"
        value={ratio}
        hint={`${explicit} explicites`}
        icon={GitBranch}
        accent="from-indigo-500 to-purple-600"
        delay={0.25}
      />
    </div>
  );
}
