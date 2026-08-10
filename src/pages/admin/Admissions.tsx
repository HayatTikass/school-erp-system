import { useMemo, useState } from "react";
import { Add01Icon, FileExportIcon, EyeIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, SearchInput, Select, StatCard, Progress } from "../../components/ui";
import { Modal, Field, inputClass } from "../../components/Modal";
import { formatDate } from "../../lib/utils";
import { useAppStore } from "../../store/AppStore";
import { useToast } from "../../components/Toast";

const PIPELINE_STAGES = ["Submitted", "Exam scheduled", "Under review", "Accepted", "Waitlist", "Enrolled"];

export default function AdminAdmissions() {
  const { applications, addApplication, updateApplicationStatus, enrolApplication } = useAppStore();
  const { toast } = useToast();
  const [review, setReview] = useState<(typeof applications)[number] | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [newForm, setNewForm] = useState({ name: "", appliedFor: "JHS 1", phone: "" });

  const pipeline = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: applications.filter((a) => a.status === stage || (stage === "Under review" && a.status === "Review")).length,
    tone:
      stage === "Submitted" ? "bg-gray-400"
      : stage === "Exam scheduled" ? "bg-blue-500"
      : stage === "Under review" ? "bg-warning-500"
      : stage === "Accepted" ? "bg-success-500"
      : stage === "Waitlist" ? "bg-orange-500"
      : "bg-brand-500",
  }));
  const total = applications.length;

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (level !== "All levels" && !a.appliedFor.includes(level.replace("JHS ", ""))) return false;
      if (statusFilter !== "All statuses" && a.status !== statusFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    });
  }, [applications, query, level, statusFilter]);

  const examsTaken = applications.filter((a) => a.exam > 0).length;
  const accepted = applications.filter((a) => a.status === "Accepted" || a.status === "Enrolled").length;

  const submitNew = () => {
    if (!newForm.name.trim()) {
      toast("Applicant name is required", "error");
      return;
    }
    addApplication({
      name: newForm.name.trim(),
      appliedFor: newForm.appliedFor,
      guardian: newForm.phone.trim() || undefined,
      phone: newForm.phone.trim() || undefined,
    });
    toast(`Application for ${newForm.name.trim()} recorded`);
    setNewOpen(false);
    setNewForm({ name: "", appliedFor: "JHS 1", phone: "" });
  };

  const handleEnrol = (id: string, name: string) => {
    const result = enrolApplication(id);
    if (!result.ok) {
      toast(result.error, "error");
      return;
    }
    toast(`${name} enrolled as ${result.student.id}`);
    setReview(null);
  };

  return (
    <div>
      <PageHeader
        title="Admissions Management"
        subtitle="Review applications, schedule entrance exams and confirm enrolments."
        actions={
          <>
            <Button variant="secondary" icon={<FileExportIcon size={18} />} onClick={() => toast("Admissions export ready (demo).", "info")}>Export</Button>
            <Button icon={<Add01Icon size={18} />} onClick={() => setNewOpen(true)}>New application</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Applications (2026/27)" value={String(total)} delta={`${filtered.length} shown`} deltaLabel="" />
        <StatCard label="Entrance exams taken" value={String(examsTaken)} delta={total > 0 ? `${Math.round((examsTaken / total) * 100)}%` : "0%"} deltaLabel="completion rate" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Offers accepted" value={String(accepted)} delta={`${applications.filter((a) => a.status === "Accepted").length} pending enrolment`} deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Available seats" value="38" deltaLabel="across JHS 1–3" delta="JHS 1: 24" iconBg="bg-warning-50 text-warning-600" />
      </div>

      <Card className="mt-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Admission pipeline</h3>
          <span className="text-sm text-gray-500">{total} total applications</span>
        </div>
        {total > 0 && (
          <>
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {pipeline.filter((p) => p.count > 0).map((p) => (
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
          </>
        )}
      </Card>

      <Card className="mt-6">
        <CardHeader title="Recent applications" subtitle="Entrance exam pass mark: 60%" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search applicants…" className="w-72" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select options={["All levels", "JHS 1", "JHS 2", "JHS 3"]} value={level} onChange={setLevel} />
          <Select options={["All statuses", "Submitted", "Exam scheduled", "Review", "Accepted", "Waitlist", "Enrolled"]} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <Table>
          <THead cols={["Applicant", "Applying for", "Applied", "Exam score", "Status", ""]} />
          <tbody>
            {filtered.map((a) => (
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
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={<EyeIcon size={16} />} onClick={() => setReview(a)}>Review</Button>
                    {a.status === "Accepted" && (
                      <Button size="sm" onClick={() => handleEnrol(a.id, a.name)}>Enrol</Button>
                    )}
                  </div>
                </TCell>
              </TRow>
            ))}
            {filtered.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400">No applications match your filters.</TCell>
                <TCell /><TCell /><TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={!!review}
        onClose={() => setReview(null)}
        title={review ? `Review — ${review.name}` : "Review"}
        subtitle={review ? `${review.id} · applying for ${review.appliedFor}` : ""}
        footer={
          review && (
            <>
              <Button variant="secondary" onClick={() => setReview(null)}>Close</Button>
              {review.status === "Accepted" && (
                <Button onClick={() => handleEnrol(review.id, review.name)}>Enrol student</Button>
              )}
              <Button
                variant="secondary"
                onClick={() => {
                  updateApplicationStatus(review.id, "Waitlist");
                  toast(`${review.name} moved to waitlist`, "warning");
                  setReview(null);
                }}
              >
                Waitlist
              </Button>
              <Button
                onClick={() => {
                  updateApplicationStatus(review.id, "Accepted");
                  toast(`${review.name} accepted — enrolment letter queued`);
                  setReview(null);
                }}
              >
                Accept applicant
              </Button>
            </>
          )
        }
      >
        {review && (
          <div className="space-y-3 text-sm text-gray-600">
            <p><span className="font-semibold text-gray-900">Applied:</span> {formatDate(review.date)}</p>
            <p><span className="font-semibold text-gray-900">Exam score:</span> {review.exam > 0 ? `${review.exam}%` : "Not taken"}</p>
            <p><span className="font-semibold text-gray-900">Current status:</span> {review.status}</p>
            <p className="rounded-lg bg-gray-50 p-3">
              Pass mark is 60%. Acceptance generates a student ID and parent portal invite once enrolled.
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New application"
        subtitle="Manual entry for walk-in applicants"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={submitNew}>Save application</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Applicant name" required>
            <input className={inputClass} placeholder="Full name" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} />
          </Field>
          <Field label="Applying for">
            <select className={inputClass} value={newForm.appliedFor} onChange={(e) => setNewForm({ ...newForm, appliedFor: e.target.value })}>
              <option>JHS 1</option>
              <option>JHS 2</option>
              <option>JHS 3</option>
            </select>
          </Field>
          <Field label="Guardian phone">
            <input className={inputClass} placeholder="024 …" value={newForm.phone} onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
