import {
  StudentsIcon,
  TeacherIcon,
  Wallet01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Calendar03Icon,
} from "hugeicons-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from "recharts";
import { PageHeader, StatCard, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell } from "../../components/ui";
import { revenueByMonth, enrollmentByClass, auditLog, events, invoices, currentUsers } from "../../data/mock";
import { formatDate, formatMoney } from "../../lib/utils";

export default function AdminDashboard() {
  const outstanding = invoices.filter((i) => i.status !== "Paid");

  return (
    <div>
      <PageHeader
        title={`Good afternoon, ${currentUsers.admin.name.split(" ")[1]} 👋`}
        subtitle="Here's what's happening across Kingsford Academy today."
        actions={
          <>
            <Button variant="secondary" icon={<Calendar03Icon size={18} />}>View calendar</Button>
            <Button icon={<ArrowRight01Icon size={18} />}>Generate term report</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value="184" delta="4.2%" icon={<StudentsIcon size={20} />} />
        <StatCard label="Teaching staff" value="26" delta="2 new" deltaLabel="this term" icon={<TeacherIcon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Fees collected" value="GH₵ 451k" delta="12.4%" icon={<Wallet01Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Attendance today" value="93.5%" delta="1.1%" positive={false} deltaLabel="vs yesterday" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue vs expenses" subtitle="Jan – Jun 2026 (GH₵)" action={<Badge tone="success" dot>On track</Badge>} />
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7F56D9" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7F56D9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => formatMoney(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7F56D9" strokeWidth={2} fill="url(#rev)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#98A2B3" strokeWidth={2} strokeDasharray="5 4" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Enrolment by level" subtitle="Boys vs girls" />
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentByClass} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="boys" name="Boys" fill="#7F56D9" radius={[6, 6, 0, 0]} barSize={22} />
                <Bar dataKey="girls" name="Girls" fill="#D6BBFB" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Outstanding invoices"
            subtitle={`${outstanding.length} invoices need attention`}
            action={<Button variant="secondary" size="sm">View all</Button>}
          />
          <Table>
            <THead cols={["Invoice", "Student", "Item", "Balance", "Due date", "Status"]} />
            <tbody>
              {outstanding.slice(0, 5).map((inv) => (
                <TRow key={inv.id}>
                  <TCell className="font-semibold text-gray-900">{inv.id}</TCell>
                  <TCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={inv.student} size="sm" />
                      <span className="font-medium text-gray-900">{inv.student}</span>
                    </div>
                  </TCell>
                  <TCell>{inv.item}</TCell>
                  <TCell className="font-semibold text-gray-900">{formatMoney(inv.amount - inv.paid)}</TCell>
                  <TCell>{formatDate(inv.due)}</TCell>
                  <TCell><Badge tone={statusTone(inv.status)} dot>{inv.status}</Badge></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Upcoming events" />
            <div className="divide-y divide-gray-100 px-5">
              {events.slice(0, 4).map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 py-3">
                  <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <span className="text-xs font-medium uppercase">{new Date(ev.date).toLocaleString("en", { month: "short" })}</span>
                    <span className="text-sm leading-none font-bold">{new Date(ev.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{ev.title}</p>
                    <p className="text-xs text-gray-500">{ev.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent activity" />
            <div className="divide-y divide-gray-100 px-5">
              {auditLog.slice(0, 4).map((log) => (
                <div key={log.id} className="py-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{log.actor}</span> — {log.action}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{log.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
