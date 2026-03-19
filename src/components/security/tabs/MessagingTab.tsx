import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, StatusBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  messagingKPIs, messagingFindings, forwardingRules, suspiciousRules,
  autoReplies, defenderControls
} from '@/lib/mock-data/security-audit';

function BoolIcon({ val }: { val: boolean }) {
  return val ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
}

export function MessagingTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {messagingKPIs.map(k => <SecurityKPICard key={k.label} {...k} />)}
      </div>

      <div className="space-y-3">
        <FindingCard finding={messagingFindings[0]}>
          <Table>
            <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>UPN</TableHead><TableHead>Redirection</TableHead><TableHead>Copie locale</TableHead></TableRow></TableHeader>
            <TableBody>
              {forwardingRules.map(r => (
                <TableRow key={r.upn}>
                  <TableCell className="font-medium">{r.user}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{r.upn}</TableCell>
                  <TableCell className="text-xs text-red-500">{r.forwardTo}</TableCell>
                  <TableCell>{r.localCopy ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        <FindingCard finding={messagingFindings[1]}>
          <Table>
            <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>Règle</TableHead><TableHead>Adresses externes</TableHead></TableRow></TableHeader>
            <TableBody>
              {suspiciousRules.map(r => (
                <TableRow key={r.ruleName}>
                  <TableCell className="font-medium">{r.user}</TableCell>
                  <TableCell className="text-xs">{r.ruleName}</TableCell>
                  <TableCell className="text-xs text-red-500 font-mono">{r.externalAddresses.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        <FindingCard finding={messagingFindings[2]}>
          <Table>
            <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>UPN</TableHead><TableHead>État</TableHead><TableHead>Audience</TableHead></TableRow></TableHeader>
            <TableBody>
              {autoReplies.map(r => (
                <TableRow key={r.upn}>
                  <TableCell className="font-medium">{r.user}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{r.upn}</TableCell>
                  <TableCell className="text-xs">{r.state}</TableCell>
                  <TableCell className="text-xs">{r.audience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        <FindingCard finding={messagingFindings[3]}>
          <div className="space-y-4">
            {/* Anti-Phishing */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Anti-Phishing</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Spoof Intelligence', val: defenderControls.antiPhishing.spoofIntel },
                  { label: 'Mailbox Intelligence', val: defenderControls.antiPhishing.mailboxIntel },
                  { label: 'Mailbox Intel Protection', val: defenderControls.antiPhishing.mailboxIntelProtection },
                  { label: 'DMARC Respect', val: defenderControls.antiPhishing.dmarcRespect },
                  { label: `Seuil Phishing ≥2 (${defenderControls.antiPhishing.phishThreshold})`, val: defenderControls.antiPhishing.phishThreshold >= 2 },
                  { label: 'First-Contact Tips', val: defenderControls.antiPhishing.firstContactTips },
                  { label: 'Via Tag', val: defenderControls.antiPhishing.viaTag },
                ].map(i => (
                  <div key={i.label} className="flex items-center gap-2 p-2 rounded bg-background/50 text-xs">
                    <BoolIcon val={i.val} /> <span>{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Safe Links */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Safe Links</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Protection email', val: defenderControls.safeLinks.emailProtection },
                  { label: 'Scan temps réel', val: defenderControls.safeLinks.realTimeScan },
                  { label: 'Block click-through', val: defenderControls.safeLinks.blockClickThrough },
                  { label: 'Protection Teams', val: defenderControls.safeLinks.teamsProtection },
                  { label: 'Protection Office', val: defenderControls.safeLinks.officeProtection },
                  { label: 'Click tracking', val: defenderControls.safeLinks.clickTracking },
                ].map(i => (
                  <div key={i.label} className="flex items-center gap-2 p-2 rounded bg-background/50 text-xs">
                    <BoolIcon val={i.val} /> <span>{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Safe Attachments */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Safe Attachments</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2 p-2 rounded bg-background/50 text-xs"><BoolIcon val={defenderControls.safeAttachments.enabled} /> Activé</div>
                <div className="flex items-center gap-2 p-2 rounded bg-background/50 text-xs"><BoolIcon val={defenderControls.safeAttachments.action === 'Block' || defenderControls.safeAttachments.action === 'DynamicDelivery'} /> Action: {defenderControls.safeAttachments.action}</div>
                <div className="flex items-center gap-2 p-2 rounded bg-background/50 text-xs"><BoolIcon val={defenderControls.safeAttachments.errorAction === 'Block'} /> Erreur: {defenderControls.safeAttachments.errorAction}</div>
              </div>
            </div>
            {/* Outbound Spam */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outbound Spam</h4>
              <div className="flex items-center gap-2 p-2 rounded bg-background/50 text-xs">
                <BoolIcon val={defenderControls.outboundSpam.autoForwardingBlocked} /> Auto-forwarding externe bloqué (Mode: {defenderControls.outboundSpam.mode})
              </div>
            </div>
          </div>
        </FindingCard>
      </div>
    </div>
  );
}
