import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden" onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-smooth shadow-lg group-hover:shadow-xl`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-smooth">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
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
    <div className="space-y-6 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Actions</h1>
        <p className="text-muted-foreground text-lg">Gérez les utilisateurs et les boîtes mail Microsoft 365</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 h-12 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="mailboxes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Boîtes mail
          </TabsTrigger>
          <TabsTrigger value="licenses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Licences
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {userActions.map((action) => (
              <ActionCard
                key={action.title}
                {...action}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mailboxes" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mailboxActions.map((action) => (
              <ActionCard
                key={action.title}
                {...action}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {licenseActions.map((action) => (
              <ActionCard
                key={action.title}
                {...action}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {securityActions.map((action) => (
              <ActionCard
                key={action.title}
                {...action}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
