import { CheckmarkCircle02Icon, CancelCircleIcon, Clock01Icon } from "hugeicons-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader, Card, CardHeader, Badge, StatCard, Progress, attendanceTone } from "../../components/ui";
import { cn } from "../../lib/utils";

const monthly = [
  { month: "Feb", present: 18, absent: 1 },
  { month: "Mar", present: 21, absent: 1 },
  { month: "Apr", present: 16, absent: 0 },
  { month: "May", present: 20, absent: 1 },
  { month: "Jun", present: 21, absent: 0 },
  { month: "Jul", present: 4, absent: 0 },
];

const bySubject = [
  { name: "Mathematics", rate: 98 },
  { name: "English Language", rate: 96 },
  { name: "Integrated Science", rate: 95 },
  { name: "Social Studies", rate: 97 },
  { name: "ICT", rate: 94 },
  { name: "RME", rate: 96 },
];

const recent = [
  { date: "Mon 6 Jul", status: "Present" },
  { date: "Fri 3 Jul", status: "Present" },
  { date: "Thu 2 Jul", status: "Present" },
  { date: "Wed 1 Jul", status: "Late" },
  { date: "Tue 30 Jun", status: "Present" },
  { date: "Mon 29 Jun", status: "Absent" },
];

export default function StudentAttendance() {
  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Term 3 attendance record — Abena Osei, JHS 2A." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Term attendance" value="96%" delta="above 90% target" deltaLabel="" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Days present" value="100" delta="of 104 school days" deltaLabel="" />
        <StatCard label="Days absent" value="3" delta="2 excused" deltaLabel="" icon={<CancelCircleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Times late" value="1" delta="keep it up" deltaLabel="" icon={<Clock01Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Monthly overview" subtitle="Days present vs absent" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0", fontFamily: "inherit" }} />
                <Bar dataKey="present" name="Present" stackId="a" fill="#12B76A" radius={[0, 0, 0, 0]} barSize={28} />
                <Bar dataKey="absent" name="Absent" stackId="a" fill="#F04438" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent days" />
          <div className="divide-y divide-gray-100 px-5">
            {recent.map((r) => (
              <div key={r.date} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-700">{r.date}</span>
                <Badge tone={r.status === "Present" ? "success" : r.status === "Late" ? "warning" : "error"} dot>{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Attendance by subject" subtitle="Some subjects meet fewer times per week" />
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 p-5 sm:grid-cols-2">
          {bySubject.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-gray-700">{s.name}</span>
                <span className={cn("font-semibold", s.rate >= 90 ? "text-success-600" : "text-warning-600")}>{s.rate}%</span>
              </div>
              <Progress value={s.rate} tone={attendanceTone(s.rate)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
