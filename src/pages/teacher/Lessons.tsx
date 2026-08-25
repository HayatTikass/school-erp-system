import { useMemo, useState } from "react";
import { Add01Icon, Attachment01Icon, Target01Icon } from "hugeicons-react";
import { PageHeader, Card, Badge, statusTone, Button, Select, StatCard, Progress } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { useToast } from "../../components/Toast";
import { Modal, Field, inputClass } from "../../components/Modal";
import type { LessonPlan } from "../../store/domain";

const CLASS_OPTIONS = ["All classes", "JHS 1A", "JHS 2A", "JHS 2B", "JHS 3A", "JHS 3B"];
const STATUS_CYCLE: LessonPlan["status"][] = ["Draft", "In progress", "Completed"];

export default function TeacherLessons() {
  const { toast } = useToast();
  const { lessonPlans, addLessonPlan, updateLessonPlan } = useAppStore();
  const [classFilter, setClassFilter] = useState(CLASS_OPTIONS[0]);
  const [createOpen, setCreateOpen] = useState(false);
  const [openPlan, setOpenPlan] = useState<LessonPlan | null>(null);

  const [form, setForm] = useState({
    topic: "",
    subject: "Mathematics",
    className: "JHS 2A",
    week: "Week 1",
    status: "Draft" as LessonPlan["status"],
    resources: 0,
  });

  const filtered = useMemo(() => {
    if (classFilter === "All classes") return lessonPlans;
    return lessonPlans.filter((lp) => lp.className === classFilter);
  }, [lessonPlans, classFilter]);

  const mathPlans = lessonPlans.filter((lp) => lp.subject === "Mathematics");
  const completed = mathPlans.filter((lp) => lp.status === "Completed").length;
  const coverage = mathPlans.length ? Math.round((completed / mathPlans.length) * 100) : 0;
  const resources = lessonPlans.reduce((sum, lp) => sum + lp.resources, 0);

  const handleCreate = () => {
    if (!form.topic.trim()) {
      toast("Topic is required", "error");
      return;
    }
    addLessonPlan(form);
    toast(`Lesson plan "${form.topic}" created`, "success");
    setCreateOpen(false);
    setForm({ topic: "", subject: "Mathematics", className: "JHS 2A", week: "Week 1", status: "Draft", resources: 0 });
  };

  const cycleStatus = (plan: LessonPlan) => {
    const idx = STATUS_CYCLE.indexOf(plan.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    updateLessonPlan(plan.id, { status: next });
    setOpenPlan({ ...plan, status: next });
    toast(`Status updated to ${next}`, "success");
  };

  return (
    <div>
      <PageHeader
        title="Lesson Planning"
        subtitle="Organise lesson plans by topic and track curriculum coverage."
        actions={
          <>
            <Select options={CLASS_OPTIONS} value={classFilter} onChange={setClassFilter} />
            <Button icon={<Add01Icon size={18} />} onClick={() => setCreateOpen(true)}>
              New lesson plan
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Curriculum coverage" value={`${coverage}%`} delta="on schedule" deltaLabel="" icon={<Target01Icon size={20} />} />
        <StatCard label="Plans this term" value={String(mathPlans.length)} delta={`${completed} completed`} deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Resources attached" value={String(resources)} delta="slides, notes & files" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6 p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Term 3 syllabus progress · Mathematics</h3>
          <span className="text-sm font-semibold text-gray-700">
            {completed} of {mathPlans.length} topics
          </span>
        </div>
        <Progress value={coverage} />
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((lp) => (
          <Card key={lp.id} className="flex flex-col p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <Badge tone="gray">{lp.week}</Badge>
              <Badge tone={statusTone(lp.status)} dot>
                {lp.status}
              </Badge>
            </div>
            <h3 className="mt-3 text-base font-bold text-gray-900">{lp.topic}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {lp.subject} · {lp.className}
            </p>
            <p className="mt-3 line-clamp-2 text-sm text-gray-600">
              Linked to curriculum objective B7.2 · learners can apply algebraic reasoning to solve real-world problems.
            </p>
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Attachment01Icon size={16} /> {lp.resources} resources
              </span>
              <Button variant="secondary" size="sm" onClick={() => setOpenPlan(lp)}>
                Open plan
              </Button>
            </div>
          </Card>
        ))}

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex min-h-52 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-brand-400 hover:text-brand-600"
        >
          <Add01Icon size={28} />
          <span className="text-sm font-semibold">Create lesson plan</span>
        </button>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New lesson plan"
        subtitle="Add a topic to your term syllabus"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create plan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Topic" required>
            <input className={inputClass} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </Field>
          <Field label="Subject" required>
            <input className={inputClass} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <Field label="Class" required>
            <select className={inputClass} value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>
              {CLASS_OPTIONS.filter((c) => c !== "All classes").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Week">
            <input className={inputClass} value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} />
          </Field>
          <Field label="Resources count">
            <input type="number" min={0} className={inputClass} value={form.resources} onChange={(e) => setForm({ ...form, resources: parseInt(e.target.value, 10) || 0 })} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!openPlan}
        onClose={() => setOpenPlan(null)}
        title={openPlan?.topic ?? "Lesson plan"}
        subtitle={openPlan ? `${openPlan.subject} · ${openPlan.className} · ${openPlan.week}` : undefined}
        footer={
          openPlan && (
            <>
              <Button variant="secondary" onClick={() => setOpenPlan(null)}>
                Close
              </Button>
              <Button onClick={() => cycleStatus(openPlan)}>Update status → {STATUS_CYCLE[(STATUS_CYCLE.indexOf(openPlan.status) + 1) % STATUS_CYCLE.length]}</Button>
            </>
          )
        }
      >
        {openPlan && (
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Status:</span>{" "}
              <Badge tone={statusTone(openPlan.status)} dot>
                {openPlan.status}
              </Badge>
            </p>
            <p>
              <span className="font-medium text-gray-900">Resources:</span> {openPlan.resources} attached
            </p>
            <p>Curriculum objective B7.2 · learners apply algebraic reasoning to solve real-world problems.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
