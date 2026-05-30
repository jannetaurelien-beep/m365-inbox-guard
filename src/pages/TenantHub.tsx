import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  CheckCircle2,
  Zap,
  Globe,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
  region: string;
  primary?: boolean;
}

const tenantsOperateurs: Tenant[] = [
  {
    id: 't-grcs',
    nom: 'it-grcs',
    slug: 'IT-GRCS',
    role: 'Owner',
    type: 'operateur',
    utilisateurs: 24,
    licences: 30,
    statut: 'actif',
    derniereSync: 'il y a 2 min',
    region: 'Europe — France',
    primary: true,
  },
];

const tenantsClients: Tenant[] = [
  {
    id: 't-acme',
    nom: 'Acme Industries',
    slug: 'ACME',
    role: 'Admin',
    type: 'client',
    utilisateurs: 142,
    licences: 160,
    statut: 'actif',
    derniereSync: 'il y a 5 min',
    region: 'Europe — France',
  },
  {
    id: 't-lumina',
    nom: 'Lumina Studio',
    slug: 'LUMINA',
    role: 'Admin',
    type: 'client',
    utilisateurs: 38,
    licences: 40,
    statut: 'sync',
    derniereSync: 'synchronisation…',
    region: 'Europe — France',
  },
  {
    id: 't-nordtech',
    nom: 'NordTech Solutions',
    slug: 'NORDTECH',
    role: 'Owner',
    type: 'client',
    utilisateurs: 96,
    licences: 100,
    statut: 'actif',
    derniereSync: 'il y a 12 min',
    region: 'Europe — France',
  },
  {
    id: 't-atlas',
    nom: 'Atlas Logistique',
    slug: 'ATLAS-LOG',
    role: 'Admin',
    type: 'client',
    utilisateurs: 215,
    licences: 220,
    statut: 'attention',
    derniereSync: 'il y a 3 h',
    region: 'Europe — France',
  },
  {
    id: 't-vertex',
    nom: 'Vertex Avocats',
    slug: 'VERTEX',
    role: 'Lecture',
    type: 'client',
    utilisateurs: 24,
    licences: 25,
    statut: 'actif',
    derniereSync: 'il y a 1 h',
    region: 'Europe — France',
  },
];

