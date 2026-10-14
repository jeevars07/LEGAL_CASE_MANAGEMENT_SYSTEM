import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  CalendarPlusIcon,
  FilePlusIcon,
  FileTextIcon,
  GavelIcon,
  PlusIcon,
  UploadIcon,
  UserPlusIcon,
  UsersIcon } from
'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { CardSkeleton, TableSkeleton } from '../../components/ui/States';
import { SectionCard } from '../../components/dashboard/SectionCard';
import { CaseMixChart, RevenueChart } from '../../components/dashboard/Charts';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { HearingRows } from '../../components/dashboard/HearingRows';
import { CaseRows } from '../../components/cases/CaseRows';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { revenueByMonth } from '../../data/billing';
import { currency } from '../../utils/format';
import { greeting, invoiceBalance, invoicePaid, invoiceTotal, upcomingHearings } from '../../utils/selectors';

export function AdminDashboard() {
  const { currentUser, cases, clients, hearings, invoices, activity } = useApp();
  const { loading } = useSimulatedLoad();
  const navigate = useNavigate();

  const active = cases.filter((c) => c.status === 'Active');
  const pending = cases.filter((c) => c.status === 'Pending');
  const closed = cases.filter((c) => c.status === 'Closed');
  const nextHearings = upcomingHearings(hearings);

  const paid = invoices.reduce((s, i) => s + invoicePaid(i), 0);
  const outstanding = invoices.reduce((s, i) => s + invoiceBalance(i), 0);
  const totalBilled = invoices.reduce((s, i) => s + invoiceTotal(i), 0);

  const quickActions = [
  { label: 'New Case', to: '/cases/new', icon: PlusIcon },
  { label: 'New Client', to: '/clients/new', icon: UserPlusIcon },
  { label: 'Schedule Hearing', to: '/hearings/calendar', icon: CalendarPlusIcon },
  { label: 'Upload Document', to: '/documents', icon: UploadIcon },
  { label: 'Create Report', to: '/reports/cases', icon: FilePlusIcon }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting(currentUser?.name ?? 'Admin')}
        subtitle="Here’s what’s happening across your legal practice."
        actions={
        <>
            <Button variant="secondary" icon={<UserPlusIcon className="h-4 w-4" />} onClick={() => navigate('/clients/new')}>
              New Client
            </Button>
            <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />} onClick={() => navigate('/cases/new')}>
              New Case
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ?
        Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) :

        <>
            <StatCard
            index={0}
            label="Total Cases"
            value={cases.length}
            trend={8}
            icon={<BriefcaseIcon className="h-4 w-4" />}
            description={`${active.length} active · ${pending.length} pending`}
            emphasis />
          
            <StatCard
            index={1}
            label="Active Cases"
            value={active.length}
            trend={4}
            icon={<GavelIcon className="h-4 w-4" />}
            description="Matters currently before the courts" />
          
            <StatCard
            index={2}
            label="Total Clients"
            value={clients.length}
            trend={12}
            icon={<UsersIcon className="h-4 w-4" />}
            description={`${clients.filter((c) => c.status === 'Active').length} with open matters`} />
          
            <StatCard
            index={3}
            label="Upcoming Hearings"
            value={nextHearings.length}
            trend={-3}
            icon={<CalendarPlusIcon className="h-4 w-4" />}
            description="Listed over the next 30 days" />
          
          </>
        }
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          index={0}
          title="Upcoming Hearings"
          description="Next listings across the practice"
          className="xl:col-span-2"
          footerTo="/hearings/upcoming"
          footerLabel="View hearing schedule">
          
          {loading ? <TableSkeleton rows={5} cols={5} /> : <HearingRows hearings={nextHearings.slice(0, 5)} />}
        </SectionCard>

        <SectionCard
          index={1}
          title="Case Overview"
          description="Distribution by current status"
          footerTo="/reports/cases"
          footerLabel="Open case report">
          
          {loading ?
          <div className="p-5">
              <CardSkeleton className="border-0 p-0 shadow-none" />
            </div> :

          <CaseMixChart
            data={[
            { name: 'Active', value: active.length, color: '#10b981' },
            { name: 'Pending', value: pending.length, color: '#f59e0b' },
            { name: 'Closed', value: closed.length, color: '#c9d2e3' }]
            } />

          }
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          index={2}
          title="Recent Cases"
          description="Most recently registered matters"
          className="xl:col-span-2"
          footerTo="/cases"
          footerLabel="View all cases">
          
          {loading ? <TableSkeleton rows={5} cols={6} /> : <CaseRows items={cases.slice(0, 5)} variant="compact" />}
        </SectionCard>

        <SectionCard index={3} title="Recent Activity" description="Latest updates by your team">
          {loading ? <TableSkeleton rows={5} cols={2} /> : <ActivityFeed items={activity.slice(0, 6)} />}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          index={4}
          title="Financial Overview"
          description="Billing performance across the last seven months"
          className="xl:col-span-2"
          footerTo="/reports/financial"
          footerLabel="Open financial report">
          
          <div className="grid grid-cols-1 divide-y divide-navy-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
            { label: 'Total Revenue', value: currency(totalBilled), tone: 'text-navy-900' },
            { label: 'Paid Fees', value: currency(paid), tone: 'text-emerald-600' },
            { label: 'Pending Fees', value: currency(outstanding), tone: 'text-amber-600' }].
            map((stat) =>
            <div key={stat.label} className="px-5 py-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">
                  {stat.label}
                </p>
                <p className={`mt-1 text-xl font-semibold tracking-[-0.02em] tabular ${stat.tone}`}>
                  {stat.value}
                </p>
              </div>
            )}
          </div>
          <RevenueChart data={revenueByMonth} />
        </SectionCard>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-xl border border-navy-200/80 bg-white p-5 shadow-card">
          
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-navy-900">Quick Actions</h2>
          <p className="mt-0.5 text-[13px] text-navy-400">Common tasks for your practice</p>
          <div className="mt-4 space-y-2">
            {quickActions.map((action) =>
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center gap-3 rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-[13px] font-medium text-navy-800 transition-[border-color,background-color,transform] duration-150 ease-smooth hover:border-navy-300 hover:bg-navy-50 active:scale-[0.99]">
              
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-50 text-navy-500 transition-colors duration-150 ease-smooth group-hover:bg-navy-900 group-hover:text-white">
                  <action.icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                {action.label}
              </Link>
            )}
          </div>
          <Link
            to="/documents/recent"
            className="mt-4 flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2.5 text-[12px] text-navy-500 transition-colors duration-150 ease-smooth hover:bg-navy-100">
            
            <FileTextIcon className="h-3.5 w-3.5" aria-hidden />
            3 documents are awaiting verification
          </Link>
        </motion.section>
      </div>
    </div>);

}