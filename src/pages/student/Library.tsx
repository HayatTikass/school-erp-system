import { Book02Icon, Alert01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, SearchInput, Select, StatCard } from "../../components/ui";
import { books } from "../../data/mock";
import { formatMoney } from "../../lib/utils";

const myLoans = [
  { book: "Things Fall Apart", issued: "20 Jun 2026", due: "4 Jul 2026", status: "Overdue", fine: 5 },
  { book: "Aki-Ola Mathematics for JHS", issued: "28 Jun 2026", due: "12 Jul 2026", status: "On loan", fine: 0 },
];

export default function StudentLibrary() {
  return (
    <div>
      <PageHeader title="Library" subtitle="Browse the catalogue, track your loans and fines." />

      {/* Overdue alert */}
      <Card className="border-error-200 bg-error-25 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-error-100 text-error-600">
              <Alert01Icon size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">"Things Fall Apart" is 2 days overdue</p>
              <p className="text-sm text-gray-600">Return it to the library to stop the fine (currently {formatMoney(5)}).</p>
            </div>
          </div>
          <Button variant="secondary" size="sm">Renew loan</Button>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Books on loan" value="2" delta="limit: 3" deltaLabel="" icon={<Book02Icon size={20} />} />
        <StatCard label="Borrowed this year" value="14" delta="top 10 reader" deltaLabel="in JHS 2" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Outstanding fines" value={formatMoney(5)} delta="1 overdue book" deltaLabel="" positive={false} iconBg="bg-error-50 text-error-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Book catalogue" subtitle="Reserve a copy and pick it up at the library" />
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
            <SearchInput placeholder="Search title or author…" className="w-72" />
            <Select options={["All categories", "Literature", "Mathematics", "English", "Science", "ICT"]} />
          </div>
          <Table>
            <THead cols={["Title", "Category", "Available", ""]} />
            <tbody>
              {books.map((b) => (
                <TRow key={b.id}>
                  <TCell>
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.author}</p>
                  </TCell>
                  <TCell><Badge tone="gray">{b.category}</Badge></TCell>
                  <TCell>
                    <Badge tone={b.available > 0 ? "success" : "error"} dot>{b.available > 0 ? `${b.available} available` : "None available"}</Badge>
                  </TCell>
                  <TCell><Button variant="secondary" size="sm" disabled={b.available === 0}>Reserve</Button></TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="My loans" subtitle="Current and due" />
          <div className="divide-y divide-gray-100 px-5">
            {myLoans.map((l) => (
              <div key={l.book} className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{l.book}</p>
                  <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500">Issued {l.issued} · due {l.due}</p>
                {l.fine > 0 && <p className="mt-1.5 text-xs font-semibold text-error-600">Fine: {formatMoney(l.fine)}</p>}
              </div>
            ))}
            <div className="py-4">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Recently returned</p>
              {["Golden English (JHS 2)", "ICT Essentials for Basic Schools", "The Beautyful Ones Are Not Yet Born"].map((b) => (
                <p key={b} className="mt-2 text-sm text-gray-600">{b}</p>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
