import type { SystemUser } from "../types/roles";

export const seedUsers: SystemUser[] = [
  {
    id: "USR-A01",
    name: "Mrs. Akosua Danquah",
    email: "admin@kingsford.edu.gh",
    password: "",
    role: "admin",
    phone: "024 555 0001",
    status: "Active",
    title: "Super Administrator",
    department: "Administration",
    createdAt: "2025-09-01",
    isSuperAdmin: true,
  },
];
