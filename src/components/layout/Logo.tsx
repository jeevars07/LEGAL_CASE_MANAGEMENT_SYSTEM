import React from 'react';
import { cn } from '../../utils/format';

export function LogoMark({ className }: {className?: string;}) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/15',
        className
      )}
      aria-hidden>
      
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M7 21h10" />
        <path d="M4 7h16" />
        <path d="M4 7l-2 5a3.5 3.5 0 0 0 4 0z" />
        <path d="M20 7l2 5a3.5 3.5 0 0 1-4 0z" />
      </svg>
    </span>);

}

export function LogoMarkDark({ className }: {className?: string;}) {
  return (
    <span
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900',
        className
      )}
      aria-hidden>
      
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M7 21h10" />
        <path d="M4 7h16" />
        <path d="M4 7l-2 5a3.5 3.5 0 0 0 4 0z" />
        <path d="M20 7l2 5a3.5 3.5 0 0 1-4 0z" />
      </svg>
    </span>);

}