import { Link } from './Link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true" />
            <span className="brand__name">RoyUI</span>
          </div>
          <p className="footer__tag">
            Open-source React components for the next generation of apps. MIT
            licensed.
          </p>
        </div>

        <div>
          <div className="footer__col-title">Library</div>
          <ul className="footer__list">
            <li><Link href="/components">All components</Link></li>
            <li><Link href="/components/gradient-button">GradientButton</Link></li>
            <li><Link href="/components/popover">Popover</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer__col-title">Resources</div>
          <ul className="footer__list">
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="https://www.npmjs.com" target="_blank" rel="noreferrer">npm</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">Changelog</a></li>
          </ul>
        </div>

        <div>
          <div className="footer__col-title">Community</div>
          <ul className="footer__list">
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter / X</a></li>
            <li><a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a></li>
            <li><a href="mailto:hi@royui.dev">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">
        <span>© 2026 RoyUI · MIT License</span>
        <span className="footer__status">
          <span className="footer__status-dot" aria-hidden="true" />
          All systems operational
        </span>
      </div>
    </footer>
  );
}
