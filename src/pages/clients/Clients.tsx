import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, UserPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Menu, MenuItem } from '../../components/ui/Menu';
import { ConfirmDialog } from '../../components/ui/Modal';
import { FilterSelect, SearchInput, Toolbar } from '../../components/ui/Toolbar';
import { TBody, TD, TH, THead, TR, TableWrap } from '../../components/ui/Table';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/States';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { formatDate } from '../../utils/format';
import type { Client } from '../../types';

export function Clients() {
  const { clients, cases, removeClient } = useApp();
  const { loading, error, retry } = useSimulatedLoad();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [period, setPeriod] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Client | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      const matchesQuery =
      !q || `${c.name} ${c.email} ${c.id} ${c.phone} ${c.city}`.toLowerCase().includes(q);
      const matchesStatus = !status || c.status === status;
      const year = c.registeredOn.slice(0, 4);
      const matchesPeriod =
      !period ||
      period === '2026' && year === '2026' ||
      period === '2025' && year === '2025' ||
      period === 'Before 2025' && year < '2025';
      return matchesQuery && matchesStatus && matchesPeriod;
    });
  }, [clients, query, status, period]);

  const activeCaseCount = (clientId: string) =>
  cases.filter((c) => c.clientId === clientId && c.status === 'Active').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="Manage and track all clients associated with your legal practice."
        actions={
        <Button
          variant="primary"
          icon={<UserPlusIcon className="h-4 w-4" />}
          onClick={() => navigate('/clients/new')}>
          
            Add Client
          </Button>
        } />
      

      <Card>
        <Toolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search clients by name, email or ID" />
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect label="Status" value={status} onChange={setStatus} options={['Active', 'Inactive']} />
            <FilterSelect
              label="Registered"
              value={period}
              onChange={setPeriod}
              options={['2026', '2025', 'Before 2025']} />
            
            <span className="text-[12px] text-navy-400 tabular">{rows.length} of {clients.length}</span>
          </div>
        </Toolbar>

        {error ?
        <ErrorState title="Unable to load clients" onRetry={retry} /> :
        loading ?
        <TableSkeleton rows={7} cols={7} /> :
        rows.length === 0 ?
        <EmptyState
          title="No clients found"
          message="Try adjusting your search or filters, or register a new client to get started."
          action={
          <Button variant="primary" icon={<UserPlusIcon className="h-4 w-4" />} onClick={() => navigate('/clients/new')}>
                Add Client
              </Button>
          } /> :


        <TableWrap>
            <THead>
              <TH>Client</TH>
              <TH>Client ID</TH>
              <TH>Contact</TH>
              <TH align="center">Active cases</TH>
              <TH>Registered</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </THead>
            <TBody>
              {rows.map((c) =>
            <TR key={c.id} onClick={() => navigate(`/clients/${c.id}`)}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-navy-900">{c.name}</p>
                        <p className="text-[11px] text-navy-400">{c.city}, {c.state}</p>
                      </div>
                    </div>
                  </TD>
                  <TD className="text-[13px] tabular">{c.id}</TD>
                  <TD>
                    <p className="text-[13px]">{c.email}</p>
                    <p className="text-[11px] text-navy-400 tabular">{c.phone}</p>
                  </TD>
                  <TD align="center">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-navy-50 px-1.5 text-[12px] font-semibold text-navy-700 tabular">
                      {activeCaseCount(c.id)}
                    </span>
                  </TD>
                  <TD className="whitespace-nowrap text-[13px]">{formatDate(c.registeredOn)}</TD>
                  <TD>
                    <StatusBadge status={c.status} />
                  </TD>
                  <TD align="right">
                    <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                      <Menu
                    trigger={({ toggle }) =>
                    <button
                      onClick={toggle}
                      aria-label={`Actions for ${c.name}`}
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
                          navigate(`/clients/${c.id}`);
                        }}>
                        
                              View client
                            </MenuItem>
                            <MenuItem
                        icon={<PencilIcon className="h-4 w-4 text-navy-400" />}
                        onClick={() => {
                          close();
                          navigate(`/clients/new?id=${c.id}`);
                        }}>
                        
                              Edit client
                            </MenuItem>
                            <MenuItem
                        danger
                        icon={<Trash2Icon className="h-4 w-4" />}
                        onClick={() => {
                          close();
                          setPendingDelete(c);
                        }}>
                        
                              Delete client
                            </MenuItem>
                          </>
                    }
                      </Menu>
                    </div>
                  </TD>
                </TR>
            )}
            </TBody>
          </TableWrap>
        }
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeClient(pendingDelete.id);
            toast.success(`${pendingDelete.name} removed`, {
              description: 'The client record is no longer visible in the register.'
            });
          }
          setPendingDelete(null);
        }}
        title="Delete this client?"
        message={`${pendingDelete?.name ?? ''} and their contact record will be removed. Cases already registered will remain in the register.`} />
      
    </div>);

}