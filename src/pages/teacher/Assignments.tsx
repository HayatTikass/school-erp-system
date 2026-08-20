import { useMemo, useState } from "react";
import { Add01Icon, EyeIcon, PencilEdit02Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, Select, SearchInput, StatCard, Progress } from "../../components/ui";
import { formatDate } from "../../lib/utils";
import { useAppStore } from "../../store/AppStore";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/Toast";
import { Modal, Field, inputClass } from "../../components/Modal";
import type { AssignmentItem } from "../../store/domain";

const CLASS_OPTIONS = ["All classes", "JHS 1A", "JHS 2A", "JHS 2B", "JHS 3A"];
const STATUS_OPTIONS = ["All statuses", "Open", "Grading", "Closed"];

function submissionStats(assignmentId: string, submissions: ReturnType<typeof useAppStore>["submissions"]) {
  const subs = submissions.filter((s) => s.assignmentId === assignmentId);
  const submitted = subs.filter((s) => s.status === "Submitted" || s.status === "Graded" || s.status === "Late").length;
  const graded = subs.filter((s) => s.status === "Graded").length;
  const toGrade = subs.filter((s) => s.status === "Submitted" || s.status === "Late").length;
  const pending = subs.filter((s) => s.status === "Pending").length;
  const late = subs.filter((s) => s.status === "Late").length;
  return { subs, submitted, graded, toGrade, pending, late, total: subs.length };
}

