import type {
  Advocate,
  Client,
  Hearing,
  Invoice,
  LegalCase,
  Role,
  User } from
'../types';
import { TODAY } from './format';

export function clientName(clients: Client[], id: string): string {
  return clients.find((c) => c.id === id)?.name ?? '—';
}

export function advocateName(advocates: Advocate[], id: string): string {
  return advocates.find((a) => a.id === id)?.name ?? 'Unassigned';
}

export function caseTitle(cases: LegalCase[], id: string): string {
  return cases.find((c) => c.id === id)?.title ?? '—';
}

export function invoiceTotal(invoice: Invoice): number {
  return invoice.amount + invoice.tax;
}

export function invoicePaid(invoice: Invoice): number {
  if (invoice.paidAmount !== undefined) return invoice.paidAmount;
  if (invoice.payments && invoice.payments.length > 0) {
    return invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  }
  return invoice.status === 'Paid' ? (invoice.amount + invoice.tax) : 0;
}

export function invoiceBalance(invoice: Invoice): number {
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  return Math.max(0, total - paid);
}

export function upcomingHearings(hearings: Hearing[]): Hearing[] {
  return hearings.
  filter((h) => h.status === 'Scheduled' && h.date >= TODAY).
  sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function pastHearings(hearings: Hearing[]): Hearing[] {
  return hearings.
  filter((h) => h.status !== 'Scheduled' || h.date < TODAY).
  sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

export function todaysHearings(hearings: Hearing[]): Hearing[] {
  return hearings.filter((h) => h.date === TODAY);
}

/**
 * Restricts the case list to what the signed-in role is permitted to see.
 * Advocates see only their assigned matters; clients see only their own.
 */
export function visibleCases(cases: LegalCase[], user: User | null): LegalCase[] {
  if (!user) return [];
  if (user.role === 'advocate') return cases.filter((c) => c.advocateId === user.linkedId);
  if (user.role === 'client') return cases.filter((c) => c.clientId === user.linkedId);
  return cases;
}

export function visibleInvoices(invoices: Invoice[], user: User | null, cases: LegalCase[]): Invoice[] {
  if (!user) return [];
  if (user.role === 'client') return invoices.filter((i) => i.clientId === user.linkedId);
  if (user.role === 'advocate') {
    const ids = new Set(cases.filter((c) => c.advocateId === user.linkedId).map((c) => c.id));
    return invoices.filter((i) => ids.has(i.caseId));
  }
  return invoices;
}

export function roleLabel(role: Role): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'advocate':
      return 'Advocate';
    case 'clerk':
      return 'Clerk / Paralegal';
    case 'client':
      return 'Client';
  }
}

export function greeting(name: string): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${part}, ${name.split(' ')[0]}`;
}