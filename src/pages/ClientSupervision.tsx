import { useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Activity, ChevronRight, Building2, Server, Wifi, HardDrive,
  ShieldCheck, Zap, Database, AlertTriangle, CheckCircle2, XCircle, Cpu,
  Sparkles, Radar
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockClients } from '@/lib/mock-data/clients';
import { enrichedParc, type EnrichedDevice, type ParcCategorie } from '@/lib/mock-data/parc-details';
import { SupervisionPanel } from '@/components/clients/SupervisionPanel';
import { DeviceDetailSheet } from '@/components/clients/DeviceDetailSheet';
import { useState } from 'react';

const initialAgences: Record<string, { id: string; nom: string; ville: string }[]> = {
  c1: [
    { id: 'a1', nom: 'Siège Paris', ville: 'Paris' },
    { id: 'a2', nom: 'Agence Lyon', ville: 'Lyon' },
    { id: 'a3', nom: 'Agence Marseille', ville: 'Marseille' },
  ],
};

function evalLevel(d: EnrichedDevice): 'ok' | 'warn' | 'critical' {
  let level: 'ok' | 'warn' | 'critical' = 'ok';
  const bump = (l: 'ok' | 'warn' | 'critical') => {
    if (l === 'critical') level = 'critical';
    else if (l === 'warn' && level !== 'critical') level = 'warn';
  };
  if (d.status === 'hors-service') bump('critical');
  if (d.status === 'maintenance') bump('warn');
  if (d.miseAJour && !d.miseAJour.aJour) bump('warn');
  if (d.sauvegarde && !d.sauvegarde.connectee) bump('critical');
  d.stockage?.forEach(s => {
    const pct = ((s.totalGo - s.libreGo) / s.totalGo) * 100;
    if (pct >= 90 || s.sante === 'Critique') bump('critical');
    else if (pct >= 80 || s.sante === 'Avertissement') bump('warn');
  });
  if (d.lien) {
    if (d.lien.uptime < 99 || d.lien.latence > 50) bump('warn');
  }
  return level;
}

const CAT_LABEL: Record<ParcCategorie, string> = {
  serveur: 'Serveurs', poste: 'Postes', mobile: 'Mobiles', telephonie: 'Téléphonie',
  alarme: 'Alarme', videosurveillance: 'Vidéo', reseau: 'Réseau',
  'lien-internet': 'Liens', imprimante: 'Impression', autre: 'Autre',
};

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(217 91% 60%)',
  'hsl(262 83% 58%)',
  'hsl(173 80% 40%)',
  'hsl(45 93% 47%)',
  'hsl(330 81% 60%)',
  'hsl(199 89% 48%)',
  'hsl(142 71% 45%)',
];

