import type { ReactNode } from "react";

// Templates remount on navigation: a CSS fade is the fallback when View Transitions aren't supported.
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
