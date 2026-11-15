import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-[#EEEEEC] text-[#111111] border border-[#D8D8D5]',
    lime: 'bg-[#B7F34A] text-[#111111] font-semibold',
    dark: 'bg-[#111111] text-white',
    important: 'bg-[#111111] text-[#B7F34A] border border-[#B7F34A]/50 font-semibold',
    resolved: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    open: 'bg-amber-50 text-amber-800 border border-amber-200',
    verified: 'bg-[#111111] text-[#B7F34A] border border-[#B7F34A]/40'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs tracking-wide ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

