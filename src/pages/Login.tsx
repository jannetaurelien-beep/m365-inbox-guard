import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Lock, Mail, KeyRound, Eye, EyeOff, Fingerprint, ShieldCheck, ScanEye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoginPhase('verifying');

    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoginPhase('success');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }

    toast({
      title: "Authentification réussie",
      description: "Bienvenue dans votre espace sécurisé",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[128px]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-500/30 dark:bg-cyan-400/40 rounded-full animate-pulse"
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
          <h1 className="text-3xl font-bold text-foreground mb-2">MailFlow Pro</h1>
          <p className="text-muted-foreground">Portail d'administration Microsoft 365</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            {/* Security Animation Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg z-20 flex flex-col items-center justify-center">
                <BiometricAnimation phase={loginPhase} />
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80 text-sm font-medium">
                  Identifiant
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity -z-10"></div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="text"
                    placeholder="nom.prenom@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground/80 text-sm font-medium">
                    Mot de passe
                  </Label>
                  <a href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity -z-10"></div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11 pr-11 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-border data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  Se souvenir de moi
                </Label>
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
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Connexion chiffrée TLS 1.3</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                <span>SSO Microsoft Azure AD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          © 2024 MailFlow Pro • Tous droits réservés
        </p>
      </div>
    </div>
  );
};

