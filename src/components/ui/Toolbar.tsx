import React from 'react';
import { SearchIcon } from 'lucide-react';
import { cn } from '../../utils/format';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className





}: {value: string;onChange: (v: string) => void;placeholder?: string;className?: string;}) {
  return (
    <div className={cn('relative flex-1 sm:max-w-xs', className)}>
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300"
        aria-hidden />
      
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-lg border border-navy-200 bg-white pl-9 pr-3 text-sm text-navy-900 placeholder:text-navy-300 transition-[border-color,box-shadow] duration-150 ease-smooth hover:border-navy-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12" />
      
    </div>);

}

export function FilterSelect({
  label,
  value,
  onChange,
  options





}: {label: string;value: string;onChange: (v: string) => void;options: string[];}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-lg border border-navy-200 bg-white pl-3 pr-8 text-[13px] font-medium text-navy-700 transition-[border-color,background-color] duration-150 ease-smooth hover:border-navy-300 hover:bg-navy-50 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12">
        
        <option value="">{label}: All</option>
        {options.map((o) =>
        <option key={o} value={o}>
            {label}: {o}
          </option>
        )}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-navy-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>);

}

export function Toolbar({ children, className }: {children: React.ReactNode;className?: string;}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-navy-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}>
      
      {children}
    </div>);

}