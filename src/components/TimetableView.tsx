import { Calendar03Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Table, THead, TRow, TCell } from "./ui";
import { timetable, events, subjects } from "../data/mock";

const examSchedule = [
  { date: "Mon 27 Jul", subject: "Mathematics", time: "8:00 – 10:00", room: "Assembly Hall" },
  { date: "Tue 28 Jul", subject: "English Language", time: "8:00 – 10:00", room: "Assembly Hall" },
  { date: "Wed 29 Jul", subject: "Integrated Science", time: "8:00 – 10:00", room: "Assembly Hall" },
  { date: "Thu 30 Jul", subject: "Social Studies", time: "8:00 – 9:30", room: "Block B · Rm 1" },
  { date: "Fri 31 Jul", subject: "ICT", time: "8:00 – 9:30", room: "ICT Lab" },
];

export default function TimetableView({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  /** Class whose timetable is shown — rendered as a label, not a picker. */
  className?: string;
}) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={className ? <Badge tone="brand">{className}</Badge> : undefined}
      />

      <Card>
        <CardHeader title="Weekly timetable" subtitle="Effective from 4 May 2026" action={<Badge tone="brand" dot>Current week</Badge>} />
        <Table>
          <THead cols={["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]} />
          <tbody>
            {timetable.map((slot) => (
              <TRow key={slot.time}>
                <TCell className="font-semibold text-gray-900">{slot.time}</TCell>
                {[slot.mon, slot.tue, slot.wed, slot.thu, slot.fri].map((subjName, i) => {
                  if (subjName === "Break") return <TCell key={i}><Badge tone="warning">Break</Badge></TCell>;
                  const subj = subjects.find((s) => subjName.startsWith(s.name.split(" ")[0]));
                  return (
                    <TCell key={i}>
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${subj?.color ?? "bg-gray-100 text-gray-600"}`}>{subjName}</span>
                    </TCell>
                  );
                })}
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Term 3 exam schedule" subtitle="27 – 31 July · arrive 30 minutes early" action={<Badge tone="error" dot>3 weeks away</Badge>} />
          <Table>
            <THead cols={["Date", "Subject", "Time", "Venue"]} />
            <tbody>
              {examSchedule.map((e) => (
                <TRow key={e.subject}>
                  <TCell className="font-semibold text-gray-900">{e.date}</TCell>
                  <TCell>{e.subject}</TCell>
                  <TCell>{e.time}</TCell>
                  <TCell>{e.room}</TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="School events" subtitle="Key dates this term" />
          <div className="divide-y divide-gray-100 px-5">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 py-3.5">
                <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <span className="text-[10px] font-medium uppercase">{new Date(ev.date).toLocaleString("en", { month: "short" })}</span>
                  <span className="text-sm leading-none font-bold">{new Date(ev.date).getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{ev.title}</p>
                  <p className="text-xs text-gray-500">{ev.type}</p>
                </div>
                <Calendar03Icon size={18} className="text-gray-300" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
