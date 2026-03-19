import type { Severity } from '@/lib/mock-data/security-audit';

const colorMap: Record<string, string> = {
  critical: 'border-red-500/30 bg-red-500/5',
  high: 'border-orange-500/30 bg-orange-500/5',
  medium: 'border-amber-500/30 bg-amber-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  info: 'border-blue-500/30 bg-blue-500/5',
  healthy: 'border-emerald-500/30 bg-emerald-500/5',
  destructive: 'border-red-500/30 bg-red-500/5',
};

const textColorMap: Record<string, string> = {
  critical: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-amber-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
  healthy: 'text-emerald-500',
  destructive: 'text-red-500',
};

interface SecurityKPIProps {
  label: string;
  value: string | number;
  severity?: Severity | 'warning' | 'destructive';
}

export function SecurityKPICard({ label, value, severity = 'info' }: SecurityKPIProps) {
  return (
    <div className={`rounded-lg border p-4 ${colorMap[severity] || colorMap.info}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${textColorMap[severity] || textColorMap.info}`}>{value}</p>
    </div>
  );
}
