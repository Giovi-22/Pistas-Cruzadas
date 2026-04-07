"use client";

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'blue' | 'amber' | 'neutral' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
  color?: string;
}

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'sm',
  glow = false,
  className = '',
  color
}: BadgeProps) => {

  const variants = {
    red: "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold",
    blue: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold",
    neutral: "bg-slate-800 border-slate-700 text-slate-400 font-bold uppercase tracking-widest",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <div className={`
      relative inline-flex items-center justify-center rounded-full border overflow-hidden
      ${!color ? variants[variant] : ''}
      ${sizes[size]}
      ${glow ? 'shadow-[0_0_10px_currentColor]' : ''}
      ${className}
    `}
      style={color ? { backgroundColor: `${color}22`, color: color, borderColor: `${color}44` } : {}}
    >
      {glow && (
        <div 
          className="absolute inset-0 blur-xl opacity-20 pointer-events-none" 
          style={color ? { backgroundColor: color } : {}}
        />
      )}
      <span className="relative z-10">{children}</span>
    </div>
  );
};
