import { useMemo } from "react";
import { UserMultipleIcon, TaskDone01Icon, AssignmentsIcon, Clock01Icon, ArrowRight01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, Progress, Avatar } from "../../components/ui";
import { formatDate } from "../../lib/utils";
import { useAuth } from "../../auth/AuthContext";
import { useAppStore } from "../../store/AppStore";

const todaySchedule = [
  { time: "7:30 to 8:50", subject: "Mathematics", class: "JHS 2A", room: "Block B · Rm 1", status: "Completed" },
  { time: "8:50 to 9:30", subject: "Mathematics", class: "JHS 2B", room: "Block B · Rm 2", status: "Completed" },
  { time: "9:50 to 10:30", subject: "Mathematics", class: "JHS 3A", room: "Block C · Rm 1", status: "In progress" },
  { time: "11:10 to 11:50", subject: "Mathematics", class: "JHS 1A", room: "Block A · Rm 1", status: "Upcoming" },
];

const TEACHER_CLASSES = ["JHS 1A", "JHS 2A", "JHS 2B", "JHS 3A"];

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { students, assignments, submissions, lessonPlans, conversations, classes } = useAppStore();

  const myStudents = useMemo(
    () => students.filter((s) => TEACHER_CLASSES.includes(s.class)),
    [students],
  );

  const myAssignments = useMemo(
    () => assignments.filter((a) => TEACHER_CLASSES.includes(a.className)),
    [assignments],
  );

  const pendingGrading = useMemo(
    () => submissions.filter((s) => s.status === "Submitted" || s.status === "Late").length,
    [submissions],
  );

  const avgAttendance = myStudents.length
    ? Math.round(myStudents.reduce((a, s) => a + s.attendance, 0) / myStudents.length)
    : 0;

  const submissionCount = (assignmentId: string) => {
    const subs = submissions.filter((s) => s.assignmentId === assignmentId);
    return subs.filter((s) => s.status === "Submitted" || s.status === "Graded" || s.status === "Late").length;
  };

  const myClasses = classes.filter((c) => TEACHER_CLASSES.includes(c.name));

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name || "Teacher"} 👋`}
        subtitle={`${todayLabel()} · you have ${todaySchedule.length} lessons today and ${pendingGrading} submissions to grade.`}
        actions={
          <Link to="/teacher/attendance">
            <Button icon={<TaskDone01Icon size={18} />}>Mark attendance</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My classes" value={String(myClasses.length)} delta={`${myStudents.length} students`} deltaLabel="total" icon={<UserMultipleIcon size={20} />} />
        <StatCard label="Lessons today" value={String(todaySchedule.length)} delta={`${todaySchedule.filter((s) => s.status === "Completed").length} completed`} deltaLabel="" icon={<Clock01Icon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Pending grading" value={String(pendingGrading)} delta="due this week" deltaLabel="" positive={false} icon={<AssignmentsIcon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Avg. class attendance" value={`${avgAttendance}%`} delta="across classes" deltaLabel="" icon={<TaskDone01Icon size={20} />} iconBg="bg-success-50 text-success-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Today's schedule"
            subtitle={`Your teaching periods for ${todayLabel().split(",")[0]}`}
            action={
              <Link to="/teacher/classes">
                <Button variant="secondary" size="sm">
                  All classes
                </Button>
              </Link>
            }
          />
          <div className="divide-y divide-gray-100 px-5">
            {todaySchedule.map((s) => {
              const classCount = students.filter((st) => st.class === s.class).length;
              return (
                <div key={s.time} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-bold text-gray-900">{s.time.split(" to ")[0]}</p>
                    <p className="text-xs text-gray-400">to {s.time.split(" to ")[1]}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {s.subject} · {s.class}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.room} · {classCount} students
                    </p>
                  </div>
                  <Badge tone={statusTone(s.status)} dot>
                    {s.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent messages" action={<Link to="/teacher/messages" className="text-sm font-semibold text-brand-700">View all</Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {conversations.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-start gap-3 py-3.5">
                <Avatar name={m.withName} color={m.avatarColor} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{m.withName}</p>
                  <p className="truncate text-xs text-gray-500">{m.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Assignment submissions"
            subtitle="Track class progress"
            action={
              <Link to="/teacher/assignments">
                <Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>
                  Manage
                </Button>
              </Link>
            }
          />
          <Table>
            <THead cols={["Assignment", "Due", "Submissions", "Status"]} />
            <tbody>
              {myAssignments.slice(0, 4).map((a) => {
                const submitted = submissionCount(a.id);
                const pct = a.totalStudents > 0 ? (submitted / a.totalStudents) * 100 : 0;
                return (
                  <TRow key={a.id}>
                    <TCell>
                      <p className="font-semibold text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-400">
                        {a.subject} · {a.className}
                      </p>
                    </TCell>
                    <TCell>{formatDate(a.due)}</TCell>
                    <TCell>
                      <div className="flex w-32 items-center gap-2">
                        <Progress value={pct} className="flex-1" />
                        <span className="text-xs font-semibold whitespace-nowrap">
                          {submitted}/{a.totalStudents}
                        </span>
                      </div>
                    </TCell>
                    <TCell>
                      <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                    </TCell>
                  </TRow>
                );
              })}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader
            title="Lesson plan progress"
            subtitle="This term's coverage"
            action={
              <Link to="/teacher/lessons">
                <Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>
                  Plans
                </Button>
              </Link>
            }
          />
          <div className="divide-y divide-gray-100 px-5">
            {lessonPlans.slice(0, 4).map((lp) => (
              <div key={lp.id} className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{lp.topic}</p>
                  <p className="text-xs text-gray-500">
                    {lp.className} · {lp.week}
                  </p>
                </div>
                <Badge tone={statusTone(lp.status)} dot>
                  {lp.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
