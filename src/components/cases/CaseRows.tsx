import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { PriorityFlag, StatusBadge } from '../ui/Badge';
import { TBody, TD, TH, THead, TR, TableWrap } from '../ui/Table';
import { Menu, MenuItem } from '../ui/Menu';
import { ConfirmDialog } from '../ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { advocateName, clientName } from '../../utils/selectors';
import { formatDate } from '../../utils/format';
import type { LegalCase } from '../../types';

export function CaseRows({
  items,
  variant = 'full'



}: {items: LegalCase[];variant?: 'full' | 'compact';}) {
  const { clients, advocates, removeCase, currentUser } = useApp();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<LegalCase | null>(null);
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'clerk';
  const full = variant === 'full';

  return (
    <>
      <TableWrap>
        <THead>
          <TH>Case</TH>
          {full && <TH>Case No.</TH>}
          <TH>Client</TH>
          <TH>Advocate</TH>
          {full && <TH>Court</TH>}
          <TH>Filed</TH>
          <TH>Status</TH>
          {full && <TH>Next hearing</TH>}
          <TH align="right">Action</TH>
        </THead>
        <TBody>
          {items.map((c) =>
          <TR key={c.id} onClick={() => navigate(`/cases/${c.id}`)}>
              <TD>
                <span className="block max-w-[260px] truncate text-[13px] font-medium text-navy-900">
                  {c.title}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-[11px] text-navy-400">
                  {c.id} · {c.type}
                </span>
              </TD>
              {full && <TD className="text-[13px] tabular">{c.caseNumber}</TD>}
              <TD className="text-[13px]">{clientName(clients, c.clientId)}</TD>
              <TD className="text-[13px]">{advocateName(advocates, c.advocateId)}</TD>
              {full &&
            <TD>
                  <span className="block max-w-[190px] truncate text-[13px]">{c.court}</span>
                </TD>
            }
              <TD className="whitespace-nowrap text-[13px]">{formatDate(c.filedOn)}</TD>
              <TD>
                <div className="flex flex-col items-start gap-1">
                  <StatusBadge status={c.status} />
                  {full && <PriorityFlag priority={c.priority} />}
                </div>
              </TD>
              {full &&
            <TD className="whitespace-nowrap text-[13px]">
                  {c.nextHearing ? formatDate(c.nextHearing) : <span className="text-navy-300">—</span>}
                </TD>
            }
              <TD align="right">
                <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                  <Menu
                  trigger={({ toggle }) =>
                  <button
                    onClick={toggle}
                    aria-label={`Actions for ${c.id}`}
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
                        navigate(`/cases/${c.id}`);
                      }}>
                      
                          View case
                        </MenuItem>
                        {canManage &&
                    <MenuItem
                      icon={<PencilIcon className="h-4 w-4 text-navy-400" />}
                      onClick={() => {
                        close();
                        navigate(`/cases/${c.id}?edit=1`);
                      }}>
                      
                            Edit case
                          </MenuItem>
                    }
                        {canManage &&
                    <MenuItem
                      danger
                      icon={<Trash2Icon className="h-4 w-4" />}
                      onClick={() => {
                        close();
                        setPendingDelete(c);
                      }}>
                      
                            Delete case
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeCase(pendingDelete.id);
            toast.success(`Case ${pendingDelete.id} deleted`, {
              description: 'The matter and its schedule entries were removed from the register.'
            });
          }
          setPendingDelete(null);
        }}
        title="Delete this case?"
        message={`${pendingDelete?.title ?? ''} will be removed from the case register along with its hearing schedule. This cannot be undone.`} />
      
    </>);

}