import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, SeverityBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import {
  hygieneKPIs, hygieneFindings, ualStatus, smtpAuth,
  transportRules, legacyAuth
} from '@/lib/mock-data/security-audit';

export function HygieneTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {hygieneKPIs.map(k => <SecurityKPICard key={k.label} {...k} />)}
      </div>

      {/* UAL + SMTP Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-4 bg-background/50">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Unified Audit Log</h4>
          <div className="flex items-center gap-2">
            {ualStatus.enabled ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            <span className="font-semibold">{ualStatus.enabled ? 'Activé' : 'Désactivé'}</span>
            {!ualStatus.available && <Badge variant="outline" className="text-xs">Non disponible</Badge>}
          </div>
        </div>
        <div className="rounded-lg border border-border p-4 bg-background/50">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">SMTP AUTH</h4>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-bold text-red-500">{smtpAuth.enabled}</span>
            <span className="text-xs text-muted-foreground">activés / {smtpAuth.total}</span>
          </div>
          <Progress value={(smtpAuth.disabled / smtpAuth.total) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{Math.round((smtpAuth.disabled / smtpAuth.total) * 100)}% désactivés</p>
        </div>
      </div>

      <div className="space-y-3">
        <FindingCard finding={hygieneFindings[0]}>
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>État</TableHead><TableHead>Priorité</TableHead><TableHead>Bypass Spam</TableHead><TableHead>BCC caché</TableHead><TableHead>Redirection</TableHead></TableRow></TableHeader>
            <TableBody>
              {transportRules.map(r => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium text-xs">{r.name}</TableCell>
                  <TableCell className="text-xs">{r.state}</TableCell>
                  <TableCell className="text-center">{r.priority}</TableCell>
                  <TableCell>{r.bypassSpam ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <span className="text-muted-foreground/30">—</span>}</TableCell>
                  <TableCell>{r.hiddenBcc ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <span className="text-muted-foreground/30">—</span>}</TableCell>
                  <TableCell>{r.redirect ? <XCircle className="h-4 w-4 text-red-500" /> : <span className="text-muted-foreground/30">—</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        <FindingCard finding={hygieneFindings[1]}>
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-sm text-red-500">
            Le domaine distant wildcard (*) autorise l'auto-forwarding. Tout utilisateur peut rediriger ses emails vers l'extérieur.
          </div>
        </FindingCard>

        <FindingCard finding={hygieneFindings[2]}>
          <p className="text-sm text-muted-foreground">2 adresses IP dans la liste blanche EOP. Vérifier la légitimité et documenter la raison.</p>
        </FindingCard>

        <FindingCard finding={hygieneFindings[3]}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{legacyAuth.users}</p>
                <p className="text-xs text-muted-foreground">Utilisateurs</p>
              </div>
              <div className="rounded-md border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{legacyAuth.events}</p>
                <p className="text-xs text-muted-foreground">Événements</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">Clients</p>
                <div className="flex flex-wrap gap-1">
                  {legacyAuth.clients.map(c => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                </div>
              </div>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>UPN</TableHead><TableHead>Client legacy</TableHead><TableHead>CA Status</TableHead><TableHead>Occurrences</TableHead></TableRow></TableHeader>
              <TableBody>
                {legacyAuth.details.map(d => (
                  <TableRow key={d.upn}>
                    <TableCell className="font-medium">{d.user}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{d.upn}</TableCell>
                    <TableCell className="text-xs">{d.client}</TableCell>
                    <TableCell><SeverityBadge severity={d.caStatus === 'Bloqué CA' ? 'healthy' : 'high'} /></TableCell>
                    <TableCell className="font-bold">{d.occurrences}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </FindingCard>
      </div>
    </div>
  );
}
