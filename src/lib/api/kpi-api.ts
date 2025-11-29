import { TenantOverviewResponse, UsersListResponse, UserDetailResponse } from '../types/kpi';

// Fonction helper pour construire l'URL avec les params
function buildUrl(endpoint: string, params: Record<string, string | number | null | undefined>): string {
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

export async function fetchTenantOverview(
  periodDays: number,
  client?: string,
  accountType?: string | null,
  domain?: string | null
): Promise<TenantOverviewResponse> {
  const url = buildUrl('/api/mail-kpis/tenant/', {
    periodDays,
    client,
    accountType,
    domain,
  });
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tenant overview: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUsersList(
  periodDays: number,
  client?: string,
  accountType?: string | null,
  domain?: string | null
): Promise<UsersListResponse> {
  const url = buildUrl('/api/mail-kpis/users-summary/', {
    periodDays,
    client,
    accountType,
    domain,
  });
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch users list: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUserDetail(
  userId: string,
  periodDays: number,
  groupBy: 'day' | 'week' | 'month'
): Promise<UserDetailResponse> {
  const url = buildUrl(`/api/mail-kpis/users/${userId}/detail/`, {
    periodDays,
    groupBy,
  });
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch user detail: ${response.statusText}`);
  }
  return response.json();
}
