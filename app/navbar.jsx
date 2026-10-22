'use client';

import { useState } from 'react';
import { navContent } from './content/nav';
import styles from './navbar.module.css';
import RollingText from './rolling-text';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main Navigation">
        <div className={styles.logoArea}>
          <a href={navContent.logo.href} className={styles.logoLink} aria-label={navContent.logo.alt}>
            <img
              src={navContent.logo.src}
              alt={navContent.logo.alt}
              width="88"
              height="52"
              className={styles.logoImg}
            />
          </a>
        </div>

        <ul className={styles.links}>
          {navContent.links.map((link) => (
            <li key={link.label} className={styles.linkItem}>
              <a
                href={link.href}
                className={styles.link}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <RollingText>{link.label}</RollingText>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.ctaArea}>
          <a
            href={navContent.cta.href}
            className={styles.ctaButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <RollingText>{navContent.cta.label}</RollingText>
          </a>
        </div>

        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navContent.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.link}
              onClick={() => setMobileOpen(false)}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
          <a
            href={navContent.cta.href}
            className={styles.ctaButton}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
          >
            {navContent.cta.label}
          </a>
        </div>
      )}
    </header>
  );
}
