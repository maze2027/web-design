"use client";

import type { ComponentProps, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useViewTransition } from "@/components/providers/ViewTransitions";

type Props = ComponentProps<typeof Link>;

/** Locale-aware link that animates page changes with the View Transitions API. */
export function NavLink({ onClick, href, locale, ...rest }: Props) {
  const router = useRouter();
  const navigate = useViewTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    const url = new URL(e.currentTarget.href);
    // Same-page anchors scroll natively (Lenis handles anchors).
    if (url.pathname === window.location.pathname && url.hash) return;
    if (url.pathname === window.location.pathname && !url.hash) return;
    e.preventDefault();
    // Link already resolved the localized pathname (+ query/hash) into the anchor's href.
    navigate(() => router.push(url.pathname + url.search + url.hash));
  };

  return <Link href={href} locale={locale} onClick={handle} {...rest} />;
}
