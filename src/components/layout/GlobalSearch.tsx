import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BriefcaseIcon, FileTextIcon, GavelIcon, SearchIcon, UsersIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { visibleCases } from '../../utils/selectors';
import { cn } from '../../utils/format';

interface Hit {
  id: string;
  label: string;
  sub: string;
  to: string;
  group: 'Cases' | 'Clients' | 'Advocates' | 'Documents';
}

const groupIcon = {
  Cases: BriefcaseIcon,
  Clients: UsersIcon,
  Advocates: GavelIcon,
  Documents: FileTextIcon
};

export function GlobalSearch({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const { cases, clients, advocates, documents, currentUser } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const scopedCases = visibleCases(cases, currentUser);
  const canSeeDirectory = currentUser?.role === 'admin' || currentUser?.role === 'clerk';

  const hits = useMemo<Hit[]>(() => {
    const q = query.trim().toLowerCase();
    const all: Hit[] = [
    ...scopedCases.map((c) => ({
      id: c.id,
      label: c.title,
      sub: `${c.id} · ${c.caseNumber} · ${c.status}`,
      to: `/cases/${c.id}`,
      group: 'Cases' as const
    })),
    ...(canSeeDirectory ?
    clients.map((c) => ({
      id: c.id,
      label: c.name,
      sub: `${c.id} · ${c.email}`,
      to: `/clients/${c.id}`,
      group: 'Clients' as const
    })) :
    []),
    ...(currentUser?.role === 'admin' ?
    advocates.map((a) => ({
      id: a.id,
      label: a.name,
      sub: `${a.id} · ${a.specialization}`,
      to: `/advocates/${a.id}`,
      group: 'Advocates' as const
    })) :
    []),
    ...documents.
    filter((d) => scopedCases.some((c) => c.id === d.caseId)).
    map((d) => ({
      id: d.id,
      label: d.name,
      sub: `${d.type} · ${d.caseId}`,
      to: `/cases/${d.caseId}`,
      group: 'Documents' as const
    }))];

    if (!q) return all.slice(0, 6);
    return all.
    filter((h) => `${h.label} ${h.sub}`.toLowerCase().includes(q)).
    slice(0, 12);
  }, [query, scopedCases, clients, advocates, documents, canSeeDirectory, currentUser]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, hits.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === 'Enter' && hits[cursor]) {
        navigate(hits[cursor].to);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hits, cursor, navigate, onClose]);

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>();
    hits.forEach((h) => {
      map.set(h.group, [...(map.get(h.group) ?? []), h]);
    });
    return Array.from(map.entries());
  }, [hits]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
          className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-label="Global search"
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-navy-200 bg-white shadow-pop">
          
            <div className="flex items-center gap-3 border-b border-navy-100 px-4">
              <SearchIcon className="h-4 w-4 text-navy-300" aria-hidden />
              <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cases, clients, advocates, documents…"
              aria-label="Search"
              className="h-14 flex-1 bg-transparent text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none" />
            
              <kbd className="hidden rounded border border-navy-200 bg-navy-50 px-1.5 py-0.5 text-[10px] font-medium text-navy-400 sm:block">
                ESC
              </kbd>
            </div>
            <div className="scroll-slim max-h-[52vh] overflow-y-auto p-2">
              {hits.length === 0 ?
            <p className="px-3 py-8 text-center text-[13px] text-navy-400">
                  No results for “{query}”. Try a case number, client name or document type.
                </p> :

            grouped.map(([group, items]) => {
              const Icon = groupIcon[group as keyof typeof groupIcon];
              return (
                <div key={group} className="mb-1">
                      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-400">
                        {group}
                      </p>
                      {items.map((hit) => {
                    const index = hits.indexOf(hit);
                    return (
                      <button
                        key={hit.id + hit.group}
                        onMouseEnter={() => setCursor(index)}
                        onClick={() => {
                          navigate(hit.to);
                          onClose();
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150 ease-smooth',
                          index === cursor ? 'bg-navy-50' : 'hover:bg-navy-50/70'
                        )}>
                        
                            <Icon className="h-4 w-4 shrink-0 text-navy-400" aria-hidden />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium text-navy-900">
                                {hit.label}
                              </span>
                              <span className="block truncate text-[11px] text-navy-400">{hit.sub}</span>
                            </span>
                          </button>);

                  })}
                    </div>);

            })
            }
            </div>
            <div className="flex items-center gap-4 border-t border-navy-100 bg-navy-50/60 px-4 py-2 text-[11px] text-navy-400">
              <span>↑ ↓ to navigate</span>
              <span>↵ to open</span>
              <span className="ml-auto">⌘K to toggle</span>
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}