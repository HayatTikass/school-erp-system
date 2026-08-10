import { useMemo } from "react";
import { Pdf01Icon, CheckmarkBadge01Icon, Alert01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, StatCard } from "../../components/ui";
import { formatMoney, formatDate } from "../../lib/utils";
import { useAppStore } from "../../store/AppStore";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";
import { useToast } from "../../components/Toast";

export default function StudentFees() {
  const student = useCurrentStudent();
  const { invoices, payments } = useAppStore();
  const { toast } = useToast();

  const myInvoices = useMemo(
    () => (student ? invoices.filter((inv) => inv.student === student.name) : []),
    [invoices, student],
  );
  const myPayments = useMemo(
    () => (student ? payments.filter((p) => p.student === student.name) : []),
    [payments, student],
  );

  const outstanding = useMemo(
    () => myInvoices.reduce((sum, inv) => sum + Math.max(0, inv.amount - inv.paid), 0),
    [myInvoices],
  );
  const billed = myInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paid = myPayments.reduce((sum, p) => sum + p.amount, 0);
  const lastPayment = myPayments[0];

  if (!student) {
    return (
      <div>
        <PageHeader title="Fees & Finance" subtitle="Your invoices, payments and receipts." />
        <Card className="p-6 text-sm text-gray-600">No student profile linked to this account.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Fees & Finance" subtitle={`Your invoices, payments and receipts — ${student.name}.`} />

      {outstanding === 0 ? (
        <Card className="border-success-200 bg-success-25 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-success-100 text-success-600">
                <CheckmarkBadge01Icon size={26} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">All fees settled — {formatMoney(0)} outstanding</p>
                <p className="text-sm text-gray-600">
                  {lastPayment
                    ? `Last payment on ${formatDate(lastPayment.date)}. Thank you!`
                    : "No outstanding balance on your account."}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<Pdf01Icon size={18} />}
              onClick={() => toast("Downloading fee statement (demo)…", "info")}
            >
              Download statement
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-error-200 bg-error-25 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-error-100 text-error-600">
                <Alert01Icon size={26} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{formatMoney(outstanding)} outstanding</p>
                <p className="text-sm text-gray-600">Please settle your balance before the due date. Ask your guardian or visit the bursar.</p>
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<Pdf01Icon size={18} />}
              onClick={() => toast("Downloading fee statement (demo)…", "info")}
            >
              Download statement
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Billed this year" value={formatMoney(billed)} delta={`${myInvoices.length} invoices`} deltaLabel="" />
        <StatCard
          label="Paid this year"
          value={formatMoney(paid)}
          delta={billed > 0 ? `${Math.round((paid / billed) * 100)}%` : "—"}
          deltaLabel="collection"
          iconBg="bg-success-50 text-success-600"
        />
        <StatCard label="Outstanding" value={formatMoney(outstanding)} delta={outstanding === 0 ? "cleared" : "balance due"} deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Invoices" subtitle="2025/26 academic year" />
          {myInvoices.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-gray-500">No invoices on record.</p>
          ) : (
            <Table>
              <THead cols={["Invoice", "Item", "Amount", "Status"]} />
              <tbody>
                {myInvoices.map((inv) => (
                  <TRow key={inv.id}>
                    <TCell className="font-semibold text-gray-900">{inv.id}</TCell>
                    <TCell>
                      <p className="font-medium text-gray-900">{inv.item}</p>
                      <p className="text-xs text-gray-400">Due {formatDate(inv.due)}</p>
                    </TCell>
                    <TCell className="font-semibold text-gray-900">{formatMoney(inv.amount)}</TCell>
                    <TCell><Badge tone={statusTone(inv.status)} dot>{inv.status}</Badge></TCell>
                  </TRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card>
          <CardHeader title="Payment history" subtitle="Receipts available for download" />
          {myPayments.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-gray-500">No payments recorded yet.</p>
          ) : (
            <Table>
              <THead cols={["Payment", "Amount", "Method", "Receipt"]} />
              <tbody>
                {myPayments.map((p) => {
                  const inv = myInvoices.find((i) => Math.abs(i.paid - p.amount) < 1 || i.paid >= p.amount);
                  return (
                    <TRow key={p.id}>
                      <TCell>
                        <p className="font-semibold text-gray-900">{inv?.item ?? "School fee payment"}</p>
                        <p className="text-xs text-gray-400">{formatDate(p.date)} · {p.ref}</p>
                      </TCell>
                      <TCell className="font-semibold text-success-700">{formatMoney(p.amount)}</TCell>
                      <TCell><Badge tone={p.method === "MoMo" ? "warning" : "blue"}>{p.method}</Badge></TCell>
                      <TCell>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Pdf01Icon size={16} />}
                          onClick={() => toast(`Downloading receipt ${p.id} (demo)…`, "info")}
                        >
                          PDF
                        </Button>
                      </TCell>
                    </TRow>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
