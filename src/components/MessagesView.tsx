import { useMemo, useState } from "react";
import { SentIcon, Attachment01Icon, PencilEdit02Icon } from "hugeicons-react";
import { PageHeader, Card, Badge, Button, Avatar, SearchInput } from "./ui";
import { Modal, Field, inputClass } from "./Modal";
import { cn } from "../lib/utils";
import { useAppStore } from "../store/AppStore";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";

export default function MessagesView({ title, subtitle }: { title: string; subtitle: string }) {
  const { conversations, sendMessage, startConversation, markConversationRead } = useAppStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState(conversations[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", role: "Parent", message: "" });

  const filtered = useMemo(() => {
    if (!query) return conversations;
    const q = query.toLowerCase();
    return conversations.filter(
      (c) =>
        c.withName.toLowerCase().includes(q) ||
        c.withRole.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const active = conversations.find((m) => m.id === selected) ?? conversations[0];

  const selectConversation = (id: string) => {
    setSelected(id);
    markConversationRead(id);
  };

  const handleSend = () => {
    if (!draft.trim() || !active) return;
    sendMessage(active.id, draft.trim(), user?.name ?? "You");
    setDraft("");
  };

  const handleNewMessage = () => {
    if (!newForm.name.trim() || !newForm.message.trim()) {
      toast("Recipient name and message are required", "error");
      return;
    }
    const convId = startConversation(newForm.name.trim(), newForm.role, newForm.message.trim(), user?.name ?? "You");
    toast(`Message sent to ${newForm.name.trim()}`);
    setNewOpen(false);
    setNewForm({ name: "", role: "Parent", message: "" });
    setSelected(convId);
  };

  if (!active) {
    return (
      <div>
        <PageHeader title={title} subtitle={subtitle} actions={<Button icon={<PencilEdit02Icon size={18} />} onClick={() => setNewOpen(true)}>New message</Button>} />
        <Card className="p-10 text-center text-gray-400">No conversations yet. Start a new message.</Card>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={<Button icon={<PencilEdit02Icon size={18} />} onClick={() => setNewOpen(true)}>New message</Button>}
      />

      <Card className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col border-r border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <SearchInput placeholder="Search messages…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => selectConversation(m.id)}
                className={cn("flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors", selected === m.id ? "bg-brand-25" : "hover:bg-gray-25")}
              >
                <Avatar name={m.withName} color={m.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("truncate text-sm", m.unread ? "font-bold text-gray-900" : "font-semibold text-gray-700")}>{m.withName}</p>
                    <span className="shrink-0 text-xs text-gray-400">{m.time}</span>
                  </div>
                  <p className="text-xs text-gray-500">{m.withRole}</p>
                  <p className={cn("mt-0.5 truncate text-xs", m.unread ? "font-medium text-gray-700" : "text-gray-500")}>{m.preview}</p>
                </div>
                {m.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">No messages match your search.</p>
            )}
          </div>
        </div>

        <div className="flex min-h-[480px] flex-col">
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
            <Avatar name={active.withName} color={active.avatarColor} size="sm" />
            <div>
              <p className="text-sm font-bold text-gray-900">{active.withName}</p>
              <p className="text-xs text-gray-500">{active.withRole}</p>
            </div>
            <Badge tone="success" dot className="ml-auto">Online</Badge>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-25 p-5">
            {active.messages.map((t) => (
              <div key={t.id} className={cn("flex", t.fromMe ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-xs", t.fromMe ? "rounded-br-sm bg-brand-600 text-white" : "rounded-bl-sm border border-gray-200 bg-white text-gray-700")}>
                  <p>{t.text}</p>
                  <p className={cn("mt-1 text-right text-[11px]", t.fromMe ? "text-brand-200" : "text-gray-400")}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-gray-200 p-4">
            <button type="button" className="rounded-lg p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600" title="Attach file">
              <Attachment01Icon size={20} />
            </button>
            <input
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm shadow-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
            />
            <Button icon={<SentIcon size={18} />} onClick={handleSend}>Send</Button>
          </div>
        </div>
      </Card>

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New message"
        subtitle="Start a conversation"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={handleNewMessage}>Send message</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Recipient name" required>
            <input className={inputClass} value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} placeholder="e.g. Mrs. Osei" />
          </Field>
          <Field label="Role">
            <select className={inputClass} value={newForm.role} onChange={(e) => setNewForm({ ...newForm, role: e.target.value })}>
              {["Parent", "Teacher", "Staff", "Student"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Message" required>
            <textarea className={inputClass} rows={4} value={newForm.message} onChange={(e) => setNewForm({ ...newForm, message: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
