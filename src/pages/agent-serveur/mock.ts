export const mockAgents = [
  { id: "ag-01", hostname: "SRV-DC01", ip: "10.0.0.10", domain: "autocore.local", role: "Contrôleur principal", os: "Windows Server 2022 (21H2)", status: "online" as const, lastBeat: "il y a 12s", version: "1.4.2", service: "AutoCoreAgent" },
  { id: "ag-02", hostname: "SRV-DC02", ip: "10.0.0.11", domain: "autocore.local", role: "Contrôleur secondaire", os: "Windows Server 2022 (21H2)", status: "online" as const, lastBeat: "il y a 8s", version: "1.4.2", service: "AutoCoreAgent" },
  { id: "ag-03", hostname: "SRV-FILE01", ip: "10.0.0.20", domain: "autocore.local", role: "Serveur membre", os: "Windows Server 2019", status: "online" as const, lastBeat: "il y a 22s", version: "1.4.1", service: "AutoCoreAgent" },
  { id: "ag-04", hostname: "SRV-DHCP01", ip: "10.0.0.30", domain: "autocore.local", role: "Serveur membre", os: "Windows Server 2019", status: "warning" as const, lastBeat: "il y a 1m", version: "1.4.0", service: "AutoCoreAgent" },
  { id: "ag-05", hostname: "SRV-APP02", ip: "10.0.0.45", domain: "autocore.local", role: "Serveur membre", os: "Windows Server 2016", status: "offline" as const, lastBeat: "il y a 2h", version: "1.3.8", service: "AutoCoreAgent" },
  { id: "ag-06", hostname: "WKS-ADM01", ip: "10.0.1.5", domain: "autocore.local", role: "Poste", os: "Windows 11 Pro", status: "paused" as const, lastBeat: "il y a 5m", version: "1.4.2", service: "AutoCoreAgent" },
];

export const mockAdUsers = [
  { sam: "jdupont", display: "Jean Dupont", upn: "jdupont@autocore.local", dept: "Finance", title: "Comptable", enabled: true, lastLogon: "2026-05-30" },
  { sam: "amartin", display: "Alice Martin", upn: "amartin@autocore.local", dept: "RH", title: "Responsable RH", enabled: true, lastLogon: "2026-05-31" },
  { sam: "pdurand", display: "Pierre Durand", upn: "pdurand@autocore.local", dept: "IT", title: "Admin Système", enabled: true, lastLogon: "2026-05-31" },
  { sam: "scoste", display: "Sophie Coste", upn: "scoste@autocore.local", dept: "Commercial", title: "Directrice", enabled: false, lastLogon: "2026-04-12" },
  { sam: "mleroux", display: "Marc Leroux", upn: "mleroux@autocore.local", dept: "IT", title: "Technicien", enabled: true, lastLogon: "2026-05-29" },
];

export const mockAdGroups = [
  { name: "Domain Admins", sam: "Domain Admins", scope: "Global", category: "Security", members: 4, description: "Administrateurs du domaine" },
  { name: "GG-Finance", sam: "GG-Finance", scope: "Global", category: "Security", members: 18, description: "Équipe Finance" },
  { name: "GG-IT", sam: "GG-IT", scope: "Global", category: "Security", members: 7, description: "Équipe IT" },
  { name: "GG-RH", sam: "GG-RH", scope: "Global", category: "Security", members: 5, description: "Équipe RH" },
  { name: "GG-Sales", sam: "GG-Sales", scope: "Universal", category: "Security", members: 22, description: "Équipe commerciale" },
];

export const mockComputers = [
  { name: "SRV-DC01", os: "Windows Server 2022", ip: "10.0.0.10", enabled: true, lastLogon: "2026-05-31" },
  { name: "SRV-DC02", os: "Windows Server 2022", ip: "10.0.0.11", enabled: true, lastLogon: "2026-05-31" },
  { name: "SRV-FILE01", os: "Windows Server 2019", ip: "10.0.0.20", enabled: true, lastLogon: "2026-05-31" },
  { name: "WKS-001", os: "Windows 11 Pro", ip: "10.0.1.1", enabled: true, lastLogon: "2026-05-30" },
  { name: "WKS-002", os: "Windows 11 Pro", ip: "10.0.1.2", enabled: true, lastLogon: "2026-05-29" },
  { name: "WKS-LEGACY", os: "Windows 10 Pro", ip: "10.0.1.99", enabled: false, lastLogon: "2025-12-15" },
];

export const mockOUs = [
  { name: "Utilisateurs", dn: "OU=Utilisateurs,DC=autocore,DC=local", children: 4 },
  { name: "IT", dn: "OU=IT,OU=Utilisateurs,DC=autocore,DC=local", children: 0 },
  { name: "Finance", dn: "OU=Finance,OU=Utilisateurs,DC=autocore,DC=local", children: 0 },
  { name: "Serveurs", dn: "OU=Serveurs,DC=autocore,DC=local", children: 2 },
  { name: "Postes", dn: "OU=Postes,DC=autocore,DC=local", children: 0 },
];

