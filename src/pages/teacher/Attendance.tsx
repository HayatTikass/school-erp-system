import { useState } from "react";
import { CheckmarkCircle02Icon, CancelCircleIcon, Clock01Icon, TickDouble01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Avatar, Select, StatCard } from "../../components/ui";
import { students } from "../../data/mock";
import { cn } from "../../lib/utils";

type Mark = "present" | "absent" | "late";

export default function TeacherAttendance() {
  const roster = students.filter((s) => s.class === "JHS 2A").concat(students.slice(0, 4));
  const [marks, setMarks] = useState<Record<string, Mark>>(
    Object.fromEntries(roster.map((s, i) => [s.id + i, i === 3 ? "absent" : i === 5 ? "late" : "present"])),
  );

  const counts = Object.values(marks).reduce(
    (acc, m) => ({ ...acc, [m]: (acc[m] ?? 0) + 1 }),
    {} as Record<Mark, number>,
  );

  const setAll = (m: Mark) => setMarks(Object.fromEntries(Object.keys(marks).map((k) => [k, m])));

  return (
    <div>
      <PageHeader
        title="Attendance Tracking"
        subtitle="Mark today's register — Monday, 6 July 2026."
        actions={
          <>
            <Select options={["JHS 2A — Mathematics", "JHS 2B — Mathematics", "JHS 3A — Mathematics", "JHS 1A — Mathematics"]} />
            <Button icon={<TickDouble01Icon size={18} />} onClick={() => setAll("present")}>Mark all present</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Present" value={String(counts.present ?? 0)} iconBg="bg-success-50 text-success-600" icon={<CheckmarkCircle02Icon size={20} />} />
        <StatCard label="Absent" value={String(counts.absent ?? 0)} iconBg="bg-error-50 text-error-600" icon={<CancelCircleIcon size={20} />} />
        <StatCard label="Late" value={String(counts.late ?? 0)} iconBg="bg-warning-50 text-warning-600" icon={<Clock01Icon size={20} />} />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="JHS 2A register"
          subtitle={`${roster.length} students · period 1 (7:30 – 8:50)`}
          action={<Badge tone="brand" dot>Unsaved changes</Badge>}
        />
        <div className="divide-y divide-gray-100">
          {roster.map((s, i) => {
            const key = s.id + i;
            const mark = marks[key];
            return (
              <div key={key} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
                <Avatar name={s.name} color={s.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.id} · term attendance {s.attendance}%</p>
                </div>
                {s.attendance < 80 && <Badge tone="error">Chronic absence</Badge>}
                <div className="flex gap-1.5">
                  {(["present", "late", "absent"] as Mark[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMarks({ ...marks, [key]: m })}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                        mark === m
                          ? m === "present"
                            ? "bg-success-50 text-success-700 ring-1 ring-success-200"
                            : m === "late"
                              ? "bg-warning-50 text-warning-700 ring-1 ring-warning-200"
                              : "bg-error-50 text-error-700 ring-1 ring-error-200"
                          : "text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
          <Button variant="secondary">Save draft</Button>
          <Button>Submit register</Button>
        </div>
      </Card>
    </div>
  );
}
