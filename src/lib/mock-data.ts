export type UserType = 'nominative' | 'partagee';
export type UserStatus = 'active' | 'inactive';
export type MemberRole = 'Lecture' | 'EnvoyeDe' | 'AccesComplet';
export type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'error';

export interface User {
  id: string;
  avatarUrl: string;
  prenom: string;
  nom: string;
  metier: string;
  agence: string;
  telephone: string;
  email: string;
  upn: string;
  typeBoite: UserType;
  status: UserStatus;
  aliases: string[];
  stockage: {
    utiliseGo: number;
    quotaGo: number;
  };
  licence: {
    skuId: string;
    label: string;
  };
  activite: {
    periode: '7j' | '30j' | '90j';
    envoyes: { date: string; count: number }[];
    recus: { date: string; count: number }[];
  };
  boitePartagee: {
    estPartagee: boolean;
    membres?: { id: string; displayName: string; role: MemberRole }[];
  };
  auditLog: {
    date: string;
    action: string;
    user: string;
    status: 'success' | 'error';
    details: string;
  }[];
}

export interface License {
  skuId: string;
  label: string;
  description: string;
  prixMensuel: number;
  stockageGo: number;
  features: string[];
}

export interface WorkflowRequest {
  id: string;
  type: 'archivage' | 'licence' | 'conversion';
  userId: string;
  userName: string;
  status: RequestStatus;
  createdAt: string;
  completedAt?: string;
  details: string;
}

// Génération de données d'activité
const generateActivity = (days: number) => {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    result.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 10,
    });
  }
  return result;
};

