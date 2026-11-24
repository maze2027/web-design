import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JK Speedy Driving School",
    short_name: "JK Speedy",
    description: "Patient, bilingual driving lessons in North Plainfield, NJ.",
    start_url: "/",
    display: "standalone",
    background_color: "#0E1116",
    theme_color: "#0E1116",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
