import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadIcon, EyeIcon, MoreHorizontalIcon, ShieldCheckIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Menu, MenuItem } from '../../components/ui/Menu';
import { ConfirmDialog } from '../../components/ui/Modal';
import { FilterSelect, SearchInput, Toolbar } from '../../components/ui/Toolbar';
import { TBody, TD, TH, THead, TR, TableWrap } from '../../components/ui/Table';
import { EmptyState, TableSkeleton } from '../../components/ui/States';
import { UploadModal } from '../../components/documents/UploadModal';
import { VerifyDocumentModal } from '../../components/documents/VerifyDocumentModal';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { formatDate } from '../../utils/format';
import { clientName, visibleCases } from '../../utils/selectors';
import type { LegalDocument } from '../../types';

export function Documents({ recentOnly = false }: {recentOnly?: boolean;}) {
  const { documents, cases, clients, currentUser, removeDocument } = useApp();
  const { loading } = useSimulatedLoad();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<LegalDocument | null>(null);
  const [verifyDoc, setVerifyDoc] = useState<LegalDocument | null>(null);

  const scopedIds = new Set(visibleCases(cases, currentUser).map((c) => c.id));
  const canUpload = currentUser?.role !== 'client';
  const canVerify = currentUser?.role === 'admin' || currentUser?.role === 'advocate';

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = documents.filter((d) => scopedIds.has(d.caseId));
    const filtered = base.filter(
      (d) =>
      (!q || `${d.name} ${d.caseId} ${d.type} ${d.uploadedBy}`.toLowerCase().includes(q)) && (
      !type || d.type === type) && (
      !status || d.status === status)
    );
    const sorted = [...filtered].sort((a, b) => b.uploadedOn.localeCompare(a.uploadedOn));
    return recentOnly ? sorted.slice(0, 8) : sorted;
  }, [documents, query, type, status, scopedIds, recentOnly]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={recentOnly ? 'Recent Documents' : currentUser?.role === 'client' ? 'My Documents' : 'Documents'}
        subtitle={
        recentOnly ?
        'The latest filings added to the case vault.' :
        'Every petition, order, agreement and exhibit filed across your matters.'
        }
        actions={
        canUpload ?
        <Button variant="primary" icon={<UploadIcon className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button> :
        undefined
        } />
      

      <Card>
        <Toolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search documents, cases or uploaders" />
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label="Type"
              value={type}
              onChange={setType}
              options={['Petition', 'Evidence', 'Court Order', 'Agreement', 'Identity Document', 'Other']} />
            
            <FilterSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={['Verified', 'Pending Review']} />
            
            <span className="text-[12px] text-navy-400 tabular">{rows.length} documents</span>
          </div>
        </Toolbar>

        {loading ?
        <TableSkeleton rows={7} cols={7} /> :
        rows.length === 0 ?
        <EmptyState
          title="No documents found"
          message="Try adjusting your search or filters, or upload a document to a matter."
          action={
          canUpload ?
          <Button variant="primary" onClick={() => setUploadOpen(true)}>
                  Upload Document
                </Button> :
          undefined
          } /> :


        <TableWrap>
            <THead>
              <TH>Document name</TH>
              <TH>Case</TH>
              <TH>Client</TH>
              <TH>Type</TH>
              <TH>Uploaded by</TH>
              <TH>Date</TH>
              <TH align="right">Size</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </THead>
            <TBody>
              {rows.map((d) => {
              const matter = cases.find((c) => c.id === d.caseId);
              return (
                <TR key={d.id} onClick={() => navigate(`/cases/${d.caseId}`)}>
                    <TD>
                      <span className="block max-w-[280px] truncate text-[13px] font-medium text-navy-900">
                        {d.name}
                      </span>
                      <span className="text-[11px] text-navy-400 tabular">{d.id}</span>
                    </TD>
                    <TD>
                      <span className="block max-w-[180px] truncate text-[13px]">{matter?.title ?? d.caseId}</span>
                      <span className="text-[11px] text-navy-400 tabular">{d.caseId}</span>
                    </TD>
                    <TD className="text-[13px]">{matter ? clientName(clients, matter.clientId) : '—'}</TD>
                    <TD className="text-[13px]">{d.type}</TD>
                    <TD className="text-[13px]">{d.uploadedBy}</TD>
                    <TD className="whitespace-nowrap text-[13px]">{formatDate(d.uploadedOn)}</TD>
                    <TD align="right" className="text-[13px] tabular">
                      {d.size}
                    </TD>
                    <TD>
                      <StatusBadge status={d.status} />
                    </TD>
                    <TD align="right">
                      <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                        <Menu
                        trigger={({ toggle }) =>
                        <button
                          onClick={toggle}
                          aria-label={`Actions for ${d.name}`}
                          className="rounded-lg border border-transparent p-1.5 text-navy-400 transition-colors duration-150 ease-smooth hover:border-navy-200 hover:bg-white hover:text-navy-800">
                          
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </button>
                        }>
                        
                          {(close) =>
                        <>
                              <MenuItem
                            icon={<ShieldCheckIcon className="h-4 w-4 text-navy-400" />}
                            onClick={() => {
                              close();
                              setVerifyDoc(d);
                            }}>
                            
                                {d.status === 'Pending Review' && canVerify ? 'Verify / Reject' : 'View Document'}
                              </MenuItem>
                              <MenuItem
                            icon={<EyeIcon className="h-4 w-4 text-navy-400" />}
                            onClick={() => {
                              close();
                              navigate(`/cases/${d.caseId}`);
                            }}>
                            
                                View in case
                              </MenuItem>
                              <MenuItem
                            icon={<DownloadIcon className="h-4 w-4 text-navy-400" />}
                            onClick={() => {
                              close();
                              toast.success('Download started', { description: d.name });
                            }}>
                            
                                Download
                              </MenuItem>
                              {canUpload &&
                          <MenuItem
                            danger
                            icon={<Trash2Icon className="h-4 w-4" />}
                            onClick={() => {
                              close();
                              setPendingDelete(d);
                            }}>
                            
                                  Delete
                                </MenuItem>
                          }
                            </>
                        }
                        </Menu>
                      </div>
                    </TD>
                  </TR>);

            })}
            </TBody>
          </TableWrap>
        }
      </Card>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <VerifyDocumentModal doc={verifyDoc} onClose={() => setVerifyDoc(null)} />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this document?"
        message={`${pendingDelete?.name ?? ''} will be removed from the case vault. The deletion is recorded in the audit log.`}
        onConfirm={() => {
          if (pendingDelete) {
            removeDocument(pendingDelete.id);
            toast.success('Document deleted', { description: pendingDelete.name });
          }
          setPendingDelete(null);
        }} />
      
    </div>);

}