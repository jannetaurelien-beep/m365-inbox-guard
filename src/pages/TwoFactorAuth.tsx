import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  QrCode,
  Mail,
  Building2,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Smartphone,
  Lock,
  Sparkles,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AuthMethod = "select" | "qrcode" | "email" | "sso";
type VerifyPhase = "idle" | "verifying" | "success" | "error";

const TwoFactorAuth = () => {
  const [method, setMethod] = useState<AuthMethod>("select");
  const [verifyPhase, setVerifyPhase] = useState<VerifyPhase>("idle");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Countdown timer for email code
  useEffect(() => {
    if (method === "email" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) setCanResend(true);
  }, [method, timer]);

  // QR Code animation
  const [qrRevealed, setQrRevealed] = useState(false);
  useEffect(() => {
    if (method === "qrcode") {
      setTimeout(() => setQrRevealed(true), 600);
    }
  }, [method]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otpCode.join("");
    if (code.length < 6) {
      toast({ title: "Code incomplet", description: "Veuillez saisir les 6 chiffres", variant: "destructive" });
      return;
    }
    setVerifyPhase("verifying");
    await new Promise((r) => setTimeout(r, 2000));
    setVerifyPhase("success");
    await new Promise((r) => setTimeout(r, 1500));
    toast({ title: "Authentification réussie", description: "Double vérification confirmée" });
    navigate("/");
  };

  const handleSSOLogin = async () => {
    setVerifyPhase("verifying");
    await new Promise((r) => setTimeout(r, 2500));
    setVerifyPhase("success");
    await new Promise((r) => setTimeout(r, 1500));
    toast({ title: "SSO Microsoft validé", description: "Connexion via Azure Active Directory réussie" });
    navigate("/");
  };

  const handleResendCode = () => {
    setTimer(30);
    setCanResend(false);
    setOtpCode(["", "", "", "", "", ""]);
    toast({ title: "Code renvoyé", description: "Un nouveau code a été envoyé à votre adresse e-mail" });
  };

  const backupCode = "MFPRO-7X9K2-BN4QW";
  const handleCopyBackup = () => {
    navigator.clipboard.writeText(backupCode);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Orbs */}
      <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 dark:bg-violet-500/8 rounded-full blur-[120px]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/20 dark:bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main */}
      <div className="w-full max-w-lg px-4 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 shadow-2xl shadow-indigo-500/30 mb-4 relative">
            <ShieldCheck className="w-10 h-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <Lock className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Double Authentification</h1>
          <p className="text-muted-foreground text-sm">Vérification de sécurité supplémentaire requise</p>
        </motion.div>

        {/* Verification overlay */}
        <AnimatePresence>
          {verifyPhase !== "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
            >
              {verifyPhase === "verifying" && <VerifyingAnimation />}
              {verifyPhase === "success" && <SuccessAnimation />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {method === "select" && (
                  <MethodSelector key="select" onSelect={setMethod} />
                )}
                {method === "qrcode" && (
                  <QRCodeMethod
                    key="qrcode"
                    revealed={qrRevealed}
                    otpCode={otpCode}
                    inputRefs={inputRefs}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                    onVerify={handleVerify}
                    onBack={() => { setMethod("select"); setOtpCode(["","","","","",""]); setQrRevealed(false); }}
                    backupCode={backupCode}
                    copiedBackup={copiedBackup}
                    onCopyBackup={handleCopyBackup}
                  />
                )}
                {method === "email" && (
                  <EmailCodeMethod
                    key="email"
                    otpCode={otpCode}
                    inputRefs={inputRefs}
                    timer={timer}
                    canResend={canResend}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                    onVerify={handleVerify}
                    onResend={handleResendCode}
                    onBack={() => { setMethod("select"); setOtpCode(["","","","","",""]); setTimer(30); setCanResend(false); }}
                  />
                )}
                {method === "sso" && (
                  <SSOMethod
                    key="sso"
                    onLogin={handleSSOLogin}
                    onBack={() => setMethod("select")}
                  />
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <span>Chiffrement AES-256</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>TOTP RFC 6238</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>Zero Trust</span>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Method Selector ────────────────────────────────────────────
function MethodSelector({ onSelect }: { onSelect: (m: AuthMethod) => void }) {
  const methods = [
    {
      id: "qrcode" as AuthMethod,
      icon: QrCode,
      title: "Application Authenticator",
      desc: "Scannez le QR code avec Google Authenticator, Microsoft Authenticator ou Authy",
      gradient: "from-violet-500 to-indigo-600",
      shadow: "shadow-violet-500/20",
      badge: "Recommandé",
    },
    {
      id: "email" as AuthMethod,
      icon: Mail,
      title: "Code par e-mail",
      desc: "Recevez un code de vérification à 6 chiffres sur votre adresse e-mail",
      gradient: "from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-500/20",
      badge: null,
    },
    {
      id: "sso" as AuthMethod,
      icon: Building2,
      title: "SSO Microsoft Azure AD",
      desc: "Authentification unique via votre compte professionnel Microsoft 365",
      gradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/20",
      badge: "Entreprise",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-4"
    >
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-3">
          <Sparkles className="w-3 h-3" />
          Étape 2 sur 2
        </div>
        <h2 className="text-lg font-semibold text-foreground">Choisissez votre méthode</h2>
        <p className="text-sm text-muted-foreground mt-1">Sélectionnez votre méthode de vérification préférée</p>
      </div>

      <div className="space-y-3">
        {methods.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(m.id)}
            className={`w-full group relative flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-border transition-all duration-300 text-left ${m.shadow}`}
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <m.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">{m.title}</span>
                {m.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.badge === "Recommandé"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  }`}>
                    {m.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{m.desc}</p>
            </div>
            <div className="flex-shrink-0 self-center text-muted-foreground/40 group-hover:text-foreground/60 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-center">
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3 h-3" />
          Retour à la connexion
        </button>
      </div>
    </motion.div>
  );
}

// ─── QR Code Method ─────────────────────────────────────────────
function QRCodeMethod({
  revealed, otpCode, inputRefs, onOtpChange, onOtpKeyDown, onVerify, onBack, backupCode, copiedBackup, onCopyBackup,
}: {
  revealed: boolean;
  otpCode: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (i: number, v: string) => void;
  onOtpKeyDown: (i: number, e: React.KeyboardEvent) => void;
  onVerify: () => void;
  onBack: () => void;
  backupCode: string;
  copiedBackup: boolean;
  onCopyBackup: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-5"
    >
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {/* QR Code */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold text-foreground">Scanner le QR Code</h3>
        </div>

        <div className="relative mx-auto w-52 h-52 mb-4">
          {/* QR frame */}
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-violet-500/30 animate-pulse" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: revealed ? 1 : 0.5, opacity: revealed ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute inset-3 rounded-xl bg-white p-3 shadow-xl"
          >
            {/* Simulated QR Code pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Corner squares */}
              <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="#4F46E5" strokeWidth="4" />
              <rect x="10" y="10" width="15" height="15" rx="1" fill="#4F46E5" />
              <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="#4F46E5" strokeWidth="4" />
              <rect x="75" y="10" width="15" height="15" rx="1" fill="#4F46E5" />
              <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="#4F46E5" strokeWidth="4" />
              <rect x="10" y="75" width="15" height="15" rx="1" fill="#4F46E5" />
              {/* Data modules */}
              {[
                [35,5],[40,5],[50,5],[55,5],[60,5],
                [35,10],[45,10],[55,10],[65,10],
                [35,15],[40,15],[50,15],[60,15],
                [5,35],[10,35],[15,35],[25,35],[35,35],[45,35],[55,35],[65,35],[75,35],[85,35],[90,35],
                [5,40],[20,40],[30,40],[40,40],[50,40],[60,40],[70,40],[80,40],[90,40],
                [5,45],[15,45],[25,45],[35,45],[45,45],[55,45],[65,45],[75,45],[85,45],
                [5,50],[10,50],[20,50],[35,50],[45,50],[50,50],[60,50],[70,50],[80,50],[90,50],
                [5,55],[15,55],[25,55],[40,55],[55,55],[65,55],[75,55],[85,55],[90,55],
                [5,60],[10,60],[20,60],[30,60],[45,60],[55,60],[70,60],[80,60],[90,60],
                [5,65],[15,65],[25,65],[35,65],[50,65],[60,65],[65,65],[75,65],[85,65],[90,65],
                [35,70],[40,70],[50,70],[55,70],[65,70],[75,70],[85,70],[90,70],
                [35,75],[45,75],[55,75],[60,75],[70,75],[80,75],
                [35,80],[40,80],[50,80],[65,80],[75,80],[85,80],[90,80],
                [35,85],[45,85],[55,85],[60,85],[70,85],[80,85],[90,85],
                [35,90],[40,90],[50,90],[55,90],[65,90],[85,90],
              ].map(([x, y], i) => (
                <motion.rect
                  key={i}
                  x={x}
                  y={y}
                  width="4"
                  height="4"
                  rx="0.5"
                  fill="#4F46E5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.003 }}
                />
              ))}
              {/* Center logo */}
              <rect x="40" y="40" width="20" height="20" rx="4" fill="white" />
              <rect x="42" y="42" width="16" height="16" rx="3" fill="url(#qrCenterGrad)" />
              <defs>
                <linearGradient id="qrCenterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          {/* Scan line */}
          {!revealed && (
            <motion.div
              animate={{ y: [0, 180, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
              style={{ boxShadow: "0 0 15px rgba(139, 92, 246, 0.6)" }}
            />
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-1">
          Scannez avec <span className="font-medium text-foreground">Microsoft Authenticator</span> ou <span className="font-medium text-foreground">Google Authenticator</span>
        </p>
      </div>

      {/* OTP Input */}
      <div>
        <p className="text-sm text-foreground font-medium text-center mb-3">Entrez le code à 6 chiffres</p>
        <OTPInputGroup otpCode={otpCode} inputRefs={inputRefs} onOtpChange={onOtpChange} onOtpKeyDown={onOtpKeyDown} />
      </div>

      {/* Backup code */}
      <div className="bg-muted/50 rounded-xl p-3 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">Code de secours</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{backupCode}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCopyBackup} className="h-8 px-2">
            {copiedBackup ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Button
        onClick={onVerify}
        className="w-full h-11 font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02]"
      >
        <ShieldCheck className="w-4 h-4 mr-2" />
        Vérifier le code
      </Button>
    </motion.div>
  );
}

// ─── Email Code Method ──────────────────────────────────────────
function EmailCodeMethod({
  otpCode, inputRefs, timer, canResend, onOtpChange, onOtpKeyDown, onVerify, onResend, onBack,
}: {
  otpCode: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  timer: number;
  canResend: boolean;
  onOtpChange: (i: number, v: string) => void;
  onOtpKeyDown: (i: number, e: React.KeyboardEvent) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-5"
    >
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {/* Email animation */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30 mb-4 relative"
        >
          <Mail className="w-10 h-10 text-white" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
          >
            <span className="text-white text-[10px] font-bold">1</span>
          </motion.div>
        </motion.div>

        <h3 className="font-semibold text-foreground mb-1">Code envoyé par e-mail</h3>
        <p className="text-xs text-muted-foreground">
          Un code de vérification a été envoyé à{" "}
          <span className="font-medium text-foreground">a****@entreprise.com</span>
        </p>
      </div>

      {/* OTP */}
      <div>
        <p className="text-sm text-foreground font-medium text-center mb-3">Saisissez le code reçu</p>
        <OTPInputGroup otpCode={otpCode} inputRefs={inputRefs} onOtpChange={onOtpChange} onOtpKeyDown={onOtpKeyDown} />
      </div>

      {/* Timer / Resend */}
      <div className="text-center">
        {canResend ? (
          <button onClick={onResend} className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 mx-auto">
            <RefreshCw className="w-3.5 h-3.5" />
            Renvoyer le code
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity={0.15} />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={88}
                  strokeDashoffset={88 - (88 * timer) / 30}
                  className="text-cyan-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">{timer}</span>
            </div>
            <span>Renvoyer dans {timer}s</span>
          </div>
        )}
      </div>

      <Button
        onClick={onVerify}
        className="w-full h-11 font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02]"
      >
        <ShieldCheck className="w-4 h-4 mr-2" />
        Vérifier le code
      </Button>
    </motion.div>
  );
}

// ─── SSO Microsoft ──────────────────────────────────────────────
function SSOMethod({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-5"
    >
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 mb-2"
        >
          <Building2 className="w-10 h-10 text-white" />
        </motion.div>

        <div>
          <h3 className="font-semibold text-foreground mb-1">Microsoft Azure AD</h3>
          <p className="text-xs text-muted-foreground">Authentification unique via votre organisation</p>
        </div>

        {/* Microsoft Logo Button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button
            onClick={onLogin}
            className="w-full h-12 font-semibold bg-white dark:bg-slate-800 text-foreground border border-border hover:bg-muted/80 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] gap-3"
            variant="outline"
          >
            {/* Microsoft logo */}
            <svg viewBox="0 0 21 21" className="w-5 h-5 flex-shrink-0">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            Se connecter avec Microsoft
          </Button>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {[
            { icon: Shield, label: "Azure AD", desc: "Directory sécurisé" },
            { icon: KeyRound, label: "SSO", desc: "Single Sign-On" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-muted/40 rounded-xl p-3 border border-border/40"
            >
              <item.icon className="w-4 h-4 text-blue-500 mb-1.5 mx-auto" />
              <p className="text-xs font-semibold text-foreground">{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground text-left leading-relaxed">
              Une notification push sera envoyée sur votre application <span className="font-medium text-foreground">Microsoft Authenticator</span> pour confirmer l'accès.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shared OTP Input ───────────────────────────────────────────
function OTPInputGroup({
  otpCode, inputRefs, onOtpChange, onOtpKeyDown,
}: {
  otpCode: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (i: number, v: string) => void;
  onOtpKeyDown: (i: number, e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      {otpCode.map((digit, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
          <Input
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onOtpChange(i, e.target.value)}
            onKeyDown={(e) => onOtpKeyDown(i, e)}
            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all duration-200 bg-muted/30 ${
              digit
                ? "border-indigo-500/60 shadow-md shadow-indigo-500/10"
                : "border-border/60 hover:border-border"
            } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`}
          />
          {i === 2 && <div className="flex items-center justify-center mt-2"><div className="w-2 h-0.5 bg-muted-foreground/30 rounded" /></div>}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Verifying Animation ────────────────────────────────────────
function VerifyingAnimation() {
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
      <div className="relative w-32 h-32 mx-auto">
        {/* Rotating rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: i === 0 ? "hsl(var(--primary))" : i === 1 ? "rgb(139, 92, 246)" : "rgb(6, 182, 212)",
              inset: `${i * 10}px`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">Vérification en cours</p>
        <p className="text-sm text-muted-foreground mt-1">Validation du jeton d'authentification...</p>
      </div>
    </motion.div>
  );
}

// ─── Success Animation ──────────────────────────────────────────
function SuccessAnimation() {
  return (
    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="text-center space-y-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40"
      >
        <CheckCircle2 className="w-14 h-14 text-white" />
      </motion.div>
      <div>
        <p className="text-xl font-bold text-foreground">Identité confirmée</p>
        <p className="text-sm text-muted-foreground mt-1">Redirection vers votre espace sécurisé...</p>
      </div>
    </motion.div>
  );
}

export default TwoFactorAuth;
