import type { ReactNode } from "react";

export default function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active ? "border-text bg-text text-canvas" : "border-line text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
