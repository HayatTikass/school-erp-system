import { useMemo, useState } from "react";
import { CloudUploadIcon, EyeIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { Modal, Field, inputClass } from "../../components/Modal";
import { subjects } from "../../data/mock";
import { formatDate } from "../../lib/utils";
import { useToast } from "../../components/Toast";
import { useAppStore } from "../../store/AppStore";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";
import type { AssignmentItem } from "../../store/domain";

export default function StudentAssignments() {
  const student = useCurrentStudent();
  const { assignments, submissions, submitAssignment } = useAppStore();
  const { toast } = useToast();
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [submitFor, setSubmitFor] = useState<AssignmentItem | null>(null);
  const [note, setNote] = useState("");

  const classAssignments = useMemo(
    () => (student ? assignments.filter((a) => a.className === student.class) : []),
    [assignments, student],
  );

  const withStatus = useMemo(() => {
    if (!student) return [];
    return classAssignments.map((a) => {
      const sub = submissions.find((s) => s.assignmentId === a.id && s.studentId === student.id);
      return { assignment: a, submission: sub, status: sub?.status ?? "Pending", score: sub?.score };
    });
  }, [classAssignments, submissions, student]);

  const filtered = useMemo(() => {
    if (subjectFilter === "All subjects") return withStatus;
    return withStatus.filter((r) => r.assignment.subject === subjectFilter);
  }, [withStatus, subjectFilter]);

  const pending = withStatus.filter((r) => r.status === "Pending");
  const submitted = withStatus.filter((r) => r.status === "Submitted");
  const graded = withStatus.filter((r) => r.status === "Graded" || r.status === "Late");
  const late = withStatus.filter((r) => r.status === "Late");
  const nextDue = [...pending].sort((a, b) => a.assignment.due.localeCompare(b.assignment.due))[0];

  const gradedScores = graded
    .map((r) => r.score)
    .filter(Boolean)
    .map((s) => {
      const m = s!.match(/(\d+)\/(\d+)/);
      return m ? (Number(m[1]) / Number(m[2])) * 100 : null;
    })
    .filter((n): n is number => n !== null);
  const avgGrade = gradedScores.length ? (gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length).toFixed(1) : "None";

  const feedback = graded.filter((r) => r.status === "Graded" || r.status === "Late").slice(0, 3);

  if (!student) {
    return (
      <div>
        <PageHeader title="Assignments & Submissions" subtitle="View published assignments and submit work." />
        <Card className="p-6 text-sm text-gray-600">No student profile linked to this account.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Assignments & Submissions"
        subtitle={`${student.class} · view published assignments, submit work and track feedback.`}
        actions={
          <Select
            options={["All subjects", ...subjects.map((s) => s.name)]}
            value={subjectFilter}
            onChange={setSubjectFilter}
          />
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending" value={String(pending.length)} delta={nextDue ? `next due ${formatDate(nextDue.assignment.due)}` : "none due"} deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Submitted" value={String(submitted.length)} delta="awaiting grading" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Graded" value={String(graded.length)} delta={avgGrade !== "None" ? `avg ${avgGrade}%` : "no scores yet"} deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Submitted late" value={String(late.length)} delta="watch deadlines" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
      </div>

      {nextDue && (
        <Card className="mt-6 border-brand-200 bg-brand-25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-900">Due {formatDate(nextDue.assignment.due)} · {nextDue.assignment.title}</p>
              <p className="mt-0.5 text-sm text-brand-700">{nextDue.assignment.subject} · attach your worked solutions as PDF or photo.</p>
            </div>
            <Button icon={<CloudUploadIcon size={18} />} onClick={() => setSubmitFor(nextDue.assignment)}>Submit now</Button>
          </div>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader title="All assignments · Term 3" />
        <Table>
          <THead cols={["Assignment", "Subject", "Due date", "My status", "Score", ""]} />
          <tbody>
            {filtered.map(({ assignment: a, status, score }) => (
              <TRow key={a.id}>
                <TCell className="max-w-72">
                  <p className="truncate font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.className}</p>
                </TCell>
                <TCell>{a.subject}</TCell>
                <TCell>{formatDate(a.due)}</TCell>
                <TCell><Badge tone={statusTone(status)} dot>{status}</Badge></TCell>
                <TCell className="font-semibold text-gray-900">{score ?? "None"}</TCell>
                <TCell>
                  {status === "Pending" ? (
                    <Button size="sm" icon={<CloudUploadIcon size={16} />} onClick={() => setSubmitFor(a)}>Submit</Button>
                  ) : (
                    <Button variant="secondary" size="sm" icon={<EyeIcon size={16} />} onClick={() => toast(`Opening ${a.title}`, "info")}>View</Button>
                  )}
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      {feedback.length > 0 && (
        <Card className="mt-6">
          <CardHeader title="Teacher feedback" subtitle="Latest returned work" />
          <div className="divide-y divide-gray-100 px-5">
            {feedback.map(({ assignment: a, score }) => (
              <div key={a.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900">{a.title}</p>
                  {score && <Badge tone="brand">{score}</Badge>}
                </div>
                <p className="mt-1 text-xs text-gray-400">{a.subject}</p>
                <p className="mt-2 text-sm text-gray-600">Graded work · open the assignment to view full teacher comments.</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={!!submitFor}
        onClose={() => { setSubmitFor(null); setNote(""); }}
        title="Submit assignment"
        subtitle={submitFor?.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setSubmitFor(null); setNote(""); }}>Cancel</Button>
            <Button
              onClick={() => {
                if (!submitFor || !student) return;
                submitAssignment(submitFor.id, student.id, note.trim() || undefined);
                toast(`Submitted "${submitFor.title}"`);
                setSubmitFor(null);
                setNote("");
              }}
            >
              Confirm submission
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Notes for teacher">
            <textarea className={inputClass} rows={3} placeholder="Optional message…" value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
            <CloudUploadIcon size={28} className="mx-auto text-gray-400" />
            <p className="mt-2 text-sm font-semibold text-gray-900">Attach your work</p>
            <p className="text-xs text-gray-500">PDF, DOC or image · demo upload</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
