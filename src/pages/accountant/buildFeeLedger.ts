import type { Invoice, Payment, Student } from "../../data/mock";

export type FeeStatus = "Fully paid" | "Partial" | "Owing" | "Overdue";

export type StudentFeeRow = {
  id: string;
  name: string;
  class: string;
  guardian: string;
  avatarColor: string;
  billed: number;
  paid: number;
  balance: number;
  status: FeeStatus;
  invoiceCount: number;
  lastPayment?: string;
};

function feeStatus(balance: number, hasOverdue: boolean, paid: number): FeeStatus {
  if (balance <= 0) return "Fully paid";
  if (hasOverdue) return "Overdue";
  if (paid > 0) return "Partial";
  return "Owing";
}

export function buildStudentFeeLedger(
  students: Student[],
  invoices: Invoice[],
  payments: Payment[],
): StudentFeeRow[] {
  return students.map((s) => {
    const studentInvoices = invoices.filter((i) => i.student === s.name);
    let paid: number;
    let balance: number;
    let hasOverdue = false;
    let invoiceCount = studentInvoices.length;

    if (studentInvoices.length > 0) {
      paid = studentInvoices.reduce((a, i) => a + i.paid, 0);
      balance = studentInvoices.reduce((a, i) => a + (i.amount - i.paid), 0);
      hasOverdue = studentInvoices.some((i) => i.status === "Overdue");
    } else {
      balance = s.feesOwed;
      paid = balance === 0 ? 1850 : Math.max(0, 1850 - balance);
      invoiceCount = 1;
    }

    const lastPay = payments
      .filter((p) => p.student === s.name)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    return {
      id: s.id,
      name: s.name,
      class: s.class,
      guardian: s.guardian,
      avatarColor: s.avatarColor,
      billed: paid + balance,
      paid,
      balance,
      status: feeStatus(balance, hasOverdue, paid),
      invoiceCount,
      lastPayment: lastPay?.date,
    };
  });
}

export function feeBadgeStatus(status: FeeStatus) {
  if (status === "Fully paid") return "Paid";
  if (status === "Owing") return "Unpaid";
  return status;
}
