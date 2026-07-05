import { useState } from "react";
import { Mortarboard01Icon, DatabaseIcon, Notification02Icon, PlugSocketIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Tabs } from "../../components/ui";
import { school, auditLog } from "../../data/mock";
import { cn } from "../../lib/utils";

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        defaultValue={value}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
      />
    </div>
  );
}

function Toggle({ label, desc, on = true }: { label: string; desc: string; on?: boolean }) {
  const [checked, setChecked] = useState(on);
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brand-600" : "bg-gray-200")}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all", checked ? "left-5.5" : "left-0.5")} />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [tab, setTab] = useState("School profile");

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
                <Button variant="secondary" size="sm">Change logo</Button>
                <p className="mt-1.5 text-xs text-gray-500">SVG or PNG, at least 256×256px</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="School name" value={school.name} />
              <Field label="Motto" value={school.motto} />
              <Field label="Email" value="info@kingsford.edu.gh" type="email" />
              <Field label="Phone" value="030 555 0100" />
              <Field label="Address" value="12 Boundary Road, East Legon, Accra" />
              <Field label="Current academic year" value={school.year} />
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
              <Button variant="secondary">Cancel</Button>
              <Button>Save changes</Button>
            </div>
          </div>
        </Card>
      )}

      {tab === "Notifications" && (
        <Card className="max-w-3xl">
          <CardHeader title="Notification triggers" subtitle="Choose when the system automatically notifies users." />
          <div className="divide-y divide-gray-100 px-5">
            <Toggle label="Absence alerts to parents" desc="SMS parents when their child is marked absent by 9:00 AM." />
            <Toggle label="Fee payment reminders" desc="Remind parents 7 days and 1 day before invoice due dates." />
            <Toggle label="Report card release" desc="Email parents when term report cards are approved and published." />
            <Toggle label="Low attendance flags" desc="Alert admin when a student drops below 80% attendance." />
            <Toggle label="Library overdue notices" desc="Notify students and parents when a borrowed book is overdue." on={false} />
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
              <Button variant="secondary" size="sm" className="mt-4">{i.status === "Connected" ? "Configure" : "Connect"}</Button>
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
                <Button variant="secondary" size="sm">Restore</Button>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1">Back up now</Button>
                <Button variant="secondary" className="flex-1">Export all data</Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Audit trail" subtitle="Recent system activity" action={<Notification02Icon size={18} className="text-gray-400" />} />
            <div className="divide-y divide-gray-100 px-5">
              {auditLog.map((log) => (
                <div key={log.id} className="py-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{log.actor}</span> — {log.action}
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
