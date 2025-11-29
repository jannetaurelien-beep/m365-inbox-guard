import { TenantOverviewResponse, UsersListResponse, UserDetailResponse } from '../types/kpi';

// Mock data pour la vue globale tenant
export const mockTenantOverview: TenantOverviewResponse = {
  periodDays: 30,
  tenant: {
    name: "Contoso Corporation",
    domains: ["contoso.com", "contoso.fr", "contoso-tech.com"]
  },
  totals: {
    received: 45678,
    sent: 32145
  },
  external: {
    first_reply_p50_min: 45,
    within_sla: 78.5,
    avg_backlog_total: 23
  },
  topUsers: [
    {
      userId: "user-1",
      upn: "marie.martin@contoso.com",
      displayName: "Marie Martin",
      department: "Support Client",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 1250, sent: 980, backlog_total: 15 },
        external: { 
          received: 1050, 
          sent: 820, 
          backlog_total: 12,
          backlog_unread: 8,
          backlog_flagged: 3,
          first_reply_p50_min: 32,
          first_reply_p90_min: 65,
          first_reply_within_sla: 85.5,
          samples: 950
        },
        internal: { received: 200, sent: 160, backlog_total: 3 }
      }
    },
    {
      userId: "user-2",
      upn: "thomas.bernard@contoso.com",
      displayName: "Thomas Bernard",
      department: "Ventes",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 980, sent: 1120, backlog_total: 8 },
        external: { 
          received: 780, 
          sent: 950, 
          backlog_total: 6,
          backlog_unread: 4,
          backlog_flagged: 1,
          first_reply_p50_min: 28,
          first_reply_p90_min: 58,
          first_reply_within_sla: 91.2,
          samples: 850
        },
        internal: { received: 200, sent: 170, backlog_total: 2 }
      }
    },
    {
      userId: "user-3",
      upn: "support@contoso.com",
      displayName: "Support Général",
      department: "Support",
      accountType: "Boîte partagée",
      metrics: {
        total: { received: 2340, sent: 1890, backlog_total: 45 },
        external: { 
          received: 2100, 
          sent: 1750, 
          backlog_total: 42,
          backlog_unread: 28,
          backlog_flagged: 12,
          first_reply_p50_min: 52,
          first_reply_p90_min: 95,
          first_reply_within_sla: 72.3,
          samples: 1980
        },
        internal: { received: 240, sent: 140, backlog_total: 3 }
      }
    }
  ],
  alerts: [
    {
      type: "warning",
      title: "Backlog élevé détecté",
      detail: "3 boîtes partagées ont un backlog supérieur à 40 e-mails depuis plus de 2 jours."
    },
    {
      type: "info",
      title: "Performance stable",
      detail: "Le SLA global est maintenu au-dessus de 75% ce mois-ci."
    }
  ]
};

// Mock data pour la liste des utilisateurs (plus complète)
export const mockUsersList: UsersListResponse = {
  periodDays: 30,
  generatedAt: new Date().toISOString(),
  users: [
    {
      userId: "user-1",
      upn: "marie.martin@contoso.com",
      displayName: "Marie Martin",
      department: "Support Client",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 1250, sent: 980, backlog_total: 15 },
        external: { 
          received: 1050, 
          sent: 820, 
          backlog_total: 12,
          backlog_unread: 8,
          backlog_flagged: 3,
          first_reply_p50_min: 32,
          first_reply_p90_min: 65,
          first_reply_within_sla: 85.5
        },
        internal: { received: 200, sent: 160, backlog_total: 3 }
      }
    },
    {
      userId: "user-2",
      upn: "thomas.bernard@contoso.com",
      displayName: "Thomas Bernard",
      department: "Ventes",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 980, sent: 1120, backlog_total: 8 },
        external: { 
          received: 780, 
          sent: 950, 
          backlog_total: 6,
          backlog_unread: 4,
          backlog_flagged: 1,
          first_reply_p50_min: 28,
          first_reply_p90_min: 58,
          first_reply_within_sla: 91.2
        },
        internal: { received: 200, sent: 170, backlog_total: 2 }
      }
    },
    {
      userId: "user-3",
      upn: "support@contoso.com",
      displayName: "Support Général",
      department: "Support",
      accountType: "Boîte partagée",
      metrics: {
        total: { received: 2340, sent: 1890, backlog_total: 45 },
        external: { 
          received: 2100, 
          sent: 1750, 
          backlog_total: 42,
          backlog_unread: 28,
          backlog_flagged: 12,
          first_reply_p50_min: 52,
          first_reply_p90_min: 95,
          first_reply_within_sla: 72.3
        },
        internal: { received: 240, sent: 140, backlog_total: 3 }
      }
    },
    {
      userId: "user-4",
      upn: "julie.dubois@contoso.com",
      displayName: "Julie Dubois",
      department: "Marketing",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 654, sent: 432, backlog_total: 18 },
        external: { 
          received: 520, 
          sent: 380, 
          backlog_total: 15,
          backlog_unread: 11,
          backlog_flagged: 2,
          first_reply_p50_min: 78,
          first_reply_p90_min: 125,
          first_reply_within_sla: 65.8
        },
        internal: { received: 134, sent: 52, backlog_total: 3 }
      }
    },
    {
      userId: "user-5",
      upn: "pierre.leroy@contoso.com",
      displayName: "Pierre Leroy",
      department: "IT",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 1420, sent: 890, backlog_total: 5 },
        external: { 
          received: 1180, 
          sent: 750, 
          backlog_total: 4,
          backlog_unread: 3,
          backlog_flagged: 0,
          first_reply_p50_min: 22,
          first_reply_p90_min: 48,
          first_reply_within_sla: 94.5
        },
        internal: { received: 240, sent: 140, backlog_total: 1 }
      }
    },
    {
      userId: "user-6",
      upn: "contact@contoso.com",
      displayName: "Contact Commercial",
      department: "Ventes",
      accountType: "Boîte partagée",
      metrics: {
        total: { received: 3210, sent: 2450, backlog_total: 67 },
        external: { 
          received: 2980, 
          sent: 2320, 
          backlog_total: 65,
          backlog_unread: 48,
          backlog_flagged: 15,
          first_reply_p50_min: 88,
          first_reply_p90_min: 145,
          first_reply_within_sla: 58.2
        },
        internal: { received: 230, sent: 130, backlog_total: 2 }
      }
    },
    {
      userId: "user-7",
      upn: "sophie.petit@contoso.com",
      displayName: "Sophie Petit",
      department: "RH",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 456, sent: 378, backlog_total: 12 },
        external: { 
          received: 320, 
          sent: 280, 
          backlog_total: 10,
          backlog_unread: 7,
          backlog_flagged: 2,
          first_reply_p50_min: 42,
          first_reply_p90_min: 85,
          first_reply_within_sla: 82.1
        },
        internal: { received: 136, sent: 98, backlog_total: 2 }
      }
    },
    {
      userId: "user-8",
      upn: "luc.moreau@contoso.com",
      displayName: "Luc Moreau",
      department: "Finance",
      accountType: "Utilisateur",
      metrics: {
        total: { received: 890, sent: 654, backlog_total: 28 },
        external: { 
          received: 720, 
          sent: 580, 
          backlog_total: 25,
          backlog_unread: 18,
          backlog_flagged: 5,
          first_reply_p50_min: 95,
          first_reply_p90_min: 165,
          first_reply_within_sla: 54.3
        },
        internal: { received: 170, sent: 74, backlog_total: 3 }
      }
    }
  ]
};

