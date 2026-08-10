import { PageHeader, Card, CardHeader, Badge, statusTone, Table, THead, TRow, TCell, StatCard } from "../../../components/ui";

const maintenanceRequests = [
  { id: "MR-71", item: "School bus — Coaster (GS 4521-24)", issue: "Brake pads worn, service due", raised: "Mr. Eric Nkrumah", priority: "High", status: "In progress" },
  { id: "MR-72", item: "Projector — JHS 3A", issue: "Lamp flickering during lessons", raised: "Ms. Josephine Baah", priority: "Medium", status: "Pending" },
  { id: "MR-73", item: "Ceiling fans — Block A Rm 2", issue: "Two fans not working", raised: "Mrs. Grace Antwi", priority: "Low", status: "Pending" },
];

export default function InventoryMaintenance() {
  return (
    <div>
      <PageHeader
        title="Maintenance"
        subtitle="Reported issues awaiting action."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Open maintenance" value="3" delta="1 high priority" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="In progress" value="1" delta="being serviced" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Pending" value="2" delta="awaiting assignment" deltaLabel="" iconBg="bg-gray-50 text-gray-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Maintenance requests" subtitle="Reported issues awaiting action" />
        <Table>
          <THead cols={["Request", "Item", "Issue", "Raised by", "Priority", "Status"]} />
          <tbody>
            {maintenanceRequests.map((m) => (
              <TRow key={m.id}>
                <TCell className="font-semibold text-gray-900">{m.id}</TCell>
                <TCell className="font-medium text-gray-900">{m.item}</TCell>
                <TCell>{m.issue}</TCell>
                <TCell>{m.raised}</TCell>
                <TCell><Badge tone={statusTone(m.priority)}>{m.priority}</Badge></TCell>
                <TCell><Badge tone={statusTone(m.status)} dot>{m.status}</Badge></TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
