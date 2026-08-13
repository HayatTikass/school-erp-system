import type { SystemUser } from "../types/roles";

/** Demo password for every seeded account */
export const DEMO_PASSWORD = "password";

export const seedUsers: SystemUser[] = [
  {
    id: "USR-A01",
    name: "Mrs. Akosua Danquah",
    email: "admin@kingsford.edu.gh",
    password: DEMO_PASSWORD,
    role: "admin",
    phone: "024 555 0001",
    status: "Active",
    title: "System Administrator",
    department: "Administration",
    createdAt: "2025-09-01",
  },
];
