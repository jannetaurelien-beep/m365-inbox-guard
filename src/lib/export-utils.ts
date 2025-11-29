import { MailUserSummary, UserGroup } from './types/kpi';

// Export des utilisateurs en CSV
export function exportUsersToCSV(users: MailUserSummary[], filename: string = 'utilisateurs-kpi.csv') {
  const headers = [
    'Nom',
    'Email (UPN)',
    'Département',
    'Agence',
    'Localisation',
    'Poste',
    'Type de compte',
    'Score estimé',
    'SLA externe (%)',
    'Backlog total',
    'Backlog non lu',
    'Emails reçus (externes)',
    'Emails envoyés (externes)',
    'Délai P50 (min)',
    'Délai P90 (min)',
    'Emails reçus (internes)',
    'Emails envoyés (internes)',
    'Emails reçus (total)',
    'Emails envoyés (total)',
  ];

  const rows = users.map(user => {
    const sla = user.metrics.external.first_reply_within_sla || 0;
    const backlog = user.metrics.external.backlog_total || 0;
    const score = Math.round(0.6 * sla + 0.4 * (100 - Math.min(backlog, 80)));

    return [
      user.displayName,
      user.upn,
      user.department || '',
      user.agency || '',
      user.location || '',
      user.jobTitle || '',
      user.accountType || 'Utilisateur',
      score.toString(),
      (user.metrics.external.first_reply_within_sla || 0).toFixed(2),
      (user.metrics.external.backlog_total || 0).toString(),
      (user.metrics.external.backlog_unread || 0).toString(),
      user.metrics.external.received.toString(),
      user.metrics.external.sent.toString(),
      (user.metrics.external.first_reply_p50_min || 0).toFixed(2),
      (user.metrics.external.first_reply_p90_min || 0).toFixed(2),
      user.metrics.internal.received.toString(),
      user.metrics.internal.sent.toString(),
      user.metrics.total.received.toString(),
      user.metrics.total.sent.toString(),
    ];
  });

  downloadCSV([headers, ...rows], filename);
}

// Export des groupes en CSV
export function exportGroupsToCSV(
  groups: UserGroup[],
  users: MailUserSummary[],
  filename: string = 'groupes-kpi.csv'
) {
  const headers = [
    'Nom du groupe',
    'Description',
    'Nombre de membres',
    'SLA moyen (%)',
    'Backlog moyen',
    'Délai P50 moyen (min)',
    'Emails reçus (total)',
    'Emails envoyés (total)',
    'Date de création',
    'Dernière modification',
  ];

  const rows = groups.map(group => {
    const groupUsers = users.filter(u => group.userIds.includes(u.userId));
    
    const avgSla = groupUsers.length > 0
      ? groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_within_sla || 0), 0) / groupUsers.length
      : 0;
    
    const avgBacklog = groupUsers.length > 0
      ? groupUsers.reduce((sum, u) => sum + (u.metrics.external.backlog_total || 0), 0) / groupUsers.length
      : 0;
    
    const avgDelayP50 = groupUsers.length > 0
      ? groupUsers.reduce((sum, u) => sum + (u.metrics.external.first_reply_p50_min || 0), 0) / groupUsers.length
      : 0;
    
    const totalReceived = groupUsers.reduce((sum, u) => sum + u.metrics.external.received, 0);
    const totalSent = groupUsers.reduce((sum, u) => sum + u.metrics.external.sent, 0);

    return [
      group.name,
      group.description || '',
      groupUsers.length.toString(),
      avgSla.toFixed(2),
      avgBacklog.toFixed(2),
      avgDelayP50.toFixed(2),
      totalReceived.toString(),
      totalSent.toString(),
      new Date(group.createdAt).toLocaleDateString('fr-FR'),
      new Date(group.updatedAt).toLocaleDateString('fr-FR'),
    ];
  });

  downloadCSV([headers, ...rows], filename);
}

// Export des membres d'un groupe en CSV
export function exportGroupMembersToCSV(
  group: UserGroup,
  users: MailUserSummary[],
  filename?: string
) {
  const groupUsers = users.filter(u => group.userIds.includes(u.userId));
  const actualFilename = filename || `groupe-${group.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
  
  exportUsersToCSV(groupUsers, actualFilename);
}

// Fonction utilitaire pour télécharger un CSV
function downloadCSV(data: string[][], filename: string) {
  // Échapper les guillemets et entourer les champs de guillemets si nécessaire
  const escapeCSVField = (field: string): string => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  // Convertir les données en CSV
  const csv = data
    .map(row => row.map(escapeCSVField).join(','))
    .join('\n');

  // Ajouter le BOM UTF-8 pour Excel
  const BOM = '\uFEFF';
  const csvContent = BOM + csv;

  // Créer un blob et télécharger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Export au format JSON (pour import/backup)
export function exportToJSON<T>(data: T, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
