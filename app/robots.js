const BASE_URL = "https://www.moinabadfarmstays.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",                          // Block all API routes
          "/login",
          "/registration",
          "/user/",                         // User profile/bookings — private
          "/login-required/",
        ],
      },
      {
        // Block GPTBot and AI scrapers from crawling booking data
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
