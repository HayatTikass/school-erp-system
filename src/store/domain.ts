/** Shared domain types + seeds for AppStore (demo layer before DB). */

export type AttendanceMark = "present" | "absent" | "late" | "excused";

export type AttendanceRecord = {
  id: string;
  date: string;
  className: string;
  studentId: string;
  studentName: string;
  mark: AttendanceMark;
  submittedBy?: string;
};

export type AssignmentItem = {
  id: string;
  title: string;
  subject: string;
  className: string;
  due: string;
  status: "Open" | "Closed" | "Grading";
  totalStudents: number;
  createdBy?: string;
};

export type SubmissionStatus = "Pending" | "Submitted" | "Graded" | "Late";

export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  status: SubmissionStatus;
  submittedAt?: string;
  score?: string;
  note?: string;
};

export type GradeRecord = {
  id: string;
  studentId: string;
  subject: string;
  className: string;
  test1: number;
  test2: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
  status: "Draft" | "Submitted" | "Approved";
};

export type ChatMessage = {
  id: string;
  fromMe: boolean;
  senderName: string;
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  withName: string;
  withRole: string;
  preview: string;
  time: string;
  unread: boolean;
  avatarColor: string;
  messages: ChatMessage[];
};

export type LeaveRequest = {
  id: string;
  staffId: string;
  name: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: "Approved" | "Pending" | "Declined";
};

export type SchoolClass = {
  id: string;
  name: string;
  teacher: string;
  students: number;
  room: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  teacher: string;
  color: string;
};

export type LessonPlan = {
  id: string;
  topic: string;
  subject: string;
  className: string;
  week: string;
  status: "Completed" | "In progress" | "Draft";
  resources: number;
};

export type Asset = {
  id: string;
  name: string;
  category: string;
  qty: number;
  location: string;
  condition: string;
  value: number;
};

export type BusRoute = {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  students: number;
  fee: number;
  status: string;
};

export type SchoolEvent = {
  id: string;
  title: string;
  date: string;
  type: string;
};

export type DisciplineCase = {
  id: string;
  student: string;
  className: string;
  incident: string;
  date: string;
  severity: string;
  status: string;
};

export type Application = {
  id: string;
  name: string;
  appliedFor: string;
  date: string;
  exam: number;
  status: string;
  guardian?: string;
  phone?: string;
  email?: string;
};

export type Loan = {
  id: string;
  book: string;
  student: string;
  issued: string;
  due: string;
  status: "On loan" | "Overdue" | "Returned";
  fine: number;
};

function letterGrade(total: number): { grade: string; remark: string } {
  if (total >= 90) return { grade: "A+", remark: "Outstanding" };
  if (total >= 80) return { grade: "A", remark: "Excellent" };
  if (total >= 75) return { grade: "A-", remark: "Excellent" };
  if (total >= 70) return { grade: "B+", remark: "Very good" };
  if (total >= 65) return { grade: "B", remark: "Good" };
  if (total >= 60) return { grade: "B-", remark: "Fair" };
  if (total >= 50) return { grade: "C", remark: "Pass" };
  return { grade: "D", remark: "Needs improvement" };
}

export function computeGrade(test1: number, test2: number, exam: number) {
  const total = test1 + test2 + exam;
  return { total, ...letterGrade(total) };
}

/** Seed grades for JHS 2A students from template subjects */
export function seedGradesForStudents(
  studentIds: { id: string; className: string }[],
): GradeRecord[] {
  const subjects = [
    { subject: "Mathematics", t1: 18, t2: 16, exam: 52 },
    { subject: "English Language", t1: 15, t2: 17, exam: 46 },
    { subject: "Integrated Science", t1: 17, t2: 14, exam: 49 },
    { subject: "Social Studies", t1: 14, t2: 15, exam: 41 },
    { subject: "ICT", t1: 19, t2: 18, exam: 55 },
    { subject: "Religious & Moral Ed.", t1: 13, t2: 14, exam: 38 },
  ];
  const rows: GradeRecord[] = [];
  let n = 1;
  for (const s of studentIds) {
    for (const sub of subjects) {
      // Slight variance per student
      const jitter = (s.id.charCodeAt(s.id.length - 1) % 5) - 2;
      const test1 = Math.max(0, Math.min(20, sub.t1 + jitter));
      const test2 = Math.max(0, Math.min(20, sub.t2 + (jitter % 3)));
      const exam = Math.max(0, Math.min(60, sub.exam + jitter));
      const { total, grade, remark } = computeGrade(test1, test2, exam);
      rows.push({
        id: `GR-${String(n++).padStart(3, "0")}`,
        studentId: s.id,
        subject: sub.subject,
        className: s.className,
        test1,
        test2,
        exam,
        total,
        grade,
        remark,
        status: "Approved",
      });
    }
  }
  return rows;
}

