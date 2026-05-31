// Contrat backend AutoCore - fs_scan_tree
export type FsAccessRule = {
  Identity: string;
  Rights: string;
  Type: "Allow" | "Deny";
  Inherited: boolean;
};

export type FsFolderEntry = {
  FullName: string;
  Name: string;
  Depth: number;
  ItemCount: number;
  Owner: string;
  Access: FsAccessRule[];
};

export type ScanStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "cancelled"
  | "timeout"
  | null;

export type ScanResult = {
  task_id: number | null;
  status: ScanStatus;
  agent_label?: string;
  scan_type: "fs_scan_tree";
  scanned_at: string | null;
  duration: number | null;
  count: number;
  items: FsFolderEntry[] | null;
  summary?: Record<string, unknown> | null;
  warnings?: string[];
  error?: string | null;
};

// === Front-only enrichments ===
export type FolderNode = FsFolderEntry & {
  children: FolderNode[];
  parentPath: string | null;
  directChildrenCount: number;
  flags: FolderFlags;
};

export type FolderFlags = {
  accessDenied: boolean;
  sensitive: boolean;
  hasFullControlExplicit: boolean;
  hasDeny: boolean;
  inheritedOnly: boolean;
  hasExplicit: boolean;
  ownerless: boolean;
  isRoot: boolean;
  identityCount: number;
  sensitivityScore: number; // 0..100
};
