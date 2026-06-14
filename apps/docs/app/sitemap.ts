import type { MetadataRoute } from 'next';
import { components } from '../lib/registry';

const SITE_URL = 'https://roy-ui-docs.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/components`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const componentRoutes: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${SITE_URL}/components/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: c.status === 'available' ? 0.8 : 0.5,
  }));

  return [...staticRoutes, ...componentRoutes];
}
