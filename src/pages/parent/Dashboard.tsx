import { GraduationScrollIcon, CheckmarkCircle02Icon, Wallet01Icon, AssignmentsIcon, ArrowRight01Icon, Clock01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard, Card, CardHeader, Badge, statusTone, Button, Avatar } from "../../components/ui";
import { assignments, notices, timetable, subjects } from "../../data/mock";
import { formatDate, cn } from "../../lib/utils";

const children = [
  { name: "Abena Osei", class: "JHS 2A", gpa: 3.8, attendance: 96, fees: 0, active: true },
  { name: "Kwaku Osei", class: "Primary 5", gpa: 3.4, attendance: 93, fees: 250, active: false },
];

export default function ParentDashboard() {
  const today = timetable.filter((t) => t.mon !== "Break").slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Good afternoon, Mr. Osei 👋"
        subtitle="Here's how your children are doing at Kingsford Academy."
        actions={<Link to="/parent/messages"><Button variant="secondary">Message a teacher</Button></Link>}
      />

      {/* Child switcher */}
      <div className="mb-6 flex flex-wrap gap-3">
        {children.map((c) => (
          <button
            key={c.name}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
              c.active ? "border-brand-600 bg-brand-25 ring-4 ring-brand-100" : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <Avatar name={c.name} size="sm" />
            <div>
              <p className="text-sm font-bold text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-500">{c.class}</p>
            </div>
            {c.active && <Badge tone="brand" className="ml-2">Viewing</Badge>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current GPA" value="3.8" delta="0.2" icon={<GraduationScrollIcon size={20} />} />
        <StatCard label="Attendance" value="96%" delta="1 late this term" deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Fees outstanding" value="GH₵ 0" delta="fully paid" deltaLabel="" icon={<Wallet01Icon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Assignments pending" value="2" delta="1 due Wednesday" deltaLabel="" positive={false} icon={<AssignmentsIcon size={20} />} iconBg="bg-warning-50 text-warning-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Abena's day today" subtitle="Monday · JHS 2A" action={<Link to="/parent/timetable"><Button variant="secondary" size="sm">Full timetable</Button></Link>} />
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

        <Card>
          <CardHeader title="Alerts & actions" />
          <div className="space-y-3 p-5">
            <div className="rounded-lg border border-warning-200 bg-warning-25 p-3.5">
              <p className="text-sm font-bold text-gray-900">Assignment due Wednesday</p>
              <p className="mt-0.5 text-xs text-gray-600">Maths worksheet not yet submitted.</p>
            </div>
            <div className="rounded-lg border border-error-200 bg-error-25 p-3.5">
              <p className="text-sm font-bold text-gray-900">Library book overdue</p>
              <p className="mt-0.5 text-xs text-gray-600">"Things Fall Apart" — fine accruing (GH₵ 5.00).</p>
            </div>
            <div className="rounded-lg border border-brand-200 bg-brand-25 p-3.5">
              <p className="text-sm font-bold text-gray-900">PTA meeting — 18 July</p>
              <p className="mt-0.5 text-xs text-gray-600">9:00 AM at the assembly hall. RSVP requested.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Assignment tracker" subtitle="Abena's current workload" action={<Link to="/parent/assignments"><Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>Details</Button></Link>} />
          <div className="divide-y divide-gray-100 px-5">
            {assignments.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.subject} · due {formatDate(a.due)}</p>
                </div>
                <Badge tone={statusTone(a.myStatus)} dot>{a.myStatus}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="School notices" action={<Badge tone="brand">2 new</Badge>} />
          <div className="divide-y divide-gray-100 px-5">
            {notices.slice(0, 3).map((n) => (
              <div key={n.id} className="py-4">
                <div className="flex items-center gap-2">
                  <Badge tone={n.tag === "Finance" ? "warning" : n.tag === "Event" ? "brand" : "blue"}>{n.tag}</Badge>
                  <span className="text-xs text-gray-400">{formatDate(n.date)}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-gray-900">{n.title}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
