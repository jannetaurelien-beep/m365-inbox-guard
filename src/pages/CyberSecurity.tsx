import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ShieldCheck, ShieldAlert, ShieldX, Lock, Unlock, Eye, EyeOff,
  AlertTriangle, CheckCircle2, XCircle, Activity, Wifi, WifiOff,
  Smartphone, Monitor, Globe, Mail, Key, Users, TrendingUp, TrendingDown,
  ChevronRight, RefreshCw, Download, Filter, BarChart3, PieChart,
  FileWarning, Bug, Fingerprint, Zap, Server, Database, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// --- DATA ---
const securityScore = 78;

const kpis = [
  { label: 'Score Secure', value: '78/100', icon: Shield, color: 'from-emerald-500 to-teal-600', trend: '+3', trendUp: true },
  { label: 'MFA activé', value: '94.2%', icon: Fingerprint, color: 'from-blue-500 to-indigo-600', trend: '+1.8%', trendUp: true },
  { label: 'Menaces bloquées', value: '2,847', icon: ShieldX, color: 'from-rose-500 to-red-600', trend: '30j', trendUp: false },
  { label: 'Appareils conformes', value: '87.5%', icon: Smartphone, color: 'from-violet-500 to-purple-600', trend: '+2.1%', trendUp: true },
  { label: 'Alertes actives', value: '12', icon: AlertTriangle, color: 'from-amber-500 to-orange-600', trend: '-5', trendUp: true },
  { label: 'Politiques CA', value: '23', icon: Lock, color: 'from-cyan-500 to-blue-600', trend: 'actives', trendUp: true },
];

const threats = [
  { type: 'Phishing', count: 1243, blocked: 1238, icon: Mail, severity: 'high' },
  { type: 'Malware', count: 387, blocked: 385, icon: Bug, severity: 'critical' },
  { type: 'Brute Force', count: 892, blocked: 892, icon: Key, severity: 'medium' },
  { type: 'Fuites de données', count: 23, blocked: 19, icon: FileWarning, severity: 'high' },
  { type: 'Accès suspects', count: 156, blocked: 148, icon: EyeOff, severity: 'medium' },
];

const alerts = [
  { id: 1, title: 'Connexion impossible voyage - Marc Dupont', severity: 'critical', time: 'Il y a 12 min', status: 'new', source: 'Identity Protection' },
  { id: 2, title: 'Téléchargement massif détecté - Service RH', severity: 'high', time: 'Il y a 34 min', status: 'investigating', source: 'Cloud App Security' },
  { id: 3, title: 'Règle de transfert suspecte - inbox Julie Martin', severity: 'high', time: 'Il y a 1h', status: 'investigating', source: 'Exchange Online' },
  { id: 4, title: 'Appareil non conforme - 3 devices Windows', severity: 'medium', time: 'Il y a 2h', status: 'new', source: 'Intune' },
  { id: 5, title: 'Tentatives MFA échouées multiples - Compta', severity: 'medium', time: 'Il y a 3h', status: 'resolved', source: 'Azure AD' },
  { id: 6, title: 'Application OAuth à haut risque autorisée', severity: 'high', time: 'Il y a 4h', status: 'new', source: 'Cloud App Security' },
  { id: 7, title: 'Accès conditionnel contourné - VPN externe', severity: 'low', time: 'Il y a 5h', status: 'resolved', source: 'Conditional Access' },
];

const identityRisks = [
  { user: 'Marc Dupont', risk: 'high', lastSign: 'São Paulo, Brésil', device: 'Inconnu', mfa: false },
  { user: 'Julie Martin', risk: 'medium', lastSign: 'Paris, France', device: 'iPhone 15', mfa: true },
  { user: 'Service Compta', risk: 'medium', lastSign: 'Lyon, France', device: 'Windows 11', mfa: false },
  { user: 'Admin IT Backup', risk: 'low', lastSign: 'Paris, France', device: 'Windows 11', mfa: true },
];

