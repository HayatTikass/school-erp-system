import { Add01Icon, Book02Icon, BookDownloadIcon, Alert01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, SearchInput, Select, StatCard, Progress } from "../../components/ui";
import { books, borrowedBooks } from "../../data/mock";
import { formatDate, formatMoney } from "../../lib/utils";

export default function AdminLibrary() {
  return (
    <div>
      <PageHeader
        title="Library Management"
        subtitle="Catalogue, loans, returns and fines."
        actions={
          <>
            <Button variant="secondary" icon={<BookDownloadIcon size={18} />}>Issue book</Button>
            <Button icon={<Add01Icon size={18} />}>Add to catalogue</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Titles in catalogue" value="1,240" delta="35 added" deltaLabel="this term" icon={<Book02Icon size={20} />} />
        <StatCard label="Books on loan" value="86" delta="12 due this week" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Overdue" value="9" delta="oldest: 11 days" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
        <StatCard label="Fines collected" value="GH₵ 214" delta="this term" deltaLabel="" iconBg="bg-success-50 text-success-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader title="Book catalogue" />
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
            <SearchInput placeholder="Search title or author…" className="w-72" />
            <Select options={["All categories", "Literature", "Mathematics", "English", "Science", "ICT"]} />
          </div>
          <Table>
            <THead cols={["Title", "Category", "Availability", ""]} />
            <tbody>
              {books.map((b) => (
                <TRow key={b.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.author} · {b.id}</p>
                  </TCell>
                  <TCell><Badge tone="gray">{b.category}</Badge></TCell>
                  <TCell>
                    <div className="flex w-36 items-center gap-2">
                      <Progress value={(b.available / b.copies) * 100} tone={b.available === 0 ? "error" : b.available / b.copies < 0.3 ? "warning" : "success"} className="flex-1" />
                      <span className="text-xs font-semibold whitespace-nowrap text-gray-700">{b.available}/{b.copies}</span>
                    </div>
                  </TCell>
                  <TCell><Button variant="secondary" size="sm" disabled={b.available === 0}>Issue</Button></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Active loans & returns" action={<Badge tone="error" dot>1 overdue</Badge>} />
          <div className="divide-y divide-gray-100 px-5">
            {borrowedBooks.map((l) => (
              <div key={l.id} className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{l.book}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{l.student} · due {formatDate(l.due)}</p>
                  </div>
                  <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                </div>
                {l.fine > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-error-50 px-3 py-2 text-xs font-medium text-error-700">
                    <Alert01Icon size={14} /> Fine accruing: {formatMoney(l.fine)} — overdue notice sent to parent
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
