import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ServerCog,
  Rocket,
  Users,
  UsersRound,
  MonitorSmartphone,
  FolderTree,
  ScrollText,
  Globe,
  Network,
  HardDrive,
  Activity,
  History,
  Shield,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentProvider, useAgent, AgentCapability } from "./AgentContext";
import { AgentSelector, AgentContextBanner } from "./AgentSelector";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  color: string;
  requires?: AgentCapability; // capacité nécessaire sur l'agent actif
  global?: boolean; // toujours actif (pilotage / journaux)
};

const items: Item[] = [
  { to: "/agent-serveur", label: "Vue d'ensemble", icon: LayoutDashboard, group: "Pilotage", color: "from-sky-500 to-indigo-500", global: true },
  { to: "/agent-serveur/agents", label: "Agents", icon: ServerCog, group: "Pilotage", color: "from-indigo-500 to-violet-500", global: true },
  { to: "/agent-serveur/deploiement", label: "Déploiement", icon: Rocket, group: "Pilotage", color: "from-fuchsia-500 to-pink-500", global: true },

  { to: "/agent-serveur/ad/utilisateurs", label: "Utilisateurs", icon: Users, group: "Active Directory", color: "from-emerald-500 to-teal-500", requires: "ad" },
  { to: "/agent-serveur/ad/groupes", label: "Groupes", icon: UsersRound, group: "Active Directory", color: "from-teal-500 to-cyan-500", requires: "ad" },
  { to: "/agent-serveur/ad/ordinateurs", label: "Ordinateurs", icon: MonitorSmartphone, group: "Active Directory", color: "from-cyan-500 to-sky-500", requires: "ad" },
  { to: "/agent-serveur/ad/ou", label: "Unités d'org.", icon: FolderTree, group: "Active Directory", color: "from-blue-500 to-indigo-500", requires: "ad" },
  { to: "/agent-serveur/ad/gpo", label: "GPO", icon: ScrollText, group: "Active Directory", color: "from-indigo-500 to-purple-500", requires: "gpo" },

  { to: "/agent-serveur/dns", label: "DNS", icon: Globe, group: "Réseau", color: "from-amber-500 to-orange-500", requires: "dns" },
  { to: "/agent-serveur/dhcp", label: "DHCP", icon: Network, group: "Réseau", color: "from-orange-500 to-rose-500", requires: "dhcp" },

  { to: "/agent-serveur/fichiers", label: "Fichiers & NTFS", icon: HardDrive, group: "Stockage", color: "from-lime-500 to-emerald-500", requires: "files" },

  { to: "/agent-serveur/serveur", label: "Serveur", icon: Activity, group: "Infrastructure", color: "from-rose-500 to-red-500", requires: "server" },

  { to: "/agent-serveur/historique", label: "Historique", icon: History, group: "Journaux", color: "from-slate-500 to-zinc-500", global: true },
];

const groups = Array.from(new Set(items.map((i) => i.group)));

function LayoutInner() {
  const { pathname } = useLocation();
  const { agent, agents, hasCapability } = useAgent();
  const onlineCount = agents.filter((a) => a.status === "online").length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-6"
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg"
            >
              <Shield className="h-7 w-7" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Agent Serveur AutoCore
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Pilotage centralisé — {onlineCount} agents en ligne • Heartbeat 30s
              </p>
            </div>
          </div>
          <AgentSelector />
        </div>
      </motion.div>

      {/* Sub-nav */}
      <div className="rounded-2xl border bg-card/50 p-3 backdrop-blur">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {groups.map((g) => (
            <div key={g} className="space-y-1.5">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g}</p>
              <div className="flex flex-wrap gap-1.5">
                {items
                  .filter((i) => i.group === g)
                  .map((item) => {
                    const allowed = item.global || (item.requires && hasCapability(item.requires));
                    const active =
                      item.to === "/agent-serveur"
                        ? pathname === "/agent-serveur"
                        : pathname.startsWith(item.to);

                    const baseClasses = cn(
                      "group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all",
                      active && allowed
                        ? "border-transparent bg-gradient-to-br text-white shadow-md " + item.color
                        : allowed
                          ? "border-border bg-background/60 text-foreground hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
                          : "border-dashed border-border bg-muted/30 text-muted-foreground/60 cursor-not-allowed"
                    );

                    if (!allowed) {
                      return (
                        <Tooltip key={item.to}>
                          <TooltipTrigger asChild>
                            <span className={baseClasses}>
                              <Lock className="h-3 w-3" />
                              {item.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Indisponible sur <b>{agent.hostname}</b></p>
                            <p className="text-[10px] text-muted-foreground">Capacité requise : {item.requires}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/agent-serveur"}
                        className={baseClasses}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={pathname + agent.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}

export default function AgentServerLayout() {
  return (
    <AgentProvider>
      <LayoutInner />
    </AgentProvider>
  );
}
