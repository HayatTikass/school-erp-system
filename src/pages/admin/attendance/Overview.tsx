import { useMemo } from "react";
import { FileExportIcon, Alert01Icon } from "hugeicons-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, StatCard, Progress, attendanceTone } from "../../../components/ui";
import { attendanceTrend } from "../../../data/mock";
import { formatDate } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

export default function AttendanceOverview() {
  const { students, classes, attendance, getParentForStudent } = useAppStore();
  const { toast } = useToast();

  const atRisk = students.filter((s) => s.attendance < 80);

  const latestDate = attendance.length > 0
    ? attendance.reduce((max, a) => (a.date > max ? a.date : max), attendance[0].date)
    : null;

  const todayRecords = latestDate ? attendance.filter((a) => a.date === latestDate) : [];
  const presentToday = todayRecords.filter((a) => a.mark === "present" || a.mark === "late" || a.mark === "excused").length;
  const attendanceTodayPct = todayRecords.length > 0 ? Math.round((presentToday / todayRecords.length) * 100) : null;

  const classRates = useMemo(() => {
    if (!latestDate) return classes.map((c) => ({ name: c.name, rate: 0 }));
    return classes.map((c) => {
      const records = todayRecords.filter((a) => a.className === c.name);
      if (!records.length) return { name: c.name, rate: 0 };
      const present = records.filter((a) => a.mark === "present" || a.mark === "late" || a.mark === "excused").length;
      return { name: c.name, rate: Math.round((present / records.length) * 100) };
    });
  }, [classes, todayRecords, latestDate]);

  const notifyParent = (studentId: string, studentName: string) => {
    const parent = getParentForStudent(studentId);
    if (parent) {
      toast(`Absence alert sent to ${parent.name} (${parent.phone})`);
    } else {
      toast(`No parent linked for ${studentName} · notification queued`, "warning");
    }
  };

  return (
    <div>
      <PageHeader
        title="Attendance Overview"
        subtitle="School-wide attendance overview and absenteeism flags."
        actions={
          <Button variant="secondary" icon={<FileExportIcon size={18} />} onClick={() => toast("Attendance report exported (demo).", "info")}>
            Export report
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Attendance today"
          value={attendanceTodayPct !== null ? `${attendanceTodayPct}%` : "None"}
          delta={todayRecords.length > 0 ? `${presentToday} / ${todayRecords.length} present` : "No records yet"}
          deltaLabel=""
        />
        <StatCard label="Term average" value="92.8%" delta="0.6%" deltaLabel="vs last term" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Chronic absentees" value={String(atRisk.length)} delta="needs review" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Attendance trend" subtitle="Term 3, weekly average (%)" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Line type="monotone" dataKey="rate" name="Attendance" stroke="#7F56D9" strokeWidth={2.5} dot={{ fill: "#7F56D9", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title={latestDate ? `By class · ${formatDate(latestDate)}` : "By class today"} />
          <div className="space-y-4 p-5">
            {classRates.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{c.name}</span>
                  <span className="font-semibold text-gray-900">{c.rate > 0 ? `${c.rate}%` : "None"}</span>
                </div>
                <Progress value={c.rate || 0} tone={attendanceTone(c.rate || 0)} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {todayRecords.length > 0 && (
        <Card className="mt-6">
          <CardHeader title="Recent attendance" subtitle={`${todayRecords.length} records for ${formatDate(latestDate!)}`} />
          <Table>
            <THead cols={["Student", "Class", "Mark", "Submitted by"]} />
            <tbody>
              {todayRecords.slice(0, 20).map((a) => (
                <TRow key={a.id}>
                  <TCell className="font-semibold text-gray-900">{a.studentName}</TCell>
                  <TCell>{a.className}</TCell>
                  <TCell><Badge tone={statusTone(a.mark)}>{a.mark}</Badge></TCell>
                  <TCell>{a.submittedBy || "None"}</TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader
          title="Flagged: chronic absenteeism"
          subtitle="Students below 80% attendance"
          action={<Badge tone="error" dot>Auto-flagged</Badge>}
        />
        <Table>
          <THead cols={["Student", "Class", "Attendance", "Action"]} />
          <tbody>
            {atRisk.map((s) => (
              <TRow key={s.id}>
                <TCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} color={s.avatarColor} size="sm" />
                    <span className="font-semibold text-gray-900">{s.name}</span>
                  </div>
                </TCell>
                <TCell>{s.class}</TCell>
                <TCell>
                  <div className="flex w-32 items-center gap-2">
                    <Progress value={s.attendance} tone={attendanceTone(s.attendance)} className="flex-1" />
                    <span className="text-xs font-semibold">{s.attendance}%</span>
                  </div>
                </TCell>
                <TCell>
                  <Button variant="secondary" size="sm" icon={<Alert01Icon size={16} />} onClick={() => notifyParent(s.id, s.name)}>
                    Notify parent
                  </Button>
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
