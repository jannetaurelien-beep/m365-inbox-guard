// ── Security Audit Mock Data ──

export type Severity = 'critical' | 'high' | 'medium' | 'info' | 'healthy';
export type SnapshotStatus = 'ready' | 'pending' | 'refreshing' | 'error';
export type FindingStatus = 'ok' | 'ko' | 'warning' | 'not_audited' | 'partial';

export interface AuditHeader {
  globalScore: number;
  postureLabel: string;
  generatedAt: string;
  computeDuration: string;
  snapshotAge: string;
  snapshotStatus: SnapshotStatus;
  partialData: boolean;
  partialSources: string[];
}

export interface DimensionScore {
  label: string;
  score: number;
  description: string;
}

export interface ActionItem {
  priority: number;
  label: string;
  severity: Severity;
  category: string;
}

export interface Finding {
  id: string;
  title: string;
  count: number;
  severity: Severity;
  summary: string;
  status: FindingStatus;
}

// ── Header
export const auditHeader: AuditHeader = {
  globalScore: 62,
  postureLabel: 'Posture perfectible',
  generatedAt: '2026-03-19T08:30:00Z',
  computeDuration: '4 min 12 s',
  snapshotAge: 'il y a 2 heures',
  snapshotStatus: 'ready',
  partialData: true,
  partialSources: ['Appareils Entra ID', 'SharePoint avancé'],
};

// ── Hero KPIs
export const heroKPIs = [
  { label: 'Signaux critiques', value: 7, color: 'destructive' as const },
  { label: 'Signaux surveillés', value: 23, color: 'warning' as const },
  { label: 'Couverture MFA', value: '78%', color: 'info' as const },
  { label: 'Boîtes analysées', value: 342, color: 'info' as const },
  { label: 'Partages exposés', value: 18, color: 'warning' as const },
];

// ── Executive Summary
export const executiveSummary = [
  "7 comptes administrateurs critiques ne disposent pas de MFA, exposant le tenant à un risque élevé de compromission.",
  "18 éléments SharePoint sont partagés publiquement ou via des liens organisation non restreints.",
  "3 domaines ne possèdent aucune protection DMARC, permettant l'usurpation d'identité par email.",
];

// ── Coverage
export const coverageMetrics = [
  { label: 'MFA', value: 78, target: 100 },
  { label: 'Exchange', value: 92, target: 100 },
  { label: 'Collaboration', value: 65, target: 100 },
  { label: 'Qualité collecte', value: 88, target: 100 },
];

// ── 4 Dimensions
export const dimensionScores: DimensionScore[] = [
  { label: 'Posture', score: 58, description: 'Solidité des configurations de sécurité' },
  { label: 'Exposition', score: 71, description: 'Surface d\'attaque et partages à risque' },
  { label: 'Couverture', score: 75, description: 'Périmètre audité et protections actives' },
  { label: 'Confiance', score: 44, description: 'Fiabilité et fraîcheur des données' },
];

// ── Action Plan
export const actionPlan: ActionItem[] = [
  { priority: 1, label: 'Activer MFA sur 7 admins critiques', severity: 'critical', category: 'Identité' },
  { priority: 2, label: 'Supprimer 18 partages publics SharePoint', severity: 'critical', category: 'Collaboration' },
  { priority: 3, label: 'Configurer DMARC sur 3 domaines', severity: 'high', category: 'DNS' },
  { priority: 4, label: 'Révoquer 5 apps à privilèges élevés', severity: 'high', category: 'Applications' },
  { priority: 5, label: 'Désactiver 42 comptes inactifs 90j+', severity: 'medium', category: 'Identité' },
  { priority: 6, label: 'Supprimer 12 redirections externes', severity: 'medium', category: 'Messagerie' },
  { priority: 7, label: 'Nettoyer 28 invités jamais connectés', severity: 'medium', category: 'Invités' },
  { priority: 8, label: 'Retirer 15 appareils obsolètes 180j+', severity: 'info', category: 'Appareils' },
];

