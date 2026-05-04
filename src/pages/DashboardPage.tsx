import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/common/Card';

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [emp, req] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('leave_requests').select('status,start_date,end_date,employees(name)')
      ]);
      return { employees: emp.count ?? 0, requests: req.data ?? [] };
    }
  });

  if (isLoading) return <div className="p-6">A carregar dashboard...</div>;
  const pending = data?.requests.filter((r) => r.status === 'pending').length ?? 0;
  const approved = data?.requests.filter((r) => r.status === 'approved').length ?? 0;
  return <div className="p-6 space-y-6"><header className="flex items-center justify-between"><h1 className="text-2xl font-bold">Gestão de Ausências</h1><button className="rounded bg-slate-900 px-4 py-2 text-white" onClick={() => supabase.auth.signOut()}>Logout</button></header><section className="grid gap-4 md:grid-cols-4"><Card title="Funcionários" value={data?.employees ?? 0} /><Card title="Pendentes" value={pending} /><Card title="Aprovados" value={approved} /><Card title="Ausentes hoje" value="--" /></section><section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-semibold mb-3">Pedidos recentes</h2><div className="space-y-2">{(data?.requests.slice(0, 6) ?? []).map((r, i) => <div key={i} className="flex justify-between rounded border p-3"><span>{(r as any).employees?.name ?? 'Colaborador'}</span><span className="capitalize">{r.status}</span></div>)}</div></section></div>;
}
