"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, LogIn } from "lucide-react";

const navItems = [
  { label: "Nations", href: "/nations" },
  { label: "Towns", href: "/towns" },
  { label: "Upkeep", href: "/upkeep" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className="
          fixed top-6 left-6 z-50
          rounded-full border border-black/10
          bg-white/90 backdrop-blur
          p-3 shadow-xl
          transition-all duration-200
            hover:bg-black hover:text-white
          hover:scale-105
          group
        "
      >
        <Home size={20} />
        <div
          className="
      absolute left-full top-1/2 ml-3 -translate-y-1/2
      whitespace-nowrap
      rounded-full
      bg-black text-white
      px-4 py-2 text-sm
      shadow-lg

      opacity-0 scale-95
      group-hover:opacity-100 group-hover:scale-100
      transition-all duration-300
      origin-left
    "
        >
          Home
        </div>
      </Link>

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <ul
          className="
            flex items-center gap-2
            rounded-full border border-black/10
            bg-white/90 backdrop-blur
            px-6 py-3
            text-lg font-medium
            shadow-xl
          "
        >
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    px-4 py-2 rounded-full
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-black text-white"
                        : "text-black hover:bg-black hover:text-white"
                    }
                  `}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href="/login"
        className="
          fixed top-6 right-6 z-50
          rounded-full border border-black/10
          bg-white/90 backdrop-blur
          p-3 shadow-xl
          transition-all duration-200
            hover:bg-black hover:text-white
          hover:scale-105
          group
        "
      >
        <LogIn size={20} />
        <div
          className="
    absolute right-full top-1/2 mr-3 -translate-y-1/2
    whitespace-nowrap
    rounded-full
    bg-black text-white
    px-4 py-2 text-sm
    shadow-lg

    opacity-0 scale-95
    group-hover:opacity-100 group-hover:scale-100
    transition-all duration-300
    origin-right
  "
        >
          Login
        </div>
      </Link>
    </>
  );
}
