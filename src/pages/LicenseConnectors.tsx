import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plug, Search, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Loader2,
  ChevronRight, Building2, CreditCard, TrendingUp, Clock, Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { licenseProviders, subscriptions, type ConnectorStatus } from "@/lib/mock-data/license-connectors";

const statusMeta: Record<ConnectorStatus, { label: string; icon: any; cls: string }> = {
  connected: { label: "Connecté", icon: CheckCircle2, cls: "text-success bg-success/10 border-success/20" },
  disconnected: { label: "Non connecté", icon: XCircle, cls: "text-muted-foreground bg-muted border-border" },
  error: { label: "Erreur API", icon: AlertTriangle, cls: "text-destructive bg-destructive/10 border-destructive/20" },
  syncing: { label: "Synchronisation…", icon: Loader2, cls: "text-primary bg-primary/10 border-primary/20" },
};

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) => {
  if (!iso || iso === "—") return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

export default function LicenseConnectors() {
  const [query, setQuery] = useState("");

  const totals = useMemo(() => {
    const connected = licenseProviders.filter((p) => p.status === "connected").length;
    const monthly = licenseProviders.reduce((s, p) => s + p.stats.monthlyCost, 0);
    const expiring = licenseProviders.reduce((s, p) => s + p.stats.expiringSoon, 0);
    return { connected, monthly, expiring, total: subscriptions.length };
  }, []);

  const filtered = licenseProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.vendor.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Plug className="h-3.5 w-3.5" />
            <span>Connecteurs / Licences</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Connecteurs Licences</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Centralisez vos fournisseurs (OVH, BeCloud, Microsoft CSP, opérateurs…) et accédez à toutes vos souscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Tout synchroniser
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> Ajouter un connecteur
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Connecteurs actifs", value: `${totals.connected}/${licenseProviders.length}`, icon: Plug, tone: "primary" },
          { label: "Souscriptions suivies", value: totals.total, icon: CreditCard, tone: "accent" },
          { label: "Coût mensuel agrégé", value: fmtEUR(totals.monthly), icon: TrendingUp, tone: "success" },
          { label: "Expirent < 30 jours", value: totals.expiring, icon: Clock, tone: "warning" },
        ].map((k) => (
          <Card key={k.label} className="border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-semibold mt-1">{k.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg bg-${k.tone}/10 text-${k.tone} flex items-center justify-center`}>
                <k.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un fournisseur…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Providers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const meta = statusMeta[p.status];
          const Icon = meta.icon;
          const isConnected = p.status === "connected" || p.status === "syncing";

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="group border-border/60 hover:border-primary/40 hover:shadow-md transition-all overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl bg-${p.color}/10 text-${p.color} flex items-center justify-center font-bold`}>
                        {p.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold leading-tight">{p.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3 w-3" />
                          {p.vendor}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`gap-1 ${meta.cls}`}>
                      <Icon className={`h-3 w-3 ${p.status === "syncing" ? "animate-spin" : ""}`} />
                      {meta.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>

                  {isConnected ? (
                    <>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Souscriptions</p>
                          <p className="text-base font-semibold">{p.stats.subscriptions}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Sièges actifs</p>
                          <p className="text-base font-semibold">{p.stats.activeSeats}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Coût /mois</p>
                          <p className="text-base font-semibold">{fmtEUR(p.stats.monthlyCost)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Sync : {fmtDate(p.lastSync)}
                          {p.stats.expiringSoon > 0 && (
                            <Badge variant="outline" className="ml-2 text-warning bg-warning/10 border-warning/20">
                              {p.stats.expiringSoon} expirent
                            </Badge>
                          )}
                        </div>
                        <Button asChild size="sm" variant="ghost" className="gap-1">
                          <Link to={`/connecteurs-licences/${p.id}`}>
                            Ouvrir <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <p className="text-xs text-muted-foreground">
                        {p.status === "error" ? "Identifiants invalides ou expirés." : "Aucune connexion configurée."}
                      </p>
                      <Button size="sm" variant={p.status === "error" ? "destructive" : "default"}>
                        {p.status === "error" ? "Reconnecter" : "Connecter"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