export const mockUsers: User[] = [
  {
    id: 'usr_001',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aurelien',
    prenom: 'Aurélien',
    nom: 'Jannet',
    metier: 'Technicien informatique',
    agence: 'Marseille',
    telephone: '+33 6 12 34 56 78',
    email: 'aurelien.jannet@exemple.fr',
    upn: 'aurelien.jannet@exemple.onmicrosoft.com',
    typeBoite: 'nominative',
    status: 'active',
    aliases: ['ajannet@exemple.fr', 'support.tech@exemple.fr'],
    stockage: { utiliseGo: 38.4, quotaGo: 50 },
    licence: { skuId: 'ENTERPRISEPACK', label: 'Microsoft 365 E3' },
    activite: {
      periode: '30j',
      envoyes: generateActivity(30),
      recus: generateActivity(30),
    },
    boitePartagee: { estPartagee: false },
    auditLog: [
      { date: '2025-01-08T10:30:00Z', action: 'Ajout alias', user: 'admin@exemple.fr', status: 'success', details: 'Alias support.tech@exemple.fr ajouté' },
      { date: '2025-01-05T14:20:00Z', action: 'Modification métier', user: 'admin@exemple.fr', status: 'success', details: 'Métier mis à jour' },
    ],
  },
  {
    id: 'usr_002',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    prenom: 'Marie',
    nom: 'Dubois',
    metier: 'Responsable RH',
    agence: 'Paris',
    telephone: '+33 6 23 45 67 89',
    email: 'marie.dubois@exemple.fr',
    upn: 'marie.dubois@exemple.onmicrosoft.com',
    typeBoite: 'nominative',
    status: 'active',
    aliases: ['m.dubois@exemple.fr'],
    stockage: { utiliseGo: 22.1, quotaGo: 50 },
    licence: { skuId: 'SPB', label: 'Microsoft 365 Business Standard' },
    activite: {
      periode: '30j',
      envoyes: generateActivity(30),
      recus: generateActivity(30),
    },
    boitePartagee: { estPartagee: false },
    auditLog: [],
  },
  {
    id: 'shared_001',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=contact',
    prenom: 'Boîte',
    nom: 'Contact',
    metier: 'Boîte partagée',
    agence: 'Toutes agences',
    telephone: '+33 1 23 45 67 89',
    email: 'contact@exemple.fr',
    upn: 'contact@exemple.onmicrosoft.com',
    typeBoite: 'partagee',
    status: 'active',
    aliases: ['info@exemple.fr', 'contact.general@exemple.fr'],
    stockage: { utiliseGo: 45.8, quotaGo: 100 },
    licence: { skuId: 'EXCHANGEDESKLESS', label: 'Exchange Online Kiosk' },
    activite: {
      periode: '30j',
      envoyes: generateActivity(30),
      recus: generateActivity(30),
    },
    boitePartagee: {
      estPartagee: true,
      membres: [
        { id: 'usr_001', displayName: 'Aurélien Jannet', role: 'AccesComplet' },
        { id: 'usr_002', displayName: 'Marie Dubois', role: 'EnvoyeDe' },
        { id: 'usr_003', displayName: 'Paul Martin', role: 'Lecture' },
      ],
    },
    auditLog: [
      { date: '2025-01-09T09:15:00Z', action: 'Ajout membre', user: 'admin@exemple.fr', status: 'success', details: 'Paul Martin ajouté (Lecture)' },
    ],
  },
  {
    id: 'shared_002',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=support',
    prenom: 'Boîte',
    nom: 'Support',
    metier: 'Boîte partagée',
    agence: 'Toutes agences',
    telephone: '+33 1 23 45 67 90',
    email: 'support@exemple.fr',
    upn: 'support@exemple.onmicrosoft.com',
    typeBoite: 'partagee',
    status: 'active',
    aliases: ['aide@exemple.fr', 'helpdesk@exemple.fr'],
    stockage: { utiliseGo: 67.3, quotaGo: 100 },
    licence: { skuId: 'EXCHANGEDESKLESS', label: 'Exchange Online Kiosk' },
    activite: {
      periode: '30j',
      envoyes: generateActivity(30),
      recus: generateActivity(30),
    },
    boitePartagee: {
      estPartagee: true,
      membres: [
        { id: 'usr_001', displayName: 'Aurélien Jannet', role: 'AccesComplet' },
        { id: 'usr_004', displayName: 'Sophie Laurent', role: 'AccesComplet' },
      ],
    },
    auditLog: [],
  },
  {
    id: 'shared_003',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=compta',
    prenom: 'Boîte',
    nom: 'Comptabilité',
    metier: 'Boîte partagée',
    agence: 'Paris',
    telephone: '+33 1 23 45 67 91',
    email: 'compta@exemple.fr',
    upn: 'compta@exemple.onmicrosoft.com',
    typeBoite: 'partagee',
    status: 'active',
    aliases: ['comptabilite@exemple.fr', 'finances@exemple.fr'],
    stockage: { utiliseGo: 82.5, quotaGo: 100 },
    licence: { skuId: 'EXCHANGEDESKLESS', label: 'Exchange Online Kiosk' },
    activite: {
      periode: '30j',
      envoyes: generateActivity(30),
      recus: generateActivity(30),
    },
    boitePartagee: {
      estPartagee: true,
      membres: [
        { id: 'usr_005', displayName: 'Jean Dupont', role: 'AccesComplet' },
        { id: 'usr_006', displayName: 'Claire Bernard', role: 'AccesComplet' },
      ],
    },
    auditLog: [],
  },
  // Ajout de 20 utilisateurs supplémentaires
  ...Array.from({ length: 20 }, (_, i) => {
    const num = i + 3;
    const prenoms = ['Paul', 'Sophie', 'Jean', 'Claire', 'Luc', 'Emma', 'Thomas', 'Julie', 'Pierre', 'Camille'];
    const noms = ['Martin', 'Laurent', 'Dupont', 'Bernard', 'Rousseau', 'Moreau', 'Simon', 'Michel', 'Lefebvre', 'Garcia'];
    const metiers = ['Développeur', 'Chef de projet', 'Comptable', 'Commercial', 'Responsable marketing', 'Assistant', 'Consultant', 'Analyste'];
    const agences = ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Bordeaux', 'Nantes'];
    const licences = [
      { skuId: 'SPB', label: 'Microsoft 365 Business Standard' },
      { skuId: 'ENTERPRISEPACK', label: 'Microsoft 365 E3' },
      { skuId: 'O365_BUSINESS_ESSENTIALS', label: 'Microsoft 365 Apps for Business' },
    ];

    const prenom = prenoms[i % prenoms.length];
    const nom = noms[i % noms.length];
    const licence = licences[i % licences.length];

    return {
      id: `usr_${String(num).padStart(3, '0')}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${prenom}${num}`,
      prenom,
      nom,
      metier: metiers[i % metiers.length],
      agence: agences[i % agences.length],
      telephone: `+33 6 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
      email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@exemple.fr`,
      upn: `${prenom.toLowerCase()}.${nom.toLowerCase()}@exemple.onmicrosoft.com`,
      typeBoite: 'nominative' as UserType,
      status: (i % 7 === 0 ? 'inactive' : 'active') as UserStatus,
      aliases: [`${prenom[0].toLowerCase()}${nom.toLowerCase()}@exemple.fr`],
      stockage: {
        utiliseGo: Math.floor(Math.random() * 70) + 10,
        quotaGo: licence.skuId === 'ENTERPRISEPACK' ? 100 : 50,
      },
      licence,
      activite: {
        periode: '30j' as const,
        envoyes: generateActivity(30),
        recus: generateActivity(30),
      },
      boitePartagee: { estPartagee: false },
      auditLog: [],
    };
  }),
];

