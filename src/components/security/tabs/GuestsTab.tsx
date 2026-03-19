import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, SeverityBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { guestsKPIs, guestsFindings, guestUsers, guestSettings } from '@/lib/mock-data/security-audit';
import { Settings } from 'lucide-react';

export function GuestsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {guestsKPIs.map(k => <SecurityKPICard key={k.label} {...k} />)}
      </div>

      {/* External Collaboration Settings */}
      <div className="rounded-lg border border-border p-4 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Paramètres collaboration externe</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-muted-foreground">Source invitations :</span> <span className="font-medium">{guestSettings.invitationSource}</span></div>
          <div><span className="text-muted-foreground">Email vérifiés :</span> <span className="font-medium">{guestSettings.emailVerifiedAllowed ? 'Autorisés' : 'Bloqués'}</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <FindingCard finding={guestsFindings[0]}>
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Email</TableHead><TableHead>Dernière connexion</TableHead><TableHead>Jours inactif</TableHead><TableHead>Licence</TableHead><TableHead>État</TableHead></TableRow></TableHeader>
            <TableBody>
              {guestUsers.map(g => (
                <TableRow key={g.email}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{g.email}</TableCell>
                  <TableCell className="text-xs">{g.lastLogin || '—'}</TableCell>
                  <TableCell className={`font-bold ${!g.daysInactive ? 'text-muted-foreground' : g.daysInactive > 90 ? 'text-red-500' : g.daysInactive > 30 ? 'text-amber-500' : ''}`}>
                    {g.daysInactive ?? '∞'}
                  </TableCell>
                  <TableCell>
                    {g.license ? <Badge className="text-xs bg-amber-500">{g.license}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell><SeverityBadge severity={g.state === 'Actif' ? 'healthy' : g.state === 'Jamais connecté' ? 'medium' : 'high'} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>
      </div>
    </div>
  );
}
