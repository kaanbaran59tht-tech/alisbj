import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/siparis/'],
    },
    sitemap: 'https://www.alluretoptantaki.com/sitemap.xml',
  };
}
