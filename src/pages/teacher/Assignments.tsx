import { Add01Icon, EyeIcon, PencilEdit02Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, Select, SearchInput, StatCard, Progress } from "../../components/ui";
import { assignments } from "../../data/mock";
import { formatDate } from "../../lib/utils";

export default function TeacherAssignments() {
  return (
    <div>
      <PageHeader
        title="Assignment Management"
        subtitle="Create, publish and grade assignments across your classes."
        actions={<Button icon={<Add01Icon size={18} />}>Create assignment</Button>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active assignments" value="3" delta="2 due this week" deltaLabel="" />
        <StatCard label="Submissions received" value="95" delta="of 170 expected" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Awaiting grading" value="30" delta="oldest: 2 days" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Avg. score (graded)" value="76%" delta="4.1%" iconBg="bg-success-50 text-success-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="All assignments" subtitle="Mathematics — Term 3" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search assignments…" className="w-72" />
          <Select options={["All classes", "JHS 1A", "JHS 2A", "JHS 2B", "JHS 3A"]} />
          <Select options={["All statuses", "Open", "Grading", "Closed"]} />
        </div>
        <Table>
          <THead cols={["Assignment", "Class", "Due date", "Submissions", "Status", ""]} />
          <tbody>
            {assignments.map((a) => (
              <TRow key={a.id}>
                <TCell>
                  <p className="font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.subject}</p>
                </TCell>
                <TCell>{a.class}</TCell>
                <TCell>{formatDate(a.due)}</TCell>
                <TCell>
                  <div className="flex w-36 items-center gap-2">
                    <Progress
                      value={(a.submitted / a.totalStudents) * 100}
                      tone={a.submitted / a.totalStudents > 0.8 ? "success" : a.submitted / a.totalStudents > 0.4 ? "brand" : "warning"}
                      className="flex-1"
                    />
                    <span className="text-xs font-semibold whitespace-nowrap">{a.submitted}/{a.totalStudents}</span>
                  </div>
                </TCell>
                <TCell><Badge tone={statusTone(a.status)} dot>{a.status}</Badge></TCell>
                <TCell>
                  <div className="flex gap-1">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600" title="View submissions"><EyeIcon size={18} /></button>
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600" title="Edit"><PencilEdit02Icon size={18} /></button>
                  </div>
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Grading queue" subtitle="Essay: My community and I — 30 submissions to grade" action={<Button size="sm">Start grading</Button>} />
        <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
          {[
            { label: "Graded", value: "0", tone: "text-gray-900" },
            { label: "To grade", value: "30", tone: "text-warning-600" },
            { label: "Late submissions", value: "4", tone: "text-error-600" },
            { label: "Not submitted", value: "4", tone: "text-gray-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-gray-50 p-4 text-center">
              <p className={`text-2xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="mt-1 text-xs font-medium text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
