import { UserAdd01Icon, FileExportIcon, MoreVerticalIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, SearchInput, Select, StatCard } from "../../components/ui";
import { staff } from "../../data/mock";
import { formatMoney } from "../../lib/utils";

const leaveRequests = [
  { id: "LV-11", name: "Mr. Samuel Tetteh", type: "Sick leave", from: "1 Jul", to: "12 Jul", days: 9, status: "Approved" },
  { id: "LV-12", name: "Ms. Comfort Addo", type: "Casual leave", from: "14 Jul", to: "15 Jul", days: 2, status: "Pending" },
  { id: "LV-13", name: "Mr. Eric Nkrumah", type: "Annual leave", from: "3 Aug", to: "14 Aug", days: 10, status: "Pending" },
];

export default function AdminHR() {
  const payrollTotal = staff.reduce((a, s) => a + s.salary, 0);

  return (
    <div>
      <PageHeader
        title="HR & Staff Management"
        subtitle="Staff profiles, payroll, leave and performance."
        actions={
          <>
            <Button variant="secondary" icon={<FileExportIcon size={18} />}>Payroll report</Button>
            <Button icon={<UserAdd01Icon size={18} />}>Add staff</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total staff" value="41" delta="2 new hires" deltaLabel="this term" />
        <StatCard label="Monthly payroll" value={formatMoney(payrollTotal * 5.1)} delta="July run: 28 Jul" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="On leave today" value="1" delta="2 pending requests" deltaLabel="" iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Appraisals due" value="8" delta="by 30 Jul" deltaLabel="" positive={false} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Staff directory" subtitle={`${staff.length} shown of 41 staff members`} />
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
            <SearchInput placeholder="Search staff…" className="w-64" />
            <Select options={["All departments", "Sciences", "Languages", "Humanities", "Finance", "Library", "Transport"]} />
          </div>
          <Table>
            <THead cols={["Staff member", "Department", "Salary", "Status", ""]} />
            <tbody>
              {staff.map((s) => (
                <TRow key={s.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.role}</p>
                      </div>
                    </div>
                  </TCell>
                  <TCell>{s.department}</TCell>
                  <TCell className="font-semibold text-gray-900">{formatMoney(s.salary)}</TCell>
                  <TCell><Badge tone={statusTone(s.status)} dot>{s.status}</Badge></TCell>
                  <TCell><button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><MoreVerticalIcon size={18} /></button></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Leave requests" action={<Badge tone="warning">2 pending</Badge>} />
            <div className="divide-y divide-gray-100 px-5">
              {leaveRequests.map((l) => (
                <div key={l.id} className="py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{l.name}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{l.type} · {l.from} → {l.to} ({l.days} days)</p>
                    </div>
                    <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                  </div>
                  {l.status === "Pending" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm">Approve</Button>
                      <Button variant="secondary" size="sm">Decline</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Payroll snapshot" subtitle="July 2026" />
            <div className="space-y-3 p-5 text-sm">
              {[
                ["Gross salaries", formatMoney(payrollTotal * 5.1)],
                ["SSNIT contributions (13%)", formatMoney(payrollTotal * 5.1 * 0.13)],
                ["PAYE tax", formatMoney(payrollTotal * 5.1 * 0.17)],
                ["Net payable", formatMoney(payrollTotal * 5.1 * 0.7)],
              ].map(([label, val], i) => (
                <div key={label} className={`flex justify-between ${i === 3 ? "border-t border-gray-200 pt-3 font-bold text-gray-900" : "text-gray-600"}`}>
                  <span>{label}</span>
                  <span className={i === 3 ? "" : "font-semibold text-gray-900"}>{val}</span>
                </div>
              ))}
              <Button className="mt-2 w-full">Run July payroll</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
