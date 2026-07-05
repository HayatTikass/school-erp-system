import { Pdf01Icon, SmartPhone01Icon, BankIcon, Wallet01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, StatCard, Select } from "../../components/ui";
import { formatMoney, cn } from "../../lib/utils";

const familyInvoices = [
  { id: "INV-1041", child: "Abena Osei", item: "Term 3 Tuition", amount: 1850, paid: 1850, status: "Paid" },
  { id: "INV-1102", child: "Kwaku Osei", item: "Term 3 Tuition (Primary)", amount: 1450, paid: 1200, status: "Partial" },
  { id: "INV-1103", child: "Kwaku Osei", item: "Bus Fee — Term 3", amount: 300, paid: 300, status: "Paid" },
  { id: "INV-0987", child: "Abena Osei", item: "Term 2 Tuition", amount: 1850, paid: 1850, status: "Paid" },
];

const history = [
  { id: "PAY-2211", desc: "Term 3 Tuition — Abena", amount: 1850, method: "MoMo", date: "10 May 2026" },
  { id: "PAY-2190", desc: "Term 3 Tuition — Kwaku (part)", amount: 1200, method: "Bank", date: "14 May 2026" },
  { id: "PAY-2101", desc: "Bus Fee — Kwaku", amount: 300, method: "MoMo", date: "20 May 2026" },
];

export default function ParentFees() {
  return (
    <div>
      <PageHeader
        title="Fees & Payments"
        subtitle="Family invoices across all linked children."
        actions={<Select options={["All children", "Abena Osei", "Kwaku Osei"]} />}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Outstanding balance" value={formatMoney(250)} delta="1 partial invoice" deltaLabel="" positive={false} icon={<Wallet01Icon size={20} />} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Paid this year" value={formatMoney(9250)} delta="on time" deltaLabel="every term" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Next due date" value="15 Jul" delta="extended deadline" deltaLabel="" iconBg="bg-warning-50 text-warning-600" />
      </div>

      {/* Pay now */}
      <Card className="mt-6 border-brand-200 bg-brand-25">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-base font-bold text-gray-900">Pay outstanding balance — {formatMoney(250)}</p>
            <p className="mt-0.5 text-sm text-gray-600">Kwaku's Term 3 tuition balance. Choose a payment method below.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "MTN MoMo", icon: SmartPhone01Icon, primary: true },
              { label: "Bank transfer", icon: BankIcon, primary: false },
            ].map((m) => (
              <button
                key={m.label}
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

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Invoices" subtitle="2025/26 academic year — both children" />
          <Table>
            <THead cols={["Invoice", "Child", "Amount", "Status"]} />
            <tbody>
              {familyInvoices.map((inv) => (
                <TRow key={inv.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{inv.item}</p>
                    <p className="text-xs text-gray-400">{inv.id}</p>
                  </TCell>
                  <TCell>{inv.child}</TCell>
                  <TCell>
                    <p className="font-semibold text-gray-900">{formatMoney(inv.amount)}</p>
                    {inv.paid < inv.amount && <p className="text-xs text-error-600">Bal: {formatMoney(inv.amount - inv.paid)}</p>}
                  </TCell>
                  <TCell><Badge tone={statusTone(inv.status)} dot>{inv.status}</Badge></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Payment history" subtitle="Receipts & statements" action={<Button variant="secondary" size="sm" icon={<Pdf01Icon size={16} />}>Statement</Button>} />
          <Table>
            <THead cols={["Payment", "Amount", "Method", "Receipt"]} />
            <tbody>
              {history.map((p) => (
                <TRow key={p.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{p.desc}</p>
                    <p className="text-xs text-gray-400">{p.date}</p>
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
