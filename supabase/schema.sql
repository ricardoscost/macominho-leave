create extension if not exists "pgcrypto";

create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  holidays_per_year int not null default 22,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','employee')),
  created_at timestamptz not null default now()
);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  job_title text not null,
  email text not null unique,
  annual_allowance int not null default 22,
  created_at timestamptz not null default now()
);

create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  type text not null check (type in ('vacation','day_off','absence')),
  start_date date not null,
  end_date date not null,
  days int not null check (days > 0),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  notes text,
  created_at timestamptz not null default now(),
  approved_by uuid references employees(id) on delete set null,
  approved_at timestamptz,
  constraint date_order check (end_date >= start_date)
);

alter table app_settings enable row level security;
alter table profiles enable row level security;
alter table employees enable row level security;
alter table leave_requests enable row level security;

create or replace function is_admin() returns boolean language sql stable as $$
  select exists (select 1 from profiles p where p.auth_user_id = auth.uid() and p.role = 'admin');
$$;

create policy "admin all employees" on employees for all using (is_admin()) with check (is_admin());
create policy "employee own employee row" on employees for select using (auth_user_id = auth.uid() or is_admin());
create policy "admin all requests" on leave_requests for all using (is_admin()) with check (is_admin());
create policy "employee select own requests" on leave_requests for select using (
  exists(select 1 from employees e where e.id = leave_requests.employee_id and e.auth_user_id = auth.uid()) or is_admin()
);
create policy "employee insert own requests" on leave_requests for insert with check (
  exists(select 1 from employees e where e.id = leave_requests.employee_id and e.auth_user_id = auth.uid())
);
create policy "admin settings" on app_settings for all using (is_admin()) with check (is_admin());
create policy "all read roles self" on profiles for select using (auth_user_id = auth.uid() or is_admin());

insert into app_settings (company, holidays_per_year) values ('Acme, Lda', 22);
insert into employees (name, job_title, email, annual_allowance)
values
('Ana Martins','HR Manager','ana@acme.pt',25),
('João Silva','Frontend Developer','joao@acme.pt',22),
('Marta Costa','Finance Analyst','marta@acme.pt',22);
