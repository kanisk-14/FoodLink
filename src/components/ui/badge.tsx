import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant =
  | 'default'
  | 'neutral'
  | 'olive'
  | 'terra'
  | 'active'
  | 'notice'
  | 'success'
  | 'warning'
  | 'danger'
  | 'hardware'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-mono text-[10px] uppercase tracking-wider rounded-xs border font-medium select-none';

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 leading-none text-[10px]',
    md: 'px-2 py-1 leading-none text-[11px]',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-[#f2efe7] text-[#1c1d1b] border-[#ddd9cf]',
    neutral: 'bg-white text-[#6f706a] border-[#ddd9cf]',
    olive: 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8]',
    terra: 'bg-[#f3e5de] text-[#934e35] border-[#e2cdc4]',
    active: 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8]',
    notice: 'bg-[#f3e5de] text-[#934e35] border-[#e2cdc4]',
    success: 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8]',
    warning: 'bg-[#f3e5de] text-[#934e35] border-[#e2cdc4]',
    danger: 'bg-[#f8e6e6] text-[#8e2929] border-[#e8c6c6]',
    hardware: 'bg-[#f2efe7] text-[#1c1d1b] border-[#ddd9cf]',
    outline: 'bg-transparent text-[#6f706a] border-[#ddd9cf]',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
}
