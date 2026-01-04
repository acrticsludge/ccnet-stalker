export default function StatCard({
  title,
  value,
  subtitle,
  highlight,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: "green" | "red" | "yellow";
}) {
  const color =
    highlight === "green"
      ? "text-green-600"
      : highlight === "red"
      ? "text-red-600"
      : highlight === "yellow"
      ? "text-yellow-600"
      : "text-black";
  function TrendArrow({ value }: { value?: number }) {
    if (value === undefined) return null;
    if (value > 0) return <span className="text-green-600 ml-1">▲</span>;
    if (value < 0) return <span className="text-red-600 ml-1">▼</span>;
    return null;
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-6 py-6 shadow-xl">
      <p className="text-xs text-black/50 mb-1">{title}</p>
      <p className={`text-2xl font-semibold ${color}`}>
        {value}
        <TrendArrow value={typeof value === "number" ? value : undefined} />
      </p>

      {subtitle && <p className="text-sm text-black/50 mt-1">{subtitle}</p>}
    </div>
  );
}
