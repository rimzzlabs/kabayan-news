import {
  ListPlusIcon,
  Megaphone,
  NewspaperIcon,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavigation = {
  label: string;
  pathname: string;
  icon: LucideIcon;
  role: string;
  subItems?: Array<{
    label: string;
    pathname: string;
    icon: LucideIcon;
  }>;
};

export const DASHBOARD_NAVIGATIONS = [
  {
    icon: NewspaperIcon,
    role: "user",
    label: "Berita",
    pathname: "/admin/news",
  },
  {
    role: "user",
    icon: ListPlusIcon,
    label: "Buat berita baru",
    pathname: "/admin/news/new",
  },
  {
    icon: Megaphone,
    role: "admin",
    label: "Aspirasi warga",
    pathname: "/admin/aspiration",
  },
] satisfies DashboardNavigation[];
