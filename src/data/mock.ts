/* ------------------------------------------------------------------ */
/* Central mock data for the whole ERP. Replace with API calls later. */
/* ------------------------------------------------------------------ */

export const school = {
  name: "Kingsford Academy",
  motto: "Knowledge · Character · Service",
  year: "2025/2026",
  term: "Term 3",
};

/* ---------------------------- People ------------------------------ */

export type Student = {
  id: string;
  name: string;
  class: string;
  gender: "M" | "F";
  guardian: string;
  status: "Active" | "Suspended" | "Archived";
  attendance: number; // %
  gpa: number;
  feesOwed: number;
  avatarColor: string;
};

export const students: Student[] = [
  { id: "KA-2401", name: "Abena Osei", class: "JHS 2A", gender: "F", guardian: "Kwame Osei", status: "Active", attendance: 96, gpa: 3.8, feesOwed: 0, avatarColor: "bg-brand-100 text-brand-700" },
  { id: "KA-2402", name: "Kojo Mensah", class: "JHS 2A", gender: "M", guardian: "Ama Mensah", status: "Active", attendance: 89, gpa: 3.2, feesOwed: 450, avatarColor: "bg-blue-100 text-blue-700" },
  { id: "KA-2403", name: "Efua Boateng", class: "JHS 2A", gender: "F", guardian: "Yaw Boateng", status: "Active", attendance: 98, gpa: 3.9, feesOwed: 0, avatarColor: "bg-pink-100 text-pink-700" },
  { id: "KA-2404", name: "Kwabena Asante", class: "JHS 2B", gender: "M", guardian: "Akosua Asante", status: "Active", attendance: 74, gpa: 2.6, feesOwed: 1200, avatarColor: "bg-orange-100 text-orange-700" },
  { id: "KA-2405", name: "Adwoa Owusu", class: "JHS 2B", gender: "F", guardian: "Kofi Owusu", status: "Active", attendance: 92, gpa: 3.5, feesOwed: 300, avatarColor: "bg-success-100 text-success-700" },
  { id: "KA-2406", name: "Yaw Darko", class: "JHS 1A", gender: "M", guardian: "Esi Darko", status: "Active", attendance: 85, gpa: 3.0, feesOwed: 800, avatarColor: "bg-indigo-100 text-indigo-700" },
  { id: "KA-2407", name: "Akua Frimpong", class: "JHS 1A", gender: "F", guardian: "Kwesi Frimpong", status: "Active", attendance: 94, gpa: 3.7, feesOwed: 0, avatarColor: "bg-cyan-100 text-cyan-700" },
  { id: "KA-2408", name: "Kofi Adjei", class: "JHS 3A", gender: "M", guardian: "Abena Adjei", status: "Suspended", attendance: 61, gpa: 2.1, feesOwed: 2150, avatarColor: "bg-error-100 text-error-700" },
  { id: "KA-2409", name: "Esi Amoah", class: "JHS 3A", gender: "F", guardian: "Kojo Amoah", status: "Active", attendance: 97, gpa: 4.0, feesOwed: 0, avatarColor: "bg-brand-100 text-brand-700" },
  { id: "KA-2410", name: "Kwame Appiah", class: "JHS 3B", gender: "M", guardian: "Adwoa Appiah", status: "Active", attendance: 88, gpa: 3.1, feesOwed: 650, avatarColor: "bg-warning-100 text-warning-700" },
  { id: "KA-2411", name: "Ama Sarpong", class: "JHS 1B", gender: "F", guardian: "Yaw Sarpong", status: "Active", attendance: 91, gpa: 3.4, feesOwed: 150, avatarColor: "bg-blue-100 text-blue-700" },
  { id: "KA-2412", name: "Nana Yeboah", class: "JHS 2A", gender: "M", guardian: "Efua Yeboah", status: "Active", attendance: 79, gpa: 2.8, feesOwed: 980, avatarColor: "bg-pink-100 text-pink-700" },
];

export type Staff = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "On leave";
  salary: number;
};

