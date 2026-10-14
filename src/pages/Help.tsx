import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  BriefcaseIcon,
  KeyboardIcon,
  LifeBuoyIcon,
  MailIcon,
  UsersIcon } from
'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';

const guides = [
{
  icon: BriefcaseIcon,
  title: 'Registering a case',
  body: 'Capture the court number, client and lead counsel, then set the status so the matter appears on the right dashboards.',
  to: '/cases/new',
  linkLabel: 'Open case registration'
},
{
  icon: UsersIcon,
  title: 'Onboarding a client',
  body: 'Record identity and address details first — they are required before an invoice can be raised against a matter.',
  to: '/clients/new',
  linkLabel: 'Add a client'
},
{
  icon: BookOpenIcon,
  title: 'Keeping proceedings current',
  body: 'Each hearing outcome should be recorded on the case timeline the same day so clients see accurate progress.',
  to: '/cases',
  linkLabel: 'Browse cases'
}];


const shortcuts = [
{ keys: '⌘K', action: 'Open global search' },
{ keys: '↑ ↓', action: 'Move through search results' },
{ keys: '↵', action: 'Open the highlighted result' },
{ keys: 'Esc', action: 'Close a dialog or search' }];


export function Help() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        subtitle="Guidance on running the case lifecycle, plus how to reach the practice systems team." />
      

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {guides.map((guide, i) =>
        <motion.div
          key={guide.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}>
          
            <Card className="flex h-full flex-col p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                <guide.icon className="h-4 w-4" aria-hidden />
              </span>
              <h2 className="mt-3.5 text-[15px] font-semibold tracking-[-0.01em] text-navy-900">{guide.title}</h2>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-navy-500">{guide.body}</p>
              <Link
              to={guide.to}
              className="mt-4 text-[12px] font-medium text-brand-600 transition-colors duration-150 ease-smooth hover:text-brand-700">
              
                {guide.linkLabel} →
              </Link>
            </Card>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Keyboard shortcuts" description="Move through the system without leaving the keyboard." />
          <ul className="divide-y divide-navy-100">
            {shortcuts.map((s) =>
            <li key={s.keys} className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-[13px] text-navy-700">{s.action}</span>
                <kbd className="rounded border border-navy-200 bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-500">
                  {s.keys}
                </kbd>
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Contact support" description="Weekdays, 08:00 – 19:00 PST." />
          <div className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                <LifeBuoyIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-[13px] font-medium text-navy-900">Practice systems desk</p>
                <p className="text-[12px] text-navy-400">Extension 4120 · urgent listing issues</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                <MailIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-[13px] font-medium text-navy-900">support@harborlaw.example</p>
                <p className="text-[12px] text-navy-400">Replies within one working day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                <KeyboardIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-[13px] font-medium text-navy-900">Training sessions</p>
                <p className="text-[12px] text-navy-400">
                  Fortnightly onboarding for new advocates and clerks
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}