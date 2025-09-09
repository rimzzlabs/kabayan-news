"use client";

import { useUser } from "@/modules/auth/hooks";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export function LayoutInset(props: PropsWithChildren) {
  let user = useUser();
  let pathname = usePathname();

  let isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return props.children;
  if (isAdminRoute && user.data?.role === "admin") return props.children;

  return (
    <main>
      <div className="w-11/12 max-w-7xl mx-auto">{props.children}</div>
    </main>
  );
}