const compliancePolicies = [
  { name: 'Bloquer les pays à risque', status: 'active', users: 'Tous', type: 'Accès conditionnel' },
  { name: 'Exiger MFA admin', status: 'active', users: 'Admins', type: 'Accès conditionnel' },
  { name: 'Bloquer legacy auth', status: 'active', users: 'Tous', type: 'Accès conditionnel' },
  { name: 'Chiffrement emails sensibles', status: 'active', users: 'Direction', type: 'DLP' },
  { name: 'Rétention 7 ans Compta', status: 'active', users: 'Comptabilité', type: 'Rétention' },
  { name: 'Anti-phishing avancé', status: 'warning', users: 'Tous', type: 'Defender' },
  { name: 'Safe Attachments', status: 'active', users: 'Tous', type: 'Defender' },
  { name: 'Conformité appareil Win11', status: 'warning', users: 'Tous', type: 'Intune' },
];

const severityColor = (s: string) => {
  switch (s) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-muted text-muted-foreground';
  }
};

const statusLabel = (s: string) => {
  switch (s) {
    case 'new': return { label: 'Nouveau', cls: 'bg-red-500/15 text-red-400' };
    case 'investigating': return { label: 'En cours', cls: 'bg-amber-500/15 text-amber-400' };
    case 'resolved': return { label: 'Résolu', cls: 'bg-emerald-500/15 text-emerald-400' };
    default: return { label: s, cls: 'bg-muted text-muted-foreground' };
  }
};

// --- COMPONENTS ---

function ScoreRing({ score }: { score: number }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
        <motion.circle
          cx="100" cy="100" r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform="rotate(-90 100 100)"
          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-4xl font-black tracking-tight"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium">/100</span>
        <span className="text-[10px] text-muted-foreground mt-1">Microsoft Secure Score</span>
      </div>
    </div>
  );
}

