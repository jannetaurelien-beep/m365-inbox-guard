import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "./_shared";
import { AgentContextBanner } from "./AgentSelector";
import { mockGPOs } from "./mock";
import { ScrollText } from "lucide-react";
import { motion } from "framer-motion";

export default function AdGpos() {
  return (
    <div>
      <PageHeader title="Stratégies de groupe (GPO)" description="Politiques de groupe — statut & modifications" icon={ScrollText} accent="from-indigo-500 to-purple-500" />
      <div className="grid gap-3 md:grid-cols-2">
        {mockGPOs.map((g, i) => (
          <motion.div key={g.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow">
                  <ScrollText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{g.name}</p>
                  <p className="text-xs text-muted-foreground">Modifiée le {g.modified}</p>
                </div>
                <Badge variant="outline" className={g.status === "AllSettingsEnabled" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-amber-500/15 text-amber-600 border-amber-500/30"}>
                  {g.status === "AllSettingsEnabled" ? "Activée" : "Partielle"}
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
