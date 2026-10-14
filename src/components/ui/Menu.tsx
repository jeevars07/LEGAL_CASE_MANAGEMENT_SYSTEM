import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/format';

export function Menu({
  trigger,
  children,
  align = 'right',
  width = 'w-52'





}: {trigger: (props: {open: boolean;toggle: () => void;}) => React.ReactNode;children: (close: () => void) => React.ReactNode;align?: 'left' | 'right';width?: string;}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      <AnimatePresence>
        {open &&
        <motion.div
          role="menu"
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'absolute z-40 mt-1.5 origin-top overflow-hidden rounded-xl border border-navy-200/80 bg-white p-1 shadow-pop',
            align === 'right' ? 'right-0' : 'left-0',
            width
          )}>
          
            {children(() => setOpen(false))}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}

export function MenuItem({
  children,
  onClick,
  icon,
  danger





}: {children: React.ReactNode;onClick?: () => void;icon?: React.ReactNode;danger?: boolean;}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors duration-150 ease-smooth',
        danger ?
        'text-red-600 hover:bg-red-50' :
        'text-navy-700 hover:bg-navy-50 hover:text-navy-900'
      )}>
      
      {icon}
      {children}
    </button>);

}

export function MenuLabel({ children }: {children: React.ReactNode;}) {
  return (
    <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-400">
      {children}
    </p>);

}