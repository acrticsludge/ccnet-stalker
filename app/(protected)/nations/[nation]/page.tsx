import NationAnalyticsCard from "@/app/cards/NationAnalyticsCard";
function LeaderCard({ leader }: { leader: string }) {
  return (
    <div
      className="
        rounded-3xl
        border border-black/10
        bg-white/80 backdrop-blur-xl
        px-6 py-8
        shadow-xl
        flex flex-col items-center text-center
      "
    >
      <img
        src={`https://visage.surgeplay.com/full/160/${leader}`}
        width={160}
        height={160}
        className="rounded-2xl shadow-md"
      />

      <p className="mt-6 text-sm text-black/50 uppercase tracking-wide">
        Leader
      </p>

      <h3 className="mt-1 text-xl font-semibold text-black">{leader}</h3>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="
        rounded-2xl
        border border-black/5
        bg-black/5
        px-5 py-4
      "
    >
      <p className="text-xs text-black/50">{label}</p>
      <p className="text-lg font-semibold text-black">{value}</p>
    </div>
  );
}

function getUrgencyStyle(days?: number) {
  if (days === 0) return "border-red-400 bg-red-50";
  if (days === 1) return "border-orange-400 bg-orange-50";
  if (days === 2) return "border-yellow-400 bg-yellow-50";
  return "border-black/5 bg-white/60";
}

function getDaysLabel(days?: number) {
  if (days === undefined) return "Status unknown";
  if (days === 0) return "⚠️ Falling Today";
  if (days === 1) return "⏳ Falling Tomorrow";
  if (days === 2) return "⏱️ Falling in 2 Days";
  return `Safe for ${days} days`;
}

function safe(value: unknown): string | number {
  return Number.isFinite(value) ? (value as number) : "—";
}

export default async function NationPage({
  params,
}: {
  params: Promise<{ nation: string }>;
}) {
  const { nation } = await params;
  const nationName = decodeURIComponent(nation);

  const res = await fetch(
    `https://3rvzd8hz-5000.inc1.devtunnels.ms/nation?nation=${encodeURIComponent(
      nationName
    )}`,
    {
      headers: {
        "x-api-key": process.env.MY_API_SECRET!,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return (
      <div className="px-6 py-10 text-center text-black/50">
        Nation not found
      </div>
    );
  }

  const { getNationData } = await res.json();
  const nationData = getNationData;

  const sortedTowns = [...nationData.towns].sort((a: any, b: any) => {
    if ((a.days ?? 9999) !== (b.days ?? 9999)) {
      return (a.days ?? 9999) - (b.days ?? 9999);
    }
    return (b.upkeep ?? 0) - (a.upkeep ?? 0);
  });

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold text-black tracking-tight">
          {nationData.name}
        </h1>
        <p className="mt-2 text-black/60">
          Nation overview and live statistics
        </p>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mb-10">
        <LeaderCard leader={nationData.leader} />

        <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-8 py-7 shadow-xl">
          <h3 className="text-lg font-semibold text-black mb-4">
            Nation Stats
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Residents"
              value={safe(nationData.totalResidents)}
            />
            <StatCard label="Towns" value={nationData.towns.length} />
            <StatCard
              label="Avg / Town"
              value={safe(
                nationData.towns.length > 0
                  ? Math.floor(
                      nationData.totalResidents / nationData.towns.length
                    )
                  : null
              )}
            />

            <StatCard label="Status" value="Stable" />
          </div>
        </div>
      </div>

      {/* Player Growth*/}
      <div className="mb-10 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-8 py-7 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-black">Player Growth</h3>

          <span className="text-xs text-black/40">
            Data since {"2026-01-03"}
          </span>
        </div>

        <NationAnalyticsCard nation={nationData.name} />
      </div>

      {/* Towns */}
      <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-8 py-7 shadow-xl">
        <h3 className="text-lg font-semibold text-black mb-4">Towns</h3>

        {sortedTowns.length === 0 ? (
          <p className="text-black/50 text-sm">No towns registered.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTowns.map((town: any) => (
              <div
                key={town.name}
                className={`rounded-2xl border px-4 py-3 text-sm ${getUrgencyStyle(
                  town.days
                )}`}
              >
                <p className="font-medium text-black">{town.name}</p>

                <div className="mt-1 text-xs text-black/70 space-y-0.5">
                  <p>Bank: ${town.bank.toLocaleString()}</p>
                  <p>Upkeep: ${town.upkeep}</p>
                  <p>{getDaysLabel(town.days)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
