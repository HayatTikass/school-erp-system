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
  UserCircleIcon,
  Notification02Icon,
  Logout03Icon,
  Menu01Icon,
  Cancel01Icon,
  Mortarboard01Icon,
} from "hugeicons-react";
import { cn } from "../lib/utils";
import { school, currentUsers } from "../data/mock";
import { Avatar, Badge, SearchInput } from "./ui";

type Role = "admin" | "teacher" | "student" | "parent";

type NavItem = { to: string; label: string; icon: React.ElementType };

const nav: Record<Role, { section: string; items: NavItem[] }[]> = {
  admin: [
    {
      section: "Overview",
      items: [{ to: "/admin", label: "Dashboard", icon: DashboardSquare01Icon }],
    },
    {
      section: "School management",
      items: [
        { to: "/admin/users", label: "Users & Roles", icon: UserGroupIcon },
        { to: "/admin/admissions", label: "Admissions", icon: UserAdd01Icon },
        { to: "/admin/academics", label: "Academics", icon: SchoolIcon },
        { to: "/admin/attendance", label: "Attendance & Discipline", icon: CheckmarkCircle02Icon },
      ],
    },
    {
      section: "Operations",
      items: [
        { to: "/admin/finance", label: "Finance & Fees", icon: Wallet01Icon },
        { to: "/admin/hr", label: "HR & Staff", icon: Briefcase01Icon },
        { to: "/admin/library", label: "Library", icon: LibraryIcon },
        { to: "/admin/inventory", label: "Assets & Inventory", icon: PackageIcon },
        { to: "/admin/transport", label: "Transport", icon: Bus01Icon },
      ],
    },
    {
      section: "Insights",
      items: [
        { to: "/admin/communication", label: "Communication", icon: Megaphone01Icon },
        { to: "/admin/reports", label: "Reports & Analytics", icon: ChartBarLineIcon },
        { to: "/admin/settings", label: "System Settings", icon: Settings01Icon },
      ],
    },
  ],
  teacher: [
    {
      section: "Overview",
      items: [{ to: "/teacher", label: "Dashboard", icon: DashboardSquare01Icon }],
    },
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
    {
      section: "Personal",
      items: [{ to: "/teacher/messages", label: "Messages", icon: Message01Icon }],
    },
  ],
  student: [
    {
      section: "Overview",
      items: [{ to: "/student", label: "Dashboard", icon: DashboardSquare01Icon }],
    },
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
    {
      section: "Overview",
      items: [{ to: "/parent", label: "Child Dashboard", icon: DashboardSquare01Icon }],
    },
    {
      section: "Monitoring",
      items: [
        { to: "/parent/progress", label: "Academic Progress", icon: GraduationScrollIcon },
        { to: "/parent/attendance", label: "Attendance", icon: CheckmarkCircle02Icon },
        { to: "/parent/assignments", label: "Assignments", icon: AssignmentsIcon },
        { to: "/parent/timetable", label: "Timetable & Events", icon: Calendar03Icon },
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

const roleLabels: Record<Role, string> = {
  admin: "Administration",
  teacher: "Teacher Portal",
  student: "Student Portal",
  parent: "Parent Portal",
};

export default function AppShell({ role }: { role: Role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = currentUsers[role];

  const sidebar = (
    <div className="flex h-full w-72 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs">
          <Mortarboard01Icon size={22} />
        </div>
        <div>
          <p className="text-base leading-tight font-bold text-gray-900">{school.name}</p>
          <p className="text-xs font-medium text-gray-500">{roleLabels[role]}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <SearchInput placeholder="Search" />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        {nav[role].map((group) => (
          <div key={group.section}>
            <p className="px-3 pb-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">{group.section}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === `/${role}`}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
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

      {/* User footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            title="Log out"
            onClick={() => navigate("/")}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <Logout03Icon size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-950/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-50">{sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
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
            <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-50">
              <Notification02Icon size={20} />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-error-500 ring-2 ring-white" />
            </button>
            <div className="hidden items-center gap-3 border-l border-gray-200 pl-3 sm:flex">
              <Avatar name={user.name} size="sm" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
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
    </div>
  );
}
