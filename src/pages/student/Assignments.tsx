import { CloudUploadIcon, EyeIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { assignments, subjects } from "../../data/mock";
import { formatDate } from "../../lib/utils";

export default function StudentAssignments() {
  const pending = assignments.filter((a) => a.myStatus === "Pending");

  return (
    <div>
      <PageHeader
        title="Assignments & Submissions"
        subtitle="View published assignments, submit work and track feedback."
        actions={<Select options={["All subjects", ...subjects.map((s) => s.name)]} />}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending" value={String(pending.length)} delta="next due 8 Jul" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Submitted" value="1" delta="awaiting grading" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Graded" value="2" delta="avg 72.5%" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Submitted late" value="1" delta="watch deadlines" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
      </div>

      {/* Due soon banner */}
      <Card className="mt-6 border-brand-200 bg-brand-25 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-brand-900">Due Wednesday — Quadratic equations worksheet</p>
            <p className="mt-0.5 text-sm text-brand-700">Mathematics · Mr. Daniel Ampofo · attach your worked solutions as PDF or photo.</p>
          </div>
          <Button icon={<CloudUploadIcon size={18} />}>Submit now</Button>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title="All assignments — Term 3" />
        <Table>
          <THead cols={["Assignment", "Subject", "Due date", "My status", "Score", ""]} />
          <tbody>
            {assignments.map((a) => (
              <TRow key={a.id}>
                <TCell className="max-w-72">
                  <p className="truncate font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.class}</p>
                </TCell>
                <TCell>{a.subject}</TCell>
                <TCell>{formatDate(a.due)}</TCell>
                <TCell><Badge tone={statusTone(a.myStatus)} dot>{a.myStatus}</Badge></TCell>
                <TCell className="font-semibold text-gray-900">{a.score ?? "—"}</TCell>
                <TCell>
                  {a.myStatus === "Pending" ? (
                    <Button size="sm" icon={<CloudUploadIcon size={16} />}>Submit</Button>
                  ) : (
                    <Button variant="secondary" size="sm" icon={<EyeIcon size={16} />}>View</Button>
                  )}
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Teacher feedback" subtitle="Latest returned work" />
        <div className="divide-y divide-gray-100 px-5">
          {[
            { title: "Essay: My community and I", teacher: "Mrs. Grace Antwi", score: "17/20", note: "Beautifully structured essay — your introduction hooks the reader immediately. Watch subject-verb agreement in long sentences." },
            { title: "Map reading exercise", teacher: "Ms. Comfort Addo", score: "12/20", note: "Submitted late, which cost you marks. Your bearings work is solid; practise grid references before the exam." },
          ].map((f) => (
            <div key={f.title} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-gray-900">{f.title}</p>
                <Badge tone="brand">{f.score}</Badge>
              </div>
              <p className="mt-1 text-xs text-gray-400">{f.teacher}</p>
              <p className="mt-2 text-sm text-gray-600">{f.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
