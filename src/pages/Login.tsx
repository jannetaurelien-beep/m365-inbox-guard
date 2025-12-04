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
                <SecurityAnimation phase={loginPhase} />
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

// Security Animation Component - DNA Helix & Hexagonal Authentication
function SecurityAnimation({ phase }: { phase: 'idle' | 'scanning' | 'verifying' | 'success' }) {
  const [progress, setProgress] = useState(0);
  const [hexagons, setHexagons] = useState<boolean[]>(Array(7).fill(false));
  const [codeChars, setCodeChars] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (phase === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 100));
        setRotation(prev => prev + 2);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'verifying') {
      // Activate hexagons one by one
      hexagons.forEach((_, i) => {
        setTimeout(() => {
          setHexagons(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 180);
      });

      // Generate random code characters
      const chars = 'ABCDEF0123456789';
      const interval = setInterval(() => {
        setCodeChars(prev => {
          const newChar = chars[Math.floor(Math.random() * chars.length)];
          return [...prev.slice(-12), newChar];
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="text-center p-6">
      {phase === 'scanning' && (
        <div className="space-y-6">
          {/* DNA Helix Scanner */}
          <div className="relative w-44 h-44 mx-auto">
            {/* Outer rotating hexagonal frame */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 140 140"
              style={{ transform: `rotate(${rotation * 0.5}deg)` }}
            >
              <polygon
                points="70,10 120,35 120,95 70,120 20,95 20,35"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-indigo-500/40"
              />
            </svg>
            
            {/* Second rotating frame (opposite direction) */}
            <svg 
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)]" 
              viewBox="0 0 140 140"
              style={{ transform: `rotate(${-rotation * 0.3}deg)` }}
            >
              <polygon
                points="70,10 120,35 120,95 70,120 20,95 20,35"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="8 4"
                className="text-cyan-500/50"
              />
            </svg>

            {/* DNA Helix strands */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-20 h-28">
                {[...Array(8)].map((_, i) => {
                  const yPos = (i / 7) * 100;
                  const phase = (i + rotation * 0.03) * 0.9;
                  const xOffset1 = Math.sin(phase) * 28;
                  const xOffset2 = Math.sin(phase + Math.PI) * 28;
                  const scale1 = 0.6 + Math.cos(phase) * 0.4;
                  const scale2 = 0.6 + Math.cos(phase + Math.PI) * 0.4;
                  
                  return (
                    <div key={i}>
                      {/* Left strand node */}
                      <div
                        className="absolute rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 transition-all duration-100"
                        style={{
                          width: `${10 * scale1}px`,
                          height: `${10 * scale1}px`,
                          left: `calc(50% + ${xOffset1}px - ${5 * scale1}px)`,
                          top: `${yPos}%`,
                          boxShadow: `0 0 ${12 * scale1}px rgba(34, 211, 238, 0.8)`,
                          zIndex: scale1 > 0.8 ? 10 : 5
                        }}
                      />
                      {/* Right strand node */}
                      <div
                        className="absolute rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 transition-all duration-100"
                        style={{
                          width: `${10 * scale2}px`,
                          height: `${10 * scale2}px`,
                          left: `calc(50% + ${xOffset2}px - ${5 * scale2}px)`,
                          top: `${yPos}%`,
                          boxShadow: `0 0 ${12 * scale2}px rgba(139, 92, 246, 0.8)`,
                          zIndex: scale2 > 0.8 ? 10 : 5
                        }}
                      />
                      {/* Connection line */}
                      {Math.abs(xOffset1 - xOffset2) > 5 && (
                        <div
                          className="absolute h-px bg-gradient-to-r from-cyan-400/60 via-white/40 to-violet-400/60"
                          style={{
                            left: `calc(50% + ${Math.min(xOffset1, xOffset2) + 5}px)`,
                            width: `${Math.abs(xOffset1 - xOffset2) - 10}px`,
                            top: `calc(${yPos}% + 4px)`,
                            opacity: Math.min(scale1, scale2) + 0.2
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scanning pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
            
            {/* Orbiting particles */}
            {[...Array(4)].map((_, i) => {
              const angle = (rotation * 2 + i * 90) * Math.PI / 180;
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-cyan-400"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * 70}px - 4px)`,
                    top: `calc(50% + ${Math.sin(angle) * 70}px - 4px)`,
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.9), 0 0 20px rgba(34, 211, 238, 0.4)'
                  }}
                />
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-foreground font-semibold text-lg">Analyse biométrique</p>
            <p className="text-muted-foreground text-sm font-mono tracking-wider">
              SÉQUENÇAGE: {progress.toFixed(0)}%
            </p>
            <div className="w-56 h-2 mx-auto bg-muted rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{ 
                  left: `${Math.max(0, progress - 15)}%`,
                  opacity: progress < 100 ? 1 : 0
                }}
              />
            </div>
          </div>
        </div>
      )}

      {phase === 'verifying' && (
        <div className="space-y-6">
          {/* Hexagonal verification grid */}
          <div className="relative w-44 h-44 mx-auto">
            {/* Outer hexagons */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const x = 50 + Math.cos((angle - 90) * Math.PI / 180) * 38;
              const y = 50 + Math.sin((angle - 90) * Math.PI / 180) * 38;
              return (
                <div
                  key={i}
                  className={`absolute w-10 h-10 transition-all duration-500 ${
                    hexagons[i] ? 'scale-110' : 'scale-100'
                  }`}
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon
                      points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                      fill={hexagons[i] ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.1)'}
                      stroke={hexagons[i] ? '#10b981' : '#6366f1'}
                      strokeWidth="3"
                      className="transition-all duration-500"
                      style={{
                        filter: hexagons[i] ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))' : 'none'
                      }}
                    />
                  </svg>
                  {hexagons[i] && (
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-400 font-bold text-sm animate-scale-in">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}

            {/* Center hexagon with lock */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 transition-all duration-700 ${hexagons[6] ? 'scale-110' : ''}`}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                  fill={hexagons[6] ? 'rgba(16, 185, 129, 0.35)' : 'rgba(99, 102, 241, 0.2)'}
                  stroke={hexagons[6] ? '#10b981' : '#818cf8'}
                  strokeWidth="2.5"
                  className="transition-all duration-500"
                  style={{
                    filter: hexagons[6] ? 'drop-shadow(0 0 18px rgba(16, 185, 129, 0.9))' : 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.5))'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {hexagons[6] ? (
                  <Unlock className="w-7 h-7 text-emerald-400 animate-scale-in" />
                ) : (
                  <Lock className="w-7 h-7 text-indigo-400" />
                )}
              </div>
            </div>

            {/* Connection lines from center to outer hexagons */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const x1 = 50 + Math.cos((angle - 90) * Math.PI / 180) * 18;
                const y1 = 50 + Math.sin((angle - 90) * Math.PI / 180) * 18;
                const x2 = 50 + Math.cos((angle - 90) * Math.PI / 180) * 30;
                const y2 = 50 + Math.sin((angle - 90) * Math.PI / 180) * 30;
                return (
                  <line
                    key={`line-${i}`}
                    x1={`${x1}%`} y1={`${y1}%`}
                    x2={`${x2}%`} y2={`${y2}%`}
                    stroke={hexagons[i] ? '#10b981' : '#6366f180'}
                    strokeWidth="2"
                    className="transition-all duration-500"
                    style={{
                      filter: hexagons[i] ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.8))' : 'none'
                    }}
                  />
                );
              })}
            </svg>

            {/* Rotating outer ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40 animate-spin" style={{ animationDuration: '12s' }} />
          </div>

          <div className="space-y-3">
            <p className="text-foreground font-semibold text-lg">Authentification multi-facteurs</p>
            {/* Code display */}
            <div className="flex justify-center gap-1 font-mono text-sm">
              {codeChars.slice(-8).map((char, i) => (
                <span
                  key={i}
                  className="w-6 h-7 flex items-center justify-center bg-muted/80 rounded text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                  style={{ opacity: 0.4 + (i / 8) * 0.6 }}
                >
                  {char}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              {hexagons.filter(Boolean).length}/7 protocoles validés
            </p>
          </div>
        </div>
      )}

      {phase === 'success' && (
        <div className="space-y-6 animate-scale-in">
          <div className="relative w-44 h-44 mx-auto">
            {/* Success burst rays */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-12 bg-gradient-to-t from-emerald-500/80 to-transparent rounded-full"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-45px)`,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08}s`
                  }}
                />
              ))}
            </div>

            {/* Pulsing success rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-2 border-emerald-500/40 animate-ping" style={{ animationDuration: '1.5s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-emerald-400/50 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-400/40 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.4s' }} />
            </div>

            {/* Central success icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/40 to-cyan-500/40 flex items-center justify-center backdrop-blur-sm border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
              </div>
            </div>

            {/* Floating success particles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-emerald-400"
                style={{
                  left: `${25 + Math.random() * 50}%`,
                  top: `${25 + Math.random() * 50}%`,
                  animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                  animationDelay: `${i * 0.15}s`,
                  boxShadow: '0 0 8px rgba(52, 211, 153, 0.8)'
                }}
              />
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-emerald-500 dark:text-emerald-400 font-bold text-xl">Accès Autorisé</p>
            <p className="text-muted-foreground text-sm">Initialisation de votre session sécurisée...</p>
            <div className="flex justify-center gap-2 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
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