import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "./_shared";
import { Rocket, Copy, Download, KeyRound, CheckCircle2, Terminal } from "lucide-react";
import { toast } from "sonner";

export default function Deployment() {
  const [label, setLabel] = useState("SRV-NEW01");
  const [token] = useState("eyJhbGciOi-XYZ-token-24h-usage-unique-abc123def456");

  const script = `# AutoCore Agent — Installation rapide
$ServerUrl = "https://portail.autocore.local"
$Token     = "${token}"
$Label     = "${label}"

Invoke-WebRequest "$ServerUrl/api/agent/download/" -OutFile "$env:TEMP\\autocore-agent.exe"
& "$env:TEMP\\autocore-agent.exe" --auto \`
    --server  $ServerUrl \`
    --token   $Token \`
    --label   $Label \`
    --service
Write-Host "✓ Agent installé et enregistré" -ForegroundColor Green`;

  const steps = [
    { i: 1, t: "Génère un token", d: "Token à usage unique valide 24h", icon: KeyRound },
    { i: 2, t: "Copie le script", d: "PowerShell prêt à coller en admin", icon: Copy },
    { i: 3, t: "Lance sur le serveur", d: "Installation NSSM + heartbeat 30s", icon: Terminal },
    { i: 4, t: "Apparaît ici", d: "Statut En ligne dans la console", icon: CheckCircle2 },
  ];

  return (
    <div>
      <PageHeader title="Déploiement d'un nouvel agent" description="4 étapes guidées — 60 secondes" icon={Rocket} accent="from-fuchsia-500 to-pink-500" />

      {/* Timeline */}
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div key={s.i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="relative overflow-hidden p-4">
              <div className="absolute right-3 top-3 text-3xl font-black text-muted/30">{s.i}</div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold">{s.t}</p>
              <p className="text-xs text-muted-foreground">{s.d}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Config */}
        <Card className="p-5 lg:col-span-1">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><KeyRound className="h-4 w-4" />Configuration</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Nom de l'agent</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Token (24h)</Label>
              <div className="flex gap-2">
                <Input value={token} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(token); toast.success("Token copié"); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Hashé SHA-256 côté serveur</p>
            </div>
            <Button className="w-full gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500">
              <KeyRound className="h-4 w-4" />Régénérer un token
            </Button>
          </div>
        </Card>

        {/* Script */}
        <Card className="lg:col-span-2 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="ml-2 text-xs font-mono text-muted-foreground">deploy-agent.ps1</span>
              <Badge variant="outline" className="text-[10px]">PowerShell</Badge>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(script); toast.success("Script copié"); }}>
                <Copy className="h-3.5 w-3.5 mr-1.5" />Copier
              </Button>
              <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5 mr-1.5" />.ps1</Button>
            </div>
          </div>
          <pre className="overflow-auto bg-slate-950 p-4 text-xs leading-relaxed text-slate-100 max-h-[400px]">
            <code>{script}</code>
          </pre>
        </Card>
      </div>
    </div>
  );
}
