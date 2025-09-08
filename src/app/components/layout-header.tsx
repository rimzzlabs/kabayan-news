import { LayoutHeaderNav } from "./layout-header-nav";
import { LayoutHeaderProfile } from "./layout-header-profile";

export function LayoutHeader() {
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
