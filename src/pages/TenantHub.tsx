import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Building2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  Cloud,
  Plus,
  Search,
  Crown,
  Zap,
  Globe,
  Activity,
  Layers,
  Compass,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Tenant {
  id: string;
  nom: string;
  slug: string;
  role: 'Owner' | 'Admin' | 'Lecture';
  type: 'operateur' | 'client';
  utilisateurs: number;
  licences: number;
  statut: 'actif' | 'sync' | 'attention';
  derniereSync: string;
  sante: number; // 0-100
  primary?: boolean;
  accent: string; // tailwind gradient classes
  emoji: string;
}

const tenantsOperateurs: Tenant[] = [
  {
    id: 't-grcs', nom: 'it-grcs', slug: 'IT-GRCS', role: 'Owner', type: 'operateur',
    utilisateurs: 24, licences: 30, statut: 'actif', derniereSync: 'il y a 2 min',
    sante: 98, primary: true, accent: 'from-amber-400 via-orange-500 to-rose-500', emoji: '👑',
  },
];

const tenantsClients: Tenant[] = [
  { id: 't-acme', nom: 'Acme Industries', slug: 'ACME', role: 'Admin', type: 'client',
    utilisateurs: 142, licences: 160, statut: 'actif', derniereSync: 'il y a 5 min',
    sante: 94, accent: 'from-blue-400 via-indigo-500 to-violet-600', emoji: '🏭' },
  { id: 't-lumina', nom: 'Lumina Studio', slug: 'LUMINA', role: 'Admin', type: 'client',
    utilisateurs: 38, licences: 40, statut: 'sync', derniereSync: 'synchronisation…',
    sante: 88, accent: 'from-fuchsia-400 via-pink-500 to-rose-500', emoji: '🎨' },
  { id: 't-nordtech', nom: 'NordTech Solutions', slug: 'NORDTECH', role: 'Owner', type: 'client',
    utilisateurs: 96, licences: 100, statut: 'actif', derniereSync: 'il y a 12 min',
    sante: 91, accent: 'from-cyan-400 via-sky-500 to-blue-600', emoji: '⚡' },
  { id: 't-atlas', nom: 'Atlas Logistique', slug: 'ATLAS-LOG', role: 'Admin', type: 'client',
    utilisateurs: 215, licences: 220, statut: 'attention', derniereSync: 'il y a 3 h',
    sante: 67, accent: 'from-amber-400 via-yellow-500 to-orange-500', emoji: '🚚' },
  { id: 't-vertex', nom: 'Vertex Avocats', slug: 'VERTEX', role: 'Lecture', type: 'client',
    utilisateurs: 24, licences: 25, statut: 'actif', derniereSync: 'il y a 1 h',
    sante: 89, accent: 'from-emerald-400 via-teal-500 to-cyan-600', emoji: '⚖️' },
  { id: 't-ocean', nom: 'OcéanPlus', slug: 'OCEANPLUS', role: 'Admin', type: 'client',
    utilisateurs: 12, licences: 15, statut: 'actif', derniereSync: 'il y a 25 min',
    sante: 82, accent: 'from-teal-400 via-cyan-500 to-sky-600', emoji: '🌊' },
];

const statusMap = {
  actif: { label: 'Opérationnel', dot: 'bg-emerald-400', ring: 'ring-emerald-400/40' },
  sync: { label: 'Synchronisation', dot: 'bg-sky-400 animate-pulse', ring: 'ring-sky-400/40' },
  attention: { label: 'Attention', dot: 'bg-amber-400', ring: 'ring-amber-400/40' },
} as const;

