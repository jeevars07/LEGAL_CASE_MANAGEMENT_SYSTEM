import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRightIcon,
  HelpCircleIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon } from
'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Menu, MenuItem } from '../ui/Menu';
import { Tooltip } from '../ui/Tooltip';
import { NotificationBell } from './NotificationBell';
import { metaForPath } from './navigation';
import { useApp } from '../../contexts/AppContext';
import { roleLabel } from '../../utils/selectors';
import { cn } from '../../utils/format';

export function Topbar({
  onOpenMobileNav,
  onOpenSearch



}: {onOpenMobileNav: () => void;onOpenSearch: () => void;}) {
  const { pathname } = useLocation();
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const meta = metaForPath(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-navy-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-600 transition-colors duration-150 ease-smooth hover:bg-navy-50 lg:hidden">
        
        <MenuIcon className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-[11px] text-navy-400 sm:flex">
          {meta.crumbs.map((crumb, i) =>
          <span key={crumb + i} className="flex items-center gap-1">
              {i > 0 && <ChevronRightIcon className="h-3 w-3 text-navy-300" aria-hidden />}
              {i === 0 ?
            <Link to="/" className="transition-colors duration-150 hover:text-navy-700">
                  {crumb}
                </Link> :

            <span className={cn(i === meta.crumbs.length - 1 && 'text-navy-600')}>{crumb}</span>
            }
            </span>
          )}
        </nav>
        <h2 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-navy-900">
          {meta.title}
        </h2>
      </div>

      <button
        onClick={onOpenSearch}
        className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-navy-200 bg-navy-50/70 px-3 text-left text-[13px] text-navy-400 transition-[border-color,background-color] duration-150 ease-smooth hover:border-navy-300 hover:bg-white md:flex xl:w-72">
        
        <SearchIcon className="h-4 w-4 shrink-0 text-navy-300" aria-hidden />
        <span className="flex-1 truncate">Search everything…</span>
        <kbd className="rounded border border-navy-200 bg-white px-1 py-0.5 text-[10px] font-medium text-navy-400">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={onOpenSearch}
        aria-label="Open search"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-500 transition-colors duration-150 ease-smooth hover:text-navy-800 md:hidden">
        
        <SearchIcon className="h-4 w-4" />
      </button>

      <NotificationBell />

      <Tooltip label="Help & support">
        <Link
          to="/help"
          aria-label="Help and support"
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-500 transition-colors duration-150 ease-smooth hover:border-navy-300 hover:text-navy-800 sm:flex">
          
          <HelpCircleIcon className="h-4 w-4" />
        </Link>
      </Tooltip>

      <Menu
        trigger={({ toggle }) =>
        <button
          onClick={toggle}
          className="flex items-center gap-2.5 rounded-lg border border-transparent py-1 pl-1 pr-1.5 transition-colors duration-150 ease-smooth hover:border-navy-200 hover:bg-navy-50">
          
            <Avatar name={currentUser?.name ?? 'User'} size="sm" />
            <span className="hidden text-left lg:block">
              <span className="block max-w-[140px] truncate text-[13px] font-medium leading-tight text-navy-900">
                {currentUser?.name}
              </span>
              <span className="block text-[11px] leading-tight text-navy-400">
                {currentUser ? roleLabel(currentUser.role) : ''}
              </span>
            </span>
          </button>
        }>
        
        {(close) =>
        <>
            <div className="border-b border-navy-100 px-2.5 pb-2 pt-1.5">
              <p className="text-[13px] font-medium text-navy-900">{currentUser?.name}</p>
              <p className="truncate text-[11px] text-navy-400">{currentUser?.email}</p>
            </div>
            <div className="pt-1">
              <MenuItem
              icon={<UserIcon className="h-4 w-4 text-navy-400" />}
              onClick={() => {
                close();
                navigate('/settings');
              }}>
              
                My Profile
              </MenuItem>
              <MenuItem
              icon={<SettingsIcon className="h-4 w-4 text-navy-400" />}
              onClick={() => {
                close();
                navigate('/settings');
              }}>
              
                Settings
              </MenuItem>
              <MenuItem
              icon={<HelpCircleIcon className="h-4 w-4 text-navy-400" />}
              onClick={() => {
                close();
                navigate('/help');
              }}>
              
                Help
              </MenuItem>
            </div>
            <div className="mt-1 border-t border-navy-100 pt-1">
              <MenuItem
              danger
              icon={<LogOutIcon className="h-4 w-4" />}
              onClick={() => {
                close();
                logout();
                navigate('/login');
              }}>
              
                Logout
              </MenuItem>
            </div>
          </>
        }
      </Menu>
    </header>);

}