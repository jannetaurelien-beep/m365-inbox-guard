import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, RefreshCw, Clock, AlertTriangle, CheckCircle2, Activity,
  FileText, Fingerprint, Mail, AppWindow, Share2, Globe, Users,
  Laptop, Wrench, Zap, TrendingDown, Eye, ShieldCheck
} from 'lucide-react';
import { ScoreRing, MiniScore } from '@/components/security/ScoreRing';
import { SecurityKPICard } from '@/components/security/SecurityKPICard';
import { SeverityBadge } from '@/components/security/FindingCard';
import { IdentityTab } from '@/components/security/tabs/IdentityTab';
import { MessagingTab } from '@/components/security/tabs/MessagingTab';
import { AppsTab } from '@/components/security/tabs/AppsTab';
import { CollaborationTab } from '@/components/security/tabs/CollaborationTab';
import { DnsTab } from '@/components/security/tabs/DnsTab';
import { GuestsTab } from '@/components/security/tabs/GuestsTab';
import { DevicesTab } from '@/components/security/tabs/DevicesTab';
import { HygieneTab } from '@/components/security/tabs/HygieneTab';
import {
  auditHeader, heroKPIs, executiveSummary, coverageMetrics,
  dimensionScores, actionPlan
} from '@/lib/mock-data/security-audit';

const snapshotStatusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  ready: { label: 'Opérationnel', color: 'text-emerald-500', icon: CheckCircle2 },
  pending: { label: 'En attente', color: 'text-amber-500', icon: Clock },
  refreshing: { label: 'Synchronisation…', color: 'text-primary', icon: RefreshCw },
  error: { label: 'Erreur', color: 'text-red-500', icon: AlertTriangle },
};

const tabItems = [
  { value: 'identity', label: 'Identité', icon: Fingerprint, count: 9 },
  { value: 'messaging', label: 'Messagerie', icon: Mail, count: 4 },
  { value: 'apps', label: 'Applications', icon: AppWindow, count: 3 },
  { value: 'collaboration', label: 'Collaboration', icon: Share2, count: 3 },
  { value: 'dns', label: 'DNS', icon: Globe, count: 1 },
  { value: 'guests', label: 'Invités', icon: Users, count: 1 },
  { value: 'devices', label: 'Appareils', icon: Laptop, count: 1 },
  { value: 'hygiene', label: 'Hygiène', icon: Wrench, count: 4 },
];

const dimensionIcons = [ShieldCheck, Eye, Zap, TrendingDown];

