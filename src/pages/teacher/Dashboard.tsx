import { UserMultipleIcon, TaskDone01Icon, AssignmentsIcon, Clock01Icon, ArrowRight01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, Progress } from "../../components/ui";
import { assignments, lessonPlans, messages, currentUsers } from "../../data/mock";
import { formatDate } from "../../lib/utils";
import { Avatar } from "../../components/ui";

const todaySchedule = [
  { time: "7:30 – 8:50", subject: "Mathematics", class: "JHS 2A", room: "Block B · Rm 1", status: "Completed" },
  { time: "8:50 – 9:30", subject: "Mathematics", class: "JHS 2B", room: "Block B · Rm 2", status: "Completed" },
  { time: "9:50 – 10:30", subject: "Mathematics", class: "JHS 3A", room: "Block C · Rm 1", status: "In progress" },
  { time: "11:10 – 11:50", subject: "Mathematics", class: "JHS 1A", room: "Block A · Rm 1", status: "Upcoming" },
];

export default function TeacherDashboard() {
  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUsers.teacher.name} 👋`}
        subtitle="Monday, 6 July — you have 4 lessons today and 13 submissions to grade."
        actions={<Button icon={<TaskDone01Icon size={18} />}>Mark attendance</Button>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My classes" value="4" delta="127 students" deltaLabel="total" icon={<UserMultipleIcon size={20} />} />
        <StatCard label="Lessons today" value="4" delta="2 completed" deltaLabel="" icon={<Clock01Icon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Pending grading" value="13" delta="due this week" deltaLabel="" positive={false} icon={<AssignmentsIcon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Avg. class attendance" value="92%" delta="1.8%" icon={<TaskDone01Icon size={20} />} iconBg="bg-success-50 text-success-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Today's schedule */}
        <Card className="xl:col-span-2">
          <CardHeader title="Today's schedule" subtitle="Your teaching periods for Monday" action={<Link to="/teacher/classes"><Button variant="secondary" size="sm">All classes</Button></Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {todaySchedule.map((s) => (
              <div key={s.time} className="flex flex-wrap items-center gap-4 py-4">
                <div className="w-28 shrink-0">
                  <p className="text-sm font-bold text-gray-900">{s.time.split(" – ")[0]}</p>
                  <p className="text-xs text-gray-400">– {s.time.split(" – ")[1]}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{s.subject} · {s.class}</p>
                  <p className="text-xs text-gray-500">{s.room}</p>
                </div>
                <Badge tone={statusTone(s.status)} dot>{s.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Messages preview */}
        <Card>
          <CardHeader title="Recent messages" action={<Link to="/teacher/messages" className="text-sm font-semibold text-brand-700">View all</Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {messages.slice(2, 5).map((m) => (
              <div key={m.id} className="flex items-start gap-3 py-3.5">
                <Avatar name={m.from} color={m.avatarColor} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{m.from}</p>
                  <p className="truncate text-xs text-gray-500">{m.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Assignment submissions" subtitle="Track class progress" action={<Link to="/teacher/assignments"><Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>Manage</Button></Link>} />
          <Table>
            <THead cols={["Assignment", "Due", "Submissions", "Status"]} />
            <tbody>
              {assignments.slice(0, 4).map((a) => (
                <TRow key={a.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.subject} · {a.class}</p>
                  </TCell>
                  <TCell>{formatDate(a.due)}</TCell>
                  <TCell>
                    <div className="flex w-32 items-center gap-2">
                      <Progress value={(a.submitted / a.totalStudents) * 100} className="flex-1" />
                      <span className="text-xs font-semibold whitespace-nowrap">{a.submitted}/{a.totalStudents}</span>
                    </div>
                  </TCell>
                  <TCell><Badge tone={statusTone(a.status)}>{a.status}</Badge></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Lesson plan progress" subtitle="This term's coverage" action={<Link to="/teacher/lessons"><Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>Plans</Button></Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {lessonPlans.slice(0, 4).map((lp) => (
              <div key={lp.id} className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{lp.topic}</p>
                  <p className="text-xs text-gray-500">{lp.class} · {lp.week}</p>
                </div>
                <Badge tone={statusTone(lp.status)} dot>{lp.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
