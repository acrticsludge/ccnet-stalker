import AnalyticsCard from "./AnalyticsCard";

export default function NationAnalyticsCard({ nation }: { nation: string }) {
  return (
    <AnalyticsCard
      title="Population Growth"
      endpoint={`https://3rvzd8hz-5000.inc1.devtunnels.ms/nation/analytics?nation=${encodeURIComponent(
        nation
      )}`}
    />
  );
}
