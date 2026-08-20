import { useState } from "react";
import { Add01Icon, MoneyReceive01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, SearchInput, Select } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { formatDate, formatMoney } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

export default function FinanceInvoices() {
  const { invoices, students, addInvoice, recordPayment } = useAppStore();
  const { toast } = useToast();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [query, setQuery] = useState("");

  const [invForm, setInvForm] = useState({ studentId: "", item: "Term 3 Tuition", amount: "1850", due: "2026-07-15" });
  const [payForm, setPayForm] = useState({ invoiceId: "", amount: "", method: "MoMo" as "MoMo" | "Bank" | "Cash" });

  const outstanding = invoices.filter((i) => i.status !== "Paid");

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== "All statuses" && inv.status !== statusFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return inv.id.toLowerCase().includes(q) || inv.student.toLowerCase().includes(q) || inv.item.toLowerCase().includes(q);
  });

  const createInvoice = () => {
    const student = students.find((s) => s.id === invForm.studentId);
    if (!student) {
      toast("Select a student", "error");
      return;
    }
    const amount = Number(invForm.amount);
    if (!amount || amount <= 0) {
      toast("Enter a valid amount", "error");
      return;
    }
    const inv = addInvoice({
      student: student.name,
      class: student.class,
      item: invForm.item,
      amount,
      paid: 0,
      due: invForm.due,
      status: "Unpaid",
    });
    toast(`Invoice ${inv.id} created for ${student.name}`);
    setInvoiceOpen(false);
  };

  const submitPayment = () => {
    const inv = invoices.find((i) => i.id === payForm.invoiceId);
    if (!inv) {
      toast("Select an invoice", "error");
      return;
    }
    const amount = Number(payForm.amount);
    if (!amount || amount <= 0) {
      toast("Enter a valid amount", "error");
      return;
    }
    recordPayment(
      {
        student: inv.student,
        amount,
        method: payForm.method,
        date: new Date().toISOString().slice(0, 10),
        ref: `${payForm.method === "MoMo" ? "MM" : payForm.method === "Bank" ? "BNK" : "CASH"}-${Date.now().toString().slice(-8)}`,
      },
      inv.id,
    );
    toast(`Payment of ${formatMoney(amount)} recorded for ${inv.student}`);
    setPayOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Fee invoices, billing and payment collection."
        actions={
          <>
            <Button variant="secondary" icon={<MoneyReceive01Icon size={18} />} onClick={() => setPayOpen(true)}>
              Record payment
            </Button>
            <Button icon={<Add01Icon size={18} />} onClick={() => setInvoiceOpen(true)}>
              Create invoice
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader title="Invoices" subtitle="All fee invoices for this term" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search invoices…" className="w-72" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select options={["All statuses", "Paid", "Partial", "Overdue", "Unpaid"]} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <Table>
          <THead cols={["Invoice", "Student", "Item", "Amount", "Paid", "Due", "Status", ""]} />
          <tbody>
            {filteredInvoices.map((inv) => (
              <TRow key={inv.id}>
                <TCell className="font-semibold text-gray-900">{inv.id}</TCell>
                <TCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={inv.student} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{inv.student}</p>
                      <p className="text-xs text-gray-400">{inv.class}</p>
                    </div>
                  </div>
                </TCell>
                <TCell>{inv.item}</TCell>
                <TCell className="font-semibold text-gray-900">{formatMoney(inv.amount)}</TCell>
                <TCell>{formatMoney(inv.paid)}</TCell>
                <TCell>{formatDate(inv.due)}</TCell>
                <TCell>
                  <Badge tone={statusTone(inv.status)} dot>
                    {inv.status}
                  </Badge>
                </TCell>
                <TCell>
                  {inv.status !== "Paid" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setPayForm({ invoiceId: inv.id, amount: String(inv.amount - inv.paid), method: "MoMo" });
                        setPayOpen(true);
                      }}
                    >
                      Pay
                    </Button>
                  )}
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        title="Create invoice"
        subtitle="Generate a fee invoice for a student"
        footer={
          <>
            <Button variant="secondary" onClick={() => setInvoiceOpen(false)}>Cancel</Button>
            <Button onClick={createInvoice}>Create invoice</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Student" required>
            <select className={inputClass} value={invForm.studentId} onChange={(e) => setInvForm({ ...invForm, studentId: e.target.value })}>
              <option value="">Select student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.class}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fee item" required>
            <input className={inputClass} value={invForm.item} onChange={(e) => setInvForm({ ...invForm, item: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (GH₵)" required>
              <input type="number" className={inputClass} value={invForm.amount} onChange={(e) => setInvForm({ ...invForm, amount: e.target.value })} />
            </Field>
            <Field label="Due date" required>
              <input type="date" className={inputClass} value={invForm.due} onChange={(e) => setInvForm({ ...invForm, due: e.target.value })} />
            </Field>
          </div>
        </div>
      </Modal>

      <Modal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title="Record payment"
        subtitle="Cash, MoMo or bank"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button onClick={submitPayment}>Record payment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Invoice" required>
            <select className={inputClass} value={payForm.invoiceId} onChange={(e) => setPayForm({ ...payForm, invoiceId: e.target.value })}>
              <option value="">Select invoice…</option>
              {outstanding.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} · {inv.student} ({formatMoney(inv.amount - inv.paid)} due)
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (GH₵)" required>
              <input type="number" className={inputClass} value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
            </Field>
            <Field label="Method" required>
              <select className={inputClass} value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value as "MoMo" | "Bank" | "Cash" })}>
                <option>MoMo</option>
                <option>Bank</option>
                <option>Cash</option>
              </select>
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
