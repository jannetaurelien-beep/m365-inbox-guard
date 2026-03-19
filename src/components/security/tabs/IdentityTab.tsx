import { SecurityKPICard } from '../SecurityKPICard';
import { FindingCard, StatusBadge, SeverityBadge } from '../FindingCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  identityKPIs, identityFindings, criticalAdmins, adminsNoMFA, inactiveAccounts,
  privilegedRoles, tenantConfig, conditionalAccessPolicies, caOverview
} from '@/lib/mock-data/security-audit';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function IdentityTab() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {identityKPIs.map(k => (
          <SecurityKPICard key={k.label} label={k.label} value={k.value} severity={k.severity} />
        ))}
      </div>

      {/* Findings */}
      <div className="space-y-3">
        {/* Critical Admins */}
        <FindingCard finding={identityFindings[0]}>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Nom</TableHead><TableHead>UPN</TableHead><TableHead>Rôle</TableHead><TableHead>Dernière activité</TableHead><TableHead>Niveau</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {criticalAdmins.map(a => (
                <TableRow key={a.upn}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{a.upn}</TableCell>
                  <TableCell className="text-xs">{a.role}</TableCell>
                  <TableCell className="text-xs">{a.lastActivity}</TableCell>
                  <TableCell><SeverityBadge severity="critical" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        {/* All Admins no MFA */}
        <FindingCard finding={identityFindings[1]}>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Nom</TableHead><TableHead>UPN</TableHead><TableHead>Rôle</TableHead><TableHead>Dernière activité</TableHead><TableHead>Niveau</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {adminsNoMFA.map(a => (
                <TableRow key={a.upn}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{a.upn}</TableCell>
                  <TableCell className="text-xs">{a.role}</TableCell>
                  <TableCell className="text-xs">{a.lastActivity}</TableCell>
                  <TableCell><SeverityBadge severity={a.level === 'Critical' ? 'critical' : a.level === 'High' ? 'high' : 'medium'} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        {/* Users no MFA */}
        <FindingCard finding={identityFindings[2]}>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">34 utilisateurs sans MFA sur 342 comptes actifs</span>
            <Progress value={90} className="h-2 flex-1" />
            <span className="font-mono text-xs text-muted-foreground">90% couverts</span>
          </div>
        </FindingCard>

        {/* Inactive */}
        <FindingCard finding={identityFindings[3]}>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(inactiveAccounts).map(([k, v]) => (
              <div key={k} className="rounded-md border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{v}</p>
                <p className="text-xs text-muted-foreground">Inactifs {k}</p>
              </div>
            ))}
          </div>
        </FindingCard>

        {/* Never connected */}
        <FindingCard finding={identityFindings[4]}>
          <p className="text-sm text-muted-foreground">8 comptes créés sans aucune connexion enregistrée. Vérifier s'il s'agit de comptes de service ou d'erreurs de provisioning.</p>
        </FindingCard>

        {/* Privileged Roles */}
        <FindingCard finding={identityFindings[5]}>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Rôle</TableHead><TableHead>Membres</TableHead><TableHead>Risque</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {privilegedRoles.map(r => (
                <TableRow key={r.role}>
                  <TableCell className="font-medium">{r.role}</TableCell>
                  <TableCell>{r.members}</TableCell>
                  <TableCell><SeverityBadge severity={r.risk} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FindingCard>

        {/* Inactive Admins */}
        <FindingCard finding={identityFindings[6]}>
          <p className="text-sm text-muted-foreground">2 comptes avec des rôles administratifs n'ont eu aucune activité depuis plus de 90 jours. Risque d'utilisation frauduleuse.</p>
        </FindingCard>

        {/* Tenant Config */}
        <FindingCard finding={identityFindings[7]}>
          <div className="space-y-2">
            {tenantConfig.map(c => (
              <div key={c.setting} className="flex items-center gap-3 p-2 rounded-md bg-background/50">
                <StatusBadge status={c.status} />
                <span className="text-sm font-medium flex-1">{c.setting}</span>
                <span className="text-xs text-muted-foreground">{c.detail}</span>
              </div>
            ))}
          </div>
        </FindingCard>

        {/* Conditional Access */}
        <FindingCard finding={identityFindings[8]}>
          <div className="space-y-4">
            {/* Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { label: 'Security Defaults', ok: caOverview.securityDefaults },
                { label: 'MFA pour tous', ok: caOverview.mfaForAll },
                { label: 'Legacy auth bloquée', ok: caOverview.legacyAuthBlocked },
                { label: 'Accès lié device', ok: caOverview.deviceBound },
                { label: 'Restriction lieu', ok: caOverview.locationRestricted },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 p-2 rounded-md bg-background/50">
                  {item.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>
            {/* Policies Table */}
            <Table>
              <TableHeader>
                <TableRow><TableHead>Policy</TableHead><TableHead>État</TableHead><TableHead>Cible</TableHead><TableHead>Grant</TableHead><TableHead>MFA</TableHead><TableHead>Block</TableHead><TableHead>Device</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {conditionalAccessPolicies.map(p => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium text-xs">{p.name}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${p.state === 'Activée' ? 'text-emerald-500' : p.state === 'Désactivée' ? 'text-red-500' : 'text-amber-500'}`}>
                        {p.state}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{p.global ? 'Globale' : 'Ciblée'}</TableCell>
                    <TableCell className="text-xs">{p.grant}</TableCell>
                    <TableCell>{p.mfa ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground/30" />}</TableCell>
                    <TableCell>{p.block ? <XCircle className="h-4 w-4 text-red-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground/30" />}</TableCell>
                    <TableCell>{p.device ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground/30" />}</TableCell>
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
