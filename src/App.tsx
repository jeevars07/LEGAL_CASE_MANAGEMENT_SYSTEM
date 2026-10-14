import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Cases } from './pages/cases/Cases';
import { RegisterCase } from './pages/cases/RegisterCase';
import { CaseDetails } from './pages/cases/CaseDetails';
import { Clients } from './pages/clients/Clients';
import { AddClient } from './pages/clients/AddClient';
import { ClientDetails } from './pages/clients/ClientDetails';
import { Advocates } from './pages/advocates/Advocates';
import { AdvocateProfile } from './pages/advocates/AdvocateProfile';
import { Assignments } from './pages/advocates/Assignments';
import { HearingCalendar } from './pages/hearings/HearingCalendar';
import { UpcomingHearings } from './pages/hearings/UpcomingHearings';
import { Documents } from './pages/documents/Documents';
import { Invoices } from './pages/billing/Invoices';
import { InvoiceDetails } from './pages/billing/InvoiceDetails';
import { Reports } from './pages/Reports';
import { Users } from './pages/admin/Users';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { Help } from './pages/Help';
import type { Role } from './types';

function RequireRole({ roles, children }: {roles: Role[];children: React.ReactNode;}) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!roles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="cases" element={<Cases />} />
            <Route
              path="cases/new"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <RegisterCase />
                </RequireRole>
              } />
            
            <Route path="cases/:id" element={<CaseDetails />} />

            <Route
              path="clients"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <Clients />
                </RequireRole>
              } />
            
            <Route
              path="clients/new"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <AddClient />
                </RequireRole>
              } />
            
            <Route
              path="clients/:id"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <ClientDetails />
                </RequireRole>
              } />
            

            <Route
              path="advocates"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <Advocates />
                </RequireRole>
              } />
            
            <Route
              path="advocates/:id"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <AdvocateProfile />
                </RequireRole>
              } />
            
            <Route
              path="assignments"
              element={
              <RequireRole roles={['admin']}>
                  <Assignments />
                </RequireRole>
              } />
            

            <Route path="hearings/calendar" element={<HearingCalendar />} />
            <Route path="hearings/upcoming" element={<UpcomingHearings />} />

            <Route path="documents" element={<Documents />} />
            <Route path="documents/recent" element={<Documents recentOnly />} />

            <Route path="billing/invoices" element={<Invoices />} />
            <Route path="billing/invoices/:id" element={<InvoiceDetails />} />
            <Route
              path="billing/payments"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <Invoices mode="payments" />
                </RequireRole>
              } />
            
            <Route
              path="billing/outstanding"
              element={
              <RequireRole roles={['admin', 'clerk']}>
                  <Invoices mode="outstanding" />
                </RequireRole>
              } />
            

            <Route
              path="reports/:kind"
              element={
              <RequireRole roles={['admin']}>
                  <Reports />
                </RequireRole>
              } />
            
            <Route
              path="admin/users"
              element={
              <RequireRole roles={['admin']}>
                  <Users />
                </RequireRole>
              } />
            

            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              border: '1px solid #e7ebf3',
              fontSize: '13px',
              color: '#0f1b33'
            }
          }} />
        
      </BrowserRouter>
    </AppProvider>);

}