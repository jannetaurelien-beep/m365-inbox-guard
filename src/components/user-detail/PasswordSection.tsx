import { useState } from 'react';
import { Eye, EyeOff, RotateCcw, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { userService } from '@/lib/services';
import { toast } from 'sonner';

interface PasswordSectionProps {
  userId: string;
}

export function PasswordSection({ userId }: PasswordSectionProps) {
  const [password, setPassword] = useState<string>('••••••••••••');
  const [isRevealed, setIsRevealed] = useState(false);
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRevealPassword = async () => {
    setIsLoading(true);
    try {
      const result = await userService.revealPassword(userId);
      setPassword(result.password);
      setIsRevealed(true);
      setShowRevealDialog(false);
      toast.success('Mot de passe révélé (version masquée)');
    } catch (error) {
      toast.error('Erreur lors de la révélation du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const result = await userService.resetPassword(userId);
      setShowResetDialog(false);
      toast.success(`Mot de passe réinitialisé : ${result.tempPassword}`, {
        duration: 10000,
      });
    } catch (error) {
      toast.error('Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6 shadow-card">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold">Sécurité</h3>
            <p className="text-sm text-muted-foreground">Gestion du mot de passe</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Mot de passe</label>
            <div className="flex gap-2">
              <Input
                type={isRevealed ? 'text' : 'password'}
                value={password}
                readOnly
                className="flex-1 font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowRevealDialog(true)}
                disabled={isRevealed}
              >
                {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Nécessite un rôle ADMIN et double confirmation
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowResetDialog(true)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser le mot de passe
          </Button>
        </div>
      </Card>

      {/* Dialog de révélation */}
      <AlertDialog open={showRevealDialog} onOpenChange={setShowRevealDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Révéler le mot de passe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action nécessite un rôle ADMIN et sera enregistrée dans l'audit.
              Seule une version masquée sera affichée pour des raisons de sécurité.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevealPassword} disabled={isLoading}>
              {isLoading ? 'Chargement...' : 'Confirmer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de réinitialisation */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser le mot de passe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Un nouveau mot de passe temporaire sera généré et affiché une seule fois.
              L'utilisateur devra le changer à la prochaine connexion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword} disabled={isLoading}>
              {isLoading ? 'Chargement...' : 'Réinitialiser'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