export default function TeacherAssignments() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { assignments, submissions, createAssignment, gradeSubmission } = useAppStore();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState(CLASS_OPTIONS[0]);
  const [statusFilter, setStatusFilter] = useState(STATUS_OPTIONS[0]);
  const [createOpen, setCreateOpen] = useState(false);
  const [gradeAssignment, setGradeAssignment] = useState<AssignmentItem | null>(null);
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: "",
    subject: "Mathematics",
    className: "JHS 2A",
    due: "",
    status: "Open" as AssignmentItem["status"],
  });

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      if (classFilter !== "All classes" && a.className !== classFilter) return false;
      if (statusFilter !== "All statuses" && a.status !== statusFilter) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [assignments, classFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const active = assignments.filter((a) => a.status === "Open" || a.status === "Grading").length;
    const allSubs = submissions;
    const received = allSubs.filter((s) => s.status !== "Pending").length;
    const expected = assignments.reduce((sum, a) => sum + a.totalStudents, 0);
    const awaiting = allSubs.filter((s) => s.status === "Submitted" || s.status === "Late").length;
    const gradedScores = allSubs.filter((s) => s.score).map((s) => {
      const parts = s.score!.split("/");
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1] ?? "20");
      return den > 0 ? (num / den) * 100 : 0;
    });
    const avg = gradedScores.length ? Math.round(gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length) : 0;
    return { active, received, expected, awaiting, avg };
  }, [assignments, submissions]);

  const gradingQueue = useMemo(() => {
    const grading = assignments.find((a) => a.status === "Grading") ?? assignments.find((a) => {
      const { toGrade } = submissionStats(a.id, submissions);
      return toGrade > 0;
    });
    if (!grading) return null;
    return { assignment: grading, ...submissionStats(grading.id, submissions) };
  }, [assignments, submissions]);

  const openGrading = (a: AssignmentItem) => {
    setGradeAssignment(a);
    const subs = submissions.filter((s) => s.assignmentId === a.id);
    setScoreInputs(Object.fromEntries(subs.map((s) => [s.id, s.score ?? ""])));
  };

  const handleCreate = () => {
    if (!form.title.trim() || !form.due) {
      toast("Title and due date are required", "error");
      return;
    }
    createAssignment({ ...form, createdBy: user?.id });
    toast(`Assignment "${form.title}" created`, "success");
    setCreateOpen(false);
    setForm({ title: "", subject: "Mathematics", className: "JHS 2A", due: "", status: "Open" });
  };

  const handleGrade = (submissionId: string) => {
    const score = scoreInputs[submissionId]?.trim();
    if (!score) {
      toast("Enter a score (e.g. 17/20)", "error");
      return;
    }
    gradeSubmission(submissionId, score);
    toast("Submission graded", "success");
  };

  return (
    <div>
      <PageHeader
        title="Assignment Management"
        subtitle="Create, publish and grade assignments across your classes."
        actions={<Button icon={<Add01Icon size={18} />} onClick={() => setCreateOpen(true)}>Create assignment</Button>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active assignments" value={String(stats.active)} delta={`${assignments.filter((a) => a.status === "Open").length} open`} deltaLabel="" />
        <StatCard label="Submissions received" value={String(stats.received)} delta={`of ${stats.expected} expected`} deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Awaiting grading" value={String(stats.awaiting)} delta="submitted work" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Avg. score (graded)" value={`${stats.avg}%`} delta="" iconBg="bg-success-50 text-success-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="All assignments" subtitle="Mathematics · Term 3" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search assignments…" className="w-72" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select options={CLASS_OPTIONS} value={classFilter} onChange={setClassFilter} />
          <Select options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <Table>
          <THead cols={["Assignment", "Class", "Due date", "Submissions", "Status", ""]} />
          <tbody>
            {filtered.map((a) => {
              const { submitted, total } = submissionStats(a.id, submissions);
              const pct = total > 0 ? (submitted / total) * 100 : 0;
              return (
                <TRow key={a.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.subject}</p>
                  </TCell>
                  <TCell>{a.className}</TCell>
                  <TCell>{formatDate(a.due)}</TCell>
                  <TCell>
                    <div className="flex w-36 items-center gap-2">
                      <Progress value={pct} tone={pct > 80 ? "success" : pct > 40 ? "brand" : "warning"} className="flex-1" />
                      <span className="text-xs font-semibold whitespace-nowrap">{submitted}/{total || a.totalStudents}</span>
                    </div>
                  </TCell>
                  <TCell><Badge tone={statusTone(a.status)} dot>{a.status}</Badge></TCell>
                  <TCell>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openGrading(a)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600" title="View submissions">
                        <EyeIcon size={18} />
                      </button>
                      <button type="button" onClick={() => toast("Edit assignment · use create form fields as reference", "info")} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600" title="Edit">
                        <PencilEdit02Icon size={18} />
                      </button>
                    </div>
                  </TCell>
                </TRow>
              );
            })}
          </tbody>
        </Table>
      </Card>

      {gradingQueue && (
        <Card className="mt-6">
          <CardHeader
            title="Grading queue"
            subtitle={`${gradingQueue.assignment.title} · ${gradingQueue.toGrade} submissions to grade`}
            action={<Button size="sm" onClick={() => openGrading(gradingQueue.assignment)}>Start grading</Button>}
          />
          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
            {[
              { label: "Graded", value: String(gradingQueue.graded), tone: "text-gray-900" },
              { label: "To grade", value: String(gradingQueue.toGrade), tone: "text-warning-600" },
              { label: "Late submissions", value: String(gradingQueue.late), tone: "text-error-600" },
              { label: "Not submitted", value: String(gradingQueue.pending), tone: "text-gray-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className={`text-2xl font-bold ${s.tone}`}>{s.value}</p>
                <p className="mt-1 text-xs font-medium text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create assignment"
        subtitle="Publish a new task to your class"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create assignment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title" required>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Quadratic equations worksheet" />
          </Field>
          <Field label="Subject" required>
            <input className={inputClass} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <Field label="Class" required>
            <select className={inputClass} value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>
              {CLASS_OPTIONS.filter((c) => c !== "All classes").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Due date" required>
            <input type="date" className={inputClass} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Field>
          <Field label="Status">
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AssignmentItem["status"] })}>
              <option value="Open">Open</option>
              <option value="Grading">Grading</option>
              <option value="Closed">Closed</option>
            </select>
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!gradeAssignment}
        onClose={() => setGradeAssignment(null)}
        title={gradeAssignment?.title ?? "Submissions"}
        subtitle={gradeAssignment ? `${gradeAssignment.className} · ${gradeAssignment.subject}` : undefined}
        size="lg"
      >
        <div className="divide-y divide-gray-100">
          {gradeAssignment &&
            submissions
              .filter((s) => s.assignmentId === gradeAssignment.id)
              .map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{s.studentName}</p>
                    <p className="text-xs text-gray-500">
                      {s.status}
                      {s.submittedAt ? ` · ${formatDate(s.submittedAt)}` : ""}
                    </p>
                  </div>
                  <Badge tone={statusTone(s.status)} dot>{s.status}</Badge>
                  {(s.status === "Submitted" || s.status === "Late" || s.status === "Graded") && (
                    <div className="flex items-center gap-2">
                      <input
                        className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm"
                        placeholder="17/20"
                        value={scoreInputs[s.id] ?? ""}
                        onChange={(e) => setScoreInputs({ ...scoreInputs, [s.id]: e.target.value })}
                      />
                      <Button size="sm" onClick={() => handleGrade(s.id)}>
                        {s.status === "Graded" ? "Update" : "Grade"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </Modal>
    </div>
  );
}
