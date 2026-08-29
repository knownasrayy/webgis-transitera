'use client';

import React from 'react';

interface DiamondGaugeProps {
  score: number;
  maxScore?: number;
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number, max: number): { fill: string; text: string; glow: string } {
  const pct = (score / max) * 100;
  if (pct >= 80) return { fill: '#10b981', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' };
  if (pct >= 60) return { fill: '#f59e0b', text: 'text-brand-teal', glow: 'shadow-amber-500/20' };
  if (pct >= 40) return { fill: '#ff7c00', text: 'text-brand-lime', glow: 'shadow-brand-lime/20' };
  return { fill: '#ef4444', text: 'text-red-400', glow: 'shadow-red-500/20' };
}

function getScoreLabel(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return 'Excellent';
  if (pct >= 60) return 'Good';
  if (pct >= 40) return 'Fair';
  return 'Critical';
}

export const DiamondGauge: React.FC<DiamondGaugeProps> = ({
  score,
  maxScore = 100,
  label,
  sublabel,
  size = 'md',
}) => {
  const pct = Math.min(score / maxScore, 1);
  const colors = getScoreColor(score, maxScore);
  const statusLabel = getScoreLabel(score, maxScore);

  const sizes = {
    sm: { outer: 80, inner: 60, fontScore: 'text-lg', fontLabel: 'text-[8px]' },
    md: { outer: 120, inner: 92, fontScore: 'text-2xl', fontLabel: 'text-[10px]' },
    lg: { outer: 160, inner: 124, fontScore: 'text-4xl', fontLabel: 'text-xs' },
  };

  const s = sizes[size];
  const r = s.inner / 2 - 4;
  const cx = s.inner / 2;
  const cy = s.inner / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Diamond Container */}
      <div
        className={`relative ${colors.glow} ${size === 'lg' ? 'my-8' : size === 'md' ? 'my-6' : 'my-4'}`}
        style={{ width: s.outer, height: s.outer }}
      >
        {/* Rotated diamond background */}
        <div
          className="absolute inset-2 rounded-xl border border-slate-700/60"
          style={{
            transform: 'rotate(45deg)',
            background: `linear-gradient(135deg, rgba(13,19,33,0.9) 0%, rgba(13,19,33,0.7) 100%)`,
          }}
        />

        {/* Score ring (SVG inside the diamond) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width={s.inner} height={s.inner} className="-rotate-90">
            {/* Background circle */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="rgba(51,65,85,0.4)"
              strokeWidth={3}
            />
            {/* Score arc */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={colors.fill}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
        </div>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black ${s.fontScore} ${colors.text} tabular-nums tracking-tight`}>
            {score}
          </span>
        </div>
      </div>

      {/* Labels below gauge */}
      <div className="text-center">
        {label && (
          <div className={`${s.fontLabel} font-bold ${colors.text} uppercase tracking-wider`}>
            {statusLabel}
          </div>
        )}
        {sublabel && (
          <div className="text-[10px] text-slate-500 mt-0.5 max-w-[160px] leading-tight">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

