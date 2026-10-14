import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon,
  CalendarDaysIcon,
  FileTextIcon,
  ReceiptTextIcon,
  ScaleIcon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { cn, relativeTime } from '../../utils/format';

const icons = {
  hearing: CalendarDaysIcon,
  document: FileTextIcon,
  billing: ReceiptTextIcon,
  case: ScaleIcon
};

export function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-500 transition-colors duration-150 ease-smooth hover:border-navy-300 hover:text-navy-800">
        
        <BellIcon className="h-4 w-4" />
        {unread > 0 &&
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        }
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 z-40 mt-2 w-[336px] origin-top-right overflow-hidden rounded-xl border border-navy-200 bg-white shadow-pop">
          
            <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
              <p className="text-sm font-semibold text-navy-900">Notifications</p>
              <button
              onClick={markAllNotificationsRead}
              className="text-[12px] font-medium text-brand-600 transition-colors duration-150 ease-smooth hover:text-brand-700">
              
                Mark all read
              </button>
            </div>
            <ul className="scroll-slim max-h-80 divide-y divide-navy-100 overflow-y-auto">
              {notifications.slice(0, 6).map((n) => {
              const Icon = icons[n.kind];
              return (
                <li key={n.id}>
                    <button
                    onClick={() => {
                      markNotificationRead(n.id);
                      setOpen(false);
                      if (n.href) navigate(n.href);
                    }}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 ease-smooth hover:bg-navy-50/70">
                    
                      <span
                      className={cn(
                        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                        n.read ? 'bg-navy-50 text-navy-400' : 'bg-brand-50 text-brand-600'
                      )}>
                      
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-medium text-navy-900">
                            {n.title}
                          </span>
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-navy-500">
                          {n.body}
                        </span>
                        <span className="mt-1 block text-[11px] text-navy-400">
                          {relativeTime(n.at)}
                        </span>
                      </span>
                    </button>
                  </li>);

            })}
            </ul>
            <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-navy-100 bg-navy-50/60 px-4 py-2.5 text-center text-[12px] font-medium text-navy-600 transition-colors duration-150 ease-smooth hover:bg-navy-100/60">
            
              View all notifications
            </Link>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}