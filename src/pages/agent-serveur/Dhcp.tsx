import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "./_shared";
import { AgentContextBanner } from "./AgentSelector";
import { mockDhcpScopes, mockLeases } from "./mock";
import { Network } from "lucide-react";
import { motion } from "framer-motion";

export default function Dhcp() {
  return (
    <div className="space-y-6">
      <PageHeader title="DHCP — Étendues & baux" description="Scopes, baux actifs et réservations" icon={Network} accent="from-orange-500 to-rose-500" />

      <div className="grid gap-3 md:grid-cols-3">
        {mockDhcpScopes.map((s, i) => {
          const pct = (s.leases / s.total) * 100;
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{s.range}</p>
                  </div>
                  {s.active
                    ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Active</Badge>
                    : <Badge variant="outline" className="bg-zinc-500/15 text-zinc-600 border-zinc-500/30">Inactive</Badge>}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{s.leases} baux</span>
                    <span className="text-muted-foreground">{Math.round(pct)}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold">Baux actifs (temps réel)</p>
        <Table>
          <TableHeader><TableRow><TableHead>IP</TableHead><TableHead>MAC</TableHead><TableHead>Hostname</TableHead><TableHead>Expire</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockLeases.map((l) => (
              <TableRow key={l.ip}>
                <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                <TableCell className="font-mono text-xs">{l.mac}</TableCell>
                <TableCell className="font-medium">{l.hostname}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.expires}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
