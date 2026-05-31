import type { FsAccessRule, FsFolderEntry, FolderFlags, FolderNode } from "./types";

const SENSITIVE_OWNERS = ["", "S-1-5-", "Aucun", "Unknown"];

export function computeFlags(entry: FsFolderEntry, isRoot: boolean): FolderFlags {
  const access = entry.Access ?? [];
  const identities = new Set(access.map((a) => a.Identity));
  const hasDeny = access.some((a) => a.Type === "Deny");
  const hasFullControlExplicit = access.some(
    (a) => a.Type === "Allow" && /FullControl/i.test(a.Rights) && !a.Inherited,
  );
  const hasExplicit = access.some((a) => !a.Inherited);
  const inheritedOnly = access.length > 0 && access.every((a) => a.Inherited);
  const ownerless =
    !entry.Owner ||
    SENSITIVE_OWNERS.some((s) => s && entry.Owner.startsWith(s)) ||
    entry.Owner.trim() === "";
  const accessDenied = (entry as unknown as { AccessDenied?: boolean }).AccessDenied === true;

  let score = 0;
  if (hasFullControlExplicit) score += 35;
  if (hasDeny) score += 25;
  if (identities.size > 8) score += 15;
  if (ownerless) score += 15;
  if (accessDenied) score += 30;
  if (hasExplicit && access.length > 6) score += 10;
  score = Math.min(100, score);

  return {
    accessDenied,
    hasDeny,
    hasFullControlExplicit,
    hasExplicit,
    inheritedOnly,
    ownerless,
    isRoot,
    identityCount: identities.size,
    sensitivityScore: score,
    sensitive: score >= 35,
  };
}

/**
 * Construit une vraie arborescence à partir d'une liste plate.
 * Robust to non-contiguous parents (orphans become roots).
 */
export function buildTree(items: FsFolderEntry[]): FolderNode[] {
  const sorted = [...items].sort((a, b) => a.FullName.localeCompare(b.FullName));
  const byPath = new Map<string, FolderNode>();
  const minDepth = sorted.reduce((m, i) => Math.min(m, i.Depth), Infinity);

  for (const entry of sorted) {
    const parentPath = parentOf(entry.FullName);
    const node: FolderNode = {
      ...entry,
      children: [],
      parentPath,
      directChildrenCount: 0,
      flags: computeFlags(entry, entry.Depth === minDepth),
    };
    byPath.set(entry.FullName, node);
  }

  const roots: FolderNode[] = [];
  for (const node of byPath.values()) {
    const parent = node.parentPath ? byPath.get(node.parentPath) : null;
    if (parent) {
      parent.children.push(node);
      parent.directChildrenCount += 1;
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function parentOf(p: string): string | null {
  if (!p) return null;
  // UNC \\server\share\sub  OR  C:\a\b
  const trimmed = p.replace(/[\\/]+$/, "");
  const sep = trimmed.includes("\\") ? "\\" : "/";
  const idx = trimmed.lastIndexOf(sep);
  if (idx <= 1) return null;
  // UNC root \\srv\share has no parent
  if (sep === "\\" && trimmed.startsWith("\\\\")) {
    const parts = trimmed.split("\\").filter(Boolean);
    if (parts.length <= 2) return null;
  }
  return trimmed.slice(0, idx);
}

export function collectAllPaths(nodes: FolderNode[]): string[] {
  const out: string[] = [];
  const walk = (n: FolderNode) => {
    out.push(n.FullName);
    n.children.forEach(walk);
  };
  nodes.forEach(walk);
  return out;
}

export function flattenTree(nodes: FolderNode[]): FolderNode[] {
  const out: FolderNode[] = [];
  const walk = (n: FolderNode) => {
    out.push(n);
    n.children.forEach(walk);
  };
  nodes.forEach(walk);
  return out;
}

export function groupAclByIdentity(access: FsAccessRule[]) {
  const map = new Map<string, FsAccessRule[]>();
  for (const a of access) {
    const arr = map.get(a.Identity) ?? [];
    arr.push(a);
    map.set(a.Identity, arr);
  }
  return Array.from(map.entries()).map(([identity, rules]) => ({ identity, rules }));
}

export function rightsSeverity(rights: string): "critical" | "high" | "medium" | "low" {
  if (/FullControl/i.test(rights)) return "critical";
  if (/Modify|Change|TakeOwnership|ChangePermissions/i.test(rights)) return "high";
  if (/Write|Append|Delete/i.test(rights)) return "medium";
  return "low";
}

export function shortIdentity(id: string) {
  // AUTOCORE\GG-Finance -> GG-Finance ; BUILTIN\Administrators -> Administrators
  const i = id.lastIndexOf("\\");
  return i >= 0 ? id.slice(i + 1) : id;
}

export function identityDomain(id: string) {
  const i = id.indexOf("\\");
  return i >= 0 ? id.slice(0, i) : "";
}
