import { ImageCarousel, Card } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import {
  sampleContent,
  sampleImages,
  sampleStats,
} from './demos/card-sample';
import type { ReactNode } from 'react';

export function CardDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package to your project. The card pulls in its own CSS and the Button it renders — no global setup."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { Card } from '@roy-ui/ui';

// the gallery is exported on its own, too:
import { ImageCarousel } from '@roy-ui/ui';

// or import just this component (its own 'use client' island):
import { Card } from '@roy-ui/ui/card';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="Pass the listing data as props. The gallery swipes on drag and on the dots; the action at the bottom is the library Button, so it carries the same depth and press."
      >
        <Example
          title="Default"
          description="Drag the photo or tap a dot — the track slides on a long, eased curve and the active dot stretches into a pill. Stats are separated by hairlines; the footer carries attribution."
          code={`<Card
  images={[
    { src: '/home-exterior.jpg', alt: 'Timber-and-glass facade at dusk' },
    { src: '/home-living.jpg', alt: 'Open-plan living and kitchen' },
    { src: '/home-stair.jpg', alt: 'Lounge beneath a floating staircase' },
    { src: '/home-corner.jpg', alt: 'Styled reading corner' },
  ]}
  badge="Prime Pick"
  price="$1,450,000"
  priceLabel="List price"
  subtitle="Architect-designed home · Hawthorn, Melbourne"
  stats={[
    { icon: <AreaIcon />, value: '264 m²', label: 'Living' },
    { icon: <RoomsIcon />, value: '4', label: 'Bedrooms' },
  ]}
  author="Dibbayajyoti Roy"
  authorHref="https://dibbayajyoti.com"
  authorProps={{ target: '_blank', rel: 'noreferrer' }}
  meta="2 days ago"
  onAction={() => router.push('/listings/hawthorn')}
/>`}
        >
          <div style={{ width: 320 }}>
            <Card
              images={sampleImages}
              badge={sampleContent.badge}
              price={sampleContent.price}
              priceLabel={sampleContent.priceLabel}
              subtitle={sampleContent.subtitle}
              stats={sampleStats}
              author={sampleContent.author}
              authorHref={sampleContent.authorHref}
              authorProps={{ target: '_blank', rel: 'noreferrer' }}
              meta={sampleContent.meta}
            />
          </div>
        </Example>

        <Example
          title="Autoplay"
          description="Set autoplay to advance the gallery on a timer — it loops back to the first photo and re-arms whenever you take over with a swipe or a dot. It pauses while you hover, and it stays still under prefers-reduced-motion. Tune the cadence with autoplayInterval (ms)."
          code={`<Card
  images={images}
  autoplay
  autoplayInterval={2500}
  badge="Prime Pick"
  price="$1,450,000"
  priceLabel="List price"
  subtitle="Architect-designed home · Hawthorn, Melbourne"
  stats={stats}
  author="Dibbayajyoti Roy"
  authorHref="https://dibbayajyoti.com"
  meta="2 days ago"
/>`}
        >
          <div style={{ width: 320 }}>
            <Card
              images={sampleImages}
              autoplay
              autoplayInterval={2500}
              badge={sampleContent.badge}
              price={sampleContent.price}
              priceLabel={sampleContent.priceLabel}
              subtitle={sampleContent.subtitle}
              stats={sampleStats}
              author={sampleContent.author}
              authorHref={sampleContent.authorHref}
              authorProps={{ target: '_blank', rel: 'noreferrer' }}
              meta={sampleContent.meta}
            />
          </div>
        </Example>

        <Example
          title="Just the gallery"
          description="The swipeable, dot-paginated media ships on its own as ImageCarousel. Give it a width and a ratio and drop anything into the overlay slot."
          code={`<ImageCarousel
  images={images}
  ratio="16 / 9"
  onIndexChange={(i) => setActive(i)}
/>`}
        >
          <div style={{ width: 360 }}>
            <ImageCarousel images={sampleImages} ratio="16 / 9" />
          </div>
        </Example>

        <Example
          title="Square gallery, no badge"
          description="Drop the badge by omitting it, and reshape the gallery with the ratio prop. The action keeps the card anchored even with less content above it."
          code={`<Card
  images={images}
  ratio="1 / 1"
  price="$1,450,000"
  priceLabel="List price"
  subtitle="Architect-designed home · Hawthorn, Melbourne"
  author="Dibbayajyoti Roy"
  authorHref="https://dibbayajyoti.com"
  meta="2 days ago"
  actionLabel="Book a viewing"
/>`}
        >
          <div style={{ width: 300 }}>
            <Card
              images={sampleImages}
              ratio="1 / 1"
              price={sampleContent.price}
              priceLabel={sampleContent.priceLabel}
              subtitle={sampleContent.subtitle}
              author={sampleContent.author}
              authorHref={sampleContent.authorHref}
              authorProps={{ target: '_blank', rel: 'noreferrer' }}
              meta={sampleContent.meta}
              actionLabel="Book a viewing"
            />
          </div>
        </Example>

        <Example
          title="Tint the action"
          description="actionProps forwards straight onto the Button — colour, variant, loading, anything. Pass actionLabel={null} to drop the button entirely."
          code={`<Card
  images={images}
  price="$1,450,000"
  subtitle="Architect-designed home · Hawthorn, Melbourne"
  stats={stats}
  actionLabel="Request a tour"
  actionProps={{ color: '#1f6f4a' }}
/>`}
        >
          <div style={{ width: 320 }}>
            <Card
              images={sampleImages}
              badge={sampleContent.badge}
              price={sampleContent.price}
              priceLabel={sampleContent.priceLabel}
              subtitle={sampleContent.subtitle}
              stats={sampleStats}
              author={sampleContent.author}
              authorHref={sampleContent.authorHref}
              authorProps={{ target: '_blank', rel: 'noreferrer' }}
              meta={sampleContent.meta}
              actionLabel="Request a tour"
              actionProps={{ color: '#1f6f4a' }}
            />
          </div>
        </Example>

        <Example
          title="Light and dark"
          description={`By default the card follows the system (theme="auto") — so it inherits your site's light/dark mode. The light surface is a premium off-white, not pure white, so it reads warmer and still holds an edge on a white page. Force either side with theme="light" or theme="dark".`}
          code={`// default — follows the system / your site theme
<Card {...listing} />

// force one side
<Card theme="light" {...listing} />
<Card theme="dark" {...listing} />`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            <div style={{ width: 260 }}>
              <Card
                theme="light"
                images={sampleImages}
                badge={sampleContent.badge}
                price={sampleContent.price}
                priceLabel={sampleContent.priceLabel}
                subtitle={sampleContent.subtitle}
                stats={sampleStats}
                author={sampleContent.author}
                authorHref={sampleContent.authorHref}
                authorProps={{ target: '_blank', rel: 'noreferrer' }}
                meta={sampleContent.meta}
              />
            </div>
            <div style={{ width: 260 }}>
              <Card
                theme="dark"
                images={sampleImages}
                badge={sampleContent.badge}
                price={sampleContent.price}
                priceLabel={sampleContent.priceLabel}
                subtitle={sampleContent.subtitle}
                stats={sampleStats}
                author={sampleContent.author}
                authorHref={sampleContent.authorHref}
                authorProps={{ target: '_blank', rel: 'noreferrer' }}
                meta={sampleContent.meta}
              />
            </div>
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="03"
        title="Theming"
        description="Both the card and the gallery expose their surfaces as CSS variables. Override them inline or in a stylesheet — the card already ships a prefers-color-scheme: dark theme."
      >
        <Code
          label="Variables"
          code={`.royui-card {
  --royui-card-bg: #fafaf8;            /* off-white surface */
  --royui-card-fg: #1a1a1c;            /* price + strong text */
  --royui-card-muted: rgba(0,0,0,.52); /* subtitle, author */
  --royui-card-line: rgba(0,0,0,.08);  /* hairline dividers */
  --royui-card-price-weight: 500;      /* lighter = more premium */
  --royui-card-radius: 24px;
}

.royui-carousel {
  --royui-carousel-radius: 16px;
  --royui-carousel-ratio: 4 / 3;
  --royui-carousel-dot: rgba(255,255,255,.55);
  --royui-carousel-dot-active: #ffffff;
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="04"
        title="Props"
        description="Unknown props spread onto the card's root <div>. The action button accepts everything Button does through actionProps."
      >
        <PropsTable />
      </DocSection>
    </>
  );
}

function DocSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id}>
      <div className="doc-section__head">
        <div className="doc-section__eyebrow">{eyebrow}</div>
        <h2 className="doc-section__title">{title}</h2>
        <p className="doc-section__desc">{description}</p>
      </div>
      {children}
    </section>
  );
}

async function Example({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article className="example">
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <PreviewTabs preview={children} code={<Code code={code} />} />
    </article>
  );
}

function PropsTable() {
  const rows = [
    { name: 'images', type: 'CarouselImage[]', def: '—', desc: 'Gallery slides. { src, alt }. One image hides the dots and drag.' },
    { name: 'price', type: 'ReactNode', def: '—', desc: 'Headline figure, e.g. "$1,450,000".' },
    { name: 'priceLabel', type: 'ReactNode', def: '—', desc: 'Muted qualifier beside the price, e.g. "List price".' },
    { name: 'badge', type: 'ReactNode', def: '—', desc: 'Pill over the image. Hidden when omitted.' },
    { name: 'badgeIcon', type: 'ReactNode', def: 'gold star', desc: 'Glyph inside the badge.' },
    { name: 'subtitle', type: 'ReactNode', def: '—', desc: 'Secondary line — owner, address.' },
    { name: 'stats', type: 'CardStat[]', def: '—', desc: 'Inline { icon, label } figures, hairline-divided.' },
    { name: 'author', type: 'ReactNode', def: '—', desc: 'Footer attribution. Prefixed with "By".' },
    { name: 'authorHref', type: 'string', def: '—', desc: 'Turns the author name into a link.' },
    { name: 'authorProps', type: 'AnchorHTMLAttributes', def: '—', desc: 'Extra attributes for the author link — target, rel, onClick.' },
    { name: 'meta', type: 'ReactNode', def: '—', desc: 'Right-aligned footer note, e.g. "2 days ago".' },
    { name: 'actionLabel', type: 'ReactNode', def: `'View Details'`, desc: 'Action button label. null drops the button.' },
    { name: 'onAction', type: '() => void', def: '—', desc: 'Action button click handler.' },
    { name: 'actionProps', type: 'Partial<ButtonProps>', def: '—', desc: 'Forwarded onto the underlying Button.' },
    { name: 'autoplay', type: 'boolean', def: 'false', desc: 'Auto-advance the gallery on a timer, looping. Pauses on hover.' },
    { name: 'autoplayInterval', type: 'number', def: '2500', desc: 'Milliseconds between auto-advances.' },
    { name: 'ratio', type: 'string', def: `'4 / 3'`, desc: 'Aspect ratio of the gallery.' },
    { name: 'defaultIndex', type: 'number', def: '0', desc: 'Starting gallery slide.' },
    { name: 'onIndexChange', type: '(i: number) => void', def: '—', desc: 'Fires when the gallery moves.' },
    { name: 'hoverEffect', type: 'boolean', def: 'true', desc: 'Lift the card and zoom the photo on hover.' },
    { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system (default), force off-white, or force near-black.' },
  ];
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '22%' }}>Prop</th>
          <th style={{ width: '24%' }}>Type</th>
          <th style={{ width: '16%' }}>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td className="prop-name"><code>{r.name}</code></td>
            <td className="prop-type"><code>{r.type}</code></td>
            <td className="prop-default"><code>{r.def}</code></td>
            <td className="prop-desc">{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
