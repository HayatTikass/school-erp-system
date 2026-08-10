import { Link } from "react-router-dom";
import {
  ChartBarLineIcon,
  LibraryIcon,
  Briefcase01Icon,
  SchoolIcon,
  CheckmarkCircle02Icon,
  Megaphone01Icon,
  UserAdd01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { PageHeader, StatCard, Card, Button } from "../components/ui";
import { useAuth } from "../auth/AuthContext";
import { useAppStore } from "../store/AppStore";
import AdminDashboard from "./admin/Dashboard";
export { default as AccountantDashboard } from "./accountant/Dashboard";

export function HeadmasterDashboard() {
  const { user } = useAuth();
  const { students, attendance, discipline, applications } = useAppStore();

  const latestDate = attendance.length > 0
    ? attendance.reduce((max, a) => (a.date > max ? a.date : max), attendance[0].date)
    : null;
  const todayRecords = latestDate ? attendance.filter((a) => a.date === latestDate) : [];
  const presentToday = todayRecords.filter((a) => a.mark === "present" || a.mark === "late" || a.mark === "excused").length;
  const attendanceToday = todayRecords.length > 0 ? `${Math.round((presentToday / todayRecords.length) * 100)}%` : "—";
  const openDiscipline = discipline.filter((d) => d.status === "Open" || d.status === "Under review").length;
  const pendingAdmissions = applications.filter((a) => a.status === "Submitted" || a.status === "Review" || a.status === "Under review").length;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name.split(" ").slice(-1)[0]} 👋`}
        subtitle="School leadership overview — academics, discipline and admissions."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students enrolled" value={String(students.length)} delta={`${students.filter((s) => s.status === "Active").length} active`} deltaLabel="" />
        <StatCard label="Attendance today" value={attendanceToday} delta={todayRecords.length > 0 ? `${presentToday} / ${todayRecords.length} present` : "No records"} deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Open discipline cases" value={String(openDiscipline)} delta={`${discipline.length} total`} deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Pending admissions" value={String(pendingAdmissions)} delta="under review" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { to: "/headmaster/academics", label: "Academics", desc: "Classes, subjects, timetable & grading", icon: SchoolIcon },
          { to: "/headmaster/attendance", label: "Attendance & Discipline", desc: "Absenteeism flags and cases", icon: CheckmarkCircle02Icon },
          { to: "/headmaster/admissions", label: "Admissions", desc: "Applications and entrance exams", icon: UserAdd01Icon },
          { to: "/headmaster/communication", label: "Communication", desc: "Broadcasts and noticeboard", icon: Megaphone01Icon },
          { to: "/headmaster/reports", label: "Reports", desc: "Academic and enrolment analytics", icon: ChartBarLineIcon },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="group">
            <Card className="h-full p-5 transition-shadow group-hover:shadow-md">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <item.icon size={20} />
              </div>
              <p className="mt-3 text-base font-bold text-gray-900">{item.label}</p>
              <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                Open <ArrowRight01Icon size={16} />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LibrarianDashboard() {
  const { user } = useAuth();
  const { loans, books } = useAppStore();
  const overdue = loans.filter((l) => l.status === "Overdue").length;
  const onLoan = loans.filter((l) => l.status === "On loan" || l.status === "Overdue").length;

  return (
    <div>
      <PageHeader
        title={`Library desk — ${user?.name}`}
        subtitle="Catalogue, loans and overdue notices."
        actions={
          <>
            <Link to="/librarian/catalogue">
              <Button variant="secondary" icon={<LibraryIcon size={18} />}>Catalogue</Button>
            </Link>
            <Link to="/librarian/loans">
              <Button icon={<LibraryIcon size={18} />}>Loans & returns</Button>
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Books on loan" value={String(onLoan)} icon={<LibraryIcon size={20} />} />
        <StatCard label="Overdue" value={String(overdue)} positive={false} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Titles in catalogue" value={String(books.length)} iconBg="bg-blue-50 text-blue-600" />
      </div>
    </div>
  );
}

export function HRDashboard() {
  const { user } = useAuth();
  const { staff, leaveRequests } = useAppStore();
  const onLeave = staff.filter((s) => s.status === "On leave").length;
  const pendingLeave = leaveRequests.filter((l) => l.status === "Pending").length;

  return (
    <div>
      <PageHeader
        title={`HR desk — ${user?.name}`}
        subtitle="Staff, leave and payroll."
        actions={
          <>
            <Link to="/hr/staff">
              <Button variant="secondary" icon={<Briefcase01Icon size={18} />}>Staff directory</Button>
            </Link>
            <Link to="/hr/leave">
              <Button variant="secondary">Leave requests</Button>
            </Link>
            <Link to="/hr/payroll">
              <Button>Payroll</Button>
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Total staff" value={String(staff.length)} delta={`${onLeave} on leave`} deltaLabel="" icon={<Briefcase01Icon size={20} />} />
        <StatCard label="On leave today" value={String(onLeave)} delta={`${pendingLeave} pending requests`} deltaLabel="" iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Appraisals due" value="8" delta="by 30 Jul" deltaLabel="" positive={false} iconBg="bg-blue-50 text-blue-600" />
      </div>
    </div>
  );
}

/** Admin keeps the full analytics dashboard */
export { AdminDashboard };
