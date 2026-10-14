import React from 'react';
import { cn, initials } from '../../utils/format';

const palette = [
'bg-navy-100 text-navy-700',
'bg-brand-50 text-brand-700',
'bg-emerald-50 text-emerald-700',
'bg-amber-50 text-amber-700',
'bg-navy-800 text-white'];


function hash(name: string): number {
  return name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export function Avatar({
  name,
  size = 'md',
  className




}: {name: string;size?: 'xs' | 'sm' | 'md' | 'lg';className?: string;}) {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-14 w-14 text-base'
  };
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-inset ring-navy-900/5',
        palette[hash(name) % palette.length],
        sizes[size],
        className
      )}>
      
      {initials(name)}
    </span>);

}