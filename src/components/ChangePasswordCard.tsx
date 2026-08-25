import { useState, type FormEvent } from "react";
import { SquareLock01Icon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { Button, Card, CardHeader } from "./ui";
import { Field, inputClass } from "./Modal";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";
import { cn } from "../lib/utils";

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} required>
      <div className="relative">
        <SquareLock01Icon size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type={visible ? "text" : "password"}
          className={cn(inputClass, "pr-10 pl-10")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <ViewOffSlashIcon size={18} /> : <ViewIcon size={18} />}
        </button>
      </div>
    </Field>
  );
}

export function ChangePasswordCard({ className }: { className?: string }) {
  const { changePassword } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("New password and confirmation do not match.");
      return;
    }
    setSaving(true);
    setError("");
    const result = await changePassword(currentPassword, newPassword);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast("Password updated. Use it the next time you sign in.");
  };

  return (
    <Card className={className}>
      <CardHeader title="Change password" subtitle="Update the password you use to sign in to the portal." />
      <form className="space-y-4 p-5" onSubmit={(e) => void submit(e)}>
        {error && (
          <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">{error}</div>
        )}
        <PasswordField
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Enter current password"
          autoComplete="current-password"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