export const staff: Staff[] = [
  { id: "ST-101", name: "Mr. Daniel Ampofo", role: "Teacher — Mathematics", department: "Sciences", email: "d.ampofo@kingsford.edu.gh", phone: "024 555 0101", status: "Active", salary: 4200 },
  { id: "ST-102", name: "Mrs. Grace Antwi", role: "Teacher — English", department: "Languages", email: "g.antwi@kingsford.edu.gh", phone: "024 555 0102", status: "Active", salary: 4100 },
  { id: "ST-103", name: "Mr. Samuel Tetteh", role: "Teacher — Integrated Science", department: "Sciences", email: "s.tetteh@kingsford.edu.gh", phone: "024 555 0103", status: "On leave", salary: 4300 },
  { id: "ST-104", name: "Ms. Comfort Addo", role: "Teacher — Social Studies", department: "Humanities", email: "c.addo@kingsford.edu.gh", phone: "024 555 0104", status: "Active", salary: 3950 },
  { id: "ST-105", name: "Mr. Isaac Quartey", role: "Bursar", department: "Finance", email: "i.quartey@kingsford.edu.gh", phone: "024 555 0105", status: "Active", salary: 5200 },
  { id: "ST-106", name: "Mrs. Vida Lartey", role: "Librarian", department: "Library", email: "v.lartey@kingsford.edu.gh", phone: "024 555 0106", status: "Active", salary: 3100 },
  { id: "ST-107", name: "Mr. Eric Nkrumah", role: "Driver", department: "Transport", email: "e.nkrumah@kingsford.edu.gh", phone: "024 555 0107", status: "Active", salary: 2400 },
  { id: "ST-108", name: "Ms. Josephine Baah", role: "Teacher — ICT", department: "Sciences", email: "j.baah@kingsford.edu.gh", phone: "024 555 0108", status: "Active", salary: 4150 },
];

/* --------------------------- Academics ---------------------------- */

export const classes = [
  { id: "C1", name: "JHS 1A", teacher: "Mrs. Grace Antwi", students: 32, room: "Block A · Rm 1" },
  { id: "C2", name: "JHS 1B", teacher: "Ms. Comfort Addo", students: 30, room: "Block A · Rm 2" },
  { id: "C3", name: "JHS 2A", teacher: "Mr. Daniel Ampofo", students: 34, room: "Block B · Rm 1" },
  { id: "C4", name: "JHS 2B", teacher: "Mr. Samuel Tetteh", students: 31, room: "Block B · Rm 2" },
  { id: "C5", name: "JHS 3A", teacher: "Ms. Josephine Baah", students: 28, room: "Block C · Rm 1" },
  { id: "C6", name: "JHS 3B", teacher: "Mrs. Vida Lartey", students: 29, room: "Block C · Rm 2" },
];

export const subjects = [
  { id: "SUB1", name: "Mathematics", code: "MATH", teacher: "Mr. Daniel Ampofo", color: "bg-brand-100 text-brand-700" },
  { id: "SUB2", name: "English Language", code: "ENG", teacher: "Mrs. Grace Antwi", color: "bg-blue-100 text-blue-700" },
  { id: "SUB3", name: "Integrated Science", code: "SCI", teacher: "Mr. Samuel Tetteh", color: "bg-success-100 text-success-700" },
  { id: "SUB4", name: "Social Studies", code: "SOC", teacher: "Ms. Comfort Addo", color: "bg-warning-100 text-warning-700" },
  { id: "SUB5", name: "ICT", code: "ICT", teacher: "Ms. Josephine Baah", color: "bg-indigo-100 text-indigo-700" },
  { id: "SUB6", name: "Religious & Moral Ed.", code: "RME", teacher: "Ms. Comfort Addo", color: "bg-pink-100 text-pink-700" },
];

export type TimetableSlot = { time: string; mon: string; tue: string; wed: string; thu: string; fri: string };

export const timetable: TimetableSlot[] = [
  { time: "7:30 – 8:10", mon: "Mathematics", tue: "English", wed: "Science", thu: "Mathematics", fri: "ICT" },
  { time: "8:10 – 8:50", mon: "Mathematics", tue: "English", wed: "Science", thu: "Social Studies", fri: "ICT" },
  { time: "8:50 – 9:30", mon: "English", tue: "Science", wed: "Mathematics", thu: "Social Studies", fri: "RME" },
  { time: "9:30 – 9:50", mon: "Break", tue: "Break", wed: "Break", thu: "Break", fri: "Break" },
  { time: "9:50 – 10:30", mon: "Science", tue: "Mathematics", wed: "English", thu: "ICT", fri: "Mathematics" },
  { time: "10:30 – 11:10", mon: "Social Studies", tue: "RME", wed: "English", thu: "ICT", fri: "English" },
  { time: "11:10 – 11:50", mon: "ICT", tue: "Social Studies", wed: "RME", thu: "Science", fri: "Sports" },
];

