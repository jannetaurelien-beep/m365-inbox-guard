import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Mail, CheckCircle2, KeyRound, Eye, EyeOff, Unlock, ShieldCheck } from "lucide-react";
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

// Security Animation Component - Holographic Shield Unlock
function SecurityAnimation({ phase }: { phase: 'idle' | 'scanning' | 'verifying' | 'success' }) {
  const [progress, setProgress] = useState(0);
  const [rings, setRings] = useState([false, false, false]);

  useEffect(() => {
    if (phase === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1.5, 100));
      }, 15);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'verifying') {
      // Unlock rings one by one
      const timers = [
        setTimeout(() => setRings(prev => [true, prev[1], prev[2]]), 300),
        setTimeout(() => setRings(prev => [prev[0], true, prev[2]]), 700),
        setTimeout(() => setRings(prev => [prev[0], prev[1], true]), 1100),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  return (
    <div className="text-center p-8">
      {phase === 'scanning' && (
        <div className="space-y-6">
          {/* Shield with scanning effect */}
          <div className="relative w-36 h-36 mx-auto">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/40 animate-spin" style={{ animationDuration: '8s' }}></div>
            
            {/* Middle pulsing ring */}
            <div className="absolute inset-3 rounded-full border border-cyan-500/50 animate-pulse"></div>
            
            {/* Inner shield container */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-indigo-500/30 flex items-center justify-center overflow-hidden">
              {/* Scanning beam */}
              <div 
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{ 
                  top: `${progress}%`,
                  boxShadow: '0 0 30px rgba(34, 211, 238, 0.8), 0 0 60px rgba(34, 211, 238, 0.4)'
                }}
              ></div>
              
              {/* Lock icon */}
              <Lock className="w-10 h-10 text-indigo-400" />
            </div>
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"
                style={{
                  left: `${50 + 45 * Math.cos((i * 60 + progress * 3) * Math.PI / 180)}%`,
                  top: `${50 + 45 * Math.sin((i * 60 + progress * 3) * Math.PI / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)'
                }}
              ></div>
            ))}
          </div>
          
          <div className="space-y-3">
            <p className="text-white font-semibold text-lg">Analyse des identifiants</p>
            <p className="text-slate-400 text-sm">Chiffrement en cours...</p>
            <div className="w-52 h-2 mx-auto bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 transition-all duration-75"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {phase === 'verifying' && (
        <div className="space-y-6">
          {/* Unlocking rings animation */}
          <div className="relative w-36 h-36 mx-auto">
            {/* Three concentric rings that unlock */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute rounded-full border-2 transition-all duration-500 ${
                  rings[i] 
                    ? 'border-emerald-500 scale-110' 
                    : 'border-indigo-500/50'
                }`}
                style={{
                  inset: `${i * 12}px`,
                  transform: rings[i] ? `rotate(${120 * i}deg) scale(1.05)` : `rotate(${-60 * i}deg)`,
                  boxShadow: rings[i] ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none'
                }}
              >
                {/* Lock indicator on each ring */}
                <div 
                  className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300 ${
                    rings[i] ? 'bg-emerald-500' : 'bg-indigo-500/50'
                  }`}
                  style={{
                    boxShadow: rings[i] ? '0 0 15px rgba(16, 185, 129, 0.8)' : 'none'
                  }}
                ></div>
              </div>
            ))}
            
            {/* Center unlock icon */}
            <div className="absolute inset-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <Unlock className={`w-8 h-8 transition-all duration-500 ${
                rings.every(r => r) ? 'text-emerald-400 scale-110' : 'text-indigo-400'
              }`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-white font-semibold text-lg">Déverrouillage sécurisé</p>
            <div className="flex justify-center gap-2">
              {['Protocole', 'Certificat', 'Session'].map((label, i) => (
                <span 
                  key={label}
                  className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                    rings[i] 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {rings[i] ? '✓ ' : ''}{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'success' && (
        <div className="space-y-6 animate-scale-in">
          <div className="relative w-36 h-36 mx-auto">
            {/* Success glow effect */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30"></div>
            
            {/* Shield check icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <ShieldCheck className="w-16 h-16 text-emerald-400" />
                {/* Sparkle effects */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-ping"
                    style={{
                      top: `${-10 + Math.random() * 60}px`,
                      left: `${-10 + Math.random() * 80}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '1s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-emerald-400 font-bold text-xl">Accès autorisé</p>
            <p className="text-slate-400 text-sm">Redirection vers votre espace...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
