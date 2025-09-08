import type { PropsWithChildren } from "react";

export function LayoutInset(props: PropsWithChildren) {
  return (
    <main>
      <div className="w-11/12 max-w-7xl mx-auto">{props.children}</div>
    </main>
  );
}
