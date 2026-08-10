import { useMemo, useState } from "react";
import { Add01Icon, Book02Icon, BookDownloadIcon } from "hugeicons-react";
import {
  PageHeader,
  Card,
  CardHeader,
  Badge,
  Button,
  Table,
  THead,
  TRow,
  TCell,
  SearchInput,
  Select,
  StatCard,
  Progress,
} from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

const CATEGORIES = ["All categories", "Literature", "Mathematics", "English", "Science", "ICT"];

const emptyBook = { title: "", author: "", category: "Literature", copies: "1" };

export default function Catalogue() {
  const { books, students, issueBook, addBook } = useAppStore();
  const { toast } = useToast();
  const [issueOpen, setIssueOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [form, setForm] = useState({ book: books[0]?.title ?? "", student: "", due: "2026-07-20" });
  const [bookForm, setBookForm] = useState(emptyBook);

  const totalCopies = books.reduce((a, b) => a + b.copies, 0);
  const availableCopies = books.reduce((a, b) => a + b.available, 0);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (category !== "All categories" && b.category !== category) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    });
  }, [books, query, category]);

  const openIssue = (bookTitle?: string) => {
    setForm({ book: bookTitle || books[0]?.title || "", student: students[0]?.name || "", due: "2026-07-20" });
    setIssueOpen(true);
  };

  const submitIssue = () => {
    if (!form.book || !form.student) {
      toast("Select a book and student", "error");
      return;
    }
    issueBook(form.book, form.student, form.due);
    toast(`Issued "${form.book}" to ${form.student}`);
    setIssueOpen(false);
  };

  const submitAddBook = () => {
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      toast("Title and author are required", "error");
      return;
    }
    const copies = Number(bookForm.copies) || 1;
    addBook({
      title: bookForm.title.trim(),
      author: bookForm.author.trim(),
      category: bookForm.category,
      copies,
      available: copies,
    });
    toast(`"${bookForm.title.trim()}" added to catalogue`);
    setAddOpen(false);
    setBookForm(emptyBook);
  };

  return (
    <div>
      <PageHeader
        title="Book catalogue"
        subtitle="Search, filter and manage library titles."
        actions={
          <>
            <Button variant="secondary" icon={<BookDownloadIcon size={18} />} onClick={() => openIssue()}>
              Issue book
            </Button>
            <Button
              icon={<Add01Icon size={18} />}
              onClick={() => {
                setBookForm(emptyBook);
                setAddOpen(true);
              }}
            >
              Add to catalogue
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Titles in catalogue"
          value={String(books.length)}
          delta={`${filteredBooks.length} shown`}
          deltaLabel=""
          icon={<Book02Icon size={20} />}
        />
        <StatCard label="Total copies" value={String(totalCopies)} delta="across all titles" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
        <StatCard
          label="Available copies"
          value={String(availableCopies)}
          delta={`${totalCopies - availableCopies} on loan`}
          deltaLabel=""
          iconBg="bg-success-50 text-success-600"
        />
        <StatCard
          label="Out of stock"
          value={String(books.filter((b) => b.available === 0).length)}
          delta="titles with no copies"
          deltaLabel=""
          positive={false}
          iconBg="bg-error-50 text-error-600"
        />
      </div>

      <Card className="mt-6">
        <CardHeader title="Book catalogue" />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search title or author…" className="w-72" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select options={CATEGORIES} value={category} onChange={setCategory} />
        </div>
        <Table>
          <THead cols={["Title", "Category", "Availability", ""]} />
          <tbody>
            {filteredBooks.map((b) => (
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
                <TCell>
                  <Button variant="secondary" size="sm" disabled={b.available === 0} onClick={() => openIssue(b.title)}>
                    Issue
                  </Button>
                </TCell>
              </TRow>
            ))}
            {filteredBooks.length === 0 && (
              <TRow>
                <TCell className="py-10 text-center text-gray-400">No books match your filters.</TCell>
                <TCell /><TCell /><TCell />
              </TRow>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        title="Issue book"
        subtitle="Create a loan record"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIssueOpen(false)}>Cancel</Button>
            <Button onClick={submitIssue}>Issue book</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Book" required>
            <select className={inputClass} value={form.book} onChange={(e) => setForm({ ...form, book: e.target.value })}>
              {books.filter((b) => b.available > 0).map((b) => (
                <option key={b.id} value={b.title}>{b.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Student" required>
            <select className={inputClass} value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
              {students.map((s) => (
                <option key={s.id} value={s.name}>{s.name} · {s.class}</option>
              ))}
            </select>
          </Field>
          <Field label="Due date" required>
            <input type="date" className={inputClass} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add to catalogue"
        subtitle="Register a new book title"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={submitAddBook}>Add book</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title" required>
            <input className={inputClass} value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />
          </Field>
          <Field label="Author" required>
            <input className={inputClass} value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}>
              {CATEGORIES.filter((c) => c !== "All categories").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Copies">
            <input type="number" min={1} className={inputClass} value={bookForm.copies} onChange={(e) => setBookForm({ ...bookForm, copies: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
