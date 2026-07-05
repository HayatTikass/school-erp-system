import { SentIcon, EyeIcon, Pdf01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, Select, StatCard } from "../../components/ui";
import { students } from "../../data/mock";

const reportStatus = ["Ready", "Ready", "Comments pending", "Ready", "Comments pending", "Ready", "Ready", "Draft", "Ready", "Ready", "Draft", "Ready"];

export default function TeacherReportCards() {
  return (
    <div>
      <PageHeader
        title="Report Card Generation"
        subtitle="JHS 2A · Term 3 — add remarks and submit for admin sign-off."
        actions={
          <>
            <Select options={["Term 3 · 2025/26", "Term 2 · 2025/26", "Term 1 · 2025/26"]} />
            <Button icon={<SentIcon size={18} />}>Submit batch for sign-off</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Report cards ready" value="8/12" delta="66%" deltaLabel="complete" />
        <StatCard label="Comments pending" value="2" delta="add teacher remarks" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Class average GPA" value="3.3" delta="0.2" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Awaiting admin sign-off" value="0" delta="not yet submitted" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Term 3 report cards — JHS 2A" subtitle="Preview each slip before submitting" action={<Badge tone="warning" dot>Batch in draft</Badge>} />
        <Table>
          <THead cols={["Student", "GPA", "Class rank", "Teacher remark", "Status", ""]} />
          <tbody>
            {students.map((s, i) => (
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
                <TCell>{i + 1} / 34</TCell>
                <TCell>
                  {reportStatus[i] === "Comments pending" ? (
                    <span className="text-warning-600 italic">Remark needed…</span>
                  ) : (
                    <span className="block max-w-56 truncate">
                      {s.gpa >= 3.5 ? "An excellent term. Keep up the consistency." : s.gpa >= 3 ? "Good progress; aim higher in exams." : "Capable of much more with better focus."}
                    </span>
                  )}
                </TCell>
                <TCell><Badge tone={statusTone(reportStatus[i])} dot>{reportStatus[i]}</Badge></TCell>
                <TCell>
                  <div className="flex gap-1">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600" title="Preview"><EyeIcon size={18} /></button>
                    <button className="rounded-lg p-2 text-error-500 hover:bg-error-50" title="Download PDF"><Pdf01Icon size={18} /></button>
                  </div>
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