function getDimensionColor(score: number) {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export default function CyberSecurity() {
  const [activeTab, setActiveTab] = useState('identity');
  const snapStatus = snapshotStatusConfig[auditHeader.snapshotStatus];
  const SnapIcon = snapStatus.icon;

  return (
    <div className="space-y-6">
      {/* ═══ HERO COMMAND STRIP ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex flex-col xl:flex-row">
          {/* Score Section */}
          <div className="flex items-center justify-center p-8 border-b xl:border-b-0 xl:border-r border-border bg-muted/20">
            <ScoreRing score={auditHeader.globalScore} size={140} strokeWidth={8} label={auditHeader.postureLabel} />
          </div>

          {/* Info + KPIs */}
          <div className="flex-1 p-6">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground tracking-tight">Audit Sécurité M365</h1>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(auditHeader.generatedAt).toLocaleDateString('fr-FR')} — {auditHeader.computeDuration}
                    </span>
                    <span className={`flex items-center gap-1 font-semibold ${snapStatus.color}`}>
                      <SnapIcon className="h-3 w-3" /> {snapStatus.label}
                    </span>
                  </div>
                </div>
              </div>

              {auditHeader.partialData && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Données partielles
                </div>
              )}
            </div>

            {/* Hero KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {heroKPIs.map((k, i) => (
                <SecurityKPICard key={k.label} label={k.label} value={k.value} severity={k.color} index={i} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ DIMENSIONS + EXECUTIVE ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 4 Dimensions */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Score en 4 dimensions</h2>
          <div className="grid grid-cols-2 gap-3">
            {dimensionScores.map((d, i) => {
              const DIcon = dimensionIcons[i];
              return (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="rounded-xl border border-border p-4 bg-muted/20 hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DIcon className={`h-4 w-4 ${getDimensionColor(d.score)}`} />
                      <span className="text-sm font-semibold text-foreground">{d.label}</span>
                    </div>
                    <MiniScore score={d.score} size={40} />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{d.description}</p>
                  {/* Score bar */}
                  <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        d.score >= 80 ? 'bg-emerald-500' : d.score >= 60 ? 'bg-amber-500' : d.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${d.score}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Executive Summary + Coverage */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Synthèse exécutive</h2>
            </div>
            <div className="space-y-2.5">
              {executiveSummary.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span>{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Couverture</h2>
            <div className="space-y-3">
              {coverageMetrics.map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-medium">{m.label}</span>
                    <span className={`font-black ${m.value >= 80 ? 'text-emerald-500' : m.value >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{m.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${m.value >= 80 ? 'bg-emerald-500' : m.value >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Category tabs */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Tab navigation — vertical sidebar style on large, horizontal on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border bg-card p-1.5"
          >
            <div className="flex flex-wrap gap-1">
              {tabItems.map(t => {
                const isActive = activeTab === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setActiveTab(t.value)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t.label}</span>
                    {t.count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab content with transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'identity' && <IdentityTab />}
              {activeTab === 'messaging' && <MessagingTab />}
              {activeTab === 'apps' && <AppsTab />}
              {activeTab === 'collaboration' && <CollaborationTab />}
              {activeTab === 'dns' && <DnsTab />}
              {activeTab === 'guests' && <GuestsTab />}
              {activeTab === 'devices' && <DevicesTab />}
              {activeTab === 'hygiene' && <HygieneTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <div className="w-full xl:w-72 shrink-0">
          <div className="xl:sticky xl:top-6 space-y-4">
            {/* Action Plan */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Plan d'action</h3>
              </div>
              <div className="space-y-1.5">
                {actionPlan.map((a, i) => (
                  <motion.div
                    key={a.priority}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-default"
                  >
                    <span className={`w-5 h-5 rounded-md text-[10px] flex items-center justify-center font-bold shrink-0 ${
                      a.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                      a.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                      a.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                    }`}>
                      {a.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-foreground leading-tight">{a.label}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <SeverityBadge severity={a.severity} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Governance */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Gouvernance</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Comptes audités', value: '342 / 380' },
                  { label: 'Sites SharePoint', value: '45 / 52' },
                  { label: 'Domaines DNS', value: '5 / 5' },
                  { label: 'Appareils Entra ID', value: '234 / ~280' },
                ].map(m => (
                  <div key={m.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold text-foreground font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Repères</h3>
              <div className="space-y-2 text-[11px]">
                {[
                  { color: 'bg-red-500', label: 'Critique — Immédiat' },
                  { color: 'bg-orange-500', label: 'Élevé — 7 jours' },
                  { color: 'bg-amber-500', label: 'Moyen — 30 jours' },
                  { color: 'bg-primary', label: 'Info — Surveiller' },
                  { color: 'bg-emerald-500', label: 'Sain — Conforme' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${r.color} shrink-0`} />
                    <span className="text-muted-foreground">{r.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Status alerts */}
            <div className="space-y-2">
              {auditHeader.partialData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-2"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-[11px]">
                    <p className="font-semibold text-amber-600">Données partielles</p>
                    <p className="text-muted-foreground">{auditHeader.partialSources.join(', ')}</p>
                  </div>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div className="text-[11px]">
                  <p className="font-semibold text-primary">Prochain refresh</p>
                  <p className="text-muted-foreground">Planifié dans 4 heures</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
