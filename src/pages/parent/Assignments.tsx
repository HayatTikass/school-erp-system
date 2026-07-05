import { PageHeader, Card, CardHeader, Badge, statusTone, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { assignments } from "../../data/mock";
import { formatDate } from "../../lib/utils";

export default function ParentAssignments() {
  return (
    <div>
      <PageHeader
        title="Assignments & Homework — Abena"
        subtitle="Track submission status and grades on returned work."
        actions={<Select options={["All subjects", "Mathematics", "English Language", "Integrated Science", "ICT"]} />}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Due this week" value="2" delta="1 not yet started" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Submitted on time" value="87%" delta="this term" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Average grade" value="72.5%" delta="on returned work" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Current & recent assignments" subtitle="Updated in real time as teachers grade work" />
        <Table>
          <THead cols={["Assignment", "Subject", "Due date", "Status", "Grade / feedback"]} />
          <tbody>
            {assignments.map((a) => (
              <TRow key={a.id}>
                <TCell className="max-w-72">
                  <p className="truncate font-semibold text-gray-900">{a.title}</p>
                </TCell>
                <TCell>{a.subject}</TCell>
                <TCell>{formatDate(a.due)}</TCell>
                <TCell><Badge tone={statusTone(a.myStatus)} dot>{a.myStatus}</Badge></TCell>
                <TCell className="font-semibold text-gray-900">{a.score ?? "—"}</TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-6">
        <CardHeader title="How you can help" subtitle="Suggestions from Abena's teachers" />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          {[
            { title: "Maths practice", tip: "Encourage 20 minutes of quadratic equation practice before Wednesday's deadline." },
            { title: "Reading time", tip: "The overdue library book suggests reading time slipped — a set evening slot helps." },
            { title: "Exam prep", tip: "Revision packs come home Friday. A quiet study corner makes a big difference." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-bold text-gray-900">{c.title}</p>
              <p className="mt-1.5 text-sm text-gray-600">{c.tip}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