// ═══════════════════════════════════════
// 1. IDENTITÉ ENTRA ID
// ═══════════════════════════════════════
export const identityKPIs = [
  { label: 'Sans MFA', value: 34, severity: 'critical' as Severity },
  { label: 'Admins sans MFA', value: 7, severity: 'critical' as Severity },
  { label: 'Inactifs ≥90j', value: 42, severity: 'high' as Severity },
  { label: 'Rôles privilégiés', value: 12, severity: 'medium' as Severity },
  { label: 'Risques CA', value: 3, severity: 'warning' as Severity },
];

export const identityFindings: Finding[] = [
  { id: 'id-1', title: 'Admins critiques sans MFA', count: 3, severity: 'critical', summary: '3 Global Admins sans aucune protection MFA', status: 'ko' },
  { id: 'id-2', title: 'Admins sans MFA', count: 7, severity: 'critical', summary: '7 comptes avec rôles admin sans MFA activé', status: 'ko' },
  { id: 'id-3', title: 'Utilisateurs sans MFA', count: 34, severity: 'high', summary: '34 utilisateurs actifs sans MFA sur 342 comptes', status: 'ko' },
  { id: 'id-4', title: 'Comptes inactifs', count: 42, severity: 'medium', summary: '42 comptes sans activité depuis plus de 90 jours', status: 'warning' },
  { id: 'id-5', title: 'Comptes jamais connectés', count: 8, severity: 'medium', summary: '8 comptes créés mais jamais utilisés', status: 'warning' },
  { id: 'id-6', title: 'Rôles privilégiés actifs', count: 12, severity: 'medium', summary: '12 attributions de rôles privilégiés permanents', status: 'warning' },
  { id: 'id-7', title: 'Admins inactifs 90j+', count: 2, severity: 'high', summary: '2 comptes admin sans activité récente', status: 'ko' },
  { id: 'id-8', title: 'Configuration tenant', count: 3, severity: 'medium', summary: '3 paramètres tenant non sécurisés', status: 'warning' },
  { id: 'id-9', title: 'Conditional Access', count: 2, severity: 'high', summary: '2 politiques CA manquantes ou mal configurées', status: 'ko' },
];

export const criticalAdmins = [
  { name: 'Jean Dupont', upn: 'j.dupont@contoso.com', role: 'Global Administrator', lastActivity: '2026-03-18', level: 'Critical' },
  { name: 'Marie Martin', upn: 'm.martin@contoso.com', role: 'Global Administrator', lastActivity: '2026-03-17', level: 'Critical' },
  { name: 'Paul Bernard', upn: 'p.bernard@contoso.com', role: 'Global Administrator', lastActivity: '2026-03-10', level: 'Critical' },
];

export const adminsNoMFA = [
  ...criticalAdmins,
  { name: 'Sophie Leroy', upn: 's.leroy@contoso.com', role: 'Exchange Administrator', lastActivity: '2026-03-15', level: 'High' },
  { name: 'Thomas Moreau', upn: 't.moreau@contoso.com', role: 'SharePoint Administrator', lastActivity: '2026-03-12', level: 'High' },
  { name: 'Claire Dubois', upn: 'c.dubois@contoso.com', role: 'User Administrator', lastActivity: '2026-03-14', level: 'Medium' },
  { name: 'Lucas Petit', upn: 'l.petit@contoso.com', role: 'Security Reader', lastActivity: '2026-02-28', level: 'Medium' },
];

export const inactiveAccounts = {
  '30j': 15,
  '60j': 27,
  '90j+': 42,
};

export const privilegedRoles = [
  { role: 'Global Administrator', members: 3, risk: 'critical' as Severity },
  { role: 'Exchange Administrator', members: 2, risk: 'high' as Severity },
  { role: 'SharePoint Administrator', members: 2, risk: 'high' as Severity },
  { role: 'User Administrator', members: 3, risk: 'medium' as Severity },
  { role: 'Security Reader', members: 2, risk: 'info' as Severity },
];

