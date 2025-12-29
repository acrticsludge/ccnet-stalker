"use client";

import { Github } from "lucide-react";
import { useEffect, useState } from "react";

function getTimeUntilUpkeep() {
  const now = new Date();
  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const target = new Date(istNow);
  target.setHours(0, 30, 0, 0);
  if (istNow > target) target.setDate(target.getDate() + 1);

  const diff = target.getTime() - istNow.getTime();

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
  };
}

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilUpkeep());

  useEffect(() => {
    setMounted(true);
    const i = setInterval(() => {
      setTimeLeft(getTimeUntilUpkeep());
    }, 1000);
    return () => clearInterval(i);
  }, []);

  if (!mounted) return null;

  const isUrgent = timeLeft.totalMs <= 10 * 60 * 1000;

  return (
    <div>
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className={`
          flex items-center gap-4 rounded-full px-6 py-3 backdrop-blur shadow-xl
          transition-all
          ${
            isUrgent
              ? "bg-red-50 border border-red-400"
              : "bg-white/90 border border-black/10"
          }
        `}
        >
          <a
            href="https://github.com/acrticsludge"
            target="_blank"
            className="px-4 py-2 rounded-full hover:bg-black hover:text-white transition"
          >
            <Github size={18} />
          </a>

          <div
            className={`px-4 py-2 rounded-full font-semibold tabular-nums
            ${isUrgent ? "bg-red-500 text-white" : "bg-black/5 text-black"}
          `}
          >
            Upkeep In: {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>

          <span className="text-black/50 text-sm">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
