import { Add01Icon, Bus01Icon, SteeringIcon, UserMultipleIcon, Route01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, StatCard, Avatar } from "../../components/ui";
import { busRoutes } from "../../data/mock";
import { formatMoney } from "../../lib/utils";

const routeStudents = [
  { name: "Abena Osei", class: "JHS 2A", route: "Route 1", stop: "American House", paid: true },
  { name: "Kojo Mensah", class: "JHS 2A", route: "Route 2", stop: "Madina Zongo Junction", paid: true },
  { name: "Adwoa Owusu", class: "JHS 2B", route: "Route 1", stop: "Shiashie", paid: false },
  { name: "Yaw Darko", class: "JHS 1A", route: "Route 3", stop: "Palace Mall", paid: true },
  { name: "Ama Sarpong", class: "JHS 1B", route: "Route 2", stop: "Adenta Barrier", paid: false },
];

export default function AdminTransport() {
  return (
    <div>
      <PageHeader
        title="Transport Management"
        subtitle="Bus routes, vehicle assignments, drivers and transport fees."
        actions={<Button icon={<Add01Icon size={18} />}>Add route</Button>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active routes" value="3" delta="81 riders" deltaLabel="assigned" icon={<Route01Icon size={20} />} />
        <StatCard label="Fleet vehicles" value="4" delta="1 in maintenance" deltaLabel="" positive={false} icon={<Bus01Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Drivers" value="3" delta="all licensed" deltaLabel="" icon={<SteeringIcon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Transport fees due" value="GH₵ 4.9k" delta="14 unpaid riders" deltaLabel="" positive={false} icon={<UserMultipleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {busRoutes.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Bus01Icon size={22} />
              </div>
              <Badge tone={statusTone(r.status)} dot>{r.status}</Badge>
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">{r.name}</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>Driver — <span className="font-medium text-gray-900">{r.driver}</span></p>
              <p>Vehicle — <span className="font-medium text-gray-900">{r.vehicle}</span></p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-500">{r.students} students</span>
              <span className="text-sm font-bold text-gray-900">{formatMoney(r.fee)}/term</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="Route assignments" subtitle="Students registered on transport" action={<Button variant="secondary" size="sm">Assign student</Button>} />
        <Table>
          <THead cols={["Student", "Class", "Route", "Pick-up stop", "Fee status"]} />
          <tbody>
            {routeStudents.map((s) => (
              <TRow key={s.name}>
                <TCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size="sm" />
                    <span className="font-semibold text-gray-900">{s.name}</span>
                  </div>
                </TCell>
                <TCell>{s.class}</TCell>
                <TCell>{s.route}</TCell>
                <TCell>{s.stop}</TCell>
                <TCell><Badge tone={s.paid ? "success" : "error"} dot>{s.paid ? "Paid" : "Unpaid"}</Badge></TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
