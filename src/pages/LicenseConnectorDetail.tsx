import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Search, Download, ExternalLink, Filter,
  CheckCircle2, AlertTriangle, PauseCircle, Clock, XCircle,
  Calendar, User, Tag, FileText, History, Settings2, CreditCard,
  Building2, Repeat, Hash, MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  licenseProviders,
  subscriptions,
  type Subscription,
  type SubscriptionStatus,
} from "@/lib/mock-data/license-connectors";

const statusMeta: Record<SubscriptionStatus, { label: string; cls: string; icon: any }> = {
  active: { label: "Actif", cls: "text-success bg-success/10 border-success/20", icon: CheckCircle2 },
  expiring: { label: "Expire bientôt", cls: "text-warning bg-warning/10 border-warning/20", icon: Clock },
  suspended: { label: "Suspendu", cls: "text-destructive bg-destructive/10 border-destructive/20", icon: PauseCircle },
  cancelled: { label: "Résilié", cls: "text-muted-foreground bg-muted border-border", icon: XCircle },
  pending: { label: "En attente", cls: "text-primary bg-primary/10 border-primary/20", icon: AlertTriangle },
};

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const daysUntil = (iso: string) => {
  const d = new Date(iso).getTime();
  return Math.ceil((d - Date.now()) / 86400000);
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

export default function LicenseConnectorDetail() {
  const { providerId } = useParams<{ providerId: string }>();
  const provider = licenseProviders.find((p) => p.id === providerId);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Subscription | null>(null);

  const providerSubs = useMemo(
    () => subscriptions.filter((s) => s.providerId === providerId),
    [providerId],
  );

  const categories = useMemo(
    () => Array.from(new Set(providerSubs.map((s) => s.category))),
    [providerSubs],
  );

  const filtered = useMemo(() => {
    return providerSubs.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.reference.toLowerCase().includes(q) ||
          s.owner.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [providerSubs, query, statusFilter, categoryFilter]);

  const aggregated = useMemo(() => {
    const monthly = providerSubs
      .filter((s) => s.renewal === "monthly")
      .reduce((s, x) => s + x.totalPrice, 0);
    const yearly = providerSubs
      .filter((s) => s.renewal === "yearly")
      .reduce((s, x) => s + x.totalPrice, 0);
    const expiring = providerSubs.filter(
      (s) => s.status === "expiring" || (s.status === "active" && daysUntil(s.endDate) < 30),
    ).length;
    return { monthly, yearly, expiring, total: providerSubs.length };
  }, [providerSubs]);

  if (!provider) return <Navigate to="/connecteurs-licences" replace />;

  return (
    <div className="space-y-6">
      {/* Breadcrumb / header */}
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
          <Link to="/connecteurs-licences">
            <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux connecteurs
          </Link>
        </Button>

        <Card className="border-border/60 overflow-hidden">
          <div className={`h-1 bg-${provider.color}`} />
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-xl bg-${provider.color}/10 text-${provider.color} flex items-center justify-center font-bold text-lg`}>
                  {provider.logo}
                </div>
                <div>
                  <h1 className="text-xl font-semibold flex items-center gap-2">
                    {provider.name}
                    <Badge variant="outline" className="text-success bg-success/10 border-success/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Connecté
                    </Badge>
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                    <Building2 className="h-3 w-3" /> {provider.vendor}
                    <span className="text-border">•</span>
                    <Hash className="h-3 w-3" /> {provider.account}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" /> Synchroniser
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={provider.apiEndpoint} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" /> Console fournisseur
                  </a>
                </Button>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4 mr-2" /> Paramètres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Souscriptions", value: aggregated.total, icon: CreditCard, tone: "primary" },
            { label: "Coût mensuel", value: fmtEUR(aggregated.monthly), icon: Repeat, tone: "accent" },
            { label: "Engagements annuels", value: fmtEUR(aggregated.yearly), icon: Calendar, tone: "success" },
            { label: "À renouveler < 30 j.", value: aggregated.expiring, icon: Clock, tone: "warning" },
          ].map((k) => (
            <Card key={k.label} className="border-border/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="text-xl font-semibold mt-1">{k.value}</p>
                </div>
                <div className={`h-9 w-9 rounded-lg bg-${k.tone}/10 text-${k.tone} flex items-center justify-center`}>
                  <k.icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher (nom, référence, propriétaire)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-44">
              <Filter className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(statusMeta).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Tag className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Exporter
          </Button>
        </CardContent>
      </Card>

      {/* Subscriptions table */}
      <Card className="border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Souscription</th>
                <th className="text-left px-4 py-3 font-medium">Catégorie</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-left px-4 py-3 font-medium">Sièges</th>
                <th className="text-right px-4 py-3 font-medium">Montant</th>
                <th className="text-left px-4 py-3 font-medium">Échéance</th>
                <th className="text-left px-4 py-3 font-medium">Propriétaire</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const meta = statusMeta[s.status];
                const Icon = meta.icon;
                const days = daysUntil(s.endDate);
                const danger = days < 15;
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="border-t border-border/60 hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.reference}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-normal">{s.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`gap-1 ${meta.cls}`}>
                        <Icon className="h-3 w-3" /> {meta.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{s.usedSeats}</span>
                      <span className="text-muted-foreground"> / {s.seats}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-semibold">{fmtEUR(s.totalPrice)}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.renewal === "monthly" ? "/ mois" : s.renewal === "yearly" ? "/ an" : s.renewal}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{fmtDate(s.endDate)}</div>
                      <div className={`text-xs ${danger ? "text-destructive" : "text-muted-foreground"}`}>
                        {days >= 0 ? `dans ${days} j.` : `il y a ${Math.abs(days)} j.`}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.owner}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    Aucune souscription ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <SheetHeader className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusMeta[selected.status].cls}>
                      {statusMeta[selected.status].label}
                    </Badge>
                    <Badge variant="outline">{selected.category}</Badge>
                  </div>
                  <SheetTitle className="text-xl">{selected.name}</SheetTitle>
                  <SheetDescription className="font-mono text-xs">
                    {selected.reference}
                  </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="overview">Détails</TabsTrigger>
                    <TabsTrigger value="technical">Technique</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <InfoTile icon={CreditCard} label="Montant" value={`${fmtEUR(selected.totalPrice)} ${selected.renewal === "monthly" ? "/ mois" : selected.renewal === "yearly" ? "/ an" : ""}`} />
                      <InfoTile icon={Hash} label="Prix unitaire" value={fmtEUR(selected.unitPrice)} />
                      <InfoTile icon={User} label="Sièges utilisés" value={`${selected.usedSeats} / ${selected.seats}`} />
                      <InfoTile icon={Repeat} label="Renouvellement" value={selected.autoRenew ? "Auto" : "Manuel"} />
                      <InfoTile icon={Calendar} label="Début" value={fmtDate(selected.startDate)} />
                      <InfoTile icon={Calendar} label="Échéance" value={fmtDate(selected.endDate)} />
                      <InfoTile icon={User} label="Propriétaire" value={selected.owner} />
                      {selected.region && <InfoTile icon={MapPin} label="Région" value={selected.region} />}
                      {selected.contractRef && <InfoTile icon={FileText} label="Réf. contrat" value={selected.contractRef} />}
                      {selected.client && <InfoTile icon={Building2} label="Client" value={selected.client} />}
                    </div>

                    {selected.tags && selected.tags.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.tags.map((t) => (
                            <Badge key={t} variant="secondary">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" /> Renouveler
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" /> Voir chez {selected ? licenseProviders.find(p => p.id === selected.providerId)?.name : ""}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="mt-4">
                    {selected.technical ? (
                      <div className="rounded-lg border border-border/60 divide-y divide-border/60">
                        {Object.entries(selected.technical).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-muted-foreground">{k}</span>
                            <span className="font-mono">{v}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune donnée technique exposée.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    {selected.history.length > 0 ? (
                      <ol className="space-y-3 relative border-l border-border/60 ml-2 pl-4">
                        {selected.history.map((h, i) => (
                          <li key={i} className="relative">
                            <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                            <p className="text-sm font-medium">{h.event}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="h-3 w-3" /> {fmtDate(h.date)}
                              {h.user && <><span>•</span><User className="h-3 w-3" /> {h.user}</>}
                            </p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="flex flex-col items-center text-center py-8 text-muted-foreground">
                        <History className="h-8 w-8 mb-2" />
                        <p className="text-sm">Aucun évènement enregistré.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="text-sm font-medium mt-1 truncate" title={value}>{value}</p>
    </div>
  );
}
