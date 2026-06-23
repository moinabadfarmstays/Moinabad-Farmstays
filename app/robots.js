const BASE_URL = "https://www.moinabadfarmstays.com";

export default function robots() {
  return {
    rules: [
      // Main rule — allow all crawlers on public pages
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/registration",
          "/user/",
          "/dashboard/",
          "/login-required/",
        ],
      },
      // ── AI crawlers — explicitly allow for ChatGPT Search, Perplexity,
      //    Claude, Gemini and other AI-powered search products.
      //    These bots must NOT be blocked or the site will never appear
      //    in AI-generated answers or AI Overview citations.
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ChatGPT-User",  allow: "/" },
      { userAgent: "CCBot",         allow: "/" },
      { userAgent: "anthropic-ai",  allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot",      allow: "/" },
      { userAgent: "YouBot",        allow: "/" },
      { userAgent: "cohere-ai",     allow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
