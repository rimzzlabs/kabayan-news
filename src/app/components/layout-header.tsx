"use client";

import { useUser } from "@/modules/auth/hooks";
import { LayoutHeaderNav } from "./layout-header-nav";
import { LayoutHeaderProfile } from "./layout-header-profile";
import { usePathname } from "next/navigation";

export function LayoutHeader() {
  let user = useUser();
  let pathname = usePathname();

  let isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;
  if (isAdminRoute && user.data?.role === "admin") return null;

  return (
    <header className="sticky top-0 inset-x-0 bg-elevated border-b">
      <div className="h-[3.9375rem] flex items-center justify-between gap-2 w-11/12 max-w-7xl mx-auto">
        <p className="font-semibold text-muted-foreground">Kabayan News</p>

        <LayoutHeaderNav />

        <LayoutHeaderProfile />
      </div>
    </header>
  );
}
