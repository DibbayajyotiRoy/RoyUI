import { GradientButton, MadeBy, Popover } from '@royui/ui';
import { Link } from '../components/Link';
import { InstallTabs } from '../components/InstallTabs';
import { ShowcaseCard } from '../components/ShowcaseCard';
import { NavGradientButton } from '../components/NavGradientButton';
import { ScrollReveal } from '../components/ScrollReveal';
import { HeroTitleMorph } from '../components/HeroTitleMorph';
import { FeaturedTextMorph } from '../components/featured/FeaturedTextMorph';
import { getFeatured, getComponent } from '../lib/registry';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ScrollReveal>
        <Featured />
      </ScrollReveal>
      <ScrollReveal>
        <Values />
      </ScrollReveal>
      <ScrollReveal>
        <CtaStrip />
      </ScrollReveal>
    </main>
  );
}

/* ─── Hero ─── */

function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">
          The component library<br />
          for the <em>next <HeroTitleMorph /> era.</em>
        </h1>

        <p className="hero__lede">
          Production-ready components for Next.js App Router, TanStack Start,
          and Vite. Zero-config styling, TypeScript-first, tree-shakeable.
        </p>

        <div className="hero__ctas">
          <NavGradientButton href="/components" fullWidth={false}>
            Browse components
          </NavGradientButton>
          <InstallTabs pkg="@royui/ui" variant="pill" />
        </div>

        <div className="hero__frameworks">
          <span className="hero__frameworks-label">Works with</span>
          <FrameworkMarquee />
        </div>
      </div>
    </section>
  );
}

/* ─── Featured showcase ─── */

function Featured() {
  const featured = getFeatured();
  return (
    <section className="section">
      <div className="section__head">
        <div>
          <div className="section__eyebrow">Featured</div>
          <h2 className="section__title">Start with these</h2>
          <p className="section__lede">
            Hand-picked components ready to ship in production today. Click
            through for installation and full documentation.
          </p>
        </div>
        <Link href="/components" className="link-quiet">
          All components
        </Link>
      </div>

      <div className="showcase-grid">
        {featured.map((c) => (
          <ShowcaseCard key={c.slug} entry={c}>
            <FeaturedPreview slug={c.slug} />
          </ShowcaseCard>
        ))}
      </div>
    </section>
  );
}

function FeaturedPreview({ slug }: { slug: string }) {
  if (slug === 'gradient-button') {
    return (
      <div style={{ width: '100%', maxWidth: 320 }}>
        <GradientButton>Join the Waitlist</GradientButton>
      </div>
    );
  }
  if (slug === 'popover') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'rgba(255,255,255,0.85)',
          fontSize: 14,
        }}
      >
        <span>Pricing details</span>
        <Popover defaultOpen align="left" width="sm" title="How this works">
          Billed monthly. Cancel any time from your dashboard.
        </Popover>
      </div>
    );
  }
  if (slug === 'made-by') {
    return (
      <MadeBy
        name="Roy"
        href="https://dibbayajyoti.com"
        style={{ position: 'static' }}
      />
    );
  }
  if (slug === 'text-morph') {
    return <FeaturedTextMorph />;
  }
  const entry = getComponent(slug);
  return (
    <span className="mono" style={{ color: 'var(--fg-3)', fontSize: 13 }}>
      {entry?.name}
    </span>
  );
}

/* ─── Values ─── */

function Values() {
  const values = [
    {
      icon: <BoltIcon />,
      title: 'RSC-ready',
      desc: 'Components ship with correct "use client" boundaries — works in Next.js App Router and TanStack Start out of the box.',
    },
    {
      icon: <PackageIcon />,
      title: 'Owns its styles',
      desc: 'Each component brings its own CSS via tree-shakeable side-effect imports. No global stylesheet, no Tailwind config.',
    },
    {
      icon: <TypeIcon />,
      title: 'Typed end-to-end',
      desc: 'Full TypeScript inference. Native HTML attributes forwarded — onClick, aria, data-*, refs all just work.',
    },
    {
      icon: <CopyIcon />,
      title: 'Copy or import',
      desc: 'Install from npm or use the CLI to copy source into your project. Two distribution models, one library.',
    },
  ];

  return (
    <section className="section">
      <div className="section__head">
        <div>
          <div className="section__eyebrow">Principles</div>
          <h2 className="section__title">Built the way you build</h2>
          <p className="section__lede">
            Sane defaults, escape hatches when you need them. No magic, no
            hidden runtime, nothing you couldn't have written yourself.
          </p>
        </div>
      </div>

      <div className="values-grid">
        {values.map((v) => (
          <div key={v.title} className="value">
            <div className="value__icon">{v.icon}</div>
            <h3 className="value__title">{v.title}</h3>
            <p className="value__desc">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA strip ─── */

function CtaStrip() {
  return (
    <section className="cta-strip">
      <div className="cta-card">
        <h2 className="cta-card__title">Get started in 30 seconds</h2>
        <p className="cta-card__lede">
          One install, one import, one component on screen. No config, no
          build step beyond what your framework already does.
        </p>
        <div className="cta-card__ctas">
          <Link href="/components/gradient-button" className="btn btn-primary">
            Read the docs
          </Link>
          <Link href="/components" className="btn btn-ghost">
            Browse all components
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Icons ─── */

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="m21 8-9-5-9 5v8l9 5 9-5V8z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v10" />
    </svg>
  );
}
function TypeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16" />
      <path d="M12 7v13" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
/* ─── Framework marquee ─── */

const FRAMEWORKS = [
  { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  { name: 'Vue.js', logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
  { name: 'Vite', logo: 'https://cdn.simpleicons.org/vite/646CFF' },
  { name: 'Angular', logo: 'https://cdn.simpleicons.org/angular/DD0031' },
];

function FrameworkMarquee() {
  // Canonical infinite-marquee (Aceternity / Magic UI / react-fast-marquee):
  // viewport → animated track → TWO identical sets. The track translates by
  // exactly one set's width (-50%) on every loop, so the second set lands in
  // the first set's pixel position — seamless join.
  //
  // The pattern only looks continuous if each set is wider than the viewport.
  // With only 4 frameworks the natural set is too short, so we repeat the list
  // inside each set until it comfortably exceeds the viewport.
  const REPEATS_PER_SET = 3;
  const setItems = Array.from({ length: REPEATS_PER_SET }).flatMap(() => FRAMEWORKS);

  const renderSet = (ariaHidden: boolean) => (
    <ul className="framework-marquee__set" aria-hidden={ariaHidden || undefined}>
      {setItems.map((f, i) => (
        <li className="framework-chip" key={`${f.name}-${i}`}>
          <img
            src={f.logo}
            alt=""
            width={16}
            height={16}
            className="framework-chip__logo"
            loading="lazy"
          />
          {f.name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="framework-marquee">
      <div className="framework-marquee__track">
        {renderSet(false)}
        {renderSet(true)}
      </div>
    </div>
  );
}
