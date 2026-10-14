import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { cn } from '../../utils/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
  'bg-navy-900 text-white border border-navy-900 hover:bg-navy-800 active:bg-navy-950 shadow-card',
  secondary:
  'bg-white text-navy-800 border border-navy-200 hover:bg-navy-50 hover:border-navy-300 active:bg-navy-100 shadow-card',
  ghost: 'bg-transparent text-navy-600 border border-transparent hover:bg-navy-100/80 active:bg-navy-200/60',
  danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700 active:bg-red-800 shadow-card',
  subtle: 'bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100 active:bg-brand-200'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl'
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium whitespace-nowrap select-none',
        'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-smooth',
        'active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}>
      
      {loading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>);

}