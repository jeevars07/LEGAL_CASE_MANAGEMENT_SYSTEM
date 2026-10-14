import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2Icon, CreditCardIcon, EyeIcon, MoreHorizontalIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Menu, MenuItem } from '../../components/ui/Menu';
import { Modal } from '../../components/ui/Modal';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import { FilterSelect, SearchInput, Toolbar } from '../../components/ui/Toolbar';
import { TBody, TD, TH, THead, TR, TableWrap } from '../../components/ui/Table';
import { EmptyState, TableSkeleton } from '../../components/ui/States';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { currency, formatDate } from '../../utils/format';
import { clientName, invoiceBalance, invoicePaid, invoiceTotal, visibleInvoices } from '../../utils/selectors';
import { ClientPayModal } from './InvoiceDetails';
import type { Invoice, InvoiceStatus } from '../../types';

type Mode = 'invoices' | 'payments' | 'outstanding';

const copy: Record<Mode, {title: string;subtitle: string;}> = {
  invoices: {
    title: 'Invoices',
    subtitle: 'Fees raised across matters, with issue and due dates.'
  },
  payments: {
    title: 'Payments',
    subtitle: 'Settled invoices and the method by which they were paid.'
  },
  outstanding: {
    title: 'Outstanding Fees',
    subtitle: 'Invoices still pending or past their due date.'
  }
};

export function Invoices({ mode = 'invoices' }: {mode?: Mode;}) {
  const { invoices, cases, clients, currentUser, addInvoice, updateInvoice, recordPayment } = useApp();
  const { loading } = useSimulatedLoad();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedForPay, setSelectedForPay] = useState<Invoice | null>(null);

  const scoped = visibleInvoices(invoices, currentUser, cases);
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'clerk';

  const base = useMemo(() => {
    if (mode === 'payments') return scoped.filter((i) => i.status === 'Paid');
    if (mode === 'outstanding') return scoped.filter((i) => i.status !== 'Paid');
    return scoped;
  }, [scoped, mode]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((i) => {
      const client = clientName(clients, i.clientId).toLowerCase();
      return (
        (!q || `${i.id} ${i.caseId} ${client} ${i.description}`.toLowerCase().includes(q)) && (
        !status || i.status === status));

    });
  }, [base, query, status, clients]);

  const totals = {
    billed: scoped.reduce((s, i) => s + invoiceTotal(i), 0),
    paid: scoped.reduce((s, i) => s + invoicePaid(i), 0),
    pending: scoped.filter((i) => i.status === 'Pending' || i.status === 'Partially Paid').reduce((s, i) => s + invoiceBalance(i), 0),
    overdue: scoped.filter((i) => i.status === 'Overdue').reduce((s, i) => s + invoiceBalance(i), 0)
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentUser?.role === 'client' && mode === 'invoices' ? 'My Billing' : copy[mode].title}
        subtitle={copy[mode].subtitle}
        actions={
        canManage ?
        <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
              Create Invoice
            </Button> :
        undefined
        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
        { label: 'Total Billing', value: totals.billed, tone: 'text-navy-900' },
        { label: 'Paid', value: totals.paid, tone: 'text-emerald-600' },
        { label: 'Pending', value: totals.pending, tone: 'text-amber-600' },
        { label: 'Overdue', value: totals.overdue, tone: 'text-red-600' }].
        map((s) =>
        <Card key={s.label} className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">{s.label}</p>
            <p className={`mt-1.5 text-xl font-semibold tracking-[-0.02em] tabular ${s.tone}`}>
              {currency(s.value)}
            </p>
          </Card>
        )}
      </div>

      <Card>
        <Toolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search by invoice, client or case" />
          {mode === 'invoices' &&
          <FilterSelect label="Status" value={status} onChange={setStatus} options={['Paid', 'Partially Paid', 'Pending', 'Overdue']} />
          }
        </Toolbar>

        {loading ?
        <TableSkeleton rows={7} cols={7} /> :
        rows.length === 0 ?
        <EmptyState
          title="No invoices found"
          message={
          mode === 'outstanding' ?
          'Every invoice has been settled. Nothing is outstanding right now.' :
          'Try adjusting your search, or raise a new invoice against a matter.'
          }
          action={
          canManage && mode !== 'outstanding' ?
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
                  Create Invoice
                </Button> :
          undefined
          } /> :


        <TableWrap>
            <THead>
              <TH>Invoice ID</TH>
              <TH>Client</TH>
              <TH>Case</TH>
              <TH align="right">Amount</TH>
              <TH>Issue date</TH>
              <TH>{mode === 'payments' ? 'Paid on' : 'Due date'}</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </THead>
            <TBody>
              {rows.map((inv) =>
            <TR key={inv.id} onClick={() => navigate(`/billing/invoices/${inv.id}`)}>
                  <TD className="text-[13px] font-medium text-navy-900 tabular">{inv.id}</TD>
                  <TD className="text-[13px]">{clientName(clients, inv.clientId)}</TD>
                  <TD>
                    <span className="block max-w-[200px] truncate text-[13px]">
                      {cases.find((c) => c.id === inv.caseId)?.title ?? inv.caseId}
                    </span>
                    <span className="text-[11px] text-navy-400 tabular">{inv.caseId}</span>
                  </TD>
                  <TD align="right" className="text-[13px] font-medium tabular">
                    <div>{currency(invoiceTotal(inv))}</div>
                    {inv.status === 'Partially Paid' && (
                      <div className="text-[11px] font-normal text-brand-600">
                        Bal: {currency(invoiceBalance(inv))}
                      </div>
                    )}
                  </TD>
                  <TD className="whitespace-nowrap text-[13px]">{formatDate(inv.issuedOn)}</TD>
                  <TD className="whitespace-nowrap text-[13px]">
                    {mode === 'payments' ?
                inv.paidOn ?
                `${formatDate(inv.paidOn)} · ${inv.method}` :
                '—' :
                formatDate(inv.dueOn)}
                  </TD>
                  <TD>
                    <StatusBadge status={inv.status} />
                  </TD>
                  <TD align="right">
                    <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                      <Menu
                    trigger={({ toggle }) =>
                    <button
                      onClick={toggle}
                      aria-label={`Actions for ${inv.id}`}
                      className="rounded-lg border border-transparent p-1.5 text-navy-400 transition-colors duration-150 ease-smooth hover:border-navy-200 hover:bg-white hover:text-navy-800">
                      
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </button>
                    }>
                    
                        {(close) =>
                    <>
                            <MenuItem
                        icon={<EyeIcon className="h-4 w-4 text-navy-400" />}
                        onClick={() => {
                          close();
                          navigate(`/billing/invoices/${inv.id}`);
                        }}>
                        
                              View invoice
                            </MenuItem>
                            {inv.status !== 'Paid' && (
                              <MenuItem
                                icon={<CreditCardIcon className="h-4 w-4 text-brand-600" />}
                                onClick={() => {
                                  close();
                                  setSelectedForPay(inv);
                                }}>
                                Pay Fee (Full / Partial)
                              </MenuItem>
                            )}
                            {canManage &&
                      <MenuItem
                        icon={<PencilIcon className="h-4 w-4 text-navy-400" />}
                        onClick={() => {
                          close();
                          navigate(`/billing/invoices/${inv.id}?edit=1`);
                        }}>
                        
                                Edit invoice
                              </MenuItem>
                      }
                            {canManage && inv.status !== 'Paid' &&
                      <MenuItem
                        icon={<CheckCircle2Icon className="h-4 w-4 text-emerald-500" />}
                        onClick={() => {
                          close();
                          updateInvoice({
                            ...inv,
                            status: 'Paid',
                            paidOn: new Date().toISOString().slice(0, 10),
                            method: 'Bank transfer'
                          });
                          toast.success('Payment recorded', {
                            description: `${inv.id} marked as paid.`
                          });
                        }}>
                        
                                Mark as paid
                              </MenuItem>
                      }
                          </>
                    }
                      </Menu>
                    </div>
                  </TD>
                </TR>
            )}
            </TBody>
          </TableWrap>
        }
      </Card>

      <CreateInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={addInvoice} />
      {selectedForPay && (
        <ClientPayModal
          open={Boolean(selectedForPay)}
          onClose={() => setSelectedForPay(null)}
          invoice={selectedForPay}
          onPaySuccess={(amount, method, note) => {
            recordPayment(selectedForPay.id, amount, method, note);
          }}
        />
      )}
    </div>);

}

