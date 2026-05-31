import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  ShieldAlert,
  ShieldX,
  UserX,
  GitBranch,
  Star,
  Files,
  Layers,
  Eye,
  EyeOff,
} from "lucide-react";
import type { FolderNode } from "./types";
import { groupAclByIdentity } from "./utils";
import { FilesAclIdentityCard } from "./FilesAclIdentityCard";

const ACL_PREVIEW = 4;

export function FilesFolderNodeCard({
  node,
  level = 0,
  expandedPaths,
  expandedAclPaths,
  visiblePaths,
  onToggle,
  onToggleAcl,
}: {
  node: FolderNode;
  level?: number;
  expandedPaths: Set<string>;
  expandedAclPaths: Set<string>;
  visiblePaths: Set<string>;
  onToggle: (path: string) => void;
  onToggleAcl: (path: string) => void;
}) {
  const isOpen = expandedPaths.has(node.FullName);
  const aclOpen = expandedAclPaths.has(node.FullName);
  const hasChildren = node.children.length > 0;
  const visibleChildren = node.children.filter((c) => visiblePaths.has(c.FullName));
  const acl = node.Access ?? [];
  const grouped = groupAclByIdentity(acl);
  const showAllAcl = aclOpen || grouped.length <= ACL_PREVIEW;
  const aclToRender = showAllAcl ? grouped : grouped.slice(0, ACL_PREVIEW);

  const accent =
    node.flags.sensitivityScore >= 60
      ? "from-rose-500/60 to-red-600/60"
      : node.flags.sensitivityScore >= 35
        ? "from-orange-500/60 to-amber-600/60"
        : node.flags.isRoot
          ? "from-violet-500/60 to-fuchsia-600/60"
          : "from-cyan-500/40 to-blue-600/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ marginLeft: level * 18 }}
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-card transition-all",
          node.flags.sensitive
            ? "border-orange-500/30 hover:border-orange-500/50"
            : "hover:border-foreground/20",
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-1 bg-gradient-to-b",
            accent,
          )}
        />

        <div className="flex items-start gap-2 p-3 pl-4">
          <button
            type="button"
            onClick={() => onToggle(node.FullName)}
            disabled={!hasChildren}
            className={cn(
              "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border transition",
              hasChildren
                ? "border-border bg-background hover:bg-muted"
                : "cursor-default border-transparent opacity-30",
            )}
            aria-label={isOpen ? "Réduire" : "Développer"}
          >
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                isOpen && "rotate-90",
              )}
            />
          </button>

          <div
            className={cn(
              "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg",
              node.flags.sensitive
                ? "bg-orange-500/15 text-orange-600"
                : node.flags.isRoot
                  ? "bg-violet-500/15 text-violet-600"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="truncate text-sm font-semibold">{node.Name}</p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">
                {node.FullName}
              </p>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3 w-3" />
                niv. {node.Depth}
              </span>
              <span className="inline-flex items-center gap-1">
                <Files className="h-3 w-3" />
                {node.ItemCount} éléments
              </span>
              {hasChildren && (
                <span className="inline-flex items-center gap-1">
                  <Folder className="h-3 w-3" />
                  {node.directChildrenCount} sous-dossier{node.directChildrenCount > 1 ? "s" : ""}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                Propriétaire ·{" "}
                <span
                  className={cn(
                    "font-mono",
                    node.flags.ownerless
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-foreground",
                  )}
                >
                  {node.Owner || "— (vide)"}
                </span>
              </span>
              {acl.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  · {node.flags.identityCount} identité{node.flags.identityCount > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {node.flags.isRoot && (
                <Badge variant="outline" className="gap-1 border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300">
                  <Star className="h-3 w-3" />
                  Racine
                </Badge>
              )}
              {node.flags.accessDenied && (
                <Badge variant="outline" className="gap-1 border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300">
                  <ShieldX className="h-3 w-3" />
                  Accès refusé
                </Badge>
              )}
              {node.flags.sensitive && (
                <Badge variant="outline" className="gap-1 border-orange-500/40 bg-orange-500/15 text-orange-700 dark:text-orange-300">
                  <ShieldAlert className="h-3 w-3" />
                  Droits sensibles · {node.flags.sensitivityScore}
                </Badge>
              )}
              {node.flags.hasDeny && (
                <Badge variant="outline" className="gap-1 border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300">
                  Deny
                </Badge>
              )}
              {node.flags.hasFullControlExplicit && (
                <Badge variant="outline" className="gap-1 border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300">
                  FullControl explicite
                </Badge>
              )}
              {node.flags.inheritedOnly && (
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                  <GitBranch className="h-3 w-3" />
                  Hérité seulement
                </Badge>
              )}
              {!node.flags.inheritedOnly && node.flags.hasExplicit && (
                <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  ACL explicites
                </Badge>
              )}
              {node.flags.ownerless && (
                <Badge variant="outline" className="gap-1 border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300">
                  <UserX className="h-3 w-3" />
                  Propriétaire anormal
                </Badge>
              )}
            </div>

            {acl.length > 0 && (
              <div className="mt-3 rounded-lg border bg-muted/20 p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Droits NTFS · {grouped.length} identités
                  </p>
                  {grouped.length > ACL_PREVIEW && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => onToggleAcl(node.FullName)}
                    >
                      {aclOpen ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Réduire
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Voir toutes les ACL ({grouped.length})
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {aclToRender.map((g) => (
                    <FilesAclIdentityCard key={g.identity} identity={g.identity} rules={g.rules} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && visibleChildren.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {visibleChildren.map((c) => (
                <FilesFolderNodeCard
                  key={c.FullName}
                  node={c}
                  level={level + 1}
                  expandedPaths={expandedPaths}
                  expandedAclPaths={expandedAclPaths}
                  visiblePaths={visiblePaths}
                  onToggle={onToggle}
                  onToggleAcl={onToggleAcl}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
