import React, { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Select } from '../ui/Field';
import { useApp } from '../../contexts/AppContext';
import { courts } from '../../data/cases';

export function ScheduleHearingModal({
  open,
  onClose,
  caseId,
  defaultDate





}: {open: boolean;onClose: () => void;caseId?: string;defaultDate?: string;}) {
  const { cases, addHearing, updateCase, logActivity, currentUser } = useApp();
  const [target, setTarget] = useState(caseId ?? cases[0]?.id ?? '');
  const [date, setDate] = useState(defaultDate ?? '2026-08-20');
  const [time, setTime] = useState('10:00');
  const [court, setCourt] = useState(courts[0]);
  const [purpose, setPurpose] = useState('');
  const [judge, setJudge] = useState('Hon. P. Verrall');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{purpose?: string;date?: string;}>({});

  React.useEffect(() => {
    if (defaultDate) setDate(defaultDate);
  }, [defaultDate]);

  const submit = () => {
    const next: {purpose?: string;date?: string;} = {};
    if (!purpose.trim()) next.purpose = 'State the purpose of the listing.';
    if (!date) next.date = 'Select a hearing date.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    window.setTimeout(() => {
      addHearing({
        id: `HR-${600 + Math.floor(Math.random() * 300)}`,
        caseId: target,
        date,
        time,
        court,
        purpose,
        status: 'Scheduled',
        judge
      });
      const matter = cases.find((c) => c.id === target);
      if (matter && (!matter.nextHearing || date < matter.nextHearing)) {
        updateCase({ ...matter, nextHearing: date });
      }
      logActivity({
        type: 'hearing',
        message: `Hearing scheduled for ${date} — ${matter?.title ?? target}`,
        actor: currentUser?.name ?? 'You',
        caseId: target
      });
      toast.success('Hearing scheduled', { description: `${target} listed for ${date} at ${time}.` });
      setSaving(false);
      setPurpose('');
      onClose();
    }, 800);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule hearing"
      description="The listing is added to the case calendar and notified to the assigned advocate."
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={submit}>
            Schedule Hearing
          </Button>
        </>
      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Case" htmlFor="hr-case" className="sm:col-span-2">
          <Select id="hr-case" value={target} onChange={(e) => setTarget(e.target.value)} disabled={Boolean(caseId)}>
            {cases.map((c) =>
            <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            )}
          </Select>
        </Field>
        <Field label="Date" htmlFor="hr-date" required error={errors.date}>
          <Input id="hr-date" type="date" value={date} invalid={Boolean(errors.date)} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Time" htmlFor="hr-time" required>
          <Input id="hr-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Field label="Court" htmlFor="hr-court" className="sm:col-span-2">
          <Select id="hr-court" value={court} onChange={(e) => setCourt(e.target.value)}>
            {courts.map((c) =>
            <option key={c} value={c}>
                {c}
              </option>
            )}
          </Select>
        </Field>
        <Field label="Purpose" htmlFor="hr-purpose" required error={errors.purpose} className="sm:col-span-2">
          <Input
            id="hr-purpose"
            value={purpose}
            invalid={Boolean(errors.purpose)}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Case management conference" />
          
        </Field>
        <Field label="Presiding judge / officer" htmlFor="hr-judge" className="sm:col-span-2">
          <Input id="hr-judge" value={judge} onChange={(e) => setJudge(e.target.value)} />
        </Field>
      </div>
    </Modal>);

}