export default function ClientSupervision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const agenceFilter = params.get('agence');
  const client = mockClients.find(c => c.id === id);
  const [selectedDevice, setSelectedDevice] = useState<EnrichedDevice | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const allDevices = enrichedParc;
  const devices = useMemo(
    () => agenceFilter ? allDevices.filter(d => d.agence === agenceFilter) : allDevices,
    [agenceFilter, allDevices]
  );

  const stats = useMemo(() => {
    const levels = { ok: 0, warn: 0, critical: 0 };
    devices.forEach(d => { levels[evalLevel(d)]++; });
    const score = devices.length === 0 ? 100 : Math.round(((levels.ok + levels.warn * 0.5) / devices.length) * 100);

    const byCat: Record<string, number> = {};
    devices.forEach(d => { byCat[CAT_LABEL[d.categorie]] = (byCat[CAT_LABEL[d.categorie]] || 0) + 1; });
    const catData = Object.entries(byCat).map(([name, value]) => ({ name, value }));

    const stockageTotal = devices.reduce((acc, d) => acc + (d.stockage?.reduce((a, s) => a + s.totalGo, 0) || 0), 0);
    const stockageLibre = devices.reduce((acc, d) => acc + (d.stockage?.reduce((a, s) => a + s.libreGo, 0) || 0), 0);

    const sauvegardesActives = devices.filter(d => d.sauvegarde?.connectee).length;
    const sauvegardesTotal = devices.filter(d => d.sauvegarde).length;

    const aJour = devices.filter(d => d.miseAJour?.aJour).length;
    const concernedMaj = devices.filter(d => d.miseAJour).length;

    const garantieExp30 = devices.filter(d => d.garantie && (new Date(d.garantie.fin).getTime() - Date.now()) / 86400000 < 60).length;

    // Bandwidth aggregate (sum down across links)
    const links = devices.filter(d => d.lien);
    const bw24 = Array.from({ length: 24 }, (_, h) => {
      const sum = links.reduce((a, d) => a + (d.lien!.bandwidth24h[h]?.down || 0), 0);
      const lat = links.length === 0 ? 0 : Math.round(links.reduce((a, d) => a + (d.lien!.latence24h[h]?.ms || 0), 0) / links.length);
      return { h: `${h}h`, down: sum, lat };
    });

    // Stockage par device top 6
    const topStockage = devices
      .filter(d => d.stockage && d.stockage.length > 0)
      .map(d => {
        const total = d.stockage!.reduce((a, s) => a + s.totalGo, 0);
        const libre = d.stockage!.reduce((a, s) => a + s.libreGo, 0);
        return { name: d.nom, used: total - libre, libre };
      })
      .sort((a, b) => (b.used + b.libre) - (a.used + a.libre))
      .slice(0, 6);

    return {
      levels, score, catData, stockageTotal, stockageLibre,
      sauvegardesActives, sauvegardesTotal, aJour, concernedMaj,
      garantieExp30, bw24, topStockage, links: links.length,
    };
  }, [devices]);

  if (!client) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Client introuvable</h2>
        <Button onClick={() => navigate('/clients')} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
      </div>
    );
  }

  const radialData = [
    { name: 'Score', value: stats.score, fill: stats.score >= 85 ? 'hsl(142 71% 45%)' : stats.score >= 60 ? 'hsl(45 93% 47%)' : 'hsl(0 84% 60%)' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/clients" className="hover:text-primary flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Clients
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/clients/${id}`} className="hover:text-primary">{client.nom}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Supervision</span>
        {agenceFilter && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{agenceFilter}</span>
          </>
        )}
      </div>

      {/* Hero futuriste */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-6 text-white"
      >
        {/* Ambient blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-center">
          {/* Score radial */}
          <div className="relative w-44 h-44 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: 'rgba(255,255,255,0.08)' }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold tracking-tight">{stats.score}</p>
              <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Santé</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none"
            >
              <Radar className="absolute top-1 left-1/2 -translate-x-1/2 h-3 w-3 text-cyan-300/60" />
            </motion.div>
          </div>

          {/* Titres + KPIs */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30">
                <Activity className="h-3 w-3 mr-1" /> Cockpit Supervision
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                {client.nom}
              </Badge>
              {agenceFilter && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  <Building2 className="h-3 w-3 mr-1" />{agenceFilter}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {devices.length} équipements{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">sous surveillance</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {[
                { label: 'Sains', value: stats.levels.ok, icon: CheckCircle2, color: 'text-emerald-300', bg: 'from-emerald-500/20 to-emerald-500/5' },
                { label: 'À surveiller', value: stats.levels.warn, icon: AlertTriangle, color: 'text-amber-300', bg: 'from-amber-500/20 to-amber-500/5' },
                { label: 'Critiques', value: stats.levels.critical, icon: XCircle, color: 'text-rose-300', bg: 'from-rose-500/20 to-rose-500/5' },
                { label: 'Liens internet', value: stats.links, icon: Wifi, color: 'text-cyan-300', bg: 'from-cyan-500/20 to-cyan-500/5' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${s.bg} backdrop-blur-md border border-white/10`}
                >
                  <div className="flex items-center gap-2">
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                    <p className="text-[10px] uppercase tracking-wider text-white/70">{s.label}</p>
                  </div>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => navigate(`/clients/${id}`)} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" /> Fiche client
          </Button>
        </div>
      </motion.div>

      {/* Grid graphiques globaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bandwidth */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Wifi className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Bande passante agrégée 24h</h3>
                  <p className="text-xs text-muted-foreground">Somme des liens internet (Mb/s) · latence moyenne</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">{stats.links} lien(s)</Badge>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.bw24}>
                  <defs>
                    <linearGradient id="globalBw" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="h" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="down" stroke="hsl(var(--primary))" fill="url(#globalBw)" name="Down (Mb/s)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Pie par catégorie */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <Cpu className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Répartition par type</h3>
                <p className="text-xs text-muted-foreground">{devices.length} équipements</p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.catData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {stats.catData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Stockage global */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <HardDrive className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Stockage global</h3>
                <p className="text-xs text-muted-foreground">Tous disques cumulés</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{(stats.stockageTotal / 1000).toFixed(1)}<span className="text-sm font-normal text-muted-foreground"> To</span></span>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                  style={{ width: `${stats.stockageTotal === 0 ? 0 : ((stats.stockageTotal - stats.stockageLibre) / stats.stockageTotal) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{((stats.stockageTotal - stats.stockageLibre) / 1000).toFixed(1)} To utilisés</span>
                <span>{(stats.stockageLibre / 1000).toFixed(1)} To libres</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top stockage */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2">
          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md h-full">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" /> Capacité disque par équipement
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topStockage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} unit=" Go" />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="used" stackId="a" fill="hsl(var(--primary))" name="Utilisé (Go)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="libre" stackId="a" fill="hsl(var(--muted))" name="Libre (Go)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Tuiles statut */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-5 bg-card/80 backdrop-blur-sm border-border/50 shadow-md h-full space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Conformité
            </h3>
            {[
              {
                icon: Database, label: 'Sauvegardes connectées', color: 'from-emerald-500 to-teal-600',
                value: `${stats.sauvegardesActives}/${stats.sauvegardesTotal}`,
                pct: stats.sauvegardesTotal === 0 ? 100 : (stats.sauvegardesActives / stats.sauvegardesTotal) * 100,
              },
              {
                icon: Zap, label: 'Équipements à jour', color: 'from-amber-500 to-orange-600',
                value: `${stats.aJour}/${stats.concernedMaj}`,
                pct: stats.concernedMaj === 0 ? 100 : (stats.aJour / stats.concernedMaj) * 100,
              },
              {
                icon: ShieldCheck, label: 'Garantie < 60j', color: 'from-rose-500 to-red-600',
                value: stats.garantieExp30, pct: 0, danger: stats.garantieExp30 > 0,
              },
            ].map((row, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${row.color} flex items-center justify-center`}>
                      <row.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium">{row.label}</p>
                  </div>
                  <span className={`text-lg font-bold ${row.danger ? 'text-destructive' : ''}`}>{row.value}</span>
                </div>
                {row.pct > 0 && (
                  <div className="h-1.5 rounded-full bg-background overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${row.color}`} style={{ width: `${row.pct}%` }} />
                  </div>
                )}
              </div>
            ))}
          </Card>
        </motion.div>
      </div>

      {/* Détail équipements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Détail équipements</h2>
          </div>
          {!agenceFilter && (initialAgences[id || ''] || []).length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => navigate(`/clients/${id}/supervision`)}>Tous</Button>
              {(initialAgences[id || ''] || []).map(a => (
                <Button key={a.id} size="sm" variant="outline" onClick={() => navigate(`/clients/${id}/supervision?agence=${a.ville}`)}>
                  <Building2 className="h-3.5 w-3.5 mr-1.5" />{a.nom}
                </Button>
              ))}
            </div>
          )}
        </div>
        <SupervisionPanel
          devices={devices}
          scopeLabel={agenceFilter ? `Agence ${agenceFilter}` : `Tous les équipements de ${client.nom}`}
          onDeviceClick={(d) => { setSelectedDevice(d); setSheetOpen(true); }}
        />
      </div>

      <DeviceDetailSheet device={selectedDevice} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
