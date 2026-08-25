import { useMemo, useState } from "react";
import { FileExportIcon, SentIcon, AlertCircleIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { useToast } from "../../components/Toast";
import { computeGrade } from "../../store/domain";
import { LABEL_SEP } from "../../lib/display";

const CLASS_OPTIONS = ["JHS 2A · Term 3", "JHS 2B · Term 3", "JHS 3A · Term 3"];
const SUBJECT = "Mathematics";

function parseClass(option: string) {
  return option.split(LABEL_SEP)[0]?.trim() ?? option;
}

export default function TeacherGradebook() {
  const { toast } = useToast();
  const { students, grades, upsertGrade, submitGradesForClass } = useAppStore();
  const [classOption, setClassOption] = useState(CLASS_OPTIONS[0]);
  const className = parseClass(classOption);

  const roster = useMemo(
    () => students.filter((s) => s.class === className).sort((a, b) => a.name.localeCompare(b.name)),
    [students, className],
  );

  const rows = useMemo(() => {
    return roster.map((s) => {
      const g = grades.find((gr) => gr.studentId === s.id && gr.subject === SUBJECT && gr.className === className);
      const test1 = g?.test1 ?? 0;
      const test2 = g?.test2 ?? 0;
      const exam = g?.exam ?? 0;
      const { total, grade } = computeGrade(test1, test2, exam);
      return { student: s, test1, test2, exam, total, grade, status: g?.status ?? "Draft" };
    });
  }, [roster, grades, className]);

  const failing = rows.filter((r) => r.total < 50).length;
  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.total, 0) / rows.length) : 0;
  const highest = rows.reduce((best, r) => (r.total > best.total ? r : best), rows[0] ?? { total: 0, student: { name: "None" } });
  const entered = rows.filter((r) => r.test1 > 0 || r.test2 > 0 || r.exam > 0).length;
  const allSubmitted = rows.every((r) => {
    const g = grades.find((gr) => gr.studentId === r.student.id && gr.subject === SUBJECT);
    return g?.status === "Submitted" || g?.status === "Approved";
  });

  const handleScoreChange = (studentId: string, field: "test1" | "test2" | "exam", raw: string) => {
    const val = Math.max(0, Math.min(field === "exam" ? 60 : 20, parseInt(raw, 10) || 0));
    const row = rows.find((r) => r.student.id === studentId);
    if (!row) return;
    const scores = {
      test1: field === "test1" ? val : row.test1,
      test2: field === "test2" ? val : row.test2,
      exam: field === "exam" ? val : row.exam,
    };
    upsertGrade(studentId, SUBJECT, className, scores);
  };

  const handleSubmit = () => {
    submitGradesForClass(className, SUBJECT);
    toast(`Grades for ${className} · ${SUBJECT} submitted for approval`, "success");
  };

  return (
    <div>
      <PageHeader
        title="Gradebook & Assessments"
        subtitle={`${SUBJECT} · record scores and submit grades for approval.`}
        actions={
          <>
            <Select options={CLASS_OPTIONS} value={classOption} onChange={setClassOption} />
            <Button variant="secondary" icon={<FileExportIcon size={18} />} onClick={() => toast("Exporting gradebook to CSV…", "info")}>
              Export
            </Button>
            <Button icon={<SentIcon size={18} />} onClick={handleSubmit}>
              Submit for approval
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Class average" value={`${avg}%`} delta={`${rows.length} students`} deltaLabel="" />
        <StatCard label="Highest score" value={`${highest?.total ?? 0}%`} delta={highest?.student?.name ?? "None"} deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Failing (<50%)" value={String(failing)} delta="flagged for support" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Grades entered" value={`${entered}/${rows.length}`} delta={`${rows.length - entered} remaining`} deltaLabel="" positive={entered === rows.length} iconBg="bg-warning-50 text-warning-600" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title={`Term 3 · ${SUBJECT} (${className})`}
          subtitle="Weighting: Test 1 (20%) · Test 2 (20%) · Exam (60%)"
          action={
            <Badge tone={allSubmitted ? "success" : "warning"} dot>
              {allSubmitted ? "Submitted" : "Draft · not submitted"}
            </Badge>
          }
        />
        <Table>
          <THead cols={["Student", "Test 1 /20", "Test 2 /20", "Exam /60", "Total", "Grade", "Flag"]} />
          <tbody>
            {rows.map((r) => (
              <TRow key={r.student.id}>
                <TCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={r.student.name} color={r.student.avatarColor} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">{r.student.name}</p>
                      <p className="text-xs text-gray-400">{r.student.id}</p>
                    </div>
                  </div>
                </TCell>
                {(["test1", "test2", "exam"] as const).map((field) => (
                  <TCell key={field}>
                    <input
                      type="number"
                      min={0}
                      max={field === "exam" ? 60 : 20}
                      value={r[field]}
                      onChange={(e) => handleScoreChange(r.student.id, field, e.target.value)}
                      className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm font-medium shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                    />
                  </TCell>
                ))}
                <TCell className="text-base font-bold text-gray-900">{r.total}%</TCell>
                <TCell>
                  <Badge tone={r.grade.startsWith("A") ? "success" : r.grade.startsWith("B") ? "blue" : r.grade === "C" ? "warning" : "error"}>
                    {r.grade}
                  </Badge>
                </TCell>
                <TCell>
                  {r.total < 50 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-error-600">
                      <AlertCircleIcon size={14} /> Failing
                    </span>
                  ) : r.total < 60 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-warning-600">
                      <AlertCircleIcon size={14} /> Borderline
                    </span>
                  ) : (
                    <Badge tone={statusTone("good")} className="opacity-0">
                      ok
                    </Badge>
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
