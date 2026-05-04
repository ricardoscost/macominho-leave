import { ReactNode } from 'react';
export function Card({ title, value }: { title: string; value: ReactNode }) {
  return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}
