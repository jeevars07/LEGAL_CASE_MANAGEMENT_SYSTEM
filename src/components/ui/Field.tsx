import React from 'react';
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';
import { cn } from '../../utils/format';

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  error,
  success,
  hint,
  className,
  children
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-navy-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ?
      <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p> :
      success ?
      <p className="flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {success}
        </p> :
      hint ?
      <p className="text-xs text-navy-400">{hint}</p> :
      null}
    </div>);

}

const base =
'w-full rounded-lg border bg-white text-sm text-navy-900 placeholder:text-navy-300 shadow-[0_1px_1px_rgb(15_27_51_/_0.03)] transition-[border-color,box-shadow] duration-150 ease-smooth focus:outline-none focus-visible:outline-none disabled:bg-navy-50 disabled:text-navy-400';

function state(error?: boolean, success?: boolean): string {
  if (error) return 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
  if (success)
  return 'border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10';
  return 'border-navy-200 hover:border-navy-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/12';
}

export function Input({
  invalid,
  valid,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {invalid?: boolean;valid?: boolean;}) {
  return <input {...rest} className={cn(base, 'h-10 px-3', state(invalid, valid), className)} />;
}

export function Textarea({
  invalid,
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {invalid?: boolean;}) {
  return (
    <textarea {...rest} className={cn(base, 'min-h-[104px] px-3 py-2.5', state(invalid), className)} />);

}

const chevron =
"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23687fae' stroke-width='2' stroke-linecap='round'><path d='M6 9l6 6 6-6'/></svg>\")";

export function Select({
  invalid,
  className,
  children,
  style,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {invalid?: boolean;}) {
  return (
    <select
      {...rest}
      style={{
        appearance: 'none',
        backgroundImage: chevron,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '16px',
        ...style
      }}
      className={cn(base, 'h-10 cursor-pointer pl-3 pr-9', state(invalid), className)}>
      
      {children}
    </select>);

}