import { useState } from "react";
import { PageHeader, Card, CardHeader, Badge, Avatar, Tabs } from "../components/ui";
import { ChangePasswordCard } from "../components/ChangePasswordCard";
import { useAuth } from "../auth/AuthContext";
import { ROLE_META } from "../types/roles";

const TABS = ["Profile", "Security"] as const;

export default function MyAccount() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");

  if (!user) {
    return (
      <div>
        <PageHeader title="My account" subtitle="Your portal login and password." />
        <Card className="p-6 text-sm text-gray-600">Please sign in to view your account.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My account" subtitle="Your login details and password." />

      <div className="mb-6 w-fit">
        <Tabs tabs={[...TABS]} active={tab} onChange={(t) => setTab(t as (typeof TABS)[number])} />
      </div>

      {tab === "Profile" && (
        <Card className="max-w-3xl">
          <CardHeader title="Account details" subtitle="Managed by the school office" />
          <div className="flex items-center gap-4 border-b border-gray-100 px-5 py-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <p className="text-lg font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{ROLE_META[user.role].label}</p>
              {user.isSuperAdmin && (
                <Badge tone="brand" className="mt-1.5">Super admin</Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2">
            {[
              ["Email", user.email],
              ["Phone", user.phone || "None"],
              ["Role", ROLE_META[user.role].label],
              ["Status", user.status],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{label}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Security" && <ChangePasswordCard className="max-w-3xl" />}
    </div>
  );
}
