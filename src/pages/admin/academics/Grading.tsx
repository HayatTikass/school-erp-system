import { PageHeader, Card, CardHeader, Badge, Table, THead, TRow, TCell } from "../../../components/ui";
import { school } from "../../../data/mock";

export default function AcademicsGrading() {
  return (
    <div>
      <PageHeader
        title="Grading"
        subtitle={`Academic year ${school.year} · ${school.term} — grading scale and assessment weighting.`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Grading scale" subtitle="Applies to all continuous assessment and exams" />
          <Table>
            <THead cols={["Score range", "Grade", "GPA points", "Remark"]} />
            <tbody>
              {[
                ["90 – 100", "A+", "4.0", "Outstanding"],
                ["80 – 89", "A", "4.0", "Excellent"],
                ["75 – 79", "A-", "3.7", "Excellent"],
                ["70 – 74", "B+", "3.3", "Very good"],
                ["65 – 69", "B", "3.0", "Good"],
                ["60 – 64", "B-", "2.7", "Fair"],
                ["50 – 59", "C", "2.0", "Pass"],
                ["0 – 49", "F", "0.0", "Fail"],
              ].map((row) => (
                <TRow key={row[1]}>
                  <TCell className="font-medium text-gray-900">{row[0]}</TCell>
                  <TCell>
                    <Badge tone={row[1].startsWith("A") ? "success" : row[1].startsWith("B") ? "blue" : row[1] === "C" ? "warning" : "error"}>{row[1]}</Badge>
                  </TCell>
                  <TCell>{row[2]}</TCell>
                  <TCell>{row[3]}</TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card>
          <CardHeader title="Assessment weighting" subtitle="How term totals are computed" />
          <div className="space-y-5 p-5">
            {[
              { label: "Class test 1", weight: 20 },
              { label: "Class test 2", weight: 20 },
              { label: "End-of-term exam", weight: 60 },
            ].map((w) => (
              <div key={w.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{w.label}</span>
                  <span className="font-semibold text-gray-900">{w.weight}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-brand-600" style={{ width: `${w.weight}%` }} />
                </div>
              </div>
            ))}
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
              Term totals auto-calculate from these weightings. Teachers may propose custom weightings per subject, subject to admin approval.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
