import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import CreateUser from "./pages/CreateUser";
import Actions from "./pages/Actions";
import AutomationCenter from "./pages/AutomationCenter";
import AppointmentBooking from "./pages/AppointmentBooking";
import ServerFiles from "./pages/ServerFiles";
import VacationMessages from "./pages/VacationMessages";
import Licenses from "./pages/Licenses";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import SharePointPermissions from "./pages/SharePointPermissions";
import NotificationCenter from "./pages/NotificationCenter";
import PerformanceKPI from "./pages/PerformanceKPI";
import Leaderboard from "./pages/Leaderboard";
import CyberSecurity from "./pages/CyberSecurity";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientSupervision from "./pages/ClientSupervision";
import Login from "./pages/Login";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <main className="flex-1 p-6">
                    <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/2fa" element={<TwoFactorAuth />} />
                    <Route path="/utilisateurs" element={<Users />} />
                    <Route path="/utilisateurs/:id" element={<UserDetail />} />
                    <Route path="/actions" element={<Actions />} />
                    <Route path="/automatisations" element={<AutomationCenter />} />
                    <Route path="/actions/creer-utilisateur" element={<CreateUser />} />
                    <Route path="/actions/rendez-vous" element={<AppointmentBooking />} />
                    <Route path="/actions/*" element={<div className="p-8 text-center"><p className="text-muted-foreground">Formulaire à venir</p></div>} />
                    <Route path="/fichiers-serveur" element={<ServerFiles />} />
                    <Route path="/messages-absence" element={<VacationMessages />} />
                    <Route path="/licences" element={<Licenses />} />
                    <Route path="/demandes" element={<Requests />} />
                    <Route path="/demandes/:id" element={<RequestDetail />} />
                    <Route path="/sharepoint" element={<SharePointPermissions />} />
                    <Route path="/notifications" element={<NotificationCenter />} />
                    <Route path="/performance-kpi" element={<PerformanceKPI />} />
                    <Route path="/classement" element={<Leaderboard />} />
                    <Route path="/cybersecurite" element={<CyberSecurity />} />
                    <Route path="/clients" element={<Clients />} />
                   <Route path="/clients/:id" element={<ClientDetail />} />
                   <Route path="/clients/:id/supervision" element={<ClientSupervision />} />
                    <Route path="/parametres" element={<div className="p-8 text-center text-muted-foreground">Paramètres (à venir)</div>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
