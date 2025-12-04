import { useNavigate } from 'react-router-dom';
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
  Zap,
  Shield,
  Mail,
  Sparkles
} from 'lucide-react';

interface ActionItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  onClick: () => void;
}

function ActionItem({ title, description, icon: Icon, gradient, onClick }: ActionItemProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:bg-card/60 transition-all duration-300 w-full text-left overflow-hidden"
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`} />
      
      {/* Icon */}
      <div className={`relative w-12 h-12 rounded-xl ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      
      {/* Arrow */}
      <Zap className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0" />
    </button>
  );
}

interface CategorySectionProps {
  title: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  actions: Array<{
    title: string;
    description: string;
    icon: React.ElementType;
    gradient: string;
    path: string;
  }>;
  onActionClick: (path: string) => void;
}

function CategorySection({ title, icon: Icon, gradient, glowColor, actions, onActionClick }: CategorySectionProps) {
  return (
    <div className="relative group/section">
      {/* Section glow */}
      <div className={`absolute -inset-2 rounded-3xl ${glowColor} opacity-0 group-hover/section:opacity-20 blur-2xl transition-opacity duration-500`} />
      
      <div className="relative bg-card/30 backdrop-blur-xl rounded-3xl border border-border/40 overflow-hidden">
        {/* Header */}
        <div className={`relative p-5 ${gradient}`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <div className="ml-auto px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              {actions.length} actions
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        </div>
        
        {/* Actions list */}
        <div className="p-4 space-y-2">
          {actions.map((action) => (
            <ActionItem
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              gradient={action.gradient}
              onClick={() => onActionClick(action.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Actions() {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Utilisateurs',
      icon: UserPlus,
      gradient: 'bg-gradient-to-br from-blue-500 via-primary to-indigo-600',
      glowColor: 'bg-primary',
      actions: [
        {
          title: 'Créer un utilisateur',
          description: 'Ajouter une nouvelle boîte mail Microsoft 365',
          icon: UserPlus,
          gradient: 'bg-gradient-to-br from-primary to-blue-600',
          path: '/actions/creer-utilisateur'
        },
        {
          title: 'Désactiver un utilisateur',
          description: 'Suspendre temporairement un compte utilisateur',
          icon: UserMinus,
          gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
          path: '/actions/desactiver-utilisateur'
        },
        {
          title: 'Supprimer un utilisateur',
          description: 'Supprimer définitivement un compte utilisateur',
          icon: Trash2,
          gradient: 'bg-gradient-to-br from-red-500 to-rose-600',
          path: '/actions/supprimer-utilisateur'
        },
        {
          title: 'Prise de rendez-vous technicien',
          description: 'Planifier une intervention technique',
          icon: Calendar,
          gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
          path: '/actions/rendez-vous'
        },
      ]
    },
    {
      title: 'Boîtes mail',
      icon: Mail,
      gradient: 'bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600',
      glowColor: 'bg-cyan-500',
      actions: [
        {
          title: 'Demander un archivage',
          description: 'Archiver les emails d\'une boîte mail',
          icon: Archive,
          gradient: 'bg-gradient-to-br from-cyan-500 to-teal-600',
          path: '/actions/archivage'
        },
        {
          title: 'Ajouter un alias',
          description: 'Créer une adresse email alternative',
          icon: AtSign,
          gradient: 'bg-gradient-to-br from-primary to-blue-600',
          path: '/actions/ajouter-alias'
        },
        {
          title: 'Gérer les membres',
          description: 'Ajouter ou retirer des membres d\'une boîte partagée',
          icon: Users,
          gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
          path: '/actions/gerer-membres'
        },
        {
          title: 'Convertir en boîte nominative',
          description: 'Reconvertir une boîte partagée en boîte utilisateur',
          icon: ArrowRightLeft,
          gradient: 'bg-gradient-to-br from-amber-500 to-yellow-600',
          path: '/actions/convertir-boite'
        },
      ]
    },
    {
      title: 'Licences',
      icon: CreditCard,
      gradient: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600',
      glowColor: 'bg-violet-500',
      actions: [
        {
          title: 'Changer la licence',
          description: 'Upgrade ou downgrade d\'une licence Microsoft 365',
          icon: CreditCard,
          gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600',
          path: '/actions/changer-licence'
        },
      ]
    },
    {
      title: 'Sécurité',
      icon: Shield,
      gradient: 'bg-gradient-to-br from-rose-500 via-red-500 to-orange-600',
      glowColor: 'bg-rose-500',
      actions: [
        {
          title: 'Réinitialiser le mot de passe',
          description: 'Générer un nouveau mot de passe temporaire',
          icon: KeyRound,
          gradient: 'bg-gradient-to-br from-rose-500 to-red-600',
          path: '/actions/reset-password'
        },
      ]
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl relative min-h-screen">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-primary/30">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 blur-xl opacity-30 animate-pulse" />
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-violet-500 bg-clip-text text-transparent">
              Centre d'Actions
            </h1>
            <p className="text-muted-foreground text-lg mt-1">
              Gérez les utilisateurs et les boîtes mail Microsoft 365
            </p>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">10</span> actions disponibles
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4</span> catégories
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div 
            key={category.title} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CategorySection
              title={category.title}
              icon={category.icon}
              gradient={category.gradient}
              glowColor={category.glowColor}
              actions={category.actions}
              onActionClick={(path) => navigate(path)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
