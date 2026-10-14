import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { GlobalSearch } from './GlobalSearch';
import { useApp } from '../../contexts/AppContext';

export function AppLayout() {
  const { currentUser } = useApp();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-full w-full bg-[#f7f8fb]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)} />
      
      <div
        className={
        collapsed ?
        'min-h-full transition-[padding-left] duration-[260ms] ease-smooth lg:pl-[68px]' :
        'min-h-full transition-[padding-left] duration-[260ms] ease-smooth lg:pl-64'
        }>
        
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
        <motion.main
          key={location.pathname + location.search}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 md:pb-10">
          
          <Outlet />
        </motion.main>
      </div>
      <MobileNav />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>);

}