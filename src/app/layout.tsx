import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./components/providers";
import type { PropsWithChildren } from "react";
import { LayoutHeader } from "./components/layout-header";
import { LayoutInset } from "./components/layout-inset";

const interSans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kabayan News",
  description: "Berita, Aspirasi, dan Informasi Lingkungan Desa Kabayan",
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html suppressHydrationWarning translate="no" lang="id">
      <body className={cn(interSans, "antialiased")}>
        <Providers>
          <LayoutHeader />

          <LayoutInset>{props.children}</LayoutInset>
        </Providers>
      </body>
    </html>
  );
}
