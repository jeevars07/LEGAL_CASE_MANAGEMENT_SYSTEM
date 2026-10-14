import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { cn } from '../../utils/format';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  format?: 'number' | 'currency';
  index?: number;
  emphasis?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  description,
  trend,
  format = 'number',
  index = 0,
  emphasis = false
}: StatCardProps) {
  const animated = useCountUp(value);
  const display =
  format === 'currency' ?
  `$${Math.round(animated).toLocaleString('en-US')}` :
  Math.round(animated).toLocaleString('en-US');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'group rounded-xl border bg-white p-4 shadow-card transition-[box-shadow,border-color] duration-200 ease-smooth hover:border-navy-300 hover:shadow-raised',
        emphasis ? 'border-navy-300' : 'border-navy-200/80'
      )}>
      
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-navy-500">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-500 transition-colors duration-200 ease-smooth group-hover:bg-navy-900 group-hover:text-white">
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-[26px] font-semibold leading-none tracking-[-0.02em] text-navy-900 tabular">
          {display}
        </p>
        {typeof trend === 'number' &&
        <span
          className={cn(
            'mb-0.5 inline-flex items-center gap-0.5 text-xs font-semibold',
            trend >= 0 ? 'text-emerald-600' : 'text-red-600'
          )}>
          
            {trend >= 0 ?
          <TrendingUpIcon className="h-3.5 w-3.5" aria-hidden /> :

          <TrendingDownIcon className="h-3.5 w-3.5" aria-hidden />
          }
            {Math.abs(trend)}%
          </span>
        }
      </div>
      <p className="mt-2 text-xs text-navy-400">{description}</p>
    </motion.div>);

}