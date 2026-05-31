import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./_shared";
import { AgentContextBanner } from "./AgentSelector";
import { mockTasks } from "./mock";
import { History, Search, CheckCircle2, XCircle, Loader2, Clock, Ban, AlarmClock } from "lucide-react";
import { motion } from "framer-motion";

const statusMap: Record<string, { label: string; cls: string; icon: any }> = {
  success: { label: "Réussi", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 },
  failed: { label: "Échoué", cls: "bg-rose-500/15 text-rose-600 border-rose-500/30", icon: XCircle },
  running: { label: "En cours", cls: "bg-sky-500/15 text-sky-600 border-sky-500/30", icon: Loader2 },
  pending: { label: "En attente", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30", icon: Clock },
  cancelled: { label: "Annulé", cls: "bg-zinc-500/15 text-zinc-600 border-zinc-500/30", icon: Ban },
  timeout: { label: "Timeout", cls: "bg-orange-500/15 text-orange-600 border-orange-500/30", icon: AlarmClock },
};

export default function HistoryPage() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = mockTasks.filter((t) => filter === "all" || t.status === filter);

  return (
    <div>
      <PageHeader title="Historique des tâches" description="50 dernières exécutions — polling 15s" icon={History} accent="from-slate-500 to-zinc-500"
        actions={<div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." className="pl-9 w-64" /></div>} />

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { v: "all", l: "Toutes" },
          { v: "success", l: "Réussi" },
          { v: "running", l: "En cours" },
          { v: "failed", l: "Échoué" },
          { v: "pending", l: "En attente" },
          { v: "timeout", l: "Timeout" },
          { v: "cancelled", l: "Annulé" },
        ].map((f) => (
          <Button key={f.v} variant={filter === f.v ? "default" : "outline"} size="sm" onClick={() => setFilter(f.v)}>
            {f.l}
          </Button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Type</TableHead><TableHead>Agent</TableHead><TableHead>Démarré</TableHead><TableHead>Durée</TableHead><TableHead>Statut</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((t, i) => {
              const s = statusMap[t.status];
              const Icon = s.icon;
              return (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b hover:bg-muted/40">
                  <TableCell className="font-medium">{t.type}</TableCell>
                  <TableCell><Badge variant="outline">{t.agent}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.started}</TableCell>
                  <TableCell className="text-xs font-mono">{t.duration}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`gap-1.5 ${s.cls}`}>
                      <Icon className={`h-3 w-3 ${t.status === "running" ? "animate-spin" : ""}`} />
                      {s.label}
                    </Badge>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
