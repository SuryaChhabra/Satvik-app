import "./globals.css";
import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "Satvic Garden — your gentle daily companion",
  description: "A calm Satvic companion where small habits grow a personal garden.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen pb-24">
          <div className="max-w-md mx-auto px-4 py-6">{children}</div>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
