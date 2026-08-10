-- Kingsford Academy ERP — Postgres schema (Supabase-ready)
-- Mirrors the AppStore domain so we can migrate off localStorage.
-- Apply via: supabase db push / SQL editor / psql

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.role_type as enum (
  'admin', 'headmaster', 'accountant', 'teacher',
  'librarian', 'hr', 'student', 'parent'
);

create type public.account_status as enum ('Active', 'Suspended', 'Inactive');
create type public.student_status as enum ('Active', 'Suspended', 'Archived');
create type public.invoice_status as enum ('Paid', 'Partial', 'Overdue', 'Unpaid');
create type public.payment_method as enum ('MoMo', 'Bank', 'Cash');
create type public.attendance_mark as enum ('present', 'absent', 'late', 'excused');
create type public.assignment_status as enum ('Open', 'Closed', 'Grading');
create type public.submission_status as enum ('Pending', 'Submitted', 'Graded', 'Late');
create type public.grade_status as enum ('Draft', 'Submitted', 'Approved');
create type public.loan_status as enum ('On loan', 'Overdue', 'Returned');
create type public.staff_status as enum ('Active', 'On leave');
create type public.leave_status as enum ('Approved', 'Pending', 'Declined');
create type public.notice_tag as enum ('Event', 'Academic', 'Finance', 'General');

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users when Supabase Auth is wired)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  legacy_id text unique,
  full_name text not null,
  email text not null unique,
  phone text,
  role public.role_type not null,
  status public.account_status not null default 'Active',
  department text,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  profile_id uuid references public.profiles (id) on delete set null,
  parent_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text,
  class_name text not null,
  gender text check (gender in ('M', 'F')),
  guardian_name text,
  status public.student_status not null default 'Active',
  attendance_pct numeric(5,2) default 100,
  gpa numeric(3,2) default 0,
  fees_owed numeric(12,2) default 0,
  created_at timestamptz not null default now()
);

create table public.parent_students (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  primary key (parent_id, student_id)
);

-- ---------------------------------------------------------------------------
-- Academics
-- ---------------------------------------------------------------------------
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  teacher_name text,
  room text,
  student_count int not null default 0
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  teacher_name text,
  color text
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title text not null,
  subject text not null,
  class_name text not null,
  due_date date not null,
  status public.assignment_status not null default 'Open',
  total_students int not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  status public.submission_status not null default 'Pending',
  submitted_at date,
  score text,
  note text,
  unique (assignment_id, student_id)
);

create table public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  subject text not null,
  class_name text not null,
  test1 numeric(5,2) not null default 0,
  test2 numeric(5,2) not null default 0,
  exam numeric(5,2) not null default 0,
  total numeric(5,2) not null default 0,
  letter_grade text,
  remark text,
  status public.grade_status not null default 'Draft',
  unique (student_id, subject)
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  attendance_date date not null,
  class_name text not null,
  student_id uuid not null references public.students (id) on delete cascade,
  mark public.attendance_mark not null,
  submitted_by uuid references public.profiles (id),
  unique (attendance_date, class_name, student_id)
);

create table public.lesson_plans (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  subject text not null,
  class_name text not null,
  week text,
  status text not null default 'Draft',
  resources int not null default 0,
  created_by uuid references public.profiles (id)
);

-- ---------------------------------------------------------------------------
-- Finance
-- ---------------------------------------------------------------------------
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  student_id uuid references public.students (id) on delete set null,
  student_name text not null,
  class_name text,
  item text not null,
  amount numeric(12,2) not null,
  paid numeric(12,2) not null default 0,
  due_date date,
  status public.invoice_status not null default 'Unpaid',
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  invoice_id uuid references public.invoices (id) on delete set null,
  student_name text not null,
  amount numeric(12,2) not null,
  method public.payment_method not null,
  paid_on date not null default current_date,
  ref text,
  recorded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Library / HR / Ops
