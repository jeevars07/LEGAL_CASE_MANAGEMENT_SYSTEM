import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/format';

export function Tooltip({
  label,
  children,
  side = 'top'




}: {label: string;children: React.ReactNode;side?: 'top' | 'bottom' | 'right';}) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}>
      
      {children}
      <AnimatePresence>
        {show &&
        <motion.span
          role="tooltip"
          initial={{ opacity: 0, y: side === 'bottom' ? -3 : 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.13, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-navy-900 px-2 py-1 text-[11px] font-medium text-white shadow-raised',
            side === 'top' && 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
            side === 'bottom' && 'left-1/2 top-full mt-1.5 -translate-x-1/2',
            side === 'right' && 'left-full top-1/2 ml-2 -translate-y-1/2'
          )}>
          
            {label}
          </motion.span>
        }
      </AnimatePresence>
    </span>);

}