export type Grade = { subject: string; class: string; test1: number; test2: number; exam: number; total: number; grade: string; remark: string };

export const grades: Grade[] = [
  { subject: "Mathematics", class: "JHS 2A", test1: 18, test2: 16, exam: 52, total: 86, grade: "A", remark: "Excellent" },
  { subject: "English Language", class: "JHS 2A", test1: 15, test2: 17, exam: 46, total: 78, grade: "B+", remark: "Very good" },
  { subject: "Integrated Science", class: "JHS 2A", test1: 17, test2: 14, exam: 49, total: 80, grade: "A-", remark: "Excellent" },
  { subject: "Social Studies", class: "JHS 2A", test1: 14, test2: 15, exam: 41, total: 70, grade: "B", remark: "Good" },
  { subject: "ICT", class: "JHS 2A", test1: 19, test2: 18, exam: 55, total: 92, grade: "A+", remark: "Outstanding" },
  { subject: "Religious & Moral Ed.", class: "JHS 2A", test1: 13, test2: 14, exam: 38, total: 65, grade: "B-", remark: "Fair" },
];

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  class: string;
  due: string;
  submitted: number;
  totalStudents: number;
  status: "Open" | "Closed" | "Grading";
  myStatus: "Submitted" | "Pending" | "Graded" | "Late";
  score?: string;
};

export const assignments: Assignment[] = [
  { id: "A1", title: "Quadratic equations worksheet", subject: "Mathematics", class: "JHS 2A", due: "2026-07-08", submitted: 21, totalStudents: 34, status: "Open", myStatus: "Submitted" },
  { id: "A2", title: "Essay: My community and I", subject: "English Language", class: "JHS 2A", due: "2026-07-06", submitted: 30, totalStudents: 34, status: "Grading", myStatus: "Graded", score: "17/20" },
  { id: "A3", title: "Lab report — photosynthesis", subject: "Integrated Science", class: "JHS 2A", due: "2026-07-10", submitted: 8, totalStudents: 34, status: "Open", myStatus: "Pending" },
  { id: "A4", title: "Map reading exercise", subject: "Social Studies", class: "JHS 2A", due: "2026-07-04", submitted: 33, totalStudents: 34, status: "Closed", myStatus: "Late", score: "12/20" },
  { id: "A5", title: "Build a simple HTML page", subject: "ICT", class: "JHS 2A", due: "2026-07-12", submitted: 3, totalStudents: 34, status: "Open", myStatus: "Pending" },
];

/* ---------------------------- Finance ----------------------------- */

export type Invoice = {
  id: string;
  student: string;
  class: string;
  item: string;
  amount: number;
  paid: number;
  due: string;
  status: "Paid" | "Partial" | "Overdue" | "Unpaid";
};

export const invoices: Invoice[] = [
  { id: "INV-1041", student: "Abena Osei", class: "JHS 2A", item: "Term 3 Tuition", amount: 1850, paid: 1850, due: "2026-05-15", status: "Paid" },
  { id: "INV-1042", student: "Kojo Mensah", class: "JHS 2A", item: "Term 3 Tuition", amount: 1850, paid: 1400, due: "2026-05-15", status: "Partial" },
  { id: "INV-1043", student: "Kwabena Asante", class: "JHS 2B", item: "Term 3 Tuition", amount: 1850, paid: 650, due: "2026-05-15", status: "Overdue" },
  { id: "INV-1044", student: "Adwoa Owusu", class: "JHS 2B", item: "Bus Fee — Term 3", amount: 300, paid: 0, due: "2026-06-01", status: "Unpaid" },
  { id: "INV-1045", student: "Esi Amoah", class: "JHS 3A", item: "Term 3 Tuition", amount: 1950, paid: 1950, due: "2026-05-15", status: "Paid" },
  { id: "INV-1046", student: "Kofi Adjei", class: "JHS 3A", item: "Term 3 Tuition + Exam Fee", amount: 2150, paid: 0, due: "2026-05-15", status: "Overdue" },
  { id: "INV-1047", student: "Yaw Darko", class: "JHS 1A", item: "Term 3 Tuition", amount: 1750, paid: 950, due: "2026-05-15", status: "Partial" },
  { id: "INV-1048", student: "Ama Sarpong", class: "JHS 1B", item: "ICT Lab Levy", amount: 150, paid: 0, due: "2026-06-20", status: "Unpaid" },
];

