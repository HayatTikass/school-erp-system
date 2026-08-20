import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Wallet01Icon,
  ArrowRight01Icon,
  MoneyReceive01Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  UserMultipleIcon,
  Invoice01Icon,
} from "hugeicons-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  Button,
  Badge,
  statusTone,
  Avatar,
  Table,
  THead,
  TRow,
  TCell,
} from "../../components/ui";
import { useAuth } from "../../auth/AuthContext";
import { useAppStore } from "../../store/AppStore";
import { revenueByMonth } from "../../data/mock";
import { formatMoney, formatDate } from "../../lib/utils";
import { buildStudentFeeLedger, feeBadgeStatus } from "./buildFeeLedger";

export default function AccountantDashboard() {
  const { user } = useAuth();
  const { students, invoices, payments } = useAppStore();

  const ledger = useMemo(
    () => buildStudentFeeLedger(students, invoices, payments),
    [students, invoices, payments],
  );

  const fullyPaid = ledger.filter((r) => r.status === "Fully paid");
  const partial = ledger.filter((r) => r.status === "Partial");
  const owing = ledger.filter((r) => r.status === "Owing" || r.status === "Overdue");
  const overdue = ledger.filter((r) => r.status === "Overdue");

  const totalBilled = ledger.reduce((a, r) => a + r.billed, 0);
  const totalPaid = ledger.reduce((a, r) => a + r.paid, 0);
  const totalBalance = ledger.reduce((a, r) => a + r.balance, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const pieData = [
    { name: "Fully paid", value: fullyPaid.length, color: "#12B76A" },
    { name: "Partial", value: partial.length, color: "#F79009" },
    { name: "Owing", value: owing.filter((r) => r.status === "Owing").length, color: "#98A2B3" },
    { name: "Overdue", value: overdue.length, color: "#F04438" },
  ].filter((d) => d.value > 0);

  const recentPayments = [...payments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <div>
      <PageHeader
        title={`Finance desk · ${user?.name.split(" ")[1] || user?.name}`}
        subtitle="Collection overview · open the student fee ledger for the full list."
        actions={
          <>
            <Link to="/accountant/ledger">
              <Button variant="secondary" icon={<Invoice01Icon size={18} />}>
                Student fee ledger
              </Button>
            </Link>
            <Link to="/accountant/finance">
              <Button icon={<ArrowRight01Icon size={18} />}>Finance module</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total collected"
          value={formatMoney(totalPaid)}
          delta={`${collectionRate}% of billed`}
          deltaLabel=""
          icon={<MoneyReceive01Icon size={20} />}
          iconBg="bg-success-50 text-success-600"
        />
        <StatCard
          label="Outstanding balance"
          value={formatMoney(totalBalance)}
          delta={`${owing.length} students owing`}
          deltaLabel=""
          positive={false}
          icon={<AlertCircleIcon size={20} />}
          iconBg="bg-error-50 text-error-600"
        />
        <StatCard
          label="Fully paid students"
          value={String(fullyPaid.length)}
          delta={`of ${ledger.length} students`}
          deltaLabel=""
          icon={<CheckmarkCircle02Icon size={20} />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Collection rate"
          value={`${collectionRate}%`}
          delta={`${partial.length} partial · ${overdue.length} overdue`}
          deltaLabel=""
          icon={<Wallet01Icon size={20} />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Collections trend" subtitle="Revenue vs expenses (GH₵)" action={<Badge tone="success" dot>On track</Badge>} />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="acctRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12B76A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#12B76A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Area type="monotone" dataKey="revenue" name="Collected" stroke="#12B76A" strokeWidth={2} fill="url(#acctRev)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#98A2B3" strokeWidth={2} strokeDasharray="5 4" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Payment status mix" subtitle="Students by fee status" />
          <div className="flex h-64 items-center gap-2 p-4">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="min-w-0 flex-1 space-y-2.5">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-bold text-gray-900">{d.value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs text-gray-500">Overall billed</p>
                <p className="text-sm font-bold text-gray-900">{formatMoney(totalBilled)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Snapshot cards → open ledger filtered */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Fully paid", count: fullyPaid.length, amount: fullyPaid.reduce((a, r) => a + r.paid, 0), tone: "success" as const, to: "/accountant/ledger?status=paid", desc: "No outstanding balance" },
          { label: "Partially paid", count: partial.length, amount: partial.reduce((a, r) => a + r.balance, 0), tone: "warning" as const, to: "/accountant/ledger?status=partial", desc: "Balance still due" },
          { label: "Owing / overdue", count: owing.length, amount: owing.reduce((a, r) => a + r.balance, 0), tone: "error" as const, to: "/accountant/ledger?status=owing", desc: "Needs follow-up" },
        ].map((s) => (
          <Link key={s.label} to={s.to} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <Badge tone={s.tone} dot>
                {s.label}
              </Badge>
              <UserMultipleIcon size={18} className="text-gray-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">{s.count}</p>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {s.tone === "success" ? "Collected" : "Balance"}: {formatMoney(s.amount)}
            </p>
            <p className="mt-3 text-sm font-semibold text-brand-700">Open ledger →</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent payments"
            subtitle="Latest money received"
            action={
              <Link to="/accountant/payments" className="text-sm font-semibold text-brand-700">
                View all
              </Link>
            }
          />
          <Table>
            <THead cols={["Student", "Amount", "Method", "Date"]} />
            <tbody>
              {recentPayments.map((p) => (
                <TRow key={p.id}>
                  <TCell className="font-semibold text-gray-900">{p.student}</TCell>
                  <TCell className="font-semibold text-success-700">{formatMoney(p.amount)}</TCell>
                  <TCell>
                    <Badge tone={p.method === "MoMo" ? "warning" : p.method === "Bank" ? "blue" : "gray"}>{p.method}</Badge>
                  </TCell>
                  <TCell>{formatDate(p.date)}</TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader
            title="Highest outstanding balances"
            subtitle="Prioritise follow-up"
            action={
              <Link to="/accountant/ledger?status=owing">
                <Badge tone="error" dot>
                  View all owing
                </Badge>
              </Link>
            }
          />
          <div className="divide-y divide-gray-100 px-5">
            {[...owing]
              .sort((a, b) => b.balance - a.balance)
              .slice(0, 6)
              .map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 py-3.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                    {i + 1}
                  </span>
                  <Avatar name={r.name} color={r.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">
                      {r.class} · Guardian: {r.guardian}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-error-600">{formatMoney(r.balance)}</p>
                    <Badge tone={statusTone(feeBadgeStatus(r.status))} className="mt-0.5">
                      {r.status}
                    </Badge>
                  </div>
                </div>
              ))}
            {owing.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">All students are fully paid</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
