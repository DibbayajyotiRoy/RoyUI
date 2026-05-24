import { Link } from '../components/Link';
import { ComponentCard } from '../components/ComponentCard';
import { components, getFeatured, getAvailable } from '../lib/registry';

export default function HomePage() {
  const featured = getFeatured();
  const total = components.length;
  const available = getAvailable().length;

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__eyebrow">React Component Library · v0.0.1</div>
          <h1 className="hero__title">
            Components you can <span className="hero__title-accent">drop in</span> and ship.
          </h1>
          <p className="hero__lede">
            Production-ready React components for Next.js App Router, TanStack
            Start, and any Vite-based app. Zero-config styling. TypeScript-first.
            Tree-shakeable.
          </p>

          <div className="hero__ctas">
            <Link href="/components" className="btn-primary">
              Browse components
            </Link>
            <Link href="/components/gradient-button" className="btn-ghost">
              View GradientButton
            </Link>
          </div>

          <div className="hero__stats">
            <Stat label="Available" value={String(available)} />
            <Stat label="Planned" value={String(total)} />
            <Stat label="Frameworks" value="3" />
            <Stat label="Bundle" value="< 2 KB" />
          </div>
        </div>
      </section>

      <section className="home-section">
        <SectionHeading
          eyebrow="Featured"
          title="Start with these"
          description="Hand-picked components ready to ship in production today."
          action={<Link href="/components" className="link-arrowless">All components</Link>}
        />
        <div className="catalog-grid">
          {featured.map((c) => (
            <ComponentCard key={c.slug} entry={c} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionHeading
          eyebrow="Why RoyUI"
          title="Built the way you build"
          description="Sane defaults, escape hatches when you need them."
        />
        <div className="value-grid">
          <ValueCard
            title="RSC-ready"
            description={
              <>
                Components ship with the correct{' '}
                <code className="code-inline">use client</code> boundaries so
                they work in Next.js App Router and TanStack Start out of the box.
              </>
            }
          />
          <ValueCard
            title="Owns its styles"
            description="Each component brings its own CSS via tree-shakeable side-effect imports. No global stylesheet to wire up, no Tailwind config to extend."
          />
          <ValueCard
            title="Typed end-to-end"
            description="Full TypeScript inference for props. Native HTML attributes are forwarded, so onClick, aria, data-*, and refs just work."
          />
          <ValueCard
            title="Copy or import"
            description="Install from npm, or use the CLI to copy the source into your project for full ownership. Two distribution models, one library."
          />
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="home-section__head">
      <div>
        <div className="home-section__eyebrow">{eyebrow}</div>
        <h2 className="home-section__title">{title}</h2>
        <p className="home-section__desc">{description}</p>
      </div>
      {action ? <div className="home-section__action">{action}</div> : null}
    </div>
  );
}

function ValueCard({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <div className="value-card">
      <h3 className="value-card__title">{title}</h3>
      <p className="value-card__desc">{description}</p>
    </div>
  );
}
