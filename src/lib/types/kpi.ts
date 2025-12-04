// Types pour les KPIs e-mail

export interface MailUserMetricsSub {
  received: number;
  sent: number;
  backlog_total: number;
  backlog_unread?: number;
  backlog_flagged?: number;
  first_reply_p50_min?: number;
  first_reply_p90_min?: number;
  first_reply_within_sla?: number;
  samples?: number;
}

export interface MailUserSummary {
  userId: string;
  upn: string;
  displayName: string;
  department?: string;
  agency?: string;
  location?: string;
  jobTitle?: string;
  accountType?: "Utilisateur" | "Boîte partagée";
  metrics: {
    total: MailUserMetricsSub;
    external: MailUserMetricsSub;
    internal: MailUserMetricsSub;
  };
}

export interface Alert {
  type: "info" | "warning" | "critical";
  title: string;
  detail: string;
}

export interface TenantOverviewResponse {
  periodDays: number;
  tenant: {
    name: string;
    domains: string[];
  };
  totals: {
    received: number;
    sent: number;
  };
  external: {
    first_reply_p50_min: number;
    within_sla: number;
    avg_backlog_total: number;
  };
  topUsers: MailUserSummary[];
  alerts: Alert[];
}

export interface UsersListResponse {
  periodDays: number;
  generatedAt: string;
  users: MailUserSummary[];
}

export interface UserTimeseriesPoint {
  date: string; // YYYY-MM-DD
  external: MailUserMetricsSub;
  internal: MailUserMetricsSub;
}

export interface UserDetailResponse {
  user: {
    upn: string;
    displayName: string;
    manager?: string;
    department?: string;
    agency?: string;
    location?: string;
    jobTitle?: string;
  };
  periodDays: number;
  slaHours: number;
  generatedAt?: string;
  series: UserTimeseriesPoint[];
  score: {
    totalScore: number;
    breakdown: {
      reactivity: number;
      backlog: number;
      efficiency: number;
    };
  };
}

export type AccountFilterType = "user" | "shared" | "all";
export type FocusFilterType = "all" | "high-backlog" | "low-sla" | "anomalies";
export type GroupByType = "day" | "week" | "month";
export type MetricType = "external" | "internal" | "total";

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  userIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AgencyMetrics {
  agency: string;
  userCount: number;
  metrics: {
    total: MailUserMetricsSub;
    external: MailUserMetricsSub;
    internal: MailUserMetricsSub;
  };
  avgScore?: number;
}

export interface DomainMetrics {
  domain: string;
  userCount: number;
  metrics: {
    total: MailUserMetricsSub;
    external: MailUserMetricsSub;
    internal: MailUserMetricsSub;
  };
  avgScore?: number;
}

export interface GroupPerformance {
  group: UserGroup;
  metrics: {
    total: MailUserMetricsSub;
    external: MailUserMetricsSub;
    internal: MailUserMetricsSub;
  };
  users: MailUserSummary[];
  avgScore?: number;
}
