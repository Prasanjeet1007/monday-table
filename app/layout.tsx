
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monday-style Deals Table (Static Data)",
  description: "Interactive table with sorting, filtering, inline edit, context menus, column resize/reorder, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
