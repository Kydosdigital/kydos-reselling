import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kydos Academy",
    short_name: "Kydos Academy",
    description: "Build and operate a structured UK digital marketing agency with Kydos Digital.",
    start_url: "/",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#07111f",
    icons: [
      { src: "/brand/kydos-academy-app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/brand/kydos-academy-app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
