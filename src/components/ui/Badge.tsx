import React from 'react';
import { cn } from '../../utils/format';

type Tone = 'green' | 'amber' | 'red' | 'blue' | 'gray';

const tones: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/15',
  blue: 'bg-brand-50 text-brand-700 ring-brand-600/15',
  gray: 'bg-navy-100 text-navy-600 ring-navy-500/15'
};

const dots: Record<Tone, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-brand-500',
  gray: 'bg-navy-400'
};

export function Badge({
  tone = 'gray',
  dot = false,
  children,
  className





}: {tone?: Tone;dot?: boolean;children: React.ReactNode;className?: string;}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        'transition-colors duration-200 ease-smooth',
        tones[tone],
        className
      )}>
      
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} aria-hidden />}
      {children}
    </span>);

}

const statusTone: Record<string, Tone> = {
  Active: 'green',
  Pending: 'amber',
  Closed: 'gray',
  Inactive: 'gray',
  Scheduled: 'blue',
  Completed: 'green',
  Adjourned: 'amber',
  Cancelled: 'red',
  Paid: 'green',
  'Partially Paid': 'blue',
  Overdue: 'red',
  Verified: 'green',
  'Pending Review': 'amber',
  'On Leave': 'amber',
  Suspended: 'red'
};

export function StatusBadge({ status, className }: {status: string;className?: string;}) {
  return (
    <Badge tone={statusTone[status] ?? 'gray'} dot className={className}>
      {status}
    </Badge>);

}

export function PriorityFlag({ priority }: {priority: 'High' | 'Medium' | 'Low';}) {
  const color =
  priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-navy-300';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-navy-500">
      <span className={cn('h-2 w-0.5 rounded-full', color)} aria-hidden />
      <span className={cn('h-2.5 w-0.5 rounded-full', priority === 'Low' ? 'bg-navy-200' : color)} aria-hidden />
      <span
        className={cn('h-3 w-0.5 rounded-full', priority === 'High' ? color : 'bg-navy-200')}
        aria-hidden />
      
      <span className="ml-0.5">{priority}</span>
    </span>);

}