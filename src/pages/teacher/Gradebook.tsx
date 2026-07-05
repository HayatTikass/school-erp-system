import { FileExportIcon, SentIcon, AlertCircleIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { students } from "../../data/mock";

const scores = [88, 72, 91, 45, 78, 64, 83, 39, 95, 70, 76, 58];

function gradeOf(total: number) {
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 75) return "A-";
  if (total >= 70) return "B+";
  if (total >= 65) return "B";
  if (total >= 60) return "B-";
  if (total >= 50) return "C";
  return "F";
}

export default function TeacherGradebook() {
  const rows = students.map((s, i) => {
    const total = scores[i % scores.length];
    const t1 = Math.round(total * 0.2);
    const t2 = Math.round(total * 0.22);
    return { ...s, t1, t2, exam: total - t1 - t2, total, grade: gradeOf(total) };
  });
  const failing = rows.filter((r) => r.total < 50).length;
  const avg = Math.round(rows.reduce((a, r) => a + r.total, 0) / rows.length);

  return (
    <div>
      <PageHeader
        title="Gradebook & Assessments"
        subtitle="Mathematics — record scores and submit grades for approval."
        actions={
          <>
            <Select options={["JHS 2A — Term 3", "JHS 2B — Term 3", "JHS 3A — Term 3"]} />
            <Button variant="secondary" icon={<FileExportIcon size={18} />}>Export</Button>
            <Button icon={<SentIcon size={18} />}>Submit for approval</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Class average" value={`${avg}%`} delta="2.3%" />
        <StatCard label="Highest score" value="95%" delta="Esi Amoah" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Failing (<50%)" value={String(failing)} delta="flagged for support" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Grades entered" value="12/34" delta="22 remaining" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Term 3 — Mathematics (JHS 2A)"
          subtitle="Weighting: Test 1 (20%) · Test 2 (20%) · Exam (60%)"
          action={<Badge tone="warning" dot>Draft — not submitted</Badge>}
        />
        <Table>
          <THead cols={["Student", "Test 1 /20", "Test 2 /20", "Exam /60", "Total", "Grade", "Flag"]} />
          <tbody>
            {rows.map((r, i) => (
              <TRow key={r.id + i}>
                <TCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} color={r.avatarColor} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.id}</p>
                    </div>
                  </div>
                </TCell>
                {[r.t1, r.t2, r.exam].map((v, j) => (
                  <TCell key={j}>
                    <input
                      defaultValue={v}
                      className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm font-medium shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                    />
                  </TCell>
                ))}
                <TCell className="text-base font-bold text-gray-900">{r.total}%</TCell>
                <TCell>
                  <Badge tone={r.grade.startsWith("A") ? "success" : r.grade.startsWith("B") ? "blue" : r.grade === "C" ? "warning" : "error"}>{r.grade}</Badge>
                </TCell>
                <TCell>
                  {r.total < 50 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-error-600"><AlertCircleIcon size={14} /> Failing</span>
                  ) : r.total < 60 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-warning-600"><AlertCircleIcon size={14} /> Borderline</span>
                  ) : (
                    <Badge tone={statusTone("good")} className="opacity-0">ok</Badge>
                  )}
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
