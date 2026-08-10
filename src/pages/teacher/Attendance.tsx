import { useEffect, useMemo, useState } from "react";
import { CheckmarkCircle02Icon, CancelCircleIcon, Clock01Icon, TickDouble01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Avatar, Select, StatCard } from "../../components/ui";
import { cn } from "../../lib/utils";
import { useToast } from "../../components/Toast";
import { useAppStore } from "../../store/AppStore";
import { useAuth } from "../../auth/AuthContext";
import type { AttendanceMark } from "../../store/domain";

const CLASS_OPTIONS = [
  "JHS 2A — Mathematics",
  "JHS 2B — Mathematics",
  "JHS 3A — Mathematics",
  "JHS 1A — Mathematics",
];

type Mark = "present" | "absent" | "late";

function parseClass(option: string) {
  return option.split(" — ")[0]?.trim() ?? option;
}

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function TeacherAttendance() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { students, attendance, submitAttendance } = useAppStore();
  const today = new Date().toISOString().slice(0, 10);

  const [classOption, setClassOption] = useState(CLASS_OPTIONS[0]);
  const className = parseClass(classOption);

  const roster = useMemo(
    () => students.filter((s) => s.class === className).sort((a, b) => a.name.localeCompare(b.name)),
    [students, className],
  );

  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const existing = attendance.filter((a) => a.date === today && a.className === className);
    if (existing.length) {
      setMarks(
        Object.fromEntries(
          existing.map((a) => [a.studentId, a.mark === "excused" ? "present" : (a.mark as Mark)]),
        ),
      );
      setDirty(false);
    } else {
      setMarks(Object.fromEntries(roster.map((s) => [s.id, "present" as Mark])));
      setDirty(false);
    }
  }, [className, roster, attendance, today]);

  const counts = Object.values(marks).reduce(
    (acc, m) => ({ ...acc, [m]: (acc[m] ?? 0) + 1 }),
    {} as Record<Mark, number>,
  );

  const setAll = (m: Mark) => {
    setMarks(Object.fromEntries(roster.map((s) => [s.id, m])));
    setDirty(true);
  };

  const setMark = (studentId: string, m: Mark) => {
    setMarks((prev) => ({ ...prev, [studentId]: m }));
    setDirty(true);
  };

  const handleSubmit = () => {
    const payload = roster.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      mark: (marks[s.id] ?? "present") as AttendanceMark,
    }));
    submitAttendance(className, today, payload, user?.name);
    setDirty(false);
    toast(
      `Register submitted — ${counts.present ?? 0} present, ${counts.absent ?? 0} absent, ${counts.late ?? 0} late`,
      "success",
    );
  };

  return (
    <div>
      <PageHeader
        title="Attendance Tracking"
        subtitle={`Mark today's register — ${todayLabel()}.`}
        actions={
          <>
            <Select options={CLASS_OPTIONS} value={classOption} onChange={setClassOption} />
            <Button icon={<TickDouble01Icon size={18} />} onClick={() => setAll("present")}>
              Mark all present
            </Button>
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
          title={`${className} register`}
          subtitle={`${roster.length} students · period 1 (7:30 – 8:50)`}
          action={dirty ? <Badge tone="brand" dot>Unsaved changes</Badge> : <Badge tone="success" dot>Saved</Badge>}
        />
        <div className="divide-y divide-gray-100">
          {roster.map((s) => {
            const mark = marks[s.id] ?? "present";
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
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
                      type="button"
                      onClick={() => setMark(s.id, m)}
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
          {roster.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-500">No students found for {className}.</p>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
          <Button variant="secondary" onClick={() => toast("Attendance draft saved", "info")}>
            Save draft
          </Button>
          <Button onClick={handleSubmit} disabled={roster.length === 0}>
            Submit register
          </Button>
        </div>
      </Card>
    </div>
  );
}
