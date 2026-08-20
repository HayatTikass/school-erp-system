import type { AccountStatus, Role, SystemUser } from "../types/roles";
import { supabase } from "./supabase";

export type ProfileRow = {
  id: string;
  auth_user_id: string | null;
  legacy_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: AccountStatus;
  department: string | null;
  title: string | null;
  created_at: string;
  is_super_admin?: boolean;
};

export function profileToUser(row: ProfileRow, previous?: SystemUser): SystemUser {
  return {
    id: row.legacy_id || row.id,
    profileId: row.id,
    name: row.full_name || row.email,
    email: row.email,
    password: "",
    role: row.role,
    phone: row.phone || "",
    status: row.status || "Active",
    department: row.department || undefined,
    title: row.title || undefined,
    createdAt: (row.created_at ?? "").slice(0, 10),
    linkedStudentIds: previous?.linkedStudentIds,
    isSuperAdmin: Boolean(row.is_super_admin),
  };
}

export async function fetchProfileByAuthId(authUserId: string): Promise<SystemUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, auth_user_id, legacy_id, full_name, email, phone, role, status, department, title, created_at, is_super_admin")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (error || !data) return null;
  return profileToUser(data as ProfileRow);
}

export async function fetchProfiles(): Promise<SystemUser[] | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, auth_user_id, legacy_id, full_name, email, phone, role, status, department, title, created_at, is_super_admin")
    .order("created_at", { ascending: true });
  if (error) return null;
  return ((data ?? []) as ProfileRow[]).map((row) => profileToUser(row));
}

export function publicError(message: string) {
  return message.replace(/^.*ERROR:\s*/i, "").replace(/\s+CONTEXT:.*$/s, "").trim();
}