// Fonction pour générer des données de timeseries réalistes
function generateTimeseries(days: number, baseReceived: number, baseSent: number, baseBacklog: number, baseSLA: number): any[] {
  const series = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Variation aléatoire mais réaliste
    const variance = 0.3;
    const received = Math.round(baseReceived * (1 + (Math.random() - 0.5) * variance));
    const sent = Math.round(baseSent * (1 + (Math.random() - 0.5) * variance));
    const backlog = Math.max(0, Math.round(baseBacklog * (1 + (Math.random() - 0.5) * variance)));
    const sla = Math.max(0, Math.min(100, baseSLA + (Math.random() - 0.5) * 15));
    
    series.push({
      date: date.toISOString().split('T')[0],
      external: {
        received: received,
        sent: sent,
        backlog_total: backlog,
        backlog_unread: Math.round(backlog * 0.6),
        backlog_flagged: Math.round(backlog * 0.2),
        first_reply_p50_min: Math.round(30 + Math.random() * 40),
        first_reply_p90_min: Math.round(60 + Math.random() * 80),
        first_reply_within_sla: Math.round(sla * 10) / 10
      },
      internal: {
        received: Math.round(received * 0.2),
        sent: Math.round(sent * 0.15),
        backlog_total: Math.round(backlog * 0.1),
        first_reply_p50_min: Math.round(15 + Math.random() * 20),
        first_reply_within_sla: Math.round((sla + 10) * 10) / 10
      }
    });
  }
  
  return series;
}

// Mock data pour les détails utilisateur
export function mockUserDetail(userId: string, periodDays: number): UserDetailResponse {
  const user = mockUsersList.users.find(u => u.userId === userId);
  
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  
  const externalMetrics = user.metrics.external;
  const avgReceived = Math.round(externalMetrics.received / periodDays);
  const avgSent = Math.round(externalMetrics.sent / periodDays);
  
  return {
    user: {
      upn: user.upn,
      displayName: user.displayName,
      department: user.department,
      manager: "directeur@contoso.com"
    },
    periodDays: periodDays,
    slaHours: 4,
    generatedAt: new Date().toISOString(),
    series: generateTimeseries(
      periodDays,
      avgReceived,
      avgSent,
      externalMetrics.backlog_total || 0,
      externalMetrics.first_reply_within_sla || 75
    ),
    score: {
      totalScore: Math.round(0.6 * (externalMetrics.first_reply_within_sla || 75) + 
                            0.4 * (100 - Math.min(externalMetrics.backlog_total || 0, 80))),
      breakdown: {
        reactivity: externalMetrics.first_reply_within_sla || 75,
        backlog: Math.max(0, 100 - (externalMetrics.backlog_total || 0) * 2),
        efficiency: Math.round((externalMetrics.sent / externalMetrics.received) * 100)
      }
    }
  };
}
