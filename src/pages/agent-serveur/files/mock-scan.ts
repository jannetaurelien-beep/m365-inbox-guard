import type { ScanResult } from "./types";

// Mock conforme au contrat backend fs_scan_tree.
// À remplacer par l'appel réel: GET /api/agent/scan/fs_scan_tree/latest/
export const mockScanResult: ScanResult = {
  task_id: 4287,
  status: "success",
  agent_label: "SRV-FILE01",
  scan_type: "fs_scan_tree",
  scanned_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  duration: 42,
  count: 14,
  warnings: [],
  error: null,
  items: [
    {
      FullName: "\\\\SRV-FILE01\\Partage",
      Name: "Partage",
      Depth: 0,
      ItemCount: 5,
      Owner: "BUILTIN\\Administrators",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\Domain Admins", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "NT AUTHORITY\\SYSTEM", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\Domain Users", Rights: "ReadAndExecute", Type: "Allow", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\Finance",
      Name: "Finance",
      Depth: 1,
      ItemCount: 124,
      Owner: "AUTOCORE\\Domain Admins",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: true },
        { Identity: "AUTOCORE\\GG-Finance", Rights: "Modify", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\GG-DirFinance", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\Stagiaires", Rights: "Write", Type: "Deny", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\Finance\\Confidentiel",
      Name: "Confidentiel",
      Depth: 2,
      ItemCount: 42,
      Owner: "AUTOCORE\\GG-DirFinance",
      Access: [
        { Identity: "AUTOCORE\\GG-DirFinance", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\GG-Finance", Rights: "ReadAndExecute", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\Domain Users", Rights: "ReadAndExecute", Type: "Deny", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\Finance\\Public",
      Name: "Public",
      Depth: 2,
      ItemCount: 8,
      Owner: "AUTOCORE\\GG-Finance",
      Access: [
        { Identity: "AUTOCORE\\GG-Finance", Rights: "Modify", Type: "Allow", Inherited: true },
        { Identity: "AUTOCORE\\Domain Users", Rights: "ReadAndExecute", Type: "Allow", Inherited: true },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\RH",
      Name: "RH",
      Depth: 1,
      ItemCount: 67,
      Owner: "AUTOCORE\\GG-RH",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: true },
        { Identity: "AUTOCORE\\GG-RH", Rights: "Modify", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\Tout le monde", Rights: "ReadAndExecute", Type: "Allow", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\RH\\Paie",
      Name: "Paie",
      Depth: 2,
      ItemCount: 22,
      Owner: "",
      Access: [
        { Identity: "AUTOCORE\\GG-RH-Paie", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\GG-RH", Rights: "ReadAndExecute", Type: "Allow", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\IT",
      Name: "IT",
      Depth: 1,
      ItemCount: 312,
      Owner: "AUTOCORE\\GG-IT",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: true },
        { Identity: "AUTOCORE\\GG-IT", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\GG-Support", Rights: "Modify", Type: "Allow", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\IT\\Scripts",
      Name: "Scripts",
      Depth: 2,
      ItemCount: 48,
      Owner: "AUTOCORE\\GG-IT",
      Access: [
        { Identity: "AUTOCORE\\GG-IT", Rights: "FullControl", Type: "Allow", Inherited: true },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\IT\\Backups",
      Name: "Backups",
      Depth: 2,
      ItemCount: 12,
      Owner: "AUTOCORE\\GG-IT",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: true },
        { Identity: "AUTOCORE\\GG-IT", Rights: "FullControl", Type: "Allow", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\Public",
      Name: "Public",
      Depth: 1,
      ItemCount: 18,
      Owner: "BUILTIN\\Administrators",
      Access: [
        { Identity: "AUTOCORE\\Domain Users", Rights: "Modify", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\Tout le monde", Rights: "ReadAndExecute", Type: "Allow", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\Archives",
      Name: "Archives",
      Depth: 1,
      ItemCount: 1024,
      Owner: "AUTOCORE\\Domain Admins",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\GG-Archives", Rights: "ReadAndExecute", Type: "Allow", Inherited: false },
        { Identity: "AUTOCORE\\Stagiaires", Rights: "ReadAndExecute", Type: "Deny", Inherited: false },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\Archives\\2023",
      Name: "2023",
      Depth: 2,
      ItemCount: 512,
      Owner: "AUTOCORE\\Domain Admins",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: true },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\Archives\\2024",
      Name: "2024",
      Depth: 2,
      ItemCount: 488,
      Owner: "AUTOCORE\\Domain Admins",
      Access: [
        { Identity: "BUILTIN\\Administrators", Rights: "FullControl", Type: "Allow", Inherited: true },
      ],
    },
    {
      FullName: "\\\\SRV-FILE01\\Partage\\_RESTRICTED",
      Name: "_RESTRICTED",
      Depth: 1,
      ItemCount: 0,
      Owner: "",
      Access: [],
    },
  ],
  summary: null,
};
