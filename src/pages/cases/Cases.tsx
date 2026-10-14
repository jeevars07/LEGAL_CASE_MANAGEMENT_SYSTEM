import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FilterSelect, SearchInput, Toolbar } from '../../components/ui/Toolbar';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/States';
import { CaseRows } from '../../components/cases/CaseRows';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { caseTypes, courts } from '../../data/cases';
import { visibleCases } from '../../utils/selectors';

export function Cases() {
  const { cases, clients, advocates, currentUser } = useApp();
  const { loading, error, retry } = useSimulatedLoad();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const statusParam = params.get('status') ?? '';

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [advocate, setAdvocate] = useState('');
  const [court, setCourt] = useState('');

  const scoped = visibleCases(cases, currentUser);
  const effectiveStatus = statusParam || status;
  const isClient = currentUser?.role === 'client';
  const canRegister = currentUser?.role === 'admin' || currentUser?.role === 'clerk';

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter((c) => {
      const client = clients.find((cl) => cl.id === c.clientId)?.name ?? '';
      const matchesQuery =
      !q || `${c.id} ${c.caseNumber} ${c.title} ${client} ${c.type}`.toLowerCase().includes(q);
      return (
        matchesQuery && (
        !effectiveStatus || c.status === effectiveStatus) && (
        !type || c.type === type) && (
        !advocate || advocateMatch(c.advocateId, advocate)) && (
        !court || c.court === court));

    });
    function advocateMatch(id: string, name: string) {
      return advocates.find((a) => a.id === id)?.name === name;
    }
  }, [scoped, query, effectiveStatus, type, advocate, court, clients, advocates]);

  const title = statusParam ? `${statusParam} Cases` : isClient ? 'My Cases' : 'Cases';

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={
        isClient ?
        'Every matter we are handling on your behalf, with its current stage and next listing.' :
        'Manage all legal matters from registration to resolution.'
        }
        actions={
        canRegister ?
        <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />} onClick={() => navigate('/cases/new')}>
              Register Case
            </Button> :
        undefined
        } />
      

      <Card>
        <Toolbar>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by case number, title or client"
            className="sm:max-w-sm" />
          
          <div className="flex flex-wrap items-center gap-2">
            {!statusParam &&
            <FilterSelect label="Status" value={status} onChange={setStatus} options={['Active', 'Pending', 'Closed']} />
            }
            <FilterSelect label="Type" value={type} onChange={setType} options={caseTypes} />
            {!isClient &&
            <FilterSelect
              label="Advocate"
              value={advocate}
              onChange={setAdvocate}
              options={advocates.map((a) => a.name)} />

            }
            <FilterSelect label="Court" value={court} onChange={setCourt} options={courts} />
            <span className="text-[12px] text-navy-400 tabular">
              {rows.length} of {scoped.length}
            </span>
          </div>
        </Toolbar>

        {error ?
        <ErrorState title="Unable to load cases" onRetry={retry} /> :
        loading ?
        <TableSkeleton rows={8} cols={7} /> :
        rows.length === 0 ?
        <EmptyState
          title="No cases found"
          message="Try adjusting your search or filters, or register a new case to begin tracking it."
          action={
          canRegister ?
          <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />} onClick={() => navigate('/cases/new')}>
                  Register Case
                </Button> :
          undefined
          } /> :


        <CaseRows items={rows} />
        }
      </Card>
    </div>);

}