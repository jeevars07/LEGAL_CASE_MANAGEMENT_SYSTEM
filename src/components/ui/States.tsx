import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagonIcon, RotateCcwIcon, SearchXIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/format';

export function Skeleton({ className }: {className?: string;}) {
  return <div className={cn('skeleton rounded-md', className)} />;
}

export function TableSkeleton({ rows = 6, cols = 6 }: {rows?: number;cols?: number;}) {
  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) =>
        <Skeleton key={i} className="h-3 flex-1" />
        )}
      </div>
      <div className="space-y-3.5">
        {Array.from({ length: rows }).map((_, r) =>
        <div key={r} className="flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) =>
          <Skeleton key={c} className={cn('h-4 flex-1', c === 0 && 'max-w-[92px]')} />
          )}
          </div>
        )}
      </div>
    </div>);

}

export function CardSkeleton({ className }: {className?: string;}) {
  return (
    <div className={cn('rounded-xl border border-navy-200/80 bg-white p-5 shadow-card', className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-7 w-20" />
      <Skeleton className="mt-4 h-3 w-32" />
    </div>);

}

export function EmptyState({
  title,
  message,
  action,
  icon





}: {title: string;message: string;action?: React.ReactNode;icon?: React.ReactNode;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center justify-center px-6 py-14 text-center">
      
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy-200 bg-navy-50 text-navy-400">
        {icon ?? <SearchXIcon className="h-5 w-5" aria-hidden />}
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-navy-400">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>);

}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this information. Please try again.',
  onRetry




}: {title?: string;message?: string;onRetry?: () => void;}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600">
        <AlertOctagonIcon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-navy-400">{message}</p>
      {onRetry &&
      <Button className="mt-5" variant="secondary" icon={<RotateCcwIcon className="h-4 w-4" />} onClick={onRetry}>
          Try again
        </Button>
      }
    </div>);

}