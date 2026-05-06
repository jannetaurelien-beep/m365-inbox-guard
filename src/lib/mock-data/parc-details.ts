export type ParcCategorie = 'serveur' | 'poste' | 'mobile' | 'telephonie' | 'alarme' | 'reseau' | 'lien-internet' | 'imprimante' | 'videosurveillance' | 'autre';

export interface DiskInfo {
  nom: string;
  type: 'SSD' | 'HDD' | 'NVMe' | 'RAID';
  totalGo: number;
  libreGo: number;
  sante: 'OK' | 'Avertissement' | 'Critique';
}

export interface BackupInfo {
  connectee: boolean;
  destination?: string;
  dernierSucces?: string;
  retention?: string;
  frequence?: string;
  tailleGo?: number;
}

export interface UpdateInfo {
  aJour: boolean;
  dernierePatch?: string;
  patchsManquants?: number;
  versionOS?: string;
  politique?: string;
}

export interface WarrantyInfo {
  debut: string;
  fin: string;
  niveau: string;
}

export interface LienInfo {
  debit: string;
  sla: string;
  uptime: number;
  latence: number;
  bandwidth24h: { h: string; down: number; up: number }[];
  latence24h: { h: string; ms: number }[];
}

export interface SpecsInfo {
  cpu?: string;
  ramGo?: number;
  gpu?: string;
  batterie?: number;
}

export interface TelephonieInfo { lignes?: number; postes?: number; ipbx?: string; operateur?: string; }
export interface VideoInfo { cameras?: number; retentionJours?: number; stockageNVR?: string; cloud?: boolean; }
export interface AlarmeInfo { centrale?: string; detecteurs?: number; telesurveillance?: string; dernierTest?: string; }
export interface ImpressionInfo { pagesImprimees?: number; tonerPct?: number; coutPage?: string; }

export interface EnrichedDevice {
  id: string;
  nom: string;
  categorie: ParcCategorie;
  utilisateur?: string;
  os: string;
  modele: string;
  numeroSerie: string;
  status: 'actif' | 'maintenance' | 'hors-service';
  dernierVu: string;
  agence: string;
  fournisseur?: string;
  contrat?: string;
  garantie?: WarrantyInfo;
  miseAJour?: UpdateInfo;
  stockage?: DiskInfo[];
  sauvegarde?: BackupInfo;
  lien?: LienInfo;
  specs?: SpecsInfo;
  telephonie?: TelephonieInfo;
  videosurveillance?: VideoInfo;
  alarme?: AlarmeInfo;
  impression?: ImpressionInfo;
}

const gen24h = (base: number, variance: number) =>
  Array.from({ length: 24 }, (_, h) => ({
    h: `${h}h`,
    v: Math.max(0, Math.round(base + (Math.sin(h / 3) + Math.random() - 0.5) * variance)),
  }));

const bwSeries = (downBase: number, upBase: number) => {
  const d = gen24h(downBase, downBase * 0.4);
  const u = gen24h(upBase, upBase * 0.4);
  return d.map((p, i) => ({ h: p.h, down: p.v, up: u[i].v }));
};
const latSeries = (base: number) =>
  gen24h(base, base * 0.3).map(p => ({ h: p.h, ms: p.v }));

