import { useState } from "react";
import { SentIcon, Attachment01Icon, PencilEdit02Icon } from "hugeicons-react";
import { PageHeader, Card, Badge, Button, Avatar, SearchInput } from "./ui";
import { messages } from "../data/mock";
import { cn } from "../lib/utils";

const thread = [
  { fromMe: false, text: "Good morning. I wanted to ask about the upcoming end-of-term exams — will past questions be shared with the students?", time: "9:02 AM" },
  { fromMe: true, text: "Good morning! Yes — revision packs including past questions go home with students this Friday. Soft copies will also be posted on the portal.", time: "9:15 AM" },
  { fromMe: false, text: "That's great, thank you. Abena has been practising at home and this will help a lot.", time: "10:24 AM" },
];

export default function MessagesView({ title, subtitle }: { title: string; subtitle: string }) {
  const [selected, setSelected] = useState(messages[0].id);
  const active = messages.find((m) => m.id === selected)!;

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={title} subtitle={subtitle} actions={<Button icon={<PencilEdit02Icon size={18} />}>New message</Button>} />

      <Card className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]">
        {/* Inbox list */}
        <div className="flex flex-col border-r border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <SearchInput placeholder="Search messages…" />
          </div>
          <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={cn("flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors", selected === m.id ? "bg-brand-25" : "hover:bg-gray-25")}
              >
                <Avatar name={m.from} color={m.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("truncate text-sm", m.unread ? "font-bold text-gray-900" : "font-semibold text-gray-700")}>{m.from}</p>
                    <span className="shrink-0 text-xs text-gray-400">{m.time}</span>
                  </div>
                  <p className="text-xs text-gray-500">{m.role}</p>
                  <p className={cn("mt-0.5 truncate text-xs", m.unread ? "font-medium text-gray-700" : "text-gray-500")}>{m.preview}</p>
                </div>
                {m.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className="flex min-h-[480px] flex-col">
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
            <Avatar name={active.from} color={active.avatarColor} size="sm" />
            <div>
              <p className="text-sm font-bold text-gray-900">{active.from}</p>
              <p className="text-xs text-gray-500">{active.role}</p>
            </div>
            <Badge tone="success" dot className="ml-auto">Online</Badge>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-25 p-5">
            {thread.map((t, i) => (
              <div key={i} className={cn("flex", t.fromMe ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-xs", t.fromMe ? "rounded-br-sm bg-brand-600 text-white" : "rounded-bl-sm border border-gray-200 bg-white text-gray-700")}>
                  <p>{t.text}</p>
                  <p className={cn("mt-1 text-right text-[11px]", t.fromMe ? "text-brand-200" : "text-gray-400")}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-gray-200 p-4">
            <button className="rounded-lg p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Attachment01Icon size={20} /></button>
            <input
              placeholder="Type a message…"
              className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm shadow-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
            />
            <Button icon={<SentIcon size={18} />}>Send</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
