"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogIn, LogOut } from "lucide-react";
import { useUser } from "./context/AuthProvider";

const navItems = [
  { label: "Nations", href: "/nations" },
  { label: "Towns", href: "/towns" },
  { label: "Upkeep", href: "/upkeep" },
  { label: "Analytics", href: "/analytics" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshAuth } = useUser();
  const handleLogout = () => {
    localStorage.removeItem("ccnet_token");
    refreshAuth();
    router.push("/login");
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-50 flex flex-col gap-3">
        <Link
          href="/"
          className="relative rounded-full border border-black/10 bg-white/90 backdrop-blur p-3 shadow-xl transition-all duration-200 hover:bg-black hover:text-white hover:scale-105 group"
        >
          <Home size={20} />
          <div className="absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-black text-white px-4 py-2 text-sm shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-left">
            Home
          </div>
        </Link>

        <a
          href="https://map.ccnetmc.com/"
          target="_blank"
          className="relative rounded-full scale-105 border border-black/10 bg-white/90 backdrop-blur p-3 shadow-xl transition-all duration-200 hover:bg-black hover:scale-105 group"
        >
          <img
            src="/ccnet-map.png"
            alt="CCNet Map"
            className="h-5 w-5 grayscale brightness-0 group-hover:invert transition-all duration-200"
          />
          <div className="absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-black text-white px-4 py-2 text-sm shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-left">
            CCNet Map
          </div>
        </a>

        <a
          href="https://ccnetmc.com/"
          target="_blank"
          className="relative rounded-full border border-black/10 bg-white/90 backdrop-blur p-3 shadow-xl transition-all duration-200 hover:bg-black hover:scale-105 group"
        >
          <img
            src="/ccnet-site.png"
            alt="CCNet Website"
            className="h-5 w-5 grayscale scale-140 brightness-0 group-hover:invert transition-all duration-200"
          />
          <div className="absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-black text-white px-4 py-2 text-sm shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-left">
            CCNet Website
          </div>
        </a>
      </div>

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <ul className="flex items-center gap-2 rounded-full border border-black/10 bg-white/90 backdrop-blur px-6 py-3 text-lg font-medium shadow-xl">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white"
                      : "text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-2">
        {user ? (
          <>
            <div className="rounded-full border border-black/10 bg-white/90 backdrop-blur px-4 py-3 shadow-xl flex items-center gap-2">
              <span className="text-sm font-medium">
                Welcome, {user?.userid || "User"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full border border-black/10 bg-white/90 backdrop-blur p-3 shadow-xl transition-all duration-200 hover:bg-red-600 hover:text-white hover:scale-105 group relative cursor-pointer"
            >
              <LogOut size={20} />
              <div className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-black text-white px-4 py-2 text-sm shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
                Logout
              </div>
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-black/10 bg-white/90 backdrop-blur p-3 shadow-xl transition-all duration-200 hover:bg-black hover:text-white hover:scale-105 group relative"
          >
            <LogIn size={20} />
            <div className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-black text-white px-4 py-2 text-sm shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
              Login
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
