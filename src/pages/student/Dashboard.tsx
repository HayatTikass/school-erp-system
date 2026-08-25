import { useMemo } from "react";
import { GraduationScrollIcon, AssignmentsIcon, CheckmarkCircle02Icon, Wallet01Icon, ArrowRight01Icon, Clock01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard, Card, CardHeader, Badge, statusTone, Button, Progress } from "../../components/ui";
import { timetable, subjects } from "../../data/mock";
import { formatDate, formatMoney } from "../../lib/utils";
import { useAuth } from "../../auth/AuthContext";
import { useAppStore } from "../../store/AppStore";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";

const tagTone = { Event: "brand", Academic: "blue", Finance: "warning", General: "gray" } as const;

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = useCurrentStudent();
  const { assignments, submissions, notices, grades } = useAppStore();

  const firstName = student?.name.split(" ")[0] || user?.name.split(" ")[0] || "Student";
  const today = timetable.filter((t) => t.mon !== "Break").slice(0, 5);

  const classAssignments = useMemo(
    () => (student ? assignments.filter((a) => a.className === student.class) : []),
    [assignments, student],
  );

  const assignmentRows = useMemo(() => {
    if (!student) return [];
    return classAssignments.map((a) => {
      const sub = submissions.find((s) => s.assignmentId === a.id && s.studentId === student.id);
      return { assignment: a, status: sub?.status ?? "Pending", score: sub?.score };
    });
  }, [classAssignments, submissions, student]);

  const pending = assignmentRows.filter((r) => r.status === "Pending");
  const nextDue = [...pending].sort((a, b) => a.assignment.due.localeCompare(b.assignment.due))[0];

  const myGrades = useMemo(
    () => (student ? grades.filter((g) => g.studentId === student.id && g.status === "Approved") : []),
    [grades, student],
  );
  const topSubjects = [...myGrades].sort((a, b) => b.total - a.total).slice(0, 5);

  const portalNotices = useMemo(
    () => notices.filter((n) => n.audience === "Everyone" || n.audience === "Students"),
    [notices],
  );

  if (!student) {
    return (
      <div>
        <PageHeader title={`Hi ${firstName} 👋`} subtitle="Welcome to your student portal." />
        <Card className="p-6 text-sm text-gray-600">No student profile linked to this account.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Hi ${firstName} 👋`}
        subtitle={`${student.class} · ${pending.length} assignment${pending.length === 1 ? "" : "s"} pending${nextDue ? `, next due ${formatDate(nextDue.assignment.due)}` : ""}.`}
        actions={<Link to="/student/assignments"><Button icon={<ArrowRight01Icon size={18} />}>View assignments</Button></Link>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current GPA" value={student.gpa.toFixed(1)} delta="this term" icon={<GraduationScrollIcon size={20} />} />
        <StatCard label="Attendance" value={`${student.attendance}%`} delta="term average" deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Pending assignments" value={String(pending.length)} delta={nextDue ? `due ${formatDate(nextDue.assignment.due)}` : "all caught up"} deltaLabel="" positive={pending.length === 0} icon={<AssignmentsIcon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Fees balance" value={formatMoney(student.feesOwed)} delta={student.feesOwed === 0 ? "fully paid" : "outstanding"} deltaLabel="" positive={student.feesOwed === 0} icon={<Wallet01Icon size={20} />} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Today's classes" subtitle={`Monday · ${student.class}`} action={<Link to="/student/timetable"><Button variant="secondary" size="sm">Full timetable</Button></Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {today.map((slot, i) => {
              const subj = subjects.find((s) => slot.mon.startsWith(s.name.split(" ")[0]));
              return (
                <div key={i} className="flex items-center gap-4 py-3.5">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${subj?.color ?? "bg-gray-100 text-gray-600"}`}>
                    {subj?.code ?? slot.mon.slice(0, 3).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{slot.mon}</p>
                    <p className="text-xs text-gray-500">{subj?.teacher ?? "None"}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500"><Clock01Icon size={15} /> {slot.time}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Latest notices" action={<Link to="/student/notices" className="text-sm font-semibold text-brand-700">All</Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {portalNotices.slice(0, 3).map((n) => (
              <div key={n.id} className="py-3.5">
                <Badge tone={tagTone[n.tag]}>{n.tag}</Badge>
                <p className="mt-1.5 text-sm font-semibold text-gray-900">{n.title}</p>
                <p className="mt-0.5 text-xs text-gray-400">{formatDate(n.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Upcoming assignments" subtitle="Stay ahead of deadlines" />
          <div className="divide-y divide-gray-100 px-5">
            {assignmentRows.slice(0, 4).map(({ assignment: a, status, score }) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.subject} · due {formatDate(a.due)}</p>
                </div>
                <Badge tone={statusTone(status)} dot>{status}{score ? ` · ${score}` : ""}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Subject performance" subtitle="Term 3 so far" action={<Link to="/student/results"><Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>Results</Button></Link>} />
          <div className="space-y-4 p-5">
            {topSubjects.length === 0 ? (
              <p className="text-sm text-gray-500">Grades will appear here once published.</p>
            ) : (
              topSubjects.map((s) => (
                <div key={s.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{s.subject}</span>
                    <span className="font-semibold text-gray-900">{s.total}%</span>
                  </div>
                  <Progress value={s.total} tone={s.total >= 80 ? "success" : s.total >= 65 ? "brand" : "warning"} />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
