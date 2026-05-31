import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader, StatTile } from "./_shared";
import { mockServices, mockEvents } from "./mock";
import { Activity, Cpu, MemoryStick, HardDrive, Play, Square, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Server() {
  return (
    <div className="space-y-6">
      <PageHeader title="Performances & services" description="CPU, RAM, disques, services Windows et événements" icon={Activity} accent="from-rose-500 to-red-500" />

      <div className="grid gap-4 md:grid-cols-3">
        <StatTile label="CPU" value="38%" hint="8 cœurs — pic 72%" icon={Cpu} accent="from-rose-500 to-red-500" />
        <StatTile label="RAM" value="14.2 / 32 Go" hint="44% utilisée" icon={MemoryStick} accent="from-orange-500 to-amber-500" />
        <StatTile label="Disque C:" value="68%" hint="320 Go libres" icon={HardDrive} accent="from-amber-500 to-yellow-500" />
      </div>

      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold">Charge temps réel</p>
        <div className="space-y-3">
          {[
            { l: "CPU", v: 38, c: "from-rose-500 to-red-500" },
            { l: "RAM", v: 44, c: "from-orange-500 to-amber-500" },
            { l: "Disque C:", v: 68, c: "from-amber-500 to-yellow-500" },
            { l: "Réseau", v: 22, c: "from-sky-500 to-indigo-500" },
          ].map((m) => (
            <div key={m.l}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-medium">{m.l}</span>
                <span className="text-muted-foreground">{m.v}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div initial={{ width: 0 }} animate={{ width: `${m.v}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${m.c}`} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold">Services Windows</p>
          <div className="space-y-2">
            {mockServices.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{s.display}</p>
                  <p className="text-xs font-mono text-muted-foreground">{s.name} • {s.startType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={s.status === "Running" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-zinc-500/15 text-zinc-600 border-zinc-500/30"}>
                    {s.status}
                  </Badge>
                  <Button size="icon" variant="ghost">
                    {s.status === "Running" ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold">Événements récents</p>
          <div className="space-y-2">
            {mockEvents.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-lg border p-3">
                <div className={`mt-0.5 grid h-7 w-7 place-items-center rounded-lg ${e.level === "Error" ? "bg-rose-500/15 text-rose-600" : e.level === "Warning" ? "bg-amber-500/15 text-amber-600" : "bg-sky-500/15 text-sky-600"}`}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-semibold">{e.id}</span>
                    <Badge variant="outline" className="text-[10px]">{e.source}</Badge>
                    <span className="text-muted-foreground ml-auto">{e.time}</span>
                  </div>
                  <p className="mt-1 text-sm">{e.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
