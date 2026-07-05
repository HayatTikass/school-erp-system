import { Download04Icon, PencilEdit02Icon, StudentCardIcon, FileAttachmentIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Avatar } from "../../components/ui";

const documents = [
  { name: "Admission letter (2024)", size: "182 KB", type: "PDF" },
  { name: "Student ID card", size: "96 KB", type: "PDF" },
  { name: "Term 2 report card", size: "240 KB", type: "PDF" },
  { name: "Immunisation record", size: "310 KB", type: "PDF" },
];

export default function StudentProfile() {
  return (
    <div>
      <PageHeader
        title="My Profile & Documents"
        subtitle="Your academic profile — contact updates require admin approval."
        actions={<Button variant="secondary" icon={<PencilEdit02Icon size={18} />}>Request update</Button>}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Identity card */}
        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-brand-700 to-brand-500" />
          <div className="-mt-9 px-5 pb-6 text-center">
            <div className="mx-auto w-fit rounded-full ring-4 ring-white">
              <Avatar name="Abena Osei" size="lg" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-gray-900">Abena Osei</h3>
            <p className="text-sm text-gray-500">JHS 2A · KA-2401</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge tone="success" dot>Active</Badge>
              <Badge tone="brand">Class rep</Badge>
            </div>
            <div className="mt-5 grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-center">
              {[
                ["3.8", "GPA"],
                ["96%", "Attendance"],
                ["2nd", "Class rank"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="text-lg font-bold text-gray-900">{v}</p>
                  <p className="text-xs text-gray-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card className="xl:col-span-2">
          <CardHeader title="Personal information" subtitle="Verified by the admissions office" action={<StudentCardIcon size={20} className="text-gray-400" />} />
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2">
            {[
              ["Full name", "Abena Serwaa Osei"],
              ["Date of birth", "14 March 2012"],
              ["Gender", "Female"],
              ["Admission date", "5 September 2024"],
              ["Class / stream", "JHS 2A"],
              ["House", "Yellow House (Osu)"],
              ["Guardian", "Kwame Osei (Father)"],
              ["Guardian contact", "024 555 0199"],
              ["Home address", "House No. C14, East Legon, Accra"],
              ["Emergency contact", "Ama Osei — 020 555 0177"],
              ["Blood group", "O+"],
              ["Allergies", "None recorded"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{label}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="My documents" subtitle="Official documents issued by the school" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {documents.map((d) => (
            <div key={d.name} className="rounded-xl border border-gray-200 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <FileAttachmentIcon size={20} />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{d.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">{d.type} · {d.size}</p>
              <Button variant="secondary" size="sm" className="mt-3 w-full" icon={<Download04Icon size={16} />}>Download</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
