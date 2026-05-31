import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "./_shared";
import { AgentContextBanner } from "./AgentSelector";
import { HardDrive, Folder, FileText, ChevronRight, Shield, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

const tree = [
  { name: "Partage", type: "folder", size: "—", owner: "Domain Admins" },
  { name: "Finance", type: "folder", size: "12 Go", owner: "GG-Finance" },
  { name: "RH", type: "folder", size: "4.2 Go", owner: "GG-RH" },
  { name: "IT", type: "folder", size: "85 Go", owner: "GG-IT" },
  { name: "Public", type: "folder", size: "1.1 Go", owner: "Everyone" },
];

const acl = [
  { identity: "BUILTIN\\Administrators", rights: "FullControl", type: "Allow", inherited: false },
  { identity: "AUTOCORE\\GG-Finance", rights: "Modify", type: "Allow", inherited: true },
  { identity: "AUTOCORE\\GG-IT", rights: "ReadAndExecute", type: "Allow", inherited: true },
  { identity: "AUTOCORE\\Stagiaires", rights: "Write", type: "Deny", inherited: false },
];

export default function Files() {
  const [path, setPath] = useState("\\\\SRV-FILE01\\Partage");
  return (
    <div className="space-y-6">
      <PageHeader title="Explorateur & droits NTFS" description="Navigation, modification ACL et scan récursif" icon={HardDrive} accent="from-lime-500 to-emerald-500"
        actions={<Button className="gap-2 bg-gradient-to-r from-lime-500 to-emerald-500"><ScanLine className="h-4 w-4" />Scan NTFS</Button>} />

      <Card className="p-4">
        <div className="flex gap-2">
          <Input value={path} onChange={(e) => setPath(e.target.value)} className="font-mono text-sm" />
          <Button variant="outline">Aller</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contenu</p>
          <div className="space-y-1">
            {tree.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between rounded-lg border border-transparent p-2.5 hover:bg-muted/40 hover:border-border cursor-pointer transition">
                <div className="flex items-center gap-3">
                  {f.type === "folder" ? <Folder className="h-4 w-4 text-amber-500" /> : <FileText className="h-4 w-4 text-muted-foreground" />}
                  <span className="font-medium">{f.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{f.size}</span>
                  <Badge variant="outline" className="text-[10px]">{f.owner}</Badge>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Droits NTFS</p>
          </div>
          <div className="space-y-2">
            {acl.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium font-mono">{a.identity}</p>
                  <Badge variant="outline" className={a.type === "Allow" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-rose-500/15 text-rose-600 border-rose-500/30"}>
                    {a.type}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.rights} {a.inherited && "• hérité"}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
