import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, CalendarDaysIcon, FilesIcon, WalletIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { CardSkeleton, EmptyState, TableSkeleton } from '../../components/ui/States';
import { SectionCard } from '../../components/dashboard/SectionCard';
import { HearingRows } from '../../components/dashboard/HearingRows';
import { StatusBadge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { currency, formatDate } from '../../utils/format';
import { advocateName, invoiceBalance, invoiceTotal, upcomingHearings, visibleCases, visibleInvoices } from '../../utils/selectors';

export function ClientDashboard() {
  const { currentUser, cases, hearings, documents, invoices, advocates } = useApp();
  const { loading } = useSimulatedLoad();

  const myCases = visibleCases(cases, currentUser);
  const myCaseIds = new Set(myCases.map((c) => c.id));
  const myHearings = upcomingHearings(hearings).filter((h) => myCaseIds.has(h.caseId));
  const myDocs = documents.filter((d) => myCaseIds.has(d.caseId));
  const myInvoices = visibleInvoices(invoices, currentUser, cases);
  const outstanding = myInvoices.reduce((s, i) => s + invoiceBalance(i), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back"
        subtitle={`A summary of your matters with Harbor Law. Your point of contact is ${
        myCases[0] ? advocateName(advocates, myCases[0].advocateId) : 'your assigned advocate'}.`
        } />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ?
        Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) :

        <>
            <StatCard
            index={0}
            emphasis
            label="My Active Cases"
            value={myCases.filter((c) => c.status === 'Active').length}
            icon={<BriefcaseIcon className="h-4 w-4" />}
            description={`${myCases.length} matters in total`} />
          
            <StatCard
            index={1}
            label="Upcoming Hearings"
            value={myHearings.length}
            icon={<CalendarDaysIcon className="h-4 w-4" />}
            description={myHearings[0] ? `Next on ${formatDate(myHearings[0].date)}` : 'Nothing listed'} />
          
            <StatCard
            index={2}
            label="Pending Fees"
            value={outstanding}
            format="currency"
            icon={<WalletIcon className="h-4 w-4" />}
            description={`${myInvoices.filter((i) => i.status !== 'Paid').length} invoices awaiting payment`} />
          
            <StatCard
            index={3}
            label="Documents"
            value={myDocs.length}
            icon={<FilesIcon className="h-4 w-4" />}
            description="Shared with you" />
          
          </>
        }
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard index={0} title="My Cases" description="Current status of each matter" className="xl:col-span-2">
          {loading ?
          <TableSkeleton rows={3} cols={4} /> :
          myCases.length === 0 ?
          <EmptyState title="No cases yet" message="Once your matter is registered it will appear here." /> :

          <ul className="divide-y divide-navy-100">
              {myCases.map((c) =>
            <li key={c.id}>
                  <Link
                to={`/cases/${c.id}`}
                className="flex flex-col gap-2 px-5 py-4 transition-colors duration-150 ease-smooth hover:bg-navy-50/70 sm:flex-row sm:items-center sm:gap-4">
                
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy-900">{c.title}</p>
                      <p className="mt-0.5 text-[12px] text-navy-400">
                        {c.caseNumber} · {advocateName(advocates, c.advocateId)} · {c.stage}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] text-navy-500">
                        {c.nextHearing ? `Next hearing ${formatDate(c.nextHearing)}` : 'No hearing listed'}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>
                  </Link>
                </li>
            )}
            </ul>
          }
        </SectionCard>

        <SectionCard index={1} title="Billing Summary" description="Invoices raised on your matters" footerTo="/billing/invoices">
          <div className="border-b border-navy-100 px-5 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">
              Outstanding balance
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-navy-900 tabular">
              {currency(outstanding)}
            </p>
          </div>
          <ul className="divide-y divide-navy-100">
            {myInvoices.slice(0, 4).map((inv) =>
            <li key={inv.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <Link to={`/billing/invoices/${inv.id}`} className="text-[13px] font-medium text-navy-900 hover:text-brand-700 transition-colors">
                    {inv.id}
                  </Link>
                  <p className="text-[11px] text-navy-400">Due {formatDate(inv.dueOn)}</p>
                </div>
                <div className="text-right">
                  <span className="block text-[13px] font-medium text-navy-800 tabular">
                    {inv.status === 'Partially Paid' ? currency(invoiceBalance(inv)) : currency(invoiceTotal(inv))}
                  </span>
                  {inv.status === 'Partially Paid' && (
                    <span className="text-[10px] text-brand-600 block">Bal Due</span>
                  )}
                </div>
                <StatusBadge status={inv.status} />
              </li>
            )}
          </ul>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          index={2}
          title="Upcoming Hearings"
          description="Dates you may need to attend"
          className="xl:col-span-2"
          footerTo="/hearings/upcoming">
          
          {loading ? <TableSkeleton rows={3} cols={5} /> : <HearingRows hearings={myHearings} showCourt={false} />}
        </SectionCard>

        <SectionCard index={3} title="Recent Documents" description="Filed on your matters" footerTo="/documents">
          <ul className="divide-y divide-navy-100">
            {myDocs.slice(0, 5).map((d) =>
            <li key={d.id} className="px-5 py-3">
                <p className="truncate text-[13px] font-medium text-navy-900">{d.name}</p>
                <p className="mt-0.5 text-[11px] text-navy-400">
                  {d.type} · {formatDate(d.uploadedOn)} · {d.size}
                </p>
              </li>
            )}
          </ul>
        </SectionCard>
      </div>
    </div>);

}