import {
  BriefcaseIcon,
  BuildingIcon,
  CalendarDaysIcon,
  ClockIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileTextIcon,
  FilesIcon,
  FolderOpenIcon,
  GavelIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  ScaleIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
  UserSquareIcon,
  WalletIcon,
  type LucideIcon } from
'lucide-react';
import type { Role } from '../../types';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export function navForRole(role: Role): NavGroup[] {
  const dashboard: NavGroup = {
    items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboardIcon }]
  };

  if (role === 'client') {
    return [
    dashboard,
    {
      title: 'My Matters',
      items: [
      { label: 'My Cases', to: '/cases', icon: BriefcaseIcon },
      { label: 'My Hearings', to: '/hearings/upcoming', icon: CalendarDaysIcon },
      { label: 'My Documents', to: '/documents', icon: FolderOpenIcon },
      { label: 'My Billing', to: '/billing/invoices', icon: ReceiptTextIcon }]

    }];

  }

  if (role === 'advocate') {
    return [
    dashboard,
    {
      title: 'Case Management',
      items: [
      { label: 'My Cases', to: '/cases', icon: BriefcaseIcon },
      { label: 'Active Cases', to: '/cases?status=Active', icon: FolderOpenIcon },
      { label: 'Pending Cases', to: '/cases?status=Pending', icon: ClockIcon }]

    },
    {
      title: 'Hearings',
      items: [
      { label: 'Calendar', to: '/hearings/calendar', icon: CalendarDaysIcon },
      { label: 'Upcoming Hearings', to: '/hearings/upcoming', icon: ClockIcon }]

    },
    {
      title: 'Documents',
      items: [
      { label: 'All Documents', to: '/documents', icon: FilesIcon },
      { label: 'Recent Documents', to: '/documents/recent', icon: FileTextIcon }]

    },
    {
      title: 'Billing',
      items: [{ label: 'Invoices', to: '/billing/invoices', icon: ReceiptTextIcon }]
    }];

  }

  const caseManagement: NavGroup = {
    title: 'Case Management',
    items: [
    { label: 'All Cases', to: '/cases', icon: BriefcaseIcon },
    { label: 'Active Cases', to: '/cases?status=Active', icon: FolderOpenIcon },
    { label: 'Pending Cases', to: '/cases?status=Pending', icon: ClockIcon },
    { label: 'Closed Cases', to: '/cases?status=Closed', icon: ScaleIcon }]

  };

  const clientsGroup: NavGroup = {
    title: 'Clients',
    items: [
    { label: 'All Clients', to: '/clients', icon: UsersIcon },
    { label: 'Add Client', to: '/clients/new', icon: UserPlusIcon }]

  };

  const hearingsGroup: NavGroup = {
    title: 'Hearings',
    items: [
    { label: 'Calendar', to: '/hearings/calendar', icon: CalendarDaysIcon },
    { label: 'Upcoming Hearings', to: '/hearings/upcoming', icon: ClockIcon }]

  };

  const documentsGroup: NavGroup = {
    title: 'Documents',
    items: [
    { label: 'All Documents', to: '/documents', icon: FilesIcon },
    { label: 'Recent Documents', to: '/documents/recent', icon: FileTextIcon }]

  };

  const billingGroup: NavGroup = {
    title: 'Billing',
    items: [
    { label: 'Invoices', to: '/billing/invoices', icon: ReceiptTextIcon },
    { label: 'Payments', to: '/billing/payments', icon: CreditCardIcon },
    { label: 'Outstanding Fees', to: '/billing/outstanding', icon: WalletIcon }]

  };

  if (role === 'clerk') {
    return [dashboard, clientsGroup, caseManagement, hearingsGroup, documentsGroup, billingGroup];
  }

  return [
  dashboard,
  caseManagement,
  clientsGroup,
  hearingsGroup,
  {
    title: 'Advocates',
    items: [
    { label: 'Advocates', to: '/advocates', icon: GavelIcon },
    { label: 'Assignments', to: '/assignments', icon: UserSquareIcon }]

  },
  documentsGroup,
  billingGroup,
  {
    title: 'Reports',
    items: [
    { label: 'Case Reports', to: '/reports/cases', icon: BriefcaseIcon },
    { label: 'Client Reports', to: '/reports/clients', icon: UsersIcon },
    { label: 'Financial Reports', to: '/reports/financial', icon: BuildingIcon }]

  },
  {
    title: 'Administration',
    items: [
    { label: 'Users', to: '/admin/users', icon: UsersIcon },
    { label: 'Database', to: '/settings?tab=database', icon: DatabaseIcon },
    { label: 'Settings', to: '/settings', icon: SettingsIcon }]

  }];

}

