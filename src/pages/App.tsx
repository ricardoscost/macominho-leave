import { useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';
import { DashboardPage } from './DashboardPage';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="panel w-full max-w-md p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 p-2 text-white"><ShieldCheck size={18} /></div>
          <div><h1 className="text-xl font-semibold">LeaveFlow</h1><p className="text-xs text-slate-500">Gestão interna de férias e ausências</p></div>
        </div>
        <label className="mb-1 block text-sm">Email</label>
        <input className="mb-3 w-full rounded-xl border p-2.5" placeholder="nome@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="mb-1 block text-sm">Password</label>
        <input className="mb-5 w-full rounded-xl border p-2.5" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded-xl bg-slate-900 p-2.5 text-white disabled:opacity-70">{loading ? 'A autenticar...' : 'Entrar'}</button>
      </form>
    </div>
  );
}

export function App() {
  const { session, loading } = useSession();
  const logged = useMemo(() => !!session, [session]);
  if (loading) return <div className="min-h-screen grid place-items-center">A carregar sessão...</div>;
  if (!logged) return <Login />;
  return <Routes><Route path="/" element={<DashboardPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
