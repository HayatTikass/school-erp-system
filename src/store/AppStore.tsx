import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { SystemUser, Role, AccountStatus } from "../types/roles";
import { ROLE_META } from "../types/roles";
import { generateTempPassword } from "../lib/passwords";
import { seedUsers } from "../data/users";
import {
  students as seedStudents,
  invoices as seedInvoices,
  payments as seedPayments,
  applications as seedApplications,
  borrowedBooks as seedLoans,
  notices as seedNotices,
  books as seedBooks,
  staff as seedStaff,
  classes as seedClasses,
  subjects as seedSubjects,
  lessonPlans as seedLessonPlans,
  assets as seedAssets,
  busRoutes as seedRoutes,
  events as seedEvents,
  disciplineCases as seedDiscipline,
  type Student,
  type Invoice,
  type Payment,
  type Book,
  type Staff,
  type Notice,
} from "../data/mock";
import {
  type AttendanceRecord,
  type AssignmentItem,
  type AssignmentSubmission,
  type GradeRecord,
  type Conversation,
  type LeaveRequest,
  type SchoolClass,
  type Subject,
  type LessonPlan,
  type Asset,
  type BusRoute,
  type SchoolEvent,
  type DisciplineCase,
  type Application,
  type Loan,
  type AttendanceMark,
  seedAssignments,
  seedConversations,
  seedLeave,
  seedGradesForStudents,
  seedSubmissions,
  computeGrade,
} from "./domain";
import { supabase } from "../lib/supabase";
import { fetchProfileByAuthId, fetchProfiles, publicError } from "../lib/profiles";

type NewChildInput = {
  name: string;
  email: string;
  className: string;
  gender: "M" | "F";
  password?: string;
};

type NewUserInput = {
  name: string;
  email: string;
  role: Role;
  phone: string;
  password?: string;
  department?: string;
  title?: string;
  linkedStudentIds?: string[];
  studentClass?: string;
  gender?: "M" | "F";
  parentId?: string;
  children?: NewChildInput[];
};

type AppStoreValue = {
  users: SystemUser[];
  students: Student[];
  invoices: Invoice[];
  payments: Payment[];
  applications: Application[];
  loans: Loan[];
  notices: Notice[];
  books: Book[];
  staff: Staff[];
  leaveRequests: LeaveRequest[];
  attendance: AttendanceRecord[];
  assignments: AssignmentItem[];
  submissions: AssignmentSubmission[];
  grades: GradeRecord[];
  conversations: Conversation[];
  classes: SchoolClass[];
  subjects: Subject[];
  lessonPlans: LessonPlan[];
  assets: Asset[];
  busRoutes: BusRoute[];
  events: SchoolEvent[];
  discipline: DisciplineCase[];

  addUser: (input: NewUserInput) => Promise<{ ok: true; user: SystemUser } | { ok: false; error: string }>;
  addStudentsToParent: (parentId: string, children: NewChildInput[]) => Promise<{ ok: true } | { ok: false; error: string }>;
  updateUser: (id: string, patch: Partial<SystemUser>) => Promise<{ ok: true } | { ok: false; error: string }>;
  setUserStatus: (id: string, status: AccountStatus) => Promise<{ ok: true } | { ok: false; error: string }>;
  resetPassword: (id: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  linkParentToStudent: (parentId: string, studentId: string) => void;

  addInvoice: (invoice: Omit<Invoice, "id">) => Invoice;
  recordPayment: (payment: Omit<Payment, "id">, invoiceId?: string) => Payment;

  addApplication: (input: Omit<Application, "id" | "date" | "status" | "exam"> & { exam?: number }) => Application;
  updateApplicationStatus: (id: string, status: string) => void;
  enrolApplication: (id: string) => { ok: true; student: Student } | { ok: false; error: string };

  addNotice: (notice: Omit<Notice, "id" | "date">) => void;
  addEvent: (event: Omit<SchoolEvent, "id">) => void;

  issueBook: (book: string, student: string, due: string) => void;
  returnBook: (loanId: string) => void;
  renewLoan: (loanId: string, extraDays?: number) => void;
  addBook: (book: Omit<Book, "id">) => void;

  submitAttendance: (className: string, date: string, marks: { studentId: string; studentName: string; mark: AttendanceMark }[], submittedBy?: string) => void;
  excuseAbsence: (recordId: string) => void;

  createAssignment: (input: Omit<AssignmentItem, "id" | "totalStudents" | "status"> & { status?: AssignmentItem["status"] }) => AssignmentItem;
  submitAssignment: (assignmentId: string, studentId: string, note?: string) => void;
  gradeSubmission: (submissionId: string, score: string) => void;

  upsertGrade: (studentId: string, subject: string, className: string, scores: { test1: number; test2: number; exam: number }) => void;
  submitGradesForClass: (className: string, subject: string) => void;

  sendMessage: (conversationId: string, text: string, senderName: string) => void;
  startConversation: (withName: string, withRole: string, text: string, senderName: string) => string;
  markConversationRead: (conversationId: string) => void;

  addStaff: (input: Omit<Staff, "id" | "status">) => Staff;
  updateStaff: (id: string, patch: Partial<Staff>) => void;
  removeStaff: (id: string) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest["status"]) => void;

  addClass: (input: Omit<SchoolClass, "id" | "students"> & { students?: number }) => void;
  addSubject: (input: Omit<Subject, "id">) => void;
  addLessonPlan: (input: Omit<LessonPlan, "id">) => void;
  updateLessonPlan: (id: string, patch: Partial<LessonPlan>) => void;

  addAsset: (input: Omit<Asset, "id">) => void;
  addRoute: (input: Omit<BusRoute, "id">) => void;
  addDiscipline: (input: Omit<DisciplineCase, "id" | "date">) => void;

  getStudentsForParent: (parentId: string) => Student[];
  getParentForStudent: (studentId: string) => SystemUser | undefined;
  getStudentForUser: (user: SystemUser) => Student | undefined;
};

