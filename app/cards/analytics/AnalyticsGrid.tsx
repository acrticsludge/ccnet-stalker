import { GlobalAnalytics } from "@/types/analytics";
import StatCard from "./StatCard";

export default function AnalyticsGrid({
  data,
  window,
}: {
  data: GlobalAnalytics;
  window: "7d" | "30d";
}) {
  const { nations, towns, meta } = data;
  console.log(nations, towns, meta);
  return (
    <div className="space-y-10">
      {/* ================= NATIONS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Nation Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nations.mostStable && (
            <StatCard
              title="Most Stable Nation"
              value={nations.mostStable.nation}
              subtitle={`Score ${nations.mostStable.score}`}
              highlight="green"
            />
          )}

          {nations.fastestGrowing && (
            <StatCard
              title={`Fastest Growing (${window})`}
              value={nations.fastestGrowing.nation}
              subtitle={`+${nations.fastestGrowing.change} residents`}
              highlight="green"
            />
          )}

          {nations.fastestDeclining && (
            <StatCard
              title={`Fastest Declining (${window})`}
              value={nations.fastestDeclining.nation}
              subtitle={`${nations.fastestDeclining.change} residents`}
              highlight="red"
            />
          )}
        </div>
      </section>

      {/* ================= TOWNS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Town Movement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {towns.biggestGrowth && (
            <StatCard
              title={`Biggest Growth (${window})`}
              value={towns.biggestGrowth.town}
              subtitle={`+${towns.biggestGrowth.change} residents`}
              highlight="green"
            />
          )}

          {towns.biggestLoss && (
            <StatCard
              title={`Biggest Loss (${window})`}
              value={towns.biggestLoss.town}
              subtitle={`${towns.biggestLoss.change} residents`}
              highlight="red"
            />
          )}

          {towns.mostVolatile && (
            <StatCard
              title="Most Volatile Town"
              value={towns.mostVolatile.town}
              subtitle={`Volatility ${towns.mostVolatile.score}`}
            />
          )}
        </div>
      </section>

      {/* ================= RISK ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Risk & Warnings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {towns.closestToBankruptcy && (
            <StatCard
              title="Closest to Bankruptcy"
              value={towns.closestToBankruptcy.town}
              subtitle={`${towns.closestToBankruptcy.daysLeft} days left`}
              highlight="yellow"
            />
          )}
        </div>
      </section>

      {/* ================= META ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Server Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Towns" value={meta.totalTowns} />
          <StatCard title="Total Nations" value={meta.totalNations} />
          <StatCard
            title="Towns in Danger"
            value={meta.townsInDanger}
            highlight="red"
          />
        </div>
      </section>
    </div>
  );
}
