import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Lock, Mail, KeyRound, Eye, EyeOff, Fingerprint, Zap, ShieldCheck } from "lucide-react";
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

    // Phase 1: Scanning
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoginPhase('verifying');

    // Phase 2: Verifying
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoginPhase('success');

    // Phase 3: Success
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
                <QuantumAuthAnimation phase={loginPhase} />
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

// Quantum Authentication Animation - Neural Network Style
function QuantumAuthAnimation({ phase }: { phase: 'idle' | 'scanning' | 'verifying' | 'success' }) {
  const [progress, setProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [dataPackets, setDataPackets] = useState<{id: number, from: number, to: number, progress: number}[]>([]);
  const [encryptionText, setEncryptionText] = useState('');

  // Neural network nodes positions (arranged in layers)
  const nodes = [
    // Layer 1 (left)
    { x: 15, y: 25, layer: 0 },
    { x: 15, y: 50, layer: 0 },
    { x: 15, y: 75, layer: 0 },
    // Layer 2 (middle-left)
    { x: 35, y: 20, layer: 1 },
    { x: 35, y: 40, layer: 1 },
    { x: 35, y: 60, layer: 1 },
    { x: 35, y: 80, layer: 1 },
    // Layer 3 (middle-right)
    { x: 65, y: 25, layer: 2 },
    { x: 65, y: 50, layer: 2 },
    { x: 65, y: 75, layer: 2 },
    // Layer 4 (right - output)
    { x: 85, y: 50, layer: 3 },
  ];

  // Connections between nodes
  const connections = [
    [0, 3], [0, 4], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5], [2, 6],
    [3, 7], [3, 8], [4, 7], [4, 8], [4, 9], [5, 8], [5, 9], [6, 8], [6, 9],
    [7, 10], [8, 10], [9, 10]
  ];

  useEffect(() => {
    if (phase === 'scanning') {
      // Animate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.8, 100));
      }, 20);

      // Activate nodes sequentially
      nodes.forEach((_, i) => {
        setTimeout(() => {
          setActiveNodes(prev => [...prev, i]);
        }, i * 100);
      });

      // Generate data packets flowing through network
      let packetId = 0;
      const packetInterval = setInterval(() => {
        const randomConnection = connections[Math.floor(Math.random() * connections.length)];
        setDataPackets(prev => [...prev.slice(-8), { 
          id: packetId++, 
          from: randomConnection[0], 
          to: randomConnection[1], 
          progress: 0 
        }]);
      }, 150);

      // Animate packets
      const animatePackets = setInterval(() => {
        setDataPackets(prev => 
          prev.map(p => ({ ...p, progress: Math.min(p.progress + 8, 100) }))
            .filter(p => p.progress < 100)
        );
      }, 30);

      return () => {
        clearInterval(progressInterval);
        clearInterval(packetInterval);
        clearInterval(animatePackets);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'verifying') {
      const chars = 'ABCDEF0123456789αβγδεζηθ';
      const interval = setInterval(() => {
        let text = '';
        for (let i = 0; i < 32; i++) {
          text += chars[Math.floor(Math.random() * chars.length)];
        }
        setEncryptionText(text);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="text-center p-4 w-full max-w-xs">
      {phase === 'scanning' && (
        <div className="space-y-4">
          {/* Neural Network Visualization */}
          <div className="relative w-56 h-44 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background glow */}
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.8)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                </radialGradient>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
                  <stop offset="50%" stopColor="rgba(34, 211, 238, 0.6)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0.2)" />
                </linearGradient>
              </defs>

              {/* Draw connections */}
              {connections.map(([from, to], i) => {
                const fromNode = nodes[from];
                const toNode = nodes[to];
                const isActive = activeNodes.includes(from) && activeNodes.includes(to);
                return (
                  <line
                    key={`conn-${i}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isActive ? "url(#connectionGradient)" : "rgba(99, 102, 241, 0.1)"}
                    strokeWidth={isActive ? "0.8" : "0.3"}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Draw data packets */}
              {dataPackets.map(packet => {
                const fromNode = nodes[packet.from];
                const toNode = nodes[packet.to];
                const x = fromNode.x + (toNode.x - fromNode.x) * (packet.progress / 100);
                const y = fromNode.y + (toNode.y - fromNode.y) * (packet.progress / 100);
                return (
                  <circle
                    key={`packet-${packet.id}`}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="#22d3ee"
                    className="drop-shadow-[0_0_4px_rgba(34,211,238,1)]"
                  />
                );
              })}

              {/* Draw nodes */}
              {nodes.map((node, i) => {
                const isActive = activeNodes.includes(i);
                const isOutput = i === nodes.length - 1;
                return (
                  <g key={`node-${i}`}>
                    {isActive && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isOutput ? "6" : "4"}
                        fill="url(#nodeGlow)"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isOutput ? "4" : "2.5"}
                      fill={isActive ? (isOutput ? "#8b5cf6" : "#6366f1") : "#1e1b4b"}
                      stroke={isActive ? "#22d3ee" : "#4f46e5"}
                      strokeWidth="0.5"
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central fingerprint icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm border border-indigo-500/30">
                <Fingerprint className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>

            {/* Scanning ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-32 h-32 rounded-full border-2 border-cyan-500/40"
                style={{
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-foreground font-semibold">Analyse du réseau neuronal</p>
            <p className="text-muted-foreground text-xs font-mono">
              DEEP SCAN: {progress.toFixed(0)}%
            </p>
            <div className="w-48 h-1.5 mx-auto bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {phase === 'verifying' && (
        <div className="space-y-4">
          {/* Encryption visualization */}
          <div className="relative w-56 h-44 mx-auto">
            {/* Rotating rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-40 h-40 rounded-full border border-dashed border-violet-500/50"
                style={{ animation: 'spin 8s linear infinite' }}
              />
              <div 
                className="absolute w-32 h-32 rounded-full border border-dotted border-cyan-500/50"
                style={{ animation: 'spin 6s linear infinite reverse' }}
              />
              <div 
                className="absolute w-24 h-24 rounded-full border border-indigo-500/50"
                style={{ animation: 'spin 4s linear infinite' }}
              />
            </div>

            {/* Central lock with energy field */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Energy pulses */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 w-16 h-16 rounded-full border-2 border-emerald-500/40"
                    style={{
                      animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/30 to-emerald-600/30 flex items-center justify-center backdrop-blur-md border border-emerald-500/50 shadow-lg shadow-emerald-500/20">
                  <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Floating encryption symbols */}
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const radius = 75;
              return (
                <div
                  key={i}
                  className="absolute text-xs font-mono text-cyan-400/60"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * radius}px - 8px)`,
                    top: `calc(50% + ${Math.sin(angle) * radius}px - 8px)`,
                    animation: `pulse 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  {['α', 'β', 'γ', 'δ', 'ε', 'ζ'][i]}
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-foreground font-semibold">Chiffrement quantique</p>
            <div className="font-mono text-[10px] text-emerald-500/80 tracking-widest break-all h-6 overflow-hidden px-4">
              {encryptionText}
            </div>
            <div className="flex justify-center gap-1">
              {['AES-256', 'RSA-4096', 'SHA-3'].map((protocol, i) => (
                <span 
                  key={protocol}
                  className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  style={{ animation: `pulse 1s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                >
                  {protocol}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'success' && (
        <div className="space-y-4 animate-scale-in">
          <div className="relative w-56 h-44 mx-auto">
            {/* Success celebration */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Starburst rays */}
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 origin-bottom"
                  style={{
                    height: `${40 + Math.random() * 30}px`,
                    background: `linear-gradient(to top, transparent, ${i % 2 === 0 ? '#10b981' : '#22d3ee'})`,
                    transform: `rotate(${i * 22.5}deg) translateY(-50px)`,
                    animation: 'pulse 1s ease-in-out infinite',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>

            {/* Success ripples */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="rounded-full border-2 border-emerald-500/50"
                  style={{
                    width: `${80 + i * 40}px`,
                    height: `${80 + i * 40}px`,
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              </div>
            ))}

            {/* Central success badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-bounce" style={{ animationDuration: '1s' }}>
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  background: ['#10b981', '#22d3ee', '#8b5cf6', '#f59e0b'][i % 4],
                  animation: `ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite`,
                  animationDelay: `${Math.random()}s`
                }}
              />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-emerald-500 font-bold text-xl">Accès Autorisé</p>
            <p className="text-muted-foreground text-sm">Bienvenue dans votre espace sécurisé</p>
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
