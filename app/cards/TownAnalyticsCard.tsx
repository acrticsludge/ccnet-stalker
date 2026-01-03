import AnalyticsCard from "./AnalyticsCard";

export default function TownAnalyticsCard({ town }: { town: string }) {
  return (
    <AnalyticsCard
      title="Player Growth"
      endpoint={`https://3rvzd8hz-5000.inc1.devtunnels.ms/town/analytics?town=${encodeURIComponent(
        town
      )}`}
    />
  );
}
