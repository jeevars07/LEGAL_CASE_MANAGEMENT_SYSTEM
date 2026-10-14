import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { advocates as seedAdvocates, clients as seedClients, users as seedUsers } from '../data/directory';
import { cases as seedCases, proceedings as seedProceedings } from '../data/cases';
import {
  activity as seedActivity,
  documents as seedDocuments,
  hearings as seedHearings,
  notifications as seedNotifications } from
'../data/schedule';
import { invoices as seedInvoices } from '../data/billing';
import type {
  ActivityItem,
  Advocate,
  Client,
  Hearing,
  Invoice,
  LegalCase,
  LegalDocument,
  Notification,
  Payment,
  Proceeding,
  Role,
  User } from
'../types';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

interface AppState {
  currentUser: User | null;
  users: User[];
  clients: Client[];
  advocates: Advocate[];
  cases: LegalCase[];
  hearings: Hearing[];
  documents: LegalDocument[];
  invoices: Invoice[];
  proceedings: Proceeding[];
  activity: ActivityItem[];
  notifications: Notification[];
  login: (role: Role, email?: string) => void;
  logout: () => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;
  addCase: (item: LegalCase) => void;
  updateCase: (item: LegalCase) => void;
  removeCase: (id: string) => void;
  addHearing: (hearing: Hearing) => void;
  removeHearing: (id: string) => void;
  addDocument: (doc: LegalDocument) => void;
  updateDocument: (doc: LegalDocument) => void;
  verifyDocument: (id: string, verdict: 'Verified' | 'Rejected', verifiedBy: string, remarks?: string) => void;
  removeDocument: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  recordPayment: (invoiceId: string, amount: number, method: string, note?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  logActivity: (item: Omit<ActivityItem, 'id' | 'at'>) => void;
  resetData: () => void;
  registerClient: (data: Omit<Client, 'id' | 'registeredOn' | 'status'>, password?: string) => Client;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: {children: React.ReactNode;}) {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('lcm_v2_currentUser', null);
  const [usersList, setUsersList] = useLocalStorage<User[]>('lcm_v2_users', seedUsers);
  const [clients, setClients] = useLocalStorage<Client[]>('lcm_v2_clients', seedClients);
  const [advocates, setAdvocates] = useLocalStorage<Advocate[]>('lcm_v2_advocates', seedAdvocates);
  const [cases, setCases] = useLocalStorage<LegalCase[]>('lcm_v2_cases', seedCases);
  const [hearings, setHearings] = useLocalStorage<Hearing[]>('lcm_v2_hearings', seedHearings);
  const [documents, setDocuments] = useLocalStorage<LegalDocument[]>('lcm_v2_documents', seedDocuments);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('lcm_v2_invoices', seedInvoices);
  const [proceedings, setProceedings] = useLocalStorage<Proceeding[]>('lcm_v2_proceedings', seedProceedings);
  const [activity, setActivity] = useLocalStorage<ActivityItem[]>('lcm_v2_activity', seedActivity);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('lcm_v2_notifications', seedNotifications);

  const login = useCallback(
    (role: Role, emailInput?: string) => {
      const cleanEmail = emailInput?.trim().toLowerCase();

      if (cleanEmail) {
        // 1. Search existing users list (registered & seed users)
        const matchedUser = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
        if (matchedUser) {
          setCurrentUser(matchedUser);
          return;
        }

        // 2. Search clients by email
        const matchedClient = clients.find((c) => c.email.toLowerCase() === cleanEmail);
        if (matchedClient) {
          const clientUser: User = {
            id: `U-${matchedClient.id}`,
            name: matchedClient.name,
            email: matchedClient.email,
            role: 'client',
            title: `Client — ${matchedClient.name}`,
            status: matchedClient.status === 'Inactive' ? 'Suspended' : 'Active',
            lastActive: new Date().toISOString(),
            linkedId: matchedClient.id
          };
          setUsersList((prev) => [clientUser, ...prev.filter((u) => u.id !== clientUser.id)]);
          setCurrentUser(clientUser);
          return;
        }

        // 3. Search advocates by email
        const matchedAdvocate = advocates.find((a) => a.email.toLowerCase() === cleanEmail);
        if (matchedAdvocate) {
          const advocateUser: User = {
            id: `U-${matchedAdvocate.id}`,
            name: matchedAdvocate.name,
            email: matchedAdvocate.email,
            role: 'advocate',
            title: `Advocate — ${matchedAdvocate.specialization}`,
            status: matchedAdvocate.status === 'On Leave' ? 'Suspended' : 'Active',
            lastActive: new Date().toISOString(),
            linkedId: matchedAdvocate.id
          };
          setUsersList((prev) => [advocateUser, ...prev.filter((u) => u.id !== advocateUser.id)]);
          setCurrentUser(advocateUser);
          return;
        }
      }

      // Fallback lookup by role selection
      const fallbackUser = usersList.find((u) => u.role === role && u.status === 'Active') ?? seedUsers[0];
      setCurrentUser(fallbackUser);
    },
    [usersList, clients, advocates, setCurrentUser, setUsersList]
  );

  const logout = useCallback(() => setCurrentUser(null), [setCurrentUser]);

  const logActivity = useCallback(
    (item: Omit<ActivityItem, 'id' | 'at'>) => {
      setActivity((prev) => [
      { ...item, id: `AC-${Math.random().toString(36).slice(2, 8)}`, at: new Date().toISOString() },
      ...prev]
      );
    },
    [setActivity]
  );

  // Ensure all users in database have their password initialized
  useEffect(() => {
    let changed = false;
    const updated = usersList.map((u) => {
      if (!u.password) {
        changed = true;
        const seed = seedUsers.find((s) => s.email.toLowerCase() === u.email.toLowerCase());
        const defaultPwd =
          seed?.password ||
          (u.role === 'admin'
            ? 'Admin@123'
            : u.role === 'advocate'
            ? 'Advocate@123'
            : u.role === 'clerk'
            ? 'Clerk@123'
            : 'Client@123');
        return { ...u, password: defaultPwd };
      }
      return u;
    });
    if (changed) {
      setUsersList(updated);
    }
  }, []);

  const registerClient = useCallback(
    (data: Omit<Client, 'id' | 'registeredOn' | 'status'>, password?: string) => {
      const newClientId = `CL-${Math.floor(1000 + Math.random() * 9000)}`;
      const newClient: Client = {
        ...data,
        id: newClientId,
        registeredOn: new Date().toISOString().split('T')[0],
        status: 'Active'
      };

      setClients((prev) => [newClient, ...prev]);

      const newUser: User = {
        id: `U-${Math.floor(100 + Math.random() * 900)}`,
        name: data.name,
        email: data.email,
        password: password || 'Client@123',
        role: 'client',
        title: `Client — ${data.name}`,
        status: 'Active',
        lastActive: new Date().toISOString(),
        linkedId: newClientId
      };

      setUsersList((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);

      logActivity({
        type: 'client',
        message: `Registered new client account for ${data.name}`,
        actor: data.name
      });

      return newClient;
    },
    [setClients, setUsersList, setCurrentUser, logActivity]
  );

  const resetData = useCallback(() => {
    window.localStorage.removeItem('lcm_currentUser');
    window.localStorage.removeItem('lcm_users');
    window.localStorage.removeItem('lcm_clients');
    window.localStorage.removeItem('lcm_advocates');
    window.localStorage.removeItem('lcm_cases');
    window.localStorage.removeItem('lcm_hearings');
    window.localStorage.removeItem('lcm_documents');
    window.localStorage.removeItem('lcm_invoices');
    window.localStorage.removeItem('lcm_proceedings');
    window.localStorage.removeItem('lcm_activity');
    window.localStorage.removeItem('lcm_notifications');
    setCurrentUser(null);
    setUsersList(seedUsers);
    setClients(seedClients);
    setAdvocates(seedAdvocates);
    setCases(seedCases);
    setHearings(seedHearings);
    setDocuments(seedDocuments);
    setInvoices(seedInvoices);
    setProceedings(seedProceedings);
    setActivity(seedActivity);
    setNotifications(seedNotifications);
  }, [setCurrentUser, setUsersList, setClients, setAdvocates, setCases, setHearings, setDocuments, setInvoices, setProceedings, setActivity, setNotifications]);

  const recordPayment = useCallback(
    (invoiceId: string, amount: number, method: string, note?: string) => {
      const today = new Date().toISOString().slice(0, 10);
      let targetCaseId: string | undefined;

      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== invoiceId) return inv;
          targetCaseId = inv.caseId;
          const total = inv.amount + inv.tax;
          const currentPaid = inv.paidAmount ?? (inv.status === 'Paid' ? total : 0);
          const newPaid = Math.min(total, currentPaid + amount);
          const isFull = newPaid >= total;

          const newPayment: Payment = {
            id: `PAY-${Date.now().toString().slice(-6)}`,
            amount,
            date: today,
            method,
            note: note || (isFull ? 'Full Fee Settlement' : 'Partial Fee Installment'),
            paidBy: currentUser?.name || 'Client'
          };

          return {
            ...inv,
            status: isFull ? 'Paid' : 'Partially Paid',
            paidAmount: newPaid,
            paidOn: isFull ? today : (inv.paidOn || today),
            method,
            payments: [...(inv.payments || []), newPayment]
          };
        })
      );

