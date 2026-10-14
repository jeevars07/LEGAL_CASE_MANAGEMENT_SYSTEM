import React, { useState } from 'react';
import { MoreHorizontalIcon, ShieldIcon, UserPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Menu, MenuItem } from '../../components/ui/Menu';
import { SearchInput, Toolbar } from '../../components/ui/Toolbar';
import { TBody, TD, TH, THead, TR, TableWrap } from '../../components/ui/Table';
import { EmptyState, TableSkeleton } from '../../components/ui/States';
import { useApp } from '../../contexts/AppContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { relativeTime } from '../../utils/format';
import { roleLabel } from '../../utils/selectors';

export function Users() {
  const { users } = useApp();
  const { loading } = useSimulatedLoad();
  const [query, setQuery] = useState('');

  const rows = users.filter((u) =>
  !query.trim() || `${u.name} ${u.email} ${u.role} ${u.title}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Accounts with access to the case management system and the permissions attached to each role."
        actions={
        <Button
          variant="primary"
          icon={<UserPlusIcon className="h-4 w-4" />}
          onClick={() => toast.info('Invite user', { description: 'User invitations are issued by practice administration.' })}>
          
            Invite User
          </Button>
        } />
      

      <Card>
        <Toolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search users by name, email or role" />
          <span className="text-[12px] text-navy-400 tabular">{rows.length} accounts</span>
        </Toolbar>

        {loading ?
        <TableSkeleton rows={6} cols={5} /> :
        rows.length === 0 ?
        <EmptyState title="No users found" message="Try a different name, email address or role." /> :

        <TableWrap>
            <THead>
              <TH>User</TH>
              <TH>Role</TH>
              <TH>Title</TH>
              <TH>Last active</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </THead>
            <TBody>
              {rows.map((u) =>
            <TR key={u.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-navy-900">{u.name}</p>
                        <p className="truncate text-[11px] text-navy-400">{u.email}</p>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <Badge tone={u.role === 'admin' ? 'blue' : 'gray'}>{roleLabel(u.role)}</Badge>
                  </TD>
                  <TD className="text-[13px]">{u.title}</TD>
                  <TD className="whitespace-nowrap text-[13px]">{relativeTime(u.lastActive)}</TD>
                  <TD>
                    <StatusBadge status={u.status} />
                  </TD>
                  <TD align="right">
                    <div className="flex justify-end">
                      <Menu
                    trigger={({ toggle }) =>
                    <button
                      onClick={toggle}
                      aria-label={`Actions for ${u.name}`}
                      className="rounded-lg border border-transparent p-1.5 text-navy-400 transition-colors duration-150 ease-smooth hover:border-navy-200 hover:bg-white hover:text-navy-800">
                      
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </button>
                    }>
                    
                        {(close) =>
                    <>
                            <MenuItem
                        icon={<ShieldIcon className="h-4 w-4 text-navy-400" />}
                        onClick={() => {
                          close();
                          toast.success('Permissions reviewed', { description: `${u.name} — ${roleLabel(u.role)}` });
                        }}>
                        
                              Review permissions
                            </MenuItem>
                            <MenuItem
                        danger
                        onClick={() => {
                          close();
                          toast.success(u.status === 'Active' ? 'Access suspended' : 'Access restored', {
                            description: u.name
                          });
                        }}>
                        
                              {u.status === 'Active' ? 'Suspend access' : 'Restore access'}
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