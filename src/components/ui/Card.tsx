import React from 'react';
import { cn } from '../../utils/format';

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn('rounded-xl border border-navy-200/80 bg-white shadow-card', className)}>
      
      {children}
    </div>);

}

export function CardHeader({
  title,
  description,
  action,
  className





}: {title: string;description?: string;action?: React.ReactNode;className?: string;}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-navy-100 px-5 py-4',
        className
      )}>
      
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-navy-900">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-navy-400">{description}</p>}
      </div>
      {action}
    </div>);

}

export function Divider({ className }: {className?: string;}) {
  return <div className={cn('h-px w-full bg-navy-100', className)} />;
}

export function KeyValue({
  label,
  children,
  className




}: {label: string;children: React.ReactNode;className?: string;}) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">{label}</dt>
      <dd className="mt-1 text-sm text-navy-800">{children}</dd>
    </div>);

}