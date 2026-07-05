# Kingsford Academy — School ERP System

A school management system covering four portals — **Administration**, **Teachers**, **Students** and **Parents/Guardians** — based on the School-MS Figma functionality breakdown, styled with the Untitled UI design system.

> Currently running entirely on mock data (`src/data/mock.ts`). A database/API layer will be added later — every page reads from this single module, so swapping in real data means replacing that file with API calls.

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

Sign in from the landing page by picking a portal (no real auth yet — any credentials work).

## Portals & pages

| Portal | Routes |
| --- | --- |
| **Admin** (`/admin`) | Dashboard, Users & Roles, Admissions, Academics (classes/subjects/timetable/grading), Attendance & Discipline, Finance & Fees, HR & Staff, Library, Assets & Inventory, Transport, Communication, Reports & Analytics, System Settings |
| **Teacher** (`/teacher`) | Dashboard, Attendance marking, Gradebook, Lesson Plans, Assignments, My Classes, Report Cards, Messages |
| **Student** (`/student`) | Dashboard, Results, Assignments, Timetable, Attendance, Fees, Library, Notices, Profile & Documents |
| **Parent** (`/parent`) | Child Dashboard, Academic Progress, Attendance, Assignments, Timetable & Events, Fees & Payments, Messages, Profile & Documents |

## Project structure

```
src/
├── components/
│   ├── ui.tsx            # Untitled UI kit: Button, Badge, Card, StatCard, Table, Tabs, …
│   ├── AppShell.tsx      # Sidebar + topbar layout, role-based navigation
│   ├── MessagesView.tsx  # Shared inbox (teacher + parent)
│   └── TimetableView.tsx # Shared timetable (student + parent)
├── data/mock.ts          # All mock data — replace with API layer later
├── lib/utils.ts          # cn(), money/date formatting
├── pages/
│   ├── Login.tsx         # Portal selector + sign-in
│   ├── admin/  teacher/  student/  parent/
└── index.css             # Tailwind v4 theme (Untitled UI tokens, Nunito Sans)
```
