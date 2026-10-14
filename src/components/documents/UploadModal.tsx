import React, { useState } from 'react';
import { UploadCloudIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Select } from '../ui/Field';
import { useApp } from '../../contexts/AppContext';
import { cn } from '../../utils/format';
import type { DocumentType } from '../../types';

const types: DocumentType[] = [
'Petition',
'Evidence',
'Court Order',
'Agreement',
'Identity Document',
'Other'];


export function UploadModal({
  open,
  onClose,
  caseId




}: {open: boolean;onClose: () => void;caseId?: string;}) {
  const { cases, addDocument, currentUser, logActivity } = useApp();
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentType>('Evidence');
  const [target, setTarget] = useState(caseId ?? cases[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setType('Evidence');
    setError('');
    setDragging(false);
  };

  const submit = () => {
    if (!name.trim()) {
      setError('Give the document a name, or drop a file to use its filename.');
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      addDocument({
        id: `DOC-${9100 + Math.floor(Math.random() * 800)}`,
        name: name.includes('.') ? name : `${name}.pdf`,
        caseId: target,
        type,
        uploadedBy: currentUser?.name ?? 'You',
        uploadedOn: new Date().toISOString().slice(0, 10),
        size: `${(Math.random() * 3 + 0.2).toFixed(1)} MB`,
        status: 'Pending Review'
      });
      logActivity({
        type: 'document',
        message: `Uploaded “${name}” to ${target}`,
        actor: currentUser?.name ?? 'You',
        caseId: target
      });
      toast.success('Document uploaded', { description: `${name} was filed to ${target} and awaits review.` });
      setSaving(false);
      reset();
      onClose();
    }, 900);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Upload document"
      description="Files are stored in the encrypted case vault with a full audit trail."
      footer={
      <>
          <Button
          variant="secondary"
          onClick={() => {
            reset();
            onClose();
          }}>
          
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={submit}>
            Upload
          </Button>
        </>
      }>
      
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              setName(file.name);
              setError('');
            }
          }}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-9 text-center transition-[border-color,background-color] duration-150 ease-smooth',
            dragging ? 'border-brand-400 bg-brand-50/60' : 'border-navy-200 bg-navy-50/50'
          )}>
          
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-500">
            <UploadCloudIcon className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-[13px] font-medium text-navy-800">
            Drag and drop a file here, or enter a name below
          </p>
          <p className="mt-1 text-[12px] text-navy-400">PDF, DOCX, XLSX or ZIP up to 50 MB</p>
        </div>

        <Field label="Document name" htmlFor="doc-name" required error={error}>
          <Input
            id="doc-name"
            value={name}
            invalid={Boolean(error)}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g. Witness Statement — J. Alvarez.pdf" />
          
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Document type" htmlFor="doc-type">
            <Select id="doc-type" value={type} onChange={(e) => setType(e.target.value as DocumentType)}>
              {types.map((t) =>
              <option key={t} value={t}>
                  {t}
                </option>
              )}
            </Select>
          </Field>
          <Field label="Attach to case" htmlFor="doc-case">
            <Select id="doc-case" value={target} onChange={(e) => setTarget(e.target.value)} disabled={Boolean(caseId)}>
              {cases.map((c) =>
              <option key={c.id} value={c.id}>
                  {c.id} — {c.title}
                </option>
              )}
            </Select>
          </Field>
        </div>
      </div>
    </Modal>);

}