import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  FileTextIcon,
  GavelIcon,
  ReceiptTextIcon,
  UserPlusIcon } from
'lucide-react';
import type { ActivityItem } from '../../types';
import { relativeTime } from '../../utils/format';

const icons = {
  case: BriefcaseIcon,
  client: UserPlusIcon,
  document: FileTextIcon,
  hearing: CalendarDaysIcon,
  advocate: GavelIcon,
  billing: ReceiptTextIcon
};

export function ActivityFeed({ items }: {items: ActivityItem[];}) {
  return (
    <ol className="relative px-5 py-4">
      <span className="absolute left-[30px] top-6 bottom-6 w-px bg-navy-100" aria-hidden />
      {items.map((item, i) => {
        const Icon = icons[item.type];
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.26, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex gap-3 pb-4 last:pb-0">
            
            <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-500">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug text-navy-800">
                {item.caseId ?
                <Link
                  to={`/cases/${item.caseId}`}
                  className="underline-offset-2 transition-colors duration-150 hover:text-brand-700 hover:underline">
                  
                    {item.message}
                  </Link> :

                item.message
                }
              </p>
              <p className="mt-0.5 text-[11px] text-navy-400">
                {item.actor} · {relativeTime(item.at)}
              </p>
            </div>
          </motion.li>);

      })}
    </ol>);

}