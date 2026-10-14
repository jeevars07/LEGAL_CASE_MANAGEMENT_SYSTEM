import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlusIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/States';
import { AssignAdvocateModal } from '../../components/cases/CaseModals';
import { useApp } from '../../contexts/AppContext';
import { formatDate } from '../../utils/format';
import { clientName } from '../../utils/selectors';
import type { LegalCase } from '../../types';

export function Assignments() {
  const { advocates, cases, clients } = useApp();
  const [reassign, setReassign] = useState<LegalCase | null>(null);

  const unassigned = cases.filter((c) => !advocates.some((a) => a.id === c.advocateId));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        subtitle="Balance workload across counsel and reassign matters where cover is needed." />
      

      {unassigned.length > 0 &&
      <Card className="border-amber-200 bg-amber-50/60 p-4">
          <p className="text-[13px] font-medium text-amber-800">
            {unassigned.length} matter{unassigned.length === 1 ? '' : 's'} require an advocate.
          </p>
        </Card>
      }

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {advocates.map((a, i) => {
          const load = cases.filter((c) => c.advocateId === a.id);
          const open = load.filter((c) => c.status !== 'Closed');
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}>
              
              <Card className="flex h-full flex-col">
                <CardHeader
                  title={a.name}
                  description={`${a.specialization} · ${open.length} open matter${open.length === 1 ? '' : 's'}`}
                  action={<Avatar name={a.name} size="sm" />} />
                
                {open.length === 0 ?
                <EmptyState title="No open matters" message="This advocate has capacity for new work." /> :

                <ul className="flex-1 divide-y divide-navy-100">
                    {open.map((c) =>
                  <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="min-w-0 flex-1">
                          <Link
                        to={`/cases/${c.id}`}
                        className="block truncate text-[13px] font-medium text-navy-900 underline-offset-2 hover:text-brand-700 hover:underline">
                        
                            {c.title}
                          </Link>
                          <p className="text-[11px] text-navy-400">
                            {clientName(clients, c.clientId)} · filed {formatDate(c.filedOn)}
                          </p>
                        </div>
                        <StatusBadge status={c.status} />
                        <Button size="sm" variant="ghost" icon={<UserPlusIcon className="h-3.5 w-3.5" />} onClick={() => setReassign(c)}>
                          Reassign
                        </Button>
                      </li>
                  )}
                  </ul>
                }
              </Card>
            </motion.div>);

        })}
      </div>

      {reassign &&
      <AssignAdvocateModal open onClose={() => setReassign(null)} legalCase={reassign} />
      }
    </div>);

}