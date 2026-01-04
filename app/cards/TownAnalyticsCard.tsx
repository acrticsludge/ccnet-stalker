import AnalyticsCard from "./AnalyticsCard";

export default function TownAnalyticsCard({ town }: { town: string }) {
  return (
    <AnalyticsCard
      title="Player Growth"
      endpoint={`https://pj5xzvw7-5000.use2.devtunnels.ms/town/analytics?town=${encodeURIComponent(
        town
      )}`}
    />
  );
}
