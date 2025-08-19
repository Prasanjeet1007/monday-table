
'use client';

import * as React from "react";
import {
  ColumnDef, flexRender, getCoreRowModel, useReactTable, getSortedRowModel,
  SortingState, getFilteredRowModel, ColumnOrderState, RowSelectionState, getExpandedRowModel,
  ColumnResizeMode
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { deals as initialDeals, Deal } from "@/lib/data";
import { useUIStore } from "@/lib/store";
import { ChevronDown, ChevronRight, Filter, MoreVertical, Move, Search, XCircle } from "lucide-react";
import { ContextMenu, MenuItem } from "./ContextMenu";

type EditableCellProps = {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
};

function EditableTextCell({ getValue, row, column, table }: EditableCellProps) {
  const initialValue = getValue();
  const [value, setValue] = React.useState(initialValue);
  const [editing, setEditing] = React.useState(false);
  React.useEffect(() => setValue(initialValue), [initialValue]);

  const onBlur = () => {
    setEditing(false);
    row.original[column.id] = value;
    table.options.meta?.onDataChange?.();
  };

  return editing ? (
    <input
      autoFocus
      className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur())}
    />
  ) : (
    <button
      className="w-full rounded-md px-1 text-left hover:bg-slate-50 focus:focus-ring"
      onClick={() => setEditing(true)}
    >
      {value ?? <span className="text-slate-400">—</span>}
    </button>
  );
}

function StageCell({ getValue, row, column, table }: EditableCellProps) {
  const value = getValue() as Deal["stage"];
  const [open, setOpen] = React.useState(false);
  const stages: Deal["stage"][] = ["New", "Qualified", "Won", "Lost"];
  const cls = (s: Deal["stage"]) =>
    s === "New" ? "status-pill status-new" :
    s === "Qualified" ? "status-pill status-qualified" :
    s === "Won" ? "status-pill status-won" : "status-pill status-lost";

  return (
    <div className="relative">
      <button className={cls(value)} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        {value} <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <ul
          tabIndex={-1}
          className="absolute z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-soft"
          role="listbox"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          {stages.map((s) => (
            <li key={s}>
              <button
                className="w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  row.original.stage = s;
                  table.options.meta?.onDataChange?.();
                  setOpen(false);
                }}
                role="option"
                aria-selected={s === value}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AmountCell({ getValue, row, column, table }: EditableCellProps) {
  const v = getValue() as number;
  const [val, setVal] = React.useState(v?.toString() ?? "");
  const [editing, setEditing] = React.useState(false);
  React.useEffect(() => setVal(v?.toString() ?? ""), [v]);

  const commit = () => {
    const num = Number(val.replace(/[, ]/g, ""));
    if (!Number.isNaN(num)) {
      row.original.amount = num;
      table.options.meta?.onDataChange?.();
    }
    setEditing(false);
  };

  return editing ? (
    <input
      autoFocus
      inputMode="numeric"
      className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => (e.key === "Enter" ? commit() : e.key === "Escape" ? setEditing(false) : null)}
    />
  ) : (
    <button className="w-full rounded-md px-1 text-left hover:bg-slate-50" onClick={() => setEditing(true)}>
      ₹ {Intl.NumberFormat().format(v ?? 0)}
    </button>
  );
}

type MenuState = { x: number; y: number; items: MenuItem[] } | null;

export function DealsTable() {
  const [data, setData] = React.useState<Deal[]>(() => [...initialDeals]);
  const ui = useUIStore();
  const [menu, setMenu] = React.useState<MenuState>(null);
  const [headerMenu, setHeaderMenu] = React.useState<MenuState>(null);
  const [resizeMode] = React.useState<ColumnResizeMode>("onChange");

  const columns = React.useMemo<ColumnDef<Deal>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <input
          aria-label="Select all rows"
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="h-4 w-4 rounded border-slate-300"
        />
      ),
      cell: ({ row }) => (
        <input
          aria-label={`Select ${row.original.company}`}
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 rounded border-slate-300"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 36,
      enableResizing: false,
      enableSorting: false,
    },
    {
      header: "Company",
      accessorKey: "company",
      cell: EditableTextCell,
      size: 260,
    },
    {
      header: "Owner",
      accessorKey: "owner",
      cell: EditableTextCell,
      size: 160,
    },
    {
      header: "Stage",
      accessorKey: "stage",
      cell: StageCell,
      size: 160,
      meta: { filterVariant: "select" }
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: AmountCell,
      size: 160,
      meta: { aggregate: "sum" }
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: EditableTextCell,
      size: 160,
      meta: { filterVariant: "select" }
    },
    {
      header: "Created",
      accessorKey: "created",
      cell: EditableTextCell,
      size: 220,
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: EditableTextCell,
      size: 320,
      enableResizing: true
    },
  ], []);

  const [sorting, setSorting] = React.useState<SortingState>(ui.sort);
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(ui.column.order.length ? ui.column.order : columns.map(c => (c as any).id ?? (c as any).accessorKey));
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnSizing, setColumnSizing] = React.useState<Record<string, number>>(ui.column.widths as any);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
      rowSelection,
      columnSizing,
      columnVisibility: Object.fromEntries(Object.entries(ui.column.hidden).map(([k,v]) => [k, !v]))
    },
    enableMultiSort: true,
    columnResizeMode: resizeMode,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      ui.setSort(next);
    },
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: setColumnSizing,
    meta: {
      onDataChange: () => setData([...data]),
    }
  });

  React.useEffect(() => {
    ui.setColumn(prev => ({ ...prev, order: columnOrder, widths: columnSizing }));
  }, [columnOrder, columnSizing]); // eslint-disable-line

  const totals = React.useMemo(() => {
    const sum = data.reduce((acc, d) => acc + (d.amount ?? 0), 0);
    const avg = data.length ? (sum / data.length) : 0;
    return { count: data.length, sum, avg };
  }, [data]);

  // Context menu for rows
  const onRowContext = (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: "Open details", onSelect: () => row.toggleExpanded() },
        { label: "Duplicate", onSelect: () => setData((ds) => [...ds, { ...row.original, id: row.original.id + "-copy" }]) },
        { label: "Delete", onSelect: () => setData((ds) => ds.filter((d) => d.id !== row.original.id)), shortcut: "Del" },
      ]
    });
  };

  // Header context menu
  const onHeaderContext = (e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    const col = table.getColumn(colId);
    if (!col) return;
    setHeaderMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: col.getIsVisible() ? "Hide column" : "Show column", onSelect: () => col.toggleVisibility() },
        { label: "Autosize to fit", onSelect: () => col.setSize(200) },
        { label: "Sort asc", onSelect: () => col.toggleSorting(false), shortcut: "A" },
        { label: "Sort desc", onSelect: () => col.toggleSorting(true), shortcut: "Z" },
        { label: "Clear sort", onSelect: () => col.clearSorting() },
      ]
    });
  };

  // Keyboard navigation: arrow keys move focus across cells
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [focus, setFocus] = React.useState<{r:number;c:number}>({ r: 0, c: 0 });

  const moveFocus = (dr: number, dc: number) => {
    const rows = table.getRowModel().rows.length;
    const cols = table.getAllLeafColumns().length;
    setFocus(({ r, c }) => ({
      r: Math.min(Math.max(0, r + dr), rows - 1),
      c: Math.min(Math.max(0, c + dc), cols - 1),
    }));
  };

  React.useEffect(() => {
    const el = tableRef.current?.querySelector(`[data-cell="${focus.r}-${focus.c}"]`) as HTMLElement | null;
    el?.focus();
  }, [focus, table.getRowModel().rows, table.getAllLeafColumns()]);

  const clearFilters = () => {
    ui.setColumn(prev => ({ ...prev })); // trigger persistence
    Object.keys(ui.filters).forEach((k) => ui.setFilter(k, undefined));
    table.resetColumnFilters();
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-soft">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search company..."
            className="w-56 rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => table.getColumn("company")?.setFilterValue(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Select filters for Stage & Status */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1">
            <Filter className="h-4 w-4" />
            <select className="bg-transparent p-1 text-sm outline-none"
              onChange={(e) => table.getColumn("stage")?.setFilterValue(e.target.value || undefined)}
            >
              <option value="">Stage</option>
              {["New","Qualified","Won","Lost"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="bg-transparent p-1 text-sm outline-none"
              onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value || undefined)}
            >
              <option value="">Status</option>
              {["Open","On Hold","Won","Lost"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={clearFilters} className="rounded-lg border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50">
            Clear filters
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Bulk actions when selected */}
          {table.getState().rowSelection && Object.keys(table.getState().rowSelection).length > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1 text-sm">
              <span>{Object.keys(table.getState().rowSelection).length} selected</span>
              <button className="rounded-md px-2 py-1 hover:bg-slate-50" onClick={() => {
                const ids = table.getSelectedRowModel().rows.map(r => r.original.id);
                alert("Bulk action on: " + ids.join(", "));
              }}>Bulk Action</button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-auto" ref={tableRef}>
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onContextMenu={(e) => onHeaderContext(e, header.column.id)}
                      style={{ width: header.getSize() }}
                      className="relative border-b border-slate-200 bg-white p-0"
                    >
                      <div
                        className="flex items-center gap-2 border-r border-slate-100 px-3 py-2 text-left text-sm font-medium"
                      >
                        <div className="flex items-center gap-1">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <button
                              aria-label="Toggle sort"
                              onClick={header.column.getToggleSortingHandler()}
                              className="rounded p-1 hover:bg-slate-50"
                              title="Click to sort, Shift+Click for multi-sort"
                            >
                              {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
                            </button>
                          )}
                          <button
                            className="rounded p-1 hover:bg-slate-50"
                            onClick={(e) => onHeaderContext(e as any, header.column.id)}
                            aria-label="Column menu"
                            title="Column menu"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          <button
                            className="cursor-grab rounded p-1 hover:bg-slate-50"
                            title="Drag to reorder"
                            onMouseDown={(e) => {
                              // Simple drag reorder: start drag
                              const startX = e.clientX;
                              const startOrder = [...table.getState().columnOrder];
                              const idx = startOrder.indexOf(header.column.id);
                              const onMove = (ev: MouseEvent) => {
                                const delta = ev.clientX - startX;
                                if (Math.abs(delta) < 12) return;
                                const newIdx = delta > 0 ? Math.min(idx + 1, startOrder.length - 1) : Math.max(0, idx - 1);
                                if (newIdx !== idx) {
                                  const reordered = [...startOrder];
                                  const [item] = reordered.splice(idx, 1);
                                  reordered.splice(newIdx, 0, item);
                                  table.setColumnOrder(reordered);
                                }
                              };
                              const onUp = () => {
                                window.removeEventListener("mousemove", onMove);
                                window.removeEventListener("mouseup", onUp);
                              };
                              window.addEventListener("mousemove", onMove);
                              window.addEventListener("mouseup", onUp);
                            }}
                          >
                            <Move className="h-4 w-4" />
                          </button>
                        </div>
                        {header.column.getCanFilter() && header.column.columnDef.meta?.filterVariant === "select" && (
                          <select
                            className="ml-auto rounded-md border border-slate-300 p-1 text-xs"
                            onChange={(e) => header.column.setFilterValue(e.target.value || undefined)}
                          >
                            <option value="">All</option>
                            {[...new Set(data.map(d => (d as any)[header.column.id]))].map(v => (
                              <option key={String(v)} value={String(v)}>{String(v)}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="col-resizer"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rIdx) => (
              <React.Fragment key={row.id}>
                <tr
                  onContextMenu={(e) => onRowContext(e, row)}
                  onClick={() => row.toggleSelected()}
                  className={"group cursor-default border-b border-slate-100 hover:bg-slate-50"}
                >
                  {row.getVisibleCells().map((cell, cIdx) => (
                    <td
                      key={cell.id}
                      data-cell={`${rIdx}-${cIdx}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight") moveFocus(0, 1);
                        else if (e.key === "ArrowLeft") moveFocus(0, -1);
                        else if (e.key === "ArrowDown") moveFocus(1, 0);
                        else if (e.key === "ArrowUp") moveFocus(-1, 0);
                        else if (e.key === "Enter") {
                          // Try to "enter edit" by clicking the cell
                          (e.currentTarget.querySelector("button, input, select") as HTMLElement | null)?.click();
                        } else if (e.key === "Escape") {
                          (document.activeElement as HTMLElement | null)?.blur();
                        }
                      }}
                      className="whitespace-nowrap px-3 py-2 text-sm"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="w-10 text-right pr-3">
                    <button onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }} className="rounded p-1 hover:bg-slate-100" aria-label="Expand row">
                      {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td colSpan={row.getVisibleCells().length + 1} className="p-0">
                    <AnimatePresence initial={false}>
                      {row.getIsExpanded() && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50"
                        >
                          <div className="px-6 py-4 text-sm text-slate-700">
                            <div className="mb-2 font-medium">Details for {row.original.company}</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div><span className="text-slate-500">Deal ID:</span> {row.original.id}</div>
                                <div><span className="text-slate-500">Owner:</span> {row.original.owner}</div>
                                <div><span className="text-slate-500">Stage:</span> {row.original.stage}</div>
                                <div><span className="text-slate-500">Amount:</span> ₹ {Intl.NumberFormat().format(row.original.amount)}</div>
                              </div>
                              <div>
                                <div><span className="text-slate-500">Created:</span> {row.original.created}</div>
                                <div><span className="text-slate-500">Close Date:</span> {row.original.closeDate ?? "—"}</div>
                                <div className="mt-2">
                                  <label className="text-slate-500">Notes</label>
                                  <textarea
                                    className="mt-1 w-full rounded-md border border-slate-300 p-2"
                                    defaultValue={row.original.notes ?? ""}
                                    onBlur={(e) => { row.original.notes = e.target.value; }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 bg-white">
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2 text-sm text-slate-600" colSpan={3}>Total deals: {totals.count}</td>
              <td className="px-3 py-2 text-sm text-slate-600">—</td>
              <td className="px-3 py-2 text-sm font-semibold">₹ {Intl.NumberFormat().format(totals.sum)}</td>
              <td className="px-3 py-2 text-sm text-slate-600" colSpan={3}>Avg: ₹ {Intl.NumberFormat().format(Math.round(totals.avg))}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Help strip */}
      <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <span><kbd>Shift</kbd> + click to multi-sort</span>
          <span>•</span>
          <span>Right-click headers/rows for context menus</span>
          <span>•</span>
          <span>Drag header <strong>↕</strong> bar to resize, <strong><span className='inline-block align-middle'>☰</span></strong> to reorder</span>
        </div>
        <button
          className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50"
          onClick={() => {
            setData([...initialDeals]);
            ui.setSort([]);
            ui.setColumn(() => ({ hidden: {}, order: [], widths: {} }));
          }}
        >
          <XCircle className="h-4 w-4" /> Reset
        </button>
      </div>

      {/* Menus */}
      {menu && <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} />}
      {headerMenu && <ContextMenu x={headerMenu.x} y={headerMenu.y} items={headerMenu.items} onClose={() => setHeaderMenu(null)} />}
    </section>
  );
}
