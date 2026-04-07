"use client";

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  forceUppercase?: boolean;
}

export const Input = ({
  label,
  error,
  forceUppercase = false,
  className = '',
  onChange,
  ...props
}: InputProps) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (forceUppercase) {
      e.target.value = e.target.value.toUpperCase();
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      {label && (
        <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">
          {label}
        </span>
      )}
      <input
        className={`
          bg-slate-900 border-2 border-slate-800 rounded-xl px-6 py-4 
          text-white text-lg font-bold
          focus:outline-none focus:border-blue-500 focus:bg-slate-800 
          transition-all placeholder:text-slate-600
          ${forceUppercase ? 'uppercase' : ''}
          ${className}
        `}
        onChange={handleInputChange}
        {...props}
      />
      {error && <span className="text-rose-500 text-sm font-semibold">{error}</span>}
    </div>
  );
};
