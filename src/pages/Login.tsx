import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Mail, Fingerprint, CheckCircle2, Scan, KeyRound, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginPhase, setLoginPhase] = useState<'idle' | 'scanning' | 'verifying' | 'success'>('idle');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoginPhase('scanning');

    // Phase 1: Scanning
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoginPhase('verifying');

    // Phase 2: Verifying
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoginPhase('success');

    // Phase 3: Success
    await new Promise(resolve => setTimeout(resolve, 800));

    toast({
      title: "Authentification réussie",
      description: "Bienvenue dans votre espace sécurisé",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[128px]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="w-full max-w-md px-4 z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-2xl shadow-indigo-500/30 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MailFlow Pro</h1>
          <p className="text-slate-400">Portail d'administration Microsoft 365</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            {/* Security Animation Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-lg z-20 flex flex-col items-center justify-center">
                <SecurityAnimation phase={loginPhase} />
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Identifiant
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity -z-10"></div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="text"
                    placeholder="nom.prenom@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                    Mot de passe
                  </Label>
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity -z-10"></div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11 pr-11 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                <KeyRound className="h-5 w-5 mr-2" />
                Connexion sécurisée
              </Button>

              {/* Biometric option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-3 text-slate-500">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-slate-700/50 bg-slate-800/30 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-indigo-500/50 transition-all group"
              >
                <Fingerprint className="h-5 w-5 mr-2 group-hover:text-indigo-400 transition-colors" />
                Authentification biométrique
              </Button>
            </form>

            {/* Security badge */}
            <div className="mt-6 pt-6 border-t border-slate-800/50">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Connexion chiffrée TLS 1.3</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span>SSO Microsoft Azure AD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          © 2024 MailFlow Pro • Tous droits réservés
        </p>
      </div>
    </div>
  );
};

// Security Animation Component
function SecurityAnimation({ phase }: { phase: 'idle' | 'scanning' | 'verifying' | 'success' }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [codeLines, setCodeLines] = useState<string[]>([]);

  useEffect(() => {
    if (phase === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 2, 100));
      }, 20);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'verifying') {
      const codes = [
        'INIT_AUTH_PROTOCOL...',
        'VERIFY_CREDENTIALS...',
        'CHECK_2FA_STATUS...',
        'ENCRYPT_SESSION...',
        'GENERATE_TOKEN...',
        'AUTH_SUCCESS ✓'
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < codes.length) {
          setCodeLines(prev => [...prev, codes[i]]);
          i++;
        }
      }, 250);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="text-center p-8">
      {phase === 'scanning' && (
        <div className="space-y-6">
          {/* Fingerprint scanner */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
              <Fingerprint className="w-16 h-16 text-indigo-400 animate-pulse" />
            </div>
            {/* Scan line */}
            <div 
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{ 
                top: `${16 + (scanProgress / 100) * 68}%`,
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)'
              }}
            ></div>
          </div>
          <div className="space-y-2">
            <p className="text-white font-semibold">Analyse en cours...</p>
            <p className="text-slate-400 text-sm">Vérification de l'identité</p>
            <div className="w-48 h-1.5 mx-auto bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {phase === 'verifying' && (
        <div className="space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-slate-800/80 border border-slate-700/50 overflow-hidden">
              <Scan className="absolute top-2 right-2 w-4 h-4 text-cyan-400 animate-pulse" />
              <div className="p-3 font-mono text-xs text-left space-y-1">
                {codeLines.map((line, i) => (
                  <div 
                    key={i} 
                    className={`${line.includes('✓') ? 'text-emerald-400' : 'text-cyan-400'} animate-fade-in`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {line}
                  </div>
                ))}
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-white font-semibold">Vérification sécurisée</p>
            <p className="text-slate-400 text-sm">Authentification multi-facteurs</p>
          </div>
        </div>
      )}

      {phase === 'success' && (
        <div className="space-y-6 animate-scale-in">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-emerald-400 font-bold text-lg">Authentifié</p>
            <p className="text-slate-400 text-sm">Redirection vers votre espace...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
