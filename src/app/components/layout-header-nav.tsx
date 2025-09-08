import { LayoutHeaderNavItem } from "./layout-header-nav-item";

let navigations = [
  { label: "Beranda", pathname: "/" },
  { label: "Aspirasi", pathname: "/aspiration" },
];

export function LayoutHeaderNav() {
  return (
    <nav className="inline-flex items-center gap-1">
      {navigations.map((nav) => (
        <LayoutHeaderNavItem
          label={nav.label}
          pathname={nav.pathname}
          key={nav.pathname}
        />
      ))}
    </nav>
  );
}
