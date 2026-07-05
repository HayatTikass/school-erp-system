import { Pdf01Icon } from "hugeicons-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { PageHeader, Card, CardHeader, Badge, Button, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { grades, gpaTrend } from "../../data/mock";

const radar = [
  { subject: "Maths", score: 86 },
  { subject: "English", score: 78 },
  { subject: "Science", score: 80 },
  { subject: "Social St.", score: 70 },
  { subject: "ICT", score: 92 },
  { subject: "RME", score: 65 },
];

export default function ParentProgress() {
  return (
    <div>
      <PageHeader
        title="Academic Progress — Abena"
        subtitle="Grades, GPA trend and teacher remarks per term."
        actions={
          <>
            <Select options={["Term 3 · 2025/26", "Term 2 · 2025/26", "Term 1 · 2025/26"]} />
            <Button variant="secondary" icon={<Pdf01Icon size={18} />}>Report card PDF</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Term GPA" value="3.8" delta="0.2 vs Term 2" deltaLabel="" />
        <StatCard label="Class rank" value="2nd of 34" delta="up 1 place" deltaLabel="" iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Strongest subject" value="ICT" delta="92%" deltaLabel="class best" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Focus area" value="RME" delta="65%" deltaLabel="needs support" positive={false} iconBg="bg-error-50 text-error-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="GPA over time" subtitle="Six-term trend" action={<Badge tone="success" dot>Improving</Badge>} />
          <div className="h-60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="term" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis domain={[2.5, 4]} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Line type="monotone" dataKey="gpa" stroke="#7F56D9" strokeWidth={2.5} dot={{ fill: "#7F56D9", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Subject balance" subtitle="Term 3 scores by subject" />
          <div className="h-60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="75%">
                <PolarGrid stroke="#EAECF0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#667085" }} />
                <Radar dataKey="score" stroke="#7F56D9" fill="#7F56D9" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Term 3 results in detail" subtitle="With teacher remarks" />
        <Table>
          <THead cols={["Subject", "CA /40", "Exam /60", "Total", "Grade", "Teacher remark"]} />
          <tbody>
            {grades.map((g) => (
              <TRow key={g.subject}>
                <TCell className="font-semibold text-gray-900">{g.subject}</TCell>
                <TCell>{g.test1 + g.test2}</TCell>
                <TCell>{g.exam}</TCell>
                <TCell className="font-bold text-gray-900">{g.total}%</TCell>
                <TCell>
                  <Badge tone={g.grade.startsWith("A") ? "success" : g.grade.startsWith("B") ? "blue" : "warning"}>{g.grade}</Badge>
                </TCell>
                <TCell>{g.remark}</TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
