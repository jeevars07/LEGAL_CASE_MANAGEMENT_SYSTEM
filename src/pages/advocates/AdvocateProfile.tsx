import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, KeyValue } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/States';
import { SectionCard } from '../../components/dashboard/SectionCard';
import { HearingRows } from '../../components/dashboard/HearingRows';
import { CaseRows } from '../../components/cases/CaseRows';
import { useApp } from '../../contexts/AppContext';
import { upcomingHearings } from '../../utils/selectors';

export function AdvocateProfile() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { advocates, cases, hearings } = useApp();
  const advocate = advocates.find((a) => a.id === id);

  if (!advocate) {
    return (
      <Card>
        <EmptyState
          title="Advocate not found"
          message="This profile is no longer available."
          action={
          <Button variant="primary" onClick={() => navigate('/advocates')}>
              Back to advocates
            </Button>
          } />
        
      </Card>);

  }

  const theirCases = cases.filter((c) => c.advocateId === advocate.id);
  const caseIds = new Set(theirCases.map((c) => c.id));
  const theirHearings = upcomingHearings(hearings).filter((h) => caseIds.has(h.caseId));

  const stats = [
  { label: 'Total Cases', value: theirCases.length },
  { label: 'Active Cases', value: theirCases.filter((c) => c.status === 'Active').length },
  { label: 'Completed Cases', value: theirCases.filter((c) => c.status === 'Closed').length },
  { label: 'Upcoming Hearings', value: theirHearings.length }];


  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/advocates')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-navy-500 transition-colors duration-150 ease-smooth hover:text-navy-900">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
        All advocates
      </button>

      <PageHeader
        title={
        <span className="flex items-center gap-3">
            <Avatar name={advocate.name} size="lg" className="hidden sm:inline-flex" />
            {advocate.name}
          </span>
        }
        meta={
        <>
            <span className="text-[12px] font-medium text-navy-500 tabular">{advocate.id}</span>
            <StatusBadge status={advocate.status} />
            <span className="text-[12px] text-navy-400">{advocate.specialization}</span>
          </>
        }
        actions={
        <Button variant="secondary" onClick={() => navigate('/assignments')}>
            Manage assignments
          </Button>
        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) =>
        <Card key={s.label} className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">{s.label}</p>
            <p className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-navy-900 tabular">{s.value}</p>
          </Card>
        )}
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2.5">
            <h3 className="text-[13px] font-semibold text-navy-900">Contact</h3>
            <p className="flex items-center gap-2.5 text-[13px] text-navy-700">
              <MailIcon className="h-4 w-4 text-navy-300" aria-hidden />
              {advocate.email}
            </p>
            <p className="flex items-center gap-2.5 text-[13px] text-navy-700 tabular">
              <PhoneIcon className="h-4 w-4 text-navy-300" aria-hidden />
              {advocate.phone}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-5 sm:col-span-2">
            <KeyValue label="Bar number">{advocate.barNumber}</KeyValue>
            <KeyValue label="Experience">{advocate.yearsExperience} years</KeyValue>
            <KeyValue label="Specialisation">{advocate.specialization}</KeyValue>
            <KeyValue label="Availability">{advocate.status}</KeyValue>
          </dl>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard index={0} title="Assigned Cases" description="Matters where this advocate is lead counsel" className="xl:col-span-2">
          {theirCases.length === 0 ?
          <EmptyState title="No cases assigned" message="Assign a matter from the assignments board." /> :

          <CaseRows items={theirCases} variant="compact" />
          }
        </SectionCard>
        <SectionCard index={1} title="Upcoming Hearings" description="Listings in date order" footerTo="/hearings/upcoming">
          <HearingRows hearings={theirHearings} showCourt={false} />
        </SectionCard>
      </div>
    </div>);

}