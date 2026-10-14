import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DownloadIcon, FileBarChart2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Field, Input, Select } from '../components/ui/Field';
import { TBody, TD, TH, THead, TR, TableWrap } from '../components/ui/Table';
import { CaseflowChart, CaseMixChart, RevenueChart } from '../components/dashboard/Charts';
import { useApp } from '../contexts/AppContext';
import { caseflowByMonth, revenueByMonth } from '../data/billing';
import { currency, formatDate } from '../utils/format';
import { advocateName, clientName, invoiceBalance, invoicePaid, invoiceTotal } from '../utils/selectors';
import { cn } from '../utils/format';

type Kind = 'cases' | 'clients' | 'hearings' | 'advocates' | 'financial';

const reportCards: Array<{kind: Kind;title: string;description: string;}> = [
{ kind: 'cases', title: 'Case Report', description: 'Volumes, status mix and filing trends' },
{ kind: 'clients', title: 'Client Report', description: 'Client base, matters and fee exposure' },
{ kind: 'hearings', title: 'Hearing Report', description: 'Listings, outcomes and adjournments' },
{ kind: 'advocates', title: 'Advocate Report', description: 'Caseload and completion by counsel' },
{ kind: 'financial', title: 'Financial Report', description: 'Billed, collected and outstanding fees' }];


