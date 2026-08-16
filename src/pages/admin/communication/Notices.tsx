import { useMemo, useState } from "react";
import { Megaphone01Icon, SentIcon, Mail01Icon, SmsCodeIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, StatCard, Select } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { formatDate } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

const tagTone = { Event: "brand", Academic: "blue", Finance: "warning", General: "gray" } as const;

export default function CommunicationNotices() {
  const { notices, addNotice } = useAppStore();
  const { toast } = useToast();
  const [audience, setAudience] = useState("Everyone");
  const [channels, setChannels] = useState<string[]>(["In-app", "SMS"]);
  const [message, setMessage] = useState("Reminder: Term 3 exams begin on Monday 27 July. Please ensure all fees are settled before exam week.");
  const [announceOpen, setAnnounceOpen] = useState(false);
  const [boardFilter, setBoardFilter] = useState("All audiences");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<"Event" | "Academic" | "Finance" | "General">("General");

  const toggleChannel = (channel: string) =>
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel],
    );

  const boardFilterOptions = useMemo(
    () => ["All audiences", ...Array.from(new Set(notices.map((n) => n.audience))).sort()],
    [notices],
  );

  const visibleNotices = useMemo(
    () =>
      boardFilter === "All audiences"
        ? notices
        : notices.filter((n) => n.audience === boardFilter),
    [notices, boardFilter],
  );

  const sendBroadcast = () => {
    if (!message.trim()) {
      toast("Write a message first", "error");
      return;
    }
    if (channels.length === 0) {
      toast("Pick at least one channel", "error");
      return;
    }
    addNotice({
      title: `Broadcast to ${audience}`,
      body: message,
      audience,
      tag: "General",
    });
    toast(`Broadcast sent to ${audience} via ${channels.join(", ")}`);
  };

  return (
    <div>
      <PageHeader
        title="Communication & Notices"
        subtitle="Broadcast announcements, dispatch SMS/email and manage the noticeboard."
        actions={
          <Button icon={<Megaphone01Icon size={18} />} onClick={() => setAnnounceOpen(true)}>
            New announcement
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Announcements this term" value="24" delta="5 this week" deltaLabel="" icon={<Megaphone01Icon size={20} />} />
        <StatCard label="SMS sent" value="1,832" delta="98.2%" deltaLabel="delivery rate" icon={<SmsCodeIcon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Emails sent" value="946" delta="41.7%" deltaLabel="open rate" icon={<Mail01Icon size={20} />} iconBg="bg-success-50 text-success-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Quick broadcast" subtitle="Send to a group instantly" />
          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Audience</label>
              <Select options={["Everyone", "Parents", "Students", "Teachers", "JHS 3 parents only"]} className="w-full" value={audience} onChange={setAudience} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Channel</label>
              <div className="flex gap-2">
                {["In-app", "SMS", "Email"].map((c) => (
                  <label key={c} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:text-brand-700">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={channels.includes(c)}
                      onChange={() => toggleChannel(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={5}
                placeholder="Type your announcement…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button className="w-full" icon={<SentIcon size={18} />} onClick={sendBroadcast}>Send broadcast</Button>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Noticeboard"
            subtitle="Published announcements"
            action={<Select options={boardFilterOptions} value={boardFilter} onChange={setBoardFilter} />}
          />
          <div className="divide-y divide-gray-100 px-5">
            {visibleNotices.length === 0 && (
              <p className="py-6 text-sm text-gray-400">No notices for {boardFilter}.</p>
            )}
            {visibleNotices.map((n) => (
              <div key={n.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={tagTone[n.tag]}>{n.tag}</Badge>
                  <span className="text-xs text-gray-400">{formatDate(n.date)} · to {n.audience}</span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-gray-900">{n.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{n.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        open={announceOpen}
        onClose={() => setAnnounceOpen(false)}
        title="New announcement"
        subtitle="Publish to the noticeboard"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAnnounceOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!title.trim() || !body.trim()) {
                  toast("Title and body are required", "error");
                  return;
                }
                addNotice({ title, body, audience: "Everyone", tag });
                toast("Announcement published");
                setAnnounceOpen(false);
                setTitle("");
                setBody("");
              }}
            >
              Publish
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title" required>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Tag">
            <select className={inputClass} value={tag} onChange={(e) => setTag(e.target.value as typeof tag)}>
              <option>General</option>
              <option>Academic</option>
              <option>Event</option>
              <option>Finance</option>
            </select>
          </Field>
          <Field label="Body" required>
            <textarea className={inputClass} rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
