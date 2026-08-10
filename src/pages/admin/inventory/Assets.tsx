import { useMemo, useState } from "react";
import { Add01Icon, PackageIcon, LaptopIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, SearchInput, Select, StatCard } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { formatMoney } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

const emptyAsset = { name: "", category: "ICT Equipment", qty: "1", location: "", condition: "Good", value: "" };

export default function InventoryAssets() {
  const { assets, addAsset } = useAppStore();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [condition, setCondition] = useState("All conditions");
  const [form, setForm] = useState(emptyAsset);

  const totalValue = assets.reduce((a, s) => a + s.value, 0);
  const ictCount = assets.filter((a) => a.category === "ICT Equipment").length;

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (category !== "All categories" && a.category !== category) return false;
      if (condition !== "All conditions" && a.condition !== condition) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
    });
  }, [assets, query, category, condition]);

  const submitAsset = () => {
    if (!form.name.trim()) {
      toast("Asset name is required", "error");
      return;
    }
    addAsset({
      name: form.name.trim(),
      category: form.category,
      qty: Number(form.qty) || 1,
      location: form.location.trim() || "—",
      condition: form.condition,
      value: Number(form.value) || 0,
    });
    toast(`${form.name.trim()} registered`);
    setAddOpen(false);
    setForm(emptyAsset);
  };

  return (
    <div>
      <PageHeader
        title="Assets & Inventory"
        subtitle="Track school assets, procurement and stores."
        actions={
          <Button
            icon={<Add01Icon size={18} />}
            onClick={() => {
              setForm(emptyAsset);
              setAddOpen(true);
            }}
          >
            Register asset
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Registered assets" value={String(assets.length)} delta={`${filtered.length} shown`} deltaLabel="" icon={<PackageIcon size={20} />} />
        <StatCard label="Total asset value" value={formatMoney(totalValue)} delta="revalued Jun 2026" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="ICT equipment" value={String(ictCount)} delta={`${assets.filter((a) => a.category === "ICT Equipment").reduce((s, a) => s + a.qty, 0)} units`} deltaLabel="" icon={<LaptopIcon size={20} />} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Asset register" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search assets…" className="w-72" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select options={["All categories", "ICT Equipment", "Furniture", "Lab Equipment", "Vehicle"]} value={category} onChange={setCategory} />
          <Select options={["All conditions", "Good", "Fair", "Needs service"]} value={condition} onChange={setCondition} />
        </div>
        <Table>
          <THead cols={["Asset", "Category", "Qty", "Location", "Condition", "Value"]} />
          <tbody>
            {filtered.map((a) => (
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
            {filtered.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400">No assets match your filters.</TCell>
                <TCell /><TCell /><TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Register asset"
        subtitle="Add to asset register"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={submitAsset}>Register asset</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Asset name" required>
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["ICT Equipment", "Furniture", "Lab Equipment", "Vehicle"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Quantity">
              <input type="number" min={1} className={inputClass} value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
            </Field>
            <Field label="Value (GH₵)">
              <input type="number" className={inputClass} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </Field>
          </div>
          <Field label="Location">
            <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Field>
          <Field label="Condition">
            <select className={inputClass} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              {["Good", "Fair", "Needs service"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
