import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, Clock, AlertTriangle, CheckCircle2, Activity, FileText, Fingerprint, Mail, AppWindow, Share2, Globe, Users, Laptop, Wrench } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScoreRing } from '@/components/security/ScoreRing';
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
  ready: { label: 'Prêt', color: 'text-emerald-500', icon: CheckCircle2 },
  pending: { label: 'En attente', color: 'text-amber-500', icon: Clock },
  refreshing: { label: 'Actualisation…', color: 'text-blue-500', icon: RefreshCw },
  error: { label: 'Erreur', color: 'text-red-500', icon: AlertTriangle },
};

const tabItems = [
  { value: 'identity', label: 'Identité', icon: Fingerprint },
  { value: 'messaging', label: 'Messagerie', icon: Mail },
  { value: 'apps', label: 'Applications', icon: AppWindow },
  { value: 'collaboration', label: 'Collaboration', icon: Share2 },
  { value: 'dns', label: 'DNS', icon: Globe },
  { value: 'guests', label: 'Invités', icon: Users },
  { value: 'devices', label: 'Appareils', icon: Laptop },
  { value: 'hygiene', label: 'Hygiène', icon: Wrench },
];

function getDimensionColor(score: number) {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

function getDimensionBg(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export default function CyberSecurity() {
  const [activeTab, setActiveTab] = useState('identity');
  const snapStatus = snapshotStatusConfig[auditHeader.snapshotStatus];
  const SnapIcon = snapStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <ScoreRing score={auditHeader.globalScore} size={120} strokeWidth={10} label={auditHeader.postureLabel} />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Audit de sécurité M365</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Généré le {new Date(auditHeader.generatedAt).toLocaleDateString('fr-FR')} à {new Date(auditHeader.generatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              <span>Durée : {auditHeader.computeDuration}</span>
              <span>Snapshot : {auditHeader.snapshotAge}</span>
              <span className={`flex items-center gap-1 font-medium ${snapStatus.color}`}><SnapIcon className="h-3.5 w-3.5" /> {snapStatus.label}</span>
            </div>
            {auditHeader.partialData && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Données partielles : {auditHeader.partialSources.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Hero KPIs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {heroKPIs.map(k => (
          <SecurityKPICard key={k.label} label={k.label} value={k.value} severity={k.color} />
        ))}
      </motion.div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          {/* Executive Summary */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Synthèse exécutive</h2>
            </div>
            <ul className="space-y-2">
              {executiveSummary.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary font-bold shrink-0">•</span>{s}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coverage */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Couverture</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coverageMetrics.map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-bold text-foreground">{m.value}%</span>
                  </div>
                  <Progress value={m.value} className="h-2" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* 4 Dimensions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Score en 4 dimensions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dimensionScores.map(d => (
                <div key={d.label} className="rounded-lg border border-border p-4 text-center">
                  <p className={`text-3xl font-bold ${getDimensionColor(d.score)}`}>{d.score}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{d.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.description}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${getDimensionBg(d.score)}`} style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
                {tabItems.map(t => (
                  <TabsTrigger key={t.value} value={t.value} className="flex items-center gap-1.5 text-xs px-3 py-2">
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="mt-4">
                <TabsContent value="identity"><IdentityTab /></TabsContent>
                <TabsContent value="messaging"><MessagingTab /></TabsContent>
                <TabsContent value="apps"><AppsTab /></TabsContent>
                <TabsContent value="collaboration"><CollaborationTab /></TabsContent>
                <TabsContent value="dns"><DnsTab /></TabsContent>
                <TabsContent value="guests"><GuestsTab /></TabsContent>
                <TabsContent value="devices"><DevicesTab /></TabsContent>
                <TabsContent value="hygiene"><HygieneTab /></TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-80 shrink-0">
          <div className="xl:sticky xl:top-6 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Plan d'action priorisé</h3>
              </div>
              <div className="space-y-2">
                {actionPlan.map(a => (
                  <div key={a.priority} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">{a.priority}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{a.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <SeverityBadge severity={a.severity} />
                        <span className="text-[10px] text-muted-foreground">{a.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Couverture & Gouvernance</h3>
              <div className="space-y-3">
                {[
                  { label: 'Comptes audités', value: '342 / 380' },
                  { label: 'Sites SharePoint', value: '45 / 52' },
                  { label: 'Domaines DNS', value: '5 / 5' },
                  { label: 'Appareils Entra ID', value: '234 / ~280' },
                ].map(m => (
                  <div key={m.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-medium text-foreground">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Repères d'interprétation</h3>
              <div className="space-y-2 text-xs">
                {[
                  { color: 'bg-red-500', label: 'Critique — Action immédiate requise' },
                  { color: 'bg-orange-500', label: 'Élevé — À corriger sous 7 jours' },
                  { color: 'bg-amber-500', label: 'Moyen — À planifier sous 30 jours' },
                  { color: 'bg-blue-500', label: 'Info — À surveiller' },
                  { color: 'bg-emerald-500', label: 'Sain — Conforme' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${r.color} shrink-0`} />
                    <span className="text-muted-foreground">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {auditHeader.partialData && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-amber-600">Données partielles</p>
                    <p className="text-muted-foreground">{auditHeader.partialSources.join(', ')}</p>
                  </div>
                </div>
              )}
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 flex items-start gap-2">
                <RefreshCw className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-blue-600">Prochain refresh</p>
                  <p className="text-muted-foreground">Planifié dans 4 heures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}