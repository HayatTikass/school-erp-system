# Kingsford Academy — School ERP System

A school management system covering four portals — **Administration**, **Teachers**, **Students** and **Parents/Guardians** — based on the School-MS Figma functionality breakdown, styled with the Untitled UI design system.

> Demo state lives in **`AppStore`** (`src/store/AppStore.tsx`) with seed data from `src/data/mock.ts` / `users.ts`, persisted in `localStorage`. Postgres schema for the real DB is in [`db/schema.sql`](db/schema.sql) (Supabase-ready).

## Tech stack

- **React 19 + TypeScript** (Vite)
- **Tailwind CSS v4** — Untitled UI color tokens & shadows defined in `src/index.css`
- **Nunito Sans** (variable font, self-hosted via Fontsource)
- **Hugeicons** (`hugeicons-react`)
- **React Router v7** — one nested route tree per portal
- **Recharts** — dashboards and analytics

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Sign in with **role + email + password**. All demo accounts use password `password`.

| Role | Email |
| --- | --- |
| Admin | `admin@kingsford.edu.gh` |
| Headmaster | `headmaster@kingsford.edu.gh` |
| Accountant | `accountant@kingsford.edu.gh` |
| Teacher | `teacher@kingsford.edu.gh` |
| Librarian | `librarian@kingsford.edu.gh` |
| HR Officer | `hr@kingsford.edu.gh` |
| Student | `student@kingsford.edu.gh` |
| Parent | `parent@kingsford.edu.gh` |

**Admin** creates all accounts under Users & Roles. Students must be linked to a parent. Parent `parent@kingsford.edu.gh` is linked to Abena Osei and Kwaku Osei.

## Portals & pages

| Portal | Routes |
| --- | --- |
| **Admin** (`/admin`) | Full system — users, admissions, academics, finance, HR, library, inventory, transport, communication, reports, settings |
| **Headmaster** (`/headmaster`) | Leadership — admissions, academics, attendance, communication, reports |
| **Accountant** (`/accountant`) | Finance & fees, financial reports |
| **Teacher** (`/teacher`) | Attendance, gradebook, lessons, assignments, classes, report cards, messages |
| **Librarian** (`/librarian`) | Library management |
| **HR** (`/hr`) | Staff, leave, payroll |
| **Student** (`/student`) | Results, assignments, timetable, attendance, fees, library, notices, profile |
| **Parent** (`/parent`) | Linked children — progress, attendance, assignments, fees, messages, profile |

## Project structure

```
src/
├── auth/AuthContext.tsx  # Role login + session
├── store/
│   ├── AppStore.tsx      # Shared domain state + mutations (demo “backend”)
│   └── domain.ts         # Attendance, grades, assignments, messages seeds
├── hooks/usePortalIdentity.ts
├── components/           # UI kit, AppShell, MessagesView, Modal, Toast
├── data/mock.ts          # Seed data
├── data/users.ts         # Demo accounts (password: password)
├── pages/                # admin · headmaster · accountant · teacher · …
└── index.css
db/
└── schema.sql            # Postgres / Supabase schema (next step)
```

## Database (next)

1. Create a Supabase project (or local `supabase start`).
2. Apply [`db/schema.sql`](db/schema.sql).
3. Wire Supabase Auth + replace `AppStore` mutations with API/RLS-backed queries.
4. Seed from current mock users/students/invoices.

Until then, clear `localStorage` key `kingsford.appstore.v2` to reset demo data.
