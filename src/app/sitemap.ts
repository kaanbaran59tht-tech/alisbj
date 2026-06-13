import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.alluretoptantaki.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // İleride dinamik ürün sayfaları veya kategoriler eklenirse buraya eklenebilir.
  ];
}
