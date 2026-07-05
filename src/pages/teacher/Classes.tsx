import { UserMultipleIcon, Door01Icon, NoteIcon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Avatar, Table, THead, TRow, TCell, SearchInput, Select, Progress, attendanceTone, Button } from "../../components/ui";
import { students, classes } from "../../data/mock";

export default function TeacherClasses() {
  const roster = students.filter((s) => s.class.startsWith("JHS 2"));

  return (
    <div>
      <PageHeader
        title="My Classes"
        subtitle="Rosters, profiles and class notes for your assigned classes."
        actions={<Button variant="secondary" icon={<NoteIcon size={18} />}>Class notes</Button>}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {classes.slice(0, 4).map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <UserMultipleIcon size={20} />
              </div>
              {c.name === "JHS 2A" && <Badge tone="brand">Class teacher</Badge>}
            </div>
            <h3 className="mt-3 text-lg font-bold text-gray-900">{c.name}</h3>
            <p className="text-sm text-gray-500">{c.students} students · Mathematics</p>
            <p className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-sm text-gray-500">
              <Door01Icon size={16} /> {c.room}
            </p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="JHS 2A & 2B roster" subtitle={`${roster.length} students shown`} />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder="Search students…" className="w-72" />
          <Select options={["JHS 2A & 2B", "JHS 2A", "JHS 2B"]} />
        </div>
        <Table>
          <THead cols={["Student", "ID", "Class", "Attendance", "Current GPA", "Status"]} />
          <tbody>
            {roster.map((s) => (
              <TRow key={s.id}>
                <TCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} color={s.avatarColor} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">Guardian: {s.guardian}</p>
                    </div>
                  </div>
                </TCell>
                <TCell>{s.id}</TCell>
                <TCell>{s.class}</TCell>
                <TCell>
                  <div className="flex w-32 items-center gap-2">
                    <Progress value={s.attendance} tone={attendanceTone(s.attendance)} className="flex-1" />
                    <span className="text-xs font-semibold">{s.attendance}%</span>
                  </div>
                </TCell>
                <TCell className="font-semibold text-gray-900">{s.gpa.toFixed(1)}</TCell>
                <TCell><Badge tone={statusTone(s.status)} dot>{s.status}</Badge></TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
