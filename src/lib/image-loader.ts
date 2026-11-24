type LoaderArgs = { src: string; width: number; quality?: number };

/** Unsplash CDN loader: ?auto=format&fit=crop&q=80&w=<width>. Local files pass through. */
export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith("https://images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("q", String(quality ?? 80));
    url.searchParams.set("w", String(width));
    return url.toString();
  }
  return src;
}
