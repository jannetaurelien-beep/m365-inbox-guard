import { TenantOverviewResponse, UsersListResponse, UserDetailResponse } from '../types/kpi';
import { mockTenantOverview, mockUsersList, mockUserDetail } from '../mock-data/kpi-mock';

// Simulation d'un délai réseau pour rendre l'interface plus réaliste
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTenantOverview(
  periodDays: number,
  client?: string,
  accountType?: string | null,
  domain?: string | null
): Promise<TenantOverviewResponse> {
  await simulateDelay();
  
  // Retourner les données mockées avec la période demandée
  const data = { ...mockTenantOverview, periodDays };
  
  // Filtrer les top users par accountType si spécifié
  if (accountType) {
    data.topUsers = data.topUsers.filter(u => u.accountType === accountType);
  }
  
  // Filtrer par domaine si spécifié
  if (domain) {
    data.topUsers = data.topUsers.filter(u => u.upn.endsWith(`@${domain}`));
  }
  
  return data;
}

export async function fetchUsersList(
  periodDays: number,
  client?: string,
  accountType?: string | null,
  domain?: string | null
): Promise<UsersListResponse> {
  await simulateDelay();
  
  let users = [...mockUsersList.users];
  
  // Filtrer par accountType si spécifié
  if (accountType) {
    users = users.filter(u => u.accountType === accountType);
  }
  
  // Filtrer par domaine si spécifié
  if (domain) {
    users = users.filter(u => u.upn.endsWith(`@${domain}`));
  }
  
  return {
    periodDays,
    generatedAt: new Date().toISOString(),
    users
  };
}

export async function fetchUserDetail(
  userId: string,
  periodDays: number,
  groupBy: 'day' | 'week' | 'month'
): Promise<UserDetailResponse> {
  await simulateDelay(300);
  
  // Générer les données de détail pour l'utilisateur
  return mockUserDetail(userId, periodDays);
}
