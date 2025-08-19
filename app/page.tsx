
'use client';

import { DealsTable } from "@/components/DealsTable";
import { Upload } from "lucide-react";

export default function Page() {
  return (
    <main className="p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Deals</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">New deal</button>
          <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Import <Upload className="ml-1 inline h-4 w-4" /></button>
        </div>
      </header>
      <DealsTable />
      <footer className="mt-6 text-xs text-slate-500">
        <p>Static demo. All interactions run client-side only and persist in localStorage.</p>
      </footer>
    </main>
  );
}