const AppStoreContext = createContext<AppStoreValue | null>(null);
const STORAGE_KEY = "kingsford.appstore.v2";

type Persisted = {
  users: SystemUser[];
  students: Student[];
  invoices: Invoice[];
  payments: Payment[];
  applications: Application[];
  loans: Loan[];
  notices: Notice[];
  books: Book[];
  staff: Staff[];
  leaveRequests: LeaveRequest[];
  attendance: AttendanceRecord[];
  assignments: AssignmentItem[];
  submissions: AssignmentSubmission[];
  grades: GradeRecord[];
  conversations: Conversation[];
  classes: SchoolClass[];
  subjects: Subject[];
  lessonPlans: LessonPlan[];
  assets: Asset[];
  busRoutes: BusRoute[];
  events: SchoolEvent[];
  discipline: DisciplineCase[];
};

function loadPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed.users?.length) parsed.users = seedUsers;
    return parsed;
  } catch {
    return null;
  }
}

function persist(data: Persisted) {
  const users = data.users.map((u) => ({ ...u, password: "" }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, users }));
}

function nextId(prefix: string, existing: string[]) {
  const n = existing.length + 1;
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

function buildInitial(): Persisted {
  const students = seedStudents;
  const assignments = seedAssignments;
  const submissions = seedSubmissions(
    assignments,
    students.map((s) => ({ id: s.id, name: s.name, className: s.class })),
  );
  const grades = seedGradesForStudents(students.map((s) => ({ id: s.id, className: s.class })));
  return {
    users: seedUsers,
    students,
    invoices: seedInvoices,
    payments: seedPayments,
    applications: seedApplications as Application[],
    loans: seedLoans as Loan[],
    notices: seedNotices,
    books: seedBooks,
    staff: seedStaff,
    leaveRequests: seedLeave,
    attendance: [],
    assignments,
    submissions,
    grades,
    conversations: seedConversations,
    classes: seedClasses.map((c) => ({ ...c })),
    subjects: seedSubjects.map((s) => ({ ...s })),
    lessonPlans: seedLessonPlans.map((lp) => ({
      id: lp.id,
      topic: lp.topic,
      subject: lp.subject,
      className: lp.class,
      week: lp.week,
      status: lp.status as LessonPlan["status"],
      resources: lp.resources,
    })),
    assets: seedAssets.map((a) => ({ ...a })),
    busRoutes: seedRoutes.map((r) => ({ ...r })),
    events: seedEvents.map((e) => ({ ...e })),
    discipline: seedDiscipline.map((d) => ({
      id: d.id,
      student: d.student,
      className: d.class,
      incident: d.incident,
      date: d.date,
      severity: d.severity,
      status: d.status,
    })),
  };
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => loadPersisted() ?? buildInitial());

  const commit = useCallback((updater: (prev: Persisted) => Persisted) => {
    setState((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const refreshUsers = useCallback(async () => {
    const remote = await fetchProfiles();
    if (!remote?.length) return;
    commit((prev) => {
      const previousByEmail = new Map(prev.users.map((u) => [u.email.toLowerCase(), u]));
      return {
        ...prev,
        users: remote.map((u) => ({
          ...u,
          linkedStudentIds: previousByEmail.get(u.email.toLowerCase())?.linkedStudentIds ?? u.linkedStudentIds,
        })),
      };
    });
  }, [commit]);

  useEffect(() => {
    const sync = () => {
      void refreshUsers();
    };
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED")) {
        // Defer so the client session is available for PostgREST (avoids an empty RLS result).
        setTimeout(sync, 0);
      }
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) sync();
    });
    return () => sub.subscription.unsubscribe();
  }, [refreshUsers]);

  const addUser = useCallback(
    async (input: NewUserInput) => {
      if (input.role === "student") {
        return { ok: false as const, error: "Students can only be added when creating a parent account." };
      }
      if (state.users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
        return { ok: false as const, error: "An account with this email already exists." };
      }

      const children = input.role === "parent" ? (input.children ?? []).filter((c) => c.name.trim() && c.email.trim()) : [];
      if (input.role === "parent" && children.length === 0) {
        return { ok: false as const, error: "Add at least one student when creating a parent account." };
      }

      const usedEmails = new Set(state.users.map((u) => u.email.toLowerCase()));
      usedEmails.add(input.email.trim().toLowerCase());
      for (const child of children) {
        const childEmail = child.email.trim().toLowerCase();
        if (usedEmails.has(childEmail)) {
          return { ok: false as const, error: `An account with this email already exists: ${childEmail}` };
        }
        usedEmails.add(childEmail);
      }

      const legacyId = nextId("USR", state.users.map((u) => u.id));
      const email = input.email.trim().toLowerCase();

      const { data: authId, error } = await supabase.rpc("admin_create_user", {
        p_email: email,
        p_password: input.password || generateTempPassword(),
        p_full_name: input.name.trim(),
        p_role: input.role,
        p_phone: input.phone.trim(),
        p_department: input.department ?? null,
        p_title: input.role === "parent" ? ROLE_META.parent.label : (input.title || input.role) ?? null,
        p_legacy_id: legacyId,
      });

      if (error || !authId) {
        return { ok: false as const, error: publicError(error?.message ?? "Could not create the account.") };
      }

      const created = await fetchProfileByAuthId(String(authId));
      if (!created) {
        return { ok: false as const, error: "Account was created but the profile could not be loaded." };
      }

      let user = created;
      let nextStudents = state.students;
      let nextUsers = [...state.users];
      let nextGrades = state.grades;
      const linkedIds: string[] = [];

      if (input.role === "parent") {
        for (const [index, child] of children.entries()) {
          const childEmail = child.email.trim().toLowerCase();
          const childLegacy = nextId("USR", [...nextUsers, user].map((u) => u.id));
          const { data: childAuthId, error: childError } = await supabase.rpc("admin_create_user", {
            p_email: childEmail,
            p_password: child.password || input.password || generateTempPassword(),
            p_full_name: child.name.trim(),
            p_role: "student",
            p_phone: input.phone.trim(),
            p_department: null,
            p_title: `${child.className} student`,
            p_legacy_id: childLegacy,
          });
          if (childError || !childAuthId) {
            return { ok: false as const, error: publicError(childError?.message ?? `Could not create student ${child.name}.`) };
          }
          const childUser = await fetchProfileByAuthId(String(childAuthId));
          if (!childUser) {
            return { ok: false as const, error: `Student ${child.name} was created but the profile could not be loaded.` };
          }
          const sid = `KA-${2400 + nextStudents.length + 1 + index}`;
          const student: Student = {
            id: sid,
            name: childUser.name,
            email: childUser.email,
            class: child.className || "JHS 1A",
            gender: child.gender || "M",
            parentId: user.id,
            guardian: user.name,
            status: "Active",
            attendance: 100,
            gpa: 0,
            feesOwed: 0,
            avatarColor: "bg-brand-100 text-brand-700",
          };
          const titled = { ...childUser, linkedStudentIds: [sid], title: `${student.class} · ${sid}` };
          if (titled.profileId) {
            await supabase.from("profiles").update({ title: titled.title }).eq("id", titled.profileId);
          }
          linkedIds.push(sid);
          nextUsers = [titled, ...nextUsers];
          nextStudents = [student, ...nextStudents];
          nextGrades = [...seedGradesForStudents([{ id: sid, className: student.class }]), ...nextGrades];
        }
        user = { ...user, linkedStudentIds: linkedIds };
      }

      nextUsers = [user, ...nextUsers];
      commit((prev) => ({ ...prev, users: nextUsers, students: nextStudents, grades: nextGrades }));
      return { ok: true as const, user };
    },
    [state.users, state.students, state.grades, commit],
  );

  const addStudentsToParent = useCallback(
    async (parentId: string, children: NewChildInput[]) => {
      const parent = state.users.find((u) => u.id === parentId);
      if (!parent || parent.role !== "parent") {
        return { ok: false as const, error: "Parent account not found." };
      }
      const drafts = children.filter((c) => c.name.trim() && c.email.trim());
      if (drafts.length === 0) {
        return { ok: false as const, error: "Add at least one student with a name and email." };
      }

      const usedEmails = new Set(state.users.map((u) => u.email.toLowerCase()));
      for (const child of drafts) {
        const childEmail = child.email.trim().toLowerCase();
        if (usedEmails.has(childEmail)) {
          return { ok: false as const, error: `An account with this email already exists: ${childEmail}` };
        }
        usedEmails.add(childEmail);
      }

      let nextStudents = state.students;
      let nextUsers = [...state.users];
      let nextGrades = state.grades;
      const linkedIds = [...(parent.linkedStudentIds ?? [])];

      for (const [index, child] of drafts.entries()) {
        const childEmail = child.email.trim().toLowerCase();
        const childLegacy = nextId("USR", nextUsers.map((u) => u.id));
        const { data: childAuthId, error: childError } = await supabase.rpc("admin_create_user", {
          p_email: childEmail,
          p_password: child.password || generateTempPassword(),
          p_full_name: child.name.trim(),
          p_role: "student",
          p_phone: parent.phone,
          p_department: null,
          p_title: `${child.className} student`,
          p_legacy_id: childLegacy,
        });
        if (childError || !childAuthId) {
          return { ok: false as const, error: publicError(childError?.message ?? `Could not create student ${child.name}.`) };
        }
        const childUser = await fetchProfileByAuthId(String(childAuthId));
        if (!childUser) {
          return { ok: false as const, error: `Student ${child.name} was created but the profile could not be loaded.` };
        }
        const sid = `KA-${2400 + nextStudents.length + 1 + index}`;
        const student: Student = {
          id: sid,
          name: childUser.name,
          email: childUser.email,
          class: child.className || "JHS 1A",
          gender: child.gender || "M",
          parentId: parent.id,
          guardian: parent.name,
          status: "Active",
          attendance: 100,
          gpa: 0,
          feesOwed: 0,
          avatarColor: "bg-brand-100 text-brand-700",
        };
        const titled = { ...childUser, linkedStudentIds: [sid], title: `${student.class} · ${sid}` };
        if (titled.profileId) {
          await supabase.from("profiles").update({ title: titled.title }).eq("id", titled.profileId);
        }
        linkedIds.push(sid);
        nextUsers = [titled, ...nextUsers];
        nextStudents = [student, ...nextStudents];
        nextGrades = [...seedGradesForStudents([{ id: sid, className: student.class }]), ...nextGrades];
      }

      nextUsers = nextUsers.map((u) => (u.id === parent.id ? { ...u, linkedStudentIds: linkedIds } : u));
      commit((prev) => ({ ...prev, users: nextUsers, students: nextStudents, grades: nextGrades }));
      return { ok: true as const };
    },
    [state.users, state.students, state.grades, commit],
  );

  const updateUser = useCallback(
    async (id: string, patch: Partial<SystemUser>) => {
      const existing = state.users.find((u) => u.id === id);
      if (existing?.profileId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: patch.name ?? existing.name,
            email: patch.email ?? existing.email,
            phone: patch.phone ?? existing.phone,
            department: patch.department ?? existing.department ?? null,
            title: patch.title ?? existing.title ?? null,
          })
          .eq("id", existing.profileId);
        if (error) return { ok: false as const, error: publicError(error.message) };
      }
      commit((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === id ? { ...u, ...patch, id: u.id, password: "" } : u)),
      }));
      return { ok: true as const };
    },
    [state.users, commit],
  );

  const setUserStatus = useCallback(
    async (id: string, status: AccountStatus) => {
      const existing = state.users.find((u) => u.id === id);
      if (existing?.isSuperAdmin && status !== "Active") {
        return { ok: false as const, error: "The super admin account cannot be suspended." };
      }
      if (existing?.profileId) {
        const { error } = await supabase.rpc("admin_set_user_status", {
          p_profile_id: existing.profileId,
          p_status: status,
        });
        if (error) return { ok: false as const, error: publicError(error.message) };
      }
      commit((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === id ? { ...u, status } : u)),
      }));
      return { ok: true as const };
    },
    [state.users, commit],
  );

  const resetPassword = useCallback(
    async (id: string, password: string) => {
      const existing = state.users.find((u) => u.id === id);
      let profileId = existing?.profileId;
      if (!profileId && existing?.email) {
        const { data } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", existing.email.toLowerCase())
          .maybeSingle();
        profileId = data?.id;
      }
      if (!profileId) {
        return { ok: false as const, error: "This account is not linked to the school database yet." };
      }
      const { error } = await supabase.rpc("admin_reset_password", {
        p_profile_id: profileId,
        p_password: password,
      });
      if (error) return { ok: false as const, error: publicError(error.message) };
      return { ok: true as const };
    },
    [state.users],
  );

  const linkParentToStudent = useCallback(
    (parentId: string, studentId: string) => {
      commit((prev) => {
        const parent = prev.users.find((u) => u.id === parentId);
        if (!parent) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === parentId
              ? { ...u, linkedStudentIds: Array.from(new Set([...(u.linkedStudentIds ?? []), studentId])) }
              : u,
          ),
          students: prev.students.map((s) =>
            s.id === studentId ? { ...s, parentId, guardian: parent.name } : s,
          ),
        };
      });
    },
    [commit],
  );

  const addInvoice = useCallback(
    (invoice: Omit<Invoice, "id">) => {
      const id = `INV-${1040 + state.invoices.length + 1}`;
      const full = { ...invoice, id };
      commit((prev) => ({ ...prev, invoices: [full, ...prev.invoices] }));
      return full;
    },
    [state.invoices.length, commit],
  );

  const recordPayment = useCallback(
    (payment: Omit<Payment, "id">, invoiceId?: string) => {
      const id = `PAY-${2200 + state.payments.length + 1}`;
      const full = { ...payment, id };
      commit((prev) => {
        let nextInvoices = prev.invoices;
        if (invoiceId) {
          nextInvoices = prev.invoices.map((inv) => {
            if (inv.id !== invoiceId) return inv;
            const paid = Math.min(inv.amount, inv.paid + payment.amount);
            const status = paid >= inv.amount ? "Paid" : paid > 0 ? "Partial" : inv.status;
            return { ...inv, paid, status: status as Invoice["status"] };
          });
        }
        const nextStudents = prev.students.map((s) => {
          if (s.name !== payment.student) return s;
          const owed = nextInvoices
            .filter((inv) => inv.student === s.name)
            .reduce((a, inv) => a + Math.max(0, inv.amount - inv.paid), 0);
          return { ...s, feesOwed: owed };
        });
        return { ...prev, payments: [full, ...prev.payments], invoices: nextInvoices, students: nextStudents };
      });
      return full;
    },
    [state.payments.length, commit],
  );

  const addApplication = useCallback(
    (input: Omit<Application, "id" | "date" | "status" | "exam"> & { exam?: number }) => {
      const id = nextId("APP", state.applications.map((a) => a.id));
      const app: Application = {
        ...input,
        id,
        exam: input.exam ?? 0,
        date: new Date().toISOString().slice(0, 10),
        status: "Submitted",
      };
      commit((prev) => ({ ...prev, applications: [app, ...prev.applications] }));
      return app;
    },
    [state.applications, commit],
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: string) => {
      commit((prev) => ({
        ...prev,
        applications: prev.applications.map((a) => (a.id === id ? { ...a, status } : a)),
      }));
    },
    [commit],
  );

  const enrolApplication = useCallback(
    (id: string) => {
      const app = state.applications.find((a) => a.id === id);
      if (!app) return { ok: false as const, error: "Application not found" };
      if (app.status !== "Accepted") return { ok: false as const, error: "Accept the application before enrolling." };

      const sid = `KA-${2400 + state.students.length + 1}`;
      const className = app.appliedFor.includes("1") ? "JHS 1A" : app.appliedFor.includes("2") ? "JHS 2A" : "JHS 3A";
      const email = app.email || `${app.name.toLowerCase().replace(/\s+/g, ".")}@kingsford.edu.gh`;
      const student: Student = {
        id: sid,
        name: app.name,
        email,
        class: className,
        gender: "M",
        parentId: "",
        guardian: app.guardian || "None",
        status: "Active",
        attendance: 100,
        gpa: 0,
        feesOwed: 0,
        avatarColor: "bg-brand-100 text-brand-700",
      };
      commit((prev) => ({
        ...prev,
        students: [student, ...prev.students],
        applications: prev.applications.map((a) => (a.id === id ? { ...a, status: "Enrolled" } : a)),
        grades: [...seedGradesForStudents([{ id: sid, className }]), ...prev.grades],
        classes: prev.classes.map((c) => (c.name === className ? { ...c, students: c.students + 1 } : c)),
      }));
      return { ok: true as const, student };
    },
    [state.applications, state.students.length, commit],
  );

  const addNotice = useCallback(
    (notice: Omit<Notice, "id" | "date">) => {
      const id = `N-${Date.now()}`;
      commit((prev) => ({
        ...prev,
        notices: [{ ...notice, id, date: new Date().toISOString().slice(0, 10) } as Notice, ...prev.notices],
      }));
    },
    [commit],
  );

  const addEvent = useCallback(
    (event: Omit<SchoolEvent, "id">) => {
      const id = nextId("EV", state.events.map((e) => e.id));
      commit((prev) => ({ ...prev, events: [{ ...event, id }, ...prev.events] }));
    },
    [state.events, commit],
  );

  const issueBook = useCallback(
    (book: string, student: string, due: string) => {
      commit((prev) => {
        const id = `L-${900 + prev.loans.length + 1}`;
        return {
          ...prev,
          loans: [
            { id, book, student, issued: new Date().toISOString().slice(0, 10), due, status: "On loan", fine: 0 },
            ...prev.loans,
          ],
          books: prev.books.map((b) =>
            b.title === book && b.available > 0 ? { ...b, available: b.available - 1 } : b,
          ),
        };
      });
    },
    [commit],
  );

  const returnBook = useCallback(
    (loanId: string) => {
      commit((prev) => {
        const loan = prev.loans.find((l) => l.id === loanId);
        if (!loan || loan.status === "Returned") return prev;
        return {
          ...prev,
          loans: prev.loans.map((l) => (l.id === loanId ? { ...l, status: "Returned" as const, fine: 0 } : l)),
          books: prev.books.map((b) => (b.title === loan.book ? { ...b, available: Math.min(b.copies, b.available + 1) } : b)),
        };
      });
    },
    [commit],
  );

  const renewLoan = useCallback(
    (loanId: string, extraDays = 14) => {
      commit((prev) => ({
        ...prev,
        loans: prev.loans.map((l) => {
          if (l.id !== loanId || l.status === "Returned") return l;
          const d = new Date(l.due);
          d.setDate(d.getDate() + extraDays);
          return { ...l, due: d.toISOString().slice(0, 10), status: "On loan" as const, fine: 0 };
        }),
      }));
    },
    [commit],
  );

  const addBook = useCallback(
    (book: Omit<Book, "id">) => {
      const id = nextId("BK", state.books.map((b) => b.id));
      commit((prev) => ({ ...prev, books: [{ ...book, id }, ...prev.books] }));
    },
    [state.books, commit],
  );

  const submitAttendance = useCallback(
    (
      className: string,
      date: string,
      marks: { studentId: string; studentName: string; mark: AttendanceMark }[],
      submittedBy?: string,
    ) => {
      commit((prev) => {
        const withoutDay = prev.attendance.filter((a) => !(a.date === date && a.className === className));
        const rows: AttendanceRecord[] = marks.map((m, i) => ({
          id: `ATT-${date}-${className}-${i}`,
          date,
          className,
          studentId: m.studentId,
          studentName: m.studentName,
          mark: m.mark,
          submittedBy,
        }));
        const nextAttendance = [...rows, ...withoutDay];
        // Update term % roughly from latest marks
        const nextStudents = prev.students.map((s) => {
          const mine = nextAttendance.filter((a) => a.studentId === s.id);
          if (!mine.length) return s;
          const presentish = mine.filter((a) => a.mark === "present" || a.mark === "late" || a.mark === "excused").length;
          return { ...s, attendance: Math.round((presentish / mine.length) * 100) };
        });
        return { ...prev, attendance: nextAttendance, students: nextStudents };
      });
    },
    [commit],
  );

  const excuseAbsence = useCallback(
    (recordId: string) => {
      commit((prev) => ({
        ...prev,
        attendance: prev.attendance.map((a) => (a.id === recordId ? { ...a, mark: "excused" as const } : a)),
      }));
    },
    [commit],
  );

  const createAssignment = useCallback(
    (input: Omit<AssignmentItem, "id" | "totalStudents" | "status"> & { status?: AssignmentItem["status"] }) => {
      const id = nextId("A", state.assignments.map((a) => a.id));
      const classStudents = state.students.filter((s) => s.class === input.className);
      const item: AssignmentItem = {
        ...input,
        id,
        status: input.status ?? "Open",
        totalStudents: classStudents.length || 30,
      };
      const subs: AssignmentSubmission[] = classStudents.map((s, i) => ({
        id: `SUB-${Date.now()}-${i}`,
        assignmentId: id,
        studentId: s.id,
        studentName: s.name,
        status: "Pending" as const,
      }));
      commit((prev) => ({
        ...prev,
        assignments: [item, ...prev.assignments],
        submissions: [...subs, ...prev.submissions],
      }));
      return item;
    },
    [state.assignments, state.students, commit],
  );

  const submitAssignment = useCallback(
    (assignmentId: string, studentId: string, note?: string) => {
      commit((prev) => ({
        ...prev,
        submissions: prev.submissions.map((s) =>
          s.assignmentId === assignmentId && s.studentId === studentId
            ? {
                ...s,
                status: "Submitted" as const,
                submittedAt: new Date().toISOString().slice(0, 10),
                note,
              }
            : s,
        ),
      }));
    },
    [commit],
  );

  const gradeSubmission = useCallback(
    (submissionId: string, score: string) => {
      commit((prev) => ({
        ...prev,
        submissions: prev.submissions.map((s) =>
          s.id === submissionId ? { ...s, status: "Graded" as const, score } : s,
        ),
      }));
    },
    [commit],
  );

  const upsertGrade = useCallback(
    (studentId: string, subject: string, className: string, scores: { test1: number; test2: number; exam: number }) => {
      const { total, grade, remark } = computeGrade(scores.test1, scores.test2, scores.exam);
      commit((prev) => {
        const existing = prev.grades.find((g) => g.studentId === studentId && g.subject === subject);
        if (existing) {
          return {
            ...prev,
            grades: prev.grades.map((g) =>
              g.id === existing.id
                ? { ...g, ...scores, total, grade, remark, status: "Draft" as const }
                : g,
            ),
          };
        }
        const id = nextId("GR", prev.grades.map((g) => g.id));
        return {
          ...prev,
          grades: [
            { id, studentId, subject, className, ...scores, total, grade, remark, status: "Draft" },
            ...prev.grades,
          ],
        };
      });
    },
    [commit],
  );

  const submitGradesForClass = useCallback(
    (className: string, subject: string) => {
      commit((prev) => ({
        ...prev,
        grades: prev.grades.map((g) =>
          g.className === className && g.subject === subject ? { ...g, status: "Submitted" as const } : g,
        ),
      }));
    },
    [commit],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string, senderName: string) => {
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      commit((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                preview: text,
                time,
                messages: [
                  ...c.messages,
                  { id: `m-${Date.now()}`, fromMe: true, senderName, text, time },
                ],
              }
            : c,
        ),
      }));
    },
    [commit],
  );

  const startConversation = useCallback(
    (withName: string, withRole: string, text: string, senderName: string) => {
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const id = nextId("MSG", state.conversations.map((c) => c.id));
      const conv: Conversation = {
        id,
        withName,
        withRole,
        preview: text,
        time,
        unread: false,
        avatarColor: "bg-brand-100 text-brand-700",
        messages: [{ id: `m-${Date.now()}`, fromMe: true, senderName, text, time }],
      };
      commit((prev) => ({ ...prev, conversations: [conv, ...prev.conversations] }));
      return id;
    },
    [state.conversations, commit],
  );

  const markConversationRead = useCallback(
    (conversationId: string) => {
      commit((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) => (c.id === conversationId ? { ...c, unread: false } : c)),
      }));
    },
    [commit],
  );

  const addStaff = useCallback(
    (input: Omit<Staff, "id" | "status">) => {
      const id = nextId("ST", state.staff.map((s) => s.id));
      const full: Staff = { ...input, id, status: "Active" };
      commit((prev) => ({ ...prev, staff: [full, ...prev.staff] }));
      return full;
    },
    [state.staff, commit],
  );

  const updateStaff = useCallback(
    (id: string, patch: Partial<Staff>) => {
      commit((prev) => ({
        ...prev,
        staff: prev.staff.map((s) => (s.id === id ? { ...s, ...patch, id: s.id } : s)),
      }));
    },
    [commit],
  );

  const removeStaff = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        staff: prev.staff.filter((s) => s.id !== id),
        leaveRequests: prev.leaveRequests.filter((l) => l.staffId !== id),
      }));
    },
    [commit],
  );

  const updateLeaveStatus = useCallback(
    (id: string, status: LeaveRequest["status"]) => {
      commit((prev) => ({
        ...prev,
        leaveRequests: prev.leaveRequests.map((l) => (l.id === id ? { ...l, status } : l)),
      }));
    },
    [commit],
  );

  const addClass = useCallback(
    (input: Omit<SchoolClass, "id" | "students"> & { students?: number }) => {
      const id = nextId("C", state.classes.map((c) => c.id));
      commit((prev) => ({
        ...prev,
        classes: [...prev.classes, { ...input, id, students: input.students ?? 0 }],
      }));
    },
    [state.classes, commit],
  );

  const addSubject = useCallback(
    (input: Omit<Subject, "id">) => {
      const id = nextId("SUB", state.subjects.map((s) => s.id));
      commit((prev) => ({ ...prev, subjects: [...prev.subjects, { ...input, id }] }));
    },
    [state.subjects, commit],
  );

  const addLessonPlan = useCallback(
    (input: Omit<LessonPlan, "id">) => {
      const id = nextId("LP", state.lessonPlans.map((l) => l.id));
      commit((prev) => ({ ...prev, lessonPlans: [{ ...input, id }, ...prev.lessonPlans] }));
    },
    [state.lessonPlans, commit],
  );

  const updateLessonPlan = useCallback(
    (id: string, patch: Partial<LessonPlan>) => {
      commit((prev) => ({
        ...prev,
        lessonPlans: prev.lessonPlans.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      }));
    },
    [commit],
  );

  const addAsset = useCallback(
    (input: Omit<Asset, "id">) => {
      const id = nextId("AST", state.assets.map((a) => a.id));
      commit((prev) => ({ ...prev, assets: [{ ...input, id }, ...prev.assets] }));
    },
    [state.assets, commit],
  );

  const addRoute = useCallback(
    (input: Omit<BusRoute, "id">) => {
      const id = nextId("RT", state.busRoutes.map((r) => r.id));
      commit((prev) => ({ ...prev, busRoutes: [{ ...input, id }, ...prev.busRoutes] }));
    },
    [state.busRoutes, commit],
  );

  const addDiscipline = useCallback(
    (input: Omit<DisciplineCase, "id" | "date">) => {
      const id = nextId("DC", state.discipline.map((d) => d.id));
      commit((prev) => ({
        ...prev,
        discipline: [
          { ...input, id, date: new Date().toISOString().slice(0, 10) },
          ...prev.discipline,
        ],
      }));
    },
    [state.discipline, commit],
  );

  const getStudentsForParent = useCallback(
    (parentId: string) => state.students.filter((s) => s.parentId === parentId),
    [state.students],
  );

  const getParentForStudent = useCallback(
    (studentId: string) => {
      const student = state.students.find((s) => s.id === studentId);
      if (!student?.parentId) return undefined;
      return state.users.find((u) => u.id === student.parentId);
    },
    [state.students, state.users],
  );

  const getStudentForUser = useCallback(
    (user: SystemUser) => {
      if (user.role !== "student") return undefined;
      return (
        state.students.find((s) => s.email === user.email) ||
        state.students.find((s) => user.linkedStudentIds?.includes(s.id))
      );
    },
    [state.students],
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      ...state,
      addUser,
      addStudentsToParent,
      updateUser,
      setUserStatus,
      resetPassword,
      linkParentToStudent,
      addInvoice,
      recordPayment,
      addApplication,
      updateApplicationStatus,
      enrolApplication,
      addNotice,
      addEvent,
      issueBook,
      returnBook,
      renewLoan,
      addBook,
      submitAttendance,
      excuseAbsence,
      createAssignment,
      submitAssignment,
      gradeSubmission,
      upsertGrade,
      submitGradesForClass,
      sendMessage,
      startConversation,
      markConversationRead,
      addStaff,
      updateStaff,
      removeStaff,
      updateLeaveStatus,
      addClass,
      addSubject,
      addLessonPlan,
      updateLessonPlan,
      addAsset,
      addRoute,
      addDiscipline,
      getStudentsForParent,
      getParentForStudent,
      getStudentForUser,
    }),
    [
      state,
      addUser,
      addStudentsToParent,
      updateUser,
      setUserStatus,
      resetPassword,
      linkParentToStudent,
      addInvoice,
      recordPayment,
      addApplication,
      updateApplicationStatus,
      enrolApplication,
      addNotice,
      addEvent,
      issueBook,
      returnBook,
      renewLoan,
      addBook,
      submitAttendance,
      excuseAbsence,
      createAssignment,
      submitAssignment,
      gradeSubmission,
      upsertGrade,
      submitGradesForClass,
      sendMessage,
      startConversation,
      markConversationRead,
      addStaff,
      updateStaff,
      removeStaff,
      updateLeaveStatus,
      addClass,
      addSubject,
      addLessonPlan,
      updateLessonPlan,
      addAsset,
      addRoute,
      addDiscipline,
      getStudentsForParent,
      getParentForStudent,
      getStudentForUser,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