export const tenantConfig = [
  { setting: 'Consentement apps risquées', status: 'ko' as FindingStatus, detail: 'Utilisateurs peuvent consentir à des apps tierces' },
  { setting: 'Enregistrement apps', status: 'ok' as FindingStatus, detail: 'Limité aux administrateurs' },
  { setting: 'Création de tenants', status: 'ok' as FindingStatus, detail: 'Limité aux administrateurs' },
  { setting: 'SSPR activé', status: 'warning' as FindingStatus, detail: 'Activé uniquement pour un groupe pilote' },
  { setting: 'Blocage MSOL PowerShell', status: 'ko' as FindingStatus, detail: 'Non bloqué pour les utilisateurs standards' },
];

export const conditionalAccessPolicies = [
  { name: 'Require MFA for Admins', state: 'Activée', global: true, apps: 'Toutes', grant: 'MFA requis', location: 'Toutes', mfa: true, block: false, device: false },
  { name: 'Block Legacy Auth', state: 'Activée', global: true, apps: 'Toutes', grant: 'Bloquer', location: 'Toutes', mfa: false, block: true, device: false },
  { name: 'Require Compliant Device', state: 'Désactivée', global: false, apps: 'Office 365', grant: 'Device conforme', location: 'Hors réseau', mfa: false, block: false, device: true },
  { name: 'MFA for All Users', state: 'Report only', global: true, apps: 'Toutes', grant: 'MFA requis', location: 'Toutes', mfa: true, block: false, device: false },
];

export const caOverview = {
  securityDefaults: false,
  mfaForAll: false,
  legacyAuthBlocked: true,
  deviceBound: false,
  locationRestricted: false,
};

// ═══════════════════════════════════════
// 2. MESSAGERIE EXCHANGE ONLINE
// ═══════════════════════════════════════
export const messagingKPIs = [
  { label: 'Boîtes vérifiées', value: 342, severity: 'info' as Severity },
  { label: 'Forwardings ext.', value: 12, severity: 'high' as Severity },
  { label: 'Règles suspectes', value: 5, severity: 'critical' as Severity },
  { label: 'Parc licencié', value: 380, severity: 'info' as Severity },
  { label: 'Protections manq.', value: 3, severity: 'medium' as Severity },
];

export const messagingFindings: Finding[] = [
  { id: 'msg-1', title: 'Redirections externes', count: 12, severity: 'high', summary: '12 boîtes redirigent vers des adresses externes', status: 'ko' },
  { id: 'msg-2', title: 'Règles de boîte suspectes', count: 5, severity: 'critical', summary: '5 règles redirigent ou suppriment des emails silencieusement', status: 'ko' },
  { id: 'msg-3', title: 'Réponses auto externes', count: 8, severity: 'medium', summary: '8 boîtes avec réponse automatique vers l\'extérieur', status: 'warning' },
  { id: 'msg-4', title: 'Config Defender / Exchange', count: 3, severity: 'medium', summary: '3 protections mail non configurées optimalement', status: 'warning' },
];

export const forwardingRules = [
  { user: 'Alice Renard', upn: 'a.renard@contoso.com', forwardTo: 'alice@gmail.com', localCopy: false },
  { user: 'Bruno Garnier', upn: 'b.garnier@contoso.com', forwardTo: 'bruno.perso@outlook.com', localCopy: true },
  { user: 'Camille Faure', upn: 'c.faure@contoso.com', forwardTo: 'camille@yahoo.fr', localCopy: false },
  { user: 'David Mercier', upn: 'd.mercier@contoso.com', forwardTo: 'david.ext@partner.com', localCopy: true },
];