function CreateInvoiceModal({
  open,
  onClose,
  onCreate




}: {open: boolean;onClose: () => void;onCreate: (invoice: Invoice) => void;}) {
  const { cases, clients, invoices } = useApp();
  const [caseId, setCaseId] = useState(cases[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('Pending');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const matter = cases.find((c) => c.id === caseId);
  const numeric = Number(amount || 0);
  const tax = Math.round(numeric * 0.08);

  const submit = () => {
    if (!numeric || numeric <= 0) {
      setError('Enter the professional fee amount.');
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      onCreate({
        id: `INV-${2042 + invoices.length - 12}`,
        clientId: matter?.clientId ?? clients[0].id,
        caseId,
        description: description || 'Professional fees',
        amount: numeric,
        tax,
        issuedOn: new Date().toISOString().slice(0, 10),
        dueOn: '2026-09-12',
        status
      });
      toast.success('Invoice created', { description: `Raised against ${caseId} for ${currency(numeric + tax)}.` });
      setSaving(false);
      setAmount('');
      setDescription('');
      onClose();
    }, 750);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create invoice"
      description="Raise a fee note against a matter. Tax is calculated at 8%."
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={submit}>
            Create Invoice
          </Button>
        </>
      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Case" htmlFor="inv-case" className="sm:col-span-2">
          <Select id="inv-case" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
            {cases.map((c) =>
            <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            )}
          </Select>
        </Field>
        <Field label="Client" htmlFor="inv-client">
          <Input id="inv-client" value={matter ? clientName(clients, matter.clientId) : ''} disabled />
        </Field>
        <Field label="Status" htmlFor="inv-status">
          <Select id="inv-status" value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)}>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </Select>
        </Field>
        <Field label="Professional fees (₹)" htmlFor="inv-amount" required error={error}>
          <Input
            id="inv-amount"
            type="number"
            value={amount}
            invalid={Boolean(error)}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            placeholder="12500" />
          
        </Field>
        <Field label="Tax (8%)" htmlFor="inv-tax">
          <Input id="inv-tax" value={currency(tax)} disabled />
        </Field>
        <Field label="Description" htmlFor="inv-desc" className="sm:col-span-2">
          <Textarea
            id="inv-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Court attendance, drafting and correspondence — August 2026" />
          
        </Field>
      </div>
      <p className="mt-4 border-t border-navy-100 pt-3 text-[13px] text-navy-600">
        Invoice total <span className="font-semibold text-navy-900 tabular">{currency(numeric + tax)}</span>
      </p>
    </Modal>);

}