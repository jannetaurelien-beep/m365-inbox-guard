import { useState } from 'react';
import { Plus, X, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { MemberRole } from '@/lib/mock-data';
import { mailboxService } from '@/lib/services';
import { toast } from 'sonner';

interface Member {
  id: string;
  displayName: string;
  role: MemberRole;
}

interface MembersSectionProps {
  mailboxId: string;
  members: Member[];
  onUpdate: () => void;
}

export function MembersSection({ mailboxId, members, onUpdate }: MembersSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberRole, setNewMemberRole] = useState<MemberRole>('Lecture');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMember = async () => {
    setIsLoading(true);
    try {
      // Dans un vrai cas, on sélectionnerait l'utilisateur depuis une liste
      await mailboxService.addMember(mailboxId, 'usr_new', newMemberRole);
      toast.success('Membre ajouté avec succès');
      setIsAdding(false);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du membre');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToDelete) return;

    setIsLoading(true);
    try {
      await mailboxService.removeMember(mailboxId, memberToDelete);
      toast.success('Membre retiré');
      setMemberToDelete(null);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      await mailboxService.convertToUser(mailboxId);
      toast.success('Boîte convertie en nominative');
      setShowConvertDialog(false);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la conversion');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: MemberRole) => {
    switch (role) {
      case 'AccesComplet': return 'default';
      case 'EnvoyeDe': return 'secondary';
      case 'Lecture': return 'outline';
    }
  };

  return (
    <>
      <Card className="p-6 shadow-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold">Membres ayant accès</h3>
              <p className="text-sm text-muted-foreground">Gestion des autorisations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConvertDialog(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Convertir en nominative
            </Button>
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
        </div>

        <div className="space-y-3">
          {isAdding && (
            <div className="flex gap-2 p-3 border rounded-lg">
              <Select value={newMemberRole} onValueChange={(v) => setNewMemberRole(v as MemberRole)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="EnvoyeDe">Envoyé de</SelectItem>
                  <SelectItem value="AccesComplet">Accès complet</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddMember} disabled={isLoading}>
                Ajouter
              </Button>
              <Button variant="ghost" onClick={() => setIsAdding(false)}>
                Annuler
              </Button>
            </div>
          )}

          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Aucun membre</p>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {member.displayName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.displayName}</p>
                      <Badge variant={getRoleBadgeVariant(member.role)} className="mt-1">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMemberToDelete(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Dialog suppression membre */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer ce membre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le membre n'aura plus accès à cette boîte partagée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} disabled={isLoading}>
              {isLoading ? 'Suppression...' : 'Retirer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog conversion */}
      <AlertDialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convertir en boîte nominative ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action transformera la boîte partagée en boîte nominative.
              Tous les membres perdront leur accès. Cette opération est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConvert} disabled={isLoading}>
              {isLoading ? 'Conversion...' : 'Convertir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
