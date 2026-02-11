"use client";

import { useEffect, useMemo, useState } from "react";
import NationCard from "@/app/cards/NationCard";

export default function Nations() {
  const [allNationData, setNationData] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("ccnet_token");
      if (!token) return;

      const res = await fetch("/api/nations", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setNationData(data);
    }

    fetchData();
  }, []);

  const filteredAndSortedNations = useMemo(() => {
    if (!allNationData) return [];

    return allNationData
      .filter((nation) =>
        nation.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.totalResidents - a.totalResidents);
  }, [allNationData, search]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-black tracking-tight">
          Nations Data
        </h1>
        <p className="mt-3 text-black/60 max-w-xl mx-auto">
          Live overview of CCNet nations, sorted by population.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search nations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full max-w-md
            rounded-2xl
            border border-black/10
            bg-white/80 backdrop-blur-xl
            px-5 py-3
            text-sm
            shadow-sm
            outline-none
            focus:border-black/30
          "
        />
      </div>

      {!allNationData ? (
        <div className="text-center text-black/50">Loading nations…</div>
      ) : filteredAndSortedNations.length === 0 ? (
        <div className="text-center text-black/50 mt-12">No nations found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredAndSortedNations.map((nation) => (
            <NationCard
              key={nation.name}
              name={nation.name}
              leader={nation.leader}
              totalResidents={nation.totalResidents ?? 0}
              townCount={nation.towns?.length ?? 0}
              towns={nation.towns ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
