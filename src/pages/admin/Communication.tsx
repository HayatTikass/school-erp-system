import { Megaphone01Icon, SentIcon, Mail01Icon, SmsCodeIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, StatCard, Select } from "../../components/ui";
import { notices, events } from "../../data/mock";
import { formatDate } from "../../lib/utils";

const tagTone = { Event: "brand", Academic: "blue", Finance: "warning", General: "gray" } as const;

export default function AdminCommunication() {
  return (
    <div>
      <PageHeader
        title="Communication & Notices"
        subtitle="Broadcast announcements, dispatch SMS/email and manage the noticeboard."
        actions={<Button icon={<Megaphone01Icon size={18} />}>New announcement</Button>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Announcements this term" value="24" delta="5 this week" deltaLabel="" icon={<Megaphone01Icon size={20} />} />
        <StatCard label="SMS sent" value="1,832" delta="98.2%" deltaLabel="delivery rate" icon={<SmsCodeIcon size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Emails sent" value="946" delta="41.7%" deltaLabel="open rate" icon={<Mail01Icon size={20} />} iconBg="bg-success-50 text-success-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Composer */}
        <Card>
          <CardHeader title="Quick broadcast" subtitle="Send to a group instantly" />
          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Audience</label>
              <Select options={["Everyone", "Parents", "Students", "Teachers", "JHS 3 parents only"]} className="w-full" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Channel</label>
              <div className="flex gap-2">
                {["In-app", "SMS", "Email"].map((c, i) => (
                  <label key={c} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:text-brand-700">
                    <input type="checkbox" defaultChecked={i < 2} className="hidden" />
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
                defaultValue="Reminder: Term 3 exams begin on Monday 27 July. Please ensure all fees are settled before exam week."
              />
            </div>
            <Button className="w-full" icon={<SentIcon size={18} />}>Send broadcast</Button>
          </div>
        </Card>

        {/* Noticeboard */}
        <Card className="xl:col-span-2">
          <CardHeader title="Noticeboard" subtitle="Published announcements" action={<Select options={["All audiences", "Parents", "Students", "Everyone"]} />} />
          <div className="divide-y divide-gray-100 px-5">
            {notices.map((n) => (
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

      <Card className="mt-6">
        <CardHeader title="Event calendar" subtitle="Upcoming school events" action={<Button variant="secondary" size="sm">Add event</Button>} />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex size-11 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <span className="text-[10px] font-medium uppercase">{new Date(ev.date).toLocaleString("en", { month: "short" })}</span>
                <span className="text-base leading-none font-bold">{new Date(ev.date).getDate()}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{ev.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{ev.type}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
