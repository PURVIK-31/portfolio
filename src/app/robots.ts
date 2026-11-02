import type { MetadataRoute } from "next";
import { baseURL } from "@/app/resources";

// Search engines and AI answer engines are explicitly welcome: being cited by
// ChatGPT, Perplexity, Claude, Gemini etc. is part of the GEO/AEO strategy.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
    host: baseURL,
  };
}
