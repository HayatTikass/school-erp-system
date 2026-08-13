import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { Search01Icon, ArrowUpRight01Icon, ArrowDownRight01Icon } from "hugeicons-react";
import { cn, initials } from "../lib/utils";

/* ------------------------------ Button ---------------------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export function Button({ variant = "primary", size = "md", icon, className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors focus:outline-none focus-visible:ring-4",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-3.5 py-2.5 text-sm",
        size === "lg" && "px-4 py-2.5 text-base",
        variant === "primary" &&
          "bg-brand-600 text-white shadow-xs hover:bg-brand-700 focus-visible:ring-brand-100",
        variant === "secondary" &&
          "border border-gray-300 bg-white text-gray-700 shadow-xs hover:bg-gray-50 focus-visible:ring-gray-100",
        variant === "tertiary" && "text-brand-700 hover:bg-brand-50",
        variant === "destructive" &&
          "bg-error-600 text-white shadow-xs hover:bg-error-700 focus-visible:ring-error-100",
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

/* ------------------------------ Badge ------------------------------ */

export type BadgeTone = "gray" | "brand" | "success" | "warning" | "error" | "blue" | "indigo" | "pink" | "orange";

const badgeTones: Record<BadgeTone, string> = {
  gray: "bg-gray-50 text-gray-700 ring-gray-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  success: "bg-success-50 text-success-700 ring-success-200",
  warning: "bg-warning-50 text-warning-700 ring-warning-200",
  error: "bg-error-50 text-error-700 ring-error-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  pink: "bg-pink-50 text-pink-700 ring-pink-100",
  orange: "bg-orange-50 text-orange-700 ring-orange-100",
};

export function Badge({ tone = "gray", dot, children, className }: { tone?: BadgeTone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        badgeTones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (["paid", "active", "accepted", "completed", "returned", "submitted", "graded", "present", "on loan", "excellent", "outstanding"].some((k) => s.includes(k) && !s.includes("exam")))
    return s === "submitted" ? "blue" : "success";
  if (["partial", "review", "pending", "grading", "in progress", "waitlist", "warning", "medium", "on leave", "needs service", "maintenance", "fair"].some((k) => s.includes(k))) return "warning";
  if (["overdue", "unpaid", "suspend", "high", "late", "absent", "expel", "archived"].some((k) => s.includes(k))) return "error";
  if (["open", "exam scheduled", "draft", "low"].some((k) => s.includes(k))) return s === "draft" ? "gray" : "blue";
  return "gray";
}

/* ------------------------------- Card ------------------------------ */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-gray-200 bg-white shadow-xs", className)}>{children}</div>;
}

export function CardHeader({ title, subtitle, action, className }: { title: string; subtitle?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 px-5 py-4", className)}>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ----------------------------- StatCard ---------------------------- */

export function StatCard({ label, value, delta, deltaLabel = "vs last term", positive = true, icon, iconBg = "bg-brand-50 text-brand-600" }: {
  label: string;
  value: string;
  delta?: string;
  deltaLabel?: string;
  positive?: boolean;
  icon?: ReactNode;
  iconBg?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <div className={cn("flex size-10 items-center justify-center rounded-lg", iconBg)}>{icon}</div>}
      </div>
      <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
      {delta && (
        <p className="mt-2 flex items-center gap-1 text-sm">
          <span className={cn("flex items-center gap-0.5 font-medium", positive ? "text-success-600" : "text-error-600")}>
            {positive ? <ArrowUpRight01Icon size={16} /> : <ArrowDownRight01Icon size={16} />}
            {delta}
          </span>
          <span className="text-gray-500">{deltaLabel}</span>
        </p>
      )}
    </Card>
  );
}

/* ------------------------------ Avatar ----------------------------- */

export function Avatar({ name, color = "bg-brand-100 text-brand-700", size = "md" }: { name: string; color?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-14 text-lg",
        color,
      )}
    >
      {initials(name)}
    </div>
  );
}

/* ------------------------------ Table ------------------------------ */

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        {cols.map((c) => (
          <th key={c} className="px-5 py-3 text-xs font-semibold whitespace-nowrap text-gray-600">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn("border-b border-gray-100 last:border-0 hover:bg-gray-25", className)}>{children}</tr>;
}

export function TCell({ children, className, colSpan }: { children?: ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={cn("px-5 py-3.5 whitespace-nowrap text-gray-600", className)}>
      {children}
    </td>
  );
}

/* ------------------------------ Inputs ----------------------------- */

export function SearchInput({ placeholder = "Search", className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search01Icon size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-9.5 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
        {...rest}
      />
    </div>
  );
}

export function Select({ options, className, value, onChange }: { options: string[]; className?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none",
        className,
      )}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

/* ------------------------------- Tabs ------------------------------ */

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
            active === t ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-700",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------- PageHeader --------------------------- */

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

/* ---------------------------- Progress ----------------------------- */

export function Progress({ value, tone = "brand", className }: { value: number; tone?: "brand" | "success" | "warning" | "error"; className?: string }) {
  const tones = {
    brand: "bg-brand-600",
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500",
  };
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-100", className)}>
      <div className={cn("h-full rounded-full", tones[tone])} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function attendanceTone(v: number): "brand" | "success" | "warning" | "error" {
  if (v >= 90) return "success";
  if (v >= 75) return "warning";
  return "error";
}
