import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { cn } from '../../utils/format';

export function SectionCard({
  title,
  description,
  action,
  footerTo,
  footerLabel,
  index = 0,
  className,
  bodyClassName,
  children










}: {title: string;description?: string;action?: React.ReactNode;footerTo?: string;footerLabel?: string;index?: number;className?: string;bodyClassName?: string;children: React.ReactNode;}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.04 + index * 0.05, ease: [0.23, 1, 0.32, 1] }}
      className={cn('min-w-0', className)}>
      
      <Card className="flex h-full flex-col">
        <CardHeader title={title} description={description} action={action} />
        <div className={cn('flex-1', bodyClassName)}>{children}</div>
        {footerTo &&
        <Link
          to={footerTo}
          className="group flex items-center justify-center gap-1.5 border-t border-navy-100 py-2.5 text-[12px] font-medium text-navy-600 transition-colors duration-150 ease-smooth hover:bg-navy-50/70 hover:text-navy-900">
          
            {footerLabel ?? 'View all'}
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 ease-smooth group-hover:translate-x-0.5" aria-hidden />
          </Link>
        }
      </Card>
    </motion.section>);

}