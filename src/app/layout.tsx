import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Sidebar from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AI SEO 스튜디오",
  description: "AI 직원이 웹사이트 상위노출을 운영하는 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="bg-[#050816] text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}