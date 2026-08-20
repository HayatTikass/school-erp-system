import { useMemo, useState } from "react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { formatDate } from "../../lib/utils";
import { useAppStore } from "../../store/AppStore";
import { useParentChildren } from "../../hooks/usePortalIdentity";

export default function ParentAssignments() {
  const { children, setSelectedId, selectedChild } = useParentChildren();
  const { assignments, submissions } = useAppStore();
  const [subjectFilter, setSubjectFilter] = useState("All subjects");

  const classAssignments = useMemo(() => {
    if (!selectedChild) return [];
    return assignments.filter((a) => a.className === selectedChild.class);
  }, [assignments, selectedChild]);

  const withStatus = useMemo(() => {
    if (!selectedChild) return [];
    return classAssignments.map((a) => {
      const sub = submissions.find((s) => s.assignmentId === a.id && s.studentId === selectedChild.id);
      return { assignment: a, status: sub?.status ?? "Pending", score: sub?.score };
    });
  }, [classAssignments, submissions, selectedChild]);

  const filtered = useMemo(() => {
    if (subjectFilter === "All subjects") return withStatus;
    return withStatus.filter((r) => r.assignment.subject === subjectFilter);
  }, [withStatus, subjectFilter]);

  const pending = withStatus.filter((r) => r.status === "Pending");
  const onTime = withStatus.filter((r) => r.status === "Submitted" || r.status === "Graded");
  const graded = withStatus.filter((r) => r.score);
  const avgGrade = graded.length
    ? (
        graded
          .map((r) => {
            const m = r.score!.match(/(\d+)\/(\d+)/);
            return m ? (Number(m[1]) / Number(m[2])) * 100 : null;
          })
          .filter((n): n is number => n !== null)
          .reduce((a, b, _, arr) => a + b / arr.length, 0)
      ).toFixed(1)
    : "None";

  const subjects = [...new Set(classAssignments.map((a) => a.subject))];
  const childOptions = children.map((c) => c.name);

  return (
    <div>
      <PageHeader
        title={selectedChild ? `Assignments & Homework · ${selectedChild.name.split(" ")[0]}` : "Assignments & Homework"}
        subtitle="Track submission status and grades on returned work."
        actions={
          children.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              <Select
                options={childOptions}
                value={selectedChild?.name ?? childOptions[0]}
                onChange={(v) => setSelectedId(children.find((c) => c.name === v)?.id ?? "all")}
              />
              <Select options={["All subjects", ...subjects]} value={subjectFilter} onChange={setSubjectFilter} />
            </div>
          ) : undefined
        }
      />

      {children.length === 0 ? (
        <Card className="p-6 text-sm text-gray-600">No students linked to this parent account.</Card>
      ) : selectedChild ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Due / pending" value={String(pending.length)} delta="not yet submitted" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
            <StatCard label="Submitted on time" value={withStatus.length ? `${Math.round((onTime.length / withStatus.length) * 100)}%` : "None"} delta="this term" deltaLabel="" iconBg="bg-success-50 text-success-600" />
            <StatCard label="Average grade" value={avgGrade !== "None" ? `${avgGrade}%` : "None"} delta="on returned work" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
          </div>

          <Card className="mt-6">
            <CardHeader title="Current & recent assignments" subtitle={`${selectedChild.class} · updated as teachers grade work`} />
            {filtered.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-gray-500">No assignments for this class yet.</p>
            ) : (
              <Table>
                <THead cols={["Assignment", "Subject", "Due date", "Status", "Grade / feedback"]} />
                <tbody>
                  {filtered.map(({ assignment: a, status, score }) => (
                    <TRow key={a.id}>
                      <TCell className="max-w-72">
                        <p className="truncate font-semibold text-gray-900">{a.title}</p>
                      </TCell>
                      <TCell>{a.subject}</TCell>
                      <TCell>{formatDate(a.due)}</TCell>
                      <TCell><Badge tone={statusTone(status)} dot>{status}</Badge></TCell>
                      <TCell className="font-semibold text-gray-900">{score ?? "None"}</TCell>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>

          <Card className="mt-6">
            <CardHeader title="How you can help" subtitle={`Suggestions for ${selectedChild.name.split(" ")[0]}'s learning`} />
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
              {[
                { title: "Stay on schedule", tip: pending.length ? `${pending.length} assignment(s) still pending · check due dates together each evening.` : "Great work · all assignments are submitted for now." },
                { title: "Review feedback", tip: graded.length ? "Discuss returned work and celebrate improvements in stronger subjects." : "Grades will appear here once teachers return marked work." },
                { title: "Exam prep", tip: "Revision packs and past questions help · set a quiet study routine before exams." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-gray-900">{c.title}</p>
                  <p className="mt-1.5 text-sm text-gray-600">{c.tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
