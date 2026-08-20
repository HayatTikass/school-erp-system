import { useState } from "react";
import { Mortarboard01Icon, DatabaseIcon, Notification02Icon, PlugSocketIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Tabs } from "../../components/ui";
import { school, auditLog } from "../../data/mock";
import { cn } from "../../lib/utils";
import { useToast } from "../../components/Toast";

const SETTINGS_KEY = "kingsford.settings";

type SchoolSettings = {
  name: string;
  motto: string;
  email: string;
  phone: string;
  address: string;
  year: string;
};

type NotificationSettings = {
  absenceAlerts: boolean;
  feeReminders: boolean;
  reportCardRelease: boolean;
  lowAttendanceFlags: boolean;
  libraryOverdue: boolean;
};

type PersistedSettings = {
  school: SchoolSettings;
  notifications: NotificationSettings;
};

function loadSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw) as PersistedSettings;
  } catch {
    /* use defaults */
  }
  return {
    school: {
      name: school.name,
      motto: school.motto,
      email: "info@kingsford.edu.gh",
      phone: "030 555 0100",
      address: "12 Boundary Road, East Legon, Accra",
      year: school.year,
    },
    notifications: {
      absenceAlerts: true,
      feeReminders: true,
      reportCardRelease: true,
      lowAttendanceFlags: true,
      libraryOverdue: false,
    },
  };
}

function Field({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
      />
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brand-600" : "bg-gray-200")}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all", checked ? "left-5.5" : "left-0.5")} />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [tab, setTab] = useState("School profile");
  const [settings, setSettings] = useState<PersistedSettings>(loadSettings);

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    toast("Settings saved");
  };

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const updateSchool = (key: keyof SchoolSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      school: { ...prev.school, [key]: value },
    }));
  };

  return (
    <div>
      <PageHeader title="System Settings" subtitle="School profile, notifications, integrations, backups and audit." />

      <div className="mb-6 w-fit">
        <Tabs tabs={["School profile", "Notifications", "Integrations", "Data & audit"]} active={tab} onChange={setTab} />
      </div>

      {tab === "School profile" && (
        <Card className="max-w-3xl">
          <CardHeader title="School profile" subtitle="Branding and identity used across documents and portals." />
          <div className="space-y-5 p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
                <Mortarboard01Icon size={30} />
              </div>
              <div>
                <Button variant="secondary" size="sm" onClick={() => toast("Logo upload coming soon.", "info")}>Change logo</Button>
                <p className="mt-1.5 text-xs text-gray-500">SVG or PNG, at least 256×256px</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="School name" value={settings.school.name} onChange={(v) => updateSchool("name", v)} />
              <Field label="Motto" value={settings.school.motto} onChange={(v) => updateSchool("motto", v)} />
              <Field label="Email" value={settings.school.email} type="email" onChange={(v) => updateSchool("email", v)} />
              <Field label="Phone" value={settings.school.phone} onChange={(v) => updateSchool("phone", v)} />
              <Field label="Address" value={settings.school.address} onChange={(v) => updateSchool("address", v)} />
              <Field label="Current academic year" value={settings.school.year} onChange={(v) => updateSchool("year", v)} />
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
              <Button variant="secondary" onClick={() => setSettings(loadSettings())}>Cancel</Button>
              <Button onClick={saveSettings}>Save changes</Button>
            </div>
          </div>
        </Card>
      )}

      {tab === "Notifications" && (
        <Card className="max-w-3xl">
          <CardHeader title="Notification triggers" subtitle="Choose when the system automatically notifies users." />
          <div className="divide-y divide-gray-100 px-5">
            <Toggle
              label="Absence alerts to parents"
              desc="SMS parents when their child is marked absent by 9:00 AM."
              checked={settings.notifications.absenceAlerts}
              onChange={(v) => updateNotification("absenceAlerts", v)}
            />
            <Toggle
              label="Fee payment reminders"
              desc="Remind parents 7 days and 1 day before invoice due dates."
              checked={settings.notifications.feeReminders}
              onChange={(v) => updateNotification("feeReminders", v)}
            />
            <Toggle
              label="Report card release"
              desc="Email parents when term report cards are approved and published."
              checked={settings.notifications.reportCardRelease}
              onChange={(v) => updateNotification("reportCardRelease", v)}
            />
            <Toggle
              label="Low attendance flags"
              desc="Alert admin when a student drops below 80% attendance."
              checked={settings.notifications.lowAttendanceFlags}
              onChange={(v) => updateNotification("lowAttendanceFlags", v)}
            />
            <Toggle
              label="Library overdue notices"
              desc="Notify students and parents when a borrowed book is overdue."
              checked={settings.notifications.libraryOverdue}
              onChange={(v) => updateNotification("libraryOverdue", v)}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 p-5">
            <Button onClick={saveSettings}>Save notification settings</Button>
          </div>
        </Card>
      )}

      {tab === "Integrations" && (
        <div className="grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { name: "MTN MoMo API", desc: "Collect fee payments via mobile money", status: "Connected" },
            { name: "Hubtel SMS", desc: "Bulk SMS dispatch to parents and staff", status: "Connected" },
            { name: "GCB Bank feed", desc: "Auto-reconcile bank transfer payments", status: "Connected" },
            { name: "Google Workspace", desc: "Staff email and shared drives", status: "Not connected" },
          ].map((i) => (
            <Card key={i.name} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <PlugSocketIcon size={20} />
                </div>
                <Badge tone={i.status === "Connected" ? "success" : "gray"} dot>{i.status}</Badge>
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">{i.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{i.desc}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => toast(i.status === "Connected" ? `${i.name} configuration opened (demo).` : `Connecting to ${i.name}…`, "info")}
              >
                {i.status === "Connected" ? "Configure" : "Connect"}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {tab === "Data & audit" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader title="Backup & export" subtitle="Nightly backups run automatically at 2:00 AM." action={<Badge tone="success" dot>Healthy</Badge>} />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <DatabaseIcon size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Last backup</p>
                    <p className="text-xs text-gray-500">Today, 2:00 AM · 412 MB · verified</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => toast("Restore wizard opened (demo).", "info")}>Restore</Button>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => toast("Backup started · you will be notified when complete.", "info")}>Back up now</Button>
                <Button variant="secondary" className="flex-1" onClick={() => toast("Full data export queued (demo).", "info")}>Export all data</Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Audit trail" subtitle="Recent system activity" action={<Notification02Icon size={18} className="text-gray-400" />} />
            <div className="divide-y divide-gray-100 px-5">
              {auditLog.map((log) => (
                <div key={log.id} className="py-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{log.actor}</span> · {log.action}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{log.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
