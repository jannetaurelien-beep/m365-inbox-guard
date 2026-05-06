export interface Client {
  id: string;
  nom: string;
  secteur: string;
  email: string;
  telephone: string;
  siteWeb: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  logo?: string;
  logoColor: string;
  status: 'actif' | 'prospect' | 'inactif';
  contrat: 'Premium' | 'Business' | 'Essentiel';
  utilisateurs: number;
  licences: number;
  ca: number;
  depuis: string;
  contact: { nom: string; role: string };
  tags: string[];
}

const palette = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
  'from-fuchsia-500 to-purple-600',
  'from-lime-500 to-emerald-600',
];

export const mockClients: Client[] = [
  {
    id: 'c1', nom: 'Acme Industries', secteur: 'Industrie', email: 'contact@acme.fr', telephone: '+33 1 42 86 00 00',
    siteWeb: 'acme.fr', adresse: '12 rue de la République', codePostal: '75001', ville: 'Paris', pays: 'France',
    logoColor: palette[0], status: 'actif', contrat: 'Premium', utilisateurs: 142, licences: 160, ca: 84500,
    depuis: '2021-03-12', contact: { nom: 'Marie Dubois', role: 'DSI' }, tags: ['Stratégique', 'Multi-sites'],
  },
  {
    id: 'c2', nom: 'Lumina Studio', secteur: 'Design & Média', email: 'hello@lumina.io', telephone: '+33 4 78 22 11 33',
    siteWeb: 'lumina.io', adresse: '45 quai Rambaud', codePostal: '69002', ville: 'Lyon', pays: 'France',
    logoColor: palette[2], status: 'actif', contrat: 'Business', utilisateurs: 38, licences: 40, ca: 22300,
    depuis: '2022-07-04', contact: { nom: 'Julien Marchand', role: 'CEO' }, tags: ['Créatif'],
  },
  {
    id: 'c3', nom: 'NordTech Solutions', secteur: 'Tech', email: 'team@nordtech.eu', telephone: '+33 3 20 55 88 12',
    siteWeb: 'nordtech.eu', adresse: '8 boulevard Carnot', codePostal: '59000', ville: 'Lille', pays: 'France',
    logoColor: palette[5], status: 'actif', contrat: 'Premium', utilisateurs: 96, licences: 100, ca: 56700,
    depuis: '2020-11-23', contact: { nom: 'Sophie Lemoine', role: 'CTO' }, tags: ['Tech', 'Cloud'],
  },
  {
    id: 'c4', nom: 'Boulangerie Maréchal', secteur: 'Commerce', email: 'gerant@marechal.fr', telephone: '+33 2 99 30 14 87',
    siteWeb: 'marechal.fr', adresse: '3 place du Marché', codePostal: '35000', ville: 'Rennes', pays: 'France',
    logoColor: palette[3], status: 'actif', contrat: 'Essentiel', utilisateurs: 8, licences: 10, ca: 4200,
    depuis: '2023-01-18', contact: { nom: 'Pierre Maréchal', role: 'Gérant' }, tags: ['PME'],
  },
  {
    id: 'c5', nom: 'GreenLeaf Consulting', secteur: 'Conseil', email: 'info@greenleaf.com', telephone: '+33 5 61 23 45 67',
    siteWeb: 'greenleaf.com', adresse: '22 allée Jean Jaurès', codePostal: '31000', ville: 'Toulouse', pays: 'France',
    logoColor: palette[1], status: 'prospect', contrat: 'Business', utilisateurs: 0, licences: 0, ca: 0,
    depuis: '2026-04-02', contact: { nom: 'Anaïs Roux', role: 'Directrice' }, tags: ['Prospect chaud'],
  },
  {
    id: 'c6', nom: 'Atlas Logistique', secteur: 'Transport', email: 'contact@atlas-log.fr', telephone: '+33 4 91 33 22 11',
    siteWeb: 'atlas-log.fr', adresse: '180 avenue du Prado', codePostal: '13008', ville: 'Marseille', pays: 'France',
    logoColor: palette[4], status: 'actif', contrat: 'Premium', utilisateurs: 215, licences: 220, ca: 112400,
    depuis: '2019-09-15', contact: { nom: 'Karim Benali', role: 'DAF' }, tags: ['Stratégique', 'Logistique'],
  },
  {
    id: 'c7', nom: 'Vertex Avocats', secteur: 'Juridique', email: 'cabinet@vertex-avocats.fr', telephone: '+33 1 55 04 88 00',
    siteWeb: 'vertex-avocats.fr', adresse: '6 avenue Hoche', codePostal: '75008', ville: 'Paris', pays: 'France',
    logoColor: palette[6], status: 'actif', contrat: 'Business', utilisateurs: 24, licences: 25, ca: 18900,
    depuis: '2022-02-28', contact: { nom: 'Camille Perrin', role: 'Associée' }, tags: ['Confidentiel'],
  },
  {
    id: 'c8', nom: 'OcéanPlus', secteur: 'Tourisme', email: 'contact@oceanplus.fr', telephone: '+33 5 56 44 12 90',
    siteWeb: 'oceanplus.fr', adresse: '14 cours du Médoc', codePostal: '33000', ville: 'Bordeaux', pays: 'France',
    logoColor: palette[7], status: 'inactif', contrat: 'Essentiel', utilisateurs: 12, licences: 15, ca: 6800,
    depuis: '2023-06-10', contact: { nom: 'Léa Garnier', role: 'Resp. IT' }, tags: ['À relancer'],
  },
];
