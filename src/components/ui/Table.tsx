import React from 'react';
import { cn } from '../../utils/format';

export function TableWrap({ children, className }: {children: React.ReactNode;className?: string;}) {
  return (
    <div className={cn('w-full overflow-x-auto scroll-slim', className)}>
      <table className="w-full min-w-[720px] border-collapse text-sm">{children}</table>
    </div>);

}

export function THead({ children }: {children: React.ReactNode;}) {
  return (
    <thead className="bg-navy-50/70">
      <tr>{children}</tr>
    </thead>);

}

export function TH({
  children,
  className,
  align = 'left'




}: {children?: React.ReactNode;className?: string;align?: 'left' | 'right' | 'center';}) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap border-b border-navy-100 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}>
      
      {children}
    </th>);

}

export function TBody({ children }: {children: React.ReactNode;}) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  onClick,
  className




}: {children: React.ReactNode;onClick?: () => void;className?: string;}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-navy-100/80 transition-colors duration-150 ease-smooth last:border-0',
        onClick && 'cursor-pointer hover:bg-navy-50/70',
        !onClick && 'hover:bg-navy-50/40',
        className
      )}>
      
      {children}
    </tr>);

}

export function TD({
  children,
  className,
  align = 'left',
  colSpan





}: {children?: React.ReactNode;className?: string;align?: 'left' | 'right' | 'center';colSpan?: number;}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        'px-4 py-3 align-middle text-navy-700',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}>
      
      {children}
    </td>);

}