function ThreatBar({ threat }: { threat: typeof threats[0] }) {
  const pct = (threat.blocked / threat.count) * 100;
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
        <threat.icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{threat.type}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{threat.blocked}/{threat.count}</span>
            <Badge className={`text-[10px] px-1.5 py-0 ${severityColor(threat.severity)}`}>
              {threat.severity}
            </Badge>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: pct === 100
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : pct > 95
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

// --- PAGE ---
export default function CyberSecurity() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMGI0NjAiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHptMC01aDR2MWgtNHptNSA1aDR2MWgtNHptLTEwIDBoNHYxaC00em01LTVoNHYxaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Cybersécurité — Tenant 365</h1>
              <p className="text-sm text-slate-400 mt-0.5">Analyse temps réel · Microsoft Defender · Entra ID · Intune</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300">Surveillance active</span>
            </div>
            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-1" /> Actualiser
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
              <Download className="h-4 w-4 mr-1" /> Rapport
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="relative overflow-hidden border-border/50 hover:border-border transition-colors group cursor-default">
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity`} />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                    <kpi.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${kpi.trendUp ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                    {kpi.trendUp ? <TrendingUp className="h-3 w-3" /> : null}
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 border border-border/50">
          <TabsTrigger value="overview" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="alerts" className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />Alertes</TabsTrigger>
          <TabsTrigger value="identity" className="gap-1.5"><Fingerprint className="h-3.5 w-3.5" />Identités</TabsTrigger>
          <TabsTrigger value="policies" className="gap-1.5"><Lock className="h-3.5 w-3.5" />Politiques</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Score Ring */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/50 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pb-4">
                  <ScoreRing score={securityScore} />
                  <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                    {[
                      { label: 'Identité', score: 82, color: 'bg-blue-500' },
                      { label: 'Données', score: 71, color: 'bg-violet-500' },
                      { label: 'Appareils', score: 88, color: 'bg-emerald-500' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-lg font-bold">{s.score}%</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                        <div className="h-1 rounded-full bg-muted/30 mt-1 overflow-hidden">
                          <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Threats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
              <Card className="border-border/50 h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-orange-500" /> Menaces détectées (30j)
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">2,701 bloquées</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-4">
                  {threats.map((t, i) => (
                    <motion.div
                      key={t.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <ThreatBar threat={t} />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* MFA & Device Compliance & Email Security */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-blue-500" /> Couverture MFA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {[
                  { label: 'Admins globaux', pct: 100 },
                  { label: 'Utilisateurs privilégiés', pct: 97 },
                  { label: 'Utilisateurs standard', pct: 92 },
                  { label: 'Comptes de service', pct: 45 },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className={`font-semibold ${m.pct === 100 ? 'text-emerald-500' : m.pct > 90 ? 'text-blue-500' : 'text-amber-500'}`}>
                        {m.pct}%
                      </span>
                    </div>
                    <Progress value={m.pct} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-violet-500" /> Conformité appareils
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {[
                  { label: 'Windows 11', total: 142, compliant: 128, icon: Monitor },
                  { label: 'macOS', total: 23, compliant: 21, icon: Monitor },
                  { label: 'iOS / iPadOS', total: 87, compliant: 82, icon: Smartphone },
                  { label: 'Android', total: 34, compliant: 27, icon: Smartphone },
                ].map(d => (
                  <div key={d.label} className="flex items-center gap-3">
                    <d.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{d.label}</span>
                        <span className="text-muted-foreground">{d.compliant}/{d.total}</span>
                      </div>
                      <Progress value={(d.compliant / d.total) * 100} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-500" /> Sécurité email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                {[
                  { label: 'Anti-phishing', status: 'active', detail: '1,238 bloqués' },
                  { label: 'Anti-malware', status: 'active', detail: '385 bloqués' },
                  { label: 'Safe Links', status: 'active', detail: '12,340 scannés' },
                  { label: 'Safe Attachments', status: 'active', detail: '8,920 scannés' },
                  { label: 'DKIM', status: 'active', detail: 'Configuré' },
                  { label: 'DMARC', status: 'warning', detail: 'p=none' },
                  { label: 'SPF', status: 'active', detail: 'Pass' },
                ].map(e => (
                  <div key={e.label} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      {e.status === 'active'
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      }
                      <span className="text-xs font-medium">{e.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{e.detail}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Alertes de sécurité
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                    3 critiques
                  </Badge>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Filter className="h-3 w-3 mr-1" /> Filtrer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {alerts.map((alert, i) => {
                  const st = statusLabel(alert.status);
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-6 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        alert.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                        alert.severity === 'high' ? 'bg-orange-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{alert.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{alert.source}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />{alert.time}
                          </span>
                        </div>
                      </div>
                      <Badge className={`${severityColor(alert.severity)} text-[10px] px-1.5 py-0 border`}>
                        {alert.severity}
                      </Badge>
                      <Badge className={`${st.cls} text-[10px] px-1.5 py-0`}>
                        {st.label}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IDENTITY TAB */}
        <TabsContent value="identity" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-500" /> Utilisateurs à risque
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {identityRisks.map((user, i) => (
                  <motion.div
                    key={user.user}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="px-6 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-bold">{user.user.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.user}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{user.lastSign}</span>
                        <span className="text-muted-foreground">·</span>
                        <Monitor className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{user.device}</span>
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        {user.mfa
                          ? <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          : <ShieldX className="h-4 w-4 text-red-500" />
                        }
                      </TooltipTrigger>
                      <TooltipContent>{user.mfa ? 'MFA actif' : 'MFA désactivé'}</TooltipContent>
                    </Tooltip>
                    <Badge className={`${severityColor(user.risk)} text-[10px] px-1.5 py-0 border`}>
                      {user.risk}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sign-in Activity */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" /> Connexions (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {[
                  { label: 'Réussies', count: 1847, pct: 92, color: 'text-emerald-500' },
                  { label: 'MFA challengées', count: 234, pct: 12, color: 'text-blue-500' },
                  { label: 'Échouées', count: 89, pct: 4, color: 'text-amber-500' },
                  { label: 'Bloquées', count: 23, pct: 1, color: 'text-red-500' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <span className={`text-sm font-bold ${s.color}`}>{s.count.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500" /> Top localisations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {[
                  { loc: 'France', count: 1654, pct: 85 },
                  { loc: 'Belgique', count: 98, pct: 5 },
                  { loc: 'Suisse', count: 67, pct: 3.4 },
                  { loc: 'Autre', count: 74, pct: 3.8 },
                ].map(l => (
                  <div key={l.loc}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{l.loc}</span>
                      <span className="text-muted-foreground">{l.count} ({l.pct}%)</span>
                    </div>
                    <Progress value={l.pct} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* POLICIES TAB */}
        <TabsContent value="policies" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-500" /> Politiques de sécurité
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">{compliancePolicies.length} politiques</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {compliancePolicies.map((pol, i) => (
                  <motion.div
                    key={pol.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-6 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                  >
                    {pol.status === 'active'
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      : <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{pol.name}</p>
                      <span className="text-[10px] text-muted-foreground">Cible : {pol.users}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{pol.type}</Badge>
                    <Badge className={`text-[10px] px-1.5 py-0 ${
                      pol.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {pol.status === 'active' ? 'Active' : 'Attention'}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
