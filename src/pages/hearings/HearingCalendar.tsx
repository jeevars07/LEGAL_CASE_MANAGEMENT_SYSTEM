import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek } from
'date-fns';
import { CalendarPlusIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/States';
import { ScheduleHearingModal } from '../../components/hearings/ScheduleHearingModal';
import { useApp } from '../../contexts/AppContext';
import { cn, formatLongDate, TODAY } from '../../utils/format';
import { advocateName, visibleCases } from '../../utils/selectors';

export function HearingCalendar() {
  const { hearings, cases, advocates, currentUser } = useApp();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(parseISO('2026-08-01'));
  const [selected, setSelected] = useState(TODAY);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const scopedIds = new Set(visibleCases(cases, currentUser).map((c) => c.id));
  const scoped = hearings.filter((h) => scopedIds.has(h.caseId));
  const canSchedule = currentUser?.role !== 'client';

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const byDate = useMemo(() => {
    const map = new Map<string, typeof scoped>();
    scoped.forEach((h) => map.set(h.date, [...(map.get(h.date) ?? []), h]));
    return map;
  }, [scoped]);

  const selectedHearings = (byDate.get(selected) ?? []).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hearing Calendar"
        subtitle="Court listings across the practice, by date."
        actions={
        <>
            <Button
            variant="secondary"
            icon={<ListIcon className="h-4 w-4" />}
            onClick={() => navigate('/hearings/upcoming')}>
            
              List view
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
      

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-navy-900">
              {format(cursor, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCursor(addMonths(cursor, -1))}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-500 transition-colors duration-150 ease-smooth hover:bg-navy-50 hover:text-navy-800">
                
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCursor(parseISO('2026-08-01'))}
                className="h-8 rounded-lg border border-navy-200 px-2.5 text-[12px] font-medium text-navy-600 transition-colors duration-150 ease-smooth hover:bg-navy-50">
                
                Today
              </button>
              <button
                onClick={() => setCursor(addMonths(cursor, 1))}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-500 transition-colors duration-150 ease-smooth hover:bg-navy-50 hover:text-navy-800">
                
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-navy-100 bg-navy-50/60">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) =>
            <div
              key={d}
              className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-400">
              
                {d}
              </div>
            )}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const iso = format(day, 'yyyy-MM-dd');
              const items = byDate.get(iso) ?? [];
              const inMonth = isSameMonth(day, cursor);
              const isToday = iso === TODAY;
              const isSelected = iso === selected;
              return (
                <button
                  key={iso}
                  onClick={() => setSelected(iso)}
                  className={cn(
                    'relative min-h-[86px] border-b border-r border-navy-100 p-2 text-left transition-colors duration-150 ease-smooth last:border-r-0 hover:bg-navy-50/70',
                    !inMonth && 'bg-navy-50/40',
                    isSelected && 'bg-brand-50/60'
                  )}>
                  
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium tabular',
                      isToday ? 'bg-navy-900 text-white' : inMonth ? 'text-navy-700' : 'text-navy-300'
                    )}>
                    
                    {format(day, 'd')}
                  </span>
                  <span className="mt-1 block space-y-1">
                    {items.slice(0, 2).map((h) =>
                    <span
                      key={h.id}
                      className={cn(
                        'block truncate rounded px-1.5 py-0.5 text-[10px] font-medium',
                        h.status === 'Completed' ?
                        'bg-emerald-50 text-emerald-700' :
                        h.status === 'Adjourned' ?
                        'bg-amber-50 text-amber-700' :
                        'bg-brand-50 text-brand-700'
                      )}>
                      
                        {h.time} {h.caseId}
                      </span>
                    )}
                    {items.length > 2 &&
                    <span className="block px-1.5 text-[10px] text-navy-400">+{items.length - 2} more</span>
                    }
                  </span>
                </button>);

            })}
          </div>
        </Card>

        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          
          <Card className="xl:sticky xl:top-24">
            <CardHeader
              title={format(parseISO(selected), 'dd MMM yyyy')}
              description={formatLongDate(selected)} />
            
            {selectedHearings.length === 0 ?
            <EmptyState
              title="No hearings on this date"
              message="Select another date, or schedule a listing for this day."
              action={
              canSchedule ?
              <Button variant="secondary" onClick={() => setScheduleOpen(true)}>
                      Schedule Hearing
                    </Button> :
              undefined
              } /> :


            <ul className="divide-y divide-navy-100">
                {selectedHearings.map((h) => {
                const matter = cases.find((c) => c.id === h.caseId);
                return (
                  <li key={h.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[13px] font-semibold text-navy-900 tabular">{h.time}</span>
                        <StatusBadge status={h.status} />
                      </div>
                      <Link
                      to={`/cases/${h.caseId}`}
                      className="mt-1.5 block text-[13px] font-medium text-navy-900 underline-offset-2 hover:text-brand-700 hover:underline">
                      
                        {matter?.title ?? h.caseId}
                      </Link>
                      <p className="mt-1 text-[12px] text-navy-500">{h.purpose}</p>
                      <p className="mt-1 text-[11px] text-navy-400">
                        {h.court} · {h.judge}
                      </p>
                      {matter &&
                    <p className="mt-1 text-[11px] text-navy-400">
                          {advocateName(advocates, matter.advocateId)}
                        </p>
                    }
                    </li>);

              })}
              </ul>
            }
          </Card>
        </motion.div>
      </div>

      <ScheduleHearingModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        defaultDate={selected} />
      
    </div>);

}