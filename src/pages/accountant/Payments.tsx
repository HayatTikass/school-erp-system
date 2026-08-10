import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MoneyReceive01Icon,
  Payment01Icon,
  Cash01Icon,
  CreditCardIcon,
  FileExportIcon,
  ArrowLeft01Icon,
  Add01Icon,
} from "hugeicons-react";
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  Button,
  Badge,
  Avatar,
  Table,
  THead,
  TRow,
  TCell,
  SearchInput,
  Select,
  Tabs,
} from "../../components/ui";
import { Modal, Field, inputClass } from "../../components/Modal";
import { useAppStore } from "../../store/AppStore";
import { formatMoney, formatDate } from "../../lib/utils";
import { useToast } from "../../components/Toast";

type Method = "MoMo" | "Bank" | "Cash" | "All methods";

export default function Payments() {
  const { payments, invoices, recordPayment } = useAppStore();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState<Method>("All methods");
  const [tab, setTab] = useState("All payments");
  const [payOpen, setPayOpen] = useState(false);
  const [payForm, setPayForm] = useState({
    invoiceId: "",
    amount: "",
    method: "MoMo" as "MoMo" | "Bank" | "Cash",
  });

  const outstanding = invoices.filter((i) => i.status !== "Paid");

  const sorted = useMemo(
    () => [...payments].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [payments],
  );

  const filtered = sorted.filter((p) => {
    if (method !== "All methods" && p.method !== method) return false;
    if (tab === "MoMo" && p.method !== "MoMo") return false;
    if (tab === "Bank" && p.method !== "Bank") return false;
    if (tab === "Cash" && p.method !== "Cash") return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.student.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.ref.toLowerCase().includes(q)
    );
  });

  const total = payments.reduce((a, p) => a + p.amount, 0);
  const byMethod = {
    MoMo: payments.filter((p) => p.method === "MoMo").reduce((a, p) => a + p.amount, 0),
    Bank: payments.filter((p) => p.method === "Bank").reduce((a, p) => a + p.amount, 0),
    Cash: payments.filter((p) => p.method === "Cash").reduce((a, p) => a + p.amount, 0),
  };
  const countByMethod = {
    MoMo: payments.filter((p) => p.method === "MoMo").length,
    Bank: payments.filter((p) => p.method === "Bank").length,
    Cash: payments.filter((p) => p.method === "Cash").length,
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
    const payment = recordPayment(
      {
        student: inv.student,
        amount,
        method: payForm.method,
        date: new Date().toISOString().slice(0, 10),
        ref: `${payForm.method === "MoMo" ? "MM" : payForm.method === "Bank" ? "BNK" : "CASH"}-${Date.now().toString().slice(-8)}`,
      },
      inv.id,
    );
    toast(`Payment ${payment.id} recorded — ${formatMoney(amount)} from ${inv.student}`);
    setPayOpen(false);
    setPayForm({ invoiceId: "", amount: "", method: "MoMo" });
  };

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="All fee payments received — MoMo, bank transfer and cash."
        actions={
          <>
            <Link to="/accountant">
              <Button variant="secondary" icon={<ArrowLeft01Icon size={18} />}>
                Back to dashboard
              </Button>
            </Link>
            <Button variant="secondary" icon={<FileExportIcon size={18} />} onClick={() => toast("Payments exported (demo).", "info")}>
              Export
            </Button>
            <Button
              icon={<Add01Icon size={18} />}
              onClick={() => {
                setPayForm({
                  invoiceId: outstanding[0]?.id ?? "",
                  amount: outstanding[0] ? String(outstanding[0].amount - outstanding[0].paid) : "",
                  method: "MoMo",
                });
                setPayOpen(true);
              }}
            >
              Record payment
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total received"
          value={formatMoney(total)}
          delta={`${payments.length} transactions`}
          deltaLabel=""
          icon={<MoneyReceive01Icon size={20} />}
          iconBg="bg-success-50 text-success-600"
        />
        <StatCard
          label="Mobile money"
          value={formatMoney(byMethod.MoMo)}
          delta={`${countByMethod.MoMo} payments`}
          deltaLabel=""
          icon={<Payment01Icon size={20} />}
          iconBg="bg-warning-50 text-warning-600"
        />
        <StatCard
          label="Bank transfers"
          value={formatMoney(byMethod.Bank)}
          delta={`${countByMethod.Bank} payments`}
          deltaLabel=""
          icon={<CreditCardIcon size={20} />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Cash"
          value={formatMoney(byMethod.Cash)}
          delta={`${countByMethod.Cash} payments`}
          deltaLabel=""
          icon={<Cash01Icon size={20} />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(
          [
            { label: "MoMo", amount: byMethod.MoMo, count: countByMethod.MoMo, tone: "warning" as const },
            { label: "Bank", amount: byMethod.Bank, count: countByMethod.Bank, tone: "blue" as const },
            { label: "Cash", amount: byMethod.Cash, count: countByMethod.Cash, tone: "gray" as const },
          ] as const
        ).map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => {
              setTab(s.label);
              setMethod("All methods");
            }}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-xs transition-shadow hover:shadow-md"
          >
            <Badge tone={s.tone}>{s.label}</Badge>
            <p className="mt-3 text-2xl font-bold text-gray-900">{formatMoney(s.amount)}</p>
            <p className="mt-1 text-sm text-gray-500">{s.count} payments · click to filter</p>
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Payment history"
          subtitle="Newest first"
          action={<Tabs tabs={["All payments", "MoMo", "Bank", "Cash"]} active={tab} onChange={setTab} />}
        />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput
            placeholder="Search student, payment ID or reference…"
            className="w-80"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            options={["All methods", "MoMo", "Bank", "Cash"]}
            value={method}
            onChange={(v) => {
              setMethod(v as Method);
              setTab("All payments");
            }}
          />
          <span className="ml-auto text-sm text-gray-500">
            Showing {filtered.length} of {payments.length}
          </span>
        </div>
        <Table>
          <THead cols={["Payment", "Student", "Amount", "Method", "Reference", "Date", ""]} />
          <tbody>
            {filtered.map((p) => (
              <TRow key={p.id}>
                <TCell className="font-semibold text-gray-900">{p.id}</TCell>
                <TCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={p.student} size="sm" />
                    <span className="font-medium text-gray-900">{p.student}</span>
                  </div>
                </TCell>
                <TCell className="font-semibold text-success-700">{formatMoney(p.amount)}</TCell>
                <TCell>
                  <Badge tone={p.method === "MoMo" ? "warning" : p.method === "Bank" ? "blue" : "gray"}>{p.method}</Badge>
                </TCell>
                <TCell>{p.ref}</TCell>
                <TCell>{formatDate(p.date)}</TCell>
                <TCell>
                  <Button variant="secondary" size="sm" onClick={() => toast(`Receipt ${p.ref} ready (demo).`, "info")}>
                    Receipt
                  </Button>
                </TCell>
              </TRow>
            ))}
            {filtered.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400">No payments match this filter.</TCell>
                <TCell /><TCell /><TCell /><TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title="Record payment"
        subtitle="Apply a payment against an outstanding invoice"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitPayment}>Record payment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Invoice" required>
            <select
              className={inputClass}
              value={payForm.invoiceId}
              onChange={(e) => {
                const inv = invoices.find((i) => i.id === e.target.value);
                setPayForm({
                  ...payForm,
                  invoiceId: e.target.value,
                  amount: inv ? String(inv.amount - inv.paid) : payForm.amount,
                });
              }}
            >
              <option value="">Select invoice…</option>
              {outstanding.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} — {inv.student} ({formatMoney(inv.amount - inv.paid)} due)
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (GH₵)" required>
              <input
                type="number"
                className={inputClass}
                value={payForm.amount}
                onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
              />
            </Field>
            <Field label="Method" required>
              <select
                className={inputClass}
                value={payForm.method}
                onChange={(e) => setPayForm({ ...payForm, method: e.target.value as "MoMo" | "Bank" | "Cash" })}
              >
                <option>MoMo</option>
                <option>Bank</option>
                <option>Cash</option>
              </select>
            </Field>
          </div>
          {outstanding.length === 0 && (
            <p className="rounded-lg bg-success-50 px-3 py-2 text-sm text-success-700">
              No outstanding invoices right now — everyone is fully paid.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
