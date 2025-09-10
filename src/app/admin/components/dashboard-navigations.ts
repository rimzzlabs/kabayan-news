import {
  Megaphone,
  NewspaperIcon,
  type LucideIcon,
  LayoutListIcon,
  LayoutDashboardIcon,
} from "lucide-react";

export type DashboardNavigation = {
  label: string;
  pathname: string;
  icon: LucideIcon;
  subItems?: Array<{
    label: string;
    pathname: string;
    icon: LucideIcon;
  }>;
};

export const DASHBOARD_NAVIGATIONS = [
  { icon: LayoutDashboardIcon, label: "Dashboard", pathname: "/admin" },
  { icon: NewspaperIcon, label: "Berita", pathname: "/admin/news" },
  { icon: LayoutListIcon, label: "Kategori", pathname: "/admin/category" },
  { icon: Megaphone, label: "Aspirasi warga", pathname: "/admin/aspiration" },
] satisfies DashboardNavigation[];
