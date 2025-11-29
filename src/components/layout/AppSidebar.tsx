import { Home, Users, CreditCard, ClipboardList, Settings, Zap, FolderTree, Mail, LogOut, Share2, Bell, TrendingUp, Trophy } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Tableau de bord', url: '/', icon: Home },
  { title: 'Utilisateurs', url: '/utilisateurs', icon: Users },
  { title: 'Actions', url: '/actions', icon: Zap },
  { title: 'Fichiers Serveur', url: '/fichiers-serveur', icon: FolderTree },
  { title: "Messages d'absence", url: '/messages-absence', icon: Mail },
  { title: 'Licences', url: '/licences', icon: CreditCard },
  { title: 'Demandes', url: '/demandes', icon: ClipboardList },
  { title: 'SharePoint', url: '/sharepoint', icon: Share2 },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Performance', url: '/performance-kpi', icon: TrendingUp },
  { title: 'Classement', url: '/classement', icon: Trophy },
  { title: 'Paramètres', url: '/parametres', icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">Microsoft 365</h2>
              <p className="text-xs text-sidebar-foreground/60">Portail de gestion</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'hover:bg-sidebar-accent/50'
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/login')}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
