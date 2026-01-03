"use client";

import { useEffect, useState } from "react";

type AnalyticsResponse = {
  today: number | null;
  "7d": number | null;
  "30d": number | null;
  "1y": number | null;
  trend: {
    "7d": number | null;
    "30d": number | null;
    "1y": number | null;
  };
};

function Trend({ value }: { value: number | null }) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="text-black/40">—</span>;
  }

  if (value > 0) {
    return <span className="text-green-600">▲ {value}</span>;
  }

  if (value < 0) {
    return <span className="text-red-600">▼ {Math.abs(value)}</span>;
  }

  return <span className="text-black/60">0</span>;
}

export default function AnalyticsCard({
  title,
  endpoint,
}: {
  title: string;
  endpoint: string;
}) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  function safeNumber(value: number | null | undefined) {
    return Number.isFinite(value) ? value : "—";
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) return;
        const json = await res.json();
        setData(json);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [endpoint]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-6 py-6 shadow-xl">
        <p className="text-sm text-black/50">Loading analytics…</p>
      </div>
    );
  }

  if (!data || data.today === null) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-6 py-6 shadow-xl">
        <p className="text-sm text-black/50">No analytics data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl px-6 py-6 shadow-xl">
      <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-black/50">Today</p>
          <p className="text-xl font-semibold">{safeNumber(data.today)}</p>
        </div>

        <div>
          <p className="text-xs text-black/50">7 Days</p>
          <p className="text-lg">{safeNumber(data["7d"])}</p>
          <Trend value={data.trend["7d"]} />
        </div>

        <div>
          <p className="text-xs text-black/50">30 Days</p>
          <p className="text-lg">{safeNumber(data["30d"])}</p>
          <Trend value={data.trend["30d"]} />
        </div>

        <div>
          <p className="text-xs text-black/50">1 Year</p>
          <p className="text-lg">{safeNumber(data["1y"])}</p>
          <Trend value={data.trend["1y"]} />
        </div>
      </div>
    </div>
  );
}
