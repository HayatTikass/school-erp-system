import { Add01Icon, Wrench01Icon, PackageIcon, LaptopIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, SearchInput, Select, StatCard } from "../../components/ui";
import { assets } from "../../data/mock";
import { formatMoney } from "../../lib/utils";

const maintenanceRequests = [
  { id: "MR-71", item: "School bus — Coaster (GS 4521-24)", issue: "Brake pads worn, service due", raised: "Mr. Eric Nkrumah", priority: "High", status: "In progress" },
  { id: "MR-72", item: "Projector — JHS 3A", issue: "Lamp flickering during lessons", raised: "Ms. Josephine Baah", priority: "Medium", status: "Pending" },
  { id: "MR-73", item: "Ceiling fans — Block A Rm 2", issue: "Two fans not working", raised: "Mrs. Grace Antwi", priority: "Low", status: "Pending" },
];

export default function AdminInventory() {
  const totalValue = assets.reduce((a, s) => a + s.value, 0);

  return (
    <div>
      <PageHeader
        title="Assets & Inventory"
        subtitle="Track school assets, procurement, maintenance and stores."
        actions={
          <>
            <Button variant="secondary" icon={<Wrench01Icon size={18} />}>Log maintenance</Button>
            <Button icon={<Add01Icon size={18} />}>Register asset</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered assets" value="412" delta="9 added" deltaLabel="this term" icon={<PackageIcon size={20} />} />
        <StatCard label="Total asset value" value={formatMoney(totalValue)} delta="revalued Jun 2026" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="ICT equipment" value="54" delta="24 laptops · 6 projectors" deltaLabel="" icon={<LaptopIcon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Open maintenance" value="3" delta="1 high priority" deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Asset register" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search assets…" className="w-72" />
          <Select options={["All categories", "ICT Equipment", "Furniture", "Lab Equipment", "Vehicle"]} />
          <Select options={["All conditions", "Good", "Fair", "Needs service"]} />
        </div>
        <Table>
          <THead cols={["Asset", "Category", "Qty", "Location", "Condition", "Value"]} />
          <tbody>
            {assets.map((a) => (
              <TRow key={a.id}>
                <TCell>
                  <p className="font-semibold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.id}</p>
                </TCell>
                <TCell><Badge tone="gray">{a.category}</Badge></TCell>
                <TCell>{a.qty}</TCell>
                <TCell>{a.location}</TCell>
                <TCell><Badge tone={statusTone(a.condition)} dot>{a.condition}</Badge></TCell>
                <TCell className="font-semibold text-gray-900">{formatMoney(a.value)}</TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

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
