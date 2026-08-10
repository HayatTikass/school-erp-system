import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SystemUser, Role, AccountStatus } from "../types/roles";
import { DEMO_PASSWORD, seedUsers } from "../data/users";
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

  addUser: (input: NewUserInput) => { ok: true; user: SystemUser } | { ok: false; error: string };
  updateUser: (id: string, patch: Partial<SystemUser>) => void;
  setUserStatus: (id: string, status: AccountStatus) => void;
  resetPassword: (id: string, password?: string) => void;
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
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

function persist(data: Persisted) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

  const addUser = useCallback(
    (input: NewUserInput) => {
      if (state.users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
        return { ok: false as const, error: "An account with this email already exists." };
      }
      const id = nextId("USR", state.users.map((u) => u.id));
      const user: SystemUser = {
        id,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password || DEMO_PASSWORD,
        role: input.role,
        phone: input.phone.trim(),
        status: "Active",
        department: input.department,
        title: input.title || input.role,
        linkedStudentIds: input.linkedStudentIds ?? [],
        createdAt: new Date().toISOString().slice(0, 10),
      };

      let nextStudents = state.students;
      let nextUsers = [...state.users];
      let nextGrades = state.grades;

      if (input.role === "student") {
        const sid = `KA-${2400 + state.students.length + 1}`;
        const parent = state.users.find((u) => u.id === input.parentId);
        const student: Student = {
          id: sid,
          name: user.name,
          email: user.email,
          class: input.studentClass || "JHS 1A",
          gender: input.gender || "M",
          parentId: input.parentId || "",
          guardian: parent?.name || "—",
          status: "Active",
          attendance: 100,
          gpa: 0,
          feesOwed: 0,
          avatarColor: "bg-brand-100 text-brand-700",
        };
        user.linkedStudentIds = [sid];
        user.title = `${student.class} · ${sid}`;
        nextStudents = [student, ...state.students];
        nextGrades = [
          ...seedGradesForStudents([{ id: sid, className: student.class }]),
          ...state.grades,
        ];
        if (input.parentId) {
          nextUsers = nextUsers.map((u) =>
            u.id === input.parentId
              ? { ...u, linkedStudentIds: Array.from(new Set([...(u.linkedStudentIds ?? []), sid])) }
              : u,
          );
        }
      }

      if (input.role === "parent" && input.linkedStudentIds?.length) {
        nextStudents = state.students.map((s) =>
          input.linkedStudentIds!.includes(s.id) ? { ...s, parentId: id, guardian: user.name } : s,
        );
      }

      nextUsers = [user, ...nextUsers];
      commit((prev) => ({ ...prev, users: nextUsers, students: nextStudents, grades: nextGrades }));
      return { ok: true as const, user };
    },
    [state.users, state.students, state.grades, commit],
  );

  const updateUser = useCallback(
    (id: string, patch: Partial<SystemUser>) => {
      commit((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === id ? { ...u, ...patch, id: u.id } : u)),
      }));
    },
    [commit],
  );

  const setUserStatus = useCallback(
    (id: string, status: AccountStatus) => updateUser(id, { status }),
    [updateUser],
  );

  const resetPassword = useCallback(
    (id: string, password = DEMO_PASSWORD) => updateUser(id, { password }),
    [updateUser],
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
        guardian: app.guardian || "—",
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
