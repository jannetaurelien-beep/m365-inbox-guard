import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, SeverityBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { collaborationKPIs, collaborationFindings, exposedItems, exposedSites } from '@/lib/mock-data/security-audit';
import { AlertTriangle } from 'lucide-react';

export function CollaborationTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {collaborationKPIs.map(k => <SecurityKPICard key={k.label} {...k} />)}
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-amber-600">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Les OneDrive personnels ne sont pas inclus dans ce scan. Couverture limitée aux sites SharePoint d'équipe.</span>
      </div>

      <div className="space-y-3">
        <FindingCard finding={collaborationFindings[0]}>
          <Table>
            <TableHeader><TableRow><TableHead>Élément</TableHead><TableHead>Site</TableHead><TableHead>Drive</TableHead><TableHead>Exposition</TableHead><TableHead>Liens pub.</TableHead><TableHead>Liens org.</TableHead><TableHead>Externes</TableHead><TableHead>Rôle max</TableHead></TableRow></TableHeader>
            <TableBody>
              {exposedItems.map(i => (
                <TableRow key={i.name}>
                  <TableCell className="font-medium text-xs">{i.name}</TableCell>
                  <TableCell className="text-xs">{i.site}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.drive}</TableCell>
                  <TableCell><SeverityBadge severity={i.exposure === 'Lien public' ? 'critical' : 'high'} /></TableCell>
                  <TableCell className={`text-center ${i.publicLinks > 0 ? 'text-red-500 font-bold' : ''}`}>{i.publicLinks}</TableCell>
                  <TableCell className={`text-center ${i.orgLinks > 0 ? 'text-amber-500 font-bold' : ''}`}>{i.orgLinks}</TableCell>
                  <TableCell className="text-center">{i.externals}</TableCell>
                  <TableCell className="text-xs">{i.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        <FindingCard finding={collaborationFindings[1]}>
          <p className="text-sm text-muted-foreground">6 éléments partagés avec des utilisateurs externes identifiés. Vérifier la légitimité de chaque accès.</p>
        </FindingCard>

        <FindingCard finding={collaborationFindings[2]}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {exposedSites.map(s => (
              <div key={s.name} className="rounded-lg border border-border p-4 bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{s.name}</h4>
                  <span className={`text-lg font-bold ${s.score > 70 ? 'text-red-500' : s.score > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>{s.score}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mb-3">{s.url}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Drives:</span> {s.drives}</div>
                  <div><span className="text-muted-foreground">Items:</span> {s.items}</div>
                  <div><span className="text-muted-foreground">Exposés:</span> <span className="text-red-500 font-bold">{s.exposed}</span></div>
                  <div className="flex gap-1 flex-wrap">
                    {s.publicLinks > 0 && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">pub: {s.publicLinks}</Badge>}
                    {s.orgLinks > 0 && <Badge className="text-[10px] px-1.5 py-0 bg-amber-500">org: {s.orgLinks}</Badge>}
                    {s.externals > 0 && <Badge variant="outline" className="text-[10px] px-1.5 py-0">ext: {s.externals}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FindingCard>
      </div>
    </div>
  );
}
