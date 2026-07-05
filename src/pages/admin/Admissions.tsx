import { Add01Icon, FileExportIcon, EyeIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, SearchInput, Select, StatCard, Progress } from "../../components/ui";
import { applications } from "../../data/mock";
import { formatDate } from "../../lib/utils";

const pipeline = [
  { stage: "Submitted", count: 42, tone: "bg-gray-400" },
  { stage: "Exam scheduled", count: 18, tone: "bg-blue-500" },
  { stage: "Under review", count: 11, tone: "bg-warning-500" },
  { stage: "Accepted", count: 26, tone: "bg-success-500" },
  { stage: "Waitlist", count: 7, tone: "bg-orange-500" },
];

export default function AdminAdmissions() {
  const total = pipeline.reduce((a, b) => a + b.count, 0);

  return (
    <div>
      <PageHeader
        title="Admissions Management"
        subtitle="Review applications, schedule entrance exams and confirm enrolments."
        actions={
          <>
            <Button variant="secondary" icon={<FileExportIcon size={18} />}>Export</Button>
            <Button icon={<Add01Icon size={18} />}>New application</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Applications (2026/27)" value="104" delta="18%" deltaLabel="vs last year" />
        <StatCard label="Entrance exams taken" value="63" delta="61%" deltaLabel="completion rate" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Offers accepted" value="26" delta="8 pending" deltaLabel="confirmation" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Available seats" value="38" deltaLabel="across JHS 1–3" delta="JHS 1: 24" iconBg="bg-warning-50 text-warning-600" />
      </div>

      {/* Pipeline */}
      <Card className="mt-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Admission pipeline</h3>
          <span className="text-sm text-gray-500">{total} total applications</span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {pipeline.map((p) => (
            <div key={p.stage} className={p.tone} style={{ width: `${(p.count / total) * 100}%` }} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {pipeline.map((p) => (
            <div key={p.stage} className="flex items-center gap-2 text-sm">
              <span className={`size-2.5 rounded-full ${p.tone}`} />
              <span className="text-gray-600">{p.stage}</span>
              <span className="font-semibold text-gray-900">{p.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Recent applications" subtitle="Entrance exam pass mark: 60%" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search applicants…" className="w-72" />
          <Select options={["All levels", "JHS 1", "JHS 2", "JHS 3"]} />
          <Select options={["All statuses", "Submitted", "Exam scheduled", "Review", "Accepted", "Waitlist"]} />
        </div>
        <Table>
          <THead cols={["Applicant", "Applying for", "Applied", "Exam score", "Status", ""]} />
          <tbody>
            {applications.map((a) => (
              <TRow key={a.id}>
                <TCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={a.name} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.id}</p>
                    </div>
                  </div>
                </TCell>
                <TCell>{a.appliedFor}</TCell>
                <TCell>{formatDate(a.date)}</TCell>
                <TCell>
                  {a.exam > 0 ? (
                    <div className="flex w-36 items-center gap-2">
                      <Progress value={a.exam} tone={a.exam >= 60 ? "success" : "error"} className="flex-1" />
                      <span className="text-xs font-semibold text-gray-700">{a.exam}%</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TCell>
                <TCell><Badge tone={statusTone(a.status)} dot>{a.status}</Badge></TCell>
                <TCell>
                  <Button variant="secondary" size="sm" icon={<EyeIcon size={16} />}>Review</Button>
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
