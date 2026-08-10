import { useState } from "react";
import { Add01Icon, Bus01Icon, Route01Icon, SteeringIcon } from "hugeicons-react";
import { PageHeader, Card, Badge, statusTone, Button, StatCard } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { formatMoney } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

const emptyRoute = { name: "", driver: "", vehicle: "", students: "0", fee: "", status: "Active" };

export default function TransportRoutes() {
  const { busRoutes, addRoute } = useAppStore();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyRoute);

  const totalRiders = busRoutes.reduce((a, r) => a + r.students, 0);

  const submitRoute = () => {
    if (!form.name.trim() || !form.driver.trim()) {
      toast("Route name and driver are required", "error");
      return;
    }
    addRoute({
      name: form.name.trim(),
      driver: form.driver.trim(),
      vehicle: form.vehicle.trim() || "—",
      students: Number(form.students) || 0,
      fee: Number(form.fee) || 0,
      status: form.status,
    });
    toast(`Route "${form.name.trim()}" added`);
    setAddOpen(false);
    setForm(emptyRoute);
  };

  return (
    <div>
      <PageHeader
        title="Transport Routes"
        subtitle="Bus routes, vehicle assignments and drivers."
        actions={
          <Button
            icon={<Add01Icon size={18} />}
            onClick={() => {
              setForm(emptyRoute);
              setAddOpen(true);
            }}
          >
            Add route
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active routes" value={String(busRoutes.length)} delta={`${totalRiders} riders`} deltaLabel="assigned" icon={<Route01Icon size={20} />} />
        <StatCard label="Fleet vehicles" value="4" delta="1 in maintenance" deltaLabel="" positive={false} icon={<Bus01Icon size={20} />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Drivers" value={String(busRoutes.length)} delta="all licensed" deltaLabel="" icon={<SteeringIcon size={20} />} iconBg="bg-blue-50 text-blue-600" />
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

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add route"
        subtitle="Register a new bus route"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={submitRoute}>Add route</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Route name" required>
            <input className={inputClass} placeholder="e.g. Route 4 — East Legon" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Driver" required>
            <input className={inputClass} value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} />
          </Field>
          <Field label="Vehicle">
            <input className={inputClass} placeholder="GS 4521-24" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Students">
              <input type="number" min={0} className={inputClass} value={form.students} onChange={(e) => setForm({ ...form, students: e.target.value })} />
            </Field>
            <Field label="Fee per term (GH₵)">
              <input type="number" className={inputClass} value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
