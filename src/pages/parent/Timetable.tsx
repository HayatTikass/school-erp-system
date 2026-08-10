import TimetableView from "../../components/TimetableView";
import { useParentChildren } from "../../hooks/usePortalIdentity";

export default function ParentTimetable() {
  const { selectedChild } = useParentChildren();
  const name = selectedChild?.name.split(" ")[0] ?? "Your child";

  return (
    <TimetableView
      title={`Timetable & Events — ${name}`}
      subtitle={selectedChild ? `Class timetable for ${selectedChild.class} — exam schedule, PTA meetings and school events.` : "Class timetable, exam schedule, PTA meetings and school events."}
    />
  );
}
