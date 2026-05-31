import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "./_shared";
import { mockOUs } from "./mock";
import { FolderTree, Folder } from "lucide-react";
import { motion } from "framer-motion";

export default function AdOus() {
  return (
    <div>
      <PageHeader title="Unités d'organisation" description="Arborescence OU du domaine" icon={FolderTree} accent="from-blue-500 to-indigo-500" />
      <Card className="p-4">
        <div className="space-y-1.5">
          {mockOUs.map((o, i) => (
            <motion.div key={o.dn} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-lg border border-transparent p-3 hover:bg-muted/40 hover:border-border transition">
              <div className="flex items-center gap-3">
                <Folder className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium">{o.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{o.dn}</p>
                </div>
              </div>
              <Badge variant="outline">{o.children} sous-OU</Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
