import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServerCog, Rocket, Activity, AlertTriangle, CheckCircle2, Users, Globe, Network, HardDrive, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader, StatTile } from "./_shared";
import { mockAgents, mockTasks } from "./mock";

const quickLinks = [
  { to: "/agent-serveur/agents", label: "Agents", icon: ServerCog, color: "from-indigo-500 to-violet-500", count: mockAgents.length },
  { to: "/agent-serveur/ad/utilisateurs", label: "Active Directory", icon: Users, color: "from-emerald-500 to-teal-500", count: "1 248" },
  { to: "/agent-serveur/dns", label: "DNS", icon: Globe, color: "from-amber-500 to-orange-500", count: "3 zones" },
  { to: "/agent-serveur/dhcp", label: "DHCP", icon: Network, color: "from-orange-500 to-rose-500", count: "3 étendues" },
  { to: "/agent-serveur/fichiers", label: "Fichiers & NTFS", icon: HardDrive, color: "from-lime-500 to-emerald-500", count: "12 To" },
  { to: "/agent-serveur/deploiement", label: "Déploiement", icon: Rocket, color: "from-fuchsia-500 to-pink-500", count: "Token prêt" },
];

export default function Overview() {
  const online = mockAgents.filter((a) => a.status === "online").length;
  const warn = mockAgents.filter((a) => a.status === "warning").length;
  const off = mockAgents.filter((a) => a.status === "offline").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Vue d'ensemble" description="Cockpit temps réel de votre parc serveurs" icon={Activity} accent="from-sky-500 to-indigo-500" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Agents en ligne" value={online} hint="Heartbeat < 30s" icon={CheckCircle2} accent="from-emerald-500 to-teal-500" delay={0} />
        <StatTile label="En alerte" value={warn} hint="Latence détectée" icon={AlertTriangle} accent="from-amber-500 to-orange-500" delay={0.05} />
        <StatTile label="Hors ligne" value={off} hint="À investiguer" icon={Zap} accent="from-rose-500 to-red-500" delay={0.1} />
        <StatTile label="Tâches 24h" value={mockTasks.length} hint="3 en cours" icon={Activity} accent="from-sky-500 to-indigo-500" delay={0.15} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Accès rapides</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((l, i) => (
            <motion.div key={l.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={l.to}>
                <Card className={`group relative overflow-hidden p-5 hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer`}>
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity ${l.color}`} />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md ${l.color}`}>
                        <l.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{l.label}</p>
                        <p className="text-xs text-muted-foreground">{l.count}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activité récente</h3>
        <Card className="divide-y">
          {mockTasks.slice(0, 5).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-3 px-4">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${t.status === "success" ? "bg-emerald-500" : t.status === "running" ? "bg-sky-500 animate-pulse" : t.status === "failed" || t.status === "timeout" ? "bg-rose-500" : "bg-amber-500"}`} />
                <span className="text-sm font-medium">{t.type}</span>
                <Badge variant="outline" className="text-xs">{t.agent}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{t.started}</span>
                <span>•</span>
                <span>{t.duration}</span>
              </div>
            </motion.div>
          ))}
        </Card>
      </div>
    </div>
  );
}
