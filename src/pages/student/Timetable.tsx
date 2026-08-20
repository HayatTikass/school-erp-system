import TimetableView from "../../components/TimetableView";
import { useCurrentStudent } from "../../hooks/usePortalIdentity";

export default function StudentTimetable() {
  const student = useCurrentStudent();
  const name = student?.name.split(" ")[0] ?? "Your";

  return (
    <TimetableView
      title={`Timetable & Schedule · ${name}`}
      subtitle={student ? `Weekly classes for ${student.class} · exam schedule and school events.` : "Your weekly classes, exam schedule and school events."}
      className={student?.class}
    />
  );
}
