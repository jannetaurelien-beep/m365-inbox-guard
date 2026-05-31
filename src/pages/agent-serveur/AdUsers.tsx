import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./_shared";
import { AgentContextBanner } from "./AgentSelector";
import { mockAdUsers } from "./mock";
import { Users, Search, UserPlus, KeyRound, UserMinus, UserCheck, MoreHorizontal } from "lucide-react";

export default function AdUsers() {
  return (
    <div>
      <PageHeader
        title="Active Directory — Utilisateurs"
        description="Création, modification, réinitialisation, gestion des groupes"
        icon={Users}
        accent="from-emerald-500 to-teal-500"
        actions={
          <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
            <UserPlus className="h-4 w-4" />Nouvel utilisateur
          </Button>
        }
      />

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher nom, UPN, département..." className="pl-9" />
          </div>
          <Button variant="outline">Filtres</Button>
          <Button variant="outline">Exporter CSV</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SamAccountName</TableHead>
              <TableHead>Nom affiché</TableHead>
              <TableHead>UPN</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAdUsers.map((u) => (
              <TableRow key={u.sam} className="hover:bg-muted/40">
                <TableCell className="font-mono text-xs">{u.sam}</TableCell>
                <TableCell className="font-medium">{u.display}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.upn}</TableCell>
                <TableCell><Badge variant="outline">{u.dept}</Badge></TableCell>
                <TableCell>{u.title}</TableCell>
                <TableCell>
                  {u.enabled
                    ? <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30" variant="outline">Activé</Badge>
                    : <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/30" variant="outline">Désactivé</Badge>}
                </TableCell>
                <TableCell className="text-xs">{u.lastLogon}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" title="Réinitialiser MDP"><KeyRound className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" title={u.enabled ? "Désactiver" : "Activer"}>
                      {u.enabled ? <UserMinus className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