export const suspiciousRules = [
  { user: 'Alice Renard', ruleName: 'Auto-forward invoices', externalAddresses: ['finance@ext-company.com'] },
  { user: 'Etienne Blanc', ruleName: 'Move & Delete', externalAddresses: ['e.blanc.backup@proton.me'] },
  { user: 'François Girard', ruleName: 'Silent redirect', externalAddresses: ['f.girard@competitor.com', 'backup@anon.io'] },
];

export const autoReplies = [
  { user: 'Hélène Roux', upn: 'h.roux@contoso.com', state: 'Activée', audience: 'Externe' },
  { user: 'Igor Lemoine', upn: 'i.lemoine@contoso.com', state: 'Activée', audience: 'Tous' },
  { user: 'Julie Perrin', upn: 'j.perrin@contoso.com', state: 'Planifiée', audience: 'Externe' },
];

export const defenderControls = {
  antiPhishing: { enabled: true, spoofIntel: true, mailboxIntel: true, mailboxIntelProtection: false, dmarcRespect: true, phishThreshold: 2, firstContactTips: false, viaTag: true },
  safeLinks: { enabled: true, emailProtection: true, realTimeScan: true, blockClickThrough: false, teamsProtection: true, officeProtection: false, clickTracking: true },
  safeAttachments: { enabled: true, action: 'DynamicDelivery', errorAction: 'Block' },
  outboundSpam: { autoForwardingBlocked: true, mode: 'Off' },
};

// ═══════════════════════════════════════
// 3. APPLICATIONS ET CONSENTEMENTS
// ═══════════════════════════════════════
export const appsKPIs = [
  { label: 'Apps scannées', value: 156, severity: 'info' as Severity },
  { label: 'Privilèges élevés', value: 5, severity: 'critical' as Severity },
  { label: 'Rôles annuaire', value: 3, severity: 'high' as Severity },
  { label: 'Consentements larges', value: 8, severity: 'high' as Severity },
  { label: 'Ownership gaps', value: 12, severity: 'medium' as Severity },
];

export const appsFindings: Finding[] = [
  { id: 'app-1', title: 'Apps à privilèges élevés', count: 5, severity: 'critical', summary: '5 applications avec des permissions dangereuses (Mail.ReadWrite, Directory.ReadWrite)', status: 'ko' },
  { id: 'app-2', title: 'Ownership insuffisant', count: 12, severity: 'medium', summary: '12 applications sans propriétaire identifié ou avec un seul propriétaire', status: 'warning' },
  { id: 'app-3', title: 'Secrets et certificats à risque', count: 7, severity: 'high', summary: '7 credentials expirés ou expirant sous 30 jours', status: 'ko' },
];

export const sensitiveApps = [
  { name: 'Legacy Sync Tool', governance: 'Non géré', exposure: 'Critique', permissions: ['Directory.ReadWrite.All', 'Mail.ReadWrite'], owners: 0, directoryRoles: 2, verified: false, disabled: false },
  { name: 'HR Connector', governance: 'Tenant-owned', exposure: 'Élevée', permissions: ['User.ReadWrite.All', 'Group.ReadWrite.All'], owners: 1, directoryRoles: 1, verified: true, disabled: false },
  { name: 'Marketing Bot', governance: 'Tiers', exposure: 'Élevée', permissions: ['Mail.Send', 'Calendars.ReadWrite'], owners: 0, directoryRoles: 0, verified: false, disabled: false },
  { name: 'Old Migration App', governance: 'Non géré', exposure: 'Critique', permissions: ['Directory.ReadWrite.All', 'Sites.FullControl.All'], owners: 0, directoryRoles: 1, verified: false, disabled: true },
  { name: 'CRM Integration', governance: 'Tiers', exposure: 'Moyenne', permissions: ['User.Read.All', 'Contacts.ReadWrite'], owners: 2, directoryRoles: 0, verified: true, disabled: false },
];

