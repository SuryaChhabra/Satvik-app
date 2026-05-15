"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/today", label: "Today", icon: "🌿" },
  { href: "/garden", label: "Garden", icon: "🪴" },
  { href: "/challenges", label: "Challenges", icon: "🎋" },
  { href: "/badges", label: "Badges", icon: "🏵️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();
  // hide on welcome + onboarding
  if (pathname === "/" || pathname.startsWith("/onboarding") || pathname.startsWith("/path")) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-cream-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {items.map((it) => {
          const active = pathname.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px]",
              active ? "text-sage-700" : "text-ink-500",
            )}>
              <span className={cn("text-lg leading-none", active && "scale-110")}>{it.icon}</span>
              <span className="leading-none">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
