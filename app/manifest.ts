import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Health Bingo",
    short_name: "Health Bingo",
    description: "Fem små hälsosamma handlingar om dagen.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FBF6EC",
    theme_color: "#FBF6EC",
    lang: "sv",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
