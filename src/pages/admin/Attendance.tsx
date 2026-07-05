import { FileExportIcon, Alert01Icon } from "hugeicons-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, StatCard, Progress, attendanceTone } from "../../components/ui";
import { attendanceTrend, disciplineCases, students, classes } from "../../data/mock";
import { formatDate } from "../../lib/utils";

export default function AdminAttendance() {
  const atRisk = students.filter((s) => s.attendance < 80);

  return (
    <div>
      <PageHeader
        title="Attendance & Discipline"
        subtitle="School-wide attendance overview, absenteeism flags and discipline cases."
        actions={<Button variant="secondary" icon={<FileExportIcon size={18} />}>Export report</Button>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance today" value="93.5%" delta="172 / 184 present" deltaLabel="" />
        <StatCard label="Term average" value="92.8%" delta="0.6%" deltaLabel="vs last term" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Chronic absentees" value={String(atRisk.length)} delta="needs review" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Open discipline cases" value="3" delta="1 high severity" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
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
          <CardHeader title="By class today" />
          <div className="space-y-4 p-5">
            {classes.map((c, i) => {
              const rate = [96, 91, 94, 88, 95, 92][i];
              return (
                <div key={c.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <span className="font-semibold text-gray-900">{rate}%</span>
                  </div>
                  <Progress value={rate} tone={attendanceTone(rate)} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
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
                  <TCell><Button variant="secondary" size="sm" icon={<Alert01Icon size={16} />}>Notify parent</Button></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Discipline cases" subtitle="Incident log for this term" action={<Button variant="secondary" size="sm">Log incident</Button>} />
          <Table>
            <THead cols={["Case", "Student", "Incident", "Severity", "Status"]} />
            <tbody>
              {disciplineCases.map((d) => (
                <TRow key={d.id}>
                  <TCell className="font-semibold text-gray-900">{d.id}</TCell>
                  <TCell>
                    <p className="font-medium text-gray-900">{d.student}</p>
                    <p className="text-xs text-gray-400">{d.class} · {formatDate(d.date)}</p>
                  </TCell>
                  <TCell>{d.incident}</TCell>
                  <TCell><Badge tone={statusTone(d.severity)}>{d.severity}</Badge></TCell>
                  <TCell><Badge tone={statusTone(d.status)} dot>{d.status}</Badge></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
