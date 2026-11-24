"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const BLUR =
  "data:image/svg+xml;base64," +
  (typeof btoa === "function"
    ? btoa('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5"><rect width="8" height="5" fill="#1d232c"/></svg>')
    : Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5"><rect width="8" height="5" fill="#1d232c"/></svg>').toString("base64"));

/**
 * next/image with a graceful fallback: if the remote photo fails, a dark
 * gradient with a subtle road line takes its place (no broken-image icon).
 */
export function SmartImage({ className = "", alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span role="img" aria-label={alt} className={`absolute inset-0 block bg-[radial-gradient(120%_80%_at_20%_10%,#2b3442,#0e1116_70%)] ${className}`}>
        <span aria-hidden="true" className="lane-divider absolute inset-x-[10%] bottom-[18%] opacity-40" />
      </span>
    );
  }
  return (
    <Image
      alt={alt}
      placeholder="blur"
      blurDataURL={BLUR}
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}
