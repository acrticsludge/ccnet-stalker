"use client";

import { useEffect, useState } from "react";

type Town = string;

type TownData = {
  name: string;
  bank: number;
  upkeep: number;
};

type NationCardProps = {
  name: string;
  leader: string;
  totalResidents: number;
  townCount: number;
  towns: string[];
};

export default function NationCard({
  name,
  leader,
  totalResidents,
  townCount,
  towns,
}: NationCardProps) {
  const [townDataMap, setTownDataMap] = useState<Record<string, TownData>>({});

  useEffect(() => {
    async function fetchTownData(town: string) {
      if (townDataMap[town]) return;

      const token = localStorage.getItem("ccnet_token");
      if (!token) return;

      try {
        const res = await fetch(
          `https://3rvzd8hz-5000.inc1.devtunnels.ms/town?town=${encodeURIComponent(
            town
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        setTownDataMap((prev) => ({
          ...prev,
          [town]: data.getTownData,
        }));
      } catch (err) {
        console.error("Failed to fetch town data:", err);
      }
    }

    towns.forEach((town) => {
      if (!townDataMap[town]) {
        fetchTownData(town);
      }
    });
  }, [towns, townDataMap]);

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
              src={`https://visage.surgeplay.com/face/32/${leader}`}
              alt={leader}
              width={32}
              height={32}
            />

            <span>
              Led by <span className="font-medium text-black">{leader}</span>
            </span>
          </div>
        </div>

        <div className="rounded-full bg-black/5 px-4 py-1 text-sm text-black/70">
          {townCount} Towns
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-black/5 bg-black/5 px-4 py-3">
          <p className="text-xs text-black/50">Residents</p>
          <p className="text-lg font-semibold text-black">
            {totalResidents.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-black/5 px-4 py-3">
          <p className="text-xs text-black/50">Avg / Town</p>
          <p className="text-lg font-semibold text-black">
            {townCount === 0 ? 0 : Math.floor(totalResidents / townCount)}
          </p>
        </div>
      </div>

      {/* Towns */}
      <div className="mt-6">
        <p className="text-sm font-medium text-black/70 mb-2">Towns</p>

        <div className="max-h-40 overflow-y-auto space-y-2">
          {towns.length === 0 ? (
            <p className="text-sm text-black/50">No towns registered.</p>
          ) : (
            towns.map((town, index) => {
              const data = townDataMap[town];

              return (
                <div
                  key={`${town}-${index}`}
                  className="
                    flex items-center justify-between
                    rounded-xl
                    border border-black/5
                    bg-white/60
                    px-4 py-2
                    text-sm text-black
                  "
                >
                  {/* Town name */}
                  <span className="font-medium">{town}</span>

                  {/* Right-side stat bubbles */}
                  <div className="flex items-center gap-2">
                    {data ? (
                      <>
                        <div className="relative group">
                          <div className="rounded-full bg-black/10 px-3 py-1 text-xs font-medium">
                            ${data.bank.toLocaleString()}
                          </div>
                          <div
                            className="
      pointer-events-none
      absolute top-full mt-2 left-1/2 -translate-x-1/2
      rounded-md bg-black text-white
      px-2 py-1 text-[11px]
      opacity-0 scale-95
      group-hover:opacity-100 group-hover:scale-100
      transition-all
      whitespace-nowrap
    "
                          >
                            Bank
                          </div>
                        </div>

                        <div className="relative group">
                          <div className="rounded-full bg-black/10 px-3 py-1 text-xs font-medium">
                            ${data.upkeep}
                          </div>
                          <div
                            className="
      pointer-events-none
      absolute top-full mt-2 left-1/2 -translate-x-1/2
      rounded-md bg-black text-white
      px-2 py-1 text-[11px]
      opacity-0 scale-95
      group-hover:opacity-100 group-hover:scale-100
      transition-all
      whitespace-nowrap
    "
                          >
                            Daily Upkeep
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-black/40">Loading…</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
