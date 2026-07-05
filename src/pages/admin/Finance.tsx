import { useState } from "react";
import { Add01Icon, FileExportIcon, MoneyReceive01Icon, Invoice01Icon, Wallet01Icon, AlertCircleIcon } from "hugeicons-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, SearchInput, Select, Tabs, StatCard } from "../../components/ui";
import { invoices, payments, revenueByMonth } from "../../data/mock";
import { formatDate, formatMoney } from "../../lib/utils";

export default function AdminFinance() {
  const [tab, setTab] = useState("Invoices");
  const totalBilled = invoices.reduce((a, i) => a + i.amount, 0);
  const totalPaid = invoices.reduce((a, i) => a + i.paid, 0);

  return (
    <div>
      <PageHeader
        title="Finance & Fees"
        subtitle="Fee structures, invoicing, payments and financial reporting."
        actions={
          <>
            <Button variant="secondary" icon={<FileExportIcon size={18} />}>Financial report</Button>
            <Button icon={<Add01Icon size={18} />}>Create invoice</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Collected this term" value="GH₵ 451k" delta="12.4%" icon={<MoneyReceive01Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Outstanding fees" value="GH₵ 46.2k" delta="31 invoices" deltaLabel="unpaid or partial" positive={false} icon={<AlertCircleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Collection rate" value={`${Math.round((totalPaid / totalBilled) * 100)}%`} delta="3.1%" icon={<Wallet01Icon size={20} />} />
        <StatCard label="Scholarships & waivers" value="GH₵ 18.5k" delta="14 students" deltaLabel="supported" icon={<Invoice01Icon size={20} />} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Cash flow" subtitle="Revenue vs expenses, Jan – Jun 2026" action={<Select options={["Last 6 months", "This term", "This year"]} />} />
        <div className="h-64 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12B76A" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#12B76A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F04438" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#F04438" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#12B76A" strokeWidth={2} fill="url(#rev2)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#F04438" strokeWidth={2} fill="url(#exp2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Billing & payments"
          action={<Tabs tabs={["Invoices", "Payments", "Fee structure"]} active={tab} onChange={setTab} />}
        />

        {tab === "Invoices" && (
          <>
            <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
              <SearchInput placeholder="Search invoices…" className="w-72" />
              <Select options={["All statuses", "Paid", "Partial", "Overdue", "Unpaid"]} />
              <Select options={["All classes", "JHS 1", "JHS 2", "JHS 3"]} />
            </div>
            <Table>
              <THead cols={["Invoice", "Student", "Item", "Amount", "Paid", "Due", "Status"]} />
              <tbody>
                {invoices.map((inv) => (
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
                    <TCell><Badge tone={statusTone(inv.status)} dot>{inv.status}</Badge></TCell>
                  </TRow>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {tab === "Payments" && (
          <Table>
            <THead cols={["Payment", "Student", "Amount", "Method", "Reference", "Date", ""]} />
            <tbody>
              {payments.map((p) => (
                <TRow key={p.id}>
                  <TCell className="font-semibold text-gray-900">{p.id}</TCell>
                  <TCell className="font-medium text-gray-900">{p.student}</TCell>
                  <TCell className="font-semibold text-success-700">{formatMoney(p.amount)}</TCell>
                  <TCell>
                    <Badge tone={p.method === "MoMo" ? "warning" : p.method === "Bank" ? "blue" : "gray"}>{p.method}</Badge>
                  </TCell>
                  <TCell>{p.ref}</TCell>
                  <TCell>{formatDate(p.date)}</TCell>
                  <TCell><Button variant="secondary" size="sm">Receipt</Button></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        )}

        {tab === "Fee structure" && (
          <Table>
            <THead cols={["Fee item", "JHS 1", "JHS 2", "JHS 3", "Frequency"]} />
            <tbody>
              {[
                ["Tuition", 1750, 1850, 1950, "Per term"],
                ["ICT lab levy", 150, 150, 150, "Per term"],
                ["Exam fee", 100, 100, 200, "Per term"],
                ["Bus fee (optional)", 300, 300, 300, "Per term"],
                ["PTA dues", 50, 50, 50, "Per year"],
              ].map((row) => (
                <TRow key={String(row[0])}>
                  <TCell className="font-semibold text-gray-900">{row[0]}</TCell>
                  <TCell>{formatMoney(Number(row[1]))}</TCell>
                  <TCell>{formatMoney(Number(row[2]))}</TCell>
                  <TCell>{formatMoney(Number(row[3]))}</TCell>
                  <TCell><Badge tone="gray">{row[4]}</Badge></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
