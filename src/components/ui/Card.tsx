"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'blue' | 'amber';
  glow?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  color?: string;
}

export const Card = ({
  children,
  variant = 'default',
  glow = false,
  className = '',
  padding = 'md',
  color
}: CardProps) => {

  const variants = {
    default: "bg-slate-900/80 border-slate-800 shadow-xl",
    red: "bg-rose-500/5 border-rose-500/30 shadow-rose-500/10",
    blue: "bg-cyan-500/5 border-cyan-500/30 shadow-cyan-500/10",
    amber: "bg-amber-500/5 border-amber-500/30 shadow-amber-500/10"
  };

  const glows = {
    default: "shadow-[0_0_40px_rgba(30,41,59,0.2)]",
    red: "shadow-[0_0_40px_rgba(244,63,94,0.15)]",
    blue: "shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    amber: "shadow-[0_0_40px_rgba(245,158,11,0.15)]"
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8 md:p-12"
  };

  return (
    <div className={`
      relative rounded-3xl border backdrop-blur-xl 
      ${variants[variant]} 
      ${glow ? glows[variant] : ''} 
      ${paddings[padding]} 
      ${className}
    `}>
      {children}
    </div>
  );
};
