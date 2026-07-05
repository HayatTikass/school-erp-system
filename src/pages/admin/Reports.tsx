import { FileExportIcon, Pdf01Icon, Xls01Icon } from "hugeicons-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from "recharts";
import { PageHeader, Card, CardHeader, Badge, Button, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { gpaTrend, auditLog, enrollmentByClass } from "../../data/mock";

const subjectPerformance = [
  { subject: "Maths", avg: 74 },
  { subject: "English", avg: 71 },
  { subject: "Science", avg: 68 },
  { subject: "Social St.", avg: 77 },
  { subject: "ICT", avg: 82 },
  { subject: "RME", avg: 73 },
];

const reportLibrary = [
  { name: "Term 3 academic performance — all classes", type: "Academic", updated: "Today" },
  { name: "Fee collection & arrears summary", type: "Finance", updated: "Yesterday" },
  { name: "Attendance trends by class (Term 3)", type: "Attendance", updated: "2 days ago" },
  { name: "Enrolment & headcount statistics", type: "Enrolment", updated: "1 week ago" },
  { name: "Staff payroll audit (Jan – Jun)", type: "Finance", updated: "2 weeks ago" },
];

export default function AdminReports() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Academic, financial and operational insight across the school."
        actions={
          <>
            <Select options={["Term 3 · 2025/26", "Term 2 · 2025/26", "Term 1 · 2025/26"]} />
            <Button icon={<FileExportIcon size={18} />}>Export dashboard</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="School average score" value="74.2%" delta="2.8%" />
        <StatCard label="Pass rate (≥50%)" value="91.6%" delta="1.4%" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Avg. GPA" value="3.36" delta="0.12" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Students at risk" value="14" delta="down from 19" deltaLabel="last term" iconBg="bg-warning-50 text-warning-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Average score by subject" subtitle="Term 3 continuous assessment + exams" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Bar dataKey="avg" name="Average %" fill="#7F56D9" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="School GPA trend" subtitle="Six-term trajectory" action={<Badge tone="success" dot>Improving</Badge>} />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="term" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis domain={[2.5, 4]} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Line type="monotone" dataKey="gpa" name="GPA" stroke="#12B76A" strokeWidth={2.5} dot={{ fill: "#12B76A", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Report library" subtitle="Generate and download standard reports" />
          <Table>
            <THead cols={["Report", "Category", "Last updated", "Download"]} />
            <tbody>
              {reportLibrary.map((r) => (
                <TRow key={r.name}>
                  <TCell className="font-semibold text-gray-900">{r.name}</TCell>
                  <TCell><Badge tone="gray">{r.type}</Badge></TCell>
                  <TCell>{r.updated}</TCell>
                  <TCell>
                    <div className="flex gap-1.5">
                      <button className="rounded-lg p-2 text-error-600 hover:bg-error-50" title="PDF"><Pdf01Icon size={18} /></button>
                      <button className="rounded-lg p-2 text-success-600 hover:bg-success-50" title="Excel"><Xls01Icon size={18} /></button>
                    </div>
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Headcount" subtitle="By level" />
            <div className="h-48 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentByClass} layout="vertical" margin={{ top: 0, right: 16, left: -14, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar dataKey="boys" name="Boys" stackId="a" fill="#7F56D9" barSize={18} radius={[4, 0, 0, 4]} />
                  <Bar dataKey="girls" name="Girls" stackId="a" fill="#D6BBFB" barSize={18} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Audit log" />
            <div className="divide-y divide-gray-100 px-5">
              {auditLog.slice(0, 3).map((log) => (
                <div key={log.id} className="py-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{log.actor}</span> — {log.action}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{log.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
