import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Archive, 
  CreditCard, 
  ArrowRightLeft, 
  AtSign, 
  KeyRound,
  UserMinus,
  Trash2,
  Mail,
  Users,
  Calendar
} from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

function ActionCard({ title, description, icon: Icon, color, onClick }: ActionCardProps) {
  return (
    <Card className="p-6 shadow-card hover:shadow-lg transition-all cursor-pointer group" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-smooth`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-smooth">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Actions() {
  const navigate = useNavigate();

  const userActions = [
    {
      title: 'Créer un utilisateur',
      description: 'Ajouter une nouvelle boîte mail Microsoft 365',
      icon: UserPlus,
      color: 'bg-primary',
      path: '/actions/creer-utilisateur'
    },
    {
      title: 'Désactiver un utilisateur',
      description: 'Suspendre temporairement un compte utilisateur',
      icon: UserMinus,
      color: 'bg-warning',
      path: '/actions/desactiver-utilisateur'
    },
    {
      title: 'Supprimer un utilisateur',
      description: 'Supprimer définitivement un compte utilisateur',
      icon: Trash2,
      color: 'bg-destructive',
      path: '/actions/supprimer-utilisateur'
    },
    {
      title: 'Prise de rendez-vous technicien',
      description: 'Planifier une intervention technique',
      icon: Calendar,
      color: 'bg-accent',
      path: '/actions/rendez-vous'
    },
  ];

  const mailboxActions = [
    {
      title: 'Demander un archivage',
      description: 'Archiver les emails d\'une boîte mail',
      icon: Archive,
      color: 'bg-accent',
      path: '/actions/archivage'
    },
    {
      title: 'Ajouter un alias',
      description: 'Créer une adresse email alternative',
      icon: AtSign,
      color: 'bg-primary',
      path: '/actions/ajouter-alias'
    },
    {
      title: 'Gérer les membres',
      description: 'Ajouter ou retirer des membres d\'une boîte partagée',
      icon: Users,
      color: 'bg-accent',
      path: '/actions/gerer-membres'
    },
    {
      title: 'Convertir en boîte nominative',
      description: 'Reconvertir une boîte partagée en boîte utilisateur',
      icon: ArrowRightLeft,
      color: 'bg-warning',
      path: '/actions/convertir-boite'
    },
  ];

  const licenseActions = [
    {
      title: 'Changer la licence',
      description: 'Upgrade ou downgrade d\'une licence Microsoft 365',
      icon: CreditCard,
      color: 'bg-primary',
      path: '/actions/changer-licence'
    },
  ];

  const securityActions = [
    {
      title: 'Réinitialiser le mot de passe',
      description: 'Générer un nouveau mot de passe temporaire',
      icon: KeyRound,
      color: 'bg-destructive',
      path: '/actions/reset-password'
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Actions</h1>
        <p className="text-muted-foreground mt-1">Gérez les utilisateurs et les boîtes mail</p>
      </div>

      {/* Gestion des utilisateurs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userActions.map((action) => (
            <ActionCard
              key={action.title}
              {...action}
              onClick={() => navigate(action.path)}
            />
          ))}
        </div>
      </div>

      {/* Gestion des boîtes mail */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Gestion des boîtes mail</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mailboxActions.map((action) => (
            <ActionCard
              key={action.title}
              {...action}
              onClick={() => navigate(action.path)}
            />
          ))}
        </div>
      </div>

      {/* Licences */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Licences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {licenseActions.map((action) => (
            <ActionCard
              key={action.title}
              {...action}
              onClick={() => navigate(action.path)}
            />
          ))}
        </div>
      </div>

      {/* Sécurité */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityActions.map((action) => (
            <ActionCard
              key={action.title}
              {...action}
              onClick={() => navigate(action.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
