import { useState } from "react";
import { Download04Icon, PencilEdit02Icon, StudentCardIcon, FileAttachmentIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Avatar, Tabs } from "../../components/ui";
import { ChangePasswordCard } from "../../components/ChangePasswordCard";
import { useAuth } from "../../auth/AuthContext";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";
import { useToast } from "../../components/Toast";

const TABS = ["Profile", "Documents", "Security"] as const;

const documents = [
  { name: "Admission letter", size: "182 KB", type: "PDF" },
  { name: "Student ID card", size: "96 KB", type: "PDF" },
  { name: "Latest report card", size: "240 KB", type: "PDF" },
  { name: "Immunisation record", size: "310 KB", type: "PDF" },
];

export default function StudentProfile() {
  const { user } = useAuth();
  const student = useCurrentStudent();
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");

  if (!user) {
    return (
      <div>
        <PageHeader title="My Profile & Documents" subtitle="Your academic profile." />
        <Card className="p-6 text-sm text-gray-600">Please sign in to view your profile.</Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <PageHeader title="My Profile & Documents" subtitle="Your academic profile." />
        <div className="mb-6 w-fit">
          <Tabs tabs={[...TABS]} active={tab} onChange={(t) => setTab(t as (typeof TABS)[number])} />
        </div>
        {tab === "Security" ? (
          <ChangePasswordCard className="max-w-3xl" />
        ) : (
          <Card className="p-6 text-sm text-gray-600">No student profile linked to this account.</Card>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile & Documents"
        subtitle="Your academic profile · contact updates require admin approval."
        actions={
          tab === "Profile" ? (
            <Button
              variant="secondary"
              icon={<PencilEdit02Icon size={18} />}
              onClick={() => toast("Update request sent to the admissions office", "info")}
            >
              Request update
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 w-fit">
        <Tabs tabs={[...TABS]} active={tab} onChange={(t) => setTab(t as (typeof TABS)[number])} />
      </div>

      {tab === "Profile" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-brand-700 to-brand-500" />
            <div className="-mt-9 px-5 pb-6 text-center">
              <div className="mx-auto w-fit rounded-full ring-4 ring-white">
                <Avatar name={student.name} size="lg" color={student.avatarColor} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500">{student.class} · {student.id}</p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge tone={student.status === "Active" ? "success" : "warning"} dot>{student.status}</Badge>
              </div>
              <div className="mt-5 grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-center">
                {[
                  [student.gpa.toFixed(1), "GPA"],
                  [`${student.attendance}%`, "Attendance"],
                  [student.feesOwed === 0 ? "Paid" : "Due", "Fees"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <p className="text-lg font-bold text-gray-900">{v}</p>
                    <p className="text-xs text-gray-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader title="Personal information" subtitle="Verified by the admissions office" action={<StudentCardIcon size={20} className="text-gray-400" />} />
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2">
              {[
                ["Full name", student.name],
                ["Student ID", student.id],
                ["Email", student.email],
                ["Class / stream", student.class],
                ["Gender", student.gender === "F" ? "Female" : "Male"],
                ["Guardian", student.guardian],
                ["Account phone", user.phone],
                ["Account email", user.email],
                ["Status", student.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "Documents" && (
        <Card>
          <CardHeader title="My documents" subtitle="Official documents issued by the school" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {documents.map((d) => (
              <div key={d.name} className="rounded-xl border border-gray-200 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <FileAttachmentIcon size={20} />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">{d.name}</p>
                <p className="mt-0.5 text-xs text-gray-400">{d.type} · {d.size}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 w-full"
                  icon={<Download04Icon size={16} />}
                  onClick={() => toast(`Downloading ${d.name} (demo)…`, "info")}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Security" && <ChangePasswordCard className="max-w-3xl" />}
    </div>
  );
}
