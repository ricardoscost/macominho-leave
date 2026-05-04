import { useMemo, useState } from 'react';
import { addMonths, endOfMonth, format, isSameDay, startOfMonth } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { Bell, Calendar, CheckCircle2, Clock3, LayoutDashboard, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/common/Card';

const stateColor = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700'
} as const;

export function DashboardPage() {
  const [monthRef, setMonthRef] = useState(new Date());

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [emp, req] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('leave_requests').select('id,status,type,start_date,end_date,created_at,employees(name)')
      ]);
      if (req.error) throw req.error;
      return { employees: emp.count ?? 0, requests: req.data ?? [] };
    }
  });

  const metrics = useMemo(() => {
    const requests = data?.requests ?? [];
    const today = new Date();
    const absentToday = requests.filter((r) => r.status === 'approved' && new Date(r.start_date) <= today && new Date(r.end_date) >= today).length;
    return {
      pending: requests.filter((r) => r.status === 'pending').length,
      approved: requests.filter((r) => r.status === 'approved').length,
      absentToday
    };
  }, [data]);

  const monthEvents = (data?.requests ?? []).filter((r) => {
    const s = new Date(r.start_date);
    return s >= startOfMonth(monthRef) && s <= endOfMonth(monthRef);
  });

  if (isLoading) return <div className="min-h-screen grid place-items-center text-slate-600">A carregar dashboard...</div>;
  if (error) return <div className="m-8 panel p-6 text-rose-700">Erro ao carregar dados do dashboard.</div>;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="panel p-4">
          <h1 className="mb-6 text-xl font-bold">LeaveFlow</h1>
          <nav className="space-y-1 text-sm">
            {[[LayoutDashboard, 'Dashboard'], [Users, 'Funcionários'], [Calendar, 'Calendário'], [Bell, 'Alertas']].map(([Icon, label]) => (
              <button key={label} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-100">
                <Icon size={16 as never} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <button className="mt-8 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white" onClick={() => supabase.auth.signOut()}>Terminar sessão</button>
        </aside>

        <main className="space-y-4">
          <header className="panel flex items-center justify-between p-5">
            <div>
              <h2 className="text-2xl font-semibold">Gestão de Ausências</h2>
              <p className="text-sm text-slate-500">Visão geral diária da equipa</p>
            </div>
            <div className="text-sm text-slate-500">{format(new Date(), "EEEE, d 'de' MMMM", { locale: pt })}</div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card title="Funcionários" value={data?.employees ?? 0} subtitle="Total registado" />
            <Card title="Pendentes" value={metrics.pending} subtitle="A aguardar aprovação" />
            <Card title="Aprovados" value={metrics.approved} subtitle="Pedidos concluídos" />
            <Card title="Ausentes hoje" value={metrics.absentToday} subtitle="Com aprovação" />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <article className="panel p-5">
              <h3 className="mb-4 font-semibold">Pedidos recentes</h3>
              <div className="space-y-2">
                {(data?.requests.slice(0, 8) ?? []).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium">{(r as any).employees?.name ?? 'Colaborador'}</p>
                      <p className="text-xs text-slate-500">{r.type} · {r.start_date} → {r.end_date}</p>
                    </div>
                    <span className={`badge ${stateColor[r.status as keyof typeof stateColor]}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Calendário mensal</h3>
                <div className="flex items-center gap-2 text-sm">
                  <button className="rounded-lg border px-2 py-1" onClick={() => setMonthRef(addMonths(monthRef, -1))}>◀</button>
                  <span className="min-w-32 text-center">{format(monthRef, 'MMMM yyyy', { locale: pt })}</span>
                  <button className="rounded-lg border px-2 py-1" onClick={() => setMonthRef(addMonths(monthRef, 1))}>▶</button>
                </div>
              </div>
              <div className="space-y-2">
                {monthEvents.length === 0 && <p className="text-sm text-slate-500">Sem ausências neste mês.</p>}
                {monthEvents.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border p-2 text-sm">
                    <Clock3 size={14} className="text-slate-400" />
                    <span>{format(new Date(r.start_date), 'dd/MM')}</span>
                    <span className="font-medium">{(r as any).employees?.name ?? 'Colaborador'}</span>
                    {isSameDay(new Date(r.start_date), new Date()) && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