export type Payment = { id: string; student: string; amount: number; method: "MoMo" | "Bank" | "Cash"; date: string; ref: string };

export const payments: Payment[] = [
  { id: "PAY-2211", student: "Abena Osei", amount: 1850, method: "MoMo", date: "2026-05-10", ref: "MM-88213345" },
  { id: "PAY-2212", student: "Kojo Mensah", amount: 900, method: "Bank", date: "2026-05-12", ref: "GCB-4471021" },
  { id: "PAY-2213", student: "Esi Amoah", amount: 1950, method: "MoMo", date: "2026-05-08", ref: "MM-88104472" },
  { id: "PAY-2214", student: "Kojo Mensah", amount: 500, method: "Cash", date: "2026-06-02", ref: "RCPT-0341" },
  { id: "PAY-2215", student: "Yaw Darko", amount: 950, method: "MoMo", date: "2026-06-04", ref: "MM-89441120" },
  { id: "PAY-2216", student: "Kwabena Asante", amount: 650, method: "Cash", date: "2026-06-11", ref: "RCPT-0356" },
];

export const revenueByMonth = [
  { month: "Jan", revenue: 84500, expenses: 61200 },
  { month: "Feb", revenue: 45200, expenses: 58400 },
  { month: "Mar", revenue: 38900, expenses: 60100 },
  { month: "Apr", revenue: 91300, expenses: 59800 },
  { month: "May", revenue: 132400, expenses: 63500 },
  { month: "Jun", revenue: 58700, expenses: 62900 },
];

/* --------------------------- Attendance --------------------------- */

export const attendanceTrend = [
  { week: "Wk 1", rate: 94 },
  { week: "Wk 2", rate: 92 },
  { week: "Wk 3", rate: 95 },
  { week: "Wk 4", rate: 89 },
  { week: "Wk 5", rate: 91 },
  { week: "Wk 6", rate: 93 },
  { week: "Wk 7", rate: 96 },
  { week: "Wk 8", rate: 94 },
];

export const disciplineCases = [
  { id: "DC-31", student: "Kofi Adjei", class: "JHS 3A", incident: "Repeated truancy", date: "2026-06-18", severity: "High", status: "Suspension" },
  { id: "DC-32", student: "Kwabena Asante", class: "JHS 2B", incident: "Classroom disruption", date: "2026-06-22", severity: "Medium", status: "Warning issued" },
  { id: "DC-33", student: "Nana Yeboah", class: "JHS 2A", incident: "Late to school (4x)", date: "2026-06-25", severity: "Low", status: "Under review" },
];

/* ----------------------------- Library ---------------------------- */

export type Book = { id: string; title: string; author: string; category: string; copies: number; available: number };