export function seedSubmissions(
  assignments: AssignmentItem[],
  students: { id: string; name: string; className: string }[],
): AssignmentSubmission[] {
  const rows: AssignmentSubmission[] = [];
  let n = 1;
  for (const a of assignments) {
    const classStudents = students.filter((s) => s.className === a.className);
    for (const s of classStudents) {
      let status: SubmissionStatus = "Pending";
      let score: string | undefined;
      let submittedAt: string | undefined;
      if (a.id === "A1") {
        const h = s.id.charCodeAt(s.id.length - 1) % 3;
        status = h === 0 ? "Pending" : "Submitted";
        submittedAt = status === "Submitted" ? "2026-07-05" : undefined;
      } else if (a.id === "A2") {
        status = "Graded";
        score = "17/20";
        submittedAt = "2026-07-04";
      } else if (a.id === "A4") {
        status = s.id === "KA-2401" ? "Late" : "Graded";
        score = "12/20";
        submittedAt = "2026-07-05";
      }
      rows.push({
        id: `SUB-${String(n++).padStart(3, "0")}`,
        assignmentId: a.id,
        studentId: s.id,
        studentName: s.name,
        status,
        submittedAt,
        score,
      });
    }
  }
  return rows;
}

export const seedAssignments: AssignmentItem[] = [
  { id: "A1", title: "Quadratic equations worksheet", subject: "Mathematics", className: "JHS 2A", due: "2026-07-08", status: "Open", totalStudents: 34, createdBy: "USR-T01" },
  { id: "A2", title: "Essay: My community and I", subject: "English Language", className: "JHS 2A", due: "2026-07-06", status: "Grading", totalStudents: 34, createdBy: "USR-T02" },
  { id: "A3", title: "Lab report — photosynthesis", subject: "Integrated Science", className: "JHS 2A", due: "2026-07-10", status: "Open", totalStudents: 34 },
  { id: "A4", title: "Map reading exercise", subject: "Social Studies", className: "JHS 2A", due: "2026-07-04", status: "Closed", totalStudents: 34 },
  { id: "A5", title: "Build a simple HTML page", subject: "ICT", className: "JHS 2A", due: "2026-07-12", status: "Open", totalStudents: 34 },
];

export const seedConversations: Conversation[] = [
  {
    id: "MSG-1",
    withName: "Mrs. Grace Antwi",
    withRole: "English Teacher",
    preview: "Abena has shown remarkable improvement in her essays this term…",
    time: "10:24 AM",
    unread: true,
    avatarColor: "bg-brand-100 text-brand-700",
    messages: [
      { id: "m1", fromMe: false, senderName: "Mrs. Grace Antwi", text: "Good morning. I wanted to share that Abena has shown remarkable improvement in her essays this term.", time: "9:02 AM" },
      { id: "m2", fromMe: true, senderName: "You", text: "Thank you for the update — we have been practising at home.", time: "9:15 AM" },
      { id: "m3", fromMe: false, senderName: "Mrs. Grace Antwi", text: "Wonderful. Keep it up — past questions go home this Friday.", time: "10:24 AM" },
    ],
  },
  {
    id: "MSG-2",
    withName: "Mr. Daniel Ampofo",
    withRole: "Maths Teacher",
    preview: "Reminder: the quadratic equations worksheet is due Wednesday.",
    time: "Yesterday",
    unread: true,
    avatarColor: "bg-blue-100 text-blue-700",
    messages: [
      { id: "m4", fromMe: false, senderName: "Mr. Daniel Ampofo", text: "Reminder: the quadratic equations worksheet is due Wednesday.", time: "Yesterday" },
    ],
  },
  {
    id: "MSG-3",
    withName: "Admin Office",
    withRole: "Administration",
    preview: "Your Term 3 invoice has been updated. Kindly check the fees page.",
    time: "Yesterday",
    unread: false,
    avatarColor: "bg-gray-100 text-gray-700",
    messages: [
      { id: "m5", fromMe: false, senderName: "Admin Office", text: "Your Term 3 invoice has been updated. Kindly check the fees page.", time: "Yesterday" },
    ],
  },
  {
    id: "MSG-4",
    withName: "Kwame Osei",
    withRole: "Parent — Abena Osei",
    preview: "Thank you for the update on the science project. We will…",
    time: "Mon",
    unread: false,
    avatarColor: "bg-success-100 text-success-700",
    messages: [
      { id: "m6", fromMe: false, senderName: "Kwame Osei", text: "Thank you for the update on the science project. We will support from home.", time: "Mon" },
      { id: "m7", fromMe: true, senderName: "You", text: "Appreciate it — Abena is doing well.", time: "Mon" },
    ],
  },
];

export const seedLeave: LeaveRequest[] = [
  { id: "LV-11", staffId: "ST-103", name: "Mr. Samuel Tetteh", type: "Sick leave", from: "1 Jul", to: "12 Jul", days: 9, status: "Approved" },
  { id: "LV-12", staffId: "ST-104", name: "Ms. Comfort Addo", type: "Casual leave", from: "14 Jul", to: "15 Jul", days: 2, status: "Pending" },
  { id: "LV-13", staffId: "ST-107", name: "Mr. Eric Nkrumah", type: "Annual leave", from: "3 Aug", to: "14 Aug", days: 10, status: "Pending" },
];