// Biometric Authentication Animation - Fingerprint & Retinal Scan
function BiometricAnimation({ phase }: { phase: 'idle' | 'scanning' | 'verifying' | 'success' }) {
  const [scanLine, setScanLine] = useState(0);
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [irisRotation, setIrisRotation] = useState(0);
  const [irisScale, setIrisScale] = useState(1);
  const [matchPoints, setMatchPoints] = useState<{x: number, y: number, active: boolean}[]>([]);

  useEffect(() => {
    if (phase === 'scanning') {
      const points = [];
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 25 + Math.random() * 20;
        points.push({
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          active: false
        });
      }
      setMatchPoints(points);

      const scanInterval = setInterval(() => {
        setScanLine(prev => (prev + 1.5) % 100);
      }, 20);

      const progressInterval = setInterval(() => {
        setFingerprintProgress(prev => Math.min(prev + 0.8, 100));
      }, 20);

      points.forEach((_, i) => {
        setTimeout(() => {
          setMatchPoints(prev => prev.map((p, idx) => 
            idx === i ? { ...p, active: true } : p
          ));
        }, 100 + i * 100);
      });

      return () => {
        clearInterval(scanInterval);
        clearInterval(progressInterval);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'verifying') {
      const irisInterval = setInterval(() => {
        setIrisRotation(prev => prev + 3);
        setIrisScale(0.95 + Math.sin(Date.now() / 200) * 0.1);
      }, 30);
      return () => clearInterval(irisInterval);
    }
  }, [phase]);

  return (
    <div className="text-center p-4 w-full max-w-xs">
      {phase === 'scanning' && (
        <div className="space-y-4">
          <div className="relative w-40 h-48 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/50 overflow-hidden bg-slate-950/50">
              <svg viewBox="0 0 100 120" className="w-full h-full opacity-40">
                {[...Array(8)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx="50"
                    cy="60"
                    rx={15 + i * 5}
                    ry={20 + i * 7}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-cyan-400"
                    style={{
                      opacity: Math.max(0.1, 1 - i * 0.12),
                      strokeDasharray: i % 2 === 0 ? '8 4' : '12 6'
                    }}
                  />
                ))}
                <path
                  d="M45,55 Q50,45 55,55 Q60,65 50,70 Q40,65 45,55"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-cyan-300"
                />
              </svg>

              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{ 
                  top: `${scanLine}%`,
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)'
                }}
              />

              {matchPoints.map((point, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full transition-all duration-300 ${
                    point.active ? 'bg-emerald-400 scale-100' : 'bg-cyan-500/30 scale-75'
                  }`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: point.active ? '0 0 10px rgba(52, 211, 153, 0.8)' : 'none'
                  }}
                />
              ))}

              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Fingerprint className="w-5 h-5 text-cyan-400 animate-pulse" />
              <p className="text-foreground font-semibold">Scan d'empreinte digitale</p>
            </div>
            <p className="text-muted-foreground text-xs font-mono">
              ANALYSE: {fingerprintProgress.toFixed(0)}% • {matchPoints.filter(p => p.active).length}/12 points
            </p>
            <div className="w-48 h-1.5 mx-auto bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${fingerprintProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {phase === 'verifying' && (
        <div className="space-y-4">
          <div className="relative w-44 h-44 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M10,50 Q50,15 90,50 Q50,85 10,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-violet-400/60"
              />
              
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="url(#irisGradient)"
                strokeWidth="2"
                style={{ transform: `rotate(${irisRotation}deg)`, transformOrigin: '50px 50px' }}
              />

              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const innerR = 12;
                const outerR = 26;
                return (
                  <line
                    key={i}
                    x1={50 + Math.cos(angle) * innerR}
                    y1={50 + Math.sin(angle) * innerR}
                    x2={50 + Math.cos(angle) * outerR}
                    y2={50 + Math.sin(angle) * outerR}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-violet-500/40"
                    style={{ transform: `rotate(${irisRotation}deg)`, transformOrigin: '50px 50px' }}
                  />
                );
              })}

              <circle
                cx="50"
                cy="50"
                r={10 * irisScale}
                fill="#0f0f23"
                stroke="currentColor"
                strokeWidth="1"
                className="text-violet-600"
              />

              <circle cx="45" cy="45" r="3" fill="white" opacity="0.6" />
              <circle cx="55" cy="52" r="1.5" fill="white" opacity="0.4" />

              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="4 2"
                className="text-emerald-400"
                style={{ transform: `rotate(${-irisRotation * 0.5}deg)`, transformOrigin: '50px 50px' }}
              />

              <defs>
                <linearGradient id="irisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-24 h-24 rounded-full border border-emerald-500/50"
                style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
              />
            </div>

            <div className="absolute top-4 left-4 w-6 h-6">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400" />
              <div className="absolute top-0 left-0 h-full w-0.5 bg-emerald-400" />
            </div>
            <div className="absolute top-4 right-4 w-6 h-6">
              <div className="absolute top-0 right-0 w-full h-0.5 bg-emerald-400" />
              <div className="absolute top-0 right-0 h-full w-0.5 bg-emerald-400" />
            </div>
            <div className="absolute bottom-4 left-4 w-6 h-6">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400" />
              <div className="absolute bottom-0 left-0 h-full w-0.5 bg-emerald-400" />
            </div>
            <div className="absolute bottom-4 right-4 w-6 h-6">
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-emerald-400" />
              <div className="absolute bottom-0 right-0 h-full w-0.5 bg-emerald-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ScanEye className="w-5 h-5 text-violet-400 animate-pulse" />
              <p className="text-foreground font-semibold">Scan rétinien</p>
            </div>
            <p className="text-muted-foreground text-xs">Vérification de l'iris en cours...</p>
            <div className="flex justify-center gap-1">
              {['IRIS', 'RETINE', 'PUPILLE'].map((label, i) => (
                <span 
                  key={label}
                  className="px-2 py-0.5 text-[10px] rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {label} ✓
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'success' && (
        <div className="space-y-4 animate-scale-in">
          <div className="relative w-44 h-44 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 origin-bottom"
                  style={{
                    height: `${35 + Math.random() * 25}px`,
                    background: `linear-gradient(to top, transparent, ${i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#22d3ee' : '#8b5cf6'})`,
                    transform: `rotate(${i * 30}deg) translateY(-45px)`,
                    animation: 'pulse 1s ease-in-out infinite',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-full border-2 border-emerald-500/50"
                  style={{
                    width: `${70 + i * 35}px`,
                    height: `${70 + i * 35}px`,
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                    animationDelay: `${i * 0.25}s`
                  }}
                />
              </div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-emerald-500 font-bold text-xl">Identité Confirmée</p>
            <p className="text-muted-foreground text-sm">Accès autorisé • Bienvenue</p>
            <div className="flex justify-center gap-1.5 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
