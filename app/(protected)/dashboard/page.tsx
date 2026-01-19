"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/AuthProvider";
import { Plus } from "lucide-react";
import TownCard from "@/app/cards/TownCard";
import NationCard from "@/app/cards/NationCard";

type Town = {
  name: string;
  mayor: string;
  nation: string;
  bank: number;
  upkeep: number;
  days: number;
  residents: string[];
  residentCount: number;
};

type Nation = {
  name: string;
  leader: string;
  totalResidents: number;
  townCount: number;
  towns: Array<{
    name: string;
    bank: number;
    upkeep: number;
  }>;
};

export default function DashboardPage() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [myTowns, setMyTowns] = useState<string[]>([]);
  const [myNations, setMyNations] = useState<string[]>([]);
  const [townsData, setTownsData] = useState<Town[]>([]);
  const [nationsData, setNationsData] = useState<Nation[]>([]);
  const [showAddTownModal, setShowAddTownModal] = useState(false);
  const [showAddNationModal, setShowAddNationModal] = useState(false);
  const [allTowns, setAllTowns] = useState<Town[]>([]);
  const [allNations, setAllNations] = useState<Nation[]>([]);
  const [townSearch, setTownSearch] = useState("");
  const [nationSearch, setNationSearch] = useState("");

  // Load user's lists from localStorage
  useEffect(() => {
    if (user?.userid) {
      const savedTowns = localStorage.getItem(`myTowns_${user.userid}`);
      const savedNations = localStorage.getItem(`myNations_${user.userid}`);
      if (savedTowns) setMyTowns(JSON.parse(savedTowns));
      if (savedNations) setMyNations(JSON.parse(savedNations));
    }
  }, [user]);

  // Save to localStorage when lists change
  useEffect(() => {
    if (user?.userid) {
      localStorage.setItem(`myTowns_${user.userid}`, JSON.stringify(myTowns));
    }
  }, [myTowns, user]);

  useEffect(() => {
    if (user?.userid) {
      localStorage.setItem(
        `myNations_${user.userid}`,
        JSON.stringify(myNations)
      );
    }
  }, [myNations, user]);

  useEffect(() => {
    if (myTowns.length > 0) {
      fetchTownsData();
    } else {
      setTownsData([]);
    }
  }, [myTowns]);

  useEffect(() => {
    if (myNations.length > 0) {
      fetchNationsData();
    } else {
      setNationsData([]);
    }
  }, [myNations]);

  const fetchTownsData = async () => {
    try {
      const token = localStorage.getItem("ccnet_token");
      if (!token) return;

      const res = await fetch(
        "https://pj5xzvw7-5000.use2.devtunnels.ms/towns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
        }
      );

      if (!res.ok) return;

      const data: Town[] = await res.json();
      const filteredData = data.filter((town) => myTowns.includes(town.name));
      setTownsData(filteredData);
    } catch (error) {
      console.error("Error fetching towns data:", error);
    }
  };

  const fetchNationsData = async () => {
    try {
      const token = localStorage.getItem("ccnet_token");
      if (!token) return;

      const res = await fetch(
        "https://pj5xzvw7-5000.use2.devtunnels.ms/nations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
        }
      );

      if (!res.ok) return;

      const data: Nation[] = await res.json();
      const filteredData = data.filter((nation) =>
        myNations.includes(nation.name)
      );
      setNationsData(filteredData);
    } catch (error) {
      console.error("Error fetching nations data:", error);
    }
  };

  const fetchAllTowns = async () => {
    if (allTowns.length > 0) return;

    try {
      const token = localStorage.getItem("ccnet_token");
      if (!token) return;

      const res = await fetch(
        "https://pj5xzvw7-5000.use2.devtunnels.ms/towns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
        }
      );

      if (!res.ok) return;

      const data: Town[] = await res.json();
      setAllTowns(data);
    } catch (error) {
      console.error("Error fetching all towns:", error);
    }
  };

  const fetchAllNations = async () => {
    if (allNations.length > 0) return;

    try {
      const token = localStorage.getItem("ccnet_token");
      if (!token) return;

      const res = await fetch(
        "https://pj5xzvw7-5000.use2.devtunnels.ms/nations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
        }
      );

      if (!res.ok) return;

      const data: Nation[] = await res.json();
      setAllNations(data);
    } catch (error) {
      console.error("Error fetching all nations:", error);
    }
  };

  const addTown = (townName: string) => {
    if (!myTowns.includes(townName)) {
      setMyTowns([...myTowns, townName]);
    }
    setShowAddTownModal(false);
    setTownSearch("");
  };

  const addNation = (nationName: string) => {
    if (!myNations.includes(nationName)) {
      setMyNations([...myNations, nationName]);
    }
    setShowAddNationModal(false);
    setNationSearch("");
  };

  const removeTown = (townName: string) => {
    setMyTowns(myTowns.filter((name) => name !== townName));
    setTownsData(townsData.filter((town) => town.name !== townName));
  };

  const removeNation = (nationName: string) => {
    setMyNations(myNations.filter((name) => name !== nationName));
    setNationsData(nationsData.filter((nation) => nation.name !== nationName));
  };

  const filteredTowns = allTowns.filter(
    (town) =>
      town.name.toLowerCase().includes(townSearch.toLowerCase()) &&
      !myTowns.includes(town.name)
  );

  const filteredNations = allNations.filter(
    (nation) =>
      nation.name.toLowerCase().includes(nationSearch.toLowerCase()) &&
      !myNations.includes(nation.name)
  );

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-black tracking-tight">
          My Dashboard
        </h1>
        <p className="mt-3 text-black/60 max-w-xl mx-auto">
          Manage your personal lists of towns and nations to track.
        </p>
      </div>

      {/* My Towns Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-black">
            My Towns ({myTowns.length})
          </h2>
          <button
            onClick={() => {
              setShowAddTownModal(true);
              fetchAllTowns();
            }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-black/80 transition-colors"
          >
            <Plus size={16} />
            Add Town
          </button>
        </div>

        {townsData.length === 0 ? (
          <div className="text-center py-12 text-black/60">
            No towns added yet. Click "Add Town" to get started.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {townsData.map((town) => (
              <div key={town.name} className="relative">
                <TownCard {...town} />
                <button
                  onClick={() => removeTown(town.name)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove from my list"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Nations Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-black">
            My Nations ({myNations.length})
          </h2>
          <button
            onClick={() => {
              setShowAddNationModal(true);
              fetchAllNations();
            }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-black/80 transition-colors"
          >
            <Plus size={16} />
            Add Nation
          </button>
        </div>

        {nationsData.length === 0 ? (
          <div className="text-center py-12 text-black/60">
            No nations added yet. Click "Add Nation" to get started.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {nationsData.map((nation) => (
              <div key={nation.name} className="relative">
                <NationCard {...nation} />
                <button
                  onClick={() => removeNation(nation.name)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove from my list"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Town Modal */}
      {showAddTownModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <h3 className="text-xl font-semibold mb-4">Add Town</h3>
            <input
              type="text"
              placeholder="Search towns..."
              value={townSearch}
              onChange={(e) => setTownSearch(e.target.value)}
              className="w-full p-2 border border-black/20 rounded-lg mb-4"
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredTowns.slice(0, 10).map((town) => (
                <button
                  key={town.name}
                  onClick={() => addTown(town.name)}
                  className="w-full text-left p-2 hover:bg-black/5 rounded-lg"
                >
                  {town.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowAddTownModal(false)}
                className="flex-1 bg-gray-200 text-black py-2 rounded-full hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Nation Modal */}
      {showAddNationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <h3 className="text-xl font-semibold mb-4">Add Nation</h3>
            <input
              type="text"
              placeholder="Search nations..."
              value={nationSearch}
              onChange={(e) => setNationSearch(e.target.value)}
              className="w-full p-2 border border-black/20 rounded-lg mb-4"
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredNations.slice(0, 10).map((nation) => (
                <button
                  key={nation.name}
                  onClick={() => addNation(nation.name)}
                  className="w-full text-left p-2 hover:bg-black/5 rounded-lg"
                >
                  {nation.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowAddNationModal(false)}
                className="flex-1 bg-gray-200 text-black py-2 rounded-full hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
