
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ColumnState = {
  hidden: Record<string, boolean>;
  order: string[];
  widths: Record<string, number | undefined>;
};

type UIState = {
  sort: { id: string; desc: boolean }[];
  filters: Record<string, unknown>;
  column: ColumnState;
  selection: string[]; // selected deal IDs
  setSort: (s: { id: string; desc: boolean }[]) => void;
  setFilter: (col: string, value: unknown) => void;
  setColumn: (updater: (c: ColumnState) => ColumnState) => void;
  setSelection: (ids: string[]) => void;
};

export const useUIStore = create<UIState>()(persist((set, get) => ({
  sort: [],
  filters: {},
  column: { hidden: {}, order: [], widths: {} },
  selection: [],
  setSort: (s) => set({ sort: s }),
  setFilter: (col, value) => set({ filters: { ...get().filters, [col]: value } }),
  setColumn: (updater) => set({ column: updater(get().column) }),
  setSelection: (ids) => set({ selection: ids }),
}), { name: "deals-ui" }));
