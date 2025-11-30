import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Workflow,
  PlusCircle,
  Activity,
  CheckCircle2,
  PauseCircle,
  Shield,
  Play,
  Copy,
  Trash,
  Settings,
  Clock,
  Zap,
  Mail,
  Bell,
  Database,
  Calendar,
  User,
  Lock,
  HardDrive,
  Webhook,
  FileText,
  MessageSquare,
  Ticket,
  FileSpreadsheet,
  FolderOpen,
  UserCog,
  Send,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AutomationStatus = "active" | "paused" | "draft" | "disabled";
type AutomationScope = "client" | "global";
type TriggerType =
  | "notification"
  | "storage"
  | "license_report"
  | "scheduled"
  | "user_event"
  | "vpn_event"
  | "server_disk"
  | "webhook";
type ActionType =
  | "send_email"
  | "send_sms"
  | "create_portal_notification"
  | "create_ticket"
  | "run_powershell_script"
  | "export_report"
  | "update_sharepoint_item"
  | "update_user_m365"
  | "webhook_call";
type RunStatus = "success" | "warning" | "error" | "pending" | null;

interface AutomationAction {
  id: string;
  type: ActionType;
  enabled: boolean;
  config: Record<string, any>;
  index: number;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  status: AutomationStatus;
  scope: AutomationScope;
  clientSlug: string | null;
  triggerType: TriggerType;
  triggerConfig: Record<string, any>;
  conditionsJson?: string;
  actions: AutomationAction[];
  lastRunAt?: string;
  lastRunStatus: RunStatus;
  runCount: number;
  lastRunMessage?: string;
}

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "1",
    name: "Erreur script M365 → Mail + Notification",
    description: "Envoie un email et une notification portail quand un script M365 échoue",
    status: "active",
    scope: "global",
    clientSlug: null,
    triggerType: "notification",
    triggerConfig: { eventType: "error", source: "m365_script" },
    conditionsJson: '{"severity": "high"}',
    actions: [
      {
        id: "a1",
        type: "send_email",
        enabled: true,
        config: { to: "admin@example.com", subject: "Erreur script", template: "Script échoué" },
        index: 0,
      },
      {
        id: "a2",
        type: "create_portal_notification",
        enabled: true,
        config: { title: "Erreur script", message: "Un script a échoué" },
        index: 1,
      },
    ],
    lastRunAt: new Date(Date.now() - 3600000).toISOString(),
    lastRunStatus: "success",
    runCount: 42,
    lastRunMessage: "2 actions exécutées avec succès",
  },
  {
    id: "2",
    name: "Boîtes > 40 Go → Préparer archivage",
    description: "Détecte les boîtes mail dépassant 40 Go et prépare un ticket d'archivage",
    status: "paused",
    scope: "client",
    clientSlug: "comtesse",
    triggerType: "storage",
    triggerConfig: { thresholdGb: 40, thresholdPercent: null, scope: "all" },
    actions: [
      {
        id: "a3",
        type: "create_ticket",
        enabled: true,
        config: { title: "Archivage requis", type: "archivage", description: "Boîte > 40 Go" },
        index: 0,
      },
    ],
    lastRunAt: new Date(Date.now() - 86400000).toISOString(),
    lastRunStatus: "warning",
    runCount: 8,
    lastRunMessage: "1 boîte détectée",
  },
  {
    id: "3",
    name: "Expiration de licences → Alerte + SMS",
    description: "Envoie une alerte par SMS quand une licence expire dans 30 jours",
    status: "draft",
    scope: "global",
    clientSlug: null,
    triggerType: "scheduled",
    triggerConfig: { frequency: "daily", time: "09:00" },
    actions: [
      {
        id: "a4",
        type: "send_sms",
        enabled: true,
        config: { to: "+33612345678", message: "Licence expirant bientôt" },
        index: 0,
      },
    ],
    lastRunAt: undefined,
    lastRunStatus: null,
    runCount: 0,
  },
];

const TRIGGER_ICONS: Record<TriggerType, any> = {
  notification: Bell,
  storage: Database,
  license_report: FileText,
  scheduled: Calendar,
  user_event: User,
  vpn_event: Lock,
  server_disk: HardDrive,
  webhook: Webhook,
};

const ACTION_ICONS: Record<ActionType, any> = {
  send_email: Mail,
  send_sms: MessageSquare,
  create_portal_notification: Bell,
  create_ticket: Ticket,
  run_powershell_script: FileSpreadsheet,
  export_report: FileText,
  update_sharepoint_item: FolderOpen,
  update_user_m365: UserCog,
  webhook_call: Send,
};

const getStatusBadgeColor = (status: AutomationStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    case "paused":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    case "draft":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20";
    case "disabled":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "";
  }
};

const getRunStatusIcon = (status: RunStatus) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "pending":
      return <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const formatRelativeTime = (isoDate?: string) => {
  if (!isoDate) return "Jamais exécuté";
  const diff = Date.now() - new Date(isoDate).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Il y a quelques secondes";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  if (days < 30) return `Il y a ${days} j`;
  if (months < 12) return `Il y a ${months} mois`;
  return `Il y a ${years} an(s)`;
};

const getTriggerLabel = (type: TriggerType): string => {
  const labels: Record<TriggerType, string> = {
    notification: "Notification",
    storage: "Stockage",
    license_report: "Rapport licences",
    scheduled: "Planifié",
    user_event: "Événement utilisateur",
    vpn_event: "Événement VPN",
    server_disk: "Disque serveur",
    webhook: "Webhook",
  };
  return labels[type];
};

