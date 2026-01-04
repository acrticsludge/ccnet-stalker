import AnalyticsCard from "./AnalyticsCard";

export default function NationAnalyticsCard({ nation }: { nation: string }) {
  return (
    <AnalyticsCard
      title="Population Growth"
      endpoint={`https://pj5xzvw7-5000.use2.devtunnels.ms/nation/analytics?nation=${encodeURIComponent(
        nation
      )}`}
    />
  );
}
