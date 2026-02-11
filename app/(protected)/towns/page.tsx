"use client";

import { useEffect, useMemo, useState } from "react";
import TownCard from "@/app/cards/TownCard";

export default function Towns() {
  const [allTowns, setTowns] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("ccnet_token");
      if (!token) return;

      const res = await fetch("/api/towns", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setTowns(data);
    }

    fetchData();
  }, []);

  const filteredAndSortedTowns = useMemo(() => {
    if (!allTowns) return [];

    return allTowns
      .filter((town) => town.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.residentCount - a.residentCount);
  }, [allTowns, search]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-black tracking-tight">
          Towns Data
        </h1>
        <p className="mt-3 text-black/60 max-w-xl mx-auto">
          Overview of CCNet towns and their residents.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search towns..."
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

      {/* Content */}
      {!allTowns ? (
        <div className="text-center text-black/50">Loading towns…</div>
      ) : filteredAndSortedTowns.length === 0 ? (
        <div className="text-center text-black/50 mt-12">No towns found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredAndSortedTowns.map((town) => (
            <TownCard
              key={town._id}
              name={town.name}
              mayor={town.mayor}
              nation={town.nation}
              bank={town.bank}
              upkeep={town.upkeep}
              days={town.days}
              residents={town.residents}
              residentCount={town.residentCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
