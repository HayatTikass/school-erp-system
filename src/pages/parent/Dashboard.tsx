import { useMemo, useState } from "react";
import { GraduationScrollIcon, CheckmarkCircle02Icon, Wallet01Icon, AssignmentsIcon, ArrowRight01Icon, Clock01Icon } from "hugeicons-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard, Card, CardHeader, Badge, statusTone, Button, Avatar } from "../../components/ui";
import { timetable, subjects } from "../../data/mock";
import { formatDate, cn, formatMoney } from "../../lib/utils";
import { useAuth } from "../../auth/AuthContext";
import { useAppStore } from "../../store/AppStore";

const tagTone = { Event: "brand", Academic: "blue", Finance: "warning", General: "gray" } as const;

export default function ParentDashboard() {
  const { user } = useAuth();
  const { getStudentsForParent, assignments, submissions, notices } = useAppStore();
  const linked = user ? getStudentsForParent(user.id) : [];
  const [activeId, setActiveId] = useState(linked[0]?.id ?? "");
  const active = linked.find((c) => c.id === activeId) ?? linked[0];
  const today = timetable.filter((t) => t.mon !== "Break").slice(0, 4);

  const classAssignments = useMemo(
    () => (active ? assignments.filter((a) => a.className === active.class) : []),
    [assignments, active],
  );

  const assignmentRows = useMemo(() => {
    if (!active) return [];
    return classAssignments.map((a) => {
      const sub = submissions.find((s) => s.assignmentId === a.id && s.studentId === active.id);
      return { assignment: a, status: sub?.status ?? "Pending", score: sub?.score };
    });
  }, [classAssignments, submissions, active]);

  const pending = assignmentRows.filter((r) => r.status === "Pending");
  const nextDue = [...pending].sort((a, b) => a.assignment.due.localeCompare(b.assignment.due))[0];

  const portalNotices = useMemo(
    () => notices.filter((n) => n.audience === "Everyone" || n.audience === "Parents"),
    [notices],
  );

  return (
    <div>
      <PageHeader
        title={`Good afternoon, ${user?.name.split(" ")[0] || "Parent"} 👋`}
        subtitle="Here's how your linked children are doing at Kingsford Academy."
        actions={
          <Link to="/parent/messages">
            <Button variant="secondary">Message a teacher</Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        {linked.length === 0 && (
          <p className="text-sm text-gray-500">No students linked to this parent account yet. Ask admin to link them.</p>
        )}
        {linked.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveId(c.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
              active?.id === c.id ? "border-brand-600 bg-brand-25 ring-4 ring-brand-100" : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <Avatar name={c.name} color={c.avatarColor} size="sm" />
            <div>
              <p className="text-sm font-bold text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-500">{c.class}</p>
            </div>
            {active?.id === c.id && (
              <Badge tone="brand" className="ml-2">
                Viewing
              </Badge>
            )}
          </button>
        ))}
      </div>

      {active && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Current GPA" value={active.gpa.toFixed(1)} delta="this term" deltaLabel="" icon={<GraduationScrollIcon size={20} />} />
            <StatCard label="Attendance" value={`${active.attendance}%`} delta="term average" deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
            <StatCard
              label="Fees outstanding"
              value={formatMoney(active.feesOwed)}
              delta={active.feesOwed === 0 ? "fully paid" : "balance due"}
              deltaLabel=""
              positive={active.feesOwed === 0}
              icon={<Wallet01Icon size={20} />}
              iconBg="bg-blue-50 text-blue-600"
            />
            <StatCard label="Assignments pending" value={String(pending.length)} delta={nextDue ? `due ${formatDate(nextDue.assignment.due)}` : "all caught up"} deltaLabel="" positive={pending.length === 0} icon={<AssignmentsIcon size={20} />} iconBg="bg-warning-50 text-warning-600" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader
                title={`${active.name.split(" ")[0]}'s day today`}
                subtitle={`Monday · ${active.class}`}
                action={
                  <Link to="/parent/timetable">
                    <Button variant="secondary" size="sm">
                      Full timetable
                    </Button>
                  </Link>
                }
              />
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
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock01Icon size={15} /> {slot.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <CardHeader title="Alerts & actions" />
              <div className="space-y-3 p-5">
                {nextDue && (
                  <div className="rounded-lg border border-warning-200 bg-warning-25 p-3.5">
                    <p className="text-sm font-bold text-gray-900">Assignment due {formatDate(nextDue.assignment.due)}</p>
                    <p className="mt-0.5 text-xs text-gray-600">{nextDue.assignment.title} not yet submitted.</p>
                  </div>
                )}
                {active.feesOwed > 0 && (
                  <div className="rounded-lg border border-error-200 bg-error-25 p-3.5">
                    <p className="text-sm font-bold text-gray-900">Fees outstanding</p>
                    <p className="mt-0.5 text-xs text-gray-600">{formatMoney(active.feesOwed)} balance on {active.name}'s account.</p>
                  </div>
                )}
                {portalNotices[0] && (
                  <div className="rounded-lg border border-brand-200 bg-brand-25 p-3.5">
                    <p className="text-sm font-bold text-gray-900">{portalNotices[0].title}</p>
                    <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">{portalNotices[0].body}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader
                title="Assignment tracker"
                subtitle={`${active.name}'s current workload`}
                action={
                  <Link to="/parent/assignments">
                    <Button variant="tertiary" size="sm" icon={<ArrowRight01Icon size={16} />}>
                      Details
                    </Button>
                  </Link>
                }
              />
              <div className="divide-y divide-gray-100 px-5">
                {assignmentRows.slice(0, 4).map(({ assignment: a, status, score }) => (
                  <div key={a.id} className="flex items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500">
                        {a.subject} · due {formatDate(a.due)}
                      </p>
                    </div>
                    <Badge tone={statusTone(status)} dot>
                      {status}{score ? ` · ${score}` : ""}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="School notices" action={<Link to="/parent/fees" className="text-sm font-semibold text-brand-700">All</Link>} />
              <div className="divide-y divide-gray-100 px-5">
                {portalNotices.slice(0, 3).map((n) => (
                  <div key={n.id} className="py-4">
                    <div className="flex items-center gap-2">
                      <Badge tone={tagTone[n.tag]}>{n.tag}</Badge>
                      <span className="text-xs text-gray-400">{formatDate(n.date)}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-gray-900">{n.title}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
