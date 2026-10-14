import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, MailIcon, MapPinIcon, PencilIcon, PhoneIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, KeyValue } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Tabs, TabPanel } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/States';
import { TBody, TD, TH, THead, TR, TableWrap } from '../../components/ui/Table';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { useApp } from '../../contexts/AppContext';
import { currency, formatDate } from '../../utils/format';
import { advocateName, invoiceBalance, invoiceTotal } from '../../utils/selectors';

export function ClientDetails() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { clients, cases, documents, invoices, advocates, activity } = useApp();
  const [tab, setTab] = useState('overview');

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <Card>
        <EmptyState
          title="Client not found"
          message="This client record may have been removed. Return to the client register to continue."
          action={
          <Button variant="primary" onClick={() => navigate('/clients')}>
              Back to clients
            </Button>
          } />
        
      </Card>);

  }

  const clientCases = cases.filter((c) => c.clientId === client.id);
  const clientCaseIds = new Set(clientCases.map((c) => c.id));
  const clientDocs = documents.filter((d) => clientCaseIds.has(d.caseId));
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const outstanding = clientInvoices.reduce((s, i) => s + invoiceBalance(i), 0);

  const stats = [
  { label: 'Total Cases', value: String(clientCases.length) },
  { label: 'Active Cases', value: String(clientCases.filter((c) => c.status === 'Active').length) },
  { label: 'Closed Cases', value: String(clientCases.filter((c) => c.status === 'Closed').length) },
  { label: 'Outstanding Fees', value: currency(outstanding) }];


  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/clients')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-navy-500 transition-colors duration-150 ease-smooth hover:text-navy-900">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
        All clients
      </button>

      <PageHeader
        title={
        <span className="flex items-center gap-3">
            <Avatar name={client.name} size="lg" className="hidden sm:inline-flex" />
            <span>{client.name}</span>
          </span>
        }
        meta={
        <>
            <span className="text-[12px] font-medium text-navy-500 tabular">{client.id}</span>
            <StatusBadge status={client.status} />
            <span className="text-[12px] text-navy-400">
              Client since {formatDate(client.registeredOn)}
            </span>
          </>
        }
        actions={
        <>
            <Button
            variant="secondary"
            icon={<PencilIcon className="h-4 w-4" />}
            onClick={() => navigate(`/clients/new?id=${client.id}`)}>
            
              Edit
            </Button>
            <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />} onClick={() => navigate('/cases/new')}>
              Add Case
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) =>
        <Card key={s.label} className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">{s.label}</p>
            <p className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-navy-900 tabular">{s.value}</p>
          </Card>
        )}
      </div>

      <Card>
        <div className="px-4 pt-1">
          <Tabs
            active={tab}
            onChange={setTab}
            tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'cases', label: 'Cases', count: clientCases.length },
            { id: 'documents', label: 'Documents', count: clientDocs.length },
            { id: 'billing', label: 'Billing', count: clientInvoices.length },
            { id: 'activity', label: 'Activity' }]
            } />
          
        </div>

        <AnimatePresence mode="wait">
          {tab === 'overview' &&
          <TabPanel id="overview">
              <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
                <div className="space-y-4">
                  <h3 className="text-[13px] font-semibold text-navy-900">Contact Information</h3>
                  <ul className="space-y-2.5 text-[13px] text-navy-700">
                    <li className="flex items-center gap-2.5">
                      <MailIcon className="h-4 w-4 shrink-0 text-navy-300" aria-hidden />
                      {client.email}
                    </li>
                    <li className="flex items-center gap-2.5 tabular">
                      <PhoneIcon className="h-4 w-4 shrink-0 text-navy-300" aria-hidden />
                      {client.phone}
                    </li>
                    <li className="flex items-start gap-2.5">
                      <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-navy-300" aria-hidden />
                      <span>
                        {client.address}
                        <br />
                        {client.city}, {client.state} {client.postalCode}
                      </span>
                    </li>
                  </ul>
                </div>
                <dl className="grid grid-cols-2 gap-5 lg:col-span-2">
                  <KeyValue label="Client ID">{client.id}</KeyValue>
                  <KeyValue label="Registration date">{formatDate(client.registeredOn)}</KeyValue>
                  <KeyValue label="Date of birth / incorporation">{formatDate(client.dob)}</KeyValue>
                  <KeyValue label="Gender / entity type">{client.gender}</KeyValue>
                  <KeyValue label="Internal notes" className="col-span-2">
                    <span className="leading-relaxed text-navy-600">{client.notes || '—'}</span>
                  </KeyValue>
                </dl>
              </div>
            </TabPanel>
          }

          {tab === 'cases' &&
          <TabPanel id="cases">
              {clientCases.length === 0 ?
            <EmptyState
              title="No cases registered"
              message="Register a matter for this client to start tracking hearings, documents and fees."
              action={
              <Button variant="primary" onClick={() => navigate('/cases/new')}>
                      Register Case
                    </Button>
              } /> :


            <TableWrap>
                  <THead>
                    <TH>Case ID</TH>
                    <TH>Case title</TH>
                    <TH>Status</TH>
                    <TH>Advocate</TH>
                    <TH>Next hearing</TH>
                    <TH align="right" />
                  </THead>
                  <TBody>
                    {clientCases.map((c) =>
                <TR key={c.id} onClick={() => navigate(`/cases/${c.id}`)}>
                        <TD className="text-[13px] tabular">{c.id}</TD>
                        <TD>
                          <span className="block max-w-[280px] truncate text-[13px] font-medium text-navy-900">
                            {c.title}
                          </span>
                          <span className="text-[11px] text-navy-400">{c.caseNumber}</span>
                        </TD>
                        <TD>
                          <StatusBadge status={c.status} />
                        </TD>
                        <TD className="text-[13px]">{advocateName(advocates, c.advocateId)}</TD>
                        <TD className="whitespace-nowrap text-[13px]">
                          {c.nextHearing ? formatDate(c.nextHearing) : <span className="text-navy-300">—</span>}
                        </TD>
                        <TD align="right">
                          <Link
                      to={`/cases/${c.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[12px] font-medium text-brand-600 transition-colors duration-150 hover:text-brand-700">
                      
                            View case
                          </Link>
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
              {clientDocs.length === 0 ?
            <EmptyState title="No documents" message="Documents filed to this client’s matters will appear here." /> :

            <TableWrap>
                  <THead>
                    <TH>Document</TH>
                    <TH>Type</TH>
                    <TH>Case</TH>
                    <TH>Uploaded</TH>
                    <TH align="right">Size</TH>
                  </THead>
                  <TBody>
                    {clientDocs.map((d) =>
                <TR key={d.id}>
                        <TD className="text-[13px] font-medium text-navy-900">{d.name}</TD>
                        <TD className="text-[13px]">{d.type}</TD>
                        <TD className="text-[13px] tabular">{d.caseId}</TD>
                        <TD className="whitespace-nowrap text-[13px]">
                          {formatDate(d.uploadedOn)}
                          <span className="block text-[11px] text-navy-400">{d.uploadedBy}</span>
                        </TD>
                        <TD align="right" className="text-[13px] tabular">
                          {d.size}
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
              {clientInvoices.length === 0 ?
            <EmptyState title="No invoices raised" message="Fees billed to this client will be listed here." /> :

            <TableWrap>
                  <THead>
                    <TH>Invoice</TH>
                    <TH>Case</TH>
                    <TH>Issued</TH>
                    <TH>Due</TH>
                    <TH align="right">Total</TH>
                    <TH>Status</TH>
                  </THead>
                  <TBody>
                    {clientInvoices.map((inv) =>
                <TR key={inv.id} onClick={() => navigate(`/billing/invoices/${inv.id}`)}>
                        <TD className="text-[13px] font-medium text-navy-900 tabular">{inv.id}</TD>
                        <TD className="text-[13px] tabular">{inv.caseId}</TD>
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
            }
            </TabPanel>
          }

          {tab === 'activity' &&
          <TabPanel id="activity">
              <ActivityFeed
              items={activity.filter((a) => !a.caseId || clientCaseIds.has(a.caseId)).slice(0, 8)} />
            
            </TabPanel>
          }
        </AnimatePresence>
      </Card>
    </div>);

}