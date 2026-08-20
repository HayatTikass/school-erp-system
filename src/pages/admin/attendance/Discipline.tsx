import { useState } from "react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Table, THead, TRow, TCell, StatCard, Select } from "../../../components/ui";
import { Modal, Field, inputClass } from "../../../components/Modal";
import { formatDate } from "../../../lib/utils";
import { useAppStore } from "../../../store/AppStore";
import { useToast } from "../../../components/Toast";

const emptyIncident = { student: "", className: "", incident: "", severity: "Low" };

export default function AttendanceDiscipline() {
  const { students, discipline, addDiscipline } = useAppStore();
  const { toast } = useToast();
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState(emptyIncident);

  const openCases = discipline.filter((d) => d.status === "Open" || d.status === "Under review").length;

  const submitIncident = () => {
    if (!incidentForm.student.trim() || !incidentForm.incident.trim()) {
      toast("Student and incident description are required", "error");
      return;
    }
    const student = students.find((s) => s.name === incidentForm.student);
    addDiscipline({
      student: incidentForm.student.trim(),
      className: incidentForm.className || student?.class || "None",
      incident: incidentForm.incident.trim(),
      severity: incidentForm.severity,
      status: "Open",
    });
    toast("Incident logged");
    setIncidentOpen(false);
    setIncidentForm(emptyIncident);
  };

  return (
    <div>
      <PageHeader
        title="Discipline"
        subtitle="Incident log and discipline case management for this term."
        actions={
          <Button
            onClick={() => {
              setIncidentForm(emptyIncident);
              setIncidentOpen(true);
            }}
          >
            Log incident
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard label="Open discipline cases" value={String(openCases)} delta={`${discipline.length} total this term`} deltaLabel="" positive={false} iconBg="bg-warning-50 text-warning-600" />
        <StatCard label="Resolved this term" value={String(discipline.filter((d) => d.status === "Resolved").length)} delta="cases closed" deltaLabel="" iconBg="bg-success-50 text-success-600" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Discipline cases" subtitle="Incident log for this term" />
        <Table>
          <THead cols={["Case", "Student", "Incident", "Severity", "Status"]} />
          <tbody>
            {discipline.map((d) => (
              <TRow key={d.id}>
                <TCell className="font-semibold text-gray-900">{d.id}</TCell>
                <TCell>
                  <p className="font-medium text-gray-900">{d.student}</p>
                  <p className="text-xs text-gray-400">{d.className} · {formatDate(d.date)}</p>
                </TCell>
                <TCell>{d.incident}</TCell>
                <TCell><Badge tone={statusTone(d.severity)}>{d.severity}</Badge></TCell>
                <TCell><Badge tone={statusTone(d.status)} dot>{d.status}</Badge></TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={incidentOpen}
        onClose={() => setIncidentOpen(false)}
        title="Log incident"
        subtitle="Record a discipline case"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIncidentOpen(false)}>Cancel</Button>
            <Button onClick={submitIncident}>Log incident</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Student" required>
            <select
              className={inputClass}
              value={incidentForm.student}
              onChange={(e) => {
                const student = students.find((s) => s.name === e.target.value);
                setIncidentForm({ ...incidentForm, student: e.target.value, className: student?.class || "" });
              }}
            >
              <option value="">Select student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.name}>{s.name} · {s.class}</option>
              ))}
            </select>
          </Field>
          <Field label="Incident" required>
            <textarea className={inputClass} rows={3} value={incidentForm.incident} onChange={(e) => setIncidentForm({ ...incidentForm, incident: e.target.value })} />
          </Field>
          <Field label="Severity">
            <Select options={["Low", "Medium", "High"]} value={incidentForm.severity} onChange={(v) => setIncidentForm({ ...incidentForm, severity: v })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
