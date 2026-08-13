import { useMemo, useState } from "react";
import {
  UserAdd01Icon,
  CloudUploadIcon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  Key01Icon,
  UserBlock01Icon,
  UserCheck01Icon,
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
  Tabs,
  StatCard,
} from "../../components/ui";
import { Modal, ConfirmDialog, Field, inputClass } from "../../components/Modal";
import { useAppStore } from "../../store/AppStore";
import { useToast } from "../../components/Toast";
import { ROLES, ROLE_META, type Role, type SystemUser } from "../../types/roles";
import { DEMO_PASSWORD } from "../../data/users";
import { classes } from "../../data/mock";
import { cn } from "../../lib/utils";

const tabs = ["All", "Staff", "Teachers", "Students", "Parents"] as const;

function roleMatchesTab(role: Role, tab: string) {
  if (tab === "All") return true;
  if (tab === "Staff") return ["admin", "headmaster", "accountant", "librarian", "hr"].includes(role);
  if (tab === "Teachers") return role === "teacher";
  if (tab === "Students") return role === "student";
  if (tab === "Parents") return role === "parent";
  return true;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "teacher" as Role,
  department: "",
  title: "",
  password: DEMO_PASSWORD,
  studentClass: "JHS 1A",
  gender: "M" as "M" | "F",
  parentId: "",
  linkedStudentIds: [] as string[],
};

