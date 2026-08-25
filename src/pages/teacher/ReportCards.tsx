import { useMemo, useState } from "react";
import { SentIcon, EyeIcon, Pdf01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { useToast } from "../../components/Toast";
import { ConfirmDialog } from "../../components/Modal";

const CLASS_NAME = "JHS 2A";
const TERM_OPTIONS = ["Term 3 · 2025/26", "Term 2 · 2025/26", "Term 1 · 2025/26"];

function defaultRemark(gpa: number) {
  if (gpa >= 3.5) return "An excellent term. Keep up the consistency.";
  if (gpa >= 3) return "Good progress; aim higher in exams.";
  return "Capable of much more with better focus.";
}

export default function TeacherReportCards() {
  const { toast } = useToast();
  const { students, grades, submitGradesForClass } = useAppStore();
  const [term, setTerm] = useState(TERM_OPTIONS[0]);
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const roster = useMemo(
    () => students.filter((s) => s.class === CLASS_NAME).sort((a, b) => b.gpa - a.gpa),
    [students],
  );

  const subjects = useMemo(() => {
    const set = new Set(grades.filter((g) => g.className === CLASS_NAME).map((g) => g.subject));
    return Array.from(set);
  }, [grades]);

  const getRemark = (studentId: string, gpa: number) => {
    if (remarks[studentId] !== undefined) return remarks[studentId];
    const gradeRemark = grades.find((g) => g.studentId === studentId)?.remark;
    return gradeRemark || defaultRemark(gpa);
  };

  const getStatus = (studentId: string) => {
    const studentGrades = grades.filter((g) => g.studentId === studentId && g.className === CLASS_NAME);
    if (!studentGrades.length) return "Draft";
    const remark = getRemark(studentId, roster.find((s) => s.id === studentId)?.gpa ?? 0);
    if (!remark.trim()) return "Comments pending";
    if (studentGrades.every((g) => g.status === "Submitted" || g.status === "Approved")) return "Ready";
    return "Draft";
  };

  const readyCount = roster.filter((s) => getStatus(s.id) === "Ready").length;
  const pendingComments = roster.filter((s) => getStatus(s.id) === "Comments pending").length;
  const avgGpa = roster.length ? (roster.reduce((a, s) => a + s.gpa, 0) / roster.length).toFixed(1) : "0.0";
  const submittedCount = roster.filter((s) => {
    const sg = grades.filter((g) => g.studentId === s.id && g.className === CLASS_NAME);
    return sg.length > 0 && sg.every((g) => g.status === "Submitted" || g.status === "Approved");
  }).length;

  const handleBatchSubmit = () => {
    for (const subject of subjects) {
      submitGradesForClass(CLASS_NAME, subject);
    }
    setConfirmOpen(false);
    toast(`Report cards for ${CLASS_NAME} submitted for admin sign-off`, "success");
  };

  return (
    <div>
      <PageHeader
        title="Report Card Generation"
        subtitle={`${CLASS_NAME} · Term 3 · add remarks and submit for admin sign-off.`}
        actions={
          <>
            <Select options={TERM_OPTIONS} value={term} onChange={setTerm} />
            <Button icon={<SentIcon size={18} />} onClick={() => setConfirmOpen(true)}>
              Submit batch for sign-off
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Report cards ready" value={`${readyCount}/${roster.length}`} delta={`${roster.length ? Math.round((readyCount / roster.length) * 100) : 0}%`} deltaLabel="complete" />
        <StatCard label="Comments pending" value={String(pendingComments)} delta="add teacher remarks" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Class average GPA" value={avgGpa} delta="this term" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Awaiting admin sign-off" value={String(submittedCount)} delta="submitted to admin" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title={`Term 3 report cards · ${CLASS_NAME}`}
          subtitle="Preview each slip before submitting"
          action={<Badge tone="warning" dot>Batch in draft</Badge>}
        />
        <Table>
          <THead cols={["Student", "GPA", "Class rank", "Teacher remark", "Status", ""]} />
          <tbody>
            {roster.map((s, i) => {
              const status = getStatus(s.id);
              const remark = getRemark(s.id, s.gpa);
              return (
                <TRow key={s.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} color={s.avatarColor} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.id}</p>
                      </div>
                    </div>
                  </TCell>
                  <TCell className="font-bold text-gray-900">{s.gpa.toFixed(1)}</TCell>
                  <TCell>
                    {i + 1} / {roster.length}
                  </TCell>
                  <TCell>
                    <input
                      className="w-full max-w-56 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                      value={remark}
                      placeholder="Remark needed…"
                      onChange={(e) => setRemarks({ ...remarks, [s.id]: e.target.value })}
                    />
                  </TCell>
                  <TCell>
                    <Badge tone={statusTone(status)} dot>
                      {status}
                    </Badge>
                  </TCell>
                  <TCell>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => toast(`Previewing report card for ${s.name}`, "info")} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600" title="Preview">
                        <EyeIcon size={18} />
                      </button>
                      <button type="button" onClick={() => toast(`Generating PDF for ${s.name}…`, "info")} className="rounded-lg p-2 text-error-500 hover:bg-error-50" title="Download PDF">
                        <Pdf01Icon size={18} />
                      </button>
                    </div>
                  </TCell>
                </TRow>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleBatchSubmit}
        title="Submit report cards?"
        message={`This will mark all grades for ${CLASS_NAME} as submitted across ${subjects.length} subjects and send the batch for admin sign-off.`}
        confirmLabel="Submit batch"
      />
    </div>
  );
}
