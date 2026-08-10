import { useState } from "react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, StatCard } from "../../../components/ui";
import { ConfirmDialog } from "../../../components/Modal";
import { useToast } from "../../../components/Toast";
import { useAppStore } from "../../../store/AppStore";

export default function LeaveRequests() {
  const { leaveRequests, updateLeaveStatus } = useAppStore();
  const { toast } = useToast();
  const [confirmLeave, setConfirmLeave] = useState<{ id: string; action: "approve" | "decline" } | null>(null);

  const pendingLeave = leaveRequests.filter((l) => l.status === "Pending").length;
  const approvedLeave = leaveRequests.filter((l) => l.status === "Approved").length;

  const handleLeave = () => {
    if (!confirmLeave) return;
    const status = confirmLeave.action === "approve" ? "Approved" : "Declined";
    updateLeaveStatus(confirmLeave.id, status);
    toast(`Leave request ${status.toLowerCase()}`, confirmLeave.action === "approve" ? "success" : "warning");
    setConfirmLeave(null);
  };

  return (
    <div>
      <PageHeader
        title="Leave requests"
        subtitle="Review and approve staff leave applications."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard
          label="Pending"
          value={String(pendingLeave)}
          delta="awaiting review"
          deltaLabel=""
          iconBg="bg-warning-50 text-warning-600"
        />
        <StatCard
          label="Approved"
          value={String(approvedLeave)}
          delta={`${leaveRequests.length} total requests`}
          deltaLabel=""
          iconBg="bg-success-50 text-success-600"
        />
      </div>

      <Card className="mt-6">
        <CardHeader title="Leave requests" action={<Badge tone="warning">{pendingLeave} pending</Badge>} />
        <div className="divide-y divide-gray-100 px-5">
          {leaveRequests.map((l) => (
            <div key={l.id} className="py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{l.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {l.type} · {l.from} → {l.to} ({l.days} days)
                  </p>
                </div>
                <Badge tone={statusTone(l.status)}>{l.status}</Badge>
              </div>
              {l.status === "Pending" && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => setConfirmLeave({ id: l.id, action: "approve" })}>
                    Approve
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setConfirmLeave({ id: l.id, action: "decline" })}>
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))}
          {leaveRequests.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">No leave requests.</p>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={!!confirmLeave}
        onClose={() => setConfirmLeave(null)}
        onConfirm={handleLeave}
        title={confirmLeave?.action === "approve" ? "Approve leave?" : "Decline leave?"}
        message={
          confirmLeave?.action === "approve"
            ? "This leave request will be approved and the staff member notified."
            : "This leave request will be declined."
        }
        confirmLabel={confirmLeave?.action === "approve" ? "Approve" : "Decline"}
        destructive={confirmLeave?.action === "decline"}
      />
    </div>
  );
}
