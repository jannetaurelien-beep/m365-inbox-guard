import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, KeyRound, CheckCircle2, AlertTriangle, XCircle, Copy, ExternalLink,
  RefreshCw, Sparkles, Lock, Mail, FileText, Award, ChevronRight, Info,
  Server, Settings as SettingsIcon, Download, Play, Eye, EyeOff, Trash2,
  Cloud, Users as UsersIcon, BarChart3, ShieldCheck, Zap, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ----------------------------- Mock préremplies ----------------------------- */
const tenantInfo = {
  tenantId: "8b1e9ffe-34e4-4b93-a97b-e96e3692bcfe",
  clientId: "a47c-2d91-fe83-autocore-connect",
  appName: "AutoCore-Connect",
  enterpriseObjectId: "f1d2-3c4b-5a6e-7890-enterprise",
  exchangeSpName: "AutoCore-Connect",
  graphStatus: "operational" as const,
  permissionsStatus: "partial" as const,
  exchangeStatus: "warning" as const,
  reportsStatus: "masked" as const,
  secretExpiry: "2026-09-12",
  certExpiry: "2027-02-28",
};

/* --------------------------------- Helpers --------------------------------- */
type StatusKind = "success" | "warning" | "error" | "pending" | "info";

const statusMap: Record<StatusKind, { label: string; cls: string; icon: any }> = {
  success: { label: "Opérationnel", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  warning: { label: "Partiel", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30", icon: AlertTriangle },
  error:   { label: "Bloqué",      cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30", icon: XCircle },
  pending: { label: "En attente",  cls: "bg-muted text-muted-foreground border-border", icon: Info },
  info:    { label: "Info",        cls: "bg-primary/10 text-primary border-primary/30", icon: Info },
};

const StatusPill = ({ kind, label }: { kind: StatusKind; label?: string }) => {
  const s = statusMap[kind];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", s.cls)}>
      <Icon className="h-3 w-3" />
      {label ?? s.label}
    </span>
  );
};

const copy = (val: string, label: string) => {
  navigator.clipboard.writeText(val);
  toast({ title: "Copié", description: `${label} copié dans le presse-papier.` });
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

/* ------------------------------- Permissions ------------------------------- */
const permissions = [
  { name: "User.ReadWrite.All", biz: "Gestion des utilisateurs", status: "success", domain: "Identité" },
  { name: "Directory.ReadWrite.All", biz: "Annuaire et groupes", status: "success", domain: "Identité" },
  { name: "Mail.ReadWrite", biz: "Boîtes mail", status: "success", domain: "Messagerie" },
  { name: "MailboxSettings.ReadWrite", biz: "Messages d'absence, redirections", status: "success", domain: "Messagerie" },
  { name: "Organization.Read.All", biz: "Organisation et licences", status: "success", domain: "Organisation" },
  { name: "AuditLog.Read.All", biz: "Journaux de connexion", status: "success", domain: "Audit" },
  { name: "Reports.Read.All", biz: "Rapports MFA et usage", status: "warning", domain: "Rapports", note: "Limité par anonymisation" },
  { name: "ReportSettings.ReadWrite.All", biz: "Lecture/modification anonymisation", status: "error", domain: "Rapports", note: "Manquant" },
  { name: "Policy.Read.All", biz: "Policies de sécurité", status: "success", domain: "Sécurité" },
  { name: "Policy.Read.PermissionGrant", biz: "Gouvernance du consentement", status: "success", domain: "Sécurité" },
  { name: "ConsentRequest.Read.All", biz: "Demandes de consentement", status: "success", domain: "Sécurité" },
  { name: "RoleManagement.Read.Directory", biz: "PIM et rôles privilégiés", status: "success", domain: "Sécurité" },
  { name: "IdentityRiskyUser.Read.All", biz: "Utilisateurs à risque", status: "warning", domain: "Sécurité", note: "Licence Entra P2 requise" },
  { name: "IdentityRiskEvent.Read.All", biz: "Détections de risque", status: "warning", domain: "Sécurité", note: "Licence Entra P2 requise" },
  { name: "IdentityRiskyServicePrincipal.Read.All", biz: "Workload identities à risque", status: "warning", domain: "Sécurité", note: "Workload ID Premium" },
  { name: "SecurityEvents.Read.All", biz: "Secure Score", status: "success", domain: "Sécurité" },
  { name: "UserAuthenticationMethod.Read.All", biz: "Lecture MFA", status: "success", domain: "Identité" },
  { name: "UserAuthenticationMethod.ReadWrite.All", biz: "Administration MFA", status: "success", domain: "Identité" },
  { name: "User-PasswordProfile.ReadWrite.All", biz: "Réinitialisation mot de passe", status: "success", domain: "Identité" },
  { name: "User.RevokeSessions.All", biz: "Révocation de sessions", status: "success", domain: "Identité" },
  { name: "Policy.ReadWrite.AuthenticationMethod", biz: "MFA historique par utilisateur", status: "success", domain: "Identité" },
  { name: "Sites.Read.All", biz: "Lecture SharePoint", status: "success", domain: "SharePoint" },
  { name: "SharePointTenantSettings.Read.All", biz: "Settings SharePoint tenant", status: "success", domain: "SharePoint" },
  { name: "Sites.ReadWrite.All", biz: "Administration SharePoint", status: "success", domain: "SharePoint" },
  { name: "Files.ReadWrite.All", biz: "Fichiers SharePoint / OneDrive", status: "success", domain: "SharePoint" },
] as const;

/* ---------------------------------- Page ---------------------------------- */
export default function Settings() {
  const [showSecret, setShowSecret] = useState(false);
  const [secret, setSecret] = useState("");
  const [activeStep, setActiveStep] = useState("graph");

  const stepsMeta = [
    { id: "graph", label: "Connexion Graph", icon: Cloud, status: "success" as StatusKind },
    { id: "perms", label: "Permissions", icon: ShieldCheck, status: "warning" as StatusKind },
    { id: "creds", label: "Identifiants", icon: KeyRound, status: "success" as StatusKind },
    { id: "verify", label: "Vérification", icon: CheckCircle2, status: "warning" as StatusKind },
    { id: "exchange", label: "Exchange avancé", icon: Mail, status: "warning" as StatusKind },
  ];

  const grantedCount = permissions.filter(p => p.status === "success").length;
  const totalCount = permissions.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 lg:p-8"
      >
        <div className="absolute inset-0 bg-grid-white/5 opacity-30 pointer-events-none" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/15 p-2"><Shield className="h-5 w-5 text-primary" /></div>
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Paramètres / Intégration</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Connexion Microsoft 365</h1>
            <p className="text-muted-foreground text-base">
              Reliez ce tenant à AutoCore pour administrer Microsoft 365, synchroniser les données et activer les audits avancés.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <StatusPill kind="warning" label="Partiellement configuré" />
              <Badge variant="outline" className="font-mono text-xs">Tenant : {tenantInfo.tenantId.slice(0, 8)}…</Badge>
              <Badge variant="outline" className="text-xs">App : {tenantInfo.appName}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Relancer la vérification</Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80"><Sparkles className="h-4 w-4 mr-2" />Synchroniser M365</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {[
            { label: "Connexion Graph", value: "Opérationnel", kind: "success" as StatusKind, icon: Cloud },
            { label: "Permissions", value: `${grantedCount}/${totalCount}`, kind: "warning" as StatusKind, icon: ShieldCheck },
            { label: "Rapports M365", value: "Masqués", kind: "warning" as StatusKind, icon: BarChart3 },
            { label: "Exchange avancé", value: "Configuration", kind: "warning" as StatusKind, icon: Mail },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-xl border bg-card/60 backdrop-blur p-4 hover:bg-card transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <StatusPill kind={k.kind} />
                </div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-lg font-semibold mt-0.5">{k.value}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Pré-requis */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Avant de commencer</CardTitle>
          </div>
          <CardDescription>Quelques vérifications avant d'accorder les droits applicatifs sur ce tenant.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          {[
            "Accès au portail Entra ID",
            "Droit d'accorder le consentement administrateur",
            "Accès à Exchange Online (pour la messagerie avancée)",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="rounded-full bg-emerald-500/15 p-1 mt-0.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div>
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Méthode */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="relative overflow-hidden border-primary/30 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/15 p-2 w-fit"><BookOpen className="h-5 w-5 text-primary" /></div>
              <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">Recommandé</Badge>
            </div>
            <CardTitle className="mt-3">Mode guidé manuel</CardTitle>
            <CardDescription>Vous créez ou complétez l'application dans le portail Microsoft, étape par étape.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Utiliser le mode manuel <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </CardContent>
        </Card>

        <Card className="hover:border-foreground/30 transition-colors cursor-pointer">
          <CardHeader>
            <div className="rounded-lg bg-muted p-2 w-fit"><Zap className="h-5 w-5" /></div>
            <CardTitle className="mt-3">Mode script</CardTitle>
            <CardDescription>Pour un administrateur avancé. Le script prépare plus vite l'application et les permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Utiliser le mode script <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </CardContent>
        </Card>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="p-2">
          <Tabs value={activeStep} onValueChange={setActiveStep}>
            <TabsList className="w-full h-auto p-1.5 bg-muted/40 grid grid-cols-2 md:grid-cols-5 gap-1">
              {stepsMeta.map((s, i) => {
                const Icon = s.icon;
                return (
                  <TabsTrigger key={s.id} value={s.id}
                    className="flex flex-col items-start gap-1 py-3 px-3 data-[state=active]:bg-background data-[state=active]:shadow-md">
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                      <StatusPill kind={s.status} label="" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">{s.label}</span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Étape 1 — Graph */}
            <TabsContent value="graph" className="p-4 md:p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-sm">01.</span>
                    Créer ou retrouver l'application
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Microsoft Entra ID › App registrations › créer une app nommée <code className="text-primary">AutoCore-Connect</code> si elle n'existe pas.
                  </p>
                </div>
                <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-2" />Ouvrir dans Azure</Button>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Compte pris en charge</AlertTitle>
                <AlertDescription>Tenant actuel uniquement (single tenant).</AlertDescription>
              </Alert>
              <div className="grid md:grid-cols-2 gap-4">
                <CopyField label="App (Client) ID" value={tenantInfo.clientId} />
                <CopyField label="Tenant ID" value={tenantInfo.tenantId} />
              </div>
              <p className="text-xs text-muted-foreground">Ces identifiants serviront à AutoCore pour s'authentifier auprès de Microsoft Graph.</p>
            </TabsContent>

            {/* Étape 2 — Permissions */}
            <TabsContent value="perms" className="p-4 md:p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-sm">02.</span>
                  Accorder les permissions
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Ajoutez les permissions d'application Microsoft Graph ci-dessous, puis accordez le consentement administrateur.
                </p>
              </div>
              <Alert className="bg-muted/40">
                <AlertDescription className="text-xs font-mono">
                  App registrations › AutoCore-Connect › API permissions › Add a permission › Microsoft Graph › Application permissions
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted/40 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm font-medium">{grantedCount} accordées sur {totalCount}</span>
                  <Progress value={(grantedCount / totalCount) * 100} className="w-32 h-2" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Domaine</TableHead>
                      <TableHead>Usage métier</TableHead>
                      <TableHead className="text-right">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((p) => (
                      <TableRow key={p.name}>
                        <TableCell className="font-mono text-xs">{p.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{p.domain}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {p.biz}
                          {("note" in p) && p.note && <div className="text-xs text-amber-600 mt-0.5">⚠ {p.note}</div>}
                        </TableCell>
                        <TableCell className="text-right"><StatusPill kind={p.status as StatusKind} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Alert className="border-amber-500/30 bg-amber-500/5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle>N'oubliez pas le consentement administrateur</AlertTitle>
                <AlertDescription>Après ajout, cliquez sur <strong>Grant admin consent</strong> dans le portail.</AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button><CheckCircle2 className="h-4 w-4 mr-2" />J'ai ajouté les permissions</Button>
                <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Ouvrir API permissions</Button>
              </div>
            </TabsContent>

            {/* Étape 3 — Identifiants */}
            <TabsContent value="creds" className="p-4 md:p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-sm">03.</span>
                  Renseigner les identifiants
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Le secret est stocké de manière sécurisée. AutoCore vous alertera avant expiration.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <CopyField label="Tenant ID" value={tenantInfo.tenantId} />
                <CopyField label="Client ID" value={tenantInfo.clientId} />
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Client secret</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showSecret ? "text" : "password"}
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="font-mono pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(s => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
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
              <div className="flex gap-2 pt-2">
                <Button>Enregistrer</Button>
                <Button variant="outline">Retour</Button>
              </div>
            </TabsContent>

            {/* Étape 4 — Vérification */}
            <TabsContent value="verify" className="p-4 md:p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-sm">04.</span>
                    Vérification de la connexion
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Diagnostic complet par domaine, permission par permission.</p>
                </div>
                <Button size="sm"><RefreshCw className="h-4 w-4 mr-2" />Relancer</Button>
              </div>

              <Alert className="border-emerald-500/30 bg-emerald-500/5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle>Authentification OAuth2 réussie</AlertTitle>
                <AlertDescription>Le tenant répond, le token Graph est valide.</AlertDescription>
              </Alert>

              {/* Bloc anonymisation */}
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <EyeOff className="h-4 w-4 text-amber-600" />
                      Anonymisation des rapports Microsoft 365
                    </CardTitle>
                    <StatusPill kind="warning" label="Rapports masqués" />
                  </div>
                  <CardDescription>
                    Microsoft masque les noms dans les rapports d'usage. AutoCore ne peut plus rapprocher proprement le stockage,
                    l'activité mail et certains indicateurs détaillés par utilisateur.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Collapsible>
                    <CollapsibleTrigger className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                      <ChevronRight className="h-4 w-4" /> Procédure manuelle (5 étapes)
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-2 pl-2">
                      {[
                        "Ouvrir le centre d'administration Microsoft 365",
                        "Aller dans Paramètres › Paramètres de l'organisation › Services › Rapports",
                        "Décocher l'option de masquage des noms des utilisateurs, groupes et sites",
                        "Cliquer sur Enregistrer",
                        "Relancer une synchronisation Microsoft 365 dans AutoCore",
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
            </TabsContent>

            {/* Étape 5 — Exchange */}
            <TabsContent value="exchange" className="p-4 md:p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-sm">05.</span>
                  Accès Exchange Online
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Activer la lecture avancée des boîtes partagées, des réglages Exchange et la partie messagerie de l'audit sécurité.
                </p>
              </div>

              {/* Sub-step 1 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4" />Permission Exchange</CardTitle>
                    <StatusPill kind="error" label="Absente" />
                  </div>
                  <CardDescription className="font-mono text-xs">
                    App registrations › AutoCore-Connect › API permissions › Office 365 Exchange Online › Exchange.ManageAsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm"><ExternalLink className="h-4 w-4 mr-2" />Ouvrir & ajouter la permission</Button>
                </CardContent>
              </Card>

              {/* Sub-step 2 — RBAC */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Choisir la méthode RBAC</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <Badge variant="outline" className="w-fit text-xs">Plus simple</Badge>
                      <CardTitle className="text-base mt-2">Méthode simple</CardTitle>
                      <CardDescription>Assigner le rôle Entra <strong>Exchange Administrator</strong> à l'application. Méthode la plus simple, mais plus large en privilèges.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full"><ExternalLink className="h-4 w-4 mr-2" />Ouvrir Roles and administrators</Button>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/30">
                    <CardHeader>
                      <Badge className="w-fit text-xs bg-primary/15 text-primary border-primary/30">Recommandé</Badge>
                      <CardTitle className="text-base mt-2">Méthode granulaire</CardTitle>
                      <CardDescription>Créer le service principal Exchange et lui affecter seulement les rôles utiles.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Object ID Enterprise App</Label>
                        <div className="flex gap-2">
                          <Input value={tenantInfo.enterpriseObjectId} readOnly className="font-mono text-xs bg-muted/40" />
                          <Button size="icon" variant="outline" onClick={() => copy(tenantInfo.enterpriseObjectId, "Object ID")}><Copy className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full"><ChevronRight className="h-4 w-4 mr-1" />Voir le script PowerShell</Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <div className="relative">
                            <pre className="text-xs bg-muted/60 border rounded-lg p-3 overflow-x-auto font-mono leading-relaxed">
{`Connect-ExchangeOnline

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

Get-ManagementRoleAssignment -RoleAssignee $sp.Identity`}
                            </pre>
                            <Button size="icon" variant="ghost" className="absolute top-2 right-2"
                              onClick={() => copy("Connect-ExchangeOnline ...", "Script PowerShell")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Certificat */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" />Certificat d'authentification</CardTitle>
                    <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30">Expire {tenantInfo.certExpiry}</Badge>
                  </div>
                  <CardDescription>
                    Exchange Online app-only utilise un certificat pour l'authentification applicative.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button size="sm"><Sparkles className="h-4 w-4 mr-2" />Générer le certificat</Button>
                  <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Télécharger le .cer</Button>
                  <Button size="sm" variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Ouvrir Certificates & Secrets</Button>
                </CardContent>
              </Card>

              {/* Validation */}
              <Alert className="border-emerald-500/30 bg-emerald-500/5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle>Une fois validé</AlertTitle>
                <AlertDescription>
                  Les membres des boîtes partagées, les réglages Exchange et la partie e-mail de l'audit cybersécurité seront accessibles.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Licences recommandées */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Pour exploiter AutoCore à plein potentiel</CardTitle>
          </div>
          <CardDescription>
            Les permissions ne suffisent pas toujours. Certaines APIs Microsoft restent limitées si la licence du tenant ne couvre pas la fonctionnalité.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Socle recommandé", items: ["Microsoft 365 E3", "Microsoft 365 Business Premium"], tone: "border-border" },
            { title: "Couverture complète", items: ["Microsoft 365 E5", "EMS E5", "Microsoft Entra Suite"], tone: "border-primary/40 bg-primary/5" },
            { title: "Compléments", items: ["Microsoft Intune Plan 1", "Microsoft Entra Workload ID Premium"], tone: "border-border" },
          ].map((b) => (
            <div key={b.title} className={cn("rounded-xl border p-4", b.tone)}>
              <h4 className="font-semibold mb-3">{b.title}</h4>
              <ul className="space-y-1.5">
                {b.items.map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTAs finaux */}
      <div className="flex flex-wrap gap-2 justify-between items-center border-t pt-6">
        <div className="flex flex-wrap gap-2">
          <Button><RefreshCw className="h-4 w-4 mr-2" />Relancer la vérification</Button>
          <Button variant="outline"><Play className="h-4 w-4 mr-2" />Relancer la synchronisation M365</Button>
          <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Ouvrir Exchange</Button>
          <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Ouvrir SharePoint</Button>
        </div>
        <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4 mr-2" />Supprimer la connexion
        </Button>
      </div>
    </div>
  );
}
