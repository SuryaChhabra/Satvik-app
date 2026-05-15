"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: "🌿" },
  { href: "/upload", label: "Upload Questions", icon: "📥" },
  { href: "/results", label: "Analysis Results", icon: "🔍" },
  { href: "/categories", label: "Categories", icon: "🗂️" },
  { href: "/faqs", label: "FAQ Generator", icon: "❓" },
  { href: "/templates", label: "Response Templates", icon: "💬" },
  { href: "/gaps", label: "Gap Analysis", icon: "🪴" },
  { href: "/bot-flows", label: "Bot Flows", icon: "🤖" },
  { href: "/report", label: "Weekly Report", icon: "📰" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white border-r border-cream-200 min-h-screen">
      <div className="px-6 py-6 border-b border-cream-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center text-lg">🌱</div>
          <div>
            <div className="font-serif text-lg leading-tight text-ink-900">Satvic</div>
            <div className="text-xs text-ink-500 leading-tight">Response Intelligence</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sage-100 text-sage-700 font-medium"
                  : "text-ink-700 hover:bg-cream-100",
              )}
            >
              <span className="text-base w-5 text-center">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-cream-200 text-xs text-ink-500">
        <div className="rounded-xl bg-cream-100 p-3">
          <div className="font-medium text-ink-700 mb-1">Mock Mode</div>
          Set <code className="text-[10px] bg-white px-1 py-0.5 rounded">OPENAI_API_KEY</code> in <code>.env.local</code> to use real AI.
        </div>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-cream-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">🌱</div>
        <div className="font-serif text-base">Satvic · Response Intelligence</div>
      </div>
      <Link href="/upload" className="text-sm text-sage-600 font-medium">Upload</Link>
    </div>
  );
}
