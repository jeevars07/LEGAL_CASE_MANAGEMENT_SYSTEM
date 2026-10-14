import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, CheckCheckIcon, FileTextIcon, ReceiptTextIcon, ScaleIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/States';
import { useApp } from '../contexts/AppContext';
import { cn, relativeTime } from '../utils/format';

const icons = {
  hearing: CalendarDaysIcon,
  document: FileTextIcon,
  billing: ReceiptTextIcon,
  case: ScaleIcon
};

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const unread = notifications.filter((n) => !n.read);
  const rows = tab === 'unread' ? unread : notifications;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Alerts on listings, filings and payments across the matters you have access to."
        actions={
        <Button variant="secondary" icon={<CheckCheckIcon className="h-4 w-4" />} onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        } />
      

      <div className="px-1">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unread.length }]
          } />
        
      </div>

      <Card>
        {rows.length === 0 ?
        <EmptyState title="You’re all caught up" message="New alerts will appear here as your matters progress." /> :

        <ul className="divide-y divide-navy-100">
            {rows.map((n, i) => {
            const Icon = icons[n.kind];
            return (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: i * 0.03, ease: [0.23, 1, 0.32, 1] }}>
                
                  <button
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.href) navigate(n.href);
                  }}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors duration-150 ease-smooth hover:bg-navy-50/70">
                  
                    <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      n.read ? 'bg-navy-50 text-navy-400' : 'bg-brand-50 text-brand-600'
                    )}>
                    
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-navy-900">{n.title}</span>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-navy-600">{n.body}</span>
                      <span className="mt-1 block text-[11px] text-navy-400">{relativeTime(n.at)}</span>
                    </span>
                  </button>
                </motion.li>);

          })}
          </ul>
        }
      </Card>
    </div>);

}