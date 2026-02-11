"use client";

import { useEffect, useState } from "react";
import { GlobalAnalytics } from "@/types/analytics";
import AnalyticsGrid from "../cards/analytics/AnalyticsGrid";
import SkeletonCard from "../cards/analytics/SkeletonCard";
import InfoPopover from "../cards/analytics/InfoPopover";

export default function AnalyticsPage() {
  const [data, setData] = useState<GlobalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [window, setWindow] = useState<"7d" | "30d">("7d");

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("ccnet_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(`/api/analytics/global?window=${window}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
        });

        if (!res.ok) throw new Error("Failed");

        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [window]); // ✅ dependency array is ALWAYS the same

  /* =====================
     LOADING STATE
  ===================== */

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-semibold">Global Analytics</h1>

        {/* Window Toggle (disabled while loading) */}
        <div className="flex gap-2">
          {["7d", "30d"].map((w) => (
            <button
              key={w}
              disabled
              className="px-4 py-2 rounded-full border bg-white text-black/40 cursor-not-allowed"
            >
              {w.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* =====================
     ERROR STATE
  ===================== */

  if (!data) {
    return <div className="p-8 text-red-600">Failed to load analytics</div>;
  }

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold">Global Analytics</h1>

        {/* What is this? */}
        <InfoPopover
          icon={<span className="text-lg cursor-pointer">ℹ️</span>}
          title="What is Global Analytics?"
        >
          <p>
            Global Analytics gives an overview of server-wide trends using town
            and nation data.
          </p>
          <p>
            It highlights growth, decline, stability, and economic risk across
            the entire map.
          </p>
        </InfoPopover>

        {/* How are metrics calculated? */}
        <InfoPopover
          icon={<span className="text-lg cursor-pointer">📊</span>}
          title="How are metrics calculated?"
        >
          <p>
            <strong>Stability Score</strong> is based on:
          </p>
          <ul className="list-disc pl-4">
            <li>Average town upkeep days</li>
            <li>Population growth (bonus)</li>
            <li>Penalty for towns near bankruptcy</li>
          </ul>

          <p className="mt-2">
            <strong>Volatility</strong> measures how sharply a town’s population
            changes over time (growth or loss).
          </p>
        </InfoPopover>
      </div>

      {/* Window Toggle */}
      <div className="flex gap-2">
        {(["7d", "30d"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWindow(w)}
            className={`px-4 py-2 rounded-full border transition ${
              window === w
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black/5"
            }`}
          >
            {w.toUpperCase()}
          </button>
        ))}
      </div>

      <AnalyticsGrid data={data} window={data.window} />
    </div>
  );
}
