export type ConnectorStatus = "connected" | "disconnected" | "error" | "syncing";

export type SubscriptionStatus = "active" | "expiring" | "suspended" | "cancelled" | "pending";

export type LicenseProvider = {
  id: string;
  name: string;
  vendor: string;
  description: string;
  logo: string; // emoji or initials fallback
  color: string; // semantic token class e.g. 'primary'
  status: ConnectorStatus;
  lastSync: string;
  apiEndpoint: string;
  account?: string;
  stats: {
    subscriptions: number;
    activeSeats: number;
    monthlyCost: number; // EUR
    expiringSoon: number;
  };
};

export type SubscriptionRenewal = "monthly" | "yearly" | "biennial" | "one-time";

export type Subscription = {
  id: string;
  providerId: string;
  reference: string; // e.g. ovh-saas-xxx
  name: string;
  category: string; // Domain, VPS, M365, Hosting, SSL, Telephony...
  status: SubscriptionStatus;
  seats: number;
  usedSeats: number;
  unitPrice: number;
  totalPrice: number;
  currency: "EUR";
  renewal: SubscriptionRenewal;
  autoRenew: boolean;
  startDate: string;
  endDate: string;
  contractRef?: string;
  owner: string;
  client?: string;
  region?: string;
  tags?: string[];
  history: { date: string; event: string; user?: string }[];
  technical?: Record<string, string>;
};

export const licenseProviders: LicenseProvider[] = [
  {
    id: "ovh",
    name: "OVHcloud",
    vendor: "OVH SAS",
    description: "Domaines, VPS, hébergement web, M365, SSL et téléphonie.",
    logo: "OVH",
    color: "primary",
    status: "connected",
    lastSync: "2026-06-20T08:42:00Z",
    apiEndpoint: "https://eu.api.ovh.com/1.0",
    account: "ovh-pro-3490-acme",
    stats: { subscriptions: 47, activeSeats: 312, monthlyCost: 4280, expiringSoon: 6 },
  },
  {
    id: "becloud",
    name: "BeCloud",
    vendor: "BeCloud Services",
    description: "Cloud privé, sauvegarde managée et virtualisation.",
    logo: "BC",
    color: "accent",
    status: "connected",
    lastSync: "2026-06-20T07:15:00Z",
    apiEndpoint: "https://api.becloud.eu/v2",
    account: "becloud-acme-prod",
    stats: { subscriptions: 18, activeSeats: 84, monthlyCost: 2150, expiringSoon: 1 },
  },
  {
    id: "microsoft-csp",
    name: "Microsoft CSP",
    vendor: "Microsoft Partner Center",
    description: "Licences M365, Azure et Dynamics via le programme CSP.",
    logo: "MS",
    color: "primary",
    status: "syncing",
    lastSync: "2026-06-20T09:01:00Z",
    apiEndpoint: "https://api.partnercenter.microsoft.com",
    account: "csp-tenant-acme",
    stats: { subscriptions: 23, activeSeats: 510, monthlyCost: 8720, expiringSoon: 3 },
  },
  {
    id: "bouygues",
    name: "Bouygues Telecom Pro",
    vendor: "Bouygues Telecom Entreprises",
    description: "Lignes mobiles, forfaits data et téléphonie fixe.",
    logo: "BT",
    color: "warning",
    status: "connected",
    lastSync: "2026-06-19T22:10:00Z",
    apiEndpoint: "https://api.bouyguestelecom.fr/pro",
    account: "bytel-flotte-acme",
    stats: { subscriptions: 64, activeSeats: 64, monthlyCost: 1980, expiringSoon: 9 },
  },
  {
    id: "orange-pro",
    name: "Orange Pro",
    vendor: "Orange Business",
    description: "Fibre, mobiles et services managés Orange.",
    logo: "OR",
    color: "warning",
    status: "error",
    lastSync: "2026-06-18T14:00:00Z",
    apiEndpoint: "https://api.orange-business.com",
    account: "ob-acme-flotte",
    stats: { subscriptions: 31, activeSeats: 28, monthlyCost: 1240, expiringSoon: 2 },
  },
  {
    id: "scaleway",
    name: "Scaleway",
    vendor: "Scaleway SAS",
    description: "Instances cloud, object storage et Kubernetes managé.",
    logo: "SW",
    color: "accent",
    status: "disconnected",
    lastSync: "—",
    apiEndpoint: "https://api.scaleway.com",
    stats: { subscriptions: 0, activeSeats: 0, monthlyCost: 0, expiringSoon: 0 },
  },
];

