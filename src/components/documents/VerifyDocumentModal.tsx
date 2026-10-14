import React, { useState } from 'react';
import {
  CheckCircle2Icon,
  FileTextIcon,
  ShieldCheckIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { formatDate } from '../../utils/format';
import type { LegalDocument } from '../../types';

interface Props {
  doc: LegalDocument | null;
  onClose: () => void;
}

const TYPE_ICON: Record<string, string> = {
  Petition: '📄',
  Evidence: '🔍',
  'Court Order': '⚖️',
  Agreement: '🤝',
  'Identity Document': '🪪',
  Other: '📁',
};

export function VerifyDocumentModal({ doc, onClose }: Props) {
  const { verifyDocument, currentUser } = useApp();
  const [remarks, setRemarks] = useState(doc?.remarks ?? '');
  const [busy, setBusy] = useState(false);

  if (!doc) return null;

  const isPending = doc.status === 'Pending Review';
  const canVerify =
    currentUser?.role === 'admin' || currentUser?.role === 'advocate';

  function handleVerdict(verdict: 'Verified' | 'Rejected') {
    if (!doc || !currentUser) return;
    setBusy(true);
    setTimeout(() => {
      verifyDocument(doc.id, verdict, currentUser.name, remarks.trim() || undefined);
      toast.success(
        verdict === 'Verified' ? '✅ Document Verified' : '❌ Document Rejected',
        { description: doc.name }
      );
      setBusy(false);
      onClose();
    }, 600);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="verify-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="verify-modal__header">
          <div className="verify-modal__icon">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="verify-modal__title">Document Verification</h2>
            <p className="verify-modal__subtitle">
              Review and verify the document before approving it for the case record.
            </p>
          </div>
          <button className="verify-modal__close" onClick={onClose} aria-label="Close">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Document meta card */}
        <div className="verify-modal__meta">
          <div className="verify-modal__meta-icon">
            {TYPE_ICON[doc.type] ?? '📁'}
          </div>
          <div className="verify-modal__meta-info">
            <span className="verify-modal__meta-name">{doc.name}</span>
            <span className="verify-modal__meta-id">{doc.id}</span>
          </div>
          <span
            className={`verify-modal__badge verify-modal__badge--${
              doc.status === 'Verified'
                ? 'verified'
                : doc.status === 'Rejected'
                ? 'rejected'
                : 'pending'
            }`}
          >
            {doc.status}
          </span>
        </div>

        {/* Details grid */}
        <div className="verify-modal__grid">
          <div className="verify-modal__field">
            <span className="verify-modal__label">Document Type</span>
            <span className="verify-modal__value">{doc.type}</span>
          </div>
          <div className="verify-modal__field">
            <span className="verify-modal__label">File Size</span>
            <span className="verify-modal__value">{doc.size}</span>
          </div>
          <div className="verify-modal__field">
            <span className="verify-modal__label">Uploaded By</span>
            <span className="verify-modal__value">{doc.uploadedBy}</span>
          </div>
          <div className="verify-modal__field">
            <span className="verify-modal__label">Upload Date</span>
            <span className="verify-modal__value">{formatDate(doc.uploadedOn)}</span>
          </div>
          {doc.verifiedBy && (
            <div className="verify-modal__field">
              <span className="verify-modal__label">
                {doc.status === 'Rejected' ? 'Rejected By' : 'Verified By'}
              </span>
              <span className="verify-modal__value">{doc.verifiedBy}</span>
            </div>
          )}
          {doc.verifiedOn && (
            <div className="verify-modal__field">
              <span className="verify-modal__label">
                {doc.status === 'Rejected' ? 'Rejected On' : 'Verified On'}
              </span>
              <span className="verify-modal__value">{formatDate(doc.verifiedOn)}</span>
            </div>
          )}
        </div>

        {/* Previous remarks (read-only if already decided) */}
        {doc.remarks && !isPending && (
          <div className="verify-modal__remarks-display">
            <span className="verify-modal__label">Remarks</span>
            <p className="verify-modal__remarks-text">{doc.remarks}</p>
          </div>
        )}

        {/* Simulate preview */}
        <div className="verify-modal__preview">
          <FileTextIcon className="h-8 w-8 text-navy-300" />
          <p className="text-[13px] text-navy-400 mt-2">
            Document preview not available in demo mode.
          </p>
          <p className="text-[11px] text-navy-300">
            In production, the actual file would be rendered here.
          </p>
        </div>

        {/* Remarks textarea (only editable if can verify and pending) */}
        {canVerify && isPending && (
          <div className="verify-modal__remarks">
            <label className="verify-modal__label" htmlFor="doc-remarks">
              Remarks / Notes <span className="text-navy-400">(optional)</span>
            </label>
            <textarea
              id="doc-remarks"
              className="verify-modal__textarea"
              rows={3}
              placeholder="Add notes about this document (e.g. signature missing, document authentic, etc.)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="verify-modal__actions">
          <button className="verify-modal__btn-cancel" onClick={onClose} disabled={busy}>
            Close
          </button>
          {canVerify && isPending && (
            <>
              <button
                className="verify-modal__btn-reject"
                onClick={() => handleVerdict('Rejected')}
                disabled={busy}
              >
                <XCircleIcon className="h-4 w-4" />
                {busy ? 'Processing…' : 'Reject Document'}
              </button>
              <button
                className="verify-modal__btn-verify"
                onClick={() => handleVerdict('Verified')}
                disabled={busy}
              >
                <CheckCircle2Icon className="h-4 w-4" />
                {busy ? 'Verifying…' : 'Verify Document'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
