import { UserMultipleIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Table, THead, TRow, TCell, StatCard, Avatar } from "../../../components/ui";
import { useToast } from "../../../components/Toast";

const routeStudents = [
  { name: "Abena Osei", class: "JHS 2A", route: "Route 1", stop: "American House", paid: true },
  { name: "Kojo Mensah", class: "JHS 2A", route: "Route 2", stop: "Madina Zongo Junction", paid: true },
  { name: "Adwoa Owusu", class: "JHS 2B", route: "Route 1", stop: "Shiashie", paid: false },
  { name: "Yaw Darko", class: "JHS 1A", route: "Route 3", stop: "Palace Mall", paid: true },
  { name: "Ama Sarpong", class: "JHS 1B", route: "Route 2", stop: "Adenta Barrier", paid: false },
];

export default function TransportAssignments() {
  const { toast } = useToast();
  const unpaidCount = routeStudents.filter((s) => !s.paid).length;

  return (
    <div>
      <PageHeader
        title="Route Assignments"
        subtitle="Students registered on school transport."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard label="Registered riders" value={String(routeStudents.length)} delta="across all routes" deltaLabel="" icon={<UserMultipleIcon size={20} />} />
        <StatCard label="Transport fees due" value="GH₵ 4.9k" delta={`${unpaidCount} unpaid riders`} deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Route assignments"
          subtitle="Students registered on transport"
          action={
            <Button variant="secondary" size="sm" onClick={() => toast("Student assignment form coming soon.", "info")}>
              Assign student
            </Button>
          }
        />
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
