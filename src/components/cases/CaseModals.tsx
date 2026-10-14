import React, { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Select, Textarea } from '../ui/Field';
import { Avatar } from '../ui/Avatar';
import { useApp } from '../../contexts/AppContext';
import { caseTypes, courts } from '../../data/cases';
import { cn } from '../../utils/format';
import type { CaseStatus, LegalCase, Priority } from '../../types';

export function EditCaseModal({
  open,
  onClose,
  legalCase




}: {open: boolean;onClose: () => void;legalCase: LegalCase;}) {
  const { updateCase, logActivity, currentUser } = useApp();
  const [form, setForm] = useState<LegalCase>(legalCase);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => setForm(legalCase), [legalCase]);

  const submit = () => {
    setSaving(true);
    window.setTimeout(() => {
      updateCase(form);
      logActivity({
        type: 'case',
        message: `Case updated — ${form.title} (${form.status})`,
        actor: currentUser?.name ?? 'You',
        caseId: form.id
      });
      toast.success('Case updated', { description: `${form.id} now shows as ${form.status}.` });
      setSaving(false);
      onClose();
    }, 700);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit case"
      description="Changes are recorded in the case activity log."
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={submit}>
            Save Changes
          </Button>
        </>
      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Case title" htmlFor="ec-title" className="sm:col-span-2">
          <Input id="ec-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Case number" htmlFor="ec-number">
          <Input id="ec-number" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} />
        </Field>
        <Field label="Case type" htmlFor="ec-type">
          <Select id="ec-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {caseTypes.map((t) =>
            <option key={t}>{t}</option>
            )}
          </Select>
        </Field>
        <Field label="Status" htmlFor="ec-status">
          <Select
            id="ec-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as CaseStatus })}>
            
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </Select>
        </Field>
        <Field label="Priority" htmlFor="ec-priority">
          <Select
            id="ec-priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
            
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Field>
        <Field label="Court" htmlFor="ec-court" className="sm:col-span-2">
          <Select id="ec-court" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })}>
            {courts.map((c) =>
            <option key={c}>{c}</option>
            )}
          </Select>
        </Field>
        <Field label="Current stage" htmlFor="ec-stage" className="sm:col-span-2">
          <Input id="ec-stage" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} />
        </Field>
        <Field label="Description" htmlFor="ec-desc" className="sm:col-span-2">
          <Textarea
            id="ec-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          
        </Field>
      </div>
    </Modal>);

}

export function AssignAdvocateModal({
  open,
  onClose,
  legalCase
}: {open: boolean;onClose: () => void;legalCase: LegalCase;}) {
  const { advocates, cases, updateCase, logActivity, currentUser } = useApp();
  const [selected, setSelected] = useState(legalCase.advocateId);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setSelected(legalCase.advocateId);
  }, [legalCase.advocateId, open]);

  const hasCurrentAdvocate = Boolean(legalCase.advocateId && legalCase.advocateId !== '');

  const submit = () => {
    setSaving(true);
    window.setTimeout(() => {
      updateCase({ ...legalCase, advocateId: selected });
      const advocate = advocates.find((a) => a.id === selected);
      logActivity({
        type: 'advocate',
        message: `${advocate?.name ?? 'Advocate'} ${hasCurrentAdvocate ? 'reassigned to' : 'assigned to'} ${legalCase.title}`,
        actor: currentUser?.name ?? 'You',
        caseId: legalCase.id
      });
      toast.success(hasCurrentAdvocate ? 'Advocate reassigned' : 'Advocate assigned', {
        description: `${advocate?.name} now leads ${legalCase.id}.`
      });
      setSaving(false);
      onClose();
    }, 700);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={hasCurrentAdvocate ? 'Reassign advocate' : 'Assign advocate'}
      description={hasCurrentAdvocate ? `Change the lead counsel for ${legalCase.id}.` : `Choose the lead counsel for ${legalCase.id}.`}
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={submit}>
            {hasCurrentAdvocate ? 'Reassign' : 'Assign'}
          </Button>
        </>
      }>
      
      <ul className="space-y-2">
        {advocates.map((a) => {
          const load = cases.filter((c) => c.advocateId === a.id && c.status !== 'Closed').length;
          const active = a.id === selected;
          const isCurrentlyAssigned = a.id === legalCase.advocateId;
          return (
            <li key={a.id}>
              <button
                onClick={() => setSelected(a.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-[border-color,background-color] duration-150 ease-smooth',
                  active ? 'border-navy-900 bg-navy-50' : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50/60'
                )}>
                
                <Avatar name={a.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="block truncate text-[13px] font-medium text-navy-900">{a.name}</span>
                    {isCurrentlyAssigned && (
                      <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-800">
                        Current Lead
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-navy-400">
                    {a.specialization} · {a.yearsExperience} yrs · {a.status}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] font-medium text-navy-500 tabular">
                  {load} open
                </span>
              </button>
            </li>);

        })}
      </ul>
    </Modal>);

}