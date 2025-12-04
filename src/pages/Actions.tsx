import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
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
  Users,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  onClick: () => void;
}

function ActionCard({ title, description, icon: Icon, gradient, glowColor, onClick }: ActionCardProps) {
  return (
    <Card 
      className="group relative p-6 border-0 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
      
      {/* Glow effect */}
      <div className={`absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 ${glowColor}`} />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl border border-border/50 group-hover:border-primary/50 transition-colors duration-300" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/0 group-hover:border-primary/50 rounded-tl-xl transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/0 group-hover:border-primary/50 rounded-br-xl transition-all duration-300" />
      
      {/* Content */}
      <div className="relative flex items-start gap-4 z-10">
        <div className={`relative w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
          {/* Icon glow */}
          <div className={`absolute inset-0 rounded-2xl ${glowColor} blur-md opacity-50 group-hover:opacity-80 transition-opacity`} />
          <Icon className="relative h-7 w-7 text-white drop-shadow-lg" />
          
          {/* Sparkle effect */}
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300 truncate">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
            {description}
          </p>
        </div>
        
        {/* Arrow indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300">
          <Zap className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      {/* Bottom highlight line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary transition-all duration-500" />
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
      gradient: 'bg-gradient-to-br from-primary to-primary/60',
      glowColor: 'bg-primary',
      path: '/actions/creer-utilisateur'
    },
    {
      title: 'Désactiver un utilisateur',
      description: 'Suspendre temporairement un compte utilisateur',
      icon: UserMinus,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      glowColor: 'bg-amber-500',
      path: '/actions/desactiver-utilisateur'
    },
    {
      title: 'Supprimer un utilisateur',
      description: 'Supprimer définitivement un compte utilisateur',
      icon: Trash2,
      gradient: 'bg-gradient-to-br from-red-500 to-rose-600',
      glowColor: 'bg-red-500',
      path: '/actions/supprimer-utilisateur'
    },
    {
      title: 'Prise de rendez-vous technicien',
      description: 'Planifier une intervention technique',
      icon: Calendar,
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
      glowColor: 'bg-violet-500',
      path: '/actions/rendez-vous'
    },
  ];

  const mailboxActions = [
    {
      title: 'Demander un archivage',
      description: 'Archiver les emails d\'une boîte mail',
      icon: Archive,
      gradient: 'bg-gradient-to-br from-cyan-500 to-teal-600',
      glowColor: 'bg-cyan-500',
      path: '/actions/archivage'
    },
    {
      title: 'Ajouter un alias',
      description: 'Créer une adresse email alternative',
      icon: AtSign,
      gradient: 'bg-gradient-to-br from-primary to-blue-600',
      glowColor: 'bg-primary',
      path: '/actions/ajouter-alias'
    },
    {
      title: 'Gérer les membres',
      description: 'Ajouter ou retirer des membres d\'une boîte partagée',
      icon: Users,
      gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
      glowColor: 'bg-emerald-500',
      path: '/actions/gerer-membres'
    },
    {
      title: 'Convertir en boîte nominative',
      description: 'Reconvertir une boîte partagée en boîte utilisateur',
      icon: ArrowRightLeft,
      gradient: 'bg-gradient-to-br from-amber-500 to-yellow-600',
      glowColor: 'bg-amber-500',
      path: '/actions/convertir-boite'
    },
  ];

  const licenseActions = [
    {
      title: 'Changer la licence',
      description: 'Upgrade ou downgrade d\'une licence Microsoft 365',
      icon: CreditCard,
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      glowColor: 'bg-indigo-500',
      path: '/actions/changer-licence'
    },
  ];

  const securityActions = [
    {
      title: 'Réinitialiser le mot de passe',
      description: 'Générer un nouveau mot de passe temporaire',
      icon: KeyRound,
      gradient: 'bg-gradient-to-br from-rose-500 to-red-600',
      glowColor: 'bg-rose-500',
      path: '/actions/reset-password'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Header */}
      <div className="space-y-3 relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary to-violet-600 blur-lg opacity-30" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-violet-500 bg-clip-text text-transparent">
              Actions
            </h1>
            <p className="text-muted-foreground text-lg">
              Gérez les utilisateurs et les boîtes mail Microsoft 365
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="relative h-14 p-1.5 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg w-full max-w-3xl">
          {/* Active tab glow */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-violet-500/10" />
          </div>
          
          <TabsTrigger 
            value="users" 
            className="relative z-10 flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 font-medium"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger 
            value="mailboxes" 
            className="relative z-10 flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all duration-300 font-medium"
          >
            <Archive className="h-4 w-4 mr-2" />
            Boîtes mail
          </TabsTrigger>
          <TabsTrigger 
            value="licenses" 
            className="relative z-10 flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 transition-all duration-300 font-medium"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Licences
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="relative z-10 flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-rose-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-rose-500/25 transition-all duration-300 font-medium"
          >
            <KeyRound className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {userActions.map((action, index) => (
              <div key={action.title} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <ActionCard
                  {...action}
                  onClick={() => navigate(action.path)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mailboxes" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {mailboxActions.map((action, index) => (
              <div key={action.title} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <ActionCard
                  {...action}
                  onClick={() => navigate(action.path)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {licenseActions.map((action, index) => (
              <div key={action.title} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <ActionCard
                  {...action}
                  onClick={() => navigate(action.path)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {securityActions.map((action, index) => (
              <div key={action.title} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <ActionCard
                  {...action}
                  onClick={() => navigate(action.path)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
