import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./_shared";
import { mockDnsZones, mockDnsRecords } from "./mock";
import { Globe, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dns() {
  const [selected, setSelected] = useState(mockDnsZones[0].name);
  return (
    <div>
      <PageHeader title="Zones DNS" description="Forward / Reverse — enregistrements A, AAAA, CNAME, MX, TXT, PTR" icon={Globe} accent="from-amber-500 to-orange-500"
        actions={<Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500"><Plus className="h-4 w-4" />Nouvel enregistrement</Button>} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          {mockDnsZones.map((z, i) => (
            <motion.div key={z.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card onClick={() => setSelected(z.name)} className={`cursor-pointer p-4 transition-all hover:shadow-md ${selected === z.name ? "ring-2 ring-amber-500/50 bg-amber-500/5" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{z.name}</p>
                    <p className="text-xs text-muted-foreground">{z.type} • {z.records} enregistrements</p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Active</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="lg:col-span-2 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Zone : {selected}</p>
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Type</TableHead><TableHead>Valeur</TableHead><TableHead>TTL</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {mockDnsRecords.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{r.name}</TableCell>
                  <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{r.value}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.ttl}s</TableCell>
                  <TableCell><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
