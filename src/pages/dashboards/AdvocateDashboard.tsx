import React from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, ClockIcon, FileClockIcon, GavelIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { CardSkeleton, TableSkeleton } from '../../components/ui/States';
import { SectionCard } from '../../components/dashboard/SectionCard';
import { HearingRows } from '../../components/dashboard/HearingRows';
import { CaseRows } from '../../components/cases/CaseRows';
import { Badge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { formatDate, TODAY } from '../../utils/format';
import { greeting, upcomingHearings, visibleCases } from '../../utils/selectors';

export function AdvocateDashboard() {
  const { currentUser, cases, hearings, documents, proceedings } = useApp();
  const { loading } = useSimulatedLoad();

  const myCases = visibleCases(cases, currentUser);
  const myCaseIds = new Set(myCases.map((c) => c.id));
  const myHearings = upcomingHearings(hearings).filter((h) => myCaseIds.has(h.caseId));
  const todays = hearings.filter((h) => h.date === TODAY && myCaseIds.has(h.caseId));
  const myDocs = documents.filter((d) => myCaseIds.has(d.caseId));
  const pendingDocs = myDocs.filter((d) => d.status === 'Pending Review');
  const myProceedings = proceedings.
  filter((p) => myCaseIds.has(p.caseId)).
  sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting(currentUser?.name ?? 'Advocate')}
        subtitle="Your assigned matters, listings and filings for today."
        meta={
        <>
            <Badge tone="blue" dot>
              {todays.length} hearing{todays.length === 1 ? '' : 's'} today
            </Badge>
            <Badge tone="amber" dot>
              {pendingDocs.length} documents awaiting review
            </Badge>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ?
        Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) :

        <>
            <StatCard
            index={0}
            emphasis
            label="Assigned Cases"
            value={myCases.length}
            icon={<BriefcaseIcon className="h-4 w-4" />}
            description="Matters allocated to you" />
          
            <StatCard
            index={1}
            label="Active Cases"
            value={myCases.filter((c) => c.status === 'Active').length}
            icon={<GavelIcon className="h-4 w-4" />}
            description="Currently before the courts" />
          
            <StatCard
            index={2}
            label="Today’s Hearings"
            value={todays.length}
            icon={<ClockIcon className="h-4 w-4" />}
            description={formatDate(TODAY)} />
          
            <StatCard
            index={3}
            label="Pending Documents"
            value={pendingDocs.length}
            icon={<FileClockIcon className="h-4 w-4" />}
            description="Filed but not yet verified" />
          
          </>
        }
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          index={0}
          title="My Cases"
          description="Matters where you are lead counsel"
          className="xl:col-span-2"
          footerTo="/cases"
          footerLabel="View all my cases">
          
          {loading ? <TableSkeleton rows={5} cols={6} /> : <CaseRows items={myCases.slice(0, 6)} variant="compact" />}
        </SectionCard>

        <SectionCard
          index={1}
          title="Recent Proceedings"
          description="Latest updates recorded on your matters">
          
          {loading ?
          <TableSkeleton rows={5} cols={2} /> :

          <ol className="divide-y divide-navy-100">
              {myProceedings.slice(0, 5).map((p, i) =>
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
              className="px-5 py-3">
              
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-medium text-navy-900">{p.title}</p>
                    <span className="shrink-0 text-[11px] text-navy-400">{formatDate(p.date)}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-navy-500">{p.detail}</p>
                  <p className="mt-1 text-[11px] text-navy-400">{p.caseId} · {p.updatedBy}</p>
                </motion.li>
            )}
            </ol>
          }
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          index={2}
          title="Upcoming Hearings"
          description="Your listings in date order"
          className="xl:col-span-2"
          footerTo="/hearings/upcoming">
          
          {loading ? <TableSkeleton rows={4} cols={5} /> : <HearingRows hearings={myHearings.slice(0, 5)} />}
        </SectionCard>

        <SectionCard index={3} title="Recent Documents" description="Filed to your matters" footerTo="/documents">
          <ul className="divide-y divide-navy-100">
            {myDocs.slice(0, 5).map((d) =>
            <li key={d.id} className="px-5 py-3">
                <p className="truncate text-[13px] font-medium text-navy-900">{d.name}</p>
                <p className="mt-0.5 text-[11px] text-navy-400">
                  {d.type} · {d.caseId} · {formatDate(d.uploadedOn)}
                </p>
              </li>
            )}
          </ul>
        </SectionCard>
      </div>
    </div>);

}