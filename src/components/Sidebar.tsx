"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "דשבורד", color: "#0055DA", fg: "#ffffff", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/jobs", label: "משרות", color: "#FF0052", fg: "#ffffff", icon: "M4 7h16M4 7a2 2 0 012-2h12a2 2 0 012 2M4 7v12a2 2 0 002 2h12a2 2 0 002-2V7M9 5V3h6v2" },
  { href: "/resumes", label: "קורות חיים", color: "#E0B800", fg: "#000000", icon: "M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zM14 3v5h5" },
  { href: "/companies", label: "חברות", color: "#00C68D", fg: "#000000", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" },
];

// Label that pops out on hover, filled with a given color.
function HoverLabel({ color, fg, children }: { color: string; fg: string; children: React.ReactNode }) {
  return (
    <span
      style={{ backgroundColor: color, color: fg }}
      className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-bold opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
    >
      {children}
    </span>
  );
}

// Shared look for a floating icon button. No position here — the caller sets
// its own positioning context (`relative` for rail links, `fixed` for the toggle).
const FLOAT_BTN =
  "group grid h-12 w-12 place-items-center rounded-xl bg-white shadow-md transition duration-150 hover:-translate-y-0.5 hover:shadow-lg dark:bg-neutral-900";

export function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Main icon rail — floating on the right, sitting in the upper area. */}
      <nav
        aria-label="ניווט ראשי"
        className="fixed right-3 top-44 z-40 flex flex-col items-center gap-3 sm:right-4"
      >
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`relative ${FLOAT_BTN}`}
              style={
                active
                  ? { boxShadow: `0 6px 18px -4px ${item.color}80, 0 2px 6px rgba(0,0,0,0.12)` }
                  : undefined
              }
            >
              {/* Colored vertical accent line for the active section (toward the edge). */}
              {active && (
                <span
                  className="absolute -right-2.5 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                />
              )}
              <svg
                className="h-6 w-6 shrink-0 transition-transform duration-150 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke={item.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              <HoverLabel color={item.color} fg={item.fg}>
                {item.label}
              </HoverLabel>
            </Link>
          );
        })}
      </nav>

      {/* Theme (day / night) toggle — floating on the bottom-right. */}
      <button
        onClick={toggleTheme}
        aria-label={dark ? "מצב בהיר" : "מצב כהה"}
        className={`fixed bottom-4 right-3 z-40 text-neutral-600 dark:text-neutral-300 sm:right-4 ${FLOAT_BTN}`}
      >
        {dark ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
          </svg>
        )}
        <HoverLabel color="#1f2937" fg="#ffffff">
          {dark ? "מצב בהיר" : "מצב כהה"}
        </HoverLabel>
      </button>
    </>
  );
}
