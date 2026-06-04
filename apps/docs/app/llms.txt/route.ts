import { components } from '../../lib/registry';

const SITE_URL = 'https://roy-ui-docs.vercel.app';

export const dynamic = 'force-static';

export function GET() {
  const componentLines = components
    .filter((c) => c.status === 'available')
    .map(
      (c) =>
        `- [${c.name}](${SITE_URL}/components/${c.slug}): ${c.tagline}`,
    )
    .join('\n');

  const body = `# Roy UI

Zero-config, RSC-safe React component library — DataTable, date range picker, analog/digital time picker. MIT. By Dibbayajyoti Roy.

## Components

${componentLines}

## Links

- [npm](https://www.npmjs.com/package/@roy-ui/ui)
- [GitHub](https://github.com/DibbayajyotiRoy/RoyUI)
- [Author](https://dibbayajyoti.com/about)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
