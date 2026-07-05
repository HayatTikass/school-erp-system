import { Add01Icon, Attachment01Icon, Target01Icon } from "hugeicons-react";
import { PageHeader, Card, Badge, statusTone, Button, Select, StatCard, Progress } from "../../components/ui";
import { lessonPlans } from "../../data/mock";

export default function TeacherLessons() {
  return (
    <div>
      <PageHeader
        title="Lesson Planning"
        subtitle="Organise lesson plans by topic and track curriculum coverage."
        actions={
          <>
            <Select options={["All classes", "JHS 1A", "JHS 2A", "JHS 2B", "JHS 3A", "JHS 3B"]} />
            <Button icon={<Add01Icon size={18} />}>New lesson plan</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Curriculum coverage" value="72%" delta="on schedule" deltaLabel="" icon={<Target01Icon size={20} />} />
        <StatCard label="Plans this term" value="28" delta="19 completed" deltaLabel="" iconBg="bg-success-50 text-success-600" />
        <StatCard label="Resources attached" value="64" delta="slides, notes & files" deltaLabel="" iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card className="mt-6 p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Term 3 syllabus progress — Mathematics</h3>
          <span className="text-sm font-semibold text-gray-700">18 of 25 topics</span>
        </div>
        <Progress value={72} />
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {lessonPlans.map((lp) => (
          <Card key={lp.id} className="flex flex-col p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <Badge tone="gray">{lp.week}</Badge>
              <Badge tone={statusTone(lp.status)} dot>{lp.status}</Badge>
            </div>
            <h3 className="mt-3 text-base font-bold text-gray-900">{lp.topic}</h3>
            <p className="mt-1 text-sm text-gray-500">{lp.subject} · {lp.class}</p>
            <p className="mt-3 line-clamp-2 text-sm text-gray-600">
              Linked to curriculum objective B7.2 — learners can apply algebraic reasoning to solve real-world problems.
            </p>
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Attachment01Icon size={16} /> {lp.resources} resources
              </span>
              <Button variant="secondary" size="sm">Open plan</Button>
            </div>
          </Card>
        ))}

        {/* New plan card */}
        <button className="flex min-h-52 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-brand-400 hover:text-brand-600">
          <Add01Icon size={28} />
          <span className="text-sm font-semibold">Create lesson plan</span>
        </button>
      </div>
    </div>
  );
}
