import { Pdf01Icon, CheckmarkBadge01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, StatCard } from "../../components/ui";
import { formatMoney } from "../../lib/utils";

const myInvoices = [
  { id: "INV-1041", item: "Term 3 Tuition", amount: 1850, paid: 1850, due: "15 May 2026", status: "Paid" },
  { id: "INV-0987", item: "Term 2 Tuition", amount: 1850, paid: 1850, due: "12 Jan 2026", status: "Paid" },
  { id: "INV-0921", item: "ICT Lab Levy (Year)", amount: 150, paid: 150, due: "12 Jan 2026", status: "Paid" },
  { id: "INV-0864", item: "Term 1 Tuition", amount: 1850, paid: 1850, due: "9 Sep 2025", status: "Paid" },
];

const myPayments = [
  { id: "PAY-2211", desc: "Term 3 Tuition", amount: 1850, method: "MoMo", date: "10 May 2026", ref: "MM-88213345" },
  { id: "PAY-1876", desc: "Term 2 Tuition + ICT Levy", amount: 2000, method: "Bank", date: "8 Jan 2026", ref: "GCB-3319044" },
  { id: "PAY-1420", desc: "Term 1 Tuition", amount: 1850, method: "MoMo", date: "2 Sep 2025", ref: "MM-71100392" },
];

export default function StudentFees() {
  return (
    <div>
      <PageHeader title="Fees & Finance" subtitle="Your invoices, payments and receipts for 2025/26." />

      {/* Balance banner */}
      <Card className="border-success-200 bg-success-25 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-success-100 text-success-600">
              <CheckmarkBadge01Icon size={26} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">All fees settled — GH₵ 0.00 outstanding</p>
              <p className="text-sm text-gray-600">Term 3 tuition was fully paid on 10 May 2026. Thank you!</p>
            </div>
          </div>
          <Button variant="secondary" icon={<Pdf01Icon size={18} />}>Download statement</Button>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Billed this year" value={formatMoney(5700)} delta="4 invoices" deltaLabel="" />
        <StatCard label="Paid this year" value={formatMoney(5700)} delta="100%" deltaLabel="collection" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Scholarship applied" value={formatMoney(0)} delta="not applicable" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Invoices" subtitle="2025/26 academic year" />
          <Table>
            <THead cols={["Invoice", "Item", "Amount", "Status"]} />
            <tbody>
              {myInvoices.map((inv) => (
                <TRow key={inv.id}>
                  <TCell className="font-semibold text-gray-900">{inv.id}</TCell>
                  <TCell>
                    <p className="font-medium text-gray-900">{inv.item}</p>
                    <p className="text-xs text-gray-400">Due {inv.due}</p>
                  </TCell>
                  <TCell className="font-semibold text-gray-900">{formatMoney(inv.amount)}</TCell>
                  <TCell><Badge tone={statusTone(inv.status)} dot>{inv.status}</Badge></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Payment history" subtitle="Receipts available for download" />
          <Table>
            <THead cols={["Payment", "Amount", "Method", "Receipt"]} />
            <tbody>
              {myPayments.map((p) => (
                <TRow key={p.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{p.desc}</p>
                    <p className="text-xs text-gray-400">{p.date} · {p.ref}</p>
                  </TCell>
                  <TCell className="font-semibold text-success-700">{formatMoney(p.amount)}</TCell>
                  <TCell><Badge tone={p.method === "MoMo" ? "warning" : "blue"}>{p.method}</Badge></TCell>
                  <TCell><Button variant="secondary" size="sm" icon={<Pdf01Icon size={16} />}>PDF</Button></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
