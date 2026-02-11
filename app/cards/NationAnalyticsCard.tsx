import AnalyticsCard from "./AnalyticsCard";

export default function NationAnalyticsCard({ nation }: { nation: string }) {
  return (
    <AnalyticsCard
      title="Population Growth"
      endpoint={`/api/nation/analytics?nation=${encodeURIComponent(nation)}`}
    />
  );
}
