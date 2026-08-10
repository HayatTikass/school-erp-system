import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  UserAdd01Icon,
  SchoolIcon,
  Wallet01Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  LibraryIcon,
  Megaphone01Icon,
  ChartBarLineIcon,
  PackageIcon,
  Bus01Icon,
  Settings01Icon,
  TaskDone01Icon,
  Book02Icon,
  AssignmentsIcon,
  UserMultipleIcon,
  SchoolReportCardIcon,
  Message01Icon,
  Calendar03Icon,
  GraduationScrollIcon,
  Invoice01Icon,
  MoneyReceive01Icon,
  UserCircleIcon,
  Notification02Icon,
  Logout03Icon,
  Menu01Icon,
  Cancel01Icon,
  Mortarboard01Icon,
  BookOpen01Icon,
  BookDownloadIcon,
  CalendarMinus01Icon,
  MoneyBag01Icon,
  Alert01Icon,
  Route01Icon,
  Wrench01Icon,
  NoteIcon,
} from "hugeicons-react";
import { cn } from "../lib/utils";
import { school } from "../data/mock";
import { Avatar, Badge, SearchInput } from "./ui";
import type { Role } from "../types/roles";
import { ROLE_META } from "../types/roles";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";
import { Modal } from "./Modal";

type NavItem = { to: string; label: string; icon: React.ElementType };

