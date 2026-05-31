import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, KeyRound, CheckCircle2, AlertTriangle, XCircle, Copy, ExternalLink,
  RefreshCw, Sparkles, Lock, Mail, FileText, Award, ChevronRight, ChevronLeft,
  Info, Download, Play, Eye, EyeOff, Trash2, Cloud, BarChart3, ShieldCheck,
  Zap, BookOpen, Terminal, PartyPopper, Loader2, Rocket, Wand2, ArrowRight,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ----------------------------- Mock préremplies ----------------------------- */
const tenantInfo = {
  tenantId: "8b1e9ffe-34e4-4b93-a97b-e96e3692bcfe",
  clientId: "a47c-2d91-fe83-autocore-connect",
  appName: "AutoCore-Connect",
  enterpriseObjectId: "f1d2-3c4b-5a6e-7890-enterprise",
  secretExpiry: "2026-09-12",
  certExpiry: "2027-02-28",
};

const permissions = [
  { name: "User.ReadWrite.All", biz: "Gestion des utilisateurs", domain: "Identité" },
  { name: "Directory.ReadWrite.All", biz: "Annuaire et groupes", domain: "Identité" },
  { name: "Mail.ReadWrite", biz: "Boîtes mail", domain: "Messagerie" },
  { name: "MailboxSettings.ReadWrite", biz: "Absences, redirections", domain: "Messagerie" },
  { name: "Organization.Read.All", biz: "Organisation et licences", domain: "Organisation" },
  { name: "AuditLog.Read.All", biz: "Journaux de connexion", domain: "Audit" },
  { name: "Reports.Read.All", biz: "Rapports MFA et usage", domain: "Rapports" },
  { name: "ReportSettings.ReadWrite.All", biz: "Anonymisation rapports", domain: "Rapports" },
  { name: "Policy.Read.All", biz: "Policies de sécurité", domain: "Sécurité" },
  { name: "Policy.Read.PermissionGrant", biz: "Gouvernance consentement", domain: "Sécurité" },
  { name: "ConsentRequest.Read.All", biz: "Demandes consentement", domain: "Sécurité" },
  { name: "RoleManagement.Read.Directory", biz: "PIM et rôles privilégiés", domain: "Sécurité" },
  { name: "IdentityRiskyUser.Read.All", biz: "Utilisateurs à risque", domain: "Sécurité" },
  { name: "IdentityRiskEvent.Read.All", biz: "Détections de risque", domain: "Sécurité" },
  { name: "IdentityRiskyServicePrincipal.Read.All", biz: "Workload identities", domain: "Sécurité" },
  { name: "SecurityEvents.Read.All", biz: "Secure Score", domain: "Sécurité" },
  { name: "UserAuthenticationMethod.Read.All", biz: "Lecture MFA", domain: "Identité" },
  { name: "UserAuthenticationMethod.ReadWrite.All", biz: "Administration MFA", domain: "Identité" },
  { name: "User-PasswordProfile.ReadWrite.All", biz: "Réinit mot de passe", domain: "Identité" },
  { name: "User.RevokeSessions.All", biz: "Révocation sessions", domain: "Identité" },
  { name: "Policy.ReadWrite.AuthenticationMethod", biz: "MFA historique", domain: "Identité" },
  { name: "Sites.Read.All", biz: "Lecture SharePoint", domain: "SharePoint" },
  { name: "SharePointTenantSettings.Read.All", biz: "Settings SharePoint", domain: "SharePoint" },
  { name: "Sites.ReadWrite.All", biz: "Administration SharePoint", domain: "SharePoint" },
  { name: "Files.ReadWrite.All", biz: "Fichiers SharePoint/OneDrive", domain: "SharePoint" },
];

/* --------------------------------- Helpers --------------------------------- */
const copy = (val: string, label: string) => {
  navigator.clipboard.writeText(val);
  toast({ title: "Copié ✨", description: `${label} dans le presse-papier.` });
};

const CopyField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <div className="flex gap-2">
      <Input value={value} readOnly className="font-mono text-xs bg-muted/40" />
      <Button size="icon" variant="outline" onClick={() => copy(value, label)} className="shrink-0">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

/* ------------------------------ Animated bits ------------------------------ */
const Sparkle = ({ delay = 0 }: { delay?: number }) => (
  <motion.span
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
    transition={{ duration: 1.4, delay, repeat: Infinity, repeatDelay: 2 }}
    className="absolute h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
  />
);

