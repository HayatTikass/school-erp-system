export const ROLES = [
  "admin",
  "headmaster",
  "accountant",
  "teacher",
  "librarian",
  "hr",
  "student",
  "parent",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_META: Record<
  Role,
  { label: string; shortLabel: string; description: string; portalPath: string }
> = {
  admin: {
    label: "System Administrator",
    shortLabel: "Admin",
    description: "Full system control · users, settings and all modules",
    portalPath: "/admin",
  },
  headmaster: {
    label: "Headmaster",
    shortLabel: "Headmaster",
    description: "School leadership · academics, discipline and reports",
    portalPath: "/headmaster",
  },
  accountant: {
    label: "Accountant",
    shortLabel: "Accountant",
    description: "Fees, invoices, payments and financial reports",
    portalPath: "/accountant",
  },
  teacher: {
    label: "Teacher",
    shortLabel: "Teacher",
    description: "Classroom delivery, assessments and progress",
    portalPath: "/teacher",
  },
  librarian: {
    label: "Librarian",
    shortLabel: "Librarian",
    description: "Catalogue, loans, returns and library fines",
    portalPath: "/librarian",
  },
  hr: {
    label: "HR Officer",
    shortLabel: "HR",
    description: "Staff profiles, payroll, leave and appraisals",
    portalPath: "/hr",
  },
  student: {
    label: "Student",
    shortLabel: "Student",
    description: "Results, assignments, timetable and school life",
    portalPath: "/student",
  },
  parent: {
    label: "Parent / Guardian",
    shortLabel: "Parent",
    description: "Monitor linked children, fees and communication",
    portalPath: "/parent",
  },
};

export type AccountStatus = "Active" | "Suspended" | "Inactive";

export type SystemUser = {
  id: string;
  /** Supabase `profiles.id` when the account lives in the database. */
  profileId?: string;
  name: string;
  email: string;
  /** Never stored after Supabase Auth is used; kept for local seed compatibility. */
  password: string;
  role: Role;
  phone: string;
  status: AccountStatus;
  /** For parents: linked student IDs. For students: ignored (use parentId on student). */
  linkedStudentIds?: string[];
  department?: string;
  title?: string;
  createdAt: string;
  /** Protected account that cannot be suspended or removed. */
  isSuperAdmin?: boolean;
};
