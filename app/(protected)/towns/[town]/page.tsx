import Link from "next/link";
import TownAnalyticsCard from "@/app/cards/TownAnalyticsCard";
/* =====================
   UI HELPERS
===================== */

function MayorCard({ mayor }: { mayor: string }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-6 py-8 shadow-xl flex flex-col items-center text-center">
      <img
        src={`https://visage.surgeplay.com/full/160/${mayor}`}
        width={160}
        height={160}
        className="rounded-2xl shadow-md"
      />

      <p className="mt-6 text-sm text-black/50 uppercase tracking-wide">
        Mayor
      </p>

      <h3 className="mt-1 text-xl font-semibold text-black">{mayor}</h3>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  const safeValue =
    typeof value === "number" && !Number.isFinite(value) ? "—" : value;

  return (
    <div className="rounded-2xl border border-black/5 bg-black/5 px-5 py-4">
      <p className="text-xs text-black/50">{label}</p>
      <p className="text-lg font-semibold text-black">{safeValue}</p>
    </div>
  );
}

function DangerBanner({ days }: { days?: number }) {
  if (days === undefined || days > 2) return null;

  const config =
    days === 0
      ? {
          text: "⚠️ This town is falling TODAY",
          style: "bg-red-600 text-white",
        }
      : days === 1
      ? {
          text: "⏳ This town will fall TOMORROW",
          style: "bg-orange-500 text-white",
        }
      : {
          text: "⚠️ This town is at risk (2 days left)",
          style: "bg-yellow-400 text-black",
        };

  return (
    <div
      className={`mb-8 rounded-2xl px-6 py-4 font-medium shadow-lg ${config.style}`}
    >
      {config.text}
    </div>
  );
}

function StatusBadge({ days }: { days?: number }) {
  if (!Number.isFinite(days)) return null;

  const cfg =
    days === 0
      ? { text: "FALLING TODAY", style: "bg-red-600 text-white" }
      : days === 1
      ? { text: "TOMORROW", style: "bg-orange-500 text-white" }
      : days === 2
      ? { text: "2 DAYS", style: "bg-yellow-400 text-black" }
      : { text: "STABLE", style: "bg-green-500 text-white" };

  return (
    <span
      className={`ml-3 rounded-full px-3 py-1 text-xs font-semibold ${cfg.style}`}
    >
      {cfg.text}
    </span>
  );
}

function UpkeepBar({ bank, upkeep }: { bank: number; upkeep: number }) {
  if (!Number.isFinite(bank) || !Number.isFinite(upkeep) || upkeep <= 0) {
    return null;
  }

  const daysLeft = Math.floor(bank / upkeep);
  const percent = Math.min((bank / (upkeep * 7)) * 100, 100);

  const color =
    daysLeft <= 0
      ? "bg-red-500"
      : daysLeft <= 1
      ? "bg-orange-500"
      : daysLeft <= 2
      ? "bg-yellow-400"
      : "bg-green-500";

  return (
    <div className="mt-5">
      <div className="mb-1 flex justify-between text-xs text-black/60">
        <span>Upkeep Buffer</span>
        <span>~{daysLeft} days</span>
      </div>
      <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function timeAgo(date: string | Date) {
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* =====================
   PAGE
===================== */

export default async function TownPage({
  params,
}: {
  params: Promise<{ town: string }>;
}) {
  const { town } = await params;
  const townName = decodeURIComponent(town);

  const res = await fetch(
    `https://pj5xzvw7-5000.use2.devtunnels.ms/town?town=${encodeURIComponent(
      townName
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
      <div className="px-6 py-10 text-center text-black/50">Town not found</div>
    );
  }

  const { getTownData } = await res.json();
  const townData = getTownData;

  const residentCount = Number.isFinite(townData.residentCount)
    ? townData.residentCount
    : townData.residents?.length ?? 0;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center text-4xl md:text-5xl font-semibold text-black tracking-tight">
          {townData.name}
          <StatusBadge days={townData.days} />
        </h1>
        <p className="mt-2 text-black/60">
          Town overview and live upkeep status · Updated{" "}
          {townData.updatedAt ? timeAgo(townData.updatedAt) : "—"}
        </p>
      </div>

      <DangerBanner days={townData.days} />

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mb-10">
        <MayorCard mayor={townData.mayor} />

        <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-8 py-7 shadow-xl">
          <h3 className="text-lg font-semibold text-black mb-4">Town Stats</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Residents" value={residentCount} />

            <div className="rounded-2xl border border-black/5 bg-black/5 px-5 py-4">
              <p className="text-xs text-black/50">Nation</p>
              <Link
                href={`/nations/${encodeURIComponent(townData.nation)}`}
                className="text-lg font-semibold text-black hover:underline"
              >
                {townData.nation}
              </Link>
            </div>

            <StatCard
              label="Bank"
              value={`$${townData.bank.toLocaleString()}`}
            />
            <StatCard label="Upkeep" value={`$${townData.upkeep}`} />
          </div>

          <div className="mt-4">
            <StatCard
              label="Days Left"
              value={Number.isFinite(townData.days) ? townData.days : "—"}
            />
          </div>

          <UpkeepBar bank={townData.bank} upkeep={townData.upkeep} />
        </div>
      </div>

      {/* Player Growth */}
      <div className="mb-10 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-8 py-7 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-black">Player Growth</h3>

          <span className="text-xs text-black/40">
            Data since {"2026-01-03"}
          </span>
        </div>

        <TownAnalyticsCard town={townData.name} />
      </div>

      {/* Residents */}
      <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-8 py-7 shadow-xl">
        <h3 className="text-lg font-semibold text-black mb-4">Residents</h3>

        {townData.residents?.length === 0 ? (
          <p className="text-black/50 text-sm">No residents found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {townData.residents?.map((player: string) => (
              <div
                key={player}
                className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-4 py-2 text-sm"
              >
                <img
                  src={`https://visage.surgeplay.com/face/24/${player}`}
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span>{player}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
