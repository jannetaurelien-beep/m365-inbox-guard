import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Activity, Search, CheckCircle2, AlertTriangle, XCircle, Wifi, HardDrive,
  Database, Zap, Cpu, ShieldCheck, Server, Laptop, Smartphone, PhoneCall, Bell,
  Camera, Network, Printer, Boxes
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import type { EnrichedDevice, ParcCategorie } from '@/lib/mock-data/parc-details';

const CAT_META: Record<ParcCategorie, { label: string; icon: any; color: string }> = {
  serveur: { label: 'Serveurs', icon: Server, color: 'from-violet-500 to-purple-600' },
  poste: { label: 'Postes', icon: Laptop, color: 'from-blue-500 to-indigo-600' },
  mobile: { label: 'Mobiles', icon: Smartphone, color: 'from-emerald-500 to-teal-600' },
  telephonie: { label: 'Téléphonie', icon: PhoneCall, color: 'from-cyan-500 to-sky-600' },
  alarme: { label: 'Alarme', icon: Bell, color: 'from-rose-500 to-red-600' },
  videosurveillance: { label: 'Vidéo', icon: Camera, color: 'from-fuchsia-500 to-pink-600' },
  reseau: { label: 'Réseau', icon: Network, color: 'from-amber-500 to-orange-600' },
  'lien-internet': { label: 'Liens internet', icon: Wifi, color: 'from-lime-500 to-emerald-600' },
  imprimante: { label: 'Impression', icon: Printer, color: 'from-slate-500 to-zinc-600' },
  autre: { label: 'Autre', icon: Boxes, color: 'from-stone-500 to-neutral-600' },
};

interface Props {
  devices: EnrichedDevice[];
  scopeLabel?: string;
  onDeviceClick?: (d: EnrichedDevice) => void;
}

type HealthLevel = 'ok' | 'warn' | 'critical';

function evalHealth(d: EnrichedDevice): { level: HealthLevel; reasons: string[] } {
  const reasons: string[] = [];
  let level: HealthLevel = 'ok';
  const bump = (l: HealthLevel) => {
    if (l === 'critical') level = 'critical';
    else if (l === 'warn' && level !== 'critical') level = 'warn';
  };
  if (d.status === 'hors-service') { bump('critical'); reasons.push('Hors-service'); }
  if (d.status === 'maintenance') { bump('warn'); reasons.push('Maintenance'); }
  if (d.miseAJour && !d.miseAJour.aJour) { bump('warn'); reasons.push(`${d.miseAJour.patchsManquants} patch(s) en attente`); }
  if (d.sauvegarde && !d.sauvegarde.connectee) { bump('critical'); reasons.push('Sauvegarde non connectée'); }
  if (d.stockage) {
    d.stockage.forEach(s => {
      const pct = ((s.totalGo - s.libreGo) / s.totalGo) * 100;
      if (pct >= 90) { bump('critical'); reasons.push(`${s.nom} saturé (${Math.round(pct)}%)`); }
      else if (pct >= 80) { bump('warn'); reasons.push(`${s.nom} > 80%`); }
      if (s.sante === 'Critique') { bump('critical'); reasons.push(`Disque ${s.nom} critique`); }
      else if (s.sante === 'Avertissement') bump('warn');
    });
  }
  if (d.lien) {
    if (d.lien.uptime < 99) { bump('warn'); reasons.push(`Uptime ${d.lien.uptime}%`); }
    if (d.lien.latence > 50) { bump('warn'); reasons.push(`Latence ${d.lien.latence}ms`); }
  }
  if (d.garantie) {
    const days = (new Date(d.garantie.fin).getTime() - Date.now()) / 86400000;
    if (days < 0) { bump('warn'); reasons.push('Garantie expirée'); }
    else if (days < 60) { bump('warn'); reasons.push(`Garantie expire dans ${Math.round(days)}j`); }
  }
  return { level, reasons };
}