const statusStyle: Record<Tenant['statut'], { label: string; cls: string; dot: string }> = {
  actif: {
    label: 'Actif',
    cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  sync: {
    label: 'Sync en cours',
    cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    dot: 'bg-blue-500 animate-pulse',
  },
  attention: {
    label: 'Attention',
    cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
  },
};

export default function TenantHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleEnter = (tenant: Tenant) => {
    localStorage.setItem('active-tenant', JSON.stringify({ id: tenant.id, nom: tenant.nom, slug: tenant.slug }));
    navigate('/dashboard');
  };

  const filterTenants = (list: Tenant[]) =>
    list.filter(
      (t) =>
        t.nom.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase()),
    );

  const operateurs = filterTenants(tenantsOperateurs);
  const clients = filterTenants(tenantsClients);
  const totalTenants = tenantsOperateurs.length + tenantsClients.length;

  return (
    <div className="min-h-screen -m-6 p-6 bg-gradient-to-br from-background via-background to-primary/5">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 mb-8 shadow-2xl"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_60%)]" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/15">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Mode multi-tenant
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Choisis le tenant Microsoft 365 à administrer
            </h1>
            <p className="text-white/70 text-base lg:text-lg leading-relaxed">
              Ce hub centralise les environnements qui te sont rattachés. Entre dans un tenant pour accéder
              aux utilisateurs, licences, automatisations et contrôles de sécurité correspondants.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 min-w-[140px]">
              <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest mb-2">
                <Building2 className="h-3.5 w-3.5" />
                Tenants
              </div>
              <div className="text-3xl font-bold text-white">{totalTenants}</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 min-w-[160px]">
              <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Accès
              </div>
              <div className="text-2xl font-bold text-white">Centralisé</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* GUIDED ONBOARDING */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        <Card className="lg:col-span-2 p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
            Connexion Microsoft 365
          </Badge>
          <h2 className="text-2xl font-bold mb-2">Ajouter un nouveau tenant de façon guidée</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Depuis ce hub, tu peux créer un nouveau tenant client puis être redirigé directement vers la page de
            configuration Microsoft 365 pour enregistrer l'application Azure, valider les permissions et lancer la
            première synchronisation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
            {[
              { n: 1, title: 'Créer le tenant', desc: 'Nom, slug optionnel et rattachement au tenant opérateur.' },
              { n: 2, title: 'Connecter Microsoft 365', desc: 'Tenant ID, Client ID, secret et vérification des droits Graph.' },
              { n: 3, title: 'Synchroniser', desc: 'Premier import utilisateurs, licences, groupes et données utiles.' },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                    {s.n}
                  </div>
                  <span className="font-semibold text-sm">{s.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tenant opérateur</div>
          <div className="text-xl font-bold mb-4">1 tenant disponible</div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 mb-4 flex-1">
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-foreground/80">La création ouvrira ensuite automatiquement :</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  <span className="font-semibold text-foreground">Paramètres &gt; Connexion Microsoft 365</span> du
                  nouveau tenant, avec l'assistant prêt à être suivi.
                </p>
              </div>
            </div>
          </div>
          <Button size="lg" className="w-full group">
            Créer et configurer un tenant
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Utilise ce parcours pour les nouveaux clients managés rattachés à ton tenant MSP.
          </p>
        </Card>
      </motion.div>

      {/* SEARCH */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un tenant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau tenant
        </Button>
      </motion.div>

      {/* OPERATOR TENANTS */}
      {operateurs.length > 0 && (
        <section className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Tenants opérateurs / MSP
              </h3>
              <p className="text-sm text-muted-foreground">
                Console(s) centrale(s) permettant de piloter plusieurs environnements clients.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {operateurs.map((tenant, i) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                index={i}
                hovered={hoveredId === tenant.id}
                onHover={setHoveredId}
                onEnter={handleEnter}
              />
            ))}
          </div>
        </section>
      )}

      {/* CLIENT TENANTS */}
      {clients.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Tenants clients
              </h3>
              <p className="text-sm text-muted-foreground">
                Environnements Microsoft 365 que tu administres pour le compte de tes clients.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {clients.length} tenant{clients.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clients.map((tenant, i) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                index={i}
                hovered={hoveredId === tenant.id}
                onHover={setHoveredId}
                onEnter={handleEnter}
              />
            ))}
          </div>
        </section>
      )}

      {operateurs.length === 0 && clients.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun tenant ne correspond à ta recherche.</p>
        </Card>
      )}
    </div>
  );
}

function TenantCard({
  tenant,
  index,
  hovered,
  onHover,
  onEnter,
}: {
  tenant: Tenant;
  index: number;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onEnter: (t: Tenant) => void;
}) {
  const status = statusStyle[tenant.statut];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      onMouseEnter={() => onHover(tenant.id)}
      onMouseLeave={() => onHover(null)}
      className="group relative"
    >
      <Card className="relative overflow-hidden p-5 h-full border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        {/* Hover gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                {tenant.primary && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-card flex items-center justify-center">
                    <Crown className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={status.cls}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
                {status.label}
              </Badge>
            </div>
          </div>

          {/* Identity */}
          <div className="mb-4">
            <h4 className="text-lg font-bold mb-1">{tenant.nom}</h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span className="font-mono">{tenant.slug}</span>
            </div>
          </div>

          {/* Role */}
          <div className="rounded-lg bg-muted/40 px-3 py-2 mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Niveau d'accès</div>
              <div className="text-sm font-semibold">{tenant.role}</div>
            </div>
            <Badge
              variant="outline"
              className={
                tenant.type === 'operateur'
                  ? 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5'
                  : 'border-primary/30 text-primary bg-primary/5'
              }
            >
              {tenant.type === 'operateur' ? 'Opérateur / MSP' : 'Client managé'}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Stat icon={Users} label="Utilisateurs" value={tenant.utilisateurs} />
            <Stat icon={Cloud} label="Licences" value={tenant.licences} />
            <Stat icon={Zap} label="Sync" value="" sub={tenant.derniereSync} />
          </div>

          {/* CTA */}
          <Button
            onClick={() => onEnter(tenant)}
            className="w-full group/btn"
            variant={hovered ? 'default' : 'secondary'}
          >
            Ouvrir ce tenant
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/50 p-2.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      {value !== '' && <div className="text-base font-bold leading-none">{value}</div>}
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{sub}</div>}
    </div>
  );
}
