import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  PencilIcon,
  PercentIcon,
  PrinterIcon,
  QrCodeIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, KeyValue } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import { EmptyState } from '../../components/ui/States';
import { useApp } from '../../contexts/AppContext';
import { currency, formatDate } from '../../utils/format';
import { clientName, invoiceBalance, invoicePaid, invoiceTotal } from '../../utils/selectors';
import type { Invoice, InvoiceStatus } from '../../types';

export function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { invoices, clients, cases, currentUser, updateInvoice, recordPayment } = useApp();
  const invoice = invoices.find((i) => i.id === id);
  const [editOpen, setEditOpen] = useState(params.get('edit') === '1');
  const [payOpen, setPayOpen] = useState(false);

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'clerk';

  if (!invoice) {
    return (
      <Card>
        <EmptyState
          title="Invoice not found"
          message="This fee note may have been cancelled."
          action={
            <Button variant="primary" onClick={() => navigate('/billing/invoices')}>
              Back to invoices
            </Button>
          }
        />
      </Card>
    );
  }

  const matter = cases.find((c) => c.id === invoice.caseId);
  const client = clients.find((c) => c.id === invoice.clientId);

  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);
  const percentPaid = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 100;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/billing/invoices')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-navy-500 transition-colors duration-150 ease-smooth hover:text-navy-900"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
        All invoices
      </button>

      <PageHeader
        title={`Invoice ${invoice.id}`}
        meta={
          <>
            <StatusBadge status={invoice.status} />
            <span className="text-[12px] text-navy-400">
              Issued {formatDate(invoice.issuedOn)} · Due {formatDate(invoice.dueOn)}
            </span>
          </>
        }
        actions={
          <>
            <Button
              variant="secondary"
              icon={<PrinterIcon className="h-4 w-4" />}
              onClick={() => toast.success('Invoice sent to printer')}
            >
              Print
            </Button>
            {canManage && (
              <Button
                variant="secondary"
                icon={<PencilIcon className="h-4 w-4" />}
                onClick={() => setEditOpen(true)}
              >
                Edit Invoice
              </Button>
            )}
            {invoice.status !== 'Paid' && balance > 0 && (
              <Button
                variant="primary"
                icon={canManage ? <CheckCircle2Icon className="h-4 w-4" /> : <CreditCardIcon className="h-4 w-4" />}
                onClick={() => setPayOpen(true)}
              >
                {canManage ? 'Record Payment' : 'Pay Fee (Full / Partial)'}
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Fee Note Details" description={`Raised against ${invoice.caseId}`} />
            <div className="space-y-6 p-5">
              <dl className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                <KeyValue label="Client">
                  {client ? (
                    <Link to={`/clients/${client.id}`} className="text-brand-700 underline-offset-2 hover:underline">
                      {client.name}
                    </Link>
                  ) : (
                    clientName(clients, invoice.clientId)
                  )}
                </KeyValue>
                <KeyValue label="Case">
                  <Link to={`/cases/${invoice.caseId}`} className="text-brand-700 underline-offset-2 hover:underline">
                    {invoice.caseId}
                  </Link>
                </KeyValue>
                <KeyValue label="Matter">{matter?.title ?? '—'}</KeyValue>
                <KeyValue label="Payment status">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    {invoice.status}
                    {invoice.status === 'Partially Paid' && (
                      <span className="text-xs text-navy-500 font-normal">({percentPaid}% paid)</span>
                    )}
                  </span>
                </KeyValue>
              </dl>

              <div className="overflow-hidden rounded-xl border border-navy-200">
                <table className="w-full text-sm">
                  <thead className="bg-navy-50/70">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                        Description
                      </th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-navy-100">
                      <td className="px-4 py-3 text-[13px] text-navy-700">{invoice.description}</td>
                      <td className="px-4 py-3 text-right text-[13px] tabular">{currency(invoice.amount)}</td>
                    </tr>
                    <tr className="border-t border-navy-100">
                      <td className="px-4 py-3 text-[13px] text-navy-500">Applicable Tax (GST / Tax)</td>
                      <td className="px-4 py-3 text-right text-[13px] tabular">{currency(invoice.tax)}</td>
                    </tr>
                    <tr className="border-t border-navy-200 bg-navy-50/50">
                      <td className="px-4 py-3 text-[13px] font-semibold text-navy-900">Total Invoiced Amount</td>
                      <td className="px-4 py-3 text-right text-[14px] font-semibold text-navy-900 tabular">
                        {currency(total)}
                      </td>
                    </tr>
                    {paid > 0 && (
                      <tr className="border-t border-emerald-100 bg-emerald-50/40">
                        <td className="px-4 py-2.5 text-[13px] font-medium text-emerald-700">
                          Total Payments Received
                        </td>
                        <td className="px-4 py-2.5 text-right text-[13px] font-medium text-emerald-700 tabular">
                          - {currency(paid)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t-2 border-navy-300 bg-brand-50/50">
                      <td className="px-4 py-3 text-[14px] font-bold text-navy-900">
                        Net Balance Remaining
                      </td>
                      <td className="px-4 py-3 text-right text-[16px] font-bold text-navy-900 tabular">
                        {currency(balance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-navy-100 bg-navy-50/50 p-4 text-[12px] leading-relaxed text-navy-500">
                <p>
                  <strong>Payment Terms:</strong> Settlement is due by {formatDate(invoice.dueOn)}. Please quote reference{' '}
                  <span className="font-mono font-medium text-navy-800">{invoice.id}</span> with any bank transfer or
                  remittance advice. Clients may pay in full or make partial payments per agreed retainer installments.
                </p>
              </div>
            </div>
          </Card>

          {/* Payment History Card */}
          <Card>
            <CardHeader
              title="Payment History & Receipts"
              description="Detailed records of all fee settlements and partial installments"
            />
            <div className="p-5">
              {(!invoice.payments || invoice.payments.length === 0) && paid === 0 ? (
                <div className="rounded-xl border border-dashed border-navy-200 p-6 text-center">
                  <p className="text-sm font-medium text-navy-700">No payments recorded yet</p>
                  <p className="mt-1 text-xs text-navy-400">
                    Once a full or partial fee payment is processed, transaction details and receipts will appear here.
                  </p>
                  {invoice.status !== 'Paid' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      icon={<CreditCardIcon className="h-3.5 w-3.5" />}
                      onClick={() => setPayOpen(true)}
                    >
                      Make First Payment
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-navy-200">
                  <table className="w-full text-sm">
                    <thead className="bg-navy-50/70">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                          Date
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                          Payment Ref
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                          Method
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                          Note / Type
                        </th>
                        <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                          Amount Paid
                        </th>
                        <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100">
                      {invoice.payments && invoice.payments.length > 0 ? (
                        invoice.payments.map((p) => (
                          <tr key={p.id} className="transition-colors hover:bg-navy-50/40">
                            <td className="px-4 py-3 text-[13px] text-navy-700">{formatDate(p.date)}</td>
                            <td className="px-4 py-3 font-mono text-[12px] text-navy-800">{p.id}</td>
                            <td className="px-4 py-3 text-[13px] text-navy-700">{p.method}</td>
                            <td className="px-4 py-3 text-[13px] text-navy-600">{p.note || 'Fee Payment'}</td>
                            <td className="px-4 py-3 text-right font-medium text-emerald-700 tabular">
                              {currency(p.amount)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                <CheckCircle2Icon className="h-3 w-3" /> Cleared
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Fallback for seed invoices with status 'Paid' but no array
                        <tr className="transition-colors hover:bg-navy-50/40">
                          <td className="px-4 py-3 text-[13px] text-navy-700">
                            {invoice.paidOn ? formatDate(invoice.paidOn) : formatDate(invoice.issuedOn)}
                          </td>
                          <td className="px-4 py-3 font-mono text-[12px] text-navy-800">PAY-INITIAL</td>
                          <td className="px-4 py-3 text-[13px] text-navy-700">{invoice.method || 'Bank transfer'}</td>
                          <td className="px-4 py-3 text-[13px] text-navy-600">Full Settlement</td>
                          <td className="px-4 py-3 text-right font-medium text-emerald-700 tabular">
                            {currency(total)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              <CheckCircle2Icon className="h-3 w-3" /> Cleared
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">Remaining Balance</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-navy-900 tabular">
              {currency(balance)}
            </p>

            {/* Payment Progress Bar */}
            <div className="mt-4 space-y-1.5 border-t border-navy-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-navy-600">Payment Progress</span>
                <span className="font-semibold text-brand-700">{percentPaid}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentPaid === 100 ? 'bg-emerald-500' : percentPaid > 0 ? 'bg-brand-500' : 'bg-transparent'
                  }`}
                  style={{ width: `${percentPaid}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-navy-400 pt-0.5">
                <span>Paid: {currency(paid)}</span>
                <span>Total: {currency(total)}</span>
              </div>
            </div>

            {invoice.status !== 'Paid' && balance > 0 && (
              <div className="mt-5 pt-3 border-t border-navy-100">
                <Button
                  variant="primary"
                  className="w-full justify-center shadow-sm"
                  icon={<CreditCardIcon className="h-4 w-4" />}
                  onClick={() => setPayOpen(true)}
                >
                  {canManage ? 'Record Payment' : 'Pay Fees Now'}
                </Button>
                <p className="mt-2 text-center text-[11px] text-navy-400">
                  Select Full Settlement or Partial Installment
                </p>
              </div>
            )}

            <dl className="mt-5 space-y-2.5 border-t border-navy-100 pt-3 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Total Invoiced</dt>
                <dd className="font-semibold text-navy-800 tabular">{currency(total)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Paid to date</dt>
                <dd className="font-semibold text-emerald-600 tabular">{currency(paid)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Issued On</dt>
                <dd className="text-navy-800">{formatDate(invoice.issuedOn)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Due By</dt>
                <dd className="text-navy-800">{formatDate(invoice.dueOn)}</dd>
              </div>
              {invoice.paidOn && (
                <>
                  <div className="flex justify-between gap-3">
                    <dt className="text-navy-400">Last Payment</dt>
                    <dd className="text-navy-800">{formatDate(invoice.paidOn)}</dd>
                  </div>
                  {invoice.method && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-navy-400">Payment Mode</dt>
                      <dd className="text-navy-800">{invoice.method}</dd>
                    </div>
                  )}
                </>
              )}
            </dl>
          </Card>

          <Card className="p-4 bg-navy-50/60 border-navy-200/80">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-navy-600">
                <p className="font-semibold text-navy-900">Protected Legal Remittance</p>
                <p className="mt-0.5 text-navy-500">
                  All transactions are encrypted and deposited directly into the designated advocate trust escrow account.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      <EditInvoiceModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        invoice={invoice}
        onSave={updateInvoice}
      />

      <ClientPayModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        invoice={invoice}
        onPaySuccess={(amount, method, note) => {
          recordPayment(invoice.id, amount, method, note);
        }}
      />
    </div>
  );
}

export function ClientPayModal({
  open,
  onClose,
  invoice,
  onPaySuccess
}: {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  onPaySuccess: (amount: number, method: string, note?: string) => void;
}) {
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);

  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<string>(
    balance > 0 ? String(Math.max(1000, Math.round(balance / 2))) : ''
  );
  const [method, setMethod] = useState<'UPI' | 'Card' | 'Bank Transfer' | 'Net Banking'>('UPI');
  const [upiId, setUpiId] = useState('client@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('789');
  const [bankName, setBankName] = useState('State Bank of India');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  // Reset or initialize when modal opens or balance changes
  React.useEffect(() => {
    if (open) {
      setPaymentType('full');
      setPartialAmount(balance > 0 ? String(Math.max(500, Math.round(balance / 2))) : '');
      setError('');
    }
  }, [open, balance]);

  const effectiveAmount =
    paymentType === 'full'
      ? balance
      : parseFloat(partialAmount) || 0;

  const remainingAfterPayment = Math.max(0, balance - effectiveAmount);

  const handleApplyPreset = (ratio: number) => {
    const val = Math.round(balance * ratio);
    setPartialAmount(String(val));
    setError('');
  };

  const handlePay = () => {
    if (paymentType === 'partial') {
      const num = parseFloat(partialAmount);
      if (isNaN(num) || num <= 0) {
        setError('Please enter a valid partial fee amount greater than 0.');
        return;
      }
      if (num > balance) {
        setError(`Partial payment cannot exceed the remaining balance of ${currency(balance)}.`);
        return;
      }
    }

    if (effectiveAmount <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }

    setPaying(true);
    setError('');

    window.setTimeout(() => {
      const note =
        paymentType === 'full'
          ? 'Full Fee Settlement'
          : `Partial Fee Installment (${currency(effectiveAmount)})`;

      onPaySuccess(effectiveAmount, method, note);

      toast.success(
        paymentType === 'full' ? 'Fee settled in full!' : 'Partial payment recorded successfully!',
        {
          description: `${currency(effectiveAmount)} paid via ${method} for ${invoice.id}. Remaining: ${currency(
            remainingAfterPayment
          )}.`
        }
      );

      setPaying(false);
      onClose();
    }, 750);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Pay Fee — ${invoice.id}`}
      description="Choose full fee settlement or pay a partial installment today."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={paying}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={paying}
            disabled={effectiveAmount <= 0 || effectiveAmount > balance}
            onClick={handlePay}
          >
            Confirm & Pay {currency(effectiveAmount)}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Balance Summary Header */}
        <div className="rounded-xl border border-navy-200 bg-navy-50/70 p-4">
          <div className="grid grid-cols-3 gap-2 text-center sm:text-left">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">Total Fee</p>
              <p className="text-sm font-semibold text-navy-800 tabular">{currency(total)}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">Paid So Far</p>
              <p className="text-sm font-semibold text-emerald-600 tabular">{currency(paid)}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">Balance Due</p>
              <p className="text-base font-bold text-navy-900 tabular">{currency(balance)}</p>
            </div>
          </div>
        </div>

        {/* Payment Type Selection (Full vs Partial) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-600 mb-2">
            Select Payment Option
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Fee Option */}
            <button
              type="button"
              onClick={() => {
                setPaymentType('full');
                setError('');
              }}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                paymentType === 'full'
                  ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20'
                  : 'border-navy-200 bg-white hover:border-navy-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900">
                  <CheckCircle2Icon
                    className={`h-4 w-4 ${paymentType === 'full' ? 'text-brand-600' : 'text-navy-400'}`}
                  />
                  Full Fee Payment
                </span>
                <span className="text-xs font-bold text-navy-900 tabular">{currency(balance)}</span>
              </div>
              <p className="mt-1 text-xs text-navy-500">
                Pay entire remaining balance today. Marks invoice as fully paid.
              </p>
            </button>

            {/* Partial Fee Option */}
            <button
              type="button"
              onClick={() => {
                setPaymentType('partial');
                setError('');
              }}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                paymentType === 'partial'
                  ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20'
                  : 'border-navy-200 bg-white hover:border-navy-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900">
                  <PercentIcon
                    className={`h-4 w-4 ${paymentType === 'partial' ? 'text-brand-600' : 'text-navy-400'}`}
                  />
                  Partial Fee Payment
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-navy-100 text-navy-700">
                  Custom
                </span>
              </div>
              <p className="mt-1 text-xs text-navy-500">
                Pay a partial installment now. Remaining balance will stay pending.
              </p>
            </button>
          </div>
        </div>

        {/* Partial Amount Input Section */}
        {paymentType === 'partial' && (
          <div className="rounded-xl border border-navy-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="partial-input" className="text-xs font-semibold text-navy-700">
                Enter Installment Amount (₹)
              </label>
              <span className="text-xs text-navy-400">Max: {currency(balance)}</span>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-navy-400 pointer-events-none">
                ₹
              </span>
              <Input
                id="partial-input"
                type="number"
                min="1"
                max={balance}
                className="pl-8 text-base font-semibold"
                placeholder="Enter amount to pay"
                value={partialAmount}
                onChange={(e) => {
                  setPartialAmount(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Preset Ratio Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-medium text-navy-400">Quick suggestions:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(0.25)}
                className="px-2.5 py-1 text-xs rounded-lg border border-navy-200 bg-navy-50 font-medium text-navy-700 hover:bg-navy-100 transition-colors"
              >
                25% ({currency(Math.round(balance * 0.25))})
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(0.5)}
                className="px-2.5 py-1 text-xs rounded-lg border border-navy-200 bg-navy-50 font-medium text-navy-700 hover:bg-navy-100 transition-colors"
              >
                50% ({currency(Math.round(balance * 0.5))})
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(0.75)}
                className="px-2.5 py-1 text-xs rounded-lg border border-navy-200 bg-navy-50 font-medium text-navy-700 hover:bg-navy-100 transition-colors"
              >
                75% ({currency(Math.round(balance * 0.75))})
              </button>
            </div>

            {/* Live calculation balance breakdown */}
            <div className="rounded-lg bg-navy-50/60 p-2.5 text-xs space-y-1 border border-navy-100">
              <div className="flex justify-between text-navy-600">
                <span>Paying Today:</span>
                <span className="font-semibold text-navy-900 tabular">{currency(effectiveAmount)}</span>
              </div>
              <div className="flex justify-between text-navy-600 border-t border-navy-100 pt-1">
                <span>Remaining Balance After Payment:</span>
                <span className="font-bold text-amber-700 tabular">{currency(remainingAfterPayment)}</span>
              </div>
            </div>

            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          </div>
        )}

        {/* Payment Method Selector */}
        <div className="space-y-3 pt-1">
          <Field label="Payment Method" htmlFor="pay-method">
            <Select
              id="pay-method"
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
            >
              <option value="UPI">UPI (Google Pay, PhonePe, Paytm, BHIM)</option>
              <option value="Card">Credit / Debit Card (RuPay, Visa, MasterCard)</option>
              <option value="Net Banking">Net Banking (SBI, HDFC, ICICI, Axis)</option>
              <option value="Bank Transfer">Direct Bank Wire / NEFT / RTGS</option>
            </Select>
          </Field>

          {method === 'UPI' ? (
            <div className="rounded-xl border border-navy-200 bg-navy-50/40 p-3.5 space-y-2">
              <Field label="UPI Virtual Payment Address (VPA)" htmlFor="upi-vpa" hint="e.g. mobile@upi or username@bank">
                <Input
                  id="upi-vpa"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="client@okhdfcbank"
                />
              </Field>
              <div className="flex items-center gap-2 text-xs text-navy-500 pt-1">
                <QrCodeIcon className="h-4 w-4 text-brand-600" />
                <span>Instant QR verification will be triggered upon confirmation.</span>
              </div>
            </div>
          ) : method === 'Card' ? (
            <div className="rounded-xl border border-navy-200 bg-navy-50/40 p-3.5 space-y-3">
              <Field label="Card Number" htmlFor="card-number">
                <Input
                  id="card-number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="•••• •••• •••• ••••"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry (MM/YY)" htmlFor="card-exp">
                  <Input
                    id="card-exp"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                  />
                </Field>
                <Field label="CVV" htmlFor="card-cvv">
                  <Input
                    id="card-cvv"
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                  />
                </Field>
              </div>
            </div>
          ) : method === 'Net Banking' ? (
            <div className="rounded-xl border border-navy-200 bg-navy-50/40 p-3.5 space-y-2">
              <Field label="Choose Your Bank" htmlFor="bank-select">
                <Select
                  id="bank-select"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                >
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="Indian Bank">Indian Bank</option>
                </Select>
              </Field>
              <p className="text-xs text-navy-500">
                You will be redirected securely to the bank portal to authorize this transaction.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-navy-200 bg-white p-3.5 text-xs space-y-1.5 text-navy-700">
              <p className="font-semibold text-navy-900">Advocate Trust / Client Escrow Account</p>
              <p>Bank: State Bank of India — High Court Branch</p>
              <p>Account Name: Harbor Law Advocates Client Account</p>
              <p>Account No: 40982310098</p>
              <p>IFSC Code: SBIN0001824</p>
              <p className="text-[11px] text-navy-400 pt-1">
                Remittances will be verified and matched against reference {invoice.id}.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-navy-400">
          <ShieldCheckIcon className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>256-bit SSL encrypted. Payment receipt will be generated automatically.</span>
        </div>
      </div>
    </Modal>
  );
}

function EditInvoiceModal({
  open,
  onClose,
  invoice,
  onSave
}: {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  onSave: (invoice: Invoice) => void;
}) {
  const [form, setForm] = useState(invoice);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => setForm(invoice), [invoice]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit ${invoice.id}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={saving}
            onClick={() => {
              setSaving(true);
              window.setTimeout(() => {
                onSave(form);
                toast.success('Invoice updated', { description: `${form.id} saved.` });
                setSaving(false);
                onClose();
              }, 650);
            }}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Professional fees (₹)" htmlFor="ei-amount">
          <Input
            id="ei-amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          />
        </Field>
        <Field label="Tax (₹)" htmlFor="ei-tax">
          <Input
            id="ei-tax"
            type="number"
            value={form.tax}
            onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })}
          />
        </Field>
        <Field label="Due date" htmlFor="ei-due">
          <Input
            id="ei-due"
            type="date"
            value={form.dueOn}
            onChange={(e) => setForm({ ...form, dueOn: e.target.value })}
          />
        </Field>
        <Field label="Status" htmlFor="ei-status">
          <Select
            id="ei-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as InvoiceStatus })}
          >
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </Select>
        </Field>
        <Field label="Description" htmlFor="ei-desc" className="sm:col-span-2">
          <Textarea
            id="ei-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
      </div>
    </Modal>
  );
}