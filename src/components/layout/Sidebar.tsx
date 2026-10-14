import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon,
  ChevronsLeftIcon,
  HelpCircleIcon,
  LogOutIcon,
  PanelLeftIcon } from
'lucide-react';
import { navForRole } from './navigation';
import { LogoMark } from './Logo';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import { useApp } from '../../contexts/AppContext';
import { cn } from '../../utils/format';
import { roleLabel } from '../../utils/selectors';

function useIsActive() {
  const location = useLocation();
  return (to: string) => {
    const [path, query] = to.split('?');
    if (query) return location.pathname === path && location.search === `?${query}`;
    if (path === '/') return location.pathname === '/';
    return (
      location.pathname === path && location.search === '' ||
      location.pathname.startsWith(`${path}/`));

  };
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile





}: {collapsed: boolean;onToggle: () => void;mobileOpen: boolean;onCloseMobile: () => void;}) {
  const { currentUser, logout, notifications } = useApp();
  const navigate = useNavigate();
  const isActive = useIsActive();
  const groups = navForRole(currentUser?.role ?? 'admin');
  const unread = notifications.filter((n) => !n.read).length;

  const renderContent = (collapsed: boolean) =>
  <div className="flex h-full flex-col bg-navy-900 text-navy-200">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-4">
        <LogoMark />
        <AnimatePresence initial={false}>
          {!collapsed &&
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="min-w-0">
          
              <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
                LegalCase
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.12em] text-navy-400">
                Case Management
              </p>
            </motion.div>
        }
        </AnimatePresence>
        <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="ml-auto hidden rounded-md p-1.5 text-navy-400 transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white lg:block">
        
          {collapsed ? <PanelLeftIcon className="h-4 w-4" /> : <ChevronsLeftIcon className="h-4 w-4" />}
        </button>
      </div>

      <nav className="scroll-slim flex-1 overflow-y-auto px-2.5 py-4" aria-label="Main navigation">
        {groups.map((group, gi) =>
      <div key={group.title ?? gi} className={cn(gi > 0 && 'mt-5')}>
            {group.title && !collapsed &&
        <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-500">
                {group.title}
              </p>
        }
            {group.title && collapsed && <div className="mx-2 mb-2 h-px bg-white/10" />}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
            const active = isActive(item.to);
            const link =
            <Link
              to={item.to}
              onClick={onCloseMobile}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 ease-smooth',
                active ?
                'bg-white/10 text-white' :
                'text-navy-300 hover:bg-white/[0.06] hover:text-white',
                collapsed && 'justify-center px-0'
              )}>
              
                    {active &&
              <motion.span
                layoutId="nav-active"
                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-brand-400"
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} />

              }
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>;

            return (
              <li key={item.to}>
                    {collapsed ?
                <Tooltip label={item.label} side="right">
                        {link}
                      </Tooltip> :

                link
                }
                  </li>);

          })}
            </ul>
          </div>
      )}
      </nav>

      <div className="border-t border-white/10 p-2.5">
        <ul className="space-y-0.5">
          <li>
            <Link
            to="/help"
            onClick={onCloseMobile}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-navy-300 transition-colors duration-150 ease-smooth hover:bg-white/[0.06] hover:text-white',
              collapsed && 'justify-center px-0'
            )}>
            
              <HelpCircleIcon className="h-4 w-4 shrink-0" aria-hidden />
              {!collapsed && 'Help'}
            </Link>
          </li>
          <li>
            <Link
            to="/notifications"
            onClick={onCloseMobile}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-navy-300 transition-colors duration-150 ease-smooth hover:bg-white/[0.06] hover:text-white',
              collapsed && 'justify-center px-0'
            )}>
            
              <span className="relative">
                <BellIcon className="h-4 w-4 shrink-0" aria-hidden />
                {unread > 0 &&
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-brand-400" />
              }
              </span>
              {!collapsed &&
            <span className="flex-1">
                  Notifications
                  {unread > 0 && <span className="ml-1 text-navy-400">({unread})</span>}
                </span>
            }
            </Link>
          </li>
        </ul>

        <div className={cn('mt-2 flex items-center gap-2.5 rounded-lg bg-white/[0.04] p-2', collapsed && 'justify-center')}>
          <Avatar name={currentUser?.name ?? 'User'} size="sm" />
          {!collapsed &&
        <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white">{currentUser?.name}</p>
                <p className="truncate text-[11px] text-navy-400">
                  {currentUser ? roleLabel(currentUser.role) : ''}
                </p>
              </div>
              <Tooltip label="Sign out">
                <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              aria-label="Sign out"
              className="rounded-md p-1.5 text-navy-400 transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
              
                  <LogOutIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            </>
        }
        </div>
      </div>
    </div>;


  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        
        {renderContent(collapsed)}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen &&
        <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
            className="absolute inset-0 bg-navy-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCloseMobile} />
          
            <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-y-0 left-0 w-[264px]">
            
              {renderContent(false)}
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </>);

}