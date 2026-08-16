import { useMemo, useState } from "react";
import { Pdf01Icon, Award01Icon } from "hugeicons-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, Button, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { gpaTrend } from "../../data/mock";
import { useAppStore } from "../../store/AppStore";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";
import { useToast } from "../../components/Toast";

const TERMS = ["Term 3 · 2025/26", "Term 2 · 2025/26", "Term 1 · 2025/26"];

export default function StudentResults() {
  const student = useCurrentStudent();
  const { grades } = useAppStore();
  const { toast } = useToast();
  const [term, setTerm] = useState(TERMS[0]);
  const isCurrentTerm = term === TERMS[0];

  const myGrades = useMemo(
    () => (student ? grades.filter((g) => g.studentId === student.id && g.status === "Approved") : []),
    [grades, student],
  );

  const avgScore = myGrades.length ? (myGrades.reduce((a, g) => a + g.total, 0) / myGrades.length).toFixed(1) : "—";
  const best = myGrades.length ? [...myGrades].sort((a, b) => b.total - a.total)[0] : null;
  const weakest = myGrades.length ? [...myGrades].sort((a, b) => a.total - b.total)[0] : null;

  if (!student) {
    return (
      <div>
        <PageHeader title="My Academic Results" subtitle="Grades, GPA and report cards." />
        <Card className="p-6 text-sm text-gray-600">No student profile linked to this account.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Academic Results"
        subtitle={`Grades, GPA and report cards — ${student.name}, ${student.class}.`}
        actions={
          <>
            <Select options={TERMS} value={term} onChange={setTerm} />
            <Button
              variant="secondary"
              icon={<Pdf01Icon size={18} />}
              onClick={() => toast(`Downloading ${term} report card (demo)…`, "info")}
            >
              Download report card
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Term GPA" value={student.gpa.toFixed(1)} delta="this term" />
        <StatCard label="Class" value={student.class} delta={student.id} deltaLabel="" icon={<Award01Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Strongest subject" value={best?.subject ?? "—"} delta={best ? `${best.total}%` : ""} deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Average score" value={avgScore !== "—" ? `${avgScore}%` : "—"} delta={weakest ? `focus: ${weakest.subject}` : ""} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title={`${term.split(" · ")[0]} results`}
            subtitle="Continuous assessment (40%) + exam (60%)"
            action={
              <Badge tone={isCurrentTerm ? "success" : "gray"} dot>
                {isCurrentTerm ? "Published" : "Archived"}
              </Badge>
            }
          />
          {!isCurrentTerm ? (
            <p className="px-5 pb-5 text-sm text-gray-500">
              {term} results are archived. Request a copy from the school office.
            </p>
          ) : myGrades.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-gray-500">No published grades yet for your class.</p>
          ) : (
            <Table>
              <THead cols={["Subject", "Test 1 /20", "Test 2 /20", "Exam /60", "Total", "Grade", "Remark"]} />
              <tbody>
                {myGrades.map((g) => (
                  <TRow key={g.id}>
                    <TCell className="font-semibold text-gray-900">{g.subject}</TCell>
                    <TCell>{g.test1}</TCell>
                    <TCell>{g.test2}</TCell>
                    <TCell>{g.exam}</TCell>
                    <TCell className="text-base font-bold text-gray-900">{g.total}%</TCell>
                    <TCell>
                      <Badge tone={g.grade.startsWith("A") ? "success" : g.grade.startsWith("B") ? "blue" : "warning"}>{g.grade}</Badge>
                    </TCell>
                    <TCell>{g.remark}</TCell>
                  </TRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="GPA trend" subtitle="Last six terms" />
            <div className="h-48 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpaTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                  <XAxis dataKey="term" tick={{ fontSize: 11, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[2.5, 4]} tick={{ fontSize: 11, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                  <Line type="monotone" dataKey="gpa" stroke="#7F56D9" strokeWidth={2.5} dot={{ fill: "#7F56D9", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Report card archive" />
            <div className="divide-y divide-gray-100 px-5">
              {["Term 2 · 2025/26", "Term 1 · 2025/26", "Term 3 · 2024/25"].map((t) => (
                <div key={t} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t}</p>
                    <p className="text-xs text-gray-400">Result slip · PDF</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Pdf01Icon size={16} />}
                    onClick={() => toast(`Downloading ${t} report (demo)…`, "info")}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