export default function AdminUsers() {
  const { users, students, addUser, updateUser, setUserStatus, resetPassword } = useAppStore();
  const { toast } = useToast();
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<SystemUser | null>(null);
  const [menuUser, setMenuUser] = useState<SystemUser | null>(null);
  const [confirm, setConfirm] = useState<{ user: SystemUser; action: "suspend" | "activate" } | null>(null);
  const [passwordUser, setPasswordUser] = useState<SystemUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const parents = users.filter((u) => u.role === "parent" && u.status === "Active");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (!roleMatchesTab(u.role, tab)) return false;
      if (roleFilter !== "All roles" && ROLE_META[u.role].label !== roleFilter) return false;
      if (statusFilter !== "All statuses" && u.status !== statusFilter) return false;
      const q = query.toLowerCase();
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    });
  }, [users, tab, query, roleFilter, statusFilter]);

  const counts = {
    students: users.filter((u) => u.role === "student").length,
    staff: users.filter((u) => !["student", "parent"].includes(u.role)).length,
    parents: users.filter((u) => u.role === "parent").length,
  };

  const openAdd = () => {
    setForm(emptyForm);
    setFormError("");
    setAddOpen(true);
  };

  const openEdit = (u: SystemUser) => {
    setEditUser(u);
    setForm({
      ...emptyForm,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      department: u.department || "",
      title: u.title || "",
      linkedStudentIds: u.linkedStudentIds || [],
      parentId: "",
    });
    setFormError("");
    setMenuUser(null);
  };

  const submitAdd = () => {
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setFormError("Name, email and phone are required.");
      return;
    }
    if (form.role === "student" && !form.parentId) {
      setFormError("Students must be linked to a parent/guardian account.");
      return;
    }
    const result = addUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      department: form.department,
      title: form.title,
      password: form.password || DEMO_PASSWORD,
      studentClass: form.studentClass,
      gender: form.gender,
      parentId: form.parentId || undefined,
      linkedStudentIds: form.role === "parent" ? form.linkedStudentIds : undefined,
    });
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    toast(`${ROLE_META[form.role].label} account created for ${result.user.name}`);
    setAddOpen(false);
  };

  const submitEdit = () => {
    if (!editUser) return;
    updateUser(editUser.id, {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      department: form.department,
      title: form.title,
      linkedStudentIds: form.role === "parent" ? form.linkedStudentIds : editUser.linkedStudentIds,
    });
    toast("User updated");
    setEditUser(null);
  };

  const runConfirm = () => {
    if (!confirm) return;
    if (confirm.action === "suspend") {
      setUserStatus(confirm.user.id, "Suspended");
      toast(`${confirm.user.name} suspended`, "warning");
    } else {
      setUserStatus(confirm.user.id, "Active");
      toast(`${confirm.user.name} activated`);
    }
    setConfirm(null);
    setMenuUser(null);
  };

  const openPasswordChange = (u: SystemUser) => {
    setPasswordUser(u);
    setNewPassword("");
    setPasswordError("");
    setMenuUser(null);
  };

  const submitPasswordChange = () => {
    if (!passwordUser) return;
    if (newPassword.trim().length < 4) {
      setPasswordError("Password must be at least 4 characters.");
      return;
    }
    resetPassword(passwordUser.id, newPassword.trim());
    toast(`Password updated for ${passwordUser.name}`);
    setPasswordUser(null);
  };

  const linkedLabel = (u: SystemUser) => {
    if (u.role === "parent") {
      const kids = students.filter((s) => u.linkedStudentIds?.includes(s.id) || s.parentId === u.id);
      return kids.length ? kids.map((k) => k.name).join(", ") : "No linked students";
    }
    if (u.role === "student") {
      const st = students.find((s) => s.email === u.email || u.linkedStudentIds?.includes(s.id));
      const parent = users.find((p) => p.id === st?.parentId);
      return parent ? `Parent: ${parent.name}` : "No parent linked";
    }
    return u.department || u.title || "—";
  };

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Only admins can create accounts. Students must be linked to a parent."
        actions={
          <>
            <Button variant="secondary" icon={<CloudUploadIcon size={18} />} onClick={() => setImportOpen(true)}>
              Bulk import CSV
            </Button>
            <Button icon={<UserAdd01Icon size={18} />} onClick={openAdd}>
              Add user
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Student accounts" value={String(counts.students)} delta={`${students.length} profiles`} deltaLabel="" />
        <StatCard label="Staff accounts" value={String(counts.staff)} delta="all roles" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Parent accounts" value={String(counts.parents)} delta="linked to students" deltaLabel="" iconBg="bg-success-50 text-success-600" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="All accounts"
          subtitle="Create users, assign roles, link parents to students, reset passwords."
          action={<Tabs tabs={[...tabs]} active={tab} onChange={setTab} />}
        />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search name, email or ID…" className="w-72" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select
            options={["All roles", ...ROLES.map((r) => ROLE_META[r].label)]}
            value={roleFilter}
            onChange={setRoleFilter}
          />
          <Select options={["All statuses", "Active", "Suspended", "Inactive"]} value={statusFilter} onChange={setStatusFilter} />
        </div>

        <Table>
          <THead cols={["User", "Role", "Linked / dept", "Status", ""]} />
          <tbody>
            {filtered.map((u) => (
              <TRow key={u.id}>
                <TCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </TCell>
                <TCell>
                  <Badge tone="brand">{ROLE_META[u.role].shortLabel}</Badge>
                </TCell>
                <TCell className="max-w-56 truncate">{linkedLabel(u)}</TCell>
                <TCell>
                  <Badge tone={statusTone(u.status)} dot>
                    {u.status}
                  </Badge>
                </TCell>
                <TCell>
                  <div className="relative flex items-center gap-1">
                    <button
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                      onClick={() => openEdit(u)}
                      title="Edit"
                    >
                      <PencilEdit02Icon size={18} />
                    </button>
                    <button
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                      onClick={() => setMenuUser(menuUser?.id === u.id ? null : u)}
                      title="More"
                    >
                      <MoreVerticalIcon size={18} />
                    </button>
                    {menuUser?.id === u.id && (
                      <div className="absolute top-10 right-0 z-20 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => openPasswordChange(u)}
                        >
                          <Key01Icon size={16} /> Change password
                        </button>
                        {u.status === "Active" ? (
                          <button
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-error-700 hover:bg-error-50"
                            onClick={() => {
                              setConfirm({ user: u, action: "suspend" });
                              setMenuUser(null);
                            }}
                          >
                            <UserBlock01Icon size={16} /> Suspend account
                          </button>
                        ) : (
                          <button
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-success-700 hover:bg-success-50"
                            onClick={() => {
                              setConfirm({ user: u, action: "activate" });
                              setMenuUser(null);
                            }}
                          >
                            <UserCheck01Icon size={16} /> Activate account
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </TCell>
              </TRow>
            ))}
            {filtered.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400" >
                  No users match your filters.
                </TCell>
                <TCell /><TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
        <div className="flex items-center justify-between px-5 py-3.5 text-sm text-gray-500">
          <span>
            Showing {filtered.length} of {users.length} accounts
          </span>
        </div>
      </Card>

      {/* Add user modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add user"
        subtitle="Admin-created accounts. Default password is used unless you set one."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAdd}>Create account</Button>
          </>
        }
      >
        <UserForm form={form} setForm={setForm} parents={parents} students={students} error={formError} mode="create" />
      </Modal>

      {/* Edit user modal */}
      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit user"
        subtitle={editUser ? ROLE_META[editUser.role].label : ""}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={submitEdit}>Save changes</Button>
          </>
        }
      >
        <UserForm form={form} setForm={setForm} parents={parents} students={students} error={formError} mode="edit" />
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        title={confirm?.action === "suspend" ? "Suspend account?" : "Activate account?"}
        message={
          confirm?.action === "suspend"
            ? `${confirm.user.name} will not be able to sign in until reactivated.`
            : `${confirm?.user.name} will regain portal access.`
        }
        confirmLabel={confirm?.action === "suspend" ? "Suspend" : "Activate"}
        destructive={confirm?.action === "suspend"}
      />

      {/* Change password modal */}
      <Modal
        open={!!passwordUser}
        onClose={() => setPasswordUser(null)}
        title="Change password"
        subtitle={passwordUser ? `Set a new password for ${passwordUser.name}` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPasswordUser(null)}>
              Cancel
            </Button>
            <Button onClick={submitPasswordChange}>Save password</Button>
          </>
        }
      >
        <div className="space-y-4">
          {passwordError && (
            <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              {passwordError}
            </div>
          )}
          <Field label="New password" required>
            <input
              type="text"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new password"
              autoFocus
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Bulk import users"
        subtitle="CSV upload will connect to the database later. For now this is a demo."
        footer={
          <>
            <Button variant="secondary" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setImportOpen(false);
                toast("CSV import queued — will process when the database is connected.", "info");
              }}
            >
              Upload CSV
            </Button>
          </>
        }
      >
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
          <CloudUploadIcon size={32} className="mx-auto text-gray-400" />
          <p className="mt-3 text-sm font-semibold text-gray-900">Drop a CSV file here</p>
          <p className="mt-1 text-xs text-gray-500">Columns: name, email, role, phone, parentEmail (for students)</p>
        </div>
      </Modal>
    </div>
  );
}

