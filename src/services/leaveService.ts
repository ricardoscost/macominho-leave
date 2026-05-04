import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { supabase } from '@/lib/supabase';

export const calcDays = (start: string, end: string) => differenceInCalendarDays(new Date(end), new Date(start)) + 1;

export async function createRequest(payload: any) {
  const days = calcDays(payload.start_date, payload.end_date);
  if (days <= 0) throw new Error('Data final inválida.');

  const { data: overlap } = await supabase
    .from('leave_requests')
    .select('id,start_date,end_date')
    .eq('employee_id', payload.employee_id)
    .neq('status', 'rejected');
  const hasOverlap = (overlap ?? []).some((r) =>
    eachDayOfInterval({ start: new Date(r.start_date), end: new Date(r.end_date) }).some((d) =>
      d >= new Date(payload.start_date) && d <= new Date(payload.end_date)
    )
  );
  if (hasOverlap) throw new Error('Já existe pedido sobreposto.');

  const { error } = await supabase.from('leave_requests').insert({ ...payload, days });
  if (error) throw error;
}
