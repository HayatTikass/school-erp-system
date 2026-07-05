import { SentIcon, CheckmarkCircle02Icon, CancelCircleIcon, Clock01Icon } from "hugeicons-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, Button, StatCard, Select } from "../../components/ui";
import { attendanceTrend } from "../../data/mock";

const recentDays = [
  { date: "Mon 6 Jul", status: "Present", note: "" },
  { date: "Fri 3 Jul", status: "Present", note: "" },
  { date: "Thu 2 Jul", status: "Present", note: "" },
  { date: "Wed 1 Jul", status: "Late", note: "Arrived 7:52 AM (traffic)" },
  { date: "Tue 30 Jun", status: "Present", note: "" },
  { date: "Mon 29 Jun", status: "Absent", note: "Excused — medical appointment" },
];

export default function ParentAttendance() {
  return (
    <div>
      <PageHeader
        title="Attendance Monitoring — Abena"
        subtitle="Daily records, alerts and excuse submission."
        actions={<Select options={["Term 3 · 2025/26", "Term 2 · 2025/26"]} />}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Term attendance" value="96%" delta="class avg: 92%" deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Days absent" value="3" delta="2 excused" deltaLabel="" icon={<CancelCircleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Times late" value="1" delta="this term" deltaLabel="" icon={<Clock01Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Absence alerts" value="On" delta="SMS + in-app" deltaLabel="enabled" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Weekly trend" subtitle="Attendance rate across Term 3" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#12B76A" strokeWidth={2.5} dot={{ fill: "#12B76A", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Submit an excuse" subtitle="Notify the school of an absence" />
          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Date of absence</label>
              <input type="date" defaultValue="2026-07-07" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Reason</label>
              <textarea rows={3} placeholder="e.g. Medical appointment…" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none" />
            </div>
            <Button className="w-full" icon={<SentIcon size={18} />}>Send to class teacher</Button>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Recent daily record" subtitle="Last 6 school days" />
        <div className="divide-y divide-gray-100 px-5">
          {recentDays.map((r) => (
            <div key={r.date} className="flex flex-wrap items-center gap-3 py-3.5">
              <span className="w-28 text-sm font-semibold text-gray-900">{r.date}</span>
              <Badge tone={r.status === "Present" ? "success" : r.status === "Late" ? "warning" : "error"} dot>{r.status}</Badge>
              {r.note && <span className="text-sm text-gray-500">{r.note}</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
