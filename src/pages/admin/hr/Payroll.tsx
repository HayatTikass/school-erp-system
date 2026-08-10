import { useMemo, useState } from "react";
import {
  FileExportIcon,
  Add01Icon,
  PencilEdit02Icon,
  Delete02Icon,
} from "hugeicons-react";
import {
  PageHeader,
  Card,
  CardHeader,
  Button,
  Table,
  THead,
  TRow,
  TCell,
  StatCard,
  SearchInput,
  Select,
  Badge,
  statusTone,
  Avatar,
} from "../../../components/ui";
import { Modal, ConfirmDialog, Field, inputClass } from "../../../components/Modal";
import { formatMoney } from "../../../lib/utils";
import { useToast } from "../../../components/Toast";
import { useAppStore } from "../../../store/AppStore";
import type { Staff } from "../../../data/mock";

const emptyForm = {
  name: "",
  role: "",
  department: "Sciences",
  email: "",
  phone: "",
  salary: "4000",
};

const DEPARTMENTS = ["Sciences", "Languages", "Humanities", "Finance", "Library", "Transport", "Human Resources", "Administration"];

export default function Payroll() {
  const { staff: staffList, addStaff, updateStaff, removeStaff } = useAppStore();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All departments");
  const [addOpen, setAddOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return staffList.filter((s) => {
      if (dept !== "All departments" && s.department !== dept) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    });
  }, [staffList, query, dept]);

  const payrollTotal = staffList.reduce((a, s) => a + s.salary, 0);
  const filteredTotal = filtered.reduce((a, s) => a + s.salary, 0);

  const openAdd = () => {
    setForm(emptyForm);
    setAddOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditStaff(s);
    setForm({
      name: s.name,
      role: s.role,
      department: s.department,
      email: s.email,
      phone: s.phone,
      salary: String(s.salary),
    });
  };

  const submitAdd = () => {
    if (!form.name.trim() || !form.role.trim() || !form.email.trim()) {
      toast("Name, role and email are required", "error");
      return;
    }
    const salary = Number(form.salary);
    if (!salary || salary <= 0) {
      toast("Enter a valid salary amount", "error");
      return;
    }
    const next = addStaff({
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || "—",
      salary,
    });
    toast(`Salary record created for ${next.name} — ${formatMoney(salary)}`);
    setAddOpen(false);
  };

  const submitEdit = () => {
    if (!editStaff) return;
    const salary = Number(form.salary);
    if (!salary || salary <= 0) {
      toast("Enter a valid salary amount", "error");
      return;
    }
    updateStaff(editStaff.id, {
      name: form.name.trim() || editStaff.name,
      role: form.role.trim() || editStaff.role,
      department: form.department,
      email: form.email.trim().toLowerCase() || editStaff.email,
      phone: form.phone.trim() || editStaff.phone,
      salary,
    });
    toast(`Salary updated for ${editStaff.name} — ${formatMoney(salary)}`);
    setEditStaff(null);
  };

  const confirmDelete = () => {
    if (!deleteStaff) return;
    removeStaff(deleteStaff.id);
    toast(`Removed ${deleteStaff.name} from payroll`, "warning");
    setDeleteStaff(null);
  };

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Create, update and manage staff salary records."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<FileExportIcon size={18} />}
              onClick={() => toast("Payroll report exported (demo).", "info")}
            >
              Payroll report
            </Button>
            <Button icon={<Add01Icon size={18} />} onClick={openAdd}>
              Add salary record
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly payroll"
          value={formatMoney(payrollTotal)}
          delta={`${staffList.length} staff`}
          deltaLabel=""
          iconBg="bg-success-50 text-success-600"
        />
        <StatCard
          label="SSNIT (13%)"
          value={formatMoney(payrollTotal * 0.13)}
          delta="employer contribution"
          deltaLabel=""
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="PAYE tax"
          value={formatMoney(payrollTotal * 0.17)}
          delta="estimated"
          deltaLabel=""
          iconBg="bg-warning-50 text-warning-600"
        />
        <StatCard
          label="Net payable"
          value={formatMoney(payrollTotal * 0.7)}
          delta="after deductions"
          deltaLabel=""
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Payroll snapshot" subtitle="Current month" />
          <div className="space-y-3 p-5 text-sm">
            {[
              ["Gross salaries", formatMoney(payrollTotal)],
              ["SSNIT contributions (13%)", formatMoney(payrollTotal * 0.13)],
              ["PAYE tax", formatMoney(payrollTotal * 0.17)],
              ["Net payable", formatMoney(payrollTotal * 0.7)],
            ].map(([label, val], i) => (
              <div
                key={label}
                className={`flex justify-between ${i === 3 ? "border-t border-gray-200 pt-3 font-bold text-gray-900" : "text-gray-600"}`}
              >
                <span>{label}</span>
                <span className={i === 3 ? "" : "font-semibold text-gray-900"}>{val}</span>
              </div>
            ))}
            <Button className="mt-2 w-full" onClick={() => toast("July payroll run queued (demo).")}>
              Run July payroll
            </Button>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Staff salaries"
            subtitle={`${filtered.length} shown · ${formatMoney(filteredTotal)} gross`}
            action={
              <Button size="sm" icon={<Add01Icon size={16} />} onClick={openAdd}>
                Add
              </Button>
            }
          />
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
            <SearchInput
              placeholder="Search staff…"
              className="w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select
              options={["All departments", ...DEPARTMENTS]}
              value={dept}
              onChange={setDept}
            />
          </div>
          <Table>
            <THead cols={["Staff member", "Department", "Salary", "Status", ""]} />
            <tbody>
              {filtered.map((s) => (
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
                  <TCell>
                    <Badge tone={statusTone(s.status)} dot>
                      {s.status}
                    </Badge>
                  </TCell>
                  <TCell>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-brand-600"
                        title="Edit salary"
                        onClick={() => openEdit(s)}
                      >
                        <PencilEdit02Icon size={18} />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 hover:bg-error-50 hover:text-error-600"
                        title="Remove from payroll"
                        onClick={() => setDeleteStaff(s)}
                      >
                        <Delete02Icon size={18} />
                      </button>
                    </div>
                  </TCell>
                </TRow>
              ))}
              {filtered.length === 0 && (
                <TRow>
                  <TCell className="py-10 text-center text-gray-400">No salary records match your filters.</TCell>
                  <TCell />
                  <TCell />
                  <TCell />
                  <TCell />
                </TRow>
              )}
            </tbody>
          </Table>
        </Card>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add salary record"
        subtitle="Create a new staff payroll entry"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAdd}>Create record</Button>
          </>
        }
      >
        <SalaryForm form={form} setForm={setForm} />
      </Modal>

      <Modal
        open={!!editStaff}
        onClose={() => setEditStaff(null)}
        title="Edit salary"
        subtitle={editStaff ? `${editStaff.name} · ${editStaff.id}` : undefined}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditStaff(null)}>
              Cancel
            </Button>
            <Button onClick={submitEdit}>Save changes</Button>
          </>
        }
      >
        <SalaryForm form={form} setForm={setForm} />
      </Modal>

      <ConfirmDialog
        open={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        onConfirm={confirmDelete}
        title="Remove from payroll?"
        message={
          deleteStaff
            ? `${deleteStaff.name} (${formatMoney(deleteStaff.salary)}/mo) will be removed from the staff directory and payroll.`
            : ""
        }
        confirmLabel="Remove"
        destructive
      />
    </div>
  );
}

function SalaryForm({
  form,
  setForm,
}: {
  form: typeof emptyForm;
  setForm: (f: typeof emptyForm) => void;
}) {
  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Full name" required>
        <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="Role / title" required>
        <input
          className={inputClass}
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          placeholder="e.g. Teacher — Mathematics"
        />
      </Field>
      <Field label="Department" required>
        <select className={inputClass} value={form.department} onChange={(e) => set("department", e.target.value)}>
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </Field>
      <Field label="Monthly salary (GH₵)" required>
        <input
          type="number"
          min={0}
          step={50}
          className={inputClass}
          value={form.salary}
          onChange={(e) => set("salary", e.target.value)}
        />
      </Field>
      <Field label="Email" required>
        <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
      </Field>
      <Field label="Phone">
        <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </Field>
    </div>
  );
}
