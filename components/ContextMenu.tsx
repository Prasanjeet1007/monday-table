
'use client';

import { useEffect, useRef } from "react";

export type MenuItem = { label: string; onSelect: () => void; shortcut?: string; disabled?: boolean };

export function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: MenuItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current || !e.target) return onClose();
      if (!ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("contextmenu", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("contextmenu", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ top: y, left: x }}
      className="fixed z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-soft"
      role="menu"
    >
      {items.map((it, idx) => (
        <button
          key={idx}
          onClick={() => !it.disabled && it.onSelect()}
          disabled={it.disabled}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:opacity-50"
          role="menuitem"
        >
          <span>{it.label}</span>
          {it.shortcut && <kbd>{it.shortcut}</kbd>}
        </button>
      ))}
    </div>
  );
}
