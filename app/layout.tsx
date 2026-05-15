import "./globals.css";
import type { Metadata } from "next";
import { Sidebar, MobileTopBar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Satvic · Response Intelligence",
  description: "Calm, AI-assisted insight from user questions for the Satvic growth & support team.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 min-w-0 flex flex-col">
            <MobileTopBar />
            <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10 max-w-7xl w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
