import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./_shared";
import { AgentContextBanner } from "./AgentSelector";
import { mockComputers } from "./mock";
import { MonitorSmartphone } from "lucide-react";

export default function AdComputers() {
  return (
    <div>
      <PageHeader title="Ordinateurs du domaine" description="Inventaire parc — OS, IP, dernière connexion" icon={MonitorSmartphone} accent="from-cyan-500 to-sky-500" />
      <Card className="p-4">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Nom</TableHead><TableHead>OS</TableHead><TableHead>IPv4</TableHead>
            <TableHead>Statut</TableHead><TableHead>Dernière connexion</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockComputers.map((c) => (
              <TableRow key={c.name}>
                <TableCell className="font-medium font-mono text-xs">{c.name}</TableCell>
                <TableCell>{c.os}</TableCell>
                <TableCell className="font-mono text-xs">{c.ip}</TableCell>
                <TableCell>
                  {c.enabled ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Activé</Badge>
                    : <Badge variant="outline" className="bg-rose-500/15 text-rose-600 border-rose-500/30">Désactivé</Badge>}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.lastLogon}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