export const appCredentials = [
  { app: 'Legacy Sync Tool', type: 'Secret', expiry: '2026-02-15', daysLeft: -32, expired: true },
  { app: 'HR Connector', type: 'Certificat', expiry: '2026-04-01', daysLeft: 13, expired: false },
  { app: 'Marketing Bot', type: 'Secret', expiry: '2026-03-25', daysLeft: 6, expired: false },
  { app: 'Old Migration App', type: 'Secret', expiry: '2025-12-01', daysLeft: -108, expired: true },
  { app: 'Backup Service', type: 'Certificat', expiry: '2026-03-22', daysLeft: 3, expired: false },
];

// ═══════════════════════════════════════
// 4. COLLABORATION SHAREPOINT
// ═══════════════════════════════════════
export const collaborationKPIs = [
  { label: 'Sites scannés', value: 45, severity: 'info' as Severity },
  { label: 'Liens publics', value: 8, severity: 'critical' as Severity },
  { label: 'Liens organisation', value: 14, severity: 'high' as Severity },
  { label: 'Accès externes', value: 6, severity: 'medium' as Severity },
  { label: 'Items scannés', value: 1248, severity: 'info' as Severity },
];

export const collaborationFindings: Finding[] = [
  { id: 'sp-1', title: 'Liens publics et partages larges', count: 8, severity: 'critical', summary: '8 éléments accessibles via un lien public sans restriction', status: 'ko' },
  { id: 'sp-2', title: 'Accès externes explicites', count: 6, severity: 'medium', summary: '6 éléments partagés avec des utilisateurs externes identifiés', status: 'warning' },
  { id: 'sp-3', title: 'Sites les plus exposés', count: 3, severity: 'high', summary: '3 sites concentrent 80% des partages à risque', status: 'ko' },
];

export const exposedItems = [
  { name: 'Budget 2026.xlsx', site: 'Finance', exposure: 'Lien public', access: 'Lecture', publicLinks: 2, orgLinks: 0, externals: 0, role: 'Read', drive: 'Documents' },
  { name: 'Plan stratégique.pptx', site: 'Direction', exposure: 'Organisation', access: 'Modification', publicLinks: 0, orgLinks: 3, externals: 1, role: 'Write', drive: 'Présentations' },
  { name: 'Contrats fournisseurs/', site: 'Achats', exposure: 'Lien public', access: 'Lecture', publicLinks: 1, orgLinks: 2, externals: 2, role: 'Read', drive: 'Contrats' },
  { name: 'RH - Salaires.xlsx', site: 'RH', exposure: 'Organisation', access: 'Lecture', publicLinks: 0, orgLinks: 1, externals: 0, role: 'Read', drive: 'Confidentiel' },
];

export const exposedSites = [
  { name: 'Finance', url: 'https://contoso.sharepoint.com/sites/finance', score: 85, drives: 4, items: 312, exposed: 5, publicLinks: 3, orgLinks: 4, externals: 2 },
  { name: 'Direction', url: 'https://contoso.sharepoint.com/sites/direction', score: 72, drives: 2, items: 156, exposed: 3, publicLinks: 1, orgLinks: 3, externals: 1 },
  { name: 'RH', url: 'https://contoso.sharepoint.com/sites/rh', score: 45, drives: 3, items: 234, exposed: 2, publicLinks: 0, orgLinks: 1, externals: 0 },
];

// ═══════════════════════════════════════
// 5. SÉCURITÉ DNS
// ═══════════════════════════════════════
export const dnsKPIs = [
  { label: 'Domaines analysés', value: 5, severity: 'info' as Severity },
  { label: 'Sans DMARC', value: 3, severity: 'critical' as Severity },
  { label: 'Sans SPF', value: 1, severity: 'high' as Severity },
  { label: 'Sans DKIM', value: 2, severity: 'medium' as Severity },
];

export const dnsFindings: Finding[] = [
  { id: 'dns-1', title: 'État DNS par domaine', count: 3, severity: 'critical', summary: '3 domaines sans protection DMARC permettant l\'usurpation', status: 'ko' },
];