const healthBadge: Record<HealthLevel, { label: string; cls: string; icon: any }> = {
  ok: { label: 'Sain', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  warn: { label: 'À surveiller', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30', icon: AlertTriangle },
  critical: { label: 'Critique', cls: 'bg-destructive/15 text-destructive border-destructive/30', icon: XCircle },
};

export function SupervisionPanel({ devices, scopeLabel, onDeviceClick }: Props) {
  const [filter, setFilter] = useState<ParcCategorie | 'all'>('all');
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<HealthLevel | 'all'>('all');

  const evaluated = useMemo(
    () => devices.map(d => ({ d, h: evalHealth(d) })),
    [devices]
  );

  const counts = useMemo(() => {
    const c = { total: evaluated.length, ok: 0, warn: 0, critical: 0 };
    evaluated.forEach(({ h }) => { c[h.level]++; });
    return c;
  }, [evaluated]);

  const filtered = useMemo(() =>
    evaluated.filter(({ d, h }) =>
      (filter === 'all' || d.categorie === filter) &&
      (healthFilter === 'all' || h.level === healthFilter) &&
      (search === '' || d.nom.toLowerCase().includes(search.toLowerCase()) || (d.utilisateur || '').toLowerCase().includes(search.toLowerCase()))
    ),
    [evaluated, filter, healthFilter, search]
  );

  const presentCats = Array.from(new Set(devices.map(d => d.categorie))) as ParcCategorie[];

  return (
    <div className="space-y-4">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Équipements', value: counts.total, icon: Activity, color: 'from-indigo-500 to-blue-600', onClick: () => setHealthFilter('all') },
          { label: 'Sains', value: counts.ok, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', onClick: () => setHealthFilter('ok') },
          { label: 'À surveiller', value: counts.warn, icon: AlertTriangle, color: 'from-amber-500 to-orange-600', onClick: () => setHealthFilter('warn') },
          { label: 'Critiques', value: counts.critical, icon: XCircle, color: 'from-rose-500 to-red-600', onClick: () => setHealthFilter('critical') },
        ].map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={s.onClick}
            className="text-left p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-3 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/40 hover:bg-muted text-foreground'}`}
          >
            <Activity className="h-3.5 w-3.5" /> Tout
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-background/30">{devices.length}</span>
          </button>
          {presentCats.map(cat => {
            const meta = CAT_META[cat];
            const Icon = meta.icon;
            const count = devices.filter(d => d.categorie === cat).length;
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/40 hover:bg-muted text-foreground'}`}
              >
                <Icon className="h-3.5 w-3.5" /> {meta.label}
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-background/30">{count}</span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            {healthFilter !== 'all' && (
              <Button variant="ghost" size="sm" onClick={() => setHealthFilter('all')} className="h-8 text-xs">
                Réinitialiser état
              </Button>
            )}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8" />
            </div>
          </div>
        </div>
        {scopeLabel && (
          <p className="text-[11px] text-muted-foreground mt-2 px-1">Périmètre : <span className="font-medium text-foreground">{scopeLabel}</span> · {filtered.length} équipement(s) affiché(s)</p>
        )}
      </Card>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(({ d, h }, i) => {
          const meta = CAT_META[d.categorie];
          const Icon = meta.icon;
          const HealthIcon = healthBadge[h.level].icon;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
            >
              <Card
                className="p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
                onClick={() => onDeviceClick?.(d)}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{d.nom}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{d.modele} · {d.agence}</p>
                    </div>
                  </div>
                  <Badge className={`${healthBadge[h.level].cls} text-[10px] flex items-center gap-1 flex-shrink-0`}>
                    <HealthIcon className="h-3 w-3" /> {healthBadge[h.level].label}
                  </Badge>
                </div>

                <div className="space-y-2 flex-1">
                  {/* Stockage */}
                  {d.stockage?.[0] && (() => {
                    const s = d.stockage[0];
                    const pct = Math.round(((s.totalGo - s.libreGo) / s.totalGo) * 100);
                    return (
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1 text-muted-foreground"><HardDrive className="h-3 w-3" />{s.nom}</span>
                          <span className={pct >= 85 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>{s.libreGo}/{s.totalGo} Go</span>
                        </div>
                        <Progress value={pct} className={`h-1.5 ${pct >= 85 ? '[&>div]:bg-destructive' : pct >= 70 ? '[&>div]:bg-amber-500' : ''}`} />
                      </div>
                    );
                  })()}

                  {/* Sauvegarde */}
                  {d.sauvegarde && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-muted-foreground"><Database className="h-3 w-3" />Sauvegarde</span>
                      <span className={d.sauvegarde.connectee ? 'text-emerald-600 font-medium' : 'text-destructive font-medium'}>
                        {d.sauvegarde.connectee ? `OK · ${d.sauvegarde.dernierSucces}` : 'Non connectée'}
                      </span>
                    </div>
                  )}

                  {/* MAJ */}
                  {d.miseAJour && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-muted-foreground"><Zap className="h-3 w-3" />Mises à jour</span>
                      <span className={d.miseAJour.aJour ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                        {d.miseAJour.aJour ? 'À jour' : `${d.miseAJour.patchsManquants} en attente`}
                      </span>
                    </div>
                  )}

                  {/* Lien internet : mini graph */}
                  {d.lien && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="flex items-center gap-1 text-muted-foreground"><Wifi className="h-3 w-3" />{d.lien.debit}</span>
                        <span className="text-emerald-600 font-medium">{d.lien.uptime}% · {d.lien.latence}ms</span>
                      </div>
                      <div className="h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={d.lien.bandwidth24h}>
                            <defs>
                              <linearGradient id={`spv-${d.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', fontSize: 11, borderRadius: 6, padding: '4px 8px' }} labelFormatter={(l) => `${l}`} />
                            <Area type="monotone" dataKey="down" stroke="hsl(var(--primary))" fill={`url(#spv-${d.id})`} strokeWidth={1.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Garantie */}
                  {d.garantie && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-muted-foreground"><ShieldCheck className="h-3 w-3" />Garantie</span>
                      <span className="text-foreground">{new Date(d.garantie.fin).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                {h.reasons.length > 0 && h.level !== 'ok' && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                    {h.reasons.slice(0, 2).map((r, j) => (
                      <p key={j} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <AlertTriangle className="h-2.5 w-2.5 mt-0.5 text-amber-500 flex-shrink-0" />{r}
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="col-span-full p-10 text-center text-sm text-muted-foreground">
            Aucun équipement ne correspond aux filtres.
          </Card>
        )}
      </div>
    </div>
  );
}
