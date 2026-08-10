import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FileExportIcon,
  ArrowLeft01Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  UserMultipleIcon,
} from "hugeicons-react";
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  Button,
  Badge,
  statusTone,
  Avatar,
  Table,
  THead,
  TRow,
  TCell,
  SearchInput,
  Select,
  Tabs,
  Progress,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { formatMoney, formatDate } from "../../lib/utils";
import { useToast } from "../../components/Toast";
import { buildStudentFeeLedger, feeBadgeStatus } from "./buildFeeLedger";

const tabs = ["All students", "Fully paid", "Partial", "Owing"] as const;

export default function FeeLedger() {
  const { students, invoices, payments } = useAppStore();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("status");
  const [tab, setTab] = useState<string>(
    initialTab === "paid" ? "Fully paid" : initialTab === "partial" ? "Partial" : initialTab === "owing" ? "Owing" : "All students",
  );
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All classes");

  const ledger = useMemo(
    () => buildStudentFeeLedger(students, invoices, payments),
    [students, invoices, payments],
  );

  const fullyPaid = ledger.filter((r) => r.status === "Fully paid");
  const partial = ledger.filter((r) => r.status === "Partial");
  const owing = ledger.filter((r) => r.status === "Owing" || r.status === "Overdue");

  const totalPaid = ledger.reduce((a, r) => a + r.paid, 0);
  const totalBalance = ledger.reduce((a, r) => a + r.balance, 0);

  const filtered = ledger.filter((r) => {
    if (tab === "Fully paid" && r.status !== "Fully paid") return false;
    if (tab === "Partial" && r.status !== "Partial") return false;
    if (tab === "Owing" && r.status !== "Owing" && r.status !== "Overdue") return false;
    if (classFilter !== "All classes" && !r.class.startsWith(classFilter)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.guardian.toLowerCase().includes(q);
  });

  const changeTab = (next: string) => {
    setTab(next);
    const map: Record<string, string | null> = {
      "All students": null,
      "Fully paid": "paid",
      Partial: "partial",
      Owing: "owing",
    };
    const status = map[next];
    if (status) setSearchParams({ status });
    else setSearchParams({});
  };

  return (
    <div>
      <PageHeader
        title="Student fee ledger"
        subtitle="Every student — billed amount, paid, balance and payment status."
        actions={
          <>
            <Link to="/accountant">
              <Button variant="secondary" icon={<ArrowLeft01Icon size={18} />}>
                Back to dashboard
              </Button>
            </Link>
            <Button variant="secondary" icon={<FileExportIcon size={18} />} onClick={() => toast("Fee ledger exported (demo).", "info")}>
              Export ledger
            </Button>
            <Link to="/accountant/finance">
              <Button>Record payment</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students on ledger" value={String(ledger.length)} delta="all enrolled" deltaLabel="" icon={<UserMultipleIcon size={20} />} />
        <StatCard label="Fully paid" value={String(fullyPaid.length)} delta={formatMoney(fullyPaid.reduce((a, r) => a + r.paid, 0))} deltaLabel="collected" icon={<CheckmarkCircle02Icon size={20} />} iconBg="bg-success-50 text-success-600" />
        <StatCard label="Partial payments" value={String(partial.length)} delta={formatMoney(partial.reduce((a, r) => a + r.balance, 0))} deltaLabel="still due" iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Owing / overdue" value={String(owing.length)} delta={formatMoney(totalBalance)} deltaLabel="outstanding" positive={false} icon={<AlertCircleIcon size={20} />} iconBg="bg-error-50 text-error-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Fully paid", count: fullyPaid.length, amount: fullyPaid.reduce((a, r) => a + r.paid, 0), tone: "success" as const, tab: "Fully paid", desc: "No outstanding balance" },
          { label: "Partially paid", count: partial.length, amount: partial.reduce((a, r) => a + r.balance, 0), tone: "warning" as const, tab: "Partial", desc: "Balance still due" },
          { label: "Owing / overdue", count: owing.length, amount: owing.reduce((a, r) => a + r.balance, 0), tone: "error" as const, tab: "Owing", desc: "Needs follow-up" },
        ].map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => changeTab(s.tab)}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-xs transition-shadow hover:shadow-md"
          >
            <Badge tone={s.tone} dot>
              {s.label}
            </Badge>
            <p className="mt-3 text-3xl font-bold text-gray-900">{s.count}</p>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {s.tone === "success" ? "Collected" : "Balance"}: {formatMoney(s.amount)}
            </p>
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Ledger"
          subtitle={`${formatMoney(totalPaid)} collected · ${formatMoney(totalBalance)} outstanding`}
          action={<Tabs tabs={[...tabs]} active={tab} onChange={changeTab} />}
        />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput
            placeholder="Search student, ID or guardian…"
            className="w-72"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select options={["All classes", "JHS 1", "JHS 2", "JHS 3"]} value={classFilter} onChange={setClassFilter} />
          <span className="ml-auto text-sm text-gray-500">
            Showing {filtered.length} of {ledger.length}
          </span>
        </div>
        <Table>
          <THead cols={["Student", "Class", "Guardian", "Billed", "Paid", "Balance", "Progress", "Status", "Last payment"]} />
          <tbody>
            {filtered.map((r) => {
              const pct = r.billed > 0 ? Math.round((r.paid / r.billed) * 100) : 100;
              return (
                <TRow key={r.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} color={r.avatarColor} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.id}</p>
                      </div>
                    </div>
                  </TCell>
                  <TCell>{r.class}</TCell>
                  <TCell>{r.guardian}</TCell>
                  <TCell className="font-medium text-gray-900">{formatMoney(r.billed)}</TCell>
                  <TCell className="font-semibold text-success-700">{formatMoney(r.paid)}</TCell>
                  <TCell className={r.balance > 0 ? "font-bold text-error-600" : "font-semibold text-gray-500"}>
                    {formatMoney(r.balance)}
                  </TCell>
                  <TCell>
                    <div className="flex w-28 items-center gap-2">
                      <Progress value={pct} tone={pct >= 100 ? "success" : pct >= 50 ? "warning" : "error"} className="flex-1" />
                      <span className="text-xs font-semibold text-gray-600">{pct}%</span>
                    </div>
                  </TCell>
                  <TCell>
                    <Badge tone={statusTone(feeBadgeStatus(r.status))} dot>
                      {r.status}
                    </Badge>
                  </TCell>
                  <TCell className="text-gray-500">{r.lastPayment ? formatDate(r.lastPayment) : "—"}</TCell>
                </TRow>
              );
            })}
            {filtered.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400">No students match this filter.</TCell>
                <TCell /><TCell /><TCell /><TCell /><TCell /><TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
