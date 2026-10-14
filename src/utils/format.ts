import { format, formatDistanceToNowStrict, isAfter, parseISO } from 'date-fns';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'dd MMM yyyy');
  } catch {
    return iso;
  }
}

export function formatLongDate(iso: string): string {
  try {
    return format(parseISO(iso), 'EEEE, dd MMMM yyyy');
  } catch {
    return iso;
  }
}

export function relativeTime(iso: string): string {
  try {
    return `${formatDistanceToNowStrict(parseISO(iso))} ago`;
  } catch {
    return iso;
  }
}

export function currency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

export function initials(name: string): string {
  return name.
  replace(/^(Adv\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((p) => p[0]?.toUpperCase()).
  join('');
}

export function isFuture(iso: string): boolean {
  try {
    return isAfter(parseISO(iso), new Date('2026-08-13T00:00:00'));
  } catch {
    return false;
  }
}

/** Deterministic today for the demo dataset */
export const TODAY = '2026-08-13';