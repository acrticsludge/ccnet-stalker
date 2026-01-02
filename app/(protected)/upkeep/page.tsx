"use client";
import UpkeepCard from "@/app/cards/UpkeepCard";
import { useEffect, useState } from "react";

export default function Upkeep() {
  const [allUpkeepData, setAllUpkeepData] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("ccnet_token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch(
        "https://3rvzd8hz-5000.inc1.devtunnels.ms/allupkeep",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
        }
      );

      if (res.status === 401) {
        console.error("Unauthorized");
        return;
      }

      const data = await res.json();
      setAllUpkeepData(data);
    }

    fetchData();
  }, []);

  const dayZeroTowns = allUpkeepData?.["0"] || [];
  const dayOneTowns = allUpkeepData?.["1"] || [];
  const dayTwoTowns = allUpkeepData?.["2"] || [];

  if (!allUpkeepData) return <div>Loading...</div>;

  return (
    <div className="px-6 py-10">
      <div
        className="
        grid gap-6
        grid-cols-1
        md:grid-cols-3
        max-w-7xl mx-auto
      "
      >
        <UpkeepCard
          title="Falling Today"
          subtitle="Needs upkeep today"
          towns={dayZeroTowns}
          accent="red"
        />

        <UpkeepCard
          title="Falling Tomorrow"
          subtitle="1 day remaining"
          towns={dayOneTowns}
          accent="orange"
        />

        <UpkeepCard
          title="Falling Day After"
          subtitle="2 days remaining"
          towns={dayTwoTowns}
          accent="green"
        />
      </div>
    </div>
  );
}
