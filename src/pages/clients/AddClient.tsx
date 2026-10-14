import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import { useApp } from '../../contexts/AppContext';
import type { Client } from '../../types';

type Errors = Partial<Record<keyof Client, string>>;

export function AddClient() {
  const { clients, addClient, updateClient, logActivity } = useApp();
  const [params] = useSearchParams();
  const editId = params.get('id');
  const existing = clients.find((c) => c.id === editId);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState<Client>(
    existing ?? {
      id: `CL-${1000 + clients.length + 1}`,
      name: '',
      email: '',
      phone: '',
      gender: 'Female',
      dob: '',
      address: '',
      city: '',
      state: 'Tamil Nadu',
      postalCode: '',
      notes: '',
      registeredOn: new Date().toISOString().slice(0, 10),
      status: 'Active'
    }
  );

  const set = <K extends keyof Client,>(key: K, value: Client[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email address is required.';else
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'A contact number is required.';
    if (!form.dob) next.dob = 'Date of birth or incorporation is required.';
    if (!form.address.trim()) next.address = 'Street address is required.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (!form.postalCode.trim()) next.postalCode = 'Postal code is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the highlighted fields', {
        description: 'Required client details are missing or invalid.'
      });
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      if (existing) {
        updateClient(form);
        toast.success('Client updated', { description: `${form.name}’s record has been saved.` });
      } else {
        addClient(form);
        logActivity({ type: 'client', message: `New client registered — ${form.name}`, actor: 'You' });
        toast.success('Client registered', {
          description: `${form.name} was added to the client register as ${form.id}.`
        });
      }
      setSaving(false);
      navigate(`/clients/${form.id}`);
    }, 750);
  };

  const emailValid = useMemo(
    () => Boolean(form.email) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email),
    [form.email]
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-6 pb-4">
      <PageHeader
        title={existing ? `Edit ${existing.name}` : 'Add Client'}
        subtitle={
        existing ?
        'Update the contact and address details held for this client.' :
        'Register a new client and capture the details needed to open matters on their behalf.'
        }
        actions={
        <>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} icon={<SaveIcon className="h-4 w-4" />}>
              {existing ? 'Save Changes' : 'Save Client'}
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          {[
          {
            title: 'Personal Information',
            description: 'Identity details recorded for conflict checks and correspondence.',
            body:
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" required error={errors.name} className="sm:col-span-2">
                    <Input
                  id="name"
                  value={form.name}
                  invalid={Boolean(errors.name)}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Rosalind Hayes or Hayes Clinic Ltd" />
                
                  </Field>
                  <Field label="Date of birth / incorporation" htmlFor="dob" required error={errors.dob}>
                    <Input
                  id="dob"
                  type="date"
                  value={form.dob}
                  invalid={Boolean(errors.dob)}
                  onChange={(e) => set('dob', e.target.value)} />
                
                  </Field>
                  <Field label="Gender / entity type" htmlFor="gender">
                    <Select id="gender" value={form.gender} onChange={(e) => set('gender', e.target.value as Client['gender'])}>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other / Organisation</option>
                    </Select>
                  </Field>
                  <Field label="Phone" htmlFor="phone" required error={errors.phone}>
                    <Input
                  id="phone"
                  value={form.phone}
                  invalid={Boolean(errors.phone)}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+1 (415) 555-0100" />
                
                  </Field>
                  <Field
                label="Email"
                htmlFor="email"
                required
                error={errors.email}
                success={emailValid && !errors.email ? 'Email format looks correct.' : undefined}>
                
                    <Input
                  id="email"
                  type="email"
                  value={form.email}
                  valid={emailValid}
                  invalid={Boolean(errors.email)}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="client@example.com" />
                
                  </Field>
                </div>

          },
          {
            title: 'Address',
            description: 'Used for service of documents and invoicing.',
            body:
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Address" htmlFor="address" required error={errors.address} className="sm:col-span-2">
                    <Input
                  id="address"
                  value={form.address}
                  invalid={Boolean(errors.address)}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Street, building and suite" />
                
                  </Field>
                  <Field label="City" htmlFor="city" required error={errors.city}>
                    <Input id="city" value={form.city} invalid={Boolean(errors.city)} onChange={(e) => set('city', e.target.value)} />
                  </Field>
                  <Field label="State" htmlFor="state">
                    <Input id="state" value={form.state} onChange={(e) => set('state', e.target.value)} />
                  </Field>
                  <Field label="Postal code" htmlFor="postal" required error={errors.postalCode}>
                    <Input
                  id="postal"
                  value={form.postalCode}
                  invalid={Boolean(errors.postalCode)}
                  onChange={(e) => set('postalCode', e.target.value)} />
                
                  </Field>
                  <Field label="Client status" htmlFor="status">
                    <Select id="status" value={form.status} onChange={(e) => set('status', e.target.value as Client['status'])}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Select>
                  </Field>
                </div>

          },
          {
            title: 'Additional Information',
            description: 'Internal notes visible to your team only.',
            body:
            <Field label="Notes" htmlFor="notes" hint="Retainer scope, preferred contact times, conflict notes.">
                  <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="e.g. Corporate account — invoices routed to accounts payable with 30-day terms." />
              
                </Field>

          }].
          map((section, i) =>
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
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <h3 className="text-[13px] font-semibold text-navy-900">Record summary</h3>
            <dl className="mt-3 space-y-2.5 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Client ID</dt>
                <dd className="font-medium text-navy-800 tabular">{form.id}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Registered</dt>
                <dd className="font-medium text-navy-800">{form.registeredOn}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-navy-400">Status</dt>
                <dd className="font-medium text-navy-800">{form.status}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-navy-100 pt-3 text-[12px] leading-relaxed text-navy-400">
              Fields marked <span className="text-red-500">*</span> are required before the record can be
              saved. Client data is encrypted at rest and access is logged.
            </p>
          </Card>
        </aside>
      </div>
    </form>);

}