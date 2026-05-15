export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/user/', '/login', '/registration'],
    },
    sitemap: 'https://www.moinabadfarmstays.com/sitemap.xml',
  };
}
