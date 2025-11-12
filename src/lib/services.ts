// Services mock pour simuler les appels API
import { mockUsers, mockLicenses, mockRequests, User, MemberRole } from './mock-data';
import { toast } from 'sonner';

export const userService = {
  async createUser(data: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    metier: string;
    agence: string;
    password: string;
    typeBoite: 'nominative' | 'partagee';
    licenceSkuId: string;
  }): Promise<{ success: boolean; userId?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const userId = `usr_${Date.now()}`;
    console.log(`[AUDIT] User created: ${userId}`, { ...data, password: '***MASKED***' });
    return { success: true, userId };
  },

  async getUser(id: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.find(u => u.id === id);
  },

  async updateUser(id: string, data: Partial<User>): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[AUDIT] Update user ${id}:`, data);
    return { success: true };
  },

  async revealPassword(id: string): Promise<{ password: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`[AUDIT] Password reveal requested for user ${id} by ADMIN`);
    return { password: 'a********Z9' }; // Version masquée
  },

  async resetPassword(id: string): Promise<{ tempPassword: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`[AUDIT] Password reset for user ${id}`);
    return { tempPassword: 'Temp12345!' };
  },

  async deleteUser(id: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`[AUDIT] User ${id} deleted`);
    return { success: true };
  },

  async deactivateUser(id: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[AUDIT] User ${id} deactivated`);
    return { success: true };
  },
};

export const mailboxService = {
  async addAlias(userId: string, alias: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[AUDIT] Alias ${alias} added to user ${userId}`);
    return { success: true };
  },

  async removeAlias(userId: string, alias: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[AUDIT] Alias ${alias} removed from user ${userId}`);
    return { success: true };
  },

  async addMember(mailboxId: string, userId: string, role: MemberRole): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[AUDIT] Member ${userId} added to mailbox ${mailboxId} with role ${role}`);
    return { success: true };
  },

  async removeMember(mailboxId: string, memberId: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[AUDIT] Member ${memberId} removed from mailbox ${mailboxId}`);
    return { success: true };
  },

  async convertToUser(mailboxId: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`[AUDIT] Mailbox ${mailboxId} converted to user mailbox`);
    return { success: true };
  },

  async requestArchive(userId: string, startDate: string, endDate: string): Promise<{ success: boolean; requestId: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`[AUDIT] Archive request created for user ${userId} (${startDate} to ${endDate})`);
    return { success: true, requestId: `req_${Date.now()}` };
  },
};

export const licenseService = {
  async upgradeLicense(userId: string, skuId: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const license = mockLicenses.find(l => l.skuId === skuId);
    console.log(`[AUDIT] License upgrade requested for user ${userId} to ${license?.label}`);
    return { success: true };
  },

  getLicenses() {
    return mockLicenses;
  },
};

export const exportService = {
  exportUsersToCSV(users: User[]) {
    const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Métier', 'Agence', 'Type', 'Statut', 'Licence', 'Stockage (Go)'];
    const rows = users.map(u => [
      u.id,
      u.prenom,
      u.nom,
      u.email,
      u.metier,
      u.agence,
      u.typeBoite,
      u.status,
      u.licence.label,
      u.stockage.utiliseGo.toString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Export CSV réussi');
  },
};