/** Page titles + breadcrumb trails keyed by route pattern prefix. */
export const routeMeta: Array<{match: RegExp;title: string;crumbs: string[];}> = [
{ match: /^\/$/, title: 'Dashboard', crumbs: ['Home', 'Dashboard'] },
{ match: /^\/cases\/new$/, title: 'Register Case', crumbs: ['Home', 'Cases', 'Register'] },
{ match: /^\/cases\/[^/]+$/, title: 'Case Details', crumbs: ['Home', 'Cases', 'Details'] },
{ match: /^\/cases$/, title: 'Cases', crumbs: ['Home', 'Cases'] },
{ match: /^\/clients\/new$/, title: 'Add Client', crumbs: ['Home', 'Clients', 'Add Client'] },
{ match: /^\/clients\/[^/]+$/, title: 'Client Details', crumbs: ['Home', 'Clients', 'Details'] },
{ match: /^\/clients$/, title: 'Clients', crumbs: ['Home', 'Clients'] },
{ match: /^\/advocates\/[^/]+$/, title: 'Advocate Profile', crumbs: ['Home', 'Advocates', 'Profile'] },
{ match: /^\/advocates$/, title: 'Advocates', crumbs: ['Home', 'Advocates'] },
{ match: /^\/assignments$/, title: 'Assignments', crumbs: ['Home', 'Advocates', 'Assignments'] },
{ match: /^\/hearings\/calendar$/, title: 'Hearing Calendar', crumbs: ['Home', 'Hearings', 'Calendar'] },
{ match: /^\/hearings\/upcoming$/, title: 'Upcoming Hearings', crumbs: ['Home', 'Hearings', 'Upcoming'] },
{ match: /^\/documents\/recent$/, title: 'Recent Documents', crumbs: ['Home', 'Documents', 'Recent'] },
{ match: /^\/documents$/, title: 'Documents', crumbs: ['Home', 'Documents'] },
{ match: /^\/billing\/invoices\/[^/]+$/, title: 'Invoice', crumbs: ['Home', 'Billing', 'Invoice'] },
{ match: /^\/billing\/invoices$/, title: 'Invoices', crumbs: ['Home', 'Billing', 'Invoices'] },
{ match: /^\/billing\/payments$/, title: 'Payments', crumbs: ['Home', 'Billing', 'Payments'] },
{ match: /^\/billing\/outstanding$/, title: 'Outstanding Fees', crumbs: ['Home', 'Billing', 'Outstanding'] },
{ match: /^\/reports/, title: 'Reports', crumbs: ['Home', 'Reports'] },
{ match: /^\/admin\/users$/, title: 'Users', crumbs: ['Home', 'Administration', 'Users'] },
{ match: /^\/settings$/, title: 'Settings', crumbs: ['Home', 'Settings'] },
{ match: /^\/notifications$/, title: 'Notifications', crumbs: ['Home', 'Notifications'] },
{ match: /^\/help$/, title: 'Help & Support', crumbs: ['Home', 'Help'] }];


export function metaForPath(path: string): {title: string;crumbs: string[];} {
  return routeMeta.find((m) => m.match.test(path)) ?? { title: 'LegalCase', crumbs: ['Home'] };
}