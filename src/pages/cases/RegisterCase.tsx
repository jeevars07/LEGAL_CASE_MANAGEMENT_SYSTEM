import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GavelIcon, ReceiptTextIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import { useApp } from '../../contexts/AppContext';
import { caseTypes, courts } from '../../data/cases';
import type { CaseStatus, Invoice, LegalCase, Priority } from '../../types';

export function RegisterCase() {
  const { clients, advocates, cases, addCase, addInvoice, logActivity, currentUser } = useApp();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const newId = `LC-${1025 + Math.max(0, cases.length - 14)}`;

  const [form, setForm] = useState<LegalCase>({
    id: newId,
    caseNumber: '',
    title: '',
    type: caseTypes[0],
    description: '',
    clientId: clients[0]?.id ?? '',
    advocateId: advocates[0]?.id ?? '',
    court: courts[0],
    filedOn: new Date().toISOString().slice(0, 10),
    status: 'Pending',
    priority: 'Medium',
    stage: 'Registered'
  });

  // Billing state
  const [billAmount, setBillAmount] = useState('');
  const [billDesc, setBillDesc] = useState('Legal consultation and case filing fees');
  const [billDue, setBillDue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [addBilling, setAddBilling] = useState(true);

  const set = <K extends keyof LegalCase,>(key: K, value: LegalCase[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.caseNumber.trim()) next.caseNumber = 'Court case number is required.';
    if (!form.title.trim()) next.title = 'Give the matter a descriptive title.';
    if (!form.description.trim()) next.description = 'Summarise the claim or charge.';
    if (!form.filedOn) next.filedOn = 'Filing date is required.';
    if (addBilling) {
      if (!billAmount || isNaN(Number(billAmount)) || Number(billAmount) <= 0)
        next.billAmount = 'Enter a valid fee amount (e.g. 5000).';
      if (!billDesc.trim()) next.billDesc = 'Enter a description for the invoice.';
      if (!billDue) next.billDue = 'Select a due date for the invoice.';
      if (billDue && billDue < form.filedOn) next.billDue = 'Due date cannot be before the filing date.';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Please correct the highlighted fields');
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      addCase(form);

      if (addBilling) {
        const amount = parseFloat(billAmount);
        const tax = parseFloat((amount * 0.18).toFixed(2));
        const invoice: Invoice = {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          clientId: form.clientId,
          caseId: form.id,
          description: billDesc,
          amount,
          tax,
          issuedOn: form.filedOn,
          dueOn: billDue,
          status: 'Pending'
        };
        addInvoice(invoice);
        logActivity({
          type: 'billing',
          message: `Invoice ${invoice.id} raised ₹${(amount + tax).toLocaleString('en-IN')} for ${form.title}`,
          actor: currentUser?.name ?? 'System',
          caseId: form.id
        });
      }

      logActivity({
        type: 'case',
        message: `Case registered — ${form.title}`,
        actor: currentUser?.name ?? 'You',
        caseId: form.id
      });

      toast.success('Case registered', {
        description: `${form.id} · ${form.caseNumber}${addBilling ? ' — Invoice created' : ''}`
      });
      setSaving(false);
      navigate(`/cases/${form.id}`);
    }, 800);
  };

  const sections = [
    {
      title: 'Case Information',
      description: 'Details as recorded in the court register.',
      body: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Case number" htmlFor="caseNumber" required error={errors.caseNumber}>
            <Input
              id="caseNumber"
              value={form.caseNumber}
              invalid={Boolean(errors.caseNumber)}
              onChange={(e) => set('caseNumber', e.target.value)}
              placeholder="CIV/2026/00420" />
          </Field>
          <Field label="Case type" htmlFor="type">
            <Select id="type" value={form.type} onChange={(e) => set('type', e.target.value)}>
              {caseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Case title" htmlFor="title" required error={errors.title} className="sm:col-span-2">
            <Input
              id="title"
              value={form.title}
              invalid={Boolean(errors.title)}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Mehta v. Northbay Property Trust" />
          </Field>
          <Field
            label="Description"
            htmlFor="description"
            required
            error={errors.description}
            hint="Summarise the relief sought and key facts."
            className="sm:col-span-2">
            <Textarea
              id="description"
              value={form.description}
              invalid={Boolean(errors.description)}
              onChange={(e) => set('description', e.target.value)} />
          </Field>
          <Field label="Filing date" htmlFor="filedOn" required error={errors.filedOn}>
            <Input
              id="filedOn"
              type="date"
              value={form.filedOn}
              invalid={Boolean(errors.filedOn)}
              onChange={(e) => set('filedOn', e.target.value)} />
          </Field>
          <Field label="Court name" htmlFor="court">
            <Select id="court" value={form.court} onChange={(e) => set('court', e.target.value)}>
              {courts.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
      )
    },
    {
      title: 'Client & Advocate',
      description: 'Who the matter belongs to and who will run it.',
      body: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Select client" htmlFor="clientId" required>
            <Select id="clientId" value={form.clientId} onChange={(e) => set('clientId', e.target.value)}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
              ))}
            </Select>
          </Field>
          <Field label="Select advocate" htmlFor="advocateId" required>
            <Select id="advocateId" value={form.advocateId} onChange={(e) => set('advocateId', e.target.value)}>
              {advocates.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.specialization}</option>
              ))}
            </Select>
          </Field>
        </div>
      )
    },
    {
      title: 'Status & Priority',
      description: 'How the matter should be tracked from today.',
      body: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Case status" htmlFor="status">
            <Select id="status" value={form.status} onChange={(e) => set('status', e.target.value as CaseStatus)}>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </Select>
          </Field>
          <Field label="Priority" htmlFor="priority">
            <Select id="priority" value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </Field>
        </div>
      )
    }
  ];

  const billAmountNum = parseFloat(billAmount) || 0;
  const billTax = parseFloat((billAmountNum * 0.18).toFixed(2));
  const billTotal = billAmountNum + billTax;

  return (
    <form onSubmit={submit} noValidate className="space-y-6 pb-4">
      <PageHeader
        title="Register Case"
        subtitle="Open a new matter and link it to a client, advocate and court."
        actions={
          <>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} icon={<GavelIcon className="h-4 w-4" />}>
              Register Case
            </Button>
          </>
        } />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}>
              <Card>
                <CardHeader title={section.title} description={section.description} />
                <div className="p-5">{section.body}</div>
              </Card>
            </motion.div>
          ))}

          {/* ── Billing Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}>
            <Card>
              <div className="flex items-center justify-between px-5 pt-5 pb-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <ReceiptTextIcon className="h-4 w-4 text-emerald-600" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-navy-900">Billing / Invoice</p>
                    <p className="text-[12px] text-navy-400">Raise an invoice at the time of case registration.</p>
                  </div>
                </div>
                {/* Toggle */}
                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-navy-700">
                  <div
                    onClick={() => setAddBilling((v) => !v)}
                    className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors duration-200 ${addBilling ? 'bg-emerald-500' : 'bg-navy-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${addBilling ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  {addBilling ? 'Enabled' : 'Skip billing'}
                </label>
              </div>

              {addBilling && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Fee amount (₹)" htmlFor="billAmount" required error={errors.billAmount}
                      hint="18% GST will be added automatically.">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-navy-400">₹</span>
                        <Input
                          id="billAmount"
                          type="number"
                          min="0"
                          step="100"
                          value={billAmount}
                          invalid={Boolean(errors.billAmount)}
                          onChange={(e) => { setBillAmount(e.target.value); setErrors((err) => ({ ...err, billAmount: '' })); }}
                          className="pl-7"
                          placeholder="5000" />
                      </div>
                    </Field>
                    <Field label="Invoice due date" htmlFor="billDue" required error={errors.billDue}>
                      <Input
                        id="billDue"
                        type="date"
                        value={billDue}
                        invalid={Boolean(errors.billDue)}
                        onChange={(e) => { setBillDue(e.target.value); setErrors((err) => ({ ...err, billDue: '' })); }} />
                    </Field>
                  </div>
                  <Field label="Invoice description" htmlFor="billDesc" required error={errors.billDesc}>
                    <Input
                      id="billDesc"
                      value={billDesc}
                      invalid={Boolean(errors.billDesc)}
                      onChange={(e) => { setBillDesc(e.target.value); setErrors((err) => ({ ...err, billDesc: '' })); }}
                      placeholder="Legal consultation and case filing fees" />
                  </Field>

                  {/* Live fee breakdown */}
                  {billAmountNum > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 mb-2">Fee Breakdown</p>
                      <div className="space-y-1.5 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-navy-500">Base fee</span>
                          <span className="font-medium text-navy-800">₹{billAmountNum.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-navy-500">GST (18%)</span>
                          <span className="font-medium text-navy-800">₹{billTax.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-t border-emerald-200 pt-1.5 font-semibold">
                          <span className="text-emerald-800">Total payable</span>
                          <span className="text-emerald-700">₹{billTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Sidebar summary */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <h3 className="text-[13px] font-semibold text-navy-900">Registration summary</h3>
            <dl className="mt-3 space-y-2.5 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Case ID</dt>
                <dd className="font-medium text-navy-800 tabular">{form.id}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Client</dt>
                <dd className="truncate font-medium text-navy-800">
                  {clients.find((c) => c.id === form.clientId)?.name ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Advocate</dt>
                <dd className="truncate font-medium text-navy-800">
                  {advocates.find((a) => a.id === form.advocateId)?.name ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Status</dt>
                <dd className="font-medium text-navy-800">{form.status}</dd>
              </div>
              {addBilling && billAmountNum > 0 && (
                <>
                  <div className="border-t border-navy-100 pt-2 flex justify-between gap-3">
                    <dt className="text-navy-400">Invoice total</dt>
                    <dd className="font-semibold text-emerald-700">₹{billTotal.toLocaleString('en-IN')}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-navy-400">Due date</dt>
                    <dd className="font-medium text-navy-800">{billDue || '—'}</dd>
                  </div>
                </>
              )}
            </dl>
            <p className="mt-4 border-t border-navy-100 pt-3 text-[12px] leading-relaxed text-navy-400">
              After registration you can schedule hearings, upload filings and raise invoices from the case record.
            </p>
          </Card>
        </aside>
      </div>
    </form>
  );
}