const StepDot = ({ state }: { state: "todo" | "active" | "done" }) => {
  if (state === "done")
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-emerald-500 p-1">
        <CheckCircle2 className="h-3 w-3 text-white" />
      </motion.div>
    );
  if (state === "active")
    return (
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/40"
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <div className="relative rounded-full bg-primary h-5 w-5 flex items-center justify-center">
          <CircleDot className="h-3 w-3 text-primary-foreground" />
        </div>
      </div>
    );
  return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 bg-background" />;
};

/* ---------------- Animated checklist (verification/sync/rights) ---------------- */
type CheckItem = { label: string; sub?: string };
function AnimatedChecklist({
  items, running, onDone, accent = "primary",
}: { items: CheckItem[]; running: boolean; onDone?: () => void; accent?: "primary" | "emerald" | "amber" }) {
  const [current, setCurrent] = useState(-1);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    if (!running) { setCurrent(-1); setDone([]); return; }
    setCurrent(0); setDone([]);
    let i = 0;
    const tick = () => {
      setDone(d => [...d, i]);
      i++;
      if (i >= items.length) { setCurrent(-1); onDone?.(); return; }
      setCurrent(i);
      setTimeout(tick, 550 + Math.random() * 350);
    };
    const t = setTimeout(tick, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const accentCls =
    accent === "emerald" ? "text-emerald-500" : accent === "amber" ? "text-amber-500" : "text-primary";

  return (
    <div className="space-y-1.5">
      {items.map((it, idx) => {
        const isDone = done.includes(idx);
        const isActive = current === idx;
        return (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-card/40 px-3 py-2 transition-colors",
              isActive && "border-primary/50 bg-primary/5",
              isDone && "border-emerald-500/30 bg-emerald-500/5"
            )}
          >
            <div className="w-5 flex justify-center">
              {isDone ? (
                <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </motion.div>
              ) : isActive ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", accentCls)} />
              ) : (
                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", isDone && "text-foreground", !isDone && !isActive && "text-muted-foreground")}>{it.label}</p>
              {it.sub && <p className="text-xs text-muted-foreground truncate">{it.sub}</p>}
            </div>
            {isActive && (
              <motion.div
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }}
                className="absolute"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* --------------------------------- WIZARD --------------------------------- */
const STEPS = [
  { id: 0, label: "Bienvenue", icon: Rocket, key: "welcome" },
  { id: 1, label: "Pré-requis", icon: BookOpen, key: "prereq" },
  { id: 2, label: "Méthode", icon: Wand2, key: "method" },
  { id: 3, label: "Application", icon: Cloud, key: "app" },
  { id: 4, label: "Permissions", icon: ShieldCheck, key: "perms" },
  { id: 5, label: "Identifiants", icon: KeyRound, key: "creds" },
  { id: 6, label: "Vérification", icon: CheckCircle2, key: "verify" },
  { id: 7, label: "Exchange", icon: Mail, key: "exchange" },
  { id: 8, label: "Terminé", icon: PartyPopper, key: "done" },
];

export default function Settings() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [method, setMethod] = useState<"manual" | "script" | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [secret, setSecret] = useState("");

  // running checklists
  const [verifyRun, setVerifyRun] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false);
  const [permsRun, setPermsRun] = useState(false);
  const [permsDone, setPermsDone] = useState(false);
  const [exchangeRun, setExchangeRun] = useState(false);
  const [exchangeDone, setExchangeDone] = useState(false);

  const next = () => {
    setCompleted(c => Array.from(new Set([...c, step])));
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const goTo = (i: number) => setStep(i);

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* ---------------- Sticky stepper header ---------------- */}
      <div className="sticky top-0 z-20 -mx-6 px-6 py-4 bg-background/80 backdrop-blur-xl border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="rounded-lg bg-gradient-to-br from-primary to-primary/60 p-2">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <Sparkle delay={0.2} />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none">Connexion Microsoft 365</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Configuration guidée · Étape {step + 1} sur {STEPS.length}</p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs hidden md:flex">
            {tenantInfo.appName}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-primary/70 rounded-full"
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const state: "todo" | "active" | "done" =
              completed.includes(i) ? "done" : i === step ? "active" : "todo";
            return (
              <button
                key={s.id}
                onClick={() => (completed.includes(i) || i <= step ? goTo(i) : null)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap",
                  state === "active" && "bg-primary text-primary-foreground shadow-md",
                  state === "done" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
                  state === "todo" && "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- Step content with transitions ---------------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
        >
          {/* 0 — Welcome */}
          {step === 0 && (
            <Card className="relative overflow-hidden border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
              <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
              <Sparkle delay={0} /><Sparkle delay={0.8} /><Sparkle delay={1.4} />
              <CardContent className="relative p-8 lg:p-12 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 1 }}
                  className="inline-flex"
                >
                  <div className="relative">
                    <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/50 p-5 shadow-2xl shadow-primary/30">
                      <Rocket className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <motion.div
                      className="absolute -inset-2 rounded-2xl border-2 border-primary/30"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                <div className="space-y-2 max-w-xl mx-auto">
                  <h2 className="text-3xl font-bold tracking-tight">Connectons votre tenant Microsoft 365 ✨</h2>
                  <p className="text-muted-foreground text-base">
                    En quelques étapes guidées, AutoCore va se brancher à votre environnement Microsoft 365.
                    Pas de jargon, pas de surprise — on vous tient la main du début à la fin.
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2">
                  {[
                    { icon: Cloud, label: "Connexion Graph", desc: "OAuth2 sécurisé" },
                    { icon: ShieldCheck, label: "25 permissions", desc: "Configurées automatiquement" },
                    { icon: Mail, label: "Exchange avancé", desc: "Boîtes & audits" },
                  ].map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={f.label}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="rounded-xl border bg-card/60 backdrop-blur p-4 text-left"
                      >
                        <Icon className="h-5 w-5 text-primary mb-2" />
                        <p className="font-medium text-sm">{f.label}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
                <Button size="lg" onClick={next} className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30">
                  C'est parti <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground">Durée estimée : 5 à 10 minutes</p>
              </CardContent>
            </Card>
          )}

          {/* 1 — Pré-requis */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/15 p-2"><BookOpen className="h-5 w-5 text-primary" /></div>
                  <div>
                    <CardTitle>Avant de commencer</CardTitle>
                    <CardDescription>Trois petites vérifications avant d'attaquer la configuration.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { t: "Vous êtes administrateur Entra ID", d: "Vous pouvez créer une application dans Microsoft Entra." },
                  { t: "Vous pouvez accorder le consentement admin", d: "Indispensable pour autoriser AutoCore sur le tenant." },
                  { t: "Vous avez accès à Exchange Online", d: "Optionnel — uniquement si vous voulez la messagerie avancée." },
                ].map((it, i) => (
                  <motion.label
                    key={it.t}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition"
                  >
                    <div className="rounded-full bg-emerald-500/15 p-1.5 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{it.t}</p>
                      <p className="text-xs text-muted-foreground">{it.d}</p>
                    </div>
                  </motion.label>
                ))}
                <NavFooter onPrev={prev} onNext={next} />
              </CardContent>
            </Card>
          )}

          {/* 2 — Méthode */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/15 p-2"><Wand2 className="h-5 w-5 text-primary" /></div>
                  <div>
                    <CardTitle>Comment voulez-vous procéder ?</CardTitle>
                    <CardDescription>Choisissez la méthode qui vous convient le mieux.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { id: "manual", title: "Mode guidé manuel", icon: BookOpen, badge: "Recommandé",
                      desc: "Vous créez ou complétez l'application dans le portail Microsoft, étape par étape, avec captures et liens directs.",
                      bullets: ["Pas de PowerShell", "Liens & raccourcis Azure", "Validation à chaque étape"] },
                    { id: "script", title: "Mode script", icon: Terminal, badge: "Avancé",
                      desc: "Un script PowerShell prêt à copier prépare l'application, les permissions et le service principal Exchange.",
                      bullets: ["Configuration en 2 minutes", "Idéal pour les multi-tenants", "Audit shell complet"] },
                  ].map((m: any) => {
                    const Icon = m.icon;
                    const selected = method === m.id;
                    return (
                      <motion.button
                        key={m.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMethod(m.id)}
                        className={cn(
                          "relative text-left rounded-2xl border-2 p-5 transition overflow-hidden",
                          selected ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute top-3 right-3 rounded-full bg-primary p-1"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                          </motion.div>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn("rounded-xl p-2.5", selected ? "bg-primary text-primary-foreground" : "bg-muted")}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant={selected ? "default" : "outline"} className="text-xs">{m.badge}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{m.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                        <ul className="space-y-1.5 mt-4">
                          {m.bullets.map((b: string) => (
                            <li key={b} className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" /> {b}
                            </li>
                          ))}
                        </ul>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Script mode preview */}
                <AnimatePresence>
                  {method === "script" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 rounded-2xl border bg-zinc-950 dark:bg-zinc-900 text-zinc-100 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/80">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                            </div>
                            <span className="text-xs text-zinc-400 font-mono ml-2">AutoCore-Setup.ps1</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-zinc-300 hover:text-white hover:bg-zinc-800"
                              onClick={() => copy(SCRIPT, "Script PowerShell")}>
                              <Copy className="h-3.5 w-3.5 mr-1" /> Copier
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-zinc-300 hover:text-white hover:bg-zinc-800">
                              <Download className="h-3.5 w-3.5 mr-1" /> .ps1
                            </Button>
                          </div>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                          <code>{SCRIPT}</code>
                        </pre>
                        <div className="px-4 py-2.5 border-t border-zinc-800 bg-zinc-900/80 flex items-center gap-2 text-xs text-zinc-400">
                          <Terminal className="h-3.5 w-3.5" />
                          Exécutez dans une console PowerShell en administrateur, puis revenez à l'étape suivante.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <NavFooter onPrev={prev} onNext={next} nextDisabled={!method} />
              </CardContent>
            </Card>
          )}

          {/* 3 — Application */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/15 p-2"><Cloud className="h-5 w-5 text-primary" /></div>
                  <div>
                    <CardTitle>Créer ou retrouver l'application</CardTitle>
                    <CardDescription>Microsoft Entra ID › App registrations › <code className="text-primary">AutoCore-Connect</code></CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Compte pris en charge</AlertTitle>
                  <AlertDescription>Tenant actuel uniquement (single tenant).</AlertDescription>
                </Alert>
                <Button variant="outline" className="w-full sm:w-auto">
                  <ExternalLink className="h-4 w-4 mr-2" />Ouvrir dans Azure
                </Button>
                <div className="grid md:grid-cols-2 gap-4">
                  <CopyField label="App (Client) ID" value={tenantInfo.clientId} />
                  <CopyField label="Tenant ID" value={tenantInfo.tenantId} />
                </div>
                <NavFooter onPrev={prev} onNext={next} />
              </CardContent>
            </Card>
          )}

          {/* 4 — Permissions */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/15 p-2"><ShieldCheck className="h-5 w-5 text-primary" /></div>
                  <div>
                    <CardTitle>Accorder les permissions</CardTitle>
                    <CardDescription>25 permissions Microsoft Graph d'application + consentement admin.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-muted/40">
                  <AlertDescription className="text-xs font-mono">
                    App registrations › AutoCore-Connect › API permissions › Microsoft Graph › Application permissions
                  </AlertDescription>
                </Alert>

                {/* Permission grid grouped by domain */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
                  {permissions.map((p, i) => (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="rounded-lg border bg-card p-2.5 hover:border-primary/40 transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-[10px] py-0">{p.domain}</Badge>
                        {permsDone && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          </motion.div>
                        )}
                      </div>
                      <p className="font-mono text-[11px] truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{p.biz}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Animated grant simulation */}
                <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Vérification des permissions accordées</p>
                      <p className="text-xs text-muted-foreground">Lance un check Graph en temps réel.</p>
                    </div>
                    <Button size="sm" disabled={permsRun} onClick={() => { setPermsRun(true); setPermsDone(false); }}>
                      {permsRun && !permsDone ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      {permsDone ? "Re-vérifier" : "Vérifier"}
                    </Button>
                  </div>
                  {(permsRun || permsDone) && (
                    <AnimatedChecklist
                      running={permsRun && !permsDone}
                      onDone={() => { setPermsDone(true); setPermsRun(false); }}
                      items={[
                        { label: "Token Graph valide", sub: "OAuth2 client_credentials" },
                        { label: "Permissions Identité (5)", sub: "User, Directory, Auth methods" },
                        { label: "Permissions Messagerie (2)", sub: "Mail.ReadWrite, MailboxSettings" },
                        { label: "Permissions SharePoint (4)", sub: "Sites, Files" },
                        { label: "Permissions Sécurité (8)", sub: "Policies, Risk, Secure Score" },
                        { label: "Consentement administrateur", sub: "Grant admin consent" },
                      ]}
                    />
                  )}
                  {permsDone && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <PartyPopper className="h-4 w-4" />
                      Toutes les permissions sont accordées !
                    </motion.div>
                  )}
                </div>

                <NavFooter onPrev={prev} onNext={next} />
              </CardContent>
            </Card>
          )}

          {/* 5 — Identifiants */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/15 p-2"><KeyRound className="h-5 w-5 text-primary" /></div>
                  <div>
                    <CardTitle>Renseigner les identifiants</CardTitle>
                    <CardDescription>Le secret est chiffré côté AutoCore. Vous serez alerté avant expiration.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <CopyField label="Tenant ID" value={tenantInfo.tenantId} />
                  <CopyField label="Client ID" value={tenantInfo.clientId} />
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Client secret</Label>
                    <div className="relative">
                      <Input
                        type={showSecret ? "text" : "password"}
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="font-mono pr-10"
                      />
                      <button type="button" onClick={() => setShowSecret(s => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Expiration du secret</Label>
                    <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm flex items-center justify-between">
                      <span className="font-mono">{tenantInfo.secretExpiry}</span>
                      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30">Valide</Badge>
                    </div>
                  </div>
                </div>
                <NavFooter onPrev={prev} onNext={next} />
              </CardContent>
            </Card>
          )}

          {/* 6 — Vérification animée */}
          {step === 6 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/15 p-2"><CheckCircle2 className="h-5 w-5 text-primary" /></div>
                    <div>
                      <CardTitle>Vérification de la connexion</CardTitle>
                      <CardDescription>On teste tout : auth, Graph, rapports, SharePoint.</CardDescription>
                    </div>
                  </div>
                  <Button onClick={() => { setVerifyRun(true); setVerifyDone(false); }} disabled={verifyRun && !verifyDone}>
                    {verifyRun && !verifyDone ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                    {verifyDone ? "Relancer" : "Lancer la vérification"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!verifyRun && !verifyDone && (
                  <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                      <Sparkles className="h-10 w-10 text-primary/60 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground">Cliquez sur <strong className="text-foreground">Lancer la vérification</strong> pour démarrer.</p>
                  </div>
                )}

                {(verifyRun || verifyDone) && (
                  <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4">
                    <AnimatedChecklist
                      running={verifyRun && !verifyDone}
                      onDone={() => { setVerifyDone(true); setVerifyRun(false); }}
                      items={[
                        { label: "Authentification OAuth2", sub: "Token applicatif obtenu" },
                        { label: "Lecture annuaire", sub: "Directory.Read.All" },
                        { label: "Comptage utilisateurs", sub: "342 utilisateurs détectés" },
                        { label: "Lecture des licences M365", sub: "Organization.Read.All" },
                        { label: "Audit logs accessibles", sub: "AuditLog.Read.All" },
                        { label: "SharePoint joignable", sub: "Sites & fichiers" },
                        { label: "Réglages rapports M365", sub: "⚠ Anonymisation détectée" },
                      ]}
                    />
                  </div>
                )}

                {verifyDone && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-3"
                    >
                      <div className="rounded-full bg-emerald-500/20 p-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Connexion opérationnelle ✨</p>
                        <p className="text-xs text-muted-foreground">6 contrôles sur 7 réussis. Un avertissement à examiner ci-dessous.</p>
                      </div>
                    </motion.div>

                    <Card className="border-amber-500/30 bg-amber-500/5">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <EyeOff className="h-4 w-4 text-amber-600" />
                            Anonymisation des rapports
                          </CardTitle>
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">À corriger</Badge>
                        </div>
                        <CardDescription>
                          Microsoft masque les noms dans les rapports. AutoCore ne peut pas afficher le stockage et l'activité par utilisateur.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Collapsible>
                          <CollapsibleTrigger className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                            <ChevronRight className="h-4 w-4" /> Procédure en 5 étapes
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3 space-y-2">
                            {[
                              "Ouvrir le centre d'administration Microsoft 365",
                              "Paramètres › Paramètres de l'organisation › Services › Rapports",
                              "Décocher l'option de masquage des noms",
                              "Enregistrer",
                              "Relancer une synchronisation dans AutoCore",
                            ].map((s, i) => (
                              <div key={i} className="flex gap-3 text-sm">
                                <span className="rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 w-6 h-6 flex items-center justify-center text-xs font-semibold shrink-0">{i + 1}</span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </CardContent>
                    </Card>
                  </>
                )}

                <NavFooter onPrev={prev} onNext={next} nextDisabled={!verifyDone} />
              </CardContent>
            </Card>
          )}

          {/* 7 — Exchange */}
          {step === 7 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/15 p-2"><Mail className="h-5 w-5 text-primary" /></div>
                  <div>
                    <CardTitle>Exchange Online avancé</CardTitle>
                    <CardDescription>Optionnel — pour les boîtes partagées et l'audit messagerie.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Configuration RBAC Exchange</p>
                      <p className="text-xs text-muted-foreground">Permission + service principal + certificat.</p>
                    </div>
                    <Button size="sm" disabled={exchangeRun} onClick={() => { setExchangeRun(true); setExchangeDone(false); }}>
                      {exchangeRun && !exchangeDone ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                      {exchangeDone ? "Re-tester" : "Tester Exchange"}
                    </Button>
                  </div>
                  {(exchangeRun || exchangeDone) && (
                    <AnimatedChecklist
                      running={exchangeRun && !exchangeDone}
                      onDone={() => { setExchangeDone(true); setExchangeRun(false); }}
                      items={[
                        { label: "Permission Exchange.ManageAsApp", sub: "Présente sur le token" },
                        { label: "Service principal Exchange", sub: tenantInfo.appName },
                        { label: "Rôle View-Only Configuration" },
                        { label: "Rôle Mail Recipients" },
                        { label: "Certificat d'authentification", sub: `Expire ${tenantInfo.certExpiry}` },
                      ]}
                    />
                  )}
                </div>

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2"><Terminal className="h-4 w-4" />Voir le script PowerShell</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="rounded-xl border bg-zinc-950 dark:bg-zinc-900 text-zinc-100 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
                        <span className="text-xs text-zinc-400 font-mono">Exchange-RBAC.ps1</span>
                        <Button size="sm" variant="ghost" className="h-7 text-zinc-300 hover:text-white hover:bg-zinc-800"
                          onClick={() => copy(EXCHANGE_SCRIPT, "Script Exchange")}>
                          <Copy className="h-3.5 w-3.5 mr-1" /> Copier
                        </Button>
                      </div>
                      <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed"><code>{EXCHANGE_SCRIPT}</code></pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="grid sm:grid-cols-3 gap-2">
                  <Button variant="outline" size="sm"><Sparkles className="h-4 w-4 mr-2" />Générer certificat</Button>
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Télécharger .cer</Button>
                  <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-2" />Certificates & Secrets</Button>
                </div>

                <NavFooter onPrev={prev} onNext={next} />
              </CardContent>
            </Card>
          )}

          {/* 8 — Done */}
          {step === 8 && (
            <Card className="relative overflow-hidden border-emerald-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-background to-background" />
              {/* Confetti */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-sm"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-10px",
                    background: ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444"][i % 4],
                  }}
                  initial={{ y: -20, opacity: 0, rotate: 0 }}
                  animate={{ y: 600, opacity: [0, 1, 1, 0], rotate: 720 }}
                  transition={{ duration: 3 + Math.random() * 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
                />
              ))}
              <CardContent className="relative p-8 lg:p-12 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="inline-flex"
                >
                  <div className="rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-5 shadow-2xl shadow-emerald-500/40">
                    <PartyPopper className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <div className="space-y-2 max-w-xl mx-auto">
                  <h2 className="text-3xl font-bold tracking-tight">Tout est prêt ! 🎉</h2>
                  <p className="text-muted-foreground">
                    Votre tenant Microsoft 365 est connecté à AutoCore. Les synchronisations vont démarrer et toutes les fonctionnalités sont actives.
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2">
                  {[
                    { v: "342", l: "Utilisateurs synchronisés" },
                    { v: "25/25", l: "Permissions accordées" },
                    { v: "100%", l: "Opérationnel" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.l}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="rounded-xl border bg-card/60 backdrop-blur p-4"
                    >
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{s.v}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                    <Rocket className="h-4 w-4 mr-2" />Aller au tableau de bord
                  </Button>
                  <Button size="lg" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />Lancer une synchro
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Licences (always visible discreetly) */}
      {step > 0 && step < 8 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Licences recommandées</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-3 pt-0">
            {[
              { title: "Socle", items: ["M365 E3", "Business Premium"], tone: "border-border" },
              { title: "Complet", items: ["M365 E5", "EMS E5", "Entra Suite"], tone: "border-primary/40 bg-primary/5" },
              { title: "Compléments", items: ["Intune Plan 1", "Workload ID Premium"], tone: "border-border" },
            ].map((b) => (
              <div key={b.title} className={cn("rounded-lg border p-3", b.tone)}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{b.title}</p>
                <ul className="space-y-1">
                  {b.items.map(i => (
                    <li key={i} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-primary shrink-0" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Footer destructive */}
      {step === 8 && (
        <div className="flex justify-center">
          <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4 mr-2" />Supprimer la connexion
          </Button>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- NavFooter --------------------------------- */
function NavFooter({ onPrev, onNext, nextDisabled }: { onPrev: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t mt-4">
      <Button variant="ghost" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4 mr-1" />Retour
      </Button>
      <Button onClick={onNext} disabled={nextDisabled} className="bg-gradient-to-r from-primary to-primary/80">
        Continuer <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

/* --------------------------------- Scripts --------------------------------- */
const SCRIPT = `# AutoCore-Setup.ps1
# Provisionne l'application Entra ID + permissions Microsoft Graph

# 1. Connexion
Connect-MgGraph -Scopes "Application.ReadWrite.All", "AppRoleAssignment.ReadWrite.All"

# 2. Création de l'application AutoCore-Connect
$app = New-MgApplication -DisplayName "AutoCore-Connect" \`
  -SignInAudience "AzureADMyOrg"

# 3. Service principal
$sp = New-MgServicePrincipal -AppId $app.AppId

# 4. Permissions Microsoft Graph (extrait)
$graphSp = Get-MgServicePrincipal -Filter "appId eq '00000003-0000-0000-c000-000000000000'"
$permissions = @(
  "User.ReadWrite.All", "Directory.ReadWrite.All",
  "Mail.ReadWrite", "MailboxSettings.ReadWrite",
  "Organization.Read.All", "AuditLog.Read.All",
  "Reports.Read.All", "Policy.Read.All",
  "Sites.ReadWrite.All", "Files.ReadWrite.All"
)

foreach ($perm in $permissions) {
  $role = $graphSp.AppRoles | Where-Object { $_.Value -eq $perm }
  New-MgServicePrincipalAppRoleAssignment \`
    -ServicePrincipalId $sp.Id \`
    -PrincipalId $sp.Id \`
    -ResourceId $graphSp.Id \`
    -AppRoleId $role.Id
}

# 5. Secret applicatif (validité 2 ans)
$secret = Add-MgApplicationPassword -ApplicationId $app.Id \`
  -PasswordCredential @{ DisplayName = "AutoCore"; EndDateTime = (Get-Date).AddYears(2) }

Write-Host "✓ AutoCore-Connect configurée"
Write-Host "  TenantId : $((Get-MgContext).TenantId)"
Write-Host "  ClientId : $($app.AppId)"
Write-Host "  Secret   : $($secret.SecretText)"
Write-Host "→ Copiez ces valeurs dans AutoCore puis lancez la vérification."`;

const EXCHANGE_SCRIPT = `Connect-ExchangeOnline

New-ServicePrincipal \`
  -AppId ${tenantInfo.clientId} \`
  -ObjectId ${tenantInfo.enterpriseObjectId} \`
  -DisplayName "AutoCore-Connect"

$sp = Get-ServicePrincipal -Identity "AutoCore-Connect"

New-ManagementRoleAssignment \`
  -Name "AutoCore-ViewOnlyConfiguration" \`
  -App $sp.Identity \`
  -Role "View-Only Configuration"

New-ManagementRoleAssignment \`
  -Name "AutoCore-MailRecipients" \`
  -App $sp.Identity \`
  -Role "Mail Recipients"

Get-ManagementRoleAssignment -RoleAssignee $sp.Identity`;
