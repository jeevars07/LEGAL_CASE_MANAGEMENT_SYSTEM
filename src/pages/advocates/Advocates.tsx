import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, MoreHorizontalIcon, PencilIcon, UserPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Menu, MenuItem } from '../../components/ui/Menu';
import { FilterSelect, SearchInput, Toolbar } from '../../components/ui/Toolbar';
import { TBody, TD, TH, THead, TR, TableWrap } from '../../components/ui/Table';
import { EmptyState, TableSkeleton } from '../../components/ui/States';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';

export function Advocates() {
  const { advocates, cases } = useApp();
  const { loading } = useSimulatedLoad();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [spec, setSpec] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return advocates.filter(
      (a) =>
      (!q || `${a.name} ${a.email} ${a.id} ${a.specialization}`.toLowerCase().includes(q)) && (
      !spec || a.specialization === spec)
    );
  }, [advocates, query, spec]);

  const activeCases = (advocateId: string) =>
  cases.filter((c) => c.advocateId === advocateId && c.status === 'Active').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advocates"
        subtitle="Counsel available to the practice, their specialisations and current caseload." />
      

      <Card>
        <Toolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search advocates or specialisations" />
          <FilterSelect
            label="Specialisation"
            value={spec}
            onChange={setSpec}
            options={Array.from(new Set(advocates.map((a) => a.specialization)))} />
          
        </Toolbar>

        {loading ?
        <TableSkeleton rows={6} cols={6} /> :
        rows.length === 0 ?
        <EmptyState title="No advocates found" message="Try a different name or specialisation." /> :

        <TableWrap>
            <THead>
              <TH>Advocate</TH>
              <TH>Advocate ID</TH>
              <TH>Contact</TH>
              <TH>Specialisation</TH>
              <TH align="center">Active cases</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </THead>
            <TBody>
              {rows.map((a) =>
            <TR key={a.id} onClick={() => navigate(`/advocates/${a.id}`)}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-navy-900">{a.name}</p>
                        <p className="text-[11px] text-navy-400">
                          {a.barNumber} · {a.yearsExperience} yrs
                        </p>
                      </div>
                    </div>
                  </TD>
                  <TD className="text-[13px] tabular">{a.id}</TD>
                  <TD>
                    <p className="text-[13px]">{a.email}</p>
                    <p className="text-[11px] text-navy-400 tabular">{a.phone}</p>
                  </TD>
                  <TD className="text-[13px]">{a.specialization}</TD>
                  <TD align="center">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-navy-50 px-1.5 text-[12px] font-semibold text-navy-700 tabular">
                      {activeCases(a.id)}
                    </span>
                  </TD>
                  <TD>
                    <StatusBadge status={a.status} />
                  </TD>
                  <TD align="right">
                    <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                      <Menu
                    trigger={({ toggle }) =>
                    <button
                      onClick={toggle}
                      aria-label={`Actions for ${a.name}`}
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
                          navigate(`/advocates/${a.id}`);
                        }}>
                        
                              View profile
                            </MenuItem>
                            <MenuItem
                        icon={<PencilIcon className="h-4 w-4 text-navy-400" />}
                        onClick={() => {
                          close();
                          toast.info('Profile editing', {
                            description: 'Advocate records are maintained by practice administration.'
                          });
                        }}>
                        
                              Edit profile
                            </MenuItem>
                            <MenuItem
                        icon={<UserPlusIcon className="h-4 w-4 text-navy-400" />}
                        onClick={() => {
                          close();
                          navigate('/assignments');
                        }}>
                        
                              Assign case
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
    </div>);

}