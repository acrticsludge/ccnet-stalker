"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  towns: TownData[];
};

export default function NationCard({
  name,
  leader,
  totalResidents,
  townCount,
  towns,
}: NationCardProps) {
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
          <Link
            href={`/nations/${encodeURIComponent(name)}`}
            className="text-2xl font-semibold text-black tracking-tight hover:underline"
          >
            {name}
          </Link>

          <div className="mt-1 flex items-center gap-2 text-sm text-black/60">
            <img
              src={`https://visage.surgeplay.com/face/32/${leader}`}
              width={32}
              height={32}
            />
            <span>
              Led by <span className="font-medium text-black">{leader}</span>
            </span>
          </div>
        </div>

        <div className="rounded-full bg-black/5 px-4 py-1 text-sm text-black/70">
          {towns.length} Towns
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
          {towns.map((town) => (
            <div
              key={town.name}
              className="
                flex items-center justify-between
                rounded-xl
                border border-black/5
                bg-white/60
                px-4 py-2
                text-sm text-black
              "
            >
              <span className="font-medium">
                <Link
                  href={`/towns/${encodeURIComponent(town.name)}`}
                  className="font-medium text-black hover:underline"
                >
                  {town.name}
                </Link>
              </span>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-black/10 px-3 py-1 text-xs">
                  ${town.bank.toLocaleString()}
                </div>
                <div className="rounded-full bg-black/10 px-3 py-1 text-xs">
                  ${town.upkeep}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
