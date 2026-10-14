import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/format';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export function Tabs({
  tabs,
  active,
  onChange,
  className





}: {tabs: TabItem[];active: string;onChange: (id: string) => void;className?: string;}) {
  return (
    <div className={cn('scroll-slim -mb-px overflow-x-auto border-b border-navy-100', className)}>
      <div role="tablist" className="flex min-w-max gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-smooth',
                isActive ? 'text-navy-900' : 'text-navy-400 hover:text-navy-700'
              )}>
              
              <span className="inline-flex items-center gap-1.5">
                {tab.label}
                {typeof tab.count === 'number' &&
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular',
                    isActive ? 'bg-navy-100 text-navy-700' : 'bg-navy-50 text-navy-400'
                  )}>
                  
                    {tab.count}
                  </span>
                }
              </span>
              {isActive &&
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-navy-900"
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} />

              }
            </button>);

        })}
      </div>
    </div>);

}

export function TabPanel({ id, children }: {id: string;children: React.ReactNode;}) {
  return (
    <motion.div
      key={id}
      role="tabpanel"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
      
      {children}
    </motion.div>);

}