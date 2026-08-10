import { useMemo } from "react";
import { CheckmarkCircle02Icon, CancelCircleIcon, Clock01Icon } from "hugeicons-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, Button, StatCard, Select } from "../../components/ui";
import { formatDate } from "../../lib/utils";
import { useAppStore } from "../../store/AppStore";
import { useParentChildren } from "../../hooks/usePortalIdentity";
import { useToast } from "../../components/Toast";
import type { AttendanceMark } from "../../store/domain";

const markLabel: Record<AttendanceMark, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

const markTone = (mark: AttendanceMark) => {
  if (mark === "present") return "success";
  if (mark === "late") return "warning";
  if (mark === "excused") return "blue";
  return "error";
};

export default function ParentAttendance() {
  const { toast } = useToast();
  const { children, setSelectedId, selectedChild } = useParentChildren();
  const { attendance, excuseAbsence } = useAppStore();

  const childRecords = useMemo(() => {
    if (!selectedChild) return [];
    return attendance
      .filter((a) => a.studentId === selectedChild.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance, selectedChild]);

  const stats = useMemo(() => {
    if (!childRecords.length && selectedChild) {
      return {
        termPct: selectedChild.attendance,
        absent: 0,
        late: 0,
        excused: 0,
      };
    }
    const presentish = childRecords.filter((r) => r.mark === "present" || r.mark === "late" || r.mark === "excused").length;
    return {
      termPct: childRecords.length ? Math.round((presentish / childRecords.length) * 100) : selectedChild?.attendance ?? 0,
      absent: childRecords.filter((r) => r.mark === "absent").length,
      late: childRecords.filter((r) => r.mark === "late").length,
      excused: childRecords.filter((r) => r.mark === "excused").length,
    };
  }, [childRecords, selectedChild]);

  const weeklyTrend = useMemo(() => {
    const weeks = new Map<string, { week: string; rate: number; total: number; present: number }>();
    for (const r of childRecords) {
      const d = new Date(r.date);
      const weekNum = Math.ceil(d.getDate() / 7);
      const key = `Wk ${weekNum}`;
      const w = weeks.get(key) ?? { week: key, rate: 0, total: 0, present: 0 };
      w.total += 1;
      if (r.mark !== "absent") w.present += 1;
      weeks.set(key, w);
    }
    return Array.from(weeks.values()).map((w) => ({
      week: w.week,
      rate: w.total ? Math.round((w.present / w.total) * 100) : 0,
    }));
  }, [childRecords]);

  const childOptions = children.map((c) => c.name);

  return (
    <div>
      <PageHeader
        title={selectedChild ? `Attendance Monitoring — ${selectedChild.name.split(" ")[0]}` : "Attendance Monitoring"}
        subtitle="Daily records, alerts and excuse submission."
        actions={
          children.length > 0 ? (
            <Select
              options={childOptions}
              value={selectedChild?.name ?? childOptions[0]}
              onChange={(v) => setSelectedId(children.find((c) => c.name === v)?.id ?? "all")}
            />
          ) : undefined
        }
      />

      {children.length === 0 ? (
        <Card className="p-6 text-sm text-gray-600">No students linked to this parent account.</Card>
      ) : selectedChild ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Term attendance" value={`${stats.termPct}%`} delta={childRecords.length ? "from daily records" : "term summary"} deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
            <StatCard label="Days absent" value={String(stats.absent)} delta={`${stats.excused} excused`} deltaLabel="" icon={<CancelCircleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
            <StatCard label="Times late" value={String(stats.late)} delta="this term" deltaLabel="" icon={<Clock01Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
            <StatCard label="Absence alerts" value="On" delta="SMS + in-app" deltaLabel="enabled" iconBg="bg-blue-50 text-blue-600" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader title="Weekly trend" subtitle="Attendance rate across Term 3" />
              {weeklyTrend.length > 0 ? (
                <div className="h-64 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                      <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#12B76A" strokeWidth={2.5} dot={{ fill: "#12B76A", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="px-5 pb-5 text-sm text-gray-500">No daily records yet — term attendance is {selectedChild.attendance}%.</p>
              )}
            </Card>

            <Card>
              <CardHeader title="About excuses" subtitle="Mark absences as excused" />
              <div className="space-y-3 p-5 text-sm text-gray-600">
                <p>When your child is absent, use the <strong>Excuse</strong> button on the daily record below to notify the class teacher.</p>
                <p className="text-xs text-gray-400">Excused absences count toward the term attendance percentage.</p>
              </div>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader title="Recent daily record" subtitle={childRecords.length ? "Latest school days" : "No daily logs yet"} />
            {childRecords.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-gray-500">
                Daily attendance will appear here once teachers submit marks. Term summary: {selectedChild.attendance}%.
              </p>
            ) : (
              <div className="divide-y divide-gray-100 px-5">
                {childRecords.slice(0, 10).map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center gap-3 py-3.5">
                    <span className="w-36 text-sm font-semibold text-gray-900">{formatDate(r.date)}</span>
                    <Badge tone={markTone(r.mark)} dot>{markLabel[r.mark]}</Badge>
                    {r.mark === "absent" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          excuseAbsence(r.id);
                          toast(`Absence on ${formatDate(r.date)} marked as excused`);
                        }}
                      >
                        Excuse
                      </Button>
                    )}
                    {r.mark === "excused" && <span className="text-sm text-gray-500">Excused by parent</span>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}