export const mockGPOs = [
  { name: "Default Domain Policy", status: "AllSettingsEnabled", modified: "2026-03-12" },
  { name: "GPO - Verrouillage Session", status: "AllSettingsEnabled", modified: "2026-05-02" },
  { name: "GPO - Lecteurs Réseau", status: "AllSettingsEnabled", modified: "2026-04-18" },
  { name: "GPO - Pare-feu", status: "UserSettingsDisabled", modified: "2026-02-09" },
];

export const mockDnsZones = [
  { name: "autocore.local", type: "Forward", records: 142, status: "active" },
  { name: "10.in-addr.arpa", type: "Reverse", records: 87, status: "active" },
  { name: "mail.autocore.local", type: "Forward", records: 12, status: "active" },
];

export const mockDnsRecords = [
  { name: "@", type: "A", value: "10.0.0.10", ttl: 3600 },
  { name: "dc01", type: "A", value: "10.0.0.10", ttl: 3600 },
  { name: "dc02", type: "A", value: "10.0.0.11", ttl: 3600 },
  { name: "mail", type: "CNAME", value: "srv-mail.autocore.local", ttl: 3600 },
  { name: "@", type: "MX", value: "10 mail.autocore.local", ttl: 3600 },
];

export const mockDhcpScopes = [
  { id: "10.0.1.0", name: "Postes utilisateurs", range: "10.0.1.10 - 10.0.1.254", mask: "255.255.255.0", active: true, leases: 87, total: 244 },
  { id: "10.0.2.0", name: "Téléphonie IP", range: "10.0.2.10 - 10.0.2.200", mask: "255.255.255.0", active: true, leases: 42, total: 190 },
  { id: "10.0.3.0", name: "Imprimantes", range: "10.0.3.10 - 10.0.3.100", mask: "255.255.255.0", active: false, leases: 12, total: 90 },
];

export const mockLeases = [
  { ip: "10.0.1.42", mac: "00:1A:2B:3C:4D:5E", hostname: "WKS-042", expires: "2026-06-02" },
  { ip: "10.0.1.43", mac: "00:1A:2B:3C:4D:5F", hostname: "WKS-043", expires: "2026-06-02" },
  { ip: "10.0.1.44", mac: "00:1A:2B:3C:4D:60", hostname: "WKS-044", expires: "2026-06-01" },
];

export const mockServices = [
  { name: "DNS", display: "Serveur DNS", status: "Running", startType: "Automatic" },
  { name: "DHCPServer", display: "Serveur DHCP", status: "Running", startType: "Automatic" },
  { name: "NTDS", display: "Services AD DS", status: "Running", startType: "Automatic" },
  { name: "Spooler", display: "Spouleur d'impression", status: "Stopped", startType: "Disabled" },
  { name: "W32Time", display: "Temps Windows", status: "Running", startType: "Automatic" },
];

export const mockEvents = [
  { id: 4625, level: "Error", source: "Security", time: "10:42", message: "Échec d'authentification pour utilisateur 'admin'" },
  { id: 1074, level: "Info", source: "System", time: "09:15", message: "Arrêt initié par utilisateur SYSTEM" },
  { id: 7036, level: "Info", source: "Service Control Manager", time: "08:02", message: "Le service Spouleur est entré dans l'état arrêté" },
  { id: 36887, level: "Warning", source: "Schannel", time: "07:48", message: "Une alerte fatale a été reçue (40)" },
];

export const mockTasks = [
  { id: "t-1", type: "Scan AD", status: "success", agent: "SRV-DC01", started: "10:42", duration: "42s" },
  { id: "t-2", type: "Scan Fichiers", status: "running", agent: "SRV-FILE01", started: "10:38", duration: "2m" },
  { id: "t-3", type: "Fichiers", status: "success", agent: "SRV-FILE01", started: "10:30", duration: "8s" },
  { id: "t-4", type: "Autre", status: "failed", agent: "SRV-DHCP01", started: "10:12", duration: "30s" },
  { id: "t-5", type: "Scan AD", status: "timeout", agent: "SRV-DC02", started: "09:48", duration: "180s" },
  { id: "t-6", type: "Fichiers", status: "success", agent: "SRV-FILE01", started: "09:42", duration: "3s" },
  { id: "t-7", type: "Autre", status: "cancelled", agent: "SRV-APP02", started: "09:21", duration: "12s" },
  { id: "t-8", type: "Scan Fichiers", status: "pending", agent: "SRV-FILE01", started: "—", duration: "—" },
];
