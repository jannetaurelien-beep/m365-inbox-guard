import { MailUserSummary } from './types/kpi';

export interface UserScore {
  userId: string;
  displayName: string;
  upn: string;
  agency?: string;
  department?: string;
  jobTitle?: string;
  totalPoints: number;
  slaPoints: number;
  backlogPoints: number;
  volumePoints: number;
  reactivityPoints: number;
  rank: number;
  badge?: 'gold' | 'silver' | 'bronze' | 'champion' | 'rising_star';
  trend: 'up' | 'down' | 'stable';
}

// Système de points
const SCORING_WEIGHTS = {
  sla: 40,          // 40 points max pour le SLA
  backlog: 25,      // 25 points max pour le backlog
  reactivity: 20,   // 20 points max pour la réactivité
  volume: 15,       // 15 points max pour le volume
};

export function calculateUserScore(user: MailUserSummary): UserScore {
  const sla = user.metrics.external.first_reply_within_sla || 0;
  const backlog = user.metrics.external.backlog_total || 0;
  const delayP50 = user.metrics.external.first_reply_p50_min || 0;
  const volume = user.metrics.external.received + user.metrics.external.sent;

  // Calcul des points par catégorie
  const slaPoints = (sla / 100) * SCORING_WEIGHTS.sla;
  
  // Backlog inversé (moins de backlog = plus de points)
  const backlogPoints = Math.max(0, (1 - Math.min(backlog, 100) / 100)) * SCORING_WEIGHTS.backlog;
  
  // Réactivité (basée sur délai P50, max 60 min pour avoir 0 points)
  const reactivityPoints = Math.max(0, (1 - Math.min(delayP50, 60) / 60)) * SCORING_WEIGHTS.reactivity;
  
  // Volume (normalisé sur 1000 emails max)
  const volumePoints = Math.min(volume / 1000, 1) * SCORING_WEIGHTS.volume;

  const totalPoints = Math.round(slaPoints + backlogPoints + reactivityPoints + volumePoints);

  return {
    userId: user.userId,
    displayName: user.displayName,
    upn: user.upn,
    agency: user.agency,
    department: user.department,
    jobTitle: user.jobTitle,
    totalPoints,
    slaPoints: Math.round(slaPoints),
    backlogPoints: Math.round(backlogPoints),
    volumePoints: Math.round(volumePoints),
    reactivityPoints: Math.round(reactivityPoints),
    rank: 0, // Sera calculé après le tri
    trend: 'stable', // À calculer avec historique
  };
}

export function calculateScoresAndRanking(users: MailUserSummary[]): UserScore[] {
  // Calculer les scores
  const scores = users.map(calculateUserScore);
  
  // Trier par points décroissants
  scores.sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Assigner les rangs et badges
  scores.forEach((score, index) => {
    score.rank = index + 1;
    
    // Attribution des badges
    if (index === 0) {
      score.badge = 'champion';
    } else if (index === 1) {
      score.badge = 'gold';
    } else if (index === 2) {
      score.badge = 'silver';
    } else if (index === 3) {
      score.badge = 'bronze';
    }
    
    // Rising star : dans le top 20% et avec un bon score
    if (!score.badge && score.totalPoints > 70 && index < scores.length * 0.2) {
      score.badge = 'rising_star';
    }
  });
  
  return scores;
}

export function getTopPerformers(scores: UserScore[], limit: number = 10): UserScore[] {
  return scores.slice(0, limit);
}

export function getAgencyRanking(scores: UserScore[]): Map<string, UserScore[]> {
  const byAgency = new Map<string, UserScore[]>();
  
  scores.forEach(score => {
    const agency = score.agency || 'Non assigné';
    if (!byAgency.has(agency)) {
      byAgency.set(agency, []);
    }
    byAgency.get(agency)!.push(score);
  });
  
  // Trier chaque agence
  byAgency.forEach((agencyScores) => {
    agencyScores.sort((a, b) => b.totalPoints - a.totalPoints);
    agencyScores.forEach((score, index) => {
      score.rank = index + 1;
    });
  });
  
  return byAgency;
}

export function getBadgeInfo(badge?: 'gold' | 'silver' | 'bronze' | 'champion' | 'rising_star') {
  switch (badge) {
    case 'champion':
      return {
        label: '🏆 Champion',
        color: 'from-yellow-400 via-yellow-500 to-yellow-600',
        textColor: 'text-yellow-600',
        description: 'Meilleur performer du mois'
      };
    case 'gold':
      return {
        label: '🥇 Or',
        color: 'from-yellow-300 to-yellow-500',
        textColor: 'text-yellow-500',
        description: '2ème place'
      };
    case 'silver':
      return {
        label: '🥈 Argent',
        color: 'from-gray-300 to-gray-400',
        textColor: 'text-gray-500',
        description: '3ème place'
      };
    case 'bronze':
      return {
        label: '🥉 Bronze',
        color: 'from-orange-400 to-orange-600',
        textColor: 'text-orange-600',
        description: '4ème place'
      };
    case 'rising_star':
      return {
        label: '⭐ Étoile montante',
        color: 'from-blue-400 to-blue-600',
        textColor: 'text-blue-600',
        description: 'Talent prometteur'
      };
    default:
      return null;
  }
}

export const REWARD_TIERS = [
  {
    name: 'Champion annuel',
    minPoints: 1200,
    description: 'Meilleur performer de l\'année',
    reward: 'À définir par l\'entreprise',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    name: 'Excellence',
    minPoints: 1000,
    description: 'Performance exceptionnelle',
    reward: 'À définir par l\'entreprise',
    color: 'from-purple-400 to-purple-600'
  },
  {
    name: 'Performer confirmé',
    minPoints: 800,
    description: 'Très bonne performance',
    reward: 'À définir par l\'entreprise',
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Bon niveau',
    minPoints: 600,
    description: 'Performance solide',
    reward: 'À définir par l\'entreprise',
    color: 'from-green-400 to-green-600'
  },
];