const today = new Date("2026-06-20");
const addDays = (d: number) => new Date(today.getTime() + d * 86400000).toISOString().slice(0, 10);

export const subscriptions: Subscription[] = [
  // OVH
  {
    id: "sub-ovh-001",
    providerId: "ovh",
    reference: "ovh-domain-acme.fr",
    name: "Domaine acme.fr",
    category: "Domaine",
    status: "active",
    seats: 1, usedSeats: 1, unitPrice: 7.99, totalPrice: 7.99, currency: "EUR",
    renewal: "yearly", autoRenew: true,
    startDate: "2024-03-12", endDate: addDays(90),
    contractRef: "DOM-2024-018", owner: "n.dubois@acme.fr", client: "ACME Group", region: "EU",
    tags: ["DNS", "WHOIS protect"],
    technical: { Registrar: "OVH", DNSSEC: "Activé", WhoisPrivacy: "Oui", NS: "dns200.anycast.me" },
    history: [
      { date: "2024-03-12", event: "Création du domaine", user: "n.dubois@acme.fr" },
      { date: "2025-03-12", event: "Renouvellement automatique" },
    ],
  },
  {
    id: "sub-ovh-002",
    providerId: "ovh",
    reference: "ovh-vps-vps-7a4f",
    name: "VPS SSD 4 — vps-7a4f.ovh.net",
    category: "VPS",
    status: "active",
    seats: 1, usedSeats: 1, unitPrice: 28.99, totalPrice: 28.99, currency: "EUR",
    renewal: "monthly", autoRenew: true,
    startDate: "2025-01-05", endDate: addDays(12),
    contractRef: "VPS-2025-091", owner: "ops@acme.fr", region: "GRA (Gravelines)",
    tags: ["Production", "Linux"],
    technical: { OS: "Debian 12", vCPU: "4", RAM: "8 Go", Stockage: "160 Go SSD", IP: "51.91.42.18" },
    history: [
      { date: "2025-01-05", event: "Commande" },
      { date: "2026-05-10", event: "Snapshot manuel", user: "ops@acme.fr" },
    ],
  },
  {
    id: "sub-ovh-003",
    providerId: "ovh",
    reference: "ovh-mxplan-acme",
    name: "MX Plan 25 boîtes",
    category: "Email",
    status: "expiring",
    seats: 25, usedSeats: 22, unitPrice: 1.49, totalPrice: 37.25, currency: "EUR",
    renewal: "monthly", autoRenew: false,
    startDate: "2024-09-01", endDate: addDays(8),
    contractRef: "MX-2024-204", owner: "it@acme.fr",
    tags: ["Email", "Anti-spam"],
    technical: { Quota: "5 Go / boîte", AntiSpam: "Inclus", Webmail: "Roundcube" },
    history: [
      { date: "2026-06-12", event: "Préavis renouvellement envoyé" },
    ],
  },
  {
    id: "sub-ovh-004",
    providerId: "ovh",
    reference: "ovh-ssl-wildcard-acme",
    name: "SSL Wildcard *.acme.fr",
    category: "Certificat SSL",
    status: "active",
    seats: 1, usedSeats: 1, unitPrice: 149, totalPrice: 149, currency: "EUR",
    renewal: "yearly", autoRenew: true,
    startDate: "2025-11-20", endDate: addDays(150),
    contractRef: "SSL-2025-007", owner: "secu@acme.fr",
    tags: ["Wildcard", "Sectigo"],
    technical: { Autorité: "Sectigo", Type: "Wildcard DV", Validité: "365 jours" },
    history: [{ date: "2025-11-20", event: "Émission du certificat" }],
  },
  {
    id: "sub-ovh-005",
    providerId: "ovh",
    reference: "ovh-tel-3490",
    name: "Ligne SIP 3490",
    category: "Téléphonie",
    status: "active",
    seats: 12, usedSeats: 12, unitPrice: 4.99, totalPrice: 59.88, currency: "EUR",
    renewal: "monthly", autoRenew: true,
    startDate: "2023-07-01", endDate: addDays(20),
    owner: "it@acme.fr", tags: ["SIP", "Pro"],
    technical: { Trunk: "OVH Telephony", Codecs: "G711, G729", Lignes: "12" },
    history: [],
  },
  {
    id: "sub-ovh-006",
    providerId: "ovh",
    reference: "ovh-hosting-perso",
    name: "Hébergement Perso 250 Go",
    category: "Hébergement",
    status: "suspended",
    seats: 1, usedSeats: 0, unitPrice: 3.59, totalPrice: 3.59, currency: "EUR",
    renewal: "monthly", autoRenew: false,
    startDate: "2022-04-10", endDate: addDays(-3),
    owner: "marketing@acme.fr", tags: ["WordPress"],
    technical: { PHP: "8.2", Quota: "250 Go", BDD: "MySQL 8" },
    history: [{ date: "2026-06-17", event: "Suspension pour non-paiement" }],
  },
  // BeCloud
  {
    id: "sub-bc-001",
    providerId: "becloud",
    reference: "bc-backup-365",
    name: "Backup M365 Pro",
    category: "Sauvegarde",
    status: "active",
    seats: 80, usedSeats: 74, unitPrice: 3.5, totalPrice: 280, currency: "EUR",
    renewal: "monthly", autoRenew: true,
    startDate: "2025-02-15", endDate: addDays(45),
    owner: "it@acme.fr", tags: ["M365", "Backup"],
    technical: { Rétention: "365 jours", Région: "Paris", Chiffrement: "AES-256" },
    history: [],
  },
  {
    id: "sub-bc-002",
    providerId: "becloud",
    reference: "bc-vm-prod-01",
    name: "VM Production — prod-01",
    category: "Cloud privé",
    status: "active",
    seats: 1, usedSeats: 1, unitPrice: 189, totalPrice: 189, currency: "EUR",
    renewal: "monthly", autoRenew: true,
    startDate: "2024-12-01", endDate: addDays(60),
    owner: "ops@acme.fr", region: "Paris (DC2)",
    technical: { vCPU: "8", RAM: "32 Go", Stockage: "500 Go NVMe" },
    history: [],
  },
  // Microsoft CSP
  {
    id: "sub-ms-001",
    providerId: "microsoft-csp",
    reference: "ms-m365-bp",
    name: "Microsoft 365 Business Premium",
    category: "Licence M365",
    status: "active",
    seats: 120, usedSeats: 118, unitPrice: 20.6, totalPrice: 2472, currency: "EUR",
    renewal: "yearly", autoRenew: true,
    startDate: "2025-09-01", endDate: addDays(75),
    owner: "it@acme.fr",
    technical: { NCE: "Oui", Engagement: "12 mois", Type: "Annual commitment" },
    history: [],
  },
  {
    id: "sub-ms-002",
    providerId: "microsoft-csp",
    reference: "ms-azure-sub-prod",
    name: "Azure Subscription — Production",
    category: "Azure",
    status: "active",
    seats: 1, usedSeats: 1, unitPrice: 0, totalPrice: 3120, currency: "EUR",
    renewal: "monthly", autoRenew: true,
    startDate: "2023-06-15", endDate: addDays(15),
    owner: "cloud@acme.fr",
    technical: { Type: "Pay-as-you-go", Tenant: "acme.onmicrosoft.com" },
    history: [],
  },
  // Bouygues
  {
    id: "sub-byt-001",
    providerId: "bouygues",
    reference: "byt-mobile-pool",
    name: "Forfait Pro 200 Go (x40)",
    category: "Mobile",
    status: "active",
    seats: 40, usedSeats: 40, unitPrice: 24.9, totalPrice: 996, currency: "EUR",
    renewal: "monthly", autoRenew: true,
    startDate: "2024-04-01", endDate: addDays(180),
    owner: "rh@acme.fr",
    technical: { Data: "200 Go", Pays: "France + UE", "5G": "Oui" },
    history: [],
  },
  {
    id: "sub-byt-002",
    providerId: "bouygues",
    reference: "byt-trunk-sip",
    name: "Trunk SIP 60 canaux",
    category: "Téléphonie",
    status: "expiring",
    seats: 60, usedSeats: 48, unitPrice: 6.5, totalPrice: 390, currency: "EUR",
    renewal: "yearly", autoRenew: false,
    startDate: "2024-07-01", endDate: addDays(10),
    owner: "it@acme.fr",
    technical: { Canaux: "60", DDI: "100", Codec: "G711" },
    history: [{ date: "2026-06-15", event: "Demande de renégociation tarifaire" }],
  },
  // Orange
  {
    id: "sub-org-001",
    providerId: "orange-pro",
    reference: "org-fibre-hq",
    name: "Fibre Pro 1 Gb/s — Siège",
    category: "Internet",
    status: "active",
    seats: 1, usedSeats: 1, unitPrice: 199, totalPrice: 199, currency: "EUR",
    renewal: "monthly", autoRenew: true,
    startDate: "2023-01-10", endDate: addDays(200),
    owner: "it@acme.fr", region: "Paris 9e",
    technical: { Débit: "1 Gb/s sym", SLA: "GTR 4h", IP: "Fixe /29" },
    history: [],
  },
];
