import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terra';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Rectangular, tactile industrial button
    const base =
      'inline-flex items-center justify-center font-medium rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#536b4f] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer tracking-tight';

    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-xs px-4 py-2 gap-2 h-9',
      lg: 'text-sm px-5 py-2.5 gap-2 h-10',
    };

    const variantClasses = {
      primary:
        'bg-[#1c1d1b] text-[#f7f5ef] hover:bg-[#536b4f] hover:border-[#536b4f] active:bg-[#3f523c] border border-[#1c1d1b]',
      secondary:
        'bg-white text-[#1c1d1b] hover:bg-[#e8eee5] hover:text-[#536b4f] hover:border-[#ccd9c8] border border-[#ddd9cf]',
      outline:
        'bg-transparent text-[#1c1d1b] border border-[#ddd9cf] hover:bg-[#e8eee5] hover:text-[#536b4f] hover:border-[#ccd9c8]',
      ghost:
        'bg-transparent text-[#6f706a] hover:text-[#1c1d1b] hover:bg-[#f0ece2]',
      terra:
        'bg-[#b66a4e] text-white hover:bg-[#a25a40] border border-[#b66a4e]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(base, sizeClasses[size], variantClasses[variant], className))}
        {...props}
      >
        {isLoading && (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