      logActivity({
        type: 'billing',
        message: `${note ? note : amount > 0 ? 'Payment' : 'Payment'} of ₹${Math.round(amount).toLocaleString('en-IN')} recorded for invoice ${invoiceId}`,
        actor: currentUser?.name || 'Client',
        caseId: targetCaseId
      });

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Payment Received',
          body: `Payment of ₹${Math.round(amount).toLocaleString('en-IN')} via ${method} received for invoice ${invoiceId}.`,
          at: new Date().toISOString(),
          read: false,
          kind: 'billing',
          href: `/billing/invoices/${invoiceId}`
        },
        ...prev
      ]);
    },
    [currentUser, logActivity, setInvoices, setNotifications]
  );

  const value = useMemo<AppState>(
    () => ({
      currentUser,
      users: usersList,
      clients,
      advocates,
      cases,
      hearings,
      documents,
      invoices,
      proceedings,
      activity,
      notifications,
      login,
      logout,
      addClient: (c) => setClients((prev) => [c, ...prev]),
      updateClient: (c) => setClients((prev) => prev.map((p) => p.id === c.id ? c : p)),
      removeClient: (id) => setClients((prev) => prev.filter((p) => p.id !== id)),
      addCase: (c) => setCases((prev) => [c, ...prev]),
      updateCase: (c) => setCases((prev) => prev.map((p) => p.id === c.id ? c : p)),
      removeCase: (id) => setCases((prev) => prev.filter((p) => p.id !== id)),
      addHearing: (h) => setHearings((prev) => [h, ...prev]),
      removeHearing: (id) => setHearings((prev) => prev.filter((p) => p.id !== id)),
      addDocument: (d) => setDocuments((prev) => [d, ...prev]),
      updateDocument: (d) => setDocuments((prev) => prev.map((p) => p.id === d.id ? d : p)),
      verifyDocument: (id, verdict, verifiedBy, remarks) =>
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, status: verdict, verifiedBy, verifiedOn: new Date().toISOString(), remarks }
              : d
          )
        ),
      removeDocument: (id) => setDocuments((prev) => prev.filter((p) => p.id !== id)),
      addInvoice: (i) => setInvoices((prev) => [i, ...prev]),
      updateInvoice: (i) => setInvoices((prev) => prev.map((p) => p.id === i.id ? i : p)),
      recordPayment,
      markNotificationRead: (id) =>
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)),
      markAllNotificationsRead: () =>
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      logActivity,
      resetData,
      registerClient
    }),
    [currentUser, usersList, clients, advocates, cases, hearings, documents, invoices, proceedings, activity, notifications, login, logout, logActivity, resetData, registerClient, setClients, setCases, setHearings, setDocuments, setInvoices, setNotifications, recordPayment]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}