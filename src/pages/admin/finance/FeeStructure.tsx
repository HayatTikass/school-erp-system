import { PageHeader, Card, CardHeader, Badge, Table, THead, TRow, TCell } from "../../../components/ui";
import { formatMoney } from "../../../lib/utils";

export default function FinanceFeeStructure() {
  return (
    <div>
      <PageHeader
        title="Fee Structure"
        subtitle="Term fee items and rates by class level."
      />

      <Card>
        <CardHeader title="Fee structure" subtitle="Per-term rates for JHS 1 to JHS 3" />
        <Table>
          <THead cols={["Fee item", "JHS 1", "JHS 2", "JHS 3", "Frequency"]} />
          <tbody>
            {[
              ["Tuition", 1750, 1850, 1950, "Per term"],
              ["ICT lab levy", 150, 150, 150, "Per term"],
              ["Exam fee", 100, 100, 200, "Per term"],
              ["Bus fee (optional)", 300, 300, 300, "Per term"],
            ].map((row) => (
              <TRow key={String(row[0])}>
                <TCell className="font-semibold text-gray-900">{row[0]}</TCell>
                <TCell>{formatMoney(Number(row[1]))}</TCell>
                <TCell>{formatMoney(Number(row[2]))}</TCell>
                <TCell>{formatMoney(Number(row[3]))}</TCell>
                <TCell>
                  <Badge tone="gray">{row[4]}</Badge>
                </TCell>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