export const dnsDomains = [
  { domain: 'contoso.com', spf: 'ok' as FindingStatus, dkim: 'ok' as FindingStatus, dmarc: 'ok' as FindingStatus, dmarcPolicy: 'reject', risk: 'healthy' as Severity, spfHardFail: true, dkimSelectors: true },
  { domain: 'contoso.fr', spf: 'ok' as FindingStatus, dkim: 'ok' as FindingStatus, dmarc: 'ko' as FindingStatus, dmarcPolicy: 'none', risk: 'high' as Severity, spfHardFail: true, dkimSelectors: true },
  { domain: 'contoso-legacy.com', spf: 'ko' as FindingStatus, dkim: 'ko' as FindingStatus, dmarc: 'ko' as FindingStatus, dmarcPolicy: 'none', risk: 'critical' as Severity, spfHardFail: false, dkimSelectors: false },
  { domain: 'marketing-contoso.com', spf: 'ok' as FindingStatus, dkim: 'warning' as FindingStatus, dmarc: 'ko' as FindingStatus, dmarcPolicy: 'none', risk: 'high' as Severity, spfHardFail: false, dkimSelectors: false },
  { domain: 'contoso.eu', spf: 'ok' as FindingStatus, dkim: 'ok' as FindingStatus, dmarc: 'ok' as FindingStatus, dmarcPolicy: 'quarantine', risk: 'medium' as Severity, spfHardFail: true, dkimSelectors: true },
];

// ═══════════════════════════════════════
// 6. INVITÉS B2B
// ═══════════════════════════════════════
export const guestsKPIs = [
  { label: 'Total invités', value: 67, severity: 'info' as Severity },
  { label: 'Inactifs 90j+', value: 28, severity: 'high' as Severity },
  { label: 'Jamais connectés', value: 15, severity: 'medium' as Severity },
  { label: 'Avec licence', value: 4, severity: 'warning' as Severity },
];

export const guestsFindings: Finding[] = [
  { id: 'guest-1', title: 'Invités inactifs ou jamais connectés', count: 43, severity: 'high', summary: '43 comptes invités sans activité récente ou jamais utilisés', status: 'ko' },
];

export const guestUsers = [
  { name: 'External Partner A', email: 'partner.a@external.com', lastLogin: '2025-11-15', daysInactive: 124, license: 'E3', state: 'Inactif' },
  { name: 'Consultant B', email: 'consultant.b@advisory.com', lastLogin: null, daysInactive: null, license: null, state: 'Jamais connecté' },
  { name: 'Vendor C', email: 'vendor.c@supplier.com', lastLogin: '2026-01-05', daysInactive: 73, license: null, state: 'Inactif' },
  { name: 'Auditor D', email: 'auditor.d@audit-firm.com', lastLogin: '2026-03-18', daysInactive: 1, license: 'E1', state: 'Actif' },
  { name: 'Former Employee E', email: 'former.e@contoso.com', lastLogin: null, daysInactive: null, license: 'E3', state: 'Jamais connecté' },
];

export const guestSettings = {
  invitationSource: 'Admins et membres',
  emailVerifiedAllowed: true,
};

// ═══════════════════════════════════════
// 7. APPAREILS ENTRA ID
// ═══════════════════════════════════════
export const devicesKPIs = [
  { label: 'Total appareils', value: 234, severity: 'info' as Severity },
  { label: 'Non gérés', value: 45, severity: 'high' as Severity },
  { label: 'Non conformes', value: 18, severity: 'critical' as Severity },
  { label: 'Inactifs 180j+', value: 15, severity: 'medium' as Severity },
];

export const devicesFindings: Finding[] = [
  { id: 'dev-1', title: 'Appareils obsolètes 180j+', count: 15, severity: 'medium', summary: '15 appareils sans activité depuis plus de 6 mois', status: 'warning' },
];

