import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, SeverityBadge, StatusBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dnsKPIs, dnsFindings, dnsDomains } from '@/lib/mock-data/security-audit';

export function DnsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {dnsKPIs.map(k => <SecurityKPICard key={k.label} {...k} />)}
      </div>

      <div className="space-y-3">
        <FindingCard finding={dnsFindings[0]}>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Domaine</TableHead><TableHead>SPF</TableHead><TableHead>DKIM</TableHead><TableHead>DMARC</TableHead><TableHead>Politique DMARC</TableHead><TableHead>SPF Hard Fail</TableHead><TableHead>DKIM Sélecteurs</TableHead><TableHead>Risque</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {dnsDomains.map(d => (
                <TableRow key={d.domain}>
                  <TableCell className="font-medium font-mono text-sm">{d.domain}</TableCell>
                  <TableCell><StatusBadge status={d.spf} /></TableCell>
                  <TableCell><StatusBadge status={d.dkim} /></TableCell>
                  <TableCell><StatusBadge status={d.dmarc} /></TableCell>
                  <TableCell className="text-xs font-mono">{d.dmarcPolicy}</TableCell>
                  <TableCell className="text-xs">{d.spfHardFail ? '✓' : '✗'}</TableCell>
                  <TableCell className="text-xs">{d.dkimSelectors ? '✓' : '✗'}</TableCell>
                  <TableCell><SeverityBadge severity={d.risk} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>
      </div>
    </div>
  );
}
