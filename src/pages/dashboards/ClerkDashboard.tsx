import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  CalendarPlusIcon,
  ClipboardListIcon,
  ClockIcon,
  ReceiptTextIcon,
  UploadIcon,
  UserPlusIcon,
  UsersIcon } from
'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { CardSkeleton, TableSkeleton } from '../../components/ui/States';
import { SectionCard } from '../../components/dashboard/SectionCard';
import { HearingRows } from '../../components/dashboard/HearingRows';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { formatDate, TODAY } from '../../utils/format';
import { greeting, upcomingHearings } from '../../utils/selectors';

const tasks = [
{ label: 'Verify rota records filed to LC-1019', due: 'Due today', to: '/documents' },
{ label: 'Serve hearing notice — LC-1024', due: 'Due today', to: '/hearings/upcoming' },
{ label: 'Issue invoice for July on LC-1017', due: 'Due tomorrow', to: '/billing/invoices' },
{ label: 'Collect ID documents — R. Hayes', due: 'Due 16 Aug', to: '/clients/CL-1008' },
{ label: 'File reply bundle — LC-1022', due: 'Due 18 Aug', to: '/cases/LC-1022' }];


export function ClerkDashboard() {
  const { currentUser, clients, cases, hearings, activity } = useApp();
  const { loading } = useSimulatedLoad();

  const todays = hearings.filter((h) => h.date === TODAY);

  const quickActions = [
  { label: 'Register Client', to: '/clients/new', icon: UserPlusIcon },
  { label: 'Register Case', to: '/cases/new', icon: BriefcaseIcon },
  { label: 'Schedule Hearing', to: '/hearings/calendar', icon: CalendarPlusIcon },
  { label: 'Upload Document', to: '/documents', icon: UploadIcon },
  { label: 'Update Billing', to: '/billing/invoices', icon: ReceiptTextIcon }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting(currentUser?.name ?? 'Clerk')}
        subtitle="Registrations, listings and filings that need your attention today." />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ?
        Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) :

        <>
            <StatCard
            index={0}
            emphasis
            label="Total Clients"
            value={clients.length}
            icon={<UsersIcon className="h-4 w-4" />}
            description={`${clients.filter((c) => c.status === 'Active').length} active accounts`} />
          
            <StatCard
            index={1}
            label="Registered Cases"
            value={cases.length}
            icon={<BriefcaseIcon className="h-4 w-4" />}
            description="Across all advocates" />
          
            <StatCard
            index={2}
            label="Today’s Hearings"
            value={todays.length}
            icon={<ClockIcon className="h-4 w-4" />}
            description={formatDate(TODAY)} />
          
            <StatCard
            index={3}
            label="Pending Tasks"
            value={tasks.length}
            icon={<ClipboardListIcon className="h-4 w-4" />}
            description="2 due today" />
          
          </>
        }
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          index={0}
          title="Today’s Listings"
          description="Hearings requiring notices and attendance records"
          className="xl:col-span-2"
          footerTo="/hearings/calendar"
          footerLabel="Open hearing calendar">
          
          {loading ? <TableSkeleton rows={3} cols={5} /> : <HearingRows hearings={todays} />}
        </SectionCard>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.09, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-xl border border-navy-200/80 bg-white p-5 shadow-card">
          
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-navy-900">Quick Actions</h2>
          <p className="mt-0.5 text-[13px] text-navy-400">Registry and filing shortcuts</p>
          <div className="mt-4 space-y-2">
            {quickActions.map((action) =>
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center gap-3 rounded-lg border border-navy-200 px-3 py-2.5 text-[13px] font-medium text-navy-800 transition-[border-color,background-color,transform] duration-150 ease-smooth hover:border-navy-300 hover:bg-navy-50 active:scale-[0.99]">
              
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-50 text-navy-500 transition-colors duration-150 ease-smooth group-hover:bg-navy-900 group-hover:text-white">
                  <action.icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                {action.label}
              </Link>
            )}
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard index={1} title="Pending Tasks" description="Assigned to you this week" className="xl:col-span-2">
          <ul className="divide-y divide-navy-100">
            {tasks.map((task, i) =>
            <motion.li
              key={task.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.24, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}>
              
                <Link
                to={task.to}
                className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 ease-smooth hover:bg-navy-50/70">
                
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  <span className="flex-1 text-[13px] text-navy-800">{task.label}</span>
                  <span className="shrink-0 text-[11px] font-medium text-navy-400">{task.due}</span>
                </Link>
              </motion.li>
            )}
          </ul>
        </SectionCard>

        <SectionCard index={2} title="Recent Activity" description="Across the practice">
          {loading ? <TableSkeleton rows={5} cols={2} /> : <ActivityFeed items={activity.slice(0, 6)} />}
        </SectionCard>
      </div>
    </div>);

}