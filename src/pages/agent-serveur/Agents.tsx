import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, StatusBadge } from "./_shared";
import { mockAgents } from "./mock";
import { ServerCog, Search, MoreHorizontal, Terminal, Power, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Agents() {
  return (
    <div>
      <PageHeader
        title="Agents déployés"
        description="Heartbeat temps réel, capacités machine et actions à distance"
        icon={ServerCog}
        accent="from-indigo-500 to-violet-500"
        actions={
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un agent..." className="pl-9 w-64" />
            </div>
            <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockAgents.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group relative overflow-hidden p-5 hover:shadow-xl transition-all">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow">
                      <ServerCog className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{a.hostname}</p>
                      <p className="text-xs text-muted-foreground">{a.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div><p className="text-muted-foreground">IP</p><p className="font-mono">{a.ip}</p></div>
                  <div><p className="text-muted-foreground">Domaine</p><p>{a.domain}</p></div>
                  <div className="col-span-2"><p className="text-muted-foreground">OS</p><p>{a.os}</p></div>
                  <div><p className="text-muted-foreground">Version</p><p>{a.version}</p></div>
                  <div><p className="text-muted-foreground">Dernier ping</p><p>{a.lastBeat}</p></div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5"><Terminal className="h-3.5 w-3.5" />Console</Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5"><Power className="h-3.5 w-3.5" />Actions</Button>
                  <Button size="sm" variant="ghost" className="px-2"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
