import { useMemo, useState } from "react";
import { Book02Icon, Alert01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, SearchInput, Select, StatCard } from "../../components/ui";
import { formatMoney, formatDate } from "../../lib/utils";
import { useAppStore } from "../../store/AppStore";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";
import { useToast } from "../../components/Toast";

export default function StudentLibrary() {
  const student = useCurrentStudent();
  const { loans, books, renewLoan } = useAppStore();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");

  const categories = useMemo(
    () => ["All categories", ...Array.from(new Set(books.map((b) => b.category))).sort()],
    [books],
  );

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesQuery =
        !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesCategory = category === "All categories" || b.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [books, query, category]);

  const myLoans = useMemo(
    () => (student ? loans.filter((l) => l.student === student.name) : []),
    [loans, student],
  );
  const activeLoans = myLoans.filter((l) => l.status !== "Returned");
  const returnedLoans = myLoans.filter((l) => l.status === "Returned");
  const overdue = activeLoans.find((l) => l.status === "Overdue");
  const totalFines = activeLoans.reduce((sum, l) => sum + l.fine, 0);

  if (!student) {
    return (
      <div>
        <PageHeader title="Library" subtitle="Browse the catalogue and track your loans." />
        <Card className="p-6 text-sm text-gray-600">No student profile linked to this account.</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Library" subtitle={`Browse the catalogue, track loans and fines · ${student.name}.`} />

      {overdue && (
        <Card className="border-error-200 bg-error-25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-error-100 text-error-600">
                <Alert01Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">"{overdue.book}" is overdue</p>
                <p className="text-sm text-gray-600">
                  Due {formatDate(overdue.due)} · return or renew to stop fines (currently {formatMoney(overdue.fine)}).
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => { renewLoan(overdue.id); toast(`Renewed "${overdue.book}" for 14 days`); }}>
              Renew loan
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Books on loan" value={String(activeLoans.length)} delta="limit: 3" deltaLabel="" icon={<Book02Icon size={20} />} />
        <StatCard label="Returned this year" value={String(returnedLoans.length)} delta={student.class} deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Outstanding fines" value={formatMoney(totalFines)} delta={overdue ? "1 overdue book" : "none"} deltaLabel="" positive={totalFines === 0} iconBg="bg-error-50 text-error-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Book catalogue" subtitle="Reserve a copy and pick it up at the library" />
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
            <SearchInput
              placeholder="Search title or author…"
              className="w-72"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select options={categories} value={category} onChange={setCategory} />
          </div>
          <Table>
            <THead cols={["Title", "Category", "Available", ""]} />
            <tbody>
              {visibleBooks.length === 0 && (
                <TRow>
                  <TCell colSpan={4} className="py-8 text-center text-gray-400">
                    No books match your search.
                  </TCell>
                </TRow>
              )}
              {visibleBooks.map((b) => (
                <TRow key={b.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.author}</p>
                  </TCell>
                  <TCell><Badge tone="gray">{b.category}</Badge></TCell>
                  <TCell>
                    <Badge tone={b.available > 0 ? "success" : "error"} dot>{b.available > 0 ? `${b.available} available` : "None available"}</Badge>
                  </TCell>
                  <TCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={b.available === 0}
                      onClick={() => toast(`Reservation placed for "${b.title}" · pick up within 3 days`, "info")}
                    >
                      Reserve
                    </Button>
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="My loans" subtitle="Current and due" />
          <div className="divide-y divide-gray-100 px-5">
            {activeLoans.length === 0 && (
              <p className="py-4 text-sm text-gray-500">No books currently on loan.</p>
            )}
            {activeLoans.map((l) => (
              <div key={l.id} className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{l.book}</p>
                  <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500">Issued {formatDate(l.issued)} · due {formatDate(l.due)}</p>
                {l.fine > 0 && <p className="mt-1.5 text-xs font-semibold text-error-600">Fine: {formatMoney(l.fine)}</p>}
                {l.status !== "Returned" && (
                  <Button variant="secondary" size="sm" className="mt-2" onClick={() => { renewLoan(l.id); toast(`Renewed "${l.book}"`); }}>
                    Renew
                  </Button>
                )}
              </div>
            ))}
            {returnedLoans.length > 0 && (
              <div className="py-4">
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Recently returned</p>
                {returnedLoans.slice(0, 3).map((l) => (
                  <p key={l.id} className="mt-2 text-sm text-gray-600">{l.book}</p>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
