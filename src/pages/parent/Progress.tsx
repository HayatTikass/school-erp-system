import { useMemo } from "react";
import { Pdf01Icon } from "hugeicons-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { PageHeader, Card, CardHeader, Badge, Button, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { gpaTrend } from "../../data/mock";
import { useAppStore } from "../../store/AppStore";
import { useParentChildren } from "../../hooks/usePortalIdentity";
import { useToast } from "../../components/Toast";

export default function ParentProgress() {
  const { children, setSelectedId, selectedChild } = useParentChildren();
  const { grades } = useAppStore();
  const { toast } = useToast();

  const childGrades = useMemo(
    () => (selectedChild ? grades.filter((g) => g.studentId === selectedChild.id && g.status === "Approved") : []),
    [grades, selectedChild],
  );

  const avgScore = childGrades.length ? childGrades.reduce((a, g) => a + g.total, 0) / childGrades.length : 0;
  const best = childGrades.length ? [...childGrades].sort((a, b) => b.total - a.total)[0] : null;
  const weakest = childGrades.length ? [...childGrades].sort((a, b) => a.total - b.total)[0] : null;

  const radar = childGrades.map((g) => ({
    subject: g.subject.split(" ")[0].slice(0, 10),
    score: g.total,
  }));

  const childOptions = children.map((c) => c.name);

  return (
    <div>
      <PageHeader
        title={selectedChild ? `Academic Progress · ${selectedChild.name.split(" ")[0]}` : "Academic Progress"}
        subtitle="Grades, GPA trend and teacher remarks per term."
        actions={
          children.length > 0 ? (
            <>
              <Select
                options={childOptions}
                value={selectedChild?.name ?? childOptions[0]}
                onChange={(v) => setSelectedId(children.find((c) => c.name === v)?.id ?? "all")}
              />
              <Button variant="secondary" icon={<Pdf01Icon size={18} />} onClick={() => toast("Downloading report card (demo)…", "info")}>
                Report card PDF
              </Button>
            </>
          ) : undefined
        }
      />

      {children.length === 0 ? (
        <Card className="p-6 text-sm text-gray-600">No students linked to this parent account.</Card>
      ) : selectedChild ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Term GPA" value={selectedChild.gpa.toFixed(1)} delta="this term" deltaLabel="" />
            <StatCard label="Class" value={selectedChild.class} delta={selectedChild.id} deltaLabel="" iconBg="bg-warning-50 text-warning-600" />
            <StatCard label="Strongest subject" value={best?.subject ?? "None"} delta={best ? `${best.total}%` : ""} deltaLabel="" iconBg="bg-success-50 text-success-600" />
            <StatCard label="Focus area" value={weakest?.subject ?? "None"} delta={weakest ? `${weakest.total}%` : ""} deltaLabel="needs support" positive={false} iconBg="bg-error-50 text-error-600" />
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
              {radar.length > 0 ? (
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
              ) : (
                <p className="px-5 pb-5 text-sm text-gray-500">No published grades yet.</p>
              )}
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader title="Term 3 results in detail" subtitle={`Average: ${avgScore ? avgScore.toFixed(1) : "None"}%`} />
            {childGrades.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-gray-500">Grades will appear here once approved by the school.</p>
            ) : (
              <Table>
                <THead cols={["Subject", "CA /40", "Exam /60", "Total", "Grade", "Teacher remark"]} />
                <tbody>
                  {childGrades.map((g) => (
                    <TRow key={g.id}>
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
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}