export const deviceQuickCards = {
  managed: { value: 189, total: 234, pct: 81 },
  compliant: { value: 171, total: 189, pct: 90 },
  stale90: { value: 32, total: 234, pct: 14 },
};

export const deviceList = [
  { name: 'DESKTOP-PC01', os: 'Windows 11', management: 'Intune', compliance: 'Conforme', lastActivity: '2026-03-18', daysInactive: 1 },
  { name: 'MACBOOK-USER02', os: 'macOS 14', management: 'Intune', compliance: 'Non conforme', lastActivity: '2026-03-10', daysInactive: 9 },
  { name: 'IPHONE-USER03', os: 'iOS 17', management: 'Non géré', compliance: 'N/A', lastActivity: '2025-09-01', daysInactive: 199 },
  { name: 'ANDROID-USER04', os: 'Android 14', management: 'Intune', compliance: 'Conforme', lastActivity: '2026-03-17', daysInactive: 2 },
  { name: 'DESKTOP-OLD05', os: 'Windows 10', management: 'Non géré', compliance: 'N/A', lastActivity: null, daysInactive: null },
];

// ═══════════════════════════════════════
// 8. HYGIÈNE EXCHANGE / EOP
// ═══════════════════════════════════════
export const hygieneKPIs = [
  { label: 'UAL', value: 'Activé', severity: 'healthy' as Severity },
  { label: 'SMTP AUTH actif', value: 12, severity: 'high' as Severity },
  { label: 'Transport rules', value: 3, severity: 'medium' as Severity },
  { label: 'Wildcard forward', value: 1, severity: 'critical' as Severity },
];

export const hygieneFindings: Finding[] = [
  { id: 'hyg-1', title: 'Transport rules à risque', count: 3, severity: 'medium', summary: '3 règles de transport avec bypass spam ou BCC caché', status: 'warning' },
  { id: 'hyg-2', title: 'Wildcard remote domain autoforward', count: 1, severity: 'critical', summary: 'Le domaine wildcard (*) autorise l\'auto-forwarding externe', status: 'ko' },
  { id: 'hyg-3', title: 'IP allow list EOP', count: 2, severity: 'medium', summary: '2 adresses IP dans la liste blanche EOP à vérifier', status: 'warning' },
  { id: 'hyg-4', title: 'Authentifications legacy', count: 14, severity: 'high', summary: '14 utilisateurs avec des connexions via des clients legacy', status: 'ko' },
];

export const ualStatus = { enabled: true, available: true };
export const smtpAuth = { enabled: 12, disabled: 330, total: 342 };

export const transportRules = [
  { name: 'External Disclaimer', state: 'Activée', priority: 1, bypassSpam: false, hiddenBcc: false, redirect: false },
  { name: 'CEO Auto-Forward', state: 'Activée', priority: 2, bypassSpam: true, hiddenBcc: false, redirect: true },
  { name: 'Archive BCC Rule', state: 'Activée', priority: 3, bypassSpam: false, hiddenBcc: true, redirect: false },
];

export const legacyAuth = {
  users: 14,
  events: 342,
  clients: ['IMAP', 'POP3', 'SMTP AUTH', 'Exchange ActiveSync'],
  details: [
    { user: 'Pierre Lefèvre', upn: 'p.lefevre@contoso.com', client: 'IMAP', caStatus: 'Non bloqué', occurrences: 87 },
    { user: 'Nathalie Simon', upn: 'n.simon@contoso.com', client: 'POP3', caStatus: 'Non bloqué', occurrences: 56 },
    { user: 'Olivier Laurent', upn: 'o.laurent@contoso.com', client: 'SMTP AUTH', caStatus: 'Bloqué CA', occurrences: 12 },
    { user: 'Rachel Fournier', upn: 'r.fournier@contoso.com', client: 'Exchange ActiveSync', caStatus: 'Non bloqué', occurrences: 143 },
  ],
};