export default function TenantHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'operateur' | 'client'>('all');

  const handleEnter = (t: Tenant) => {
    localStorage.setItem('active-tenant', JSON.stringify({ id: t.id, nom: t.nom, slug: t.slug }));
    navigate('/dashboard');
  };

  const allTenants = [...tenantsOperateurs, ...tenantsClients];
  const filtered = useMemo(() =>
    allTenants.filter(t =>
      (filter === 'all' || t.type === filter) &&
      (t.nom.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase()))
    ), [search, filter]
  );

  const stats = {
    total: allTenants.length,
    users: allTenants.reduce((s, t) => s + t.utilisateurs, 0),
    licences: allTenants.reduce((s, t) => s + t.licences, 0),
    sante: Math.round(allTenants.reduce((s, t) => s + t.sante, 0) / allTenants.length),
  };

  return (
    <div className="relative min-h-screen -m-6 overflow-hidden">
      {/* Animated aurora background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-transparent blur-3xl"
          animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-transparent blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-3xl"
              >
                🚀
              </motion.div>
              <Badge className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-foreground border-violet-500/30 backdrop-blur-md px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1.5" />
                Console multi-tenant
              </Badge>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Choisis ton terrain de jeu.
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Sélectionne le tenant Microsoft 365 à piloter. Chaque carte est une console complète :
              utilisateurs, licences, automatisations, sécurité.
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 blur-2xl opacity-30" />
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white border-0 shadow-2xl shadow-fuchsia-500/30 h-14 px-8 text-base group"
            >
              <Plus className="h-5 w-5 mr-2" />
              Connecter un nouveau tenant
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.header>

        {/* BENTO STATS */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <BentoStat icon={Layers} label="Tenants" value={stats.total} gradient="from-violet-500 to-fuchsia-500" emoji="🌐" />
          <BentoStat icon={Users} label="Utilisateurs" value={stats.users} gradient="from-blue-500 to-cyan-500" emoji="👥" />
          <BentoStat icon={Cloud} label="Licences M365" value={stats.licences} gradient="from-emerald-500 to-teal-500" emoji="☁️" />
          <BentoStat icon={Activity} label="Santé globale" value={`${stats.sante}%`} gradient="from-amber-500 to-orange-500" emoji="💚" />
        </motion.section>

        {/* SEARCH + FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un tenant par nom ou slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card/50 backdrop-blur-xl border-border/50 rounded-2xl"
            />
          </div>
          <div className="flex gap-2 p-1 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
            {([
              { v: 'all', label: 'Tous', icon: Compass },
              { v: 'operateur', label: 'Opérateurs', icon: Crown },
              { v: 'client', label: 'Clients', icon: Building2 },
            ] as const).map((f) => (
              <button
                key={f.v}
                onClick={() => setFilter(f.v)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === f.v ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter === f.v && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl shadow-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <f.icon className="h-3.5 w-3.5 relative" />
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* TENANTS BENTO */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filtered.map((t, i) => (
            <TenantCard key={t.id} tenant={t} index={i} onEnter={handleEnter} featured={t.primary} />
          ))}
        </motion.section>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground">Aucun tenant ne correspond à ta recherche.</p>
          </div>
        )}

        {/* FOOTER HINT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Connexion sécurisée • Permissions Microsoft Graph validées • Logs d'audit actifs
        </motion.div>
      </div>
    </div>
  );
}

function BentoStat({
  icon: Icon, label, value, gradient, emoji,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; gradient: string; emoji: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 h-full">
        <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`} />
        <div className="flex items-start justify-between mb-3 relative">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">{emoji}</span>
        </div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

function TenantCard({
  tenant, index, onEnter, featured,
}: { tenant: Tenant; index: number; onEnter: (t: Tenant) => void; featured?: boolean }) {
  const status = statusMap[tenant.statut];
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (tenant.sante / 100) * circumference;

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative group ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
    >
      {/* Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${tenant.accent} rounded-3xl opacity-0 group-hover:opacity-60 blur transition-opacity duration-500`} />

      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/70 backdrop-blur-xl h-full flex flex-col">
        {/* Top color bar */}
        <div className={`h-1.5 bg-gradient-to-r ${tenant.accent}`} />

        {/* Decorative gradient blob */}
        <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${tenant.accent} opacity-10 blur-3xl group-hover:opacity-25 transition-opacity duration-500`} />

        <div className="relative p-5 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${tenant.accent} flex items-center justify-center text-2xl shadow-lg`}>
                {tenant.emoji}
                {featured && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-card flex items-center justify-center"
                  >
                    <Star className="h-2.5 w-2.5 text-white fill-white" />
                  </motion.div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">{tenant.nom}</h3>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono mt-0.5">
                  <Globe className="h-2.5 w-2.5" />
                  {tenant.slug}
                </div>
              </div>
            </div>

            {/* Health ring */}
            <div className="relative w-12 h-12 shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="none" className="text-muted/30" />
                <motion.circle
                  cx="20" cy="20" r="18" fill="none" strokeWidth="3" strokeLinecap="round"
                  className={tenant.sante > 85 ? 'text-emerald-400' : tenant.sante > 70 ? 'text-amber-400' : 'text-rose-400'}
                  stroke="currentColor"
                  initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, delay: 0.1 * index, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                {tenant.sante}
              </div>
            </div>
          </div>

          {/* Status + Role */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="outline" className={`bg-card/50 backdrop-blur ring-1 ${status.ring}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
              {status.label}
            </Badge>
            <Badge
              variant="outline"
              className={tenant.type === 'operateur'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30'}
            >
              {tenant.role}
            </Badge>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
            <div className="rounded-xl bg-muted/30 backdrop-blur p-2.5 border border-border/40">
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                <Users className="h-2.5 w-2.5" /> Users
              </div>
              <div className="text-lg font-bold leading-none">{tenant.utilisateurs}</div>
            </div>
            <div className="rounded-xl bg-muted/30 backdrop-blur p-2.5 border border-border/40">
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                <Cloud className="h-2.5 w-2.5" /> Licences
              </div>
              <div className="text-lg font-bold leading-none">{tenant.licences}</div>
            </div>
          </div>

          {/* Sync */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3">
            <Zap className="h-3 w-3" />
            <span>Sync : {tenant.derniereSync}</span>
          </div>

          {/* CTA */}
          <Button
            onClick={() => onEnter(tenant)}
            className={`w-full bg-gradient-to-r ${tenant.accent} text-white hover:opacity-90 border-0 shadow-lg group/btn`}
          >
            Entrer dans ce tenant
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