function UserForm({
  form,
  setForm,
  parents,
  students,
  error,
  mode,
}: {
  form: typeof emptyForm;
  setForm: (f: typeof emptyForm) => void;
  parents: SystemUser[];
  students: { id: string; name: string; class: string; parentId: string }[];
  error: string;
  mode: "create" | "edit";
}) {
  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="space-y-4">
      {error && <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            disabled={mode === "edit"}
          />
        </Field>
        <Field label="Phone" required>
          <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Role" required>
          <select
            className={inputClass}
            value={form.role}
            disabled={mode === "edit"}
            onChange={(e) => set("role", e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_META[r].label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Department / title">
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Mathematics teacher"
          />
        </Field>
        {mode === "create" && (
          <Field label="Temporary password" hint={`Default: ${DEMO_PASSWORD}`}>
            <input className={inputClass} value={form.password} onChange={(e) => set("password", e.target.value)} />
          </Field>
        )}
      </div>

      {form.role === "student" && mode === "create" && (
        <div className="rounded-xl border border-brand-200 bg-brand-25 p-4">
          <p className="text-sm font-semibold text-brand-900">Student ↔ Parent link</p>
          <p className="mt-0.5 text-xs text-brand-700">Every student must be tied to a parent account.</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Class" required>
              <select className={inputClass} value={form.studentClass} onChange={(e) => set("studentClass", e.target.value)}>
                {classes.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Gender">
              <select className={inputClass} value={form.gender} onChange={(e) => set("gender", e.target.value as "M" | "F")}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </Field>
            <Field label="Parent / guardian" required>
              <select className={inputClass} value={form.parentId} onChange={(e) => set("parentId", e.target.value)}>
                <option value="">Select parent…</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      )}

      {form.role === "parent" && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Link children</p>
          <p className="mt-0.5 text-xs text-gray-500">Select one or more students for this parent.</p>
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
            {students.map((s) => {
              const checked = form.linkedStudentIds.includes(s.id);
              return (
                <label key={s.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      set(
                        "linkedStudentIds",
                        checked ? form.linkedStudentIds.filter((id) => id !== s.id) : [...form.linkedStudentIds, s.id],
                      );
                    }}
                    className="size-4 accent-brand-600"
                  />
                  <span className={cn(checked && "font-semibold text-gray-900")}>
                    {s.name} · {s.class}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
