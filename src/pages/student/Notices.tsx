import { useState } from "react";
import { PageHeader, Card, Badge, Tabs } from "../../components/ui";
import { notices, events } from "../../data/mock";
import { formatDate } from "../../lib/utils";

const tagTone = { Event: "brand", Academic: "blue", Finance: "warning", General: "gray" } as const;

export default function StudentNotices() {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? notices : notices.filter((n) => n.tag === tab);

  return (
    <div>
      <PageHeader
        title="Notices & Communication"
        subtitle="School announcements, noticeboard and the event calendar."
        actions={<Tabs tabs={["All", "Academic", "Event", "General"]} active={tab} onChange={setTab} />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {filtered.map((n) => (
            <Card key={n.id} className="p-5 transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={tagTone[n.tag]}>{n.tag}</Badge>
                <span className="text-xs text-gray-400">{formatDate(n.date)} · for {n.audience}</span>
              </div>
              <h3 className="mt-2.5 text-base font-bold text-gray-900">{n.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{n.body}</p>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-base font-semibold text-gray-900">Event calendar</h3>
          </div>
          <div className="divide-y divide-gray-100 px-5">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 py-3.5">
                <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <span className="text-[10px] font-medium uppercase">{new Date(ev.date).toLocaleString("en", { month: "short" })}</span>
                  <span className="text-sm leading-none font-bold">{new Date(ev.date).getDate()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                  <p className="text-xs text-gray-500">{ev.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
