import AnalyticsCard from "./AnalyticsCard";

export default function TownAnalyticsCard({ town }: { town: string }) {
  return (
    <AnalyticsCard
      title="Player Growth"
      endpoint={`/api/town/analytics?town=${encodeURIComponent(town)}`}
    />
  );
}
