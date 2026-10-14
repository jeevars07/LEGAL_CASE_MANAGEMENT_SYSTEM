import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, CalendarPlusIcon, ClockIcon, MapPinIcon, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { ConfirmDialog } from '../../components/ui/Modal';
import { EmptyState, TableSkeleton } from '../../components/ui/States';
import { ScheduleHearingModal } from '../../components/hearings/ScheduleHearingModal';
import { HearingRows } from '../../components/dashboard/HearingRows';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { formatDate } from '../../utils/format';
import { advocateName, clientName, pastHearings, upcomingHearings, visibleCases } from '../../utils/selectors';
import type { Hearing } from '../../types';

export function UpcomingHearings() {
  const { hearings, cases, clients, advocates, currentUser, removeHearing } = useApp();
  const { loading } = useSimulatedLoad();
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [cancelling, setCancelling] = useState<Hearing | null>(null);

  const scopedIds = new Set(visibleCases(cases, currentUser).map((c) => c.id));
  const scoped = hearings.filter((h) => scopedIds.has(h.caseId));
  const upcoming = upcomingHearings(scoped);
  const past = pastHearings(scoped);
  const canSchedule = currentUser?.role !== 'client';

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentUser?.role === 'client' ? 'My Hearings' : 'Upcoming Hearings'}
        subtitle="Listings in date order with court, purpose and attending counsel."
        actions={
        <>
            <Button
            variant="secondary"
            icon={<CalendarDaysIcon className="h-4 w-4" />}
            onClick={() => navigate('/hearings/calendar')}>
            
              Calendar view
            </Button>
            {canSchedule &&
          <Button
            variant="primary"
            icon={<CalendarPlusIcon className="h-4 w-4" />}
            onClick={() => setScheduleOpen(true)}>
            
                Schedule Hearing
              </Button>
          }
          </>
        } />
      

      <div className="px-1">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
          { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { id: 'past', label: 'Past & adjourned', count: past.length }]
          } />
        
      </div>

      {loading ?
      <Card>
          <TableSkeleton rows={5} cols={5} />
        </Card> :
      tab === 'upcoming' ?
      upcoming.length === 0 ?
      <Card>
            <EmptyState
          title="No hearings scheduled"
          message="Nothing is listed at present. Schedule a hearing to add it to the calendar."
          action={
          canSchedule ?
          <Button variant="primary" onClick={() => setScheduleOpen(true)}>
                    Schedule Hearing
                  </Button> :
          undefined
          } />
        
          </Card> :

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {upcoming.map((h, i) => {
          const matter = cases.find((c) => c.id === h.caseId);
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}>
              
                  <Card className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-semibold text-navy-900">{formatDate(h.date)}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-navy-500 tabular">
                          <ClockIcon className="h-3.5 w-3.5 text-navy-300" aria-hidden />
                          {h.time}
                        </p>
                      </div>
                      <StatusBadge status={h.status} />
                    </div>

                    <Link
                  to={`/cases/${h.caseId}`}
                  className="mt-4 block text-sm font-medium text-navy-900 underline-offset-2 hover:text-brand-700 hover:underline">
                  
                      {matter?.title ?? h.caseId}
                    </Link>
                    <p className="mt-1 text-[12px] text-navy-400">
                      {h.caseId} · {matter ? clientName(clients, matter.clientId) : '—'}
                    </p>

                    <dl className="mt-4 space-y-2 text-[12px]">
                      <div className="flex gap-2">
                        <dt className="w-16 shrink-0 text-navy-400">Purpose</dt>
                        <dd className="text-navy-700">{h.purpose}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-16 shrink-0 text-navy-400">Advocate</dt>
                        <dd className="text-navy-700">
                          {matter ? advocateName(advocates, matter.advocateId) : '—'}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-16 shrink-0 text-navy-400">Court</dt>
                        <dd className="flex items-start gap-1.5 text-navy-700">
                          <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-300" aria-hidden />
                          {h.court}
                        </dd>
                      </div>
                    </dl>

                    {canSchedule &&
                <div className="mt-auto flex items-center gap-2 border-t border-navy-100 pt-4">
                        <Button size="sm" variant="secondary" onClick={() => setScheduleOpen(true)}>
                          Edit
                        </Button>
                        <Button
                    size="sm"
                    variant="ghost"
                    icon={<XCircleIcon className="h-3.5 w-3.5" />}
                    onClick={() => setCancelling(h)}>
                    
                          Cancel
                        </Button>
                      </div>
                }
                  </Card>
                </motion.div>);

        })}
          </div> :


      <Card>
          <HearingRows hearings={past} />
        </Card>
      }

      <ScheduleHearingModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <ConfirmDialog
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        confirmLabel="Cancel hearing"
        title="Cancel this hearing?"
        message={`The listing on ${cancelling ? formatDate(cancelling.date) : ''} will be removed from the calendar and the advocate notified.`}
        onConfirm={() => {
          if (cancelling) {
            removeHearing(cancelling.id);
            toast.success('Hearing cancelled', { description: `${cancelling.caseId} listing removed.` });
          }
          setCancelling(null);
        }} />
      
    </div>);

}