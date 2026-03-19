import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, SeverityBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { devicesKPIs, devicesFindings, deviceQuickCards, deviceList } from '@/lib/mock-data/security-audit';

export function DevicesTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {devicesKPIs.map(k => <SecurityKPICard key={k.label} {...k} />)}
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Appareils gérés', ...deviceQuickCards.managed },
          { label: 'Conformes Intune', ...deviceQuickCards.compliant },
          { label: 'Obsolètes 90j+', ...deviceQuickCards.stale90 },
        ].map(c => (
          <div key={c.label} className="rounded-lg border border-border p-4 bg-background/50">
            <p className="text-xs text-muted-foreground mb-2">{c.label}</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">{c.value}</span>
              <span className="text-xs text-muted-foreground">/ {c.total}</span>
            </div>
            <Progress value={c.pct} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{c.pct}%</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <FindingCard finding={devicesFindings[0]}>
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>OS</TableHead><TableHead>Gestion</TableHead><TableHead>Conformité</TableHead><TableHead>Dernière activité</TableHead><TableHead>Jours inactif</TableHead></TableRow></TableHeader>
            <TableBody>
              {deviceList.map(d => (
                <TableRow key={d.name}>
                  <TableCell className="font-medium font-mono text-xs">{d.name}</TableCell>
                  <TableCell className="text-xs">{d.os}</TableCell>
                  <TableCell className="text-xs">{d.management}</TableCell>
                  <TableCell><SeverityBadge severity={d.compliance === 'Conforme' ? 'healthy' : d.compliance === 'Non conforme' ? 'critical' : 'info'} /></TableCell>
                  <TableCell className="text-xs">{d.lastActivity || 'Jamais'}</TableCell>
                  <TableCell className={`font-bold ${!d.daysInactive ? 'text-muted-foreground' : d.daysInactive > 180 ? 'text-red-500' : d.daysInactive > 90 ? 'text-amber-500' : ''}`}>
                    {d.daysInactive ?? '∞'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>
      </div>
    </div>
  );
}