export const enrichedParc: EnrichedDevice[] = [
  {
    id: 'd1', nom: 'PC-MARIE-01', categorie: 'poste', utilisateur: 'Marie Dubois',
    os: 'Windows 11 Pro 23H2', modele: 'Dell XPS 15 9530', numeroSerie: 'SN-DXP15-001',
    status: 'actif', dernierVu: 'il y a 2 min', agence: 'Paris', fournisseur: 'Dell',
    contrat: 'ProSupport NBD',
    garantie: { debut: '2024-01-15', fin: '2027-01-15', niveau: 'ProSupport NBD' },
    miseAJour: { aJour: true, dernierePatch: '2026-04-28', patchsManquants: 0, versionOS: '23H2 build 22631.3447', politique: 'WSUS · auto' },
    specs: { cpu: 'Intel Core i7-13700H', ramGo: 32, gpu: 'NVIDIA RTX 4050', batterie: 87 },
    stockage: [
      { nom: 'C:', type: 'NVMe', totalGo: 1000, libreGo: 412, sante: 'OK' },
    ],
  },
  {
    id: 'd2', nom: 'PC-THOMAS-02', categorie: 'poste', utilisateur: 'Thomas Bernard',
    os: 'Windows 11 Pro 23H2', modele: 'HP EliteBook 845 G10', numeroSerie: 'SN-HP-EB-042',
    status: 'actif', dernierVu: 'il y a 12 min', agence: 'Lyon', fournisseur: 'HP',
    garantie: { debut: '2023-06-10', fin: '2026-06-10', niveau: 'HP CarePack 3 ans' },
    miseAJour: { aJour: false, dernierePatch: '2026-03-12', patchsManquants: 4, versionOS: '23H2 build 22631.3296', politique: 'WSUS · auto' },
    specs: { cpu: 'AMD Ryzen 7 PRO 7840U', ramGo: 16, batterie: 64 },
    stockage: [{ nom: 'C:', type: 'NVMe', totalGo: 512, libreGo: 78, sante: 'Avertissement' }],
  },
  {
    id: 'd3', nom: 'SERVER-AD-01', categorie: 'serveur',
    os: 'Windows Server 2022', modele: 'Dell PowerEdge R750', numeroSerie: 'SN-PER-750-A',
    status: 'actif', dernierVu: 'en ligne', agence: 'Paris', fournisseur: 'Dell',
    contrat: 'ProSupport 24/7',
    garantie: { debut: '2023-04-01', fin: '2028-04-01', niveau: 'ProSupport Plus 24/7 4h' },
    miseAJour: { aJour: true, dernierePatch: '2026-04-30', patchsManquants: 0, versionOS: 'Server 2022 21H2', politique: 'WSUS planifié' },
    specs: { cpu: '2× Xeon Silver 4314', ramGo: 128 },
    stockage: [
      { nom: 'RAID-1 Système', type: 'RAID', totalGo: 480, libreGo: 320, sante: 'OK' },
      { nom: 'RAID-5 Données', type: 'RAID', totalGo: 4000, libreGo: 1240, sante: 'OK' },
    ],
    sauvegarde: { connectee: true, destination: 'Veeam → NAS-FILES-01 + Wasabi', dernierSucces: 'aujourd\'hui 03:14', retention: '30j local · 1 an cloud', frequence: 'Quotidien', tailleGo: 1820 },
  },
  {
    id: 'd4', nom: 'NAS-FILES-01', categorie: 'serveur',
    os: 'Synology DSM 7.2', modele: 'Synology RS1221+', numeroSerie: 'SN-RS1221-X',
    status: 'actif', dernierVu: 'en ligne', agence: 'Paris', fournisseur: 'Synology',
    garantie: { debut: '2022-09-20', fin: '2025-09-20', niveau: 'Synology Standard' },
    miseAJour: { aJour: true, dernierePatch: '2026-04-15', patchsManquants: 0, versionOS: 'DSM 7.2.1-69057 Update 4', politique: 'Auto-update' },
    specs: { cpu: 'AMD Ryzen V1500B', ramGo: 16 },
    stockage: [
      { nom: 'Volume 1 (SHR-2)', type: 'HDD', totalGo: 32000, libreGo: 7800, sante: 'OK' },
      { nom: 'Cache SSD', type: 'SSD', totalGo: 800, libreGo: 540, sante: 'OK' },
    ],
    sauvegarde: { connectee: true, destination: 'Hyper Backup → Wasabi S3 (Paris)', dernierSucces: 'cette nuit 02:42', retention: '90 jours versionnés', frequence: 'Toutes les 6h', tailleGo: 4280 },
  },
  {
    id: 'd5', nom: 'IPHONE-SOPHIE', categorie: 'mobile', utilisateur: 'Sophie Lemoine',
    os: 'iOS 17.4.1', modele: 'iPhone 15', numeroSerie: 'SN-IP15-008',
    status: 'actif', dernierVu: 'il y a 1h', agence: 'Paris', fournisseur: 'Apple',
    garantie: { debut: '2024-02-01', fin: '2026-02-01', niveau: 'AppleCare+' },
    miseAJour: { aJour: false, dernierePatch: '2026-02-21', patchsManquants: 1, versionOS: '17.4.1', politique: 'Intune MDM' },
    specs: { cpu: 'Apple A16', ramGo: 6, batterie: 91 },
    stockage: [{ nom: 'Stockage interne', type: 'SSD', totalGo: 256, libreGo: 84, sante: 'OK' }],
  },
  {
    id: 'd6', nom: 'PRINTER-PARIS-01', categorie: 'imprimante',
    os: 'Firmware 2.34', modele: 'HP LaserJet Pro M404dn', numeroSerie: 'SN-HPLJ-211',
    status: 'maintenance', dernierVu: 'il y a 3h', agence: 'Paris', fournisseur: 'HP',
    contrat: 'Contrat impression managé',
    garantie: { debut: '2022-05-01', fin: '2025-05-01', niveau: 'Standard 3 ans' },
    miseAJour: { aJour: true, dernierePatch: '2026-01-10', patchsManquants: 0, versionOS: 'Firmware 2.34', politique: 'Manuel' },
    impression: { pagesImprimees: 184230, tonerPct: 18, coutPage: '0,012 € N&B' },
  },
  {
    id: 'd7', nom: 'SWITCH-LYON-01', categorie: 'reseau',
    os: 'Cisco IOS-XE 17.9', modele: 'Cisco Catalyst 9300-48P', numeroSerie: 'SN-C9300-A',
    status: 'actif', dernierVu: 'en ligne', agence: 'Lyon', fournisseur: 'Cisco',
    contrat: 'Smartnet 8x5xNBD',
    garantie: { debut: '2024-03-01', fin: '2027-03-01', niveau: 'Smartnet 8x5xNBD' },
    miseAJour: { aJour: true, dernierePatch: '2026-03-22', patchsManquants: 0, versionOS: 'IOS-XE 17.9.4a', politique: 'Manuel · fenêtre maintenance' },
  },
  {
    id: 'd8', nom: 'PC-PIERRE-04', categorie: 'poste', utilisateur: 'Pierre Roux',
    os: 'Windows 11 Pro 23H2', modele: 'Lenovo ThinkPad T14 Gen 4', numeroSerie: 'SN-LTP-088',
    status: 'actif', dernierVu: 'il y a 5 min', agence: 'Marseille', fournisseur: 'Lenovo',
    garantie: { debut: '2024-09-01', fin: '2027-09-01', niveau: 'Premier Support' },
    miseAJour: { aJour: true, dernierePatch: '2026-04-25', patchsManquants: 0, versionOS: '23H2 build 22631.3447', politique: 'Intune' },
    specs: { cpu: 'Intel Core i5-1335U', ramGo: 16, batterie: 78 },
    stockage: [{ nom: 'C:', type: 'NVMe', totalGo: 512, libreGo: 290, sante: 'OK' }],
  },
  {
    id: 'd9', nom: 'TEL-STD-PARIS', categorie: 'telephonie',
    os: '3CX v20', modele: 'Yealink T54W (12 postes)', numeroSerie: 'SN-Y54-PAR',
    status: 'actif', dernierVu: 'en ligne', agence: 'Paris', fournisseur: 'Yealink',
    contrat: 'IPBX hébergé',
    garantie: { debut: '2024-01-01', fin: '2027-01-01', niveau: 'Maintenance 3CX Pro' },
    miseAJour: { aJour: true, dernierePatch: '2026-04-10', patchsManquants: 0, versionOS: '3CX v20 Update 4', politique: 'Auto' },
    telephonie: { lignes: 6, postes: 12, ipbx: '3CX Cloud (3CX-PAR)', operateur: 'OVH SIP Trunk' },
  },
  {
    id: 'd10', nom: 'ALARME-SIEGE', categorie: 'alarme',
    os: 'Verisure FW 4.2', modele: 'Verisure Pro', numeroSerie: 'SN-VS-9921',
    status: 'actif', dernierVu: 'OK', agence: 'Paris', fournisseur: 'Verisure',
    contrat: 'Télésurveillance 24/7',
    garantie: { debut: '2023-09-01', fin: '2028-09-01', niveau: 'Inclus contrat' },
    alarme: { centrale: 'Verisure Pro v4', detecteurs: 14, telesurveillance: 'Verisure 24/7', dernierTest: '2026-04-22' },
  },
  {
    id: 'd11', nom: 'CCTV-LYON-EXT', categorie: 'videosurveillance',
    os: 'Hik-Connect 5.1', modele: 'Hikvision NVR DS-7608NI 8ch', numeroSerie: 'SN-HIK-NVR8',
    status: 'actif', dernierVu: 'en ligne', agence: 'Lyon', fournisseur: 'Hikvision',
    garantie: { debut: '2024-05-01', fin: '2027-05-01', niveau: 'Standard 3 ans' },
    miseAJour: { aJour: true, dernierePatch: '2026-04-02', patchsManquants: 0, versionOS: 'Firmware V4.71.005', politique: 'Manuel' },
    stockage: [{ nom: 'HDD enregistrement', type: 'HDD', totalGo: 8000, libreGo: 1200, sante: 'OK' }],
    videosurveillance: { cameras: 6, retentionJours: 30, stockageNVR: '2× 4 To Surveillance', cloud: true },
  },
  {
    id: 'd12', nom: 'FIBRE-PARIS-1G', categorie: 'lien-internet',
    os: '—', modele: 'Orange Pro Fibre 1Gb/s symétrique', numeroSerie: 'OF-PAR-77821',
    status: 'actif', dernierVu: '99,98% SLA', agence: 'Paris', fournisseur: 'Orange',
    contrat: 'GTR 4h ouvré',
    garantie: { debut: '2023-11-01', fin: '2026-11-01', niveau: 'GTR 4h' },
    lien: {
      debit: '1 Gb/s ↓ · 1 Gb/s ↑', sla: '99,9% GTR 4h', uptime: 99.98, latence: 8,
      bandwidth24h: bwSeries(420, 180), latence24h: latSeries(8),
    },
  },
  {
    id: 'd13', nom: 'SDSL-LYON-BACKUP', categorie: 'lien-internet',
    os: '—', modele: 'SFR SDSL 20Mb backup', numeroSerie: 'SFR-LYO-3320',
    status: 'actif', dernierVu: 'OK', agence: 'Lyon', fournisseur: 'SFR',
    garantie: { debut: '2024-01-15', fin: '2027-01-15', niveau: 'GTR 8h' },
    lien: {
      debit: '20 Mb/s ↓ · 20 Mb/s ↑', sla: '99,5% GTR 8h', uptime: 99.72, latence: 22,
      bandwidth24h: bwSeries(12, 8), latence24h: latSeries(22),
    },
  },
];
