import { motion } from 'framer-motion';
import type { Severity } from '@/lib/mock-data/security-audit';

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  critical: { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-500', glow: 'shadow-red-500/10' },
  high: { border: 'border-orange-500/30', bg: 'bg-orange-500/5', text: 'text-orange-500', glow: 'shadow-orange-500/10' },
  medium: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-500', glow: 'shadow-amber-500/10' },
  warning: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-500', glow: 'shadow-amber-500/10' },
  info: { border: 'border-primary/20', bg: 'bg-primary/5', text: 'text-primary', glow: 'shadow-primary/10' },
  healthy: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-500', glow: 'shadow-emerald-500/10' },
  destructive: { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-500', glow: 'shadow-red-500/10' },
};

interface SecurityKPIProps {
  label: string;
  value: string | number;
  severity?: Severity | 'warning' | 'destructive';
  index?: number;
}

export function SecurityKPICard({ label, value, severity = 'info', index = 0 }: SecurityKPIProps) {
  const c = colorMap[severity] || colorMap.info;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`relative rounded-xl border ${c.border} ${c.bg} p-4 shadow-lg ${c.glow} overflow-hidden group hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Subtle pulse indicator for critical */}
      {(severity === 'critical' || severity === 'destructive') && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black mt-1.5 ${c.text} tracking-tight`}>{value}</p>
    </motion.div>
  );
}
