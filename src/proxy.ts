import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Root "/" redirects by NEXT_LOCALE cookie, then Accept-Language (Spanish → /es, otherwise /en).
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|og|_next|_vercel|.*\\..*).*)"],
};
