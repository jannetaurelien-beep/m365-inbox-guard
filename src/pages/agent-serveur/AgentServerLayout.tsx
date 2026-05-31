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
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  color: string;
};

const items: Item[] = [
  { to: "/agent-serveur", label: "Vue d'ensemble", icon: LayoutDashboard, group: "Pilotage", color: "from-sky-500 to-indigo-500" },
  { to: "/agent-serveur/agents", label: "Agents", icon: ServerCog, group: "Pilotage", color: "from-indigo-500 to-violet-500" },
  { to: "/agent-serveur/deploiement", label: "Déploiement", icon: Rocket, group: "Pilotage", color: "from-fuchsia-500 to-pink-500" },

  { to: "/agent-serveur/ad/utilisateurs", label: "Utilisateurs", icon: Users, group: "Active Directory", color: "from-emerald-500 to-teal-500" },
  { to: "/agent-serveur/ad/groupes", label: "Groupes", icon: UsersRound, group: "Active Directory", color: "from-teal-500 to-cyan-500" },
  { to: "/agent-serveur/ad/ordinateurs", label: "Ordinateurs", icon: MonitorSmartphone, group: "Active Directory", color: "from-cyan-500 to-sky-500" },
  { to: "/agent-serveur/ad/ou", label: "Unités d'org.", icon: FolderTree, group: "Active Directory", color: "from-blue-500 to-indigo-500" },
  { to: "/agent-serveur/ad/gpo", label: "GPO", icon: ScrollText, group: "Active Directory", color: "from-indigo-500 to-purple-500" },

  { to: "/agent-serveur/dns", label: "DNS", icon: Globe, group: "Réseau", color: "from-amber-500 to-orange-500" },
  { to: "/agent-serveur/dhcp", label: "DHCP", icon: Network, group: "Réseau", color: "from-orange-500 to-rose-500" },

  { to: "/agent-serveur/fichiers", label: "Fichiers & NTFS", icon: HardDrive, group: "Stockage", color: "from-lime-500 to-emerald-500" },

  { to: "/agent-serveur/serveur", label: "Serveur", icon: Activity, group: "Infrastructure", color: "from-rose-500 to-red-500" },

  { to: "/agent-serveur/historique", label: "Historique", icon: History, group: "Journaux", color: "from-slate-500 to-zinc-500" },
];

const groups = Array.from(new Set(items.map((i) => i.group)));

export default function AgentServerLayout() {
  const { pathname } = useLocation();
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
                Pilotage centralisé des serveurs Windows, AD, DNS, DHCP et systèmes de fichiers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-card/80 px-4 py-2 text-xs backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium">4 agents en ligne</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Heartbeat 30s</span>
          </div>
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
                    const active =
                      item.to === "/agent-serveur"
                        ? pathname === "/agent-serveur"
                        : pathname.startsWith(item.to);
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/agent-serveur"}
                        className={cn(
                          "group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 hover:shadow-md",
                          active
                            ? "border-transparent bg-gradient-to-br text-white shadow-md " + item.color
                            : "border-border bg-background/60 text-foreground hover:border-primary/40"
                        )}
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
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