-- ---------------------------------------------------------------------------
create table public.books (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title text not null,
  author text,
  category text,
  copies int not null default 1,
  available int not null default 1
);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  book_id uuid references public.books (id) on delete set null,
  book_title text not null,
  student_name text not null,
  student_id uuid references public.students (id) on delete set null,
  issued_on date not null default current_date,
  due_on date not null,
  status public.loan_status not null default 'On loan',
  fine numeric(10,2) not null default 0
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  profile_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  role_title text,
  department text,
  email text,
  phone text,
  status public.staff_status not null default 'Active',
  salary numeric(12,2) not null default 0
);

create table public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references public.staff (id) on delete set null,
  staff_name text not null,
  leave_type text not null,
  from_date text not null,
  to_date text not null,
  days int not null,
  status public.leave_status not null default 'Pending'
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  qty int not null default 1,
  location text,
  condition text,
  value numeric(14,2) default 0
);

create table public.bus_routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  driver text,
  vehicle text,
  students int not null default 0,
  fee numeric(10,2) default 0,
  status text not null default 'Active'
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  full_name text not null,
  applied_for text not null,
  applied_on date not null default current_date,
  exam_score numeric(5,2) default 0,
  status text not null default 'Submitted',
  guardian text,
  phone text,
  email text
);

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null,
  tag public.notice_tag not null default 'General',
  published_on date not null default current_date,
  created_by uuid references public.profiles (id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  event_type text
);

create table public.discipline_cases (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  class_name text,
  incident text not null,
  case_date date not null default current_date,
  severity text,
  status text
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  with_name text not null,
  with_role text,
  preview text,
  unread boolean not null default true,
  avatar_color text,
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid references public.profiles (id),
  sender_name text not null,
  body text not null,
  from_me boolean not null default false,
  sent_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS scaffolding (tighten per role once Auth is connected)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parent_students enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.grades enable row level security;
alter table public.attendance_records enable row level security;
alter table public.lesson_plans enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.books enable row level security;
alter table public.loans enable row level security;
alter table public.staff enable row level security;
alter table public.leave_requests enable row level security;
alter table public.assets enable row level security;
alter table public.bus_routes enable row level security;
alter table public.applications enable row level security;
alter table public.notices enable row level security;
alter table public.events enable row level security;
alter table public.discipline_cases enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Helper: current user's role from profiles
create or replace function public.current_role()
returns public.role_type
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

-- Starter policies (authenticated read; write for staff roles — refine later)
create policy "authenticated_read_profiles" on public.profiles
  for select to authenticated using (true);

create policy "users_update_own_profile" on public.profiles
  for update to authenticated
  using (auth_user_id = auth.uid());

create policy "authenticated_read_students" on public.students
  for select to authenticated using (true);

create policy "staff_write_students" on public.students
  for all to authenticated
  using (public.current_role() in ('admin', 'headmaster', 'accountant', 'hr', 'teacher'))
  with check (public.current_role() in ('admin', 'headmaster', 'accountant', 'hr', 'teacher'));

create policy "authenticated_read_finance" on public.invoices
  for select to authenticated using (true);

create policy "finance_write" on public.invoices
  for all to authenticated
  using (public.current_role() in ('admin', 'accountant'))
  with check (public.current_role() in ('admin', 'accountant'));

create policy "authenticated_read_payments" on public.payments
  for select to authenticated using (true);

create policy "finance_write_payments" on public.payments
  for all to authenticated
  using (public.current_role() in ('admin', 'accountant', 'parent'))
  with check (public.current_role() in ('admin', 'accountant', 'parent'));

create policy "authenticated_read_notices" on public.notices
  for select to authenticated using (true);

create policy "staff_write_notices" on public.notices
  for all to authenticated
  using (public.current_role() in ('admin', 'headmaster'))
  with check (public.current_role() in ('admin', 'headmaster'));

-- Indexes
create index idx_students_parent on public.students (parent_id);
create index idx_students_class on public.students (class_name);
create index idx_invoices_student on public.invoices (student_id);
create index idx_attendance_date_class on public.attendance_records (attendance_date, class_name);
create index idx_submissions_assignment on public.assignment_submissions (assignment_id);
create index idx_grades_student on public.grades (student_id);
create index idx_loans_status on public.loans (status);
create index idx_messages_conversation on public.messages (conversation_id);
