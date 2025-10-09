import { useState } from 'react';
import { Plus, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { mailboxService } from '@/lib/services';
import { toast } from 'sonner';

interface AliasSectionProps {
  userId: string;
  aliases: string[];
  onUpdate: () => void;
}

export function AliasSection({ userId, aliases, onUpdate }: AliasSectionProps) {
  const [newAlias, setNewAlias] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [aliasToDelete, setAliasToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddAlias = async () => {
    if (!validateEmail(newAlias)) {
      toast.error('Format d\'email invalide');
      return;
    }

    setIsLoading(true);
    try {
      await mailboxService.addAlias(userId, newAlias);
      toast.success('Alias ajouté avec succès');
      setNewAlias('');
      setIsAdding(false);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'alias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlias = async () => {
    if (!aliasToDelete) return;

    setIsLoading(true);
    try {
      await mailboxService.removeAlias(userId, aliasToDelete);
      toast.success('Alias supprimé');
      setAliasToDelete(null);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6 shadow-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold">Aliases</h3>
              <p className="text-sm text-muted-foreground">Adresses email alternatives</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {isAdding && (
            <div className="flex gap-2">
              <Input
                placeholder="nouvel.alias@exemple.fr"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAlias()}
              />
              <Button onClick={handleAddAlias} disabled={isLoading}>
                Ajouter
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewAlias('');
                }}
              >
                Annuler
              </Button>
            </div>
          )}

          {aliases.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Aucun alias configuré</p>
          ) : (
            <div className="space-y-2">
              {aliases.map((alias) => (
                <div
                  key={alias}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-smooth"
                >
                  <span className="text-sm font-medium">{alias}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setAliasToDelete(alias)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={!!aliasToDelete} onOpenChange={() => setAliasToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet alias ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'alias <strong>{aliasToDelete}</strong> sera supprimé définitivement.
              Les emails envoyés à cette adresse ne seront plus reçus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlias} disabled={isLoading}>
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
