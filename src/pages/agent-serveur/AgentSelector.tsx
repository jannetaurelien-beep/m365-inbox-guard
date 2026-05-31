import { useAgent } from "./AgentContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServerCog, ChevronsUpDown, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { StatusBadge } from "./_shared";
import { cn } from "@/lib/utils";

export function AgentSelector() {
  const { agent, agents, setAgentId } = useAgent();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = agents.filter((a) =>
    (a.hostname + a.ip + a.role).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-auto gap-3 rounded-2xl border-primary/30 bg-card/80 px-4 py-2.5 backdrop-blur hover:border-primary/60">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow">
            <ServerCog className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Agent actif</p>
            <p className="text-sm font-bold leading-tight">{agent.hostname}</p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer les agents..." className="pl-9" />
          </div>
        </div>
        <div className="max-h-96 overflow-auto p-2">
          {filtered.map((a) => {
            const active = a.id === agent.id;
            return (
              <button
                key={a.id}
                onClick={() => { setAgentId(a.id); setOpen(false); }}
                className={cn(
                  "w-full rounded-xl border border-transparent p-3 text-left transition hover:border-border hover:bg-muted/50",
                  active && "border-primary/40 bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                      <ServerCog className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm flex items-center gap-2">
                        {a.hostname}
                        {active && <Check className="h-3.5 w-3.5 text-primary" />}
                      </p>
                      <p className="text-xs text-muted-foreground">{a.role} • {a.ip}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {a.capabilities.map((c) => (
                    <Badge key={c} variant="outline" className="text-[10px] uppercase">{c}</Badge>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AgentContextBanner() {
  const { agent } = useAgent();
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-4 py-2.5 text-xs">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-semibold">Données issues de</span>
      <Badge variant="outline" className="font-mono">{agent.hostname}</Badge>
      <span className="text-muted-foreground">• {agent.role}</span>
      <span className="ml-auto text-muted-foreground">Dernier ping : {agent.lastBeat}</span>
    </div>
  );
}
