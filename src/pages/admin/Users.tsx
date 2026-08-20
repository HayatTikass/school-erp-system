import { useMemo, useState } from "react";
import {
  UserAdd01Icon,
  CloudUploadIcon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  Key01Icon,
  UserBlock01Icon,
  UserCheck01Icon,
  Add01Icon,
  Cancel01Icon,
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
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/Toast";
import { ROLES, ROLE_META, type Role, type SystemUser } from "../../types/roles";
import { generateTempPassword } from "../../lib/passwords";
import { classes } from "../../data/mock";

const tabs = ["All", "Staff", "Teachers", "Students", "Parents"] as const;
const CREATABLE_ROLES = ROLES.filter((r) => r !== "student");

function emptyChild() {
  return { name: "", email: "", studentClass: "JHS 1A", gender: "M" as "M" | "F" };
}

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
  password: "",
  studentClass: "JHS 1A",
  gender: "M" as "M" | "F",
  parentId: "",
  linkedStudentIds: [] as string[],
  children: [emptyChild()],
};

export default function AdminUsers() {
  const { users, students, addUser, addStudentsToParent, updateUser, setUserStatus, resetPassword } = useAppStore();
  const { user: currentUser } = useAuth();
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
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (!roleMatchesTab(u.role, tab)) return false;
      if (roleFilter !== "All roles" && ROLE_META[u.role].label !== roleFilter) return false;
      if (statusFilter !== "All statuses" && u.status !== statusFilter) return false;
      const q = query.toLowerCase();
      if (!q) return true;
      return (
        (u.name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.id ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, tab, query, roleFilter, statusFilter]);

  const counts = {
    students: users.filter((u) => u.role === "student").length,
    staff: users.filter((u) => !["student", "parent"].includes(u.role)).length,
    parents: users.filter((u) => u.role === "parent").length,
  };

  const openAdd = () => {
    setForm({ ...emptyForm, password: generateTempPassword(), children: [emptyChild()] });
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
      children: [emptyChild()],
      parentId: "",
    });
    setFormError("");
    setMenuUser(null);
  };

  const submitAdd = async () => {
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setFormError("Name, email and phone are required.");
      return;
    }
    if (form.role === "student") {
      setFormError("Students can only be added when creating a parent account.");
      return;
    }
    if (form.role === "parent") {
      const kids = form.children.filter((c) => c.name.trim() || c.email.trim());
      if (kids.length === 0) {
        setFormError("Add at least one student for this parent.");
        return;
      }
      if (kids.some((c) => !c.name.trim() || !c.email.trim())) {
        setFormError("Each student needs a name and email.");
        return;
      }
    }
    const tempPassword = form.password.trim() || generateTempPassword();
    const result = await addUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      department: form.department,
      title: form.title,
      password: tempPassword,
      children:
        form.role === "parent"
          ? form.children
              .filter((c) => c.name.trim() && c.email.trim())
              .map((c) => ({
                name: c.name,
                email: c.email,
                className: c.studentClass,
                gender: c.gender,
                password: tempPassword,
              }))
          : undefined,
    });
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    toast(
      form.role === "parent"
        ? `Parent and student accounts created for ${result.user.name}. Temporary password: ${tempPassword}`
        : `Account created for ${result.user.name}. Temporary password: ${tempPassword}`,
    );
    setAddOpen(false);
  };

  const submitEdit = async () => {
    if (!editUser) return;
    const result = await updateUser(editUser.id, {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      department: form.department,
      title: form.title,
      linkedStudentIds: form.role === "parent" ? form.linkedStudentIds : editUser.linkedStudentIds,
    });
    if (!result.ok) {
      toast(result.error, "error");
      return;
    }
    const newKids = form.role === "parent" ? form.children.filter((c) => c.name.trim() && c.email.trim()) : [];
    if (newKids.length) {
      const kidsResult = await addStudentsToParent(
        editUser.id,
        newKids.map((c) => ({
          name: c.name,
          email: c.email,
          className: c.studentClass,
          gender: c.gender,
        })),
      );
      if (!kidsResult.ok) {
        toast(kidsResult.error, "error");
        return;
      }
    }
    toast("User updated");
    setEditUser(null);
  };

  const runConfirm = async () => {
    if (!confirm) return;
    if (confirm.action === "suspend" && !canSuspend(confirm.user)) {
      toast(
        confirm.user.isSuperAdmin
          ? "The super admin account cannot be suspended."
          : "You cannot suspend your own account.",
        "error",
      );
      setConfirm(null);
      return;
    }
    const result =
      confirm.action === "suspend"
        ? await setUserStatus(confirm.user.id, "Suspended")
        : await setUserStatus(confirm.user.id, "Active");
    if (!result.ok) {
      toast(result.error, "error");
      return;
    }
    if (confirm.action === "suspend") {
      toast(`${confirm.user.name} suspended`, "warning");
    } else {
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

  const submitPasswordChange = async () => {
    if (!passwordUser || passwordSaving) return;
    if (newPassword.trim().length < 4) {
      setPasswordError("Password must be at least 4 characters.");
      return;
    }
    setPasswordSaving(true);
    setPasswordError("");
    const result = await resetPassword(passwordUser.id, newPassword.trim());
    setPasswordSaving(false);
    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }
    toast(`Password updated for ${passwordUser.name}`);
    setPasswordUser(null);
    setNewPassword("");
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
    return u.department || u.title || "None";
  };

  const canSuspend = (u: SystemUser) => {
    if (u.isSuperAdmin) return false;
    if (currentUser && (u.id === currentUser.id || u.email === currentUser.email || u.profileId === currentUser.profileId)) {
      return false;
    }
    return true;
  };

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Create staff and parent accounts. Students are added with their parent."
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
          subtitle="Create staff and parent accounts. Students are added with their parent."
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
          <THead cols={["User", "Role", "Linked / dept", "Status", "Actions"]} />
          <tbody>
            {filtered.map((u) => (
              <TRow key={u.id}>
                <TCell>
                  <div className="flex min-w-52 items-center gap-3">
                    <Avatar name={u.name || u.email || "User"} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{u.name || "Unnamed account"}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </TCell>
                <TCell>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="brand">{ROLE_META[u.role]?.shortLabel ?? u.role}</Badge>
                    {u.isSuperAdmin && <Badge tone="indigo">Super admin</Badge>}
                  </div>
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
                          canSuspend(u) ? (
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
                            <p className="px-3 py-2 text-xs text-gray-400">
                              {u.isSuperAdmin ? "Super admin cannot be suspended" : "You cannot suspend your own account"}
                            </p>
                          )
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
                <TCell className="py-10 text-center text-gray-400" colSpan={5}>
                  {users.length === 0 ? "No accounts loaded yet." : "No users match your filters."}
                </TCell>
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
        subtitle="Admin-created accounts. Students are added with a parent."
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
        <UserForm form={form} setForm={setForm} students={students} error={formError} mode="create" />
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
        <UserForm form={form} setForm={setForm} students={students} error={formError} mode="edit" />
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
            <Button onClick={submitPasswordChange} disabled={passwordSaving}>
              {passwordSaving ? "Saving…" : "Save password"}
            </Button>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") void submitPasswordChange();
              }}
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
                toast("CSV import queued · will process when the database is connected.", "info");
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
          <p className="mt-1 text-xs text-gray-500">Columns: name, email, role, phone. Students are created with their parent.</p>
        </div>
      </Modal>
    </div>
  );
}

