"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/alerts", label: "Alerts" },
  { href: "/assets", label: "Assets" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-line bg-panel flex shrink-0 flex-col gap-6 border-b p-4 md:w-56 md:border-r md:border-b-0">
      <div className="flex items-center gap-2">
        <span className="bg-critical/15 text-critical grid size-8 place-items-center rounded-lg text-sm font-bold">
          SD
        </span>
        <span className="font-semibold">Sentinel Demo</span>
      </div>

      <nav className="flex gap-1 md:flex-col">
        {links.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-panel-hover text-text font-medium"
                  : "text-muted hover:bg-panel-hover hover:text-text"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
