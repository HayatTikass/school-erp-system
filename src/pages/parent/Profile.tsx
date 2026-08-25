import { useState } from "react";
import { Download04Icon, PencilEdit02Icon, FileAttachmentIcon, CheckmarkBadge01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Avatar, Tabs } from "../../components/ui";
import { Modal, Field, inputClass } from "../../components/Modal";
import { ChangePasswordCard } from "../../components/ChangePasswordCard";
import { useAuth } from "../../auth/AuthContext";
import { useAppStore } from "../../store/AppStore";
import { useParentChildren } from "../../hooks/usePortalIdentity";
import { useToast } from "../../components/Toast";

const TABS = ["Profile", "Documents", "Security"] as const;

const documents = [
  { name: "Enrolment contract 2025/26", size: "420 KB" },
  { name: "School policy handbook", size: "1.2 MB" },
];

export default function ParentProfile() {
  const { user } = useAuth();
  const { children } = useParentChildren();
  const { updateUser } = useAppStore();
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState(user?.phone ?? "");

  if (!user) {
    return (
      <div>
        <PageHeader title="Profile & Documents" subtitle="Guardian details and linked children." />
        <Card className="p-6 text-sm text-gray-600">Please sign in to view your profile.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profile & Documents"
        subtitle="Guardian details, linked children and school documents."
        actions={
          tab === "Profile" ? (
            <Button variant="secondary" icon={<PencilEdit02Icon size={18} />} onClick={() => { setPhone(user.phone); setEditOpen(true); }}>
              Edit contact info
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 w-fit">
        <Tabs tabs={[...TABS]} active={tab} onChange={(t) => setTab(t as (typeof TABS)[number])} />
      </div>

      {tab === "Profile" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">Parent / Guardian</p>
                <Badge tone="success" dot className="mt-1.5">Verified account</Badge>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                ["Phone", user.phone],
                ["Email", user.email],
                ["Linked children", String(children.length)],
                ["Account status", user.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6 xl:col-span-2">
            <Card>
              <CardHeader
                title="Linked children"
                subtitle="Students added with this parent account"
              />
              {children.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-gray-500">No children are linked to this account. Ask the school admin to add a student when they create or edit the parent.</p>
              ) : (
                <div className="divide-y divide-gray-100 px-5">
                  {children.map((c) => (
                    <div key={c.id} className="flex flex-wrap items-center gap-4 py-4">
                      <Avatar name={c.name} color={c.avatarColor} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.class} · {c.id}</p>
                      </div>
                      <Badge tone="brand">{c.gpa.toFixed(1)} GPA</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="School policies" subtitle="Digital acceptance record" action={<Badge tone="success" dot>All accepted</Badge>} />
              <div className="divide-y divide-gray-100 px-5">
                {[
                  ["Code of conduct 2025/26", "Accepted 4 Sep 2025"],
                  ["Digital device policy", "Accepted 4 Sep 2025"],
                  ["Photography consent", "Accepted 4 Sep 2025"],
                ].map(([name, date]) => (
                  <div key={name} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <CheckmarkBadge01Icon size={20} className="text-success-500" />
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                    </div>
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "Documents" && (
        <Card>
          <CardHeader title="Documents" subtitle="Admission and enrolment documents for download" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {documents.map((d) => (
              <div key={d.name} className="rounded-xl border border-gray-200 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <FileAttachmentIcon size={20} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900">{d.name}</p>
                <p className="mt-0.5 text-xs text-gray-400">PDF · {d.size}</p>
                <Button variant="secondary" size="sm" className="mt-3 w-full" icon={<Download04Icon size={16} />} onClick={() => toast(`Downloading ${d.name} (demo)…`, "info")}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Security" && <ChangePasswordCard className="max-w-3xl" />}

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit contact info"
        subtitle="Updates sync to your parent account"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!phone.trim()) {
                  toast("Please enter a phone number", "error");
                  return;
                }
                const result = await updateUser(user.id, { phone: phone.trim() });
                if (!result.ok) {
                  toast(result.error, "error");
                  return;
                }
                toast("Contact details updated");
                setEditOpen(false);
              }}
            >
              Save changes
            </Button>
          </>
        }
      >
        <Field label="Phone number">
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="024 555 0199" />
        </Field>
      </Modal>
    </div>
  );
}
