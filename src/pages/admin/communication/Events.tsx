import { useState } from "react";
import { Add01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Button } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

export default function CommunicationEvents() {
  const { events, addEvent } = useAppStore();
  const { toast } = useToast();
  const [eventOpen, setEventOpen] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", date: "", type: "Academic" });

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="School calendar and upcoming events."
        actions={
          <Button
            icon={<Add01Icon size={18} />}
            onClick={() => {
              setEventForm({ title: "", date: "", type: "Academic" });
              setEventOpen(true);
            }}
          >
            Add event
          </Button>
        }
      />

      <Card>
        <CardHeader title="Event calendar" subtitle="Upcoming school events" />
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

      <Modal
        open={eventOpen}
        onClose={() => setEventOpen(false)}
        title="Add event"
        subtitle="Add to school calendar"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEventOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!eventForm.title.trim() || !eventForm.date) {
                  toast("Title and date are required", "error");
                  return;
                }
                addEvent({ title: eventForm.title.trim(), date: eventForm.date, type: eventForm.type });
                toast(`"${eventForm.title.trim()}" added to calendar`);
                setEventOpen(false);
                setEventForm({ title: "", date: "", type: "Academic" });
              }}
            >
              Add event
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Event title" required>
            <input className={inputClass} value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
          </Field>
          <Field label="Date" required>
            <input type="date" className={inputClass} value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
          </Field>
          <Field label="Type">
            <select className={inputClass} value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
              <option>Academic</option>
              <option>Sports</option>
              <option>Cultural</option>
              <option>Holiday</option>
              <option>General</option>
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
