import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  icon: Icon,
  accent = "from-primary to-accent",
  actions,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  accent?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md", accent)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  accent = "from-primary to-accent",
  delay = 0,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="relative overflow-hidden p-4 hover:shadow-lg transition-all hover:-translate-y-0.5">
        <div className={cn("absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-20 blur-2xl", accent)} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className={cn("grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br text-white shadow", accent)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: "online" | "offline" | "paused" | "warning" }) {
  const map = {
    online: { label: "En ligne", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
    offline: { label: "Hors ligne", cls: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30" },
    paused: { label: "En pause", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
    warning: { label: "Alerte", cls: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30" },
  }[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", map.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        status === "online" ? "bg-emerald-500 animate-pulse" :
        status === "offline" ? "bg-rose-500" :
        status === "paused" ? "bg-amber-500" : "bg-orange-500"
      )} />
      {map.label}
    </Badge>
  );
}
