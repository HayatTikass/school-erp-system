import { useState } from "react";
import { Add01Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Button, Table, THead, TRow, TCell } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { school } from "../../../data/mock";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

const emptySubject = { name: "", code: "", teacher: "", color: "bg-blue-100 text-blue-700" };

export default function AcademicsSubjects() {
  const { subjects, addSubject } = useAppStore();
  const { toast } = useToast();
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState(emptySubject);

  const submitSubject = () => {
    if (!subjectForm.name.trim() || !subjectForm.code.trim()) {
      toast("Subject name and code are required", "error");
      return;
    }
    addSubject({
      name: subjectForm.name.trim(),
      code: subjectForm.code.trim().toUpperCase(),
      teacher: subjectForm.teacher.trim() || "None",
      color: subjectForm.color,
    });
    toast(`${subjectForm.name.trim()} added to curriculum`);
    setSubjectOpen(false);
    setSubjectForm(emptySubject);
  };

  return (
    <div>
      <PageHeader
        title="Subjects"
        subtitle={`Academic year ${school.year} · ${school.term} · curriculum and subject assignments.`}
        actions={
          <Button
            icon={<Add01Icon size={18} />}
            onClick={() => {
              setSubjectForm(emptySubject);
              setSubjectOpen(true);
            }}
          >
            Add subject
          </Button>
        }
      />

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
                <TCell>JHS 1 to JHS 3</TCell>
                <TCell>{s.code === "MATH" || s.code === "ENG" ? 6 : 4}</TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={subjectOpen}
        onClose={() => setSubjectOpen(false)}
        title="Add subject"
        subtitle="Add to school curriculum"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSubjectOpen(false)}>Cancel</Button>
            <Button onClick={submitSubject}>Add subject</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Subject name" required>
            <input className={inputClass} value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} />
          </Field>
          <Field label="Code" required>
            <input className={inputClass} placeholder="e.g. MATH" value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} />
          </Field>
          <Field label="Lead teacher">
            <input className={inputClass} value={subjectForm.teacher} onChange={(e) => setSubjectForm({ ...subjectForm, teacher: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