const nav: Record<Role, { section: string; items: NavItem[] }[]> = {
  admin: [
    { section: "Overview", items: [{ to: "/admin", label: "Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "People & admissions",
      items: [
        { to: "/admin/users", label: "Users & Roles", icon: UserGroupIcon },
        { to: "/admin/admissions", label: "Admissions", icon: UserAdd01Icon },
      ],
    },
    {
      section: "Academics",
      items: [
        { to: "/admin/academics/classes", label: "Classes", icon: UserMultipleIcon },
        { to: "/admin/academics/subjects", label: "Subjects", icon: Book02Icon },
        { to: "/admin/academics/timetable", label: "Timetable", icon: Calendar03Icon },
        { to: "/admin/academics/grading", label: "Grading scale", icon: SchoolReportCardIcon },
        { to: "/admin/attendance", label: "Attendance", icon: CheckmarkCircle02Icon },
        { to: "/admin/discipline", label: "Discipline", icon: Alert01Icon },
      ],
    },
    {
      section: "Finance",
      items: [
        { to: "/admin/finance", label: "Finance overview", icon: Wallet01Icon },
        { to: "/admin/finance/invoices", label: "Invoices", icon: Invoice01Icon },
        { to: "/admin/finance/fee-structure", label: "Fee structure", icon: MoneyBag01Icon },
      ],
    },
    {
      section: "HR",
      items: [
        { to: "/admin/hr/staff", label: "Staff directory", icon: Briefcase01Icon },
        { to: "/admin/hr/leave", label: "Leave requests", icon: CalendarMinus01Icon },
        { to: "/admin/hr/payroll", label: "Payroll", icon: MoneyBag01Icon },
      ],
    },
    {
      section: "Library",
      items: [
        { to: "/admin/library/catalogue", label: "Catalogue", icon: BookOpen01Icon },
        { to: "/admin/library/loans", label: "Loans & returns", icon: BookDownloadIcon },
      ],
    },
    {
      section: "Operations",
      items: [
        { to: "/admin/inventory/assets", label: "Assets", icon: PackageIcon },
        { to: "/admin/inventory/maintenance", label: "Maintenance", icon: Wrench01Icon },
        { to: "/admin/transport/routes", label: "Bus routes", icon: Bus01Icon },
        { to: "/admin/transport/assignments", label: "Route assignments", icon: Route01Icon },
      ],
    },
    {
      section: "Communication",
      items: [
        { to: "/admin/communication/notices", label: "Notices & broadcasts", icon: Megaphone01Icon },
        { to: "/admin/communication/events", label: "Events", icon: Calendar03Icon },
        { to: "/admin/reports", label: "Reports & Analytics", icon: ChartBarLineIcon },
        { to: "/admin/settings", label: "System Settings", icon: Settings01Icon },
      ],
    },
  ],
  headmaster: [
    { section: "Overview", items: [{ to: "/headmaster", label: "Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "Academics",
      items: [
        { to: "/headmaster/admissions", label: "Admissions", icon: UserAdd01Icon },
        { to: "/headmaster/academics/classes", label: "Classes", icon: UserMultipleIcon },
        { to: "/headmaster/academics/subjects", label: "Subjects", icon: Book02Icon },
        { to: "/headmaster/academics/timetable", label: "Timetable", icon: Calendar03Icon },
        { to: "/headmaster/academics/grading", label: "Grading scale", icon: SchoolReportCardIcon },
        { to: "/headmaster/attendance", label: "Attendance", icon: CheckmarkCircle02Icon },
        { to: "/headmaster/discipline", label: "Discipline", icon: Alert01Icon },
      ],
    },
    {
      section: "Communication",
      items: [
        { to: "/headmaster/communication/notices", label: "Notices & broadcasts", icon: Megaphone01Icon },
        { to: "/headmaster/communication/events", label: "Events", icon: Calendar03Icon },
        { to: "/headmaster/reports", label: "Reports & Analytics", icon: ChartBarLineIcon },
      ],
    },
  ],
  accountant: [
    { section: "Overview", items: [{ to: "/accountant", label: "Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "Finance",
      items: [
        { to: "/accountant/ledger", label: "Student Fee Ledger", icon: Invoice01Icon },
        { to: "/accountant/payments", label: "Payments", icon: MoneyReceive01Icon },
        { to: "/accountant/finance", label: "Finance overview", icon: Wallet01Icon },
        { to: "/accountant/finance/invoices", label: "Invoices", icon: NoteIcon },
        { to: "/accountant/finance/fee-structure", label: "Fee structure", icon: MoneyBag01Icon },
        { to: "/accountant/reports", label: "Financial Reports", icon: ChartBarLineIcon },
      ],
    },
  ],
  teacher: [
    { section: "Overview", items: [{ to: "/teacher", label: "Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "Classroom",
      items: [
        { to: "/teacher/attendance", label: "Attendance", icon: TaskDone01Icon },
        { to: "/teacher/gradebook", label: "Gradebook", icon: Book02Icon },
        { to: "/teacher/lessons", label: "Lesson Plans", icon: SchoolIcon },
        { to: "/teacher/assignments", label: "Assignments", icon: AssignmentsIcon },
        { to: "/teacher/classes", label: "My Classes", icon: UserMultipleIcon },
        { to: "/teacher/report-cards", label: "Report Cards", icon: SchoolReportCardIcon },
      ],
    },
    { section: "Personal", items: [{ to: "/teacher/messages", label: "Messages", icon: Message01Icon }] },
  ],
  librarian: [
    { section: "Overview", items: [{ to: "/librarian", label: "Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "Library",
      items: [
        { to: "/librarian/catalogue", label: "Catalogue", icon: BookOpen01Icon },
        { to: "/librarian/loans", label: "Loans & returns", icon: BookDownloadIcon },
      ],
    },
  ],
  hr: [
    { section: "Overview", items: [{ to: "/hr", label: "Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "People",
      items: [
        { to: "/hr/staff", label: "Staff directory", icon: Briefcase01Icon },
        { to: "/hr/leave", label: "Leave requests", icon: CalendarMinus01Icon },
        { to: "/hr/payroll", label: "Payroll", icon: MoneyBag01Icon },
      ],
    },
  ],
  student: [
    { section: "Overview", items: [{ to: "/student", label: "Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "Academics",
      items: [
        { to: "/student/results", label: "My Results", icon: GraduationScrollIcon },
        { to: "/student/assignments", label: "Assignments", icon: AssignmentsIcon },
        { to: "/student/timetable", label: "Timetable", icon: Calendar03Icon },
        { to: "/student/attendance", label: "Attendance", icon: CheckmarkCircle02Icon },
      ],
    },
    {
      section: "School life",
      items: [
        { to: "/student/fees", label: "Fees & Finance", icon: Invoice01Icon },
        { to: "/student/library", label: "Library", icon: LibraryIcon },
        { to: "/student/notices", label: "Notices", icon: Megaphone01Icon },
        { to: "/student/profile", label: "My Profile", icon: UserCircleIcon },
      ],
    },
  ],
  parent: [
    { section: "Overview", items: [{ to: "/parent", label: "Child Dashboard", icon: DashboardSquare01Icon }] },
    {
      section: "Monitoring",
      items: [
        { to: "/parent/progress", label: "Academic Progress", icon: GraduationScrollIcon },
        { to: "/parent/attendance", label: "Attendance", icon: CheckmarkCircle02Icon },
        { to: "/parent/assignments", label: "Assignments", icon: AssignmentsIcon },
        { to: "/parent/timetable", label: "Timetable", icon: Calendar03Icon },
      ],
    },
    {
      section: "Account",
      items: [
        { to: "/parent/fees", label: "Fees & Payments", icon: Wallet01Icon },
        { to: "/parent/messages", label: "Messages", icon: Message01Icon },
        { to: "/parent/profile", label: "Profile & Documents", icon: UserCircleIcon },
      ],
    },
  ],
};

const notifications = [
  { id: 1, title: "PTA meeting reminder", body: "Saturday 18 July, 9:00 AM — assembly hall.", time: "2h ago" },
  { id: 2, title: "Fee deadline extended", body: "Outstanding Term 3 fees due by 15 July.", time: "Yesterday" },
  { id: 3, title: "Exam timetable published", body: "Term 3 exams begin 27 July.", time: "2 days ago" },
];

export default function AppShell({ role }: { role: Role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast("Signed out successfully", "info");
    navigate("/");
  };

  const sidebar = (
    <div className="flex h-full w-72 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-3 px-6 pt-6 pb-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs">
          <Mortarboard01Icon size={22} />
        </div>
        <div>
          <p className="text-base leading-tight font-bold text-gray-900">{school.name}</p>
          <p className="text-xs font-medium text-gray-500">{ROLE_META[role].label}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <SearchInput placeholder="Search" />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        {nav[role].map((group) => (
          <div key={group.section}>
            <p className="px-3 pb-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">{group.section}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ROLE_META[role].portalPath}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      isActive ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    )
                  }
                >
                  <item.icon size={20} className="shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <button title="Log out" onClick={handleLogout} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
            <Logout03Icon size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-950/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-50">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
            </button>
            <Badge tone="brand" dot>
              {school.year} · {school.term}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-50"
              onClick={() => setNotifOpen(true)}
              title="Notifications"
            >
              <Notification02Icon size={20} />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-error-500 ring-2 ring-white" />
            </button>
            <div className="hidden items-center gap-3 border-l border-gray-200 pl-3 sm:flex">
              <Avatar name={user.name} size="sm" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.title || ROLE_META[role].shortLabel}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" subtitle="Recent school alerts" size="md">
        <div className="divide-y divide-gray-100">
          {notifications.map((n) => (
            <div key={n.id} className="py-3.5">
              <p className="text-sm font-semibold text-gray-900">{n.title}</p>
              <p className="mt-0.5 text-sm text-gray-600">{n.body}</p>
              <p className="mt-1 text-xs text-gray-400">{n.time}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
