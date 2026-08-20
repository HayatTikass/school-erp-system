import { useState } from "react";
import { Add01Icon, Calendar03Icon, UserMultipleIcon, Door01Icon } from "hugeicons-react";
import { PageHeader, Card, Badge, Button } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { school } from "../../../data/mock";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

const emptyClass = { name: "", teacher: "", room: "" };

export default function AcademicsClasses() {
  const { classes, addClass } = useAppStore();
  const { toast } = useToast();
  const [classOpen, setClassOpen] = useState(false);
  const [classForm, setClassForm] = useState(emptyClass);

  const submitClass = () => {
    if (!classForm.name.trim() || !classForm.teacher.trim()) {
      toast("Class name and teacher are required", "error");
      return;
    }
    addClass({
      name: classForm.name.trim(),
      teacher: classForm.teacher.trim(),
      room: classForm.room.trim() || "None",
    });
    toast(`Class ${classForm.name.trim()} added`);
    setClassOpen(false);
    setClassForm(emptyClass);
  };

  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle={`Academic year ${school.year} · ${school.term} · manage class groups and homeroom teachers.`}
        actions={
          <>
            <Button variant="secondary" icon={<Calendar03Icon size={18} />} onClick={() => toast("Academic calendar editor coming soon.", "info")}>
              Academic calendar
            </Button>
            <Button
              icon={<Add01Icon size={18} />}
              onClick={() => {
                setClassForm(emptyClass);
                setClassOpen(true);
              }}
            >
              Add class
            </Button>
          </>
        }
      />

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
            <p className="mt-1 text-sm text-gray-500">
              Class teacher: <span className="font-medium text-gray-700">{c.teacher}</span>
            </p>
            <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-4 text-sm text-gray-500">
              <Door01Icon size={16} /> {c.room}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={classOpen}
        onClose={() => setClassOpen(false)}
        title="Add class"
        subtitle="Create a new class group"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClassOpen(false)}>Cancel</Button>
            <Button onClick={submitClass}>Add class</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Class name" required>
            <input className={inputClass} placeholder="e.g. JHS 1C" value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} />
          </Field>
          <Field label="Class teacher" required>
            <input className={inputClass} value={classForm.teacher} onChange={(e) => setClassForm({ ...classForm, teacher: e.target.value })} />
          </Field>
          <Field label="Room">
            <input className={inputClass} placeholder="Block A · Room 3" value={classForm.room} onChange={(e) => setClassForm({ ...classForm, room: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