export function Reports() {
  const { kind = 'cases' } = useParams<{kind: Kind;}>();
  const navigate = useNavigate();
  const { cases, clients, advocates, hearings, invoices } = useApp();
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('2026-08-31');
  const [status, setStatus] = useState('All');

  const active = (reportCards.find((r) => r.kind === kind) ?? reportCards[0]).title;

  const filteredCases = useMemo(
    () =>
    cases.filter(
      (c) => c.filedOn >= from && c.filedOn <= to && (status === 'All' || c.status === status)
    ),
    [cases, from, to, status]
  );

  const exportReport = () =>
  toast.success('Export queued', {
    description: `${active} for ${formatDate(from)} – ${formatDate(to)} will download as CSV.`
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Practice reporting across matters, clients, listings and fees."
        actions={
        <Button variant="primary" icon={<DownloadIcon className="h-4 w-4" />} onClick={exportReport}>
            Export
          </Button>
        } />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {reportCards.map((card, i) =>
        <motion.button
          key={card.kind}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
          onClick={() => navigate(`/reports/${card.kind}`)}
          className={cn(
            'rounded-xl border bg-white p-4 text-left shadow-card transition-[border-color,box-shadow,transform] duration-150 ease-smooth hover:shadow-raised active:scale-[0.99]',
            kind === card.kind ? 'border-navy-900' : 'border-navy-200/80 hover:border-navy-300'
          )}>
          
            <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              kind === card.kind ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-500'
            )}>
            
              <FileBarChart2Icon className="h-4 w-4" aria-hidden />
            </span>
            <p className="mt-3 text-[13px] font-semibold text-navy-900">{card.title}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-navy-400">{card.description}</p>
          </motion.button>
        )}
      </div>

      <Card>
        <CardHeader title={active} description="Adjust the range and filters, then export the results." />
        <div className="grid grid-cols-1 gap-4 border-b border-navy-100 p-5 sm:grid-cols-4">
          <Field label="From" htmlFor="from">
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To" htmlFor="to">
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
          <Field label="Status" htmlFor="rstatus">
            <Select id="rstatus" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <Button variant="secondary" className="w-full" icon={<DownloadIcon className="h-4 w-4" />} onClick={exportReport}>
              Export CSV
            </Button>
          </div>
        </div>

        {kind === 'cases' &&
        <>
            <div className="grid grid-cols-1 divide-y divide-navy-100 border-b border-navy-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <CaseMixChart
              data={[
              { name: 'Active', value: filteredCases.filter((c) => c.status === 'Active').length, color: '#10b981' },
              { name: 'Pending', value: filteredCases.filter((c) => c.status === 'Pending').length, color: '#f59e0b' },
              { name: 'Closed', value: filteredCases.filter((c) => c.status === 'Closed').length, color: '#c9d2e3' }]
              } />
            
              <CaseflowChart data={caseflowByMonth} />
            </div>
            <TableWrap>
              <THead>
                <TH>Case ID</TH>
                <TH>Title</TH>
                <TH>Type</TH>
                <TH>Client</TH>
                <TH>Advocate</TH>
                <TH>Filed</TH>
                <TH>Status</TH>
              </THead>
              <TBody>
                {filteredCases.map((c) =>
              <TR key={c.id}>
                    <TD className="text-[13px] tabular">{c.id}</TD>
                    <TD className="max-w-[240px] truncate text-[13px] font-medium text-navy-900">{c.title}</TD>
                    <TD className="text-[13px]">{c.type}</TD>
                    <TD className="text-[13px]">{clientName(clients, c.clientId)}</TD>
                    <TD className="text-[13px]">{advocateName(advocates, c.advocateId)}</TD>
                    <TD className="whitespace-nowrap text-[13px]">{formatDate(c.filedOn)}</TD>
                    <TD>
                      <StatusBadge status={c.status} />
                    </TD>
                  </TR>
              )}
              </TBody>
            </TableWrap>
          </>
        }

        {kind === 'clients' &&
        <TableWrap>
            <THead>
              <TH>Client</TH>
              <TH align="center">Total cases</TH>
              <TH align="center">Active</TH>
              <TH align="right">Billed</TH>
              <TH align="right">Outstanding</TH>
              <TH>Status</TH>
            </THead>
            <TBody>
              {clients.map((cl) => {
              const theirs = cases.filter((c) => c.clientId === cl.id);
              const inv = invoices.filter((i) => i.clientId === cl.id);
              return (
                <TR key={cl.id}>
                    <TD>
                      <span className="block text-[13px] font-medium text-navy-900">{cl.name}</span>
                      <span className="text-[11px] text-navy-400 tabular">{cl.id}</span>
                    </TD>
                    <TD align="center" className="text-[13px] tabular">
                      {theirs.length}
                    </TD>
                    <TD align="center" className="text-[13px] tabular">
                      {theirs.filter((c) => c.status === 'Active').length}
                    </TD>
                    <TD align="right" className="text-[13px] tabular">
                      {currency(inv.reduce((s, i) => s + invoiceTotal(i), 0))}
                    </TD>
                    <TD align="right" className="text-[13px] tabular">
                      {currency(inv.reduce((s, i) => s + invoiceBalance(i), 0))}
                    </TD>
                    <TD>
                      <StatusBadge status={cl.status} />
                    </TD>
                  </TR>);

            })}
            </TBody>
          </TableWrap>
        }

        {kind === 'hearings' &&
        <TableWrap>
            <THead>
              <TH>Date</TH>
              <TH>Case</TH>
              <TH>Court</TH>
              <TH>Purpose</TH>
              <TH>Outcome</TH>
            </THead>
            <TBody>
              {hearings.
            filter((h) => h.date >= from && h.date <= to).
            sort((a, b) => a.date.localeCompare(b.date)).
            map((h) =>
            <TR key={h.id}>
                    <TD className="whitespace-nowrap text-[13px]">
                      {formatDate(h.date)} <span className="text-navy-400 tabular">{h.time}</span>
                    </TD>
                    <TD className="text-[13px] tabular">{h.caseId}</TD>
                    <TD className="max-w-[220px] truncate text-[13px]">{h.court}</TD>
                    <TD className="text-[13px]">{h.purpose}</TD>
                    <TD>
                      <StatusBadge status={h.status} />
                    </TD>
                  </TR>
            )}
            </TBody>
          </TableWrap>
        }

        {kind === 'advocates' &&
        <TableWrap>
            <THead>
              <TH>Advocate</TH>
              <TH>Specialisation</TH>
              <TH align="center">Assigned</TH>
              <TH align="center">Active</TH>
              <TH align="center">Completed</TH>
              <TH align="center">Hearings</TH>
            </THead>
            <TBody>
              {advocates.map((a) => {
              const theirs = cases.filter((c) => c.advocateId === a.id);
              const ids = new Set(theirs.map((c) => c.id));
              return (
                <TR key={a.id}>
                    <TD>
                      <span className="block text-[13px] font-medium text-navy-900">{a.name}</span>
                      <span className="text-[11px] text-navy-400 tabular">{a.id}</span>
                    </TD>
                    <TD className="text-[13px]">{a.specialization}</TD>
                    <TD align="center" className="text-[13px] tabular">
                      {theirs.length}
                    </TD>
                    <TD align="center" className="text-[13px] tabular">
                      {theirs.filter((c) => c.status === 'Active').length}
                    </TD>
                    <TD align="center" className="text-[13px] tabular">
                      {theirs.filter((c) => c.status === 'Closed').length}
                    </TD>
                    <TD align="center" className="text-[13px] tabular">
                      {hearings.filter((h) => ids.has(h.caseId)).length}
                    </TD>
                  </TR>);

            })}
            </TBody>
          </TableWrap>
        }

        {kind === 'financial' &&
        <>
            <div className="grid grid-cols-1 divide-y divide-navy-100 border-b border-navy-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
            { label: 'Billed', value: invoices.reduce((s, i) => s + invoiceTotal(i), 0) },
            {
              label: 'Collected',
              value: invoices.reduce((s, i) => s + invoicePaid(i), 0)
            },
            {
              label: 'Outstanding',
              value: invoices.reduce((s, i) => s + invoiceBalance(i), 0)
            }].
            map((s) =>
            <div key={s.label} className="px-5 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">{s.label}</p>
                  <p className="mt-1 text-xl font-semibold text-navy-900 tabular">{currency(s.value)}</p>
                </div>
            )}
            </div>
            <RevenueChart data={revenueByMonth} />
            <TableWrap>
              <THead>
                <TH>Invoice</TH>
                <TH>Client</TH>
                <TH>Case</TH>
                <TH>Issued</TH>
                <TH align="right">Total</TH>
                <TH>Status</TH>
              </THead>
              <TBody>
                {invoices.map((i) =>
              <TR key={i.id}>
                    <TD className="text-[13px] font-medium text-navy-900 tabular">{i.id}</TD>
                    <TD className="text-[13px]">{clientName(clients, i.clientId)}</TD>
                    <TD className="text-[13px] tabular">{i.caseId}</TD>
                    <TD className="whitespace-nowrap text-[13px]">{formatDate(i.issuedOn)}</TD>
                    <TD align="right" className="text-[13px] tabular">
                      {currency(invoiceTotal(i))}
                    </TD>
                    <TD>
                      <StatusBadge status={i.status} />
                    </TD>
                  </TR>
              )}
              </TBody>
            </TableWrap>
          </>
        }
      </Card>
    </div>);

}