export const books: Book[] = [
  { id: "BK-001", title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature", copies: 12, available: 4 },
  { id: "BK-002", title: "Aki-Ola Mathematics for JHS", author: "Aki-Ola Series", category: "Mathematics", copies: 30, available: 11 },
  { id: "BK-003", title: "Golden English (JHS 2)", author: "J. A. Mensah", category: "English", copies: 25, available: 17 },
  { id: "BK-004", title: "Integrated Science Made Easy", author: "K. Frimpong", category: "Science", copies: 20, available: 6 },
  { id: "BK-005", title: "The Beautyful Ones Are Not Yet Born", author: "Ayi Kwei Armah", category: "Literature", copies: 8, available: 8 },
  { id: "BK-006", title: "ICT Essentials for Basic Schools", author: "S. Ofori", category: "ICT", copies: 15, available: 2 },
];

export const borrowedBooks = [
  { id: "L-901", book: "Things Fall Apart", student: "Abena Osei", issued: "2026-06-20", due: "2026-07-04", status: "Overdue", fine: 5 },
  { id: "L-902", book: "Aki-Ola Mathematics for JHS", student: "Kojo Mensah", issued: "2026-06-28", due: "2026-07-12", status: "On loan", fine: 0 },
  { id: "L-903", book: "ICT Essentials for Basic Schools", student: "Esi Amoah", issued: "2026-07-01", due: "2026-07-15", status: "On loan", fine: 0 },
  { id: "L-904", book: "Integrated Science Made Easy", student: "Akua Frimpong", issued: "2026-06-15", due: "2026-06-29", status: "Returned", fine: 0 },
];

/* --------------------------- Transport ---------------------------- */

export const busRoutes = [
  { id: "RT-1", name: "Route 1 — East Legon Loop", driver: "Mr. Eric Nkrumah", vehicle: "GS 4521-24 (Coaster)", students: 28, fee: 300, status: "Active" },
  { id: "RT-2", name: "Route 2 — Madina / Adenta", driver: "Mr. Joseph Larbi", vehicle: "GS 3310-23 (Sprinter)", students: 22, fee: 350, status: "Active" },
  { id: "RT-3", name: "Route 3 — Spintex Road", driver: "Mr. Felix Owusu", vehicle: "GS 7789-22 (Coaster)", students: 31, fee: 320, status: "Maintenance" },
];

/* ------------------------ Assets & inventory ---------------------- */

export const assets = [
  { id: "AST-101", name: "HP ProBook laptops", category: "ICT Equipment", qty: 24, location: "ICT Lab", condition: "Good", value: 96000 },
  { id: "AST-102", name: "Classroom desks (dual)", category: "Furniture", qty: 180, location: "Blocks A–C", condition: "Fair", value: 54000 },
  { id: "AST-103", name: "Science lab kits", category: "Lab Equipment", qty: 15, location: "Science Lab", condition: "Good", value: 22500 },
  { id: "AST-104", name: "Projectors (Epson)", category: "ICT Equipment", qty: 6, location: "Staff Room Store", condition: "Good", value: 18000 },
  { id: "AST-105", name: "School bus — Coaster", category: "Vehicle", qty: 2, location: "Car Park", condition: "Needs service", value: 480000 },
];

/* ------------------------- Communication -------------------------- */

export type Notice = { id: string; title: string; body: string; audience: string; date: string; tag: "Event" | "Academic" | "Finance" | "General" };

export const notices: Notice[] = [
  { id: "N-1", title: "PTA meeting — Saturday 18 July", body: "All parents are invited to the Term 3 PTA meeting at the assembly hall, 9:00 AM. Agenda includes exam preparation and the building project levy.", audience: "Parents", date: "2026-07-03", tag: "Event" },
  { id: "N-2", title: "End-of-term exams begin 27 July", body: "Term 3 examinations run from 27 July to 5 August. The timetable has been published to student and parent portals.", audience: "Everyone", date: "2026-07-02", tag: "Academic" },
  { id: "N-3", title: "Fee payment deadline extended", body: "The deadline for outstanding Term 3 fees has been extended to 15 July. MoMo and bank payment options remain available.", audience: "Parents", date: "2026-06-30", tag: "Finance" },
  { id: "N-4", title: "Inter-house sports day", body: "The annual inter-house athletics competition takes place on 11 July at the school park. Students should come in house colours.", audience: "Students", date: "2026-06-28", tag: "Event" },
  { id: "N-5", title: "Library week — donate a book", body: "As part of library week, each class is encouraged to donate at least 5 storybooks to the school library.", audience: "Everyone", date: "2026-06-25", tag: "General" },
];

export type Message = { id: string; from: string; role: string; preview: string; time: string; unread: boolean; avatarColor: string };

export const messages: Message[] = [
  { id: "MSG-1", from: "Mrs. Grace Antwi", role: "English Teacher", preview: "Abena has shown remarkable improvement in her essays this term…", time: "10:24 AM", unread: true, avatarColor: "bg-brand-100 text-brand-700" },
  { id: "MSG-2", from: "Mr. Daniel Ampofo", role: "Maths Teacher", preview: "Reminder: the quadratic equations worksheet is due Wednesday.", time: "Yesterday", unread: true, avatarColor: "bg-blue-100 text-blue-700" },
  { id: "MSG-3", from: "Admin Office", role: "Administration", preview: "Your Term 3 invoice has been updated. Kindly check the fees page.", time: "Yesterday", unread: false, avatarColor: "bg-gray-100 text-gray-700" },
  { id: "MSG-4", from: "Kwame Osei", role: "Parent — Abena Osei", preview: "Thank you for the update on the science project. We will…", time: "Mon", unread: false, avatarColor: "bg-success-100 text-success-700" },
  { id: "MSG-5", from: "Ms. Josephine Baah", role: "ICT Teacher", preview: "The ICT lab session moves to Thursday this week due to…", time: "Mon", unread: false, avatarColor: "bg-pink-100 text-pink-700" },
];

export const events = [
  { id: "EV-1", title: "Inter-house sports day", date: "2026-07-11", type: "Sports" },
  { id: "EV-2", title: "PTA general meeting", date: "2026-07-18", type: "Meeting" },
  { id: "EV-3", title: "Term 3 exams begin", date: "2026-07-27", type: "Academic" },
  { id: "EV-4", title: "Speech & prize-giving day", date: "2026-08-08", type: "Ceremony" },
  { id: "EV-5", title: "Vacation begins", date: "2026-08-10", type: "Academic" },
];

/* --------------------------- Admissions --------------------------- */

export const applications = [
  { id: "APP-501", name: "Maame Adjeiwaa", appliedFor: "JHS 1", date: "2026-06-12", exam: 82, status: "Accepted" },
  { id: "APP-502", name: "Fiifi Cudjoe", appliedFor: "JHS 1", date: "2026-06-14", exam: 74, status: "Accepted" },
  { id: "APP-503", name: "Nana Ama Serwaa", appliedFor: "JHS 2", date: "2026-06-18", exam: 68, status: "Review" },
  { id: "APP-504", name: "Elikem Dzandu", appliedFor: "JHS 1", date: "2026-06-20", exam: 0, status: "Exam scheduled" },
  { id: "APP-505", name: "Papa Yaw Danso", appliedFor: "JHS 3", date: "2026-06-22", exam: 55, status: "Waitlist" },
  { id: "APP-506", name: "Naa Dedei Quaye", appliedFor: "JHS 1", date: "2026-06-25", exam: 0, status: "Submitted" },
];

/* ------------------------- Lesson planning ------------------------ */

export const lessonPlans = [
  { id: "LP-1", topic: "Quadratic equations — factorisation", subject: "Mathematics", class: "JHS 2A", week: "Week 9", status: "Completed", resources: 3 },
  { id: "LP-2", topic: "Quadratic equations — formula method", subject: "Mathematics", class: "JHS 2A", week: "Week 10", status: "In progress", resources: 2 },
  { id: "LP-3", topic: "Simultaneous linear equations", subject: "Mathematics", class: "JHS 2B", week: "Week 10", status: "In progress", resources: 4 },
  { id: "LP-4", topic: "Probability — basic concepts", subject: "Mathematics", class: "JHS 3A", week: "Week 11", status: "Draft", resources: 1 },
  { id: "LP-5", topic: "Statistics — mean, median, mode", subject: "Mathematics", class: "JHS 3B", week: "Week 11", status: "Draft", resources: 0 },
];

/* ----------------------------- Users ------------------------------ */

export const currentUsers = {
  admin: { name: "Mrs. Akosua Danquah", role: "Head of Administration", email: "a.danquah@kingsford.edu.gh" },
  teacher: { name: "Mr. Daniel Ampofo", role: "Mathematics · Class teacher, JHS 2A", email: "d.ampofo@kingsford.edu.gh" },
  student: { name: "Abena Osei", role: "JHS 2A · KA-2401", email: "abena.osei@kingsford.edu.gh" },
  parent: { name: "Kwame Osei", role: "Parent — Abena Osei (JHS 2A)", email: "kwame.osei@gmail.com" },
};

export const auditLog = [
  { id: 1, actor: "Mrs. Akosua Danquah", action: "Approved Term 3 report cards for JHS 3A", time: "Today, 9:41 AM" },
  { id: 2, actor: "Mr. Isaac Quartey", action: "Recorded MoMo payment of GH₵ 950 — Yaw Darko", time: "Today, 8:15 AM" },
  { id: 3, actor: "System", action: "Nightly backup completed successfully", time: "Today, 2:00 AM" },
  { id: 4, actor: "Mrs. Grace Antwi", action: "Submitted JHS 2A English grades for approval", time: "Yesterday, 4:32 PM" },
  { id: 5, actor: "Mrs. Vida Lartey", action: "Issued 'Things Fall Apart' to Abena Osei", time: "Yesterday, 1:07 PM" },
];

export const enrollmentByClass = [
  { name: "JHS 1", boys: 31, girls: 31 },
  { name: "JHS 2", boys: 34, girls: 31 },
  { name: "JHS 3", boys: 27, girls: 30 },
];

export const gpaTrend = [
  { term: "T1 '24", gpa: 3.1 },
  { term: "T2 '24", gpa: 3.3 },
  { term: "T3 '24", gpa: 3.2 },
  { term: "T1 '25", gpa: 3.5 },
  { term: "T2 '25", gpa: 3.6 },
  { term: "T3 '25", gpa: 3.8 },
];
