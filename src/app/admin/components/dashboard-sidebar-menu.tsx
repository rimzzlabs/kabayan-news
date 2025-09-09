"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { DashboardSidebarMenuItem } from "./dashboard-sidebar-menu-item";
import { DASHBOARD_NAVIGATIONS } from "./dashboard-navigations";

export function DashboardSidebarMenu() {
  return (
    <SidebarMenu>
      {DASHBOARD_NAVIGATIONS.map((navItem) => (
        <DashboardSidebarMenuItem key={navItem.label} {...navItem} />
      ))}
    </SidebarMenu>
  );
}
