import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HisarWeb Starter",
    short_name: "HisarWeb",
    description: "Deploy-ready website starter with setup wizard, multi-tenant runtime and multilingual delivery. Ontwikkeld door H. Altuner — www.hisarweb.be",
    start_url: "/nl",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#6d28d9",
    lang: "nl",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  }
}
