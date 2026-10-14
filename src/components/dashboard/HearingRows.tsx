import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../ui/Badge';
import { TBody, TD, TH, THead, TR, TableWrap } from '../ui/Table';
import { EmptyState } from '../ui/States';
import { useApp } from '../../contexts/AppContext';
import { advocateName, clientName } from '../../utils/selectors';
import { formatDate } from '../../utils/format';
import type { Hearing } from '../../types';

export function HearingRows({ hearings, showCourt = true }: {hearings: Hearing[];showCourt?: boolean;}) {
  const { cases, clients, advocates } = useApp();
  const navigate = useNavigate();

  if (hearings.length === 0) {
    return (
      <EmptyState
        title="No hearings scheduled"
        message="Once a hearing is listed for a matter it will appear here with its court and purpose." />);


  }

  return (
    <TableWrap>
      <THead>
        <TH>Date &amp; time</TH>
        <TH>Case</TH>
        <TH>Client</TH>
        <TH>Advocate</TH>
        {showCourt && <TH>Court</TH>}
        <TH align="right">Status</TH>
      </THead>
      <TBody>
        {hearings.map((h) => {
          const matter = cases.find((c) => c.id === h.caseId);
          return (
            <TR key={h.id} onClick={() => navigate(`/cases/${h.caseId}`)}>
              <TD>
                <span className="block text-[13px] font-medium text-navy-900">{formatDate(h.date)}</span>
                <span className="block text-[11px] text-navy-400 tabular">{h.time}</span>
              </TD>
              <TD>
                <span className="block max-w-[220px] truncate text-[13px] font-medium text-navy-900">
                  {matter?.title ?? h.caseId}
                </span>
                <span className="block text-[11px] text-navy-400">{h.caseId} · {h.purpose}</span>
              </TD>
              <TD className="text-[13px]">{matter ? clientName(clients, matter.clientId) : '—'}</TD>
              <TD className="text-[13px]">{matter ? advocateName(advocates, matter.advocateId) : '—'}</TD>
              {showCourt &&
              <TD>
                  <span className="block max-w-[200px] truncate text-[13px]">{h.court}</span>
                  <span className="block text-[11px] text-navy-400">{h.judge}</span>
                </TD>
              }
              <TD align="right">
                <StatusBadge status={h.status} />
              </TD>
            </TR>);

        })}
      </TBody>
    </TableWrap>);

}