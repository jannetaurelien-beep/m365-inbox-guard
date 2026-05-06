import { motion } from 'framer-motion';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2, AlertTriangle, ShieldCheck, HardDrive, Cpu, Wifi, Activity,
  Calendar, Building2, User, Tag, Boxes, Database, Clock, Zap, Signal, Camera, Bell, PhoneCall, Server, Printer
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from 'recharts';
import type { EnrichedDevice } from '@/lib/mock-data/parc-details';

interface Props {
  device: EnrichedDevice | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const stateColor = (ok: boolean) =>
  ok ? 'text-emerald-500' : 'text-amber-500';

const KV = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) => (
  <div className="flex items-start gap-2 py-1.5">
    {Icon && <Icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />}
    <div className="flex-1 min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{value ?? '—'}</p>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children, accent }: { title: string; icon: any; children: React.ReactNode; accent?: string }) => (
  <Card className="p-4 bg-card/80 border-border/50">
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-1.5 rounded-lg ${accent || 'bg-primary/10 text-primary'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h4 className="font-semibold text-sm">{title}</h4>
    </div>
    {children}
  </Card>
);

export function DeviceDetailSheet({ device, open, onOpenChange }: Props) {
  if (!device) return null;

  const garantieDays = device.garantie
    ? Math.round((new Date(device.garantie.fin).getTime() - Date.now()) / 86400000)
    : null;
  const garantieOk = garantieDays !== null && garantieDays > 30;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] capitalize">{device.categorie}</Badge>
            <Badge className={
              device.status === 'actif' ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' :
              device.status === 'maintenance' ? 'bg-amber-500/15 text-amber-700 border-amber-500/30' :
              'bg-destructive/15 text-destructive border-destructive/30'
            }>{device.status}</Badge>
            {device.miseAJour && (
              <Badge variant="outline" className={device.miseAJour.aJour
                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-700 border-amber-500/30'}>
                {device.miseAJour.aJour ? 'À jour' : `${device.miseAJour.patchsManquants} patchs en attente`}
              </Badge>
            )}
          </div>
          <SheetTitle className="text-xl">{device.nom}</SheetTitle>
          <SheetDescription className="text-sm">
            {device.modele} · {device.os}
          </SheetDescription>
        </SheetHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mt-6"
        >
          {/* Identité */}
          <Section title="Identité & affectation" icon={Tag}>
            <div className="grid grid-cols-2 gap-x-4">
              <KV label="Numéro de série" value={<code className="text-xs">{device.numeroSerie}</code>} icon={Boxes} />
              <KV label="Fournisseur" value={device.fournisseur} icon={Building2} />
              <KV label="Agence" value={device.agence} icon={Building2} />
              <KV label="Utilisateur" value={device.utilisateur || '—'} icon={User} />
              <KV label="Dernier contact" value={device.dernierVu} icon={Clock} />
              <KV label="Contrat" value={device.contrat} icon={ShieldCheck} />
            </div>
          </Section>

          {/* Garantie */}
          {device.garantie && (
            <Section title="Garantie & support" icon={ShieldCheck} accent="bg-violet-500/10 text-violet-600">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Début</p>
                  <p className="text-sm font-semibold">{new Date(device.garantie.debut).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Fin</p>
                  <p className="text-sm font-semibold">{new Date(device.garantie.fin).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Niveau</p>
                  <p className="text-sm font-semibold">{device.garantie.niveau}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {garantieOk
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                <span className={`text-sm ${stateColor(!!garantieOk)}`}>
                  {garantieDays && garantieDays > 0
                    ? `Encore ${garantieDays} jours`
                    : 'Garantie expirée'}
                </span>
              </div>
            </Section>
          )}

          {/* Mises à jour */}
          {device.miseAJour && (
            <Section title="Mises à jour" icon={Zap} accent="bg-amber-500/10 text-amber-600">
              <div className="grid grid-cols-2 gap-3">
                <KV label="Dernier patch" value={device.miseAJour.dernierePatch} icon={Calendar} />
                <KV label="Patchs en attente" value={device.miseAJour.patchsManquants} icon={AlertTriangle} />
                <KV label="Version OS" value={device.miseAJour.versionOS} icon={Cpu} />
                <KV label="Politique" value={device.miseAJour.politique} icon={ShieldCheck} />
              </div>
            </Section>
          )}

          {/* Stockage / disques */}
          {device.stockage && device.stockage.length > 0 && (
            <Section title="Stockage & disques" icon={HardDrive} accent="bg-blue-500/10 text-blue-600">
              <div className="space-y-3">
                {device.stockage.map((s, i) => {
                  const used = s.totalGo - s.libreGo;
                  const pct = Math.round((used / s.totalGo) * 100);
                  const danger = pct >= 85;
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{s.nom}</span>
                          <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                          <Badge variant="outline" className={`text-[10px] ${
                            s.sante === 'OK' ? 'text-emerald-600 border-emerald-500/30' :
                            s.sante === 'Avertissement' ? 'text-amber-600 border-amber-500/30' :
                            'text-destructive border-destructive/30'
                          }`}>{s.sante}</Badge>
                        </div>
                        <span className={`text-xs ${danger ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                          {s.libreGo} Go libre / {s.totalGo} Go
                        </span>
                      </div>
                      <Progress value={pct} className={`h-2 ${danger ? '[&>div]:bg-destructive' : ''}`} />
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Sauvegardes */}
          {device.sauvegarde && (
            <Section title="Sauvegardes" icon={Database} accent="bg-emerald-500/10 text-emerald-600">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {device.sauvegarde.connectee
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    : <AlertTriangle className="h-4 w-4 text-destructive" />}
                  <span className="text-sm font-medium">
                    {device.sauvegarde.connectee ? 'Sauvegarde connectée' : 'Non connectée'}
                  </span>
                </div>
                <KV label="Destination" value={device.sauvegarde.destination} icon={Server} />
                <KV label="Dernier succès" value={device.sauvegarde.dernierSucces} icon={Clock} />
                <KV label="Rétention" value={device.sauvegarde.retention} icon={Calendar} />
                <KV label="Fréquence" value={device.sauvegarde.frequence} icon={Activity} />
                <KV label="Taille totale" value={device.sauvegarde.tailleGo ? `${device.sauvegarde.tailleGo} Go` : '—'} icon={HardDrive} />
              </div>
            </Section>
          )}

          {/* Lien internet — graph */}
          {device.lien && (
            <Section title="Performance lien internet" icon={Wifi} accent="bg-cyan-500/10 text-cyan-600">
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Débit</p>
                  <p className="text-sm font-semibold">{device.lien.debit}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">SLA</p>
                  <p className="text-sm font-semibold">{device.lien.sla}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Uptime 30j</p>
                  <p className="text-sm font-semibold text-emerald-600">{device.lien.uptime}%</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-muted-foreground">Latence</p>
                  <p className="text-sm font-semibold">{device.lien.latence} ms</p>
                </div>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={device.lien.bandwidth24h}>
                    <defs>
                      <linearGradient id="bwDown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="bwUp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="h" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} unit=" Mb" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="down" stroke="hsl(var(--primary))" fill="url(#bwDown)" name="Down (Mb/s)" />
                    <Area type="monotone" dataKey="up" stroke="hsl(var(--accent-foreground))" fill="url(#bwUp)" name="Up (Mb/s)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <Separator className="my-3" />
              <p className="text-[11px] uppercase text-muted-foreground mb-2">Latence 24h (ms)</p>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={device.lien.latence24h}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="h" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} unit=" ms" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', fontSize: 12, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="ms" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Section>
          )}

          {/* Spécifications matérielles (poste / serveur) */}
          {device.specs && (
            <Section title="Spécifications" icon={Cpu} accent="bg-indigo-500/10 text-indigo-600">
              <div className="grid grid-cols-2 gap-3">
                <KV label="Processeur" value={device.specs.cpu} icon={Cpu} />
                <KV label="RAM" value={device.specs.ramGo ? `${device.specs.ramGo} Go` : undefined} icon={Boxes} />
                <KV label="GPU" value={device.specs.gpu} icon={Activity} />
                <KV label="Batterie" value={device.specs.batterie ? `${device.specs.batterie}%` : undefined} icon={Zap} />
              </div>
            </Section>
          )}

          {/* Téléphonie */}
          {device.telephonie && (
            <Section title="Téléphonie" icon={PhoneCall} accent="bg-sky-500/10 text-sky-600">
              <div className="grid grid-cols-2 gap-3">
                <KV label="Lignes SDA" value={device.telephonie.lignes} icon={Signal} />
                <KV label="Postes" value={device.telephonie.postes} icon={PhoneCall} />
                <KV label="IPBX" value={device.telephonie.ipbx} icon={Server} />
                <KV label="Opérateur SIP" value={device.telephonie.operateur} icon={Building2} />
              </div>
            </Section>
          )}

          {/* Vidéosurveillance */}
          {device.videosurveillance && (
            <Section title="Vidéosurveillance" icon={Camera} accent="bg-fuchsia-500/10 text-fuchsia-600">
              <div className="grid grid-cols-2 gap-3">
                <KV label="Caméras" value={device.videosurveillance.cameras} icon={Camera} />
                <KV label="Rétention" value={device.videosurveillance.retentionJours ? `${device.videosurveillance.retentionJours} jours` : undefined} icon={Calendar} />
                <KV label="Stockage NVR" value={device.videosurveillance.stockageNVR} icon={HardDrive} />
                <KV label="Accès cloud" value={device.videosurveillance.cloud ? 'Oui' : 'Non'} icon={ShieldCheck} />
              </div>
            </Section>
          )}

          {/* Alarme */}
          {device.alarme && (
            <Section title="Alarme & télésurveillance" icon={Bell} accent="bg-rose-500/10 text-rose-600">
              <div className="grid grid-cols-2 gap-3">
                <KV label="Centrale" value={device.alarme.centrale} icon={Server} />
                <KV label="Détecteurs" value={device.alarme.detecteurs} icon={Activity} />
                <KV label="Télésurveillance" value={device.alarme.telesurveillance} icon={ShieldCheck} />
                <KV label="Dernier test" value={device.alarme.dernierTest} icon={Calendar} />
              </div>
            </Section>
          )}

          {/* Imprimante */}
          {device.impression && (
            <Section title="Impression" icon={Printer} accent="bg-zinc-500/10 text-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                <KV label="Pages imprimées" value={device.impression.pagesImprimees?.toLocaleString('fr-FR')} icon={Activity} />
                <KV label="Toner restant" value={device.impression.tonerPct ? `${device.impression.tonerPct}%` : undefined} icon={Boxes} />
                <KV label="Contrat coût/page" value={device.impression.coutPage} icon={ShieldCheck} />
              </div>
            </Section>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
