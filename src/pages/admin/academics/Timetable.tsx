import { Calendar03Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, Button, Table, THead, TRow, TCell } from "../../../components/ui";
import { timetable } from "../../../data/mock";
import { useToast } from "../../../components/Toast";

export default function AcademicsTimetable() {
  const { toast } = useToast();

  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Weekly schedules by class · JHS 2A shown as reference."
        actions={
          <Button icon={<Calendar03Icon size={18} />} onClick={() => toast("Timetable editor will connect to scheduling module later.", "info")}>
            Edit timetable
          </Button>
        }
      />

      <Card>
        <CardHeader title="Weekly timetable · JHS 2A" subtitle="Block B · Room 1" action={<Badge tone="brand" dot>Published</Badge>} />
        <Table>
          <THead cols={["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]} />
          <tbody>
            {timetable.map((slot) => (
              <TRow key={slot.time}>
                <TCell className="font-semibold text-gray-900">{slot.time}</TCell>
                {[slot.mon, slot.tue, slot.wed, slot.thu, slot.fri].map((subj, i) =>
                  subj === "Break" ? (
                    <TCell key={i} className="text-center">
                      <Badge tone="warning">Break</Badge>
                    </TCell>
                  ) : (
                    <TCell key={i}>{subj}</TCell>
                  ),
                )}
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
