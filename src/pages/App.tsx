import { useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';
import { DashboardPage } from './DashboardPage';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = async (e: React.FormEvent) => { e.preventDefault(); await supabase.auth.signInWithPassword({ email, password }); };
  return <div className="min-h-screen grid place-items-center"><form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow"><h1 className="text-xl font-semibold mb-4">LeaveFlow</h1><input className="w-full border rounded p-2 mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="w-full border rounded p-2 mb-4" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="w-full rounded bg-slate-900 text-white p-2">Entrar</button></form></div>;
}

export function App() {
  const { session, loading } = useSession();
  const logged = useMemo(() => !!session, [session]);
  if (loading) return <div className="min-h-screen grid place-items-center">A carregar...</div>;
  if (!logged) return <Login />;
  return <Routes><Route path="/" element={<DashboardPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
