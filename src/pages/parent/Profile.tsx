import { Download04Icon, PencilEdit02Icon, FileAttachmentIcon, CheckmarkBadge01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Avatar } from "../../components/ui";

const documents = [
  { name: "Admission letter — Abena (2024)", size: "182 KB" },
  { name: "Admission letter — Kwaku (2023)", size: "178 KB" },
  { name: "Enrolment contract 2025/26", size: "420 KB" },
  { name: "School policy handbook", size: "1.2 MB" },
];

export default function ParentProfile() {
  return (
    <div>
      <PageHeader
        title="Profile & Documents"
        subtitle="Guardian details, linked children and school documents."
        actions={<Button variant="secondary" icon={<PencilEdit02Icon size={18} />}>Edit contact info</Button>}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar name="Kwame Osei" size="lg" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Kwame Osei</h3>
              <p className="text-sm text-gray-500">Parent / Guardian</p>
              <Badge tone="success" dot className="mt-1.5">Verified account</Badge>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Phone", "024 555 0199"],
              ["Email", "kwame.osei@gmail.com"],
              ["Home address", "House No. C14, East Legon, Accra"],
              ["Occupation", "Civil Engineer"],
              ["Relationship", "Father"],
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
            <CardHeader title="Linked children" subtitle="Students under your guardianship" action={<Button variant="secondary" size="sm">Link a child</Button>} />
            <div className="divide-y divide-gray-100 px-5">
              {[
                { name: "Abena Osei", detail: "JHS 2A · KA-2401 · admitted Sep 2024", gpa: "3.8 GPA" },
                { name: "Kwaku Osei", detail: "Primary 5 · KA-2318 · admitted Sep 2023", gpa: "3.4 GPA" },
              ].map((c) => (
                <div key={c.name} className="flex flex-wrap items-center gap-4 py-4">
                  <Avatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.detail}</p>
                  </div>
                  <Badge tone="brand">{c.gpa}</Badge>
                  <Button variant="secondary" size="sm">View profile</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="School policies"
              subtitle="Digital acceptance record"
              action={<Badge tone="success" dot>All accepted</Badge>}
            />
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

      <Card className="mt-6">
        <CardHeader title="Documents" subtitle="Admission and enrolment documents for download" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {documents.map((d) => (
            <div key={d.name} className="rounded-xl border border-gray-200 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <FileAttachmentIcon size={20} />
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900">{d.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">PDF · {d.size}</p>
              <Button variant="secondary" size="sm" className="mt-3 w-full" icon={<Download04Icon size={16} />}>Download</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