export const mockLicenses: License[] = [
  {
    skuId: 'O365_BUSINESS_ESSENTIALS',
    label: 'Microsoft 365 Apps for Business',
    description: 'Applications Office essentielles avec stockage cloud',
    prixMensuel: 8.8,
    stockageGo: 50,
    features: ['Word, Excel, PowerPoint, Outlook', '1 To OneDrive', 'Support technique'],
  },
  {
    skuId: 'SPB',
    label: 'Microsoft 365 Business Standard',
    description: 'Suite complète avec services cloud',
    prixMensuel: 10.5,
    stockageGo: 50,
    features: ['Toutes les apps Office', 'Exchange, Teams, SharePoint', '1 To OneDrive', 'Sécurité avancée'],
  },
  {
    skuId: 'ENTERPRISEPACK',
    label: 'Microsoft 365 E3',
    description: 'Solution entreprise complète',
    prixMensuel: 19.7,
    stockageGo: 100,
    features: ['Toutes fonctionnalités Business', 'Conformité et eDiscovery', 'Protection des informations', 'Analytique avancée'],
  },
  {
    skuId: 'EXCHANGEDESKLESS',
    label: 'Exchange Online Kiosk',
    description: 'Messagerie pour boîtes partagées',
    prixMensuel: 2.0,
    stockageGo: 100,
    features: ['Messagerie Exchange', 'Boîtes partagées', '50 Go par boîte', 'Accès web uniquement'],
  },
];

export const mockRequests: WorkflowRequest[] = [
  {
    id: 'req_001',
    type: 'archivage',
    userId: 'shared_003',
    userName: 'Boîte Comptabilité',
    status: 'pending',
    createdAt: '2025-01-09T10:00:00Z',
    details: 'Archivage des emails de plus de 2 ans',
  },
  {
    id: 'req_002',
    type: 'licence',
    userId: 'usr_002',
    userName: 'Marie Dubois',
    status: 'in-progress',
    createdAt: '2025-01-08T14:30:00Z',
    details: 'Upgrade vers Microsoft 365 E3',
  },
  {
    id: 'req_003',
    type: 'conversion',
    userId: 'shared_002',
    userName: 'Boîte Support',
    status: 'completed',
    createdAt: '2025-01-07T09:15:00Z',
    completedAt: '2025-01-07T11:45:00Z',
    details: 'Conversion en boîte nominative pour Jean Martin',
  },
  {
    id: 'req_004',
    type: 'archivage',
    userId: 'usr_001',
    userName: 'Aurélien Jannet',
    status: 'error',
    createdAt: '2025-01-06T16:20:00Z',
    details: 'Erreur lors de l\'archivage - quota insuffisant',
  },
];
