import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Finding, FindingStatus, Severity } from '@/lib/mock-data/security-audit';

const severityConfig: Record<Severity, { bg: string; text: string; border: string; icon: typeof AlertTriangle }> = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', icon: ShieldAlert },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30', icon: AlertTriangle },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', icon: AlertCircle },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', icon: Info },
  healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', icon: CheckCircle2 },
};

const statusLabels: Record<FindingStatus, { label: string; color: string }> = {
  ok: { label: 'OK', color: 'text-emerald-500' },
  ko: { label: 'Non conforme', color: 'text-red-500' },
  warning: { label: 'Attention', color: 'text-amber-500' },
  not_audited: { label: 'Non audité', color: 'text-muted-foreground' },
  partial: { label: 'Partiel', color: 'text-blue-500' },
};

interface FindingCardProps {
  finding: Finding;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export function FindingCard({ finding, children, defaultOpen }: FindingCardProps) {
  const autoOpen = defaultOpen ?? finding.severity === 'critical';
  const [open, setOpen] = useState(autoOpen);
  const config = severityConfig[finding.severity];
  const status = statusLabels[finding.status];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-background/30 transition-colors"
      >
        <Icon className={`h-5 w-5 ${config.text} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{finding.title}</span>
            <span className={`text-xs font-mono font-bold ${config.text}`}>{finding.count}</span>
            <span className={`text-xs ${status.color}`}>• {status.label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{finding.summary}</p>
        </div>
        {children && (
          open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {children && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: FindingStatus }) {
  const icons: Record<FindingStatus, typeof CheckCircle2> = {
    ok: CheckCircle2,
    ko: ShieldAlert,
    warning: AlertCircle,
    not_audited: HelpCircle,
    partial: Info,
  };
  const config = statusLabels[status];
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${config.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const labels: Record<Severity, string> = { critical: 'Critique', high: 'Élevé', medium: 'Moyen', info: 'Info', healthy: 'Sain' };
  const config = severityConfig[severity];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {labels[severity]}
    </span>
  );
}
