import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { AdvocateDashboard } from './dashboards/AdvocateDashboard';
import { ClerkDashboard } from './dashboards/ClerkDashboard';
import { ClientDashboard } from './dashboards/ClientDashboard';

export function Dashboard() {
  const { currentUser } = useApp();
  switch (currentUser?.role) {
    case 'advocate':
      return <AdvocateDashboard />;
    case 'clerk':
      return <ClerkDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return <AdminDashboard />;
  }
}