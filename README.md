
# Monday-style Deals Table (Static Data)

Interactive table built with **Next.js + TypeScript**, powered by **@tanstack/react-table**, **Zustand**, and **Framer Motion**.  
No server calls – all interactions are client-only with optional localStorage persistence.

## ✨ Features Implemented
- Sticky header + horizontal scroll
- Clickable cells with inline editing (text, amount) and dropdowns (stage)
- Expandable rows with animated details
- Sorting (multi-column via Shift+Click) with indicators
- Filtering (toolbar + per-column selects)
- Context menus (headers & rows)
- Column resize (drag right edge) & reorder (drag handle)
- Row selection (single/multi) + bulk actions
- Status chips for stages
- Tooltips via titles and a help strip
- Totals footer (count, sum, avg)
- Keyboard navigation (arrow keys, Enter, Esc)
- Persist UI state (sort, column order/sizes, visibility) via `zustand` + `localStorage`

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🧩 Tech
- Next.js 14 (App Router)
- TypeScript
- @tanstack/react-table v8
- zustand (with persist)
- framer-motion
- tailwindcss (utility styles)
- lucide-react (icons)

## 📝 Notes / Known Issues
- Column reorder implemented via lightweight mouse-drag gesture; it reorders one step at a time while dragging left/right.
- Basic text/amount validation only.
- For brevity, accessible labels are present, but advanced ARIA for grid roles is kept minimal.
- Demo data is static and resets with the footer **Reset** button.

---

Made with ❤️
