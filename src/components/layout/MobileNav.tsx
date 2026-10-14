import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BriefcaseIcon, CalendarDaysIcon, FilesIcon, LayoutDashboardIcon, UsersIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { cn } from '../../utils/format';

export function MobileNav() {
  const { pathname } = useLocation();
  const { currentUser } = useApp();
  const role = currentUser?.role ?? 'admin';

  const items = [
  { label: 'Home', to: '/', icon: LayoutDashboardIcon },
  { label: role === 'admin' ? 'Cases' : 'My Cases', to: '/cases', icon: BriefcaseIcon },
  { label: 'Hearings', to: '/hearings/upcoming', icon: CalendarDaysIcon },
  { label: 'Docs', to: '/documents', icon: FilesIcon },
  ...(role === 'admin' || role === 'clerk' ?
  [{ label: 'Clients', to: '/clients', icon: UsersIcon }] :
  [])];


  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-navy-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      
      {items.map((item) => {
        const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-150 ease-smooth',
              active ? 'text-navy-900' : 'text-navy-400'
            )}>
            
            <item.icon className={cn('h-5 w-5', active && 'text-brand-600')} aria-hidden />
            {item.label}
          </Link>);

      })}
    </nav>);

}