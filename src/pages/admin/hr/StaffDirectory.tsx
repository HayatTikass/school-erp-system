import { useMemo, useState } from "react";
import {
  UserAdd01Icon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  EyeIcon,
  UserBlock01Icon,
  Calendar03Icon,
} from "hugeicons-react";
import {
  PageHeader,
  Card,
  CardHeader,
  Badge,
  statusTone,
  Button,
  Avatar,
  Table,
  THead,
  TRow,
  TCell,
  SearchInput,
  Select,
  StatCard,
} from "../../../components/ui";
import { Modal, ConfirmDialog, Field, inputClass } from "../../../components/Modal";
import type { Staff } from "../../../data/mock";
import { formatMoney, cn } from "../../../lib/utils";
import { useToast } from "../../../components/Toast";
import { useAppStore } from "../../../store/AppStore";

const emptyStaff = {
  name: "",
  role: "",
  department: "Sciences",
  email: "",
  phone: "",
  salary: "4000",
};

export default function StaffDirectory() {
  const { staff: staffList, addStaff, updateStaff } = useAppStore();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All departments");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [viewStaff, setViewStaff] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyStaff);
  const [confirmStatus, setConfirmStatus] = useState<Staff | null>(null);

  const filtered = useMemo(() => {
    return staffList.filter((s) => {
      if (dept !== "All departments" && s.department !== dept) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    });
  }, [staffList, query, dept]);

  const onLeave = staffList.filter((s) => s.status === "On leave").length;

  const openAdd = () => {
    setForm(emptyStaff);
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
    setMenuId(null);
  };

  const submitAdd = () => {
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      toast("Name, role and email are required", "error");
      return;
    }
    const next = addStaff({
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || "—",
      salary: Number(form.salary) || 0,
    });
    toast(`${next.name} added to staff directory`);
    setAddOpen(false);
  };

  const submitEdit = () => {
    if (!editStaff) return;
    updateStaff(editStaff.id, {
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      salary: Number(form.salary) || editStaff.salary,
    });
    toast("Staff profile updated");
    setEditStaff(null);
  };

  const toggleLeaveStatus = () => {
    if (!confirmStatus) return;
    const nextStatus: Staff["status"] = confirmStatus.status === "Active" ? "On leave" : "Active";
    updateStaff(confirmStatus.id, { status: nextStatus });
    toast(`${confirmStatus.name} marked as ${nextStatus.toLowerCase()}`);
    setConfirmStatus(null);
    setMenuId(null);
  };

  return (
    <div onClick={() => menuId && setMenuId(null)}>
      <PageHeader
        title="Staff directory"
        subtitle="Manage staff profiles, roles and leave status."
        actions={
          <Button icon={<UserAdd01Icon size={18} />} onClick={openAdd}>
            Add staff
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard label="Total staff" value={String(staffList.length)} delta={`${filtered.length} shown`} deltaLabel="" />
        <StatCard
          label="On leave today"
          value={String(onLeave)}
          delta={`${staffList.length - onLeave} active`}
          deltaLabel=""
          iconBg="bg-warning-50 text-warning-600"
        />
      </div>

      <Card className="mt-6">
        <CardHeader title="Staff directory" subtitle={`${filtered.length} of ${staffList.length} staff members`} />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput
            placeholder="Search staff…"
            className="w-64"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            options={["All departments", "Sciences", "Languages", "Humanities", "Finance", "Library", "Transport"]}
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
                  <div className="relative flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(s);
                      }}
                    >
                      <PencilEdit02Icon size={18} />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                      title="More actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuId(menuId === s.id ? null : s.id);
                      }}
                    >
                      <MoreVerticalIcon size={18} />
                    </button>
                    {menuId === s.id && (
                      <div
                        className="absolute top-10 right-0 z-20 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setViewStaff(s);
                            setMenuId(null);
                          }}
                        >
                          <EyeIcon size={16} /> View profile
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => openEdit(s)}
                        >
                          <PencilEdit02Icon size={16} /> Edit details
                        </button>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50",
                            s.status === "Active" ? "text-warning-700" : "text-success-700",
                          )}
                          onClick={() => {
                            setConfirmStatus(s);
                            setMenuId(null);
                          }}
                        >
                          {s.status === "Active" ? (
                            <>
                              <Calendar03Icon size={16} /> Mark on leave
                            </>
                          ) : (
                            <>
                              <UserBlock01Icon size={16} /> Mark active
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </TCell>
              </TRow>
            ))}
            {filtered.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400">No staff match your filters.</TCell>
                <TCell /><TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={!!viewStaff}
        onClose={() => setViewStaff(null)}
        title="Staff profile"
        subtitle={viewStaff?.id}
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewStaff(null)}>
              Close
            </Button>
            {viewStaff && (
              <Button
                onClick={() => {
                  openEdit(viewStaff);
                  setViewStaff(null);
                }}
              >
                Edit
              </Button>
            )}
          </>
        }
      >
        {viewStaff && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={viewStaff.name} />
              <div>
                <p className="font-bold text-gray-900">{viewStaff.name}</p>
                <p className="text-sm text-gray-500">{viewStaff.role}</p>
              </div>
              <Badge tone={statusTone(viewStaff.status)} dot className="ml-auto">
                {viewStaff.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Department", viewStaff.department],
                ["Email", viewStaff.email],
                ["Phone", viewStaff.phone],
                ["Salary", formatMoney(viewStaff.salary)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{label}</p>
                  <p className="mt-1 font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add staff member"
        subtitle="Create a new HR staff record"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAdd}>Add staff</Button>
          </>
        }
      >
        <StaffForm form={form} setForm={setForm} />
      </Modal>

      <Modal
        open={!!editStaff}
        onClose={() => setEditStaff(null)}
        title="Edit staff"
        subtitle={editStaff?.id}
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
        <StaffForm form={form} setForm={setForm} />
      </Modal>

      <ConfirmDialog
        open={!!confirmStatus}
        onClose={() => setConfirmStatus(null)}
        onConfirm={toggleLeaveStatus}
        title={confirmStatus?.status === "Active" ? "Mark on leave?" : "Mark active?"}
        message={
          confirmStatus?.status === "Active"
            ? `${confirmStatus.name} will be marked as on leave.`
            : `${confirmStatus?.name} will return to active duty.`
        }
        confirmLabel={confirmStatus?.status === "Active" ? "Mark on leave" : "Mark active"}
      />
    </div>
  );
}

function StaffForm({
  form,
  setForm,
}: {
  form: typeof emptyStaff;
  setForm: (f: typeof emptyStaff) => void;
}) {
  const set = <K extends keyof typeof emptyStaff>(key: K, value: (typeof emptyStaff)[K]) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Full name" required>
        <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="Role / title" required>
        <input className={inputClass} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Teacher — Mathematics" />
      </Field>
      <Field label="Department" required>
        <select className={inputClass} value={form.department} onChange={(e) => set("department", e.target.value)}>
          {["Sciences", "Languages", "Humanities", "Finance", "Library", "Transport", "Human Resources", "Administration"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </Field>
      <Field label="Monthly salary (GH₵)" required>
        <input type="number" className={inputClass} value={form.salary} onChange={(e) => set("salary", e.target.value)} />
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
