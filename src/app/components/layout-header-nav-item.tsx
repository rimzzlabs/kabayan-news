"use client";

import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type LayoutHeaderNavItemProps = {
  label: string;
  pathname: string;
};

export function LayoutHeaderNavItem(props: LayoutHeaderNavItemProps) {
  let pathname = usePathname();

  let isPathnameActive = (p: string) => {
    return pathname.includes(p) && pathname.endsWith(p);
  };

  return (
    <ButtonLink
      href={props.pathname}
      key={props.pathname}
      variant="ghost"
      className={cn(
        "px-2 text-muted-foreground hover:text-primary",
        isPathnameActive(props.pathname) && "font-semibold text-primary",
      )}
    >
      {props.label}
    </ButtonLink>
  );
}
