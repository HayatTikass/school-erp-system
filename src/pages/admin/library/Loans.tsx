import { useState } from "react";
import { BookDownloadIcon, Alert01Icon } from "hugeicons-react";
import {
  PageHeader,
  Card,
  CardHeader,
  Badge,
  statusTone,
  Button,
  Table,
  THead,
  TRow,
  TCell,
  StatCard,
} from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { formatDate, formatMoney } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

export default function Loans() {
  const { books, loans, students, issueBook, returnBook, renewLoan } = useAppStore();
  const { toast } = useToast();
  const [issueOpen, setIssueOpen] = useState(false);
  const [form, setForm] = useState({ book: books[0]?.title ?? "", student: "", due: "2026-07-20" });

  const activeLoans = loans.filter((l) => l.status === "On loan" || l.status === "Overdue");
  const overdueCount = loans.filter((l) => l.status === "Overdue").length;
  const finesCollected = loans.reduce((a, l) => a + l.fine, 0);
  const dueThisWeek = activeLoans.filter((l) => {
    const due = new Date(l.due);
    const now = new Date();
    const week = new Date();
    week.setDate(now.getDate() + 7);
    return due >= now && due <= week;
  }).length;

  const openIssue = () => {
    setForm({ book: books.find((b) => b.available > 0)?.title || books[0]?.title || "", student: students[0]?.name || "", due: "2026-07-20" });
    setIssueOpen(true);
  };

  const submitIssue = () => {
    if (!form.book || !form.student) {
      toast("Select a book and student", "error");
      return;
    }
    issueBook(form.book, form.student, form.due);
    toast(`Issued "${form.book}" to ${form.student}`);
    setIssueOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Loans & returns"
        subtitle="Active loans, returns, renewals and loan history."
        actions={
          <Button variant="secondary" icon={<BookDownloadIcon size={18} />} onClick={openIssue}>
            Issue book
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Books on loan" value={String(activeLoans.length)} delta={`${dueThisWeek} due this week`} deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Overdue" value={String(overdueCount)} delta={overdueCount > 0 ? "action needed" : "none"} deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Fines collected" value={formatMoney(finesCollected)} delta="this term" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Total loans" value={String(loans.length)} delta="all statuses" deltaLabel="" iconBg="bg-gray-50 text-gray-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Active loans & returns" action={<Badge tone="error" dot>{overdueCount} overdue</Badge>} />
        <div className="divide-y divide-gray-100 px-5">
          {activeLoans.map((l) => (
            <div key={l.id} className="py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{l.book}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{l.student} · due {formatDate(l.due)}</p>
                </div>
                <Badge tone={statusTone(l.status)}>{l.status}</Badge>
              </div>
              {l.fine > 0 && (
                <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-error-50 px-3 py-2 text-xs font-medium text-error-700">
                  <Alert01Icon size={14} /> Fine accruing: {formatMoney(l.fine)} · overdue notice sent to parent
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => { returnBook(l.id); toast(`"${l.book}" returned by ${l.student}`); }}>
                  Return
                </Button>
                <Button variant="secondary" size="sm" onClick={() => { renewLoan(l.id); toast("Loan renewed · due date extended 14 days"); }}>
                  Renew
                </Button>
              </div>
            </div>
          ))}
          {activeLoans.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">No active loans.</p>
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Loans history" subtitle={`${loans.length} records · all statuses`} />
        <Table>
          <THead cols={["Book", "Student", "Issued", "Due", "Status", "Fine", ""]} />
          <tbody>
            {loans.map((l) => (
              <TRow key={l.id}>
                <TCell className="font-semibold text-gray-900">{l.book}</TCell>
                <TCell>{l.student}</TCell>
                <TCell>{formatDate(l.issued)}</TCell>
                <TCell>{formatDate(l.due)}</TCell>
                <TCell>
                  <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                </TCell>
                <TCell>{l.fine > 0 ? formatMoney(l.fine) : "None"}</TCell>
                <TCell>
                  {(l.status === "On loan" || l.status === "Overdue") && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { returnBook(l.id); toast(`"${l.book}" returned by ${l.student}`); }}>
                        Return
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => { renewLoan(l.id); toast("Loan renewed · due date extended 14 days"); }}>
                        Renew
                      </Button>
                    </div>
                  )}
                </TCell>
              </TRow>
            ))}
            {loans.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400">No loan records.</TCell>
                <TCell /><TCell /><TCell /><TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        title="Issue book"
        subtitle="Create a loan record"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIssueOpen(false)}>Cancel</Button>
            <Button onClick={submitIssue}>Issue book</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Book" required>
            <select className={inputClass} value={form.book} onChange={(e) => setForm({ ...form, book: e.target.value })}>
              {books.filter((b) => b.available > 0).map((b) => (
                <option key={b.id} value={b.title}>{b.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Student" required>
            <select className={inputClass} value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
              {students.map((s) => (
                <option key={s.id} value={s.name}>{s.name} · {s.class}</option>
              ))}
            </select>
          </Field>
          <Field label="Due date" required>
            <input type="date" className={inputClass} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
