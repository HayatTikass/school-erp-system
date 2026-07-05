import { useState } from "react";
import { Add01Icon, Calendar03Icon, UserMultipleIcon, Door01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Table, THead, TRow, TCell, Tabs } from "../../components/ui";
import { classes, subjects, timetable, school } from "../../data/mock";

export default function AdminAcademics() {
  const [tab, setTab] = useState("Classes");

  return (
    <div>
      <PageHeader
        title="Academic Configuration"
        subtitle={`Academic year ${school.year} · ${school.term} — manage classes, subjects, timetables and grading.`}
        actions={
          <>
            <Button variant="secondary" icon={<Calendar03Icon size={18} />}>Academic calendar</Button>
            <Button icon={<Add01Icon size={18} />}>{tab === "Subjects" ? "Add subject" : tab === "Timetable" ? "Edit timetable" : "Add class"}</Button>
          </>
        }
      />

      <div className="mb-6 w-fit">
        <Tabs tabs={["Classes", "Subjects", "Timetable", "Grading"]} active={tab} onChange={setTab} />
      </div>

      {tab === "Classes" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((c) => (
            <Card key={c.id} className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <UserMultipleIcon size={22} />
                </div>
                <Badge tone="brand">{c.students} students</Badge>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-500">Class teacher: <span className="font-medium text-gray-700">{c.teacher}</span></p>
              <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-4 text-sm text-gray-500">
                <Door01Icon size={16} /> {c.room}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Subjects" && (
        <Card>
          <CardHeader title="Subjects offered" subtitle="Linked to all JHS classes" />
          <Table>
            <THead cols={["Subject", "Code", "Lead teacher", "Classes", "Weekly periods"]} />
            <tbody>
              {subjects.map((s) => (
                <TRow key={s.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <span className={`flex size-9 items-center justify-center rounded-lg text-xs font-bold ${s.color}`}>{s.code}</span>
                      <span className="font-semibold text-gray-900">{s.name}</span>
                    </div>
                  </TCell>
                  <TCell>{s.code}</TCell>
                  <TCell>{s.teacher}</TCell>
                  <TCell>JHS 1 – JHS 3</TCell>
                  <TCell>{s.code === "MATH" || s.code === "ENG" ? 6 : 4}</TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {tab === "Timetable" && (
        <Card>
          <CardHeader title="Weekly timetable — JHS 2A" subtitle="Block B · Room 1" action={<Badge tone="brand" dot>Published</Badge>} />
          <Table>
            <THead cols={["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]} />
            <tbody>
              {timetable.map((slot) => (
                <TRow key={slot.time}>
                  <TCell className="font-semibold text-gray-900">{slot.time}</TCell>
                  {[slot.mon, slot.tue, slot.wed, slot.thu, slot.fri].map((subj, i) =>
                    subj === "Break" ? (
                      <TCell key={i} className="text-center"><Badge tone="warning">Break</Badge></TCell>
                    ) : (
                      <TCell key={i}>{subj}</TCell>
                    ),
                  )}
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {tab === "Grading" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Grading scale" subtitle="Applies to all continuous assessment and exams" />
            <Table>
              <THead cols={["Score range", "Grade", "GPA points", "Remark"]} />
              <tbody>
                {[
                  ["90 – 100", "A+", "4.0", "Outstanding"],
                  ["80 – 89", "A", "4.0", "Excellent"],
                  ["75 – 79", "A-", "3.7", "Excellent"],
                  ["70 – 74", "B+", "3.3", "Very good"],
                  ["65 – 69", "B", "3.0", "Good"],
                  ["60 – 64", "B-", "2.7", "Fair"],
                  ["50 – 59", "C", "2.0", "Pass"],
                  ["0 – 49", "F", "0.0", "Fail"],
                ].map((row) => (
                  <TRow key={row[1]}>
                    <TCell className="font-medium text-gray-900">{row[0]}</TCell>
                    <TCell><Badge tone={row[1].startsWith("A") ? "success" : row[1].startsWith("B") ? "blue" : row[1] === "C" ? "warning" : "error"}>{row[1]}</Badge></TCell>
                    <TCell>{row[2]}</TCell>
                    <TCell>{row[3]}</TCell>
                  </TRow>
                ))}
              </tbody>
            </Table>
          </Card>
          <Card>
            <CardHeader title="Assessment weighting" subtitle="How term totals are computed" />
            <div className="space-y-5 p-5">
              {[
                { label: "Class test 1", weight: 20 },
                { label: "Class test 2", weight: 20 },
                { label: "End-of-term exam", weight: 60 },
              ].map((w) => (
                <div key={w.label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{w.label}</span>
                    <span className="font-semibold text-gray-900">{w.weight}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${w.weight}%` }} />
                  </div>
                </div>
              ))}
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                Term totals auto-calculate from these weightings. Teachers may propose custom weightings per subject, subject to admin approval.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
