export type AppRole = 'admin' | 'employee';
export type RequestType = 'vacation' | 'day_off' | 'absence';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface Employee { id: string; name: string; job_title: string; email: string; annual_allowance: number; created_at: string; auth_user_id?: string | null; }
export interface LeaveRequest { id: string; employee_id: string; type: RequestType; start_date: string; end_date: string; days: number; notes?: string | null; status: RequestStatus; created_at: string; approved_by?: string | null; approved_at?: string | null; }
export interface CompanySettings { id: string; company: string; holidays_per_year: number; created_at: string; }
