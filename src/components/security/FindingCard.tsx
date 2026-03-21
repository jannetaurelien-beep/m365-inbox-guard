import { useState } from 'react';
import { ChevronDown, ChevronRight, ShieldAlert, AlertTriangle, AlertCircle, Info, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Finding, FindingStatus, Severity } from '@/lib/mock-data/security-audit';

const severityConfig: Record<Severity, { bg: string; text: string; border: string; icon: typeof AlertTriangle; accent: string }> = {
  critical: { bg: 'bg-red-500/5', text: 'text-red-500', border: 'border-red-500/20', icon: ShieldAlert, accent: 'bg-red-500' },
  high: { bg: 'bg-orange-500/5', text: 'text-orange-500', border: 'border-orange-500/20', icon: AlertTriangle, accent: 'bg-orange-500' },
  medium: { bg: 'bg-amber-500/5', text: 'text-amber-500', border: 'border-amber-500/20', icon: AlertCircle, accent: 'bg-amber-500' },
  info: { bg: 'bg-primary/5', text: 'text-primary', border: 'border-primary/20', icon: Info, accent: 'bg-primary' },
  healthy: { bg: 'bg-emerald-500/5', text: 'text-emerald-500', border: 'border-emerald-500/20', icon: CheckCircle2, accent: 'bg-emerald-500' },
};

const statusLabels: Record<FindingStatus, { label: string; color: string }> = {
  ok: { label: 'Conforme', color: 'text-emerald-500' },
  ko: { label: 'Non conforme', color: 'text-red-500' },
  warning: { label: 'Attention', color: 'text-amber-500' },
  not_audited: { label: 'Non audité', color: 'text-muted-foreground' },
  partial: { label: 'Partiel', color: 'text-primary' },
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${config.border} overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      {/* Left accent bar */}
      <div className="flex">
        <div className={`w-1 shrink-0 ${config.accent}`} />
        <div className="flex-1">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
          >
            <div className={`p-1.5 rounded-lg ${config.bg}`}>
              <Icon className={`h-4 w-4 ${config.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{finding.title}</span>
                <span className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${config.bg} ${config.text}`}>{finding.count}</span>
                <span className={`text-xs ${status.color}`}>— {status.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{finding.summary}</p>
            </div>
            {children && (
              <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.div>
            )}
          </button>
          {children && (
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 border-t border-border/50">
                    {children}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
      {labels[severity]}
    </span>
  );
}
