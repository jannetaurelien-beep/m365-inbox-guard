import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, SeverityBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { appsKPIs, appsFindings, sensitiveApps, appCredentials } from '@/lib/mock-data/security-audit';

export function AppsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {appsKPIs.map(k => <SecurityKPICard key={k.label} {...k} />)}
      </div>

      <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground">
        <strong>Baseline attendue :</strong> 2 propriétaires minimum, pas de rôle d'annuaire, pas de consentement global inutile, credentials sous contrôle.
      </div>

      <div className="space-y-3">
        <FindingCard finding={appsFindings[0]}>
          <Table>
            <TableHeader><TableRow><TableHead>Application</TableHead><TableHead>Gouvernance</TableHead><TableHead>Exposition</TableHead><TableHead>Propriétaires</TableHead><TableHead>Rôles Dir.</TableHead><TableHead>Vérifié</TableHead><TableHead>Permissions</TableHead></TableRow></TableHeader>
            <TableBody>
              {sensitiveApps.map(a => (
                <TableRow key={a.name} className={a.disabled ? 'opacity-50' : ''}>
                  <TableCell className="font-medium text-sm">
                    {a.name}
                    {a.disabled && <Badge variant="outline" className="ml-2 text-xs">Désactivée</Badge>}
                  </TableCell>
                  <TableCell className="text-xs">{a.governance}</TableCell>
                  <TableCell><SeverityBadge severity={a.exposure === 'Critique' ? 'critical' : a.exposure === 'Élevée' ? 'high' : 'medium'} /></TableCell>
                  <TableCell className={`text-center ${a.owners < 2 ? 'text-red-500 font-bold' : ''}`}>{a.owners}</TableCell>
                  <TableCell className={`text-center ${a.directoryRoles > 0 ? 'text-red-500 font-bold' : ''}`}>{a.directoryRoles}</TableCell>
                  <TableCell className="text-xs">{a.verified ? '✓ Vérifié' : '✗ Non vérifié'}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground max-w-[200px] truncate">{a.permissions.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        <FindingCard finding={appsFindings[1]}>
          <Table>
            <TableHeader><TableRow><TableHead>Application</TableHead><TableHead>Propriétaires</TableHead><TableHead>Posture</TableHead></TableRow></TableHeader>
            <TableBody>
              {sensitiveApps.map(a => (
                <TableRow key={a.name}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className={a.owners < 2 ? 'text-red-500 font-bold' : ''}>{a.owners}</TableCell>
                  <TableCell><SeverityBadge severity={a.owners === 0 ? 'critical' : a.owners < 2 ? 'high' : 'healthy'} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        <FindingCard finding={appsFindings[2]}>
          <Table>
            <TableHeader><TableRow><TableHead>Application</TableHead><TableHead>Type</TableHead><TableHead>Échéance</TableHead><TableHead>Jours restants</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader>
            <TableBody>
              {appCredentials.map(c => (
                <TableRow key={`${c.app}-${c.type}`}>
                  <TableCell className="font-medium">{c.app}</TableCell>
                  <TableCell className="text-xs">{c.type}</TableCell>
                  <TableCell className="text-xs font-mono">{c.expiry}</TableCell>
                  <TableCell className={`font-bold ${c.expired ? 'text-red-500' : c.daysLeft <= 7 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {c.expired ? `Expiré (${Math.abs(c.daysLeft)}j)` : `${c.daysLeft}j`}
                  </TableCell>
                  <TableCell><SeverityBadge severity={c.expired ? 'critical' : c.daysLeft <= 7 ? 'high' : 'healthy'} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>
      </div>
    </div>
  );
}
