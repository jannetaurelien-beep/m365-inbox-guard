import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "./_shared";
import { AgentContextBanner } from "./AgentSelector";
import { mockAdGroups } from "./mock";
import { UsersRound, Plus, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AdGroups() {
  return (
    <div>
      <PageHeader title="Groupes de sécurité" description="Membres, portée et scope des groupes AD" icon={UsersRound}
        accent="from-teal-500 to-cyan-500"
        actions={<Button className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-500"><Plus className="h-4 w-4" />Nouveau groupe</Button>} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {mockAdGroups.map((g, i) => (
          <motion.div key={g.sam} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow">
                    <UsersRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">{g.scope}</Badge>
                <Badge variant="outline">{g.category}</Badge>
                <Badge variant="secondary" className="gap-1"><Users className="h-3 w-3" />{g.members}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
