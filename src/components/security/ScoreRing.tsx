import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'hsl(var(--accent))';
  if (score >= 60) return 'hsl(var(--warning, 45 93% 47%))';
  if (score >= 40) return 'hsl(30 100% 50%)';
  return 'hsl(var(--destructive))';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellente';
  if (score >= 60) return 'Perfectible';
  if (score >= 40) return 'Insuffisante';
  return 'Critique';
}

export function ScoreRing({ score, size = 160, strokeWidth = 12, label, className = '' }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
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
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">{label || getScoreLabel(score)}</span>
      </div>
    </div>
  );
}
