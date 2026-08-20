import { useState } from "react";
import { Add01Icon, FileExportIcon, MoneyReceive01Icon, Invoice01Icon, Wallet01Icon, AlertCircleIcon } from "hugeicons-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Button, StatCard } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { revenueByMonth } from "../../../data/mock";
import { formatMoney } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

export default function FinanceOverview() {
  const { invoices, students, addInvoice, recordPayment } = useAppStore();
  const { toast } = useToast();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const [invForm, setInvForm] = useState({ studentId: "", item: "Term 3 Tuition", amount: "1850", due: "2026-07-15" });
  const [payForm, setPayForm] = useState({ invoiceId: "", amount: "", method: "MoMo" as "MoMo" | "Bank" | "Cash" });

  const totalBilled = invoices.reduce((a, i) => a + i.amount, 0) || 1;
  const totalPaid = invoices.reduce((a, i) => a + i.paid, 0);
  const outstanding = invoices.filter((i) => i.status !== "Paid");

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
        title="Finance & Fees"
        subtitle="Fee structures, invoicing, payments and financial reporting."
        actions={
          <>
            <Button variant="secondary" icon={<FileExportIcon size={18} />} onClick={() => toast("Financial report exported (demo).", "info")}>
              Financial report
            </Button>
            <Button variant="secondary" icon={<MoneyReceive01Icon size={18} />} onClick={() => setPayOpen(true)}>
              Record payment
            </Button>
            <Button icon={<Add01Icon size={18} />} onClick={() => setInvoiceOpen(true)}>
              Create invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Collected this term" value="GH₵ 451k" delta="12.4%" icon={<MoneyReceive01Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Outstanding fees" value={formatMoney(outstanding.reduce((a, i) => a + (i.amount - i.paid), 0))} delta={`${outstanding.length} invoices`} deltaLabel="unpaid or partial" positive={false} icon={<AlertCircleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Collection rate" value={`${Math.round((totalPaid / totalBilled) * 100)}%`} delta="3.1%" icon={<Wallet01Icon size={20} />} />
        <StatCard label="Scholarships & waivers" value="GH₵ 18.5k" delta="14 students" deltaLabel="supported" icon={<Invoice01Icon size={20} />} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Cash flow" subtitle="Revenue vs expenses, Jan to Jun 2026" />
        <div className="h-64 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12B76A" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#12B76A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#12B76A" strokeWidth={2} fill="url(#rev2)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#F04438" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
