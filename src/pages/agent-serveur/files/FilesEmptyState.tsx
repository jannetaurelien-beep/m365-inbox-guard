import { Card } from "@/components/ui/card";
import { AlertTriangle, FolderSearch, Loader2, ShieldX, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "no-scan" | "running" | "failed" | "empty" | "warnings";

export function FilesEmptyState({
  variant,
  message,
  detail,
}: {
  variant: Variant;
  message?: string;
  detail?: string;
}) {
  const cfg = {
    "no-scan": {
      icon: FolderSearch,
      title: "Aucun scan disponible",
      body: "Lancez un scan pour explorer l'arborescence et les droits NTFS de cet agent.",
      tone: "from-slate-500 to-slate-700",
    },
    running: {
      icon: Loader2,
      title: "Scan en cours…",
      body: "L'agent collecte les dossiers et les ACL. Cela peut prendre quelques instants.",
      tone: "from-cyan-500 to-blue-600",
      spin: true,
    },
    failed: {
      icon: XCircle,
      title: "Le scan a échoué",
      body: message ?? "Une erreur est survenue côté agent.",
      tone: "from-rose-500 to-red-600",
    },
    empty: {
      icon: ShieldX,
      title: "Scan vide",
      body: "Aucun dossier n'a été retourné pour ce chemin. Vérifiez les droits de l'agent ou le chemin saisi.",
      tone: "from-amber-500 to-orange-600",
    },
    warnings: {
      icon: AlertTriangle,
      title: "Scan partiel",
      body: message ?? "Le scan s'est terminé avec des avertissements.",
      tone: "from-amber-500 to-yellow-600",
    },
  }[variant] as { icon: typeof FolderSearch; title: string; body: string; tone: string; spin?: boolean };

  const Icon = cfg.icon;

  return (
    <Card className="border-dashed p-10">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className={cn("mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", cfg.tone)}>
          <Icon className={cn("h-7 w-7", cfg.spin && "animate-spin")} />
        </div>
        <h3 className="text-base font-semibold">{cfg.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{cfg.body}</p>
        {detail && (
          <details className="mt-4 w-full text-left">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              Détail technique
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg border bg-muted/40 p-3 text-[11px]">
              {detail}
            </pre>
          </details>
        )}
      </div>
    </Card>
  );
}
