"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function InfoPopover({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!mounted) return null;

  const rect = buttonRef.current?.getBoundingClientRect();

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className="text-black/60 hover:text-black transition"
      >
        {icon}
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            className="fixed z-[2147483647] w-80 rounded-2xl border border-black/10 bg-white shadow-xl p-4 text-sm"
            style={{
              top: rect.bottom + 8,
              left: Math.min(rect.left, window.innerWidth - 340),
            }}
          >
            <p className="font-semibold mb-2">{title}</p>
            <div className="text-black/70 space-y-2">{children}</div>
          </div>,
          document.body
        )}
    </>
  );
}