const AutomationCenter = () => {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterTrigger, setFilterTrigger] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Wizard form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTriggerType, setFormTriggerType] = useState<TriggerType>("notification");
  const [formScope, setFormScope] = useState<AutomationScope>("global");
  const [formClientSlug, setFormClientSlug] = useState<string | null>(null);
  const [formTriggerConfig, setFormTriggerConfig] = useState<Record<string, any>>({});
  const [formConditionsJson, setFormConditionsJson] = useState("");
  const [formActions, setFormActions] = useState<AutomationAction[]>([]);

  const selectedAutomation = useMemo(
    () => automations.find((a) => a.id === selectedId),
    [automations, selectedId]
  );

  const filteredAutomations = useMemo(() => {
    return automations.filter((auto) => {
      if (filterClient !== "all" && auto.clientSlug !== filterClient && auto.scope !== "global") return false;
      if (filterTrigger !== "all" && auto.triggerType !== filterTrigger) return false;
      if (searchQuery && !auto.name.toLowerCase().includes(searchQuery.toLowerCase()) && !auto.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusTab !== "all" && auto.status !== statusTab) return false;
      return true;
    });
  }, [automations, filterClient, filterTrigger, searchQuery, statusTab]);

  const stats = useMemo(() => {
    return {
      total: automations.length,
      active: automations.filter((a) => a.status === "active").length,
      paused: automations.filter((a) => a.status === "paused").length,
      draft: automations.filter((a) => a.status === "draft").length,
    };
  }, [automations]);

  const openWizard = (id?: string) => {
    if (id) {
      const auto = automations.find((a) => a.id === id);
      if (auto) {
        setEditingId(id);
        setFormName(auto.name);
        setFormDescription(auto.description);
        setFormTriggerType(auto.triggerType);
        setFormScope(auto.scope);
        setFormClientSlug(auto.clientSlug);
        setFormTriggerConfig(auto.triggerConfig);
        setFormConditionsJson(auto.conditionsJson || "");
        setFormActions(auto.actions);
      }
    } else {
      setEditingId(null);
      setFormName("");
      setFormDescription("");
      setFormTriggerType("notification");
      setFormScope("global");
      setFormClientSlug(null);
      setFormTriggerConfig({});
      setFormConditionsJson("");
      setFormActions([]);
    }
    setWizardStep(1);
    setWizardOpen(true);
    setTestResult(null);
    setValidationErrors([]);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setEditingId(null);
  };

  const saveAutomation = (status: AutomationStatus) => {
    if (!formName.trim()) return;

    const newAuto: Automation = {
      id: editingId || String(Date.now()),
      name: formName,
      description: formDescription,
      status,
      scope: formScope,
      clientSlug: formClientSlug,
      triggerType: formTriggerType,
      triggerConfig: formTriggerConfig,
      conditionsJson: formConditionsJson || undefined,
      actions: formActions,
      lastRunAt: undefined,
      lastRunStatus: null,
      runCount: 0,
    };

    if (editingId) {
      setAutomations((prev) => prev.map((a) => (a.id === editingId ? newAuto : a)));
    } else {
      setAutomations((prev) => [...prev, newAuto]);
    }

    closeWizard();
  };

  const toggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (a.status === "active") return { ...a, status: "paused" };
        if (a.status === "paused") return { ...a, status: "active" };
        return { ...a, status: "active" };
      })
    );
  };

  const disableAutomation = (id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, status: "disabled" } : a)));
  };

  const duplicateAutomation = (id: string) => {
    const auto = automations.find((a) => a.id === id);
    if (!auto) return;
    const copy: Automation = {
      ...auto,
      id: String(Date.now()),
      name: `${auto.name} (copie)`,
      status: "draft",
      runCount: 0,
      lastRunAt: undefined,
      lastRunStatus: null,
    };
    setAutomations((prev) => [...prev, copy]);
  };

  const deleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const testScenario = () => {
    const errors: string[] = [];
    const enabledActions = formActions.filter((a) => a.enabled);

    if (enabledActions.length === 0) {
      errors.push("Aucune action activée");
    }

    enabledActions.forEach((action, idx) => {
      if (action.type === "send_email" && !action.config.to) {
        errors.push(`Action ${idx + 1} (Email) : destinataire manquant`);
      }
      if (action.type === "webhook_call" && !action.config.url) {
        errors.push(`Action ${idx + 1} (Webhook) : URL manquante`);
      }
      if (action.type === "run_powershell_script" && !action.config.scriptName) {
        errors.push(`Action ${idx + 1} (Script PS) : nom de script manquant`);
      }
    });

    setValidationErrors(errors);

    if (errors.length > 0) {
      setTestResult({ type: "error", message: "Des erreurs empêchent le test" });
    } else {
      setTestResult({
        type: "success",
        message: `Test virtuel exécuté : ${enabledActions.length} action(s) seraient lancée(s).`,
      });
    }
  };

  const addAction = () => {
    const newAction: AutomationAction = {
      id: String(Date.now()),
      type: "send_email",
      enabled: true,
      config: {},
      index: formActions.length,
    };
    setFormActions((prev) => [...prev, newAction]);
  };

  const removeAction = (id: string) => {
    setFormActions((prev) => prev.filter((a) => a.id !== id).map((a, i) => ({ ...a, index: i })));
  };

  const duplicateAction = (id: string) => {
    const action = formActions.find((a) => a.id === id);
    if (!action) return;
    const copy: AutomationAction = {
      ...action,
      id: String(Date.now()),
      index: formActions.length,
    };
    setFormActions((prev) => [...prev, copy]);
  };

  const updateAction = (id: string, updates: Partial<AutomationAction>) => {
    setFormActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const renderWizardStep = () => {
    if (wizardStep === 1) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'automatisation</Label>
            <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Alerte boîte pleine" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Décrivez ce que fait cette automatisation..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Type de déclencheur</Label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(TRIGGER_ICONS) as TriggerType[]).map((type) => {
                const Icon = TRIGGER_ICONS[type];
                return (
                  <Button
                    key={type}
                    type="button"
                    variant={formTriggerType === type ? "default" : "outline"}
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => setFormTriggerType(type)}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-xs font-medium">{getTriggerLabel(type)}</div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (wizardStep === 2) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Périmètre de l'automatisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Portée</Label>
                <Select value={formScope} onValueChange={(v) => setFormScope(v as AutomationScope)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (tous les clients)</SelectItem>
                    <SelectItem value="client">Client spécifique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formScope === "client" && (
                <div className="space-y-2">
                  <Label>Client ciblé</Label>
                  <Select value={formClientSlug || ""} onValueChange={(v) => setFormClientSlug(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comtesse">Comtesse</SelectItem>
                      <SelectItem value="adi">ADI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conditions liées au déclencheur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formTriggerType === "notification" && (
                <>
                  <div className="space-y-2">
                    <Label>Type d'événement</Label>
                    <Select
                      value={formTriggerConfig.eventType || "any"}
                      onValueChange={(v) => setFormTriggerConfig({ ...formTriggerConfig, eventType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Tous</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Succès</SelectItem>
                        <SelectItem value="warning">Avertissement</SelectItem>
                        <SelectItem value="error">Erreur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Input
                      value={formTriggerConfig.source || ""}
                      onChange={(e) => setFormTriggerConfig({ ...formTriggerConfig, source: e.target.value })}
                      placeholder="Ex: archivage, licences..."
                    />
                  </div>
                </>
              )}

              {formTriggerType === "storage" && (
                <>
                  <div className="space-y-2">
                    <Label>Seuil (Go)</Label>
                    <Input
                      type="number"
                      value={formTriggerConfig.thresholdGb || ""}
                      onChange={(e) => setFormTriggerConfig({ ...formTriggerConfig, thresholdGb: Number(e.target.value) })}
                      placeholder="Ex: 40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Seuil (%)</Label>
                    <Input
                      type="number"
                      value={formTriggerConfig.thresholdPercent || ""}
                      onChange={(e) => setFormTriggerConfig({ ...formTriggerConfig, thresholdPercent: Number(e.target.value) })}
                      placeholder="Ex: 80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Périmètre</Label>
                    <Select
                      value={formTriggerConfig.scope || "all"}
                      onValueChange={(v) => setFormTriggerConfig({ ...formTriggerConfig, scope: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les boîtes</SelectItem>
                        <SelectItem value="users_only">Utilisateurs uniquement</SelectItem>
                        <SelectItem value="shared_only">Boîtes partagées uniquement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formTriggerType === "scheduled" && (
                <>
                  <div className="space-y-2">
                    <Label>Fréquence</Label>
                    <Select
                      value={formTriggerConfig.frequency || "daily"}
                      onValueChange={(v) => setFormTriggerConfig({ ...formTriggerConfig, frequency: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="custom_cron">Cron personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Heure</Label>
                    <Input
                      type="time"
                      value={formTriggerConfig.time || ""}
                      onChange={(e) => setFormTriggerConfig({ ...formTriggerConfig, time: e.target.value })}
                    />
                  </div>
                  {formTriggerConfig.frequency === "custom_cron" && (
                    <div className="space-y-2">
                      <Label>Expression cron</Label>
                      <Textarea
                        value={formTriggerConfig.cron || ""}
                        onChange={(e) => setFormTriggerConfig({ ...formTriggerConfig, cron: e.target.value })}
                        placeholder="Ex: 0 9 * * 1"
                        className="font-mono text-sm"
                      />
                    </div>
                  )}
                </>
              )}

              {formTriggerType === "webhook" && (
                <div className="space-y-2">
                  <Label>Clé webhook</Label>
                  <Input value="auto-generated-key-12345" readOnly className="font-mono text-sm" />
                  <p className="text-xs text-muted-foreground">URL : /webhook/auto-generated-key-12345</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>Conditions avancées (JSON)</Label>
            <Textarea
              value={formConditionsJson}
              onChange={(e) => setFormConditionsJson(e.target.value)}
              placeholder='{"severity": "high", "retries": 3}'
              className="font-mono text-sm"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Optionnel : conditions JSON supplémentaires</p>
          </div>
        </div>
      );
    }

    if (wizardStep === 3) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Actions à exécuter</Label>
            <Button type="button" onClick={addAction} size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une action
            </Button>
          </div>

          {formActions.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
                Aucune action configurée
              </CardContent>
            </Card>
          )}

          {formActions.map((action, idx) => {
            const Icon = ACTION_ICONS[action.type];
            return (
              <Card key={action.id} className={cn("border-l-4", action.enabled ? "border-l-primary" : "border-l-muted")}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Étape {idx + 1}</Badge>
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{action.type}</span>
                      {!action.enabled && <Badge variant="outline" className="text-muted-foreground">Désactivée</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={action.enabled} onCheckedChange={(v) => updateAction(action.id, { enabled: v })} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => duplicateAction(action.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAction(action.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Type d'action</Label>
                    <Select value={action.type} onValueChange={(v) => updateAction(action.id, { type: v as ActionType })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_email">Envoyer un email</SelectItem>
                        <SelectItem value="send_sms">Envoyer un SMS</SelectItem>
                        <SelectItem value="create_portal_notification">Notification portail</SelectItem>
                        <SelectItem value="create_ticket">Créer un ticket</SelectItem>
                        <SelectItem value="run_powershell_script">Exécuter un script PowerShell</SelectItem>
                        <SelectItem value="export_report">Exporter un rapport</SelectItem>
                        <SelectItem value="update_sharepoint_item">Mettre à jour SharePoint</SelectItem>
                        <SelectItem value="update_user_m365">Mettre à jour utilisateur M365</SelectItem>
                        <SelectItem value="webhook_call">Appeler un webhook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {action.type === "send_email" && (
                    <>
                      <div className="space-y-2">
                        <Label>Destinataire(s)</Label>
                        <Input
                          value={action.config.to || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, to: e.target.value } })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sujet</Label>
                        <Input
                          value={action.config.subject || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, subject: e.target.value } })}
                          placeholder="Sujet de l'email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          value={action.config.template || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, template: e.target.value } })}
                          placeholder="Contenu de l'email..."
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {action.type === "send_sms" && (
                    <>
                      <div className="space-y-2">
                        <Label>Numéro</Label>
                        <Input
                          value={action.config.to || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, to: e.target.value } })}
                          placeholder="+33612345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          value={action.config.message || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, message: e.target.value } })}
                          placeholder="Texte du SMS..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {action.type === "create_portal_notification" && (
                    <>
                      <div className="space-y-2">
                        <Label>Titre</Label>
                        <Input
                          value={action.config.title || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, title: e.target.value } })}
                          placeholder="Titre de la notification"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          value={action.config.message || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, message: e.target.value } })}
                          placeholder="Contenu de la notification..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {action.type === "run_powershell_script" && (
                    <>
                      <div className="space-y-2">
                        <Label>Nom du script</Label>
                        <Input
                          value={action.config.scriptName || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, scriptName: e.target.value } })}
                          placeholder="Get-Mailboxes.ps1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Paramètres (JSON)</Label>
                        <Textarea
                          value={action.config.parametersJson || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, parametersJson: e.target.value } })}
                          placeholder='{"param1": "value1"}'
                          className="font-mono text-sm"
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {action.type === "webhook_call" && (
                    <>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={action.config.url || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, url: e.target.value } })}
                          placeholder="https://example.com/webhook"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Méthode</Label>
                        <Select
                          value={action.config.method || "POST"}
                          onValueChange={(v) => updateAction(action.id, { config: { ...action.config, method: v } })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Body (JSON)</Label>
                        <Textarea
                          value={action.config.body || ""}
                          onChange={(e) => updateAction(action.id, { config: { ...action.config, body: e.target.value } })}
                          placeholder='{"key": "value"}'
                          className="font-mono text-sm"
                          rows={4}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    if (wizardStep === 4) {
      const enabledActions = formActions.filter((a) => a.enabled);
      return (
        <div className="space-y-6">
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Résumé de l'automatisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Si</p>
                <div className="pl-4 border-l-2 border-primary/30">
                  <p className="text-sm text-muted-foreground">
                    {getTriggerLabel(formTriggerType)} déclenché
                    {formScope === "client" && formClientSlug && ` (Client: ${formClientSlug})`}
                  </p>
                </div>
              </div>

              {(formConditionsJson || enabledActions.length > 0) && (
                <div>
                  <p className="text-sm font-medium mb-2">Alors</p>
                  <div className="pl-4 border-l-2 border-primary/30 space-y-2">
                    {formConditionsJson && (
                      <p className="text-sm text-muted-foreground">Avec conditions avancées</p>
                    )}
                    {enabledActions.map((action, idx) => (
                      <p key={action.id} className="text-sm text-muted-foreground">
                        {idx + 1}. {action.type}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vue pseudo-flux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {getTriggerLabel(formTriggerType)}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {formConditionsJson ? "Conditions" : "Sans condition"}
                </Badge>
                {enabledActions.map((action, idx) => (
                  <div key={action.id} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      Action {idx + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {validationErrors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">Erreurs de validation</p>
                  <ul className="text-sm text-destructive/80 space-y-1">
                    {validationErrors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {testResult && (
            <div
              className={cn(
                "border rounded-lg p-4",
                testResult.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-destructive/10 border-destructive/20"
              )}
            >
              <div className="flex items-start gap-3">
                {testResult.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                )}
                <p className="text-sm">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Workflow className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Automatisations
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Crée des scénarios visuels : déclencheur → conditions → actions. L'objectif : mini Power Automate dédié à des scripts PowerShell et à chaque client.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/parametres")}>
            <Settings className="h-4 w-4 mr-2" />
            Voir les paramètres
          </Button>
          <Button onClick={() => openWizard()}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle automatisation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actifs</p>
                <p className="text-3xl font-bold mt-1 text-emerald-600">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En pause</p>
                <p className="text-3xl font-bold mt-1 text-amber-600">{stats.paused}</p>
              </div>
              <PauseCircle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Brouillons</p>
                <p className="text-3xl font-bold mt-1 text-sky-600">{stats.draft}</p>
              </div>
              <Shield className="h-8 w-8 text-sky-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_1.5fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Concept</CardTitle>
              <CardDescription>
                Chaque automatisation se compose de 3 étapes : un <strong>déclencheur</strong> (événement qui lance le scénario),
                des <strong>conditions</strong> optionnelles, et une ou plusieurs <strong>actions</strong> à exécuter.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scénarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={filterClient} onValueChange={setFilterClient}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    <SelectItem value="comtesse">Comtesse</SelectItem>
                    <SelectItem value="adi">ADI</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterTrigger} onValueChange={setFilterTrigger}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les déclencheurs</SelectItem>
                    {(Object.keys(TRIGGER_ICONS) as TriggerType[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getTriggerLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Rechercher par nom / description…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Tabs */}
              <Tabs value={statusTab} onValueChange={setStatusTab}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="active">Actifs</TabsTrigger>
                  <TabsTrigger value="paused">En pause</TabsTrigger>
                  <TabsTrigger value="draft">Brouillons</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* List */}
              <div className="space-y-2">
                {filteredAutomations.map((auto) => {
                  const TriggerIcon = TRIGGER_ICONS[auto.triggerType];
                  return (
                    <Button
                      key={auto.id}
                      variant="outline"
                      className={cn(
                        "w-full h-auto flex-col items-start p-4 text-left transition-all hover:bg-accent/5 hover:-translate-y-0.5 hover:shadow-md",
                        selectedId === auto.id && "border-primary/50 bg-primary/5"
                      )}
                      onClick={() => setSelectedId(auto.id)}
                    >
                      <div className="w-full space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{auto.name}</span>
                              <Badge className={getStatusBadgeColor(auto.status)}>{auto.status}</Badge>
                              {auto.clientSlug && <Badge variant="outline">{auto.clientSlug}</Badge>}
                              {auto.scope === "global" && <Badge variant="outline">Global</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{auto.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                {getRunStatusIcon(auto.lastRunStatus)}
                                <span>{formatRelativeTime(auto.lastRunAt)}</span>
                              </div>
                              <span>{auto.runCount} exécutions</span>
                              <div className="flex items-center gap-1">
                                <TriggerIcon className="h-3 w-3" />
                                <span>{getTriggerLabel(auto.triggerType)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStatus(auto.id);
                            }}
                          >
                            {auto.status === "active" ? <PauseCircle className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                            {auto.status === "active" ? "Pause" : "Activer"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Test logic here
                            }}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Tester
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openWizard(auto.id);
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              disableAutomation(auto.id);
                            }}
                          >
                            <Shield className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateAutomation(auto.id);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAutomation(auto.id);
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detail */}
        <Card className="h-fit sticky top-6">
          <CardHeader>
            <CardTitle>Détail du scénario</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedAutomation ? (
              <div className="text-center py-12 text-muted-foreground">
                Sélectionne une automatisation pour voir ses détails
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg">{selectedAutomation.name}</h3>
                    <Badge className={getStatusBadgeColor(selectedAutomation.status)}>{selectedAutomation.status}</Badge>
                    {selectedAutomation.clientSlug && <Badge variant="outline">{selectedAutomation.clientSlug}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedAutomation.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Tester ce scénario
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAutomation.status === "active" ? "outline" : "default"}
                    className="flex-1"
                    onClick={() => toggleStatus(selectedAutomation.id)}
                  >
                    {selectedAutomation.status === "active" ? "Mettre en pause" : "Activer"}
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Déclencheur</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = TRIGGER_ICONS[selectedAutomation.triggerType];
                        return <Icon className="h-4 w-4" />;
                      })()}
                      <span className="font-medium">{getTriggerLabel(selectedAutomation.triggerType)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Dernière exécution</p>
                    <div className="flex items-center gap-2">
                      {getRunStatusIcon(selectedAutomation.lastRunStatus)}
                      <span className="font-medium">{formatRelativeTime(selectedAutomation.lastRunAt)}</span>
                    </div>
                    {selectedAutomation.lastRunMessage && (
                      <p className="text-xs text-muted-foreground mt-1">{selectedAutomation.lastRunMessage}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Bloc déclencheur</h4>
                    <p className="text-sm text-muted-foreground">
                      {getTriggerLabel(selectedAutomation.triggerType)} avec configuration définie
                    </p>
                  </div>

                  {selectedAutomation.conditionsJson && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Conditions avancées</h4>
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">{selectedAutomation.conditionsJson}</pre>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Actions</h4>
                    <div className="space-y-2">
                      {selectedAutomation.actions.map((action) => {
                        const Icon = ACTION_ICONS[action.type];
                        return (
                          <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Badge variant="outline" className="text-xs">
                              {action.index + 1}
                            </Badge>
                            <Icon className="h-4 w-4 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{action.type}</p>
                              {!action.enabled && (
                                <Badge variant="outline" className="text-xs text-muted-foreground mt-1">
                                  Désactivée
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Historique</h4>
                    <div className="flex items-center gap-2 text-sm">
                      {getRunStatusIcon(selectedAutomation.lastRunStatus)}
                      <span>
                        {selectedAutomation.runCount} exécutions totales
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Wizard Modal */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-5xl w-[96vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'automatisation" : "Nouvelle automatisation"}</DialogTitle>
            <DialogDescription>
              Crée un scénario automatisé en 4 étapes : nom & déclencheur, conditions & périmètre, actions, résumé.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 my-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    wizardStep === step
                      ? "bg-primary text-primary-foreground"
                      : wizardStep > step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step}
                </div>
                {step < 4 && <div className="w-12 h-0.5 border-t-2 border-dashed border-muted-foreground/30" />}
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground mb-4">
            {wizardStep === 1 && "Étape 1 : Nom & déclencheur"}
            {wizardStep === 2 && "Étape 2 : Conditions & périmètre"}
            {wizardStep === 3 && "Étape 3 : Actions"}
            {wizardStep === 4 && "Étape 4 : Résumé"}
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="space-y-4">{renderWizardStep()}</div>
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-sm">Aperçu & Conseils</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                {wizardStep === 1 && (
                  <>
                    <p>Choisis un nom clair et descriptif.</p>
                    <p>Le déclencheur définit quand ton automatisation se lance.</p>
                  </>
                )}
                {wizardStep === 2 && (
                  <>
                    <p>Définis le périmètre : global ou client spécifique.</p>
                    <p>Configure les conditions précises du déclencheur.</p>
                  </>
                )}
                {wizardStep === 3 && (
                  <>
                    <p>Ajoute une ou plusieurs actions à exécuter.</p>
                    <p>Tu peux désactiver temporairement une action sans la supprimer.</p>
                  </>
                )}
                {wizardStep === 4 && (
                  <>
                    <p>Vérifie ton scénario avant de l'enregistrer.</p>
                    <p>Teste-le virtuellement pour détecter les erreurs.</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="flex gap-2">
              {wizardStep > 1 && (
                <Button type="button" variant="outline" onClick={() => setWizardStep((s) => s - 1)}>
                  Précédent
                </Button>
              )}
              {wizardStep < 4 && (
                <Button type="button" onClick={() => setWizardStep((s) => s + 1)}>
                  Suivant
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {wizardStep === 4 && (
                <Button type="button" variant="outline" onClick={testScenario}>
                  <Zap className="h-4 w-4 mr-2" />
                  Tester ce scénario
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => saveAutomation("draft")} disabled={!formName.trim()}>
                Enregistrer en brouillon
              </Button>
              <Button type="button" onClick={() => saveAutomation("active")} disabled={!formName.trim()}>
                Activer et enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationCenter;