"use client";

import { memo, useMemo } from "react";

type TownCardProps = {
  name: string;
  mayor: string;
  nation: string;
  bank: number;
  upkeep: number;
  days: number;
  residents: string[];
  residentCount: number;
};

const AVATAR_SIZE = 24;
const MAX_VISIBLE_RESIDENTS = 15;

function TownCard({
  name,
  mayor,
  nation,
  bank,
  upkeep,
  days,
  residents,
  residentCount,
}: TownCardProps) {
  /* 🔹 Memoized formatting (cheap but frequent) */
  const formattedBank = useMemo(() => bank.toLocaleString(), [bank]);

  const visibleResidents = useMemo(
    () => residents.slice(0, MAX_VISIBLE_RESIDENTS),
    [residents]
  );

  return (
    <div
      className="
        rounded-3xl
        border border-black/10
        bg-white/80 backdrop-blur-xl
        px-8 py-7
        shadow-xl
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black tracking-tight">
            {name}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-sm text-black/60">
            <img
              src={`https://visage.surgeplay.com/face/${AVATAR_SIZE}/${mayor}`}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              className="rounded"
              loading="lazy"
              onError={(e) =>
                (e.currentTarget.src = `https://mc-heads.net/avatar/${mayor}/${AVATAR_SIZE}`)
              }
            />
            <span>
              Mayor <span className="font-medium text-black">{mayor}</span>
            </span>
          </div>

          <p className="mt-1 text-xs text-black/50">
            Nation: <span className="font-medium">{nation}</span>
          </p>
        </div>

        <div className="rounded-full bg-black/5 px-4 py-1 text-sm text-black/70">
          {residentCount} Residents
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Bank" value={`$${formattedBank}`} />
        <Stat label="Upkeep" value={`$${upkeep}`} />
        <Stat label="Days Left" value={days} />
      </div>

      {/* Residents */}
      <div className="mt-6">
        <p className="text-sm font-medium text-black/70 mb-2">Residents</p>

        <div className="max-h-40 overflow-y-auto space-y-2">
          {visibleResidents.length === 0 ? (
            <p className="text-sm text-black/50">No residents found.</p>
          ) : (
            visibleResidents.map((player) => (
              <ResidentRow key={player} player={player} />
            ))
          )}

          {residentCount > MAX_VISIBLE_RESIDENTS && (
            <p className="text-xs text-black/40 text-center mt-2">
              +{residentCount - MAX_VISIBLE_RESIDENTS} more residents
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔹 Small memoized subcomponents */

const Stat = memo(function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-black/5 px-3 py-2">
      <p className="text-[11px] text-black/50">{label}</p>
      <p className="text-sm font-semibold text-black">{value}</p>
    </div>
  );
});

const ResidentRow = memo(function ResidentRow({ player }: { player: string }) {
  return (
    <div
      className="
        flex items-center gap-3
        rounded-xl
        border border-black/5
        bg-white/60
        px-3 py-2
        text-sm text-black
      "
    >
      <img
        src={`https://visage.surgeplay.com/face/24/${player}`}
        width={24}
        height={24}
        className="rounded"
        loading="lazy"
        onError={(e) =>
          (e.currentTarget.src = `https://mc-heads.net/avatar/${player}/24`)
        }
      />
      <span>{player}</span>
    </div>
  );
});

/* 🔹 Prevent re-renders if props unchanged */
export default memo(TownCard);
