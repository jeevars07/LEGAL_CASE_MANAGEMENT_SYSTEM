import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DatabaseIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshCwIcon,
  SaveIcon,
  SearchIcon,
  TableIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { Tabs, TabPanel } from '../components/ui/Tabs';
import { Avatar } from '../components/ui/Avatar';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';
import { cn, currency, formatDate } from '../utils/format';
import { roleLabel } from '../utils/selectors';

function Toggle({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-navy-900">{label}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-navy-400">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-smooth',
          checked ? 'bg-navy-900' : 'bg-navy-200'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-smooth',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

export function Settings() {
  const { currentUser } = useApp();
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') || 'profile');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    hearings: true,
    documents: true,
    billing: false,
    digest: true
  });
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setParams(newTab === 'profile' ? {} : { tab: newTab });
  };

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved', { description: 'Your preferences have been updated.' });
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System"
        subtitle="Manage your profile, security, notifications, and inspect the live database."
        actions={
          tab !== 'database' ? (
            <Button variant="primary" loading={saving} icon={<SaveIcon className="h-4 w-4" />} onClick={save}>
              Save Changes
            </Button>
          ) : undefined
        }
      />

      <div className="px-1">
        <Tabs
          active={tab}
          onChange={handleTabChange}
          tabs={[
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Security' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'appearance', label: 'Appearance' },
            { id: 'system', label: 'System Preferences' },
            { id: 'database', label: 'Database Inspector' }
          ]}
        />
      </div>

      <AnimatePresence mode="wait">
        {tab === 'profile' && (
          <TabPanel id="profile">
            <Card>
              <CardHeader title="Profile" description="How your name appears on case records and filings." />
              <div className="space-y-5 p-5">
                <div className="flex items-center gap-4">
                  <Avatar name={currentUser?.name ?? 'User'} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-navy-900">{currentUser?.name}</p>
                    <p className="text-[12px] text-navy-400">
                      {currentUser ? roleLabel(currentUser.role) : ''} · {currentUser?.title}
                    </p>
                    <Button size="sm" variant="secondary" className="mt-2">
                      Change photo
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="s-name">
                    <Input id="s-name" defaultValue={currentUser?.name} />
                  </Field>
                  <Field label="Email" htmlFor="s-email">
                    <Input id="s-email" type="email" defaultValue={currentUser?.email} />
                  </Field>
                  <Field label="Job title" htmlFor="s-title">
                    <Input id="s-title" defaultValue={currentUser?.title} />
                  </Field>
                  <Field label="Contact number" htmlFor="s-phone">
                    <Input id="s-phone" defaultValue="+91 98401 22334" />
                  </Field>
                  <Field
                    label="Signature block"
                    htmlFor="s-sig"
                    className="sm:col-span-2"
                    hint="Appended to letters and filings."
                  >
                    <Textarea
                      id="s-sig"
                      defaultValue={`${currentUser?.name}\nHarbor Law Partners\nHigh Court Buildings, Chennai`}
                    />
                  </Field>
                </div>
              </div>
            </Card>
          </TabPanel>
        )}

        {tab === 'security' && (
          <TabPanel id="security">
            <div className="space-y-5">
              <Card>
                <CardHeader title="Change password" description="Choose a strong password with at least 8 characters." />
                <div className="grid max-w-md grid-cols-1 gap-4 p-5">
                  <Field label="Current password" htmlFor="s-cur-pass">
                    <Input id="s-cur-pass" type="password" />
                  </Field>
                  <Field label="New password" htmlFor="s-new-pass">
                    <Input id="s-new-pass" type="password" />
                  </Field>
                  <Field label="Confirm new password" htmlFor="s-conf-pass">
                    <Input id="s-conf-pass" type="password" />
                  </Field>
                  <div>
                    <Button
                      variant="primary"
                      onClick={() =>
                        toast.success('Password updated', { description: 'Use your new password next time.' })
                      }
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Two-factor authentication"
                  description="Add an extra layer of protection to your practice records."
                />
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-medium text-navy-900">Authenticator app</p>
                    <p className="text-xs text-navy-400">Time-based one-time passwords via TOTP.</p>
                  </div>
                  <Badge tone="green" dot>
                    Configured
                  </Badge>
                </div>
              </Card>
            </div>
          </TabPanel>
        )}

        {tab === 'notifications' && (
          <TabPanel id="notifications">
            <Card>
              <CardHeader
                title="Email & Push Notifications"
                description="Decide which events trigger notifications to your address."
              />
              <div className="divide-y divide-navy-100 p-5">
                <Toggle
                  label="Hearing reminders"
                  description="Sent 24 hours and 2 hours before scheduled listings."
                  checked={notifications.hearings}
                  onChange={(v) => setNotifications((p) => ({ ...p, hearings: v }))}
                />
                <Toggle
                  label="Document updates"
                  description="When a document is uploaded, verified, or rejected on your matters."
                  checked={notifications.documents}
                  onChange={(v) => setNotifications((p) => ({ ...p, documents: v }))}
                />
                <Toggle
                  label="Billing events"
                  description="Invoice issued, payment received, or overdue notice."
                  checked={notifications.billing}
                  onChange={(v) => setNotifications((p) => ({ ...p, billing: v }))}
                />
                <Toggle
                  label="Daily practice digest"
                  description="A summary of upcoming court appearances sent at 07:30."
                  checked={notifications.digest}
                  onChange={(v) => setNotifications((p) => ({ ...p, digest: v }))}
                />
              </div>
            </Card>
          </TabPanel>
        )}

        {tab === 'appearance' && (
          <TabPanel id="appearance">
            <Card>
              <CardHeader title="Appearance & Layout" description="Customize interface density and theme preferences." />
              <div className="space-y-6 p-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                    Density preference
                  </label>
                  <div className="mt-3 grid max-w-sm grid-cols-2 gap-3">
                    {(['comfortable', 'compact'] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => setDensity(option)}
                        className={cn(
                          'rounded-xl border p-4 text-left transition-all',
                          density === option
                            ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
                            : 'border-navy-200 hover:border-navy-300'
                        )}
                      >
                        <p className="text-sm font-semibold capitalize text-navy-900">{option}</p>
                        <span className="mt-2 block space-y-1">
                          {[0, 1, 2].map((r) => (
                            <span
                              key={r}
                              className={cn(
                                'block rounded bg-navy-200',
                                option === 'comfortable' ? 'h-2.5' : 'h-1.5'
                              )}
                            />
                          ))}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="Default landing page" htmlFor="s-land">
                  <Select id="s-land" defaultValue="Dashboard">
                    <option>Dashboard</option>
                    <option>All Cases</option>
                    <option>Hearing Calendar</option>
                  </Select>
                </Field>
              </div>
            </Card>
          </TabPanel>
        )}

        {tab === 'system' && (
          <TabPanel id="system">
            <Card>
              <CardHeader title="System Preferences" description="Practice-wide defaults applied to new records." />
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                <Field label="Practice name" htmlFor="s-firm">
                  <Input id="s-firm" defaultValue="Harbor Law Partners" />
                </Field>
                <Field label="Default court" htmlFor="s-court">
                  <Select id="s-court" defaultValue="Madras High Court, Chennai">
                    <option>Madras High Court, Chennai</option>
                    <option>City Civil Court, Chennai</option>
                    <option>District & Sessions Court, Coimbatore</option>
                    <option>Commercial Court, Chennai</option>
                  </Select>
                </Field>
                <Field label="Invoice tax rate" htmlFor="s-tax" hint="Applied to new fee notes.">
                  <Input id="s-tax" defaultValue="18% GST" />
                </Field>
                <Field label="Payment terms" htmlFor="s-terms">
                  <Select id="s-terms" defaultValue="30 days">
                    <option>14 days</option>
                    <option>30 days</option>
                    <option>45 days</option>
                  </Select>
                </Field>
                <Field label="Case number format" htmlFor="s-format" className="sm:col-span-2">
                  <Input id="s-format" defaultValue="WP/YYYY/NNNNN" />
                </Field>
              </div>
            </Card>
          </TabPanel>
        )}

        {/* ── DATABASE INSPECTOR TAB ── */}
        {tab === 'database' && (
          <TabPanel id="database">
            <DatabaseInspector />
          </TabPanel>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DATABASE INSPECTOR COMPONENT
══════════════════════════════════════════════════════ */
type DbCollection =
  | 'users'
  | 'clients'
  | 'advocates'
  | 'cases'
  | 'invoices'
  | 'hearings'
  | 'documents'
  | 'activity'
  | 'notifications';

function DatabaseInspector() {
  const {
    users,
    clients,
    advocates,
    cases,
    invoices,
    hearings,
    documents,
    activity,
    notifications,
    resetData
  } = useApp();

  const [activeTable, setActiveTable] = useState<DbCollection>('users');
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [copied, setCopied] = useState(false);

  const collections: Record<
    DbCollection,
    { label: string; count: number; storageKey: string; data: any[] }
  > = {
    users: { label: 'Users & Logins', count: users.length, storageKey: 'lcm_v2_users', data: users },
    clients: { label: 'Clients', count: clients.length, storageKey: 'lcm_v2_clients', data: clients },
    advocates: { label: 'Advocates', count: advocates.length, storageKey: 'lcm_v2_advocates', data: advocates },
    cases: { label: 'Cases & Matters', count: cases.length, storageKey: 'lcm_v2_cases', data: cases },
    invoices: { label: 'Invoices & Billing', count: invoices.length, storageKey: 'lcm_v2_invoices', data: invoices },
    hearings: { label: 'Hearings Schedule', count: hearings.length, storageKey: 'lcm_v2_hearings', data: hearings },
    documents: { label: 'Legal Documents', count: documents.length, storageKey: 'lcm_v2_documents', data: documents },
    activity: { label: 'Activity Logs', count: activity.length, storageKey: 'lcm_v2_activity', data: activity },
    notifications: { label: 'Notifications', count: notifications.length, storageKey: 'lcm_v2_notifications', data: notifications }
  };

  const currentData = collections[activeTable].data;

  // Filter rows based on search input
  const filteredData = currentData.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return JSON.stringify(item).toLowerCase().includes(q);
  });

  // Export complete database as JSON download
  const handleExportJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      database: {
        users,
        clients,
        advocates,
        cases,
        invoices,
        hearings,
        documents,
        activity,
        notifications
      }
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal_case_management_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Database backup exported!', { description: 'Full JSON backup downloaded.' });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredData, null, 2));
    setCopied(true);
    toast.success('Table JSON copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Storage Architecture Overview Banner */}
      <Card className="p-5 border-navy-200/80 bg-gradient-to-r from-navy-900 to-navy-950 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="rounded-xl bg-white/10 p-2.5 text-brand-400">
              <DatabaseIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Database Storage Architecture</h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  Live & Connected
                </span>
              </div>
              <p className="mt-1 text-xs text-navy-300 leading-relaxed max-w-2xl">
                The database is persisted in browser <strong>window.localStorage</strong> and seeded from{' '}
                <code className="text-brand-300 font-mono text-[11px]">src/data/*.ts</code>. Any changes made through
                case registration, document verification, client registration, or billing update live across the app.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<DownloadIcon className="h-3.5 w-3.5 text-navy-700" />}
              onClick={handleExportJson}
              className="bg-white text-navy-900 hover:bg-navy-50 font-semibold"
            >
              Export JSON Backup
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCwIcon className="h-3.5 w-3.5 text-red-600" />}
              onClick={() => {
                if (window.confirm('Reset all database tables to default seed data?')) {
                  resetData();
                  toast.success('Database reset to default seed data.');
                }
              }}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Reset Seed Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Table Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(Object.keys(collections) as DbCollection[]).map((key) => {
          const col = collections[key];
          const isActive = activeTable === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveTable(key);
                setSearchTerm('');
              }}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                isActive
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white text-navy-600 border border-navy-200 hover:border-navy-300 hover:bg-navy-50/50'
              )}
            >
              <span>{col.label}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular',
                  isActive ? 'bg-white/20 text-white' : 'bg-navy-100 text-navy-700'
                )}
              >
                {col.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Content Card */}
      <Card>
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-100 p-4">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="text-sm font-bold text-navy-900">
              Table: <span className="font-mono text-brand-700">{activeTable}</span>
            </h4>
            <span className="text-xs text-navy-400">
              (Storage Key: <code className="font-mono text-navy-600">{collections[activeTable].storageKey}</code>)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTable}...`}
                className="h-8.5 rounded-lg border border-navy-200 bg-white pl-8 pr-3 text-xs text-navy-900 placeholder:text-navy-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-navy-200 bg-navy-50/60 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  viewMode === 'table' ? 'bg-white text-navy-900 shadow-xs' : 'text-navy-500 hover:text-navy-900'
                )}
              >
                <TableIcon className="h-3.5 w-3.5" />
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('json')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  viewMode === 'json' ? 'bg-white text-navy-900 shadow-xs' : 'text-navy-500 hover:text-navy-900'
                )}
              >
                <CodeIcon className="h-3.5 w-3.5" />
                Raw JSON
              </button>
            </div>

            {/* Special Controls */}
            {activeTable === 'users' && viewMode === 'table' && (
              <Button
                variant="secondary"
                size="sm"
                icon={showPasswords ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
                onClick={() => setShowPasswords((s) => !s)}
              >
                {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
              </Button>
            )}

            {viewMode === 'json' && (
              <Button
                variant="secondary"
                size="sm"
                icon={copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-600" /> : <CopyIcon className="h-3.5 w-3.5" />}
                onClick={handleCopyJson}
              >
                {copied ? 'Copied' : 'Copy JSON'}
              </Button>
            )}
          </div>
        </div>

        {/* View Mode Render */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            {filteredData.length === 0 ? (
              <div className="p-8 text-center text-xs text-navy-400">
                No matching records found in table <code className="font-mono">{activeTable}</code>.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-500 font-semibold uppercase tracking-wider text-[11px]">
                  {activeTable === 'users' ? (
                    <tr>
                      <th className="px-4 py-2.5">User ID</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Database Password</th>
                      <th className="px-4 py-2.5">Role</th>
                      <th className="px-4 py-2.5">Title</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  ) : activeTable === 'clients' ? (
                    <tr>
                      <th className="px-4 py-2.5">Client ID</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Phone</th>
                      <th className="px-4 py-2.5">City / State</th>
                      <th className="px-4 py-2.5">PIN Code</th>
                      <th className="px-4 py-2.5">Registered</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  ) : activeTable === 'advocates' ? (
                    <tr>
                      <th className="px-4 py-2.5">Advocate ID</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Phone</th>
                      <th className="px-4 py-2.5">Bar Number</th>
                      <th className="px-4 py-2.5">Specialization</th>
                      <th className="px-4 py-2.5">Experience</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  ) : activeTable === 'cases' ? (
                    <tr>
                      <th className="px-4 py-2.5">Case ID</th>
                      <th className="px-4 py-2.5">Case No.</th>
                      <th className="px-4 py-2.5">Title</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Court</th>
                      <th className="px-4 py-2.5">Stage</th>
                      <th className="px-4 py-2.5">Priority</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  ) : activeTable === 'invoices' ? (
                    <tr>
                      <th className="px-4 py-2.5">Invoice ID</th>
                      <th className="px-4 py-2.5">Client ID</th>
                      <th className="px-4 py-2.5">Case ID</th>
                      <th className="px-4 py-2.5">Base Fee</th>
                      <th className="px-4 py-2.5">Tax</th>
                      <th className="px-4 py-2.5">Total Amount</th>
                      <th className="px-4 py-2.5">Paid Amount</th>
                      <th className="px-4 py-2.5">Due Date</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  ) : activeTable === 'hearings' ? (
                    <tr>
                      <th className="px-4 py-2.5">Hearing ID</th>
                      <th className="px-4 py-2.5">Case ID</th>
                      <th className="px-4 py-2.5">Date & Time</th>
                      <th className="px-4 py-2.5">Court</th>
                      <th className="px-4 py-2.5">Judge</th>
                      <th className="px-4 py-2.5">Purpose</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  ) : (
                    <tr>
                      {Object.keys(filteredData[0] || {}).slice(0, 7).map((col) => (
                        <th key={col} className="px-4 py-2.5 capitalize">{col}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-navy-100 text-navy-800">
                  {activeTable === 'users' ? (
                    filteredData.map((u: any) => (
                      <tr key={u.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-mono font-medium text-navy-900">{u.id}</td>
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-navy-600">{u.email}</td>
                        <td className="px-4 py-3 font-mono text-brand-700">
                          {showPasswords ? u.password || '—' : '••••••••'}
                        </td>
                        <td className="px-4 py-3 capitalize font-semibold text-navy-700">{u.role}</td>
                        <td className="px-4 py-3 text-navy-500">{u.title}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={u.status} />
                        </td>
                      </tr>
                    ))
                  ) : activeTable === 'clients' ? (
                    filteredData.map((c: any) => (
                      <tr key={c.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-mono font-medium text-navy-900">{c.id}</td>
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-navy-600">{c.email}</td>
                        <td className="px-4 py-3 font-mono">{c.phone}</td>
                        <td className="px-4 py-3">{c.city}, {c.state}</td>
                        <td className="px-4 py-3 font-mono">{c.postalCode}</td>
                        <td className="px-4 py-3">{formatDate(c.registeredOn)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))
                  ) : activeTable === 'advocates' ? (
                    filteredData.map((a: any) => (
                      <tr key={a.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-mono font-medium text-navy-900">{a.id}</td>
                        <td className="px-4 py-3 font-medium">{a.name}</td>
                        <td className="px-4 py-3 text-navy-600">{a.email}</td>
                        <td className="px-4 py-3 font-mono">{a.phone}</td>
                        <td className="px-4 py-3 font-mono text-navy-700">{a.barNumber}</td>
                        <td className="px-4 py-3">{a.specialization}</td>
                        <td className="px-4 py-3 tabular">{a.yearsExperience} yrs</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    ))
                  ) : activeTable === 'cases' ? (
                    filteredData.map((cs: any) => (
                      <tr key={cs.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-mono font-medium text-navy-900">{cs.id}</td>
                        <td className="px-4 py-3 font-mono text-navy-600">{cs.caseNumber}</td>
                        <td className="px-4 py-3 font-medium max-w-[200px] truncate">{cs.title}</td>
                        <td className="px-4 py-3">{cs.type}</td>
                        <td className="px-4 py-3 max-w-[180px] truncate">{cs.court}</td>
                        <td className="px-4 py-3">{cs.stage}</td>
                        <td className="px-4 py-3">{cs.priority}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={cs.status} />
                        </td>
                      </tr>
                    ))
                  ) : activeTable === 'invoices' ? (
                    filteredData.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-mono font-medium text-navy-900">{inv.id}</td>
                        <td className="px-4 py-3 font-mono">{inv.clientId}</td>
                        <td className="px-4 py-3 font-mono">{inv.caseId}</td>
                        <td className="px-4 py-3 tabular">{currency(inv.amount)}</td>
                        <td className="px-4 py-3 tabular">{currency(inv.tax)}</td>
                        <td className="px-4 py-3 font-semibold tabular">{currency(inv.amount + inv.tax)}</td>
                        <td className="px-4 py-3 text-emerald-600 font-semibold tabular">
                          {currency(inv.paidAmount ?? (inv.status === 'Paid' ? inv.amount + inv.tax : 0))}
                        </td>
                        <td className="px-4 py-3">{formatDate(inv.dueOn)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={inv.status} />
                        </td>
                      </tr>
                    ))
                  ) : activeTable === 'hearings' ? (
                    filteredData.map((h: any) => (
                      <tr key={h.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-mono font-medium text-navy-900">{h.id}</td>
                        <td className="px-4 py-3 font-mono">{h.caseId}</td>
                        <td className="px-4 py-3 font-medium">
                          {formatDate(h.date)} · {h.time}
                        </td>
                        <td className="px-4 py-3 max-w-[180px] truncate">{h.court}</td>
                        <td className="px-4 py-3">{h.judge}</td>
                        <td className="px-4 py-3">{h.purpose}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={h.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredData.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-navy-50/50">
                        {Object.values(row).slice(0, 7).map((val: any, j: number) => (
                          <td key={j} className="px-4 py-3 max-w-[200px] truncate">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="p-4 bg-navy-950 rounded-b-2xl overflow-auto max-h-[550px]">
            <pre className="font-mono text-xs text-emerald-400 whitespace-pre">
              {JSON.stringify(filteredData, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}