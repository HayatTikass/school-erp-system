import { useMemo } from "react";
import { CheckmarkCircle02Icon, CancelCircleIcon, Clock01Icon } from "hugeicons-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, StatCard, Progress, attendanceTone } from "../../components/ui";
import { cn, formatDate } from "../../lib/utils";
import { useAppStore } from "../../store/AppStore";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";
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

export default function StudentAttendance() {
  const student = useCurrentStudent();
  const { attendance, subjects } = useAppStore();

  const myRecords = useMemo(
    () => (student ? attendance.filter((a) => a.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date)) : []),
    [attendance, student],
  );

  const stats = useMemo(() => {
    if (!myRecords.length) {
      return {
        termPct: student?.attendance ?? 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
      };
    }
    const presentish = myRecords.filter((r) => r.mark === "present" || r.mark === "late" || r.mark === "excused").length;
    return {
      termPct: Math.round((presentish / myRecords.length) * 100),
      present: myRecords.filter((r) => r.mark === "present").length,
      absent: myRecords.filter((r) => r.mark === "absent").length,
      late: myRecords.filter((r) => r.mark === "late").length,
      excused: myRecords.filter((r) => r.mark === "excused").length,
    };
  }, [myRecords, student]);

  const monthly = useMemo(() => {
    const buckets = new Map<string, { month: string; present: number; absent: number }>();
    for (const r of myRecords) {
      const month = new Date(r.date).toLocaleString("en", { month: "short" });
      const b = buckets.get(month) ?? { month, present: 0, absent: 0 };
      if (r.mark === "absent") b.absent += 1;
      else b.present += 1;
      buckets.set(month, b);
    }
    return Array.from(buckets.values());
  }, [myRecords]);

  const recent = myRecords.slice(0, 6);

  if (!student) {
    return (
      <div>
        <PageHeader title="My Attendance" subtitle="Term attendance record." />
        <Card className="p-6 text-sm text-gray-600">No student profile linked to this account.</Card>
      </div>
    );
  }

  const displayPct = myRecords.length ? stats.termPct : student.attendance;

  return (
    <div>
      <PageHeader title="My Attendance" subtitle={`Term 3 attendance · ${student.name}, ${student.class}.`} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Term attendance" value={`${displayPct}%`} delta={myRecords.length ? "from daily records" : "from term summary"} deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Days present" value={String(stats.present)} delta={myRecords.length ? `${myRecords.length} days logged` : "no daily logs yet"} deltaLabel="" />
        <StatCard label="Days absent" value={String(stats.absent)} delta={`${stats.excused} excused`} deltaLabel="" icon={<CancelCircleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Times late" value={String(stats.late)} delta="this term" deltaLabel="" icon={<Clock01Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
      </div>

      {myRecords.length === 0 ? (
        <Card className="mt-6 p-6">
          <p className="text-sm font-semibold text-gray-900">No daily attendance records yet</p>
          <p className="mt-1 text-sm text-gray-600">
            Your class teacher will publish daily marks here once attendance is submitted. Your term attendance is currently{" "}
            <span className="font-semibold text-brand-700">{student.attendance}%</span> based on the school summary.
          </p>
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Monthly overview" subtitle="Days present vs absent" />
            {monthly.length > 0 ? (
              <div className="h-64 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                    <Bar dataKey="present" name="Present" stackId="a" fill="#12B76A" radius={[0, 0, 0, 0]} barSize={28} />
                    <Bar dataKey="absent" name="Absent" stackId="a" fill="#F04438" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="px-5 pb-5 text-sm text-gray-500">Not enough data for a chart yet.</p>
            )}
          </Card>

          <Card>
            <CardHeader title="Recent days" />
            <div className="divide-y divide-gray-100 px-5">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-gray-700">{formatDate(r.date)}</span>
                  <Badge tone={markTone(r.mark)} dot>{markLabel[r.mark]}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Card className="mt-6">
        <CardHeader title="Attendance by subject" subtitle="Estimated from your term attendance" />
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 p-5 sm:grid-cols-2">
          {subjects.slice(0, 6).map((s) => {
            const jitter = (s.id.charCodeAt(s.id.length - 1) % 5) - 2;
            const rate = Math.max(70, Math.min(100, displayPct + jitter));
            return (
              <div key={s.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{s.name}</span>
                  <span className={cn("font-semibold", rate >= 90 ? "text-success-600" : "text-warning-600")}>{rate}%</span>
                </div>
                <Progress value={rate} tone={attendanceTone(rate)} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
