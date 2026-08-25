import { useMemo } from "react";
import { Pdf01Icon, SmartPhone01Icon, BankIcon, Wallet01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, StatCard, Select } from "../../components/ui";
import { formatMoney, formatDate, cn } from "../../lib/utils";
import { useToast } from "../../components/Toast";
import { useAppStore } from "../../store/AppStore";
import { useParentChildren } from "../../hooks/usePortalIdentity";

export default function ParentFees() {
  const { toast } = useToast();
  const { children, selectedId, setSelectedId, filterChildren } = useParentChildren();
  const { invoices, payments, recordPayment } = useAppStore();

  const childNames = useMemo(() => new Set(filterChildren.map((c) => c.name)), [filterChildren]);

  const familyInvoices = useMemo(
    () => invoices.filter((inv) => childNames.has(inv.student)),
    [invoices, childNames],
  );
  const familyPayments = useMemo(
    () => payments.filter((p) => childNames.has(p.student)),
    [payments, childNames],
  );

  const outstanding = familyInvoices.reduce((sum, inv) => sum + Math.max(0, inv.amount - inv.paid), 0);
  const paidThisYear = familyPayments.reduce((sum, p) => sum + p.amount, 0);
  const nextDue = [...familyInvoices]
    .filter((inv) => inv.amount > inv.paid)
    .sort((a, b) => a.due.localeCompare(b.due))[0];

  const outstandingInvoice = familyInvoices.find((inv) => inv.amount > inv.paid);

  const pay = (method: "MoMo" | "Bank") => {
    if (!outstandingInvoice || outstanding <= 0) {
      toast("No outstanding balance to pay", "error");
      return;
    }
    const amount = Math.min(outstanding, outstandingInvoice.amount - outstandingInvoice.paid);
    recordPayment(
      {
        student: outstandingInvoice.student,
        amount,
        method,
        date: new Date().toISOString().slice(0, 10),
        ref: method === "MoMo" ? `MM-${Date.now().toString().slice(-8)}` : `GCB-${Date.now().toString().slice(-7)}`,
      },
      outstandingInvoice.id,
    );
    toast(`${method === "MoMo" ? "MTN MoMo" : "Bank transfer"} payment of ${formatMoney(amount)} recorded.`);
  };

  const childOptions = ["All children", ...children.map((c) => c.name)];

  return (
    <div>
      <PageHeader
        title="Fees & Payments"
        subtitle="Family invoices across all linked children."
        actions={
          <Select
            options={childOptions}
            value={selectedId === "all" ? "All children" : children.find((c) => c.id === selectedId)?.name ?? "All children"}
            onChange={(v) => {
              if (v === "All children") setSelectedId("all");
              else setSelectedId(children.find((c) => c.name === v)?.id ?? "all");
            }}
          />
        }
      />

      {children.length === 0 ? (
        <Card className="p-6 text-sm text-gray-600">No students linked to this parent account.</Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Outstanding balance" value={formatMoney(outstanding)} delta={outstanding > 0 ? "balance due" : "all clear"} deltaLabel="" positive={outstanding === 0} icon={<Wallet01Icon size={20} />} iconBg={outstanding > 0 ? "bg-error-50 text-error-600" : "bg-success-50 text-success-600"} />
            <StatCard label="Paid this year" value={formatMoney(paidThisYear)} delta={`${familyPayments.length} payments`} deltaLabel="" iconBg="bg-success-50 text-success-600" />
            <StatCard label="Next due date" value={nextDue ? formatDate(nextDue.due).split(" ").slice(0, 2).join(" ") : "None"} delta={nextDue?.item ?? "no dues"} deltaLabel="" iconBg="bg-warning-50 text-warning-600" />
          </div>

          {outstanding > 0 && outstandingInvoice && (
            <Card className="mt-6 border-brand-200 bg-brand-25">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-base font-bold text-gray-900">Pay outstanding balance · {formatMoney(outstanding)}</p>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {outstandingInvoice.student}'s {outstandingInvoice.item}. Choose a payment method below.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "MTN MoMo", icon: SmartPhone01Icon, primary: true, method: "MoMo" as const },
                    { label: "Bank transfer", icon: BankIcon, primary: false, method: "Bank" as const },
                  ].map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => pay(m.method)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-xs transition-colors",
                        m.primary ? "bg-brand-600 text-white hover:bg-brand-700" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <m.icon size={18} /> {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader title="Invoices" subtitle="2025/26 academic year" />
              {familyInvoices.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-gray-500">No invoices for selected children.</p>
              ) : (
                <Table>
                  <THead cols={["Invoice", "Child", "Amount", "Status"]} />
                  <tbody>
                    {familyInvoices.map((inv) => (
                      <TRow key={inv.id}>
                        <TCell>
                          <p className="font-semibold text-gray-900">{inv.item}</p>
                          <p className="text-xs text-gray-400">{inv.id}</p>
                        </TCell>
                        <TCell>{inv.student}</TCell>
                        <TCell>
                          <p className="font-semibold text-gray-900">{formatMoney(inv.amount)}</p>
                          {inv.paid < inv.amount && <p className="text-xs text-error-600">Bal: {formatMoney(inv.amount - inv.paid)}</p>}
                        </TCell>
                        <TCell><Badge tone={statusTone(inv.status)} dot>{inv.status}</Badge></TCell>
                      </TRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>

            <Card>
              <CardHeader
                title="Payment history"
                subtitle="Receipts & statements"
                action={
                  <Button variant="secondary" size="sm" icon={<Pdf01Icon size={16} />} onClick={() => toast("Downloading family statement (demo)…", "info")}>
                    Statement
                  </Button>
                }
              />
              {familyPayments.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-gray-500">No payments recorded yet.</p>
              ) : (
                <Table>
                  <THead cols={["Payment", "Amount", "Method", "Receipt"]} />
                  <tbody>
                    {familyPayments.map((p) => (
                      <TRow key={p.id}>
                        <TCell>
                          <p className="font-semibold text-gray-900">{p.student}</p>
                          <p className="text-xs text-gray-400">{formatDate(p.date)} · {p.ref}</p>
                        </TCell>
                        <TCell className="font-semibold text-success-700">{formatMoney(p.amount)}</TCell>
                        <TCell><Badge tone={p.method === "MoMo" ? "warning" : "blue"}>{p.method}</Badge></TCell>
                        <TCell>
                          <Button variant="secondary" size="sm" icon={<Pdf01Icon size={16} />} onClick={() => toast(`Downloading receipt ${p.id} (demo)…`, "info")}>
                            PDF
                          </Button>
                        </TCell>
                      </TRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
