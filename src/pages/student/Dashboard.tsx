import { GraduationScrollIcon, AssignmentsIcon, CheckmarkCircle02Icon, Wallet01Icon, ArrowRight01Icon, Clock01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard, Card, CardHeader, Badge, statusTone, Button, Progress } from "../../components/ui";
import { assignments, timetable, notices, subjects } from "../../data/mock";
import { formatDate } from "../../lib/utils";

export default function StudentDashboard() {
  const today = timetable.filter((t) => t.mon !== "Break").slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Hi Abena 👋"
        subtitle="Monday, 6 July — you have 5 classes today and 2 assignments due this week."
        actions={<Link to="/student/assignments"><Button icon={<ArrowRight01Icon size={18} />}>View assignments</Button></Link>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current GPA" value="3.8" delta="0.2" icon={<GraduationScrollIcon size={20} />} />
        <StatCard label="Attendance" value="96%" delta="above class avg." deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Pending assignments" value="2" delta="1 due Wed" deltaLabel="" positive={false} icon={<AssignmentsIcon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Fees balance" value="GH₵ 0" delta="fully paid" deltaLabel="" icon={<Wallet01Icon size={20} />} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Today's classes */}
        <Card className="xl:col-span-2">
          <CardHeader title="Today's classes" subtitle="Monday · JHS 2A · Block B, Room 1" action={<Link to="/student/timetable"><Button variant="secondary" size="sm">Full timetable</Button></Link>} />
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
                    <p className="text-xs text-gray-500">{subj?.teacher ?? "—"}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500"><Clock01Icon size={15} /> {slot.time}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Notices */}
        <Card>
          <CardHeader title="Latest notices" action={<Link to="/student/notices" className="text-sm font-semibold text-brand-700">All</Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {notices.slice(0, 3).map((n) => (
              <div key={n.id} className="py-3.5">
                <Badge tone={n.tag === "Event" ? "brand" : n.tag === "Academic" ? "blue" : "gray"}>{n.tag}</Badge>
                <p className="mt-1.5 text-sm font-semibold text-gray-900">{n.title}</p>
                <p className="mt-0.5 text-xs text-gray-400">{formatDate(n.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Upcoming work */}
        <Card>
          <CardHeader title="Upcoming assignments" subtitle="Stay ahead of deadlines" />
          <div className="divide-y divide-gray-100 px-5">
            {assignments.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.subject} · due {formatDate(a.due)}</p>
                </div>
                <Badge tone={statusTone(a.myStatus)} dot>{a.myStatus}{a.score ? ` · ${a.score}` : ""}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject snapshot */}
        <Card>
          <CardHeader title="Subject performance" subtitle="Term 3 so far" action={<Link to="/student/results"><Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>Results</Button></Link>} />
          <div className="space-y-4 p-5">
            {[
              { name: "ICT", score: 92 },
              { name: "Mathematics", score: 86 },
              { name: "Integrated Science", score: 80 },
              { name: "English Language", score: 78 },
              { name: "Social Studies", score: 70 },
            ].map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{s.name}</span>
                  <span className="font-semibold text-gray-900">{s.score}%</span>
                </div>
                <Progress value={s.score} tone={s.score >= 80 ? "success" : s.score >= 65 ? "brand" : "warning"} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
