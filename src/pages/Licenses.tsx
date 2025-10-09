import { Check, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockLicenses } from '@/lib/mock-data';

export default function Licenses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Licences</h1>
        <p className="text-muted-foreground mt-1">Catalogue des licences Microsoft 365</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockLicenses.map((license) => (
          <Card key={license.skuId} className="p-6 shadow-card hover:shadow-card-hover transition-smooth flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <Badge variant="outline">{license.stockageGo} Go</Badge>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{license.prixMensuel}€</p>
                <p className="text-xs text-muted-foreground">par mois</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">{license.label}</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">{license.description}</p>

            <div className="space-y-2 mb-6">
              {license.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Choisir cette licence
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Assistant d'upgrade</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Besoin d'aide pour choisir la bonne licence ? Notre assistant vous guide en fonction de vos besoins.
        </p>
        <Button>
          Démarrer l'assistant
        </Button>
      </Card>
    </div>
  );
}