function UserForm({
  form,
  setForm,
  students,
  error,
  mode,
}: {
  form: typeof emptyForm;
  setForm: (f: typeof emptyForm) => void;
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
            onChange={(e) => {
              const role = e.target.value as Role;
              setForm({
                ...form,
                role,
                children: role === "parent" && form.children.length === 0 ? [emptyChild()] : form.children,
              });
            }}
          >
            {(mode === "edit" ? ROLES : CREATABLE_ROLES).map((r) => (
              <option key={r} value={r}>
                {ROLE_META[r].label}
              </option>
            ))}
          </select>
        </Field>
        {form.role !== "parent" && (
          <Field label="Department / title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Mathematics teacher"
            />
          </Field>
        )}
        {mode === "create" && (
          <Field label="Temporary password" required hint="Generated for this account. Share it with the user.">
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => set("password", generateTempPassword())}
              >
                Generate
              </Button>
            </div>
          </Field>
        )}
      </div>

      {form.role === "parent" && (
        <div className="rounded-xl border border-brand-200 bg-brand-25 p-4">
          <p className="text-sm font-semibold text-brand-900">
            {mode === "create" ? "Add students" : "Add more students"}
          </p>
          <p className="mt-0.5 text-xs text-brand-700">
            {mode === "create"
              ? "A parent account must include at least one student."
              : "Existing children stay linked. Fill a row to enrol another student."}
          </p>

          {mode === "edit" && (
            <div className="mt-3 space-y-1">
              {students.filter((s) => form.linkedStudentIds.includes(s.id)).map((s) => (
                <p key={s.id} className="text-sm text-gray-800">
                  {s.name} · {s.class}
                </p>
              ))}
              {students.filter((s) => form.linkedStudentIds.includes(s.id)).length === 0 && (
                <p className="text-xs text-gray-500">No students linked yet.</p>
              )}
            </div>
          )}

          <div className="mt-3 space-y-3">
            {form.children.map((child, index) => (
              <div key={index} className="rounded-lg border border-brand-100 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">Student {index + 1}</p>
                  {form.children.length > 1 && (
                    <button
                      type="button"
                      className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => set("children", form.children.filter((_, i) => i !== index))}
                      title="Remove student"
                    >
                      <Cancel01Icon size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Full name" required={mode === "create"}>
                    <input
                      className={inputClass}
                      value={child.name}
                      onChange={(e) => {
                        const next = [...form.children];
                        next[index] = { ...child, name: e.target.value };
                        set("children", next);
                      }}
                    />
                  </Field>
                  <Field label="Email" required={mode === "create"}>
                    <input
                      type="email"
                      className={inputClass}
                      value={child.email}
                      onChange={(e) => {
                        const next = [...form.children];
                        next[index] = { ...child, email: e.target.value };
                        set("children", next);
                      }}
                    />
                  </Field>
                  <Field label="Class" required={mode === "create"}>
                    <select
                      className={inputClass}
                      value={child.studentClass}
                      onChange={(e) => {
                        const next = [...form.children];
                        next[index] = { ...child, studentClass: e.target.value };
                        set("children", next);
                      }}
                    >
                      {classes.map((c) => (
                        <option key={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Gender">
                    <select
                      className={inputClass}
                      value={child.gender}
                      onChange={(e) => {
                        const next = [...form.children];
                        next[index] = { ...child, gender: e.target.value as "M" | "F" };
                        set("children", next);
                      }}
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3"
            icon={<Add01Icon size={16} />}
            onClick={() => set("children", [...form.children, emptyChild()])}
          >
            Add another student
          </Button>
        </div>
      )}
    </div>
  );
}
