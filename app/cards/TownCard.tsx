"use client";

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

export default function TownCard({
  name,
  mayor,
  nation,
  bank,
  upkeep,
  days,
  residents,
  residentCount,
}: TownCardProps) {
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
              src={`https://visage.surgeplay.com/face/24/${mayor}`}
              width={24}
              height={24}
              className="rounded"
              onError={(e) => {
                e.currentTarget.src = `https://mc-heads.net/avatar/${mayor}/24`;
              }}
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
        <div className="rounded-2xl border border-black/5 bg-black/5 px-3 py-2">
          <p className="text-[11px] text-black/50">Bank</p>
          <p className="text-sm font-semibold text-black">
            ${bank.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-black/5 px-3 py-2">
          <p className="text-[11px] text-black/50">Upkeep</p>
          <p className="text-sm font-semibold text-black">${upkeep}</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-black/5 px-3 py-2">
          <p className="text-[11px] text-black/50">Days Left</p>
          <p className="text-sm font-semibold text-black">{days}</p>
        </div>
      </div>

      {/* Residents */}
      <div className="mt-6">
        <p className="text-sm font-medium text-black/70 mb-2">Residents</p>

        <div className="max-h-40 overflow-y-auto space-y-2">
          {residents.length === 0 ? (
            <p className="text-sm text-black/50">No residents found.</p>
          ) : (
            residents.map((player, index) => (
              <div
                key={`${player}-${index}`}
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
                  onError={(e) => {
                    e.currentTarget.src = `https://mc-heads.net/avatar/${player}/24`;
                  }}
                />
                <span>{player}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
