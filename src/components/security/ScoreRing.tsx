import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getScoreGlow(score: number): string {
  if (score >= 80) return '0 0 20px rgba(16,185,129,0.4)';
  if (score >= 60) return '0 0 20px rgba(245,158,11,0.4)';
  if (score >= 40) return '0 0 20px rgba(249,115,22,0.4)';
  return '0 0 20px rgba(239,68,68,0.4)';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellente';
  if (score >= 60) return 'Perfectible';
  if (score >= 40) return 'Insuffisante';
  return 'Critique';
}

export function ScoreRing({ score, size = 160, strokeWidth = 10, label, className = '' }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  // Tick marks for the gauge
  const tickCount = 40;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const angle = (i / tickCount) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const innerR = radius - strokeWidth / 2 - 4;
    const outerR = radius - strokeWidth / 2 - (i % 5 === 0 ? 10 : 7);
    return {
      x1: size / 2 + Math.cos(rad) * innerR,
      y1: size / 2 + Math.sin(rad) * innerR,
      x2: size / 2 + Math.cos(rad) * outerR,
      y2: size / 2 + Math.sin(rad) * outerR,
      major: i % 5 === 0,
      active: i / tickCount <= score / 100,
    };
  });

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <svg width={size} height={size} className="-rotate-90" style={{ filter: `drop-shadow(${getScoreGlow(score)})` }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.active ? color : 'hsl(var(--muted-foreground))'}
            strokeWidth={t.major ? 1.5 : 0.8}
            opacity={t.active ? 0.8 : 0.15}
          />
        ))}
        {/* Score arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
        <motion.span
          className="text-4xl font-black text-foreground tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}
        </motion.span>
        <motion.span
          className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {label || getScoreLabel(score)}
        </motion.span>
      </div>
    </motion.div>
  );
}

// Mini score for dimension cards
export function MiniScore({ score, size = 48 }: { score: number; size?: number }) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={3} opacity={0.2} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (score / 100) * c }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-foreground">{score}</span>
    </div>
  );
}
