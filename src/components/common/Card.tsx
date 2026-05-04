import { ReactNode } from 'react';

export function Card({ title, value, subtitle }: { title: string; value: ReactNode; subtitle?: string }) {
  return (
    <div className="panel p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      {subtitle ? <p className="mt-2 text-xs text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
