import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { DashboardSidebarLogout } from "./dashboard-sidebar-logout";
import { DashboardSidebarMenu } from "./dashboard-sidebar-menu";

export function DashboardSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="px-6 h-16 justify-center">
        <p className="text-sm font-semibold text-muted-foreground">
          Kabayan News
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <DashboardSidebarMenu />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter>
          <DashboardSidebarLogout />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
