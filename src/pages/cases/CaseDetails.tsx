import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CalendarPlusIcon,
  DownloadIcon,
  GavelIcon,
  PencilIcon,
  UploadIcon,
  UserPlusIcon } from
'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, KeyValue } from '../../components/ui/Card';
import { PriorityFlag, StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Tabs, TabPanel } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/States';
import { TBody, TD, TH, THead, TR, TableWrap } from '../../components/ui/Table';
import { Tooltip } from '../../components/ui/Tooltip';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { AssignAdvocateModal, EditCaseModal } from '../../components/cases/CaseModals';
import { UploadModal } from '../../components/documents/UploadModal';
import { ScheduleHearingModal } from '../../components/hearings/ScheduleHearingModal';
import { useApp } from '../../contexts/AppContext';
import { currency, formatDate, formatLongDate } from '../../utils/format';
import { advocateName, invoiceTotal } from '../../utils/selectors';

export function CaseDetails() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {
    cases,
    clients,
    advocates,
    hearings,
    documents,
    invoices,
    proceedings,
    activity,
    currentUser
  } = useApp();

  const [tab, setTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(params.get('edit') === '1');
  const [assignOpen, setAssignOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [hearingOpen, setHearingOpen] = useState(false);

  const legalCase = cases.find((c) => c.id === id);
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'clerk';
  const canFile = canManage || currentUser?.role === 'advocate';

  if (!legalCase) {
    return (
      <Card>
        <EmptyState
          title="Case not found"
          message="This matter may have been closed and archived. Return to the case register to continue."
          action={
          <Button variant="primary" onClick={() => navigate('/cases')}>
              Back to cases
            </Button>
          } />
        
      </Card>);

  }

  const client = clients.find((c) => c.id === legalCase.clientId);
  const caseHearings = hearings.
  filter((h) => h.caseId === legalCase.id).
  sort((a, b) => b.date.localeCompare(a.date));
  const caseDocs = documents.filter((d) => d.caseId === legalCase.id);
  const caseInvoices = invoices.filter((i) => i.caseId === legalCase.id);
  const caseProceedings = proceedings.
  filter((p) => p.caseId === legalCase.id).
  sort((a, b) => b.date.localeCompare(a.date));
  const billed = caseInvoices.reduce((s, i) => s + invoiceTotal(i), 0);
  const unpaid = caseInvoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + invoiceTotal(i), 0);

  const overviewCards = [
  { label: 'Client', value: client?.name ?? '—', to: client ? `/clients/${client.id}` : undefined },
  { label: 'Assigned advocate', value: advocateName(advocates, legalCase.advocateId) },
  { label: 'Court', value: legalCase.court },
  { label: 'Filing date', value: formatDate(legalCase.filedOn) },
  {
    label: 'Next hearing',
    value: legalCase.nextHearing ? formatDate(legalCase.nextHearing) : 'Not listed'
  }];


  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/cases')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-navy-500 transition-colors duration-150 ease-smooth hover:text-navy-900">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
        All cases
      </button>

      <PageHeader
        title={legalCase.title}
        meta={
        <>
            <span className="text-[12px] font-medium text-navy-600 tabular">{legalCase.caseNumber}</span>
            <span className="text-[12px] text-navy-300">·</span>
            <span className="text-[12px] text-navy-500 tabular">{legalCase.id}</span>
            <StatusBadge status={legalCase.status} />
            <PriorityFlag priority={legalCase.priority} />
            <span className="text-[12px] text-navy-400">{legalCase.stage}</span>
          </>
        }
        actions={
        <>
            {canManage &&
          <Button variant="secondary" icon={<PencilIcon className="h-4 w-4" />} onClick={() => setEditOpen(true)}>
                Edit Case
              </Button>
          }
            {canManage &&
          <Button variant="secondary" icon={<UserPlusIcon className="h-4 w-4" />} onClick={() => setAssignOpen(true)}>
                {legalCase.advocateId ? 'Reassign Advocate' : 'Assign Advocate'}
              </Button>
          }
            {canFile &&
          <Button variant="secondary" icon={<UploadIcon className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
                Upload Document
              </Button>
          }
            {canFile &&
          <Button
            variant="primary"
            icon={<CalendarPlusIcon className="h-4 w-4" />}
            onClick={() => setHearingOpen(true)}>
            
                Schedule Hearing
              </Button>
          }
          </>
        } />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overviewCards.map((card, i) =>
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}>
          
            <Card className="h-full p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">
                {card.label}
              </p>
              {card.to ?
            <Link
              to={card.to}
              className="mt-1.5 block text-[13px] font-medium text-brand-700 underline-offset-2 hover:underline">
              
                  {card.value}
                </Link> :

            <p className="mt-1.5 text-[13px] font-medium leading-snug text-navy-800">{card.value}</p>
            }
            </Card>
          </motion.div>
        )}
      </div>

      <Card>
        <div className="px-4 pt-1">
          <Tabs
            active={tab}
            onChange={setTab}
            tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'proceedings', label: 'Proceedings', count: caseProceedings.length },
            { id: 'hearings', label: 'Hearings', count: caseHearings.length },
            { id: 'documents', label: 'Documents', count: caseDocs.length },
            { id: 'billing', label: 'Billing', count: caseInvoices.length },
            { id: 'activity', label: 'Activity' }]
            } />
          
        </div>

        <AnimatePresence mode="wait">
          {tab === 'overview' &&
          <TabPanel id="overview">
              <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h3 className="text-[13px] font-semibold text-navy-900">Matter summary</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-navy-600">{legalCase.description}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
                    <KeyValue label="Case type">{legalCase.type}</KeyValue>
                    <KeyValue label="Stage">{legalCase.stage}</KeyValue>
                    <KeyValue label="Priority">{legalCase.priority}</KeyValue>
                    <KeyValue label="Filed on">{formatDate(legalCase.filedOn)}</KeyValue>
                    <KeyValue label="Court">{legalCase.court}</KeyValue>
                    <KeyValue label="Hearings held">
                      {caseHearings.filter((h) => h.status === 'Completed').length}
                    </KeyValue>
                  </dl>
                </div>
                <div className="space-y-4 rounded-xl border border-navy-200 bg-navy-50/50 p-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">
                      Lead counsel
                    </p>
                    <div className="mt-2 flex items-center gap-2.5">
                      <Avatar name={advocateName(advocates, legalCase.advocateId)} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-navy-900">
                          {advocateName(advocates, legalCase.advocateId)}
                        </p>
                        <p className="text-[11px] text-navy-400">
                          {advocates.find((a) => a.id === legalCase.advocateId)?.specialization}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-navy-200 pt-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">
                      Fees billed
                    </p>
                    <p className="mt-1 text-lg font-semibold text-navy-900 tabular">{currency(billed)}</p>
                    <p className="mt-0.5 text-[12px] text-navy-500 tabular">
                      {currency(unpaid)} outstanding
                    </p>
                  </div>
                  <div className="border-t border-navy-200 pt-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">
                      Next listing
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-navy-800">
                      {legalCase.nextHearing ? formatLongDate(legalCase.nextHearing) : 'No hearing listed'}
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
          }

          {tab === 'proceedings' &&
          <TabPanel id="proceedings">
              {caseProceedings.length === 0 ?
            <EmptyState
              title="No proceedings recorded"
              message="Updates recorded by advocates and clerks will build the case timeline here." /> :


            <ol className="relative px-5 py-6 sm:px-8">
                  <span className="absolute left-[27px] top-8 bottom-8 w-px bg-navy-100 sm:left-[39px]" aria-hidden />
                  {caseProceedings.map((p, i) =>
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
                className="relative flex gap-4 pb-6 last:pb-0">
                
                      <span
                  className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-white ${
                  i === 0 ? 'border-brand-500' : 'border-navy-200'}`
                  }>
                  
                        <span
                    className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-brand-500' : 'bg-navy-300'}`}
                    aria-hidden />
                  
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-[12px] font-semibold text-navy-500 tabular">
                            {formatDate(p.date)}
                          </span>
                          <span className="text-sm font-medium text-navy-900">{p.title}</span>
                        </div>
                        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-navy-600">{p.detail}</p>
                        <p className="mt-1.5 text-[11px] text-navy-400">Updated by {p.updatedBy}</p>
                      </div>
                    </motion.li>
              )}
                </ol>
            }
            </TabPanel>
          }

          {tab === 'hearings' &&
          <TabPanel id="hearings">
              {caseHearings.length === 0 ?
            <EmptyState
              title="No hearings listed"
              message="Schedule a hearing to add it to the case calendar and notify the advocate."
              action={
              canFile ?
              <Button variant="primary" onClick={() => setHearingOpen(true)}>
                        Schedule Hearing
                      </Button> :
              undefined
              } /> :


            <TableWrap>
                  <THead>
                    <TH>Date</TH>
                    <TH>Time</TH>
                    <TH>Court</TH>
                    <TH>Purpose</TH>
                    <TH align="right">Status</TH>
                  </THead>
                  <TBody>
                    {caseHearings.map((h) =>
                <TR key={h.id}>
                        <TD className="whitespace-nowrap text-[13px] font-medium text-navy-900">
                          {formatDate(h.date)}
                        </TD>
                        <TD className="text-[13px] tabular">{h.time}</TD>
                        <TD>
                          <span className="block text-[13px]">{h.court}</span>
                          <span className="text-[11px] text-navy-400">{h.judge}</span>
                        </TD>
                        <TD className="text-[13px]">{h.purpose}</TD>
                        <TD align="right">
                          <StatusBadge status={h.status} />
                        </TD>
                      </TR>
                )}
                  </TBody>
                </TableWrap>
            }
            </TabPanel>
          }

          {tab === 'documents' &&
          <TabPanel id="documents">
              {caseDocs.length === 0 ?
            <EmptyState
              title="No documents filed"
              message="Upload petitions, evidence and orders to keep the case bundle in one place."
              action={
              canFile ?
              <Button variant="primary" onClick={() => setUploadOpen(true)}>
                        Upload Document
                      </Button> :
              undefined
              } /> :


            <TableWrap>
                  <THead>
                    <TH>Document name</TH>
                    <TH>Type</TH>
                    <TH>Uploaded by</TH>
                    <TH>Upload date</TH>
                    <TH align="right">Size</TH>
                    <TH align="right">Actions</TH>
                  </THead>
                  <TBody>
                    {caseDocs.map((d) =>
                <TR key={d.id}>
                        <TD>
                          <span className="block max-w-[300px] truncate text-[13px] font-medium text-navy-900">
                            {d.name}
                          </span>
                          <StatusBadge status={d.status} className="mt-1" />
                        </TD>
                        <TD className="text-[13px]">{d.type}</TD>
                        <TD className="text-[13px]">{d.uploadedBy}</TD>
                        <TD className="whitespace-nowrap text-[13px]">{formatDate(d.uploadedOn)}</TD>
                        <TD align="right" className="text-[13px] tabular">
                          {d.size}
                        </TD>
                        <TD align="right">
                          <Tooltip label="Download">
                            <button
                        onClick={() => toast.success('Download started', { description: d.name })}
                        aria-label={`Download ${d.name}`}
                        className="rounded-lg border border-transparent p-1.5 text-navy-400 transition-colors duration-150 ease-smooth hover:border-navy-200 hover:bg-white hover:text-navy-800">
                        
                              <DownloadIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </TD>
                      </TR>
                )}
                  </TBody>
                </TableWrap>
            }
            </TabPanel>
          }

          {tab === 'billing' &&
          <TabPanel id="billing">
              {caseInvoices.length === 0 ?
            <EmptyState title="No fees raised" message="Invoices issued against this matter will appear here." /> :

            <>
                  <div className="grid grid-cols-1 divide-y divide-navy-100 border-b border-navy-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {[
                { label: 'Total billed', value: currency(billed) },
                { label: 'Collected', value: currency(billed - unpaid) },
                { label: 'Outstanding', value: currency(unpaid) }].
                map((s) =>
                <div key={s.label} className="px-5 py-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">
                          {s.label}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-navy-900 tabular">{s.value}</p>
                      </div>
                )}
                  </div>
                  <TableWrap>
                    <THead>
                      <TH>Invoice</TH>
                      <TH>Description</TH>
                      <TH>Issued</TH>
                      <TH>Due</TH>
                      <TH align="right">Total</TH>
                      <TH>Status</TH>
                    </THead>
                    <TBody>
                      {caseInvoices.map((inv) =>
                  <TR key={inv.id} onClick={() => navigate(`/billing/invoices/${inv.id}`)}>
                          <TD className="text-[13px] font-medium text-navy-900 tabular">{inv.id}</TD>
                          <TD>
                            <span className="block max-w-[280px] truncate text-[13px]">{inv.description}</span>
                          </TD>
                          <TD className="whitespace-nowrap text-[13px]">{formatDate(inv.issuedOn)}</TD>
                          <TD className="whitespace-nowrap text-[13px]">{formatDate(inv.dueOn)}</TD>
                          <TD align="right" className="text-[13px] font-medium tabular">
                            {currency(invoiceTotal(inv))}
                          </TD>
                          <TD>
                            <StatusBadge status={inv.status} />
                          </TD>
                        </TR>
                  )}
                    </TBody>
                  </TableWrap>
                </>
            }
            </TabPanel>
          }

          {tab === 'activity' &&
          <TabPanel id="activity">
              <ActivityFeed items={activity.filter((a) => a.caseId === legalCase.id)} />
              {activity.filter((a) => a.caseId === legalCase.id).length === 0 &&
            <EmptyState title="No activity yet" message="Updates to this matter will be logged here." />
            }
            </TabPanel>
          }
        </AnimatePresence>
      </Card>

      <EditCaseModal open={editOpen} onClose={() => setEditOpen(false)} legalCase={legalCase} />
      <AssignAdvocateModal open={assignOpen} onClose={() => setAssignOpen(false)} legalCase={legalCase} />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} caseId={legalCase.id} />
      <ScheduleHearingModal open={hearingOpen} onClose={() => setHearingOpen(false)} caseId={legalCase.id} />
    </div>);

}