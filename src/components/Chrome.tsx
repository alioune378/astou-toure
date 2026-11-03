import { useEffect, useState } from 'react';
import { BIZ } from '../content';
import { useI18n, type L } from '../i18n';
import { Icon, Monogram, goTo, useScrollLock } from './ui';

export const NAV: { id: string; label: L }[] = [
  { id: 'signature', label: { en: 'Signature', fr: 'Signature' } },
  { id: 'portfolio', label: { en: 'Portfolio', fr: 'Portfolio' } },
  { id: 'editorial', label: { en: 'Editorial', fr: 'Éditorial' } },
  { id: 'artist', label: { en: 'The Artist', fr: 'L’artiste' } },
  { id: 'private', label: { en: 'Private Clientele', fr: 'Clientèle privée' } },
  { id: 'boutique', label: { en: 'Boutique', fr: 'Boutique' } },
  { id: 'visit', label: { en: 'Visit', fr: 'Venir' } },
];

export const CTA: L = { en: 'Request a private appointment', fr: 'Demander un rendez-vous' };
export const CTA_SHORT: L = { en: 'Request', fr: 'Rendez-vous' };

export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`lang ${className}`} role="group" aria-label="Language / Langue">
      {(['en', 'fr'] as const).map((l) => (
        <button key={l} type="button" lang={l} aria-pressed={lang === l} className={lang === l ? 'is-on' : ''} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useScrollLock(open);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => goTo(id), 60);
  };

  return (
    <>
      <a className="skip" href="#main">
        {t({ en: 'Skip to content', fr: 'Aller au contenu' })}
      </a>
      <header className={`top ${solid ? 'is-solid' : ''}`}>
        <a
          className="brand"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Astou Touré — home"
        >
          <Monogram size="s" />
          <span className="brand-name">Astou Touré</span>
        </a>
        <nav className="nav" aria-label={t({ en: 'Main', fr: 'Principale' })}>
          {NAV.map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}>
              {t(n.label)}
            </button>
          ))}
        </nav>
        <div className="top-r">
          <LangSwitch />
          <button type="button" className="btn btn-onyx btn-sm top-cta" onClick={() => go('request')}>
            {t(CTA_SHORT)}
          </button>
          <button type="button" className="burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>
            <span className="sr-only">{t({ en: 'Open menu', fr: 'Ouvrir le menu' })}</span>
            <i />
            <i />
          </button>
        </div>
      </header>

      <div id="menu" className={`menu ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className="menu-top">
          <span className="menu-brand">Astou Touré</span>
          <button type="button" className="menu-close" onClick={() => setOpen(false)}>
            <span className="sr-only">{t({ en: 'Close menu', fr: 'Fermer le menu' })}</span>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
        <ol className="menu-nav">
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ['--i' as string]: i }}>
              <button type="button" onClick={() => go(n.id)}>
                <span className="menu-n">{String(i + 1).padStart(2, '0')}</span>
                {t(n.label)}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn-gold menu-cta" onClick={() => go('request')}>
          {t(CTA)}
        </button>
        <div className="menu-foot">
          <a href={BIZ.tel}>
            {Icon.phone} {BIZ.phoneDisplay}
          </a>
          <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
            {Icon.ig} {BIZ.instagramHandle}
          </a>
          <LangSwitch className="lang-menu" />
        </div>
      </div>
    </>
  );
}

/**
 * Phone action bar (call · Instagram · request).
 * It never sits over content while reading: it appears only when the visitor scrolls back UP
 * (a sign they are looking for something), hides as soon as they scroll down, and stays hidden
 * over the request form, the visit section, the footer and while typing in any field.
 */
export function MobileBar() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let typing = false;
    const covered = () => {
      const limit = window.innerHeight - 90;
      return ['request', 'visit'].some((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r ? r.top < limit && r.bottom > 0 : false;
      });
    };
    const on = () => {
      const y = window.scrollY;
      const dy = y - last;
      if (Math.abs(dy) < 6) return;
      last = y;
      if (typing || y < window.innerHeight * 0.8 || covered()) return setShow(false);
      setShow(dy < 0);
    };
    const focusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement).matches?.('input, select, textarea')) {
        typing = true;
        setShow(false);
      }
    };
    const focusOut = () => (typing = false);
    window.addEventListener('scroll', on, { passive: true });
    document.addEventListener('focusin', focusIn);
    document.addEventListener('focusout', focusOut);
    return () => {
      window.removeEventListener('scroll', on);
      document.removeEventListener('focusin', focusIn);
      document.removeEventListener('focusout', focusOut);
    };
  }, []);
  return (
    <div className={`mbar ${show ? 'is-on' : ''}`} aria-hidden={!show}>
      <a href={BIZ.tel} tabIndex={show ? 0 : -1}>
        {Icon.phone}
        <span>{t({ en: 'Call', fr: 'Appeler' })}</span>
      </a>
      <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1}>
        {Icon.ig}
        <span>Instagram</span>
      </a>
      <button type="button" className="mbar-cta" onClick={() => goTo('request')} tabIndex={show ? 0 : -1}>
        {t(CTA_SHORT)}
      </button>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot">
      <div className="foot-logo">
        <img src="/brand/logo-onyx-480.webp" srcSet="/brand/logo-onyx-480.webp 480w, /brand/logo-onyx-900.webp 900w" sizes="(max-width: 600px) 70vw, 340px" alt="Astou Touré — Astou Style & Boutique" width="480" height="329" loading="lazy" />
      </div>
      <p className="foot-line">{t({ en: 'Hair Artistry • Beauty • Fashion', fr: 'Art capillaire • Beauté • Mode' })}</p>
      <div className="foot-grid">
        <address>
          {BIZ.venue}
          <br />
          {BIZ.street}
          <br />
          {BIZ.city}
        </address>
        <ul className="foot-links">
          <li>
            <a href={BIZ.tel}>{BIZ.phoneIntl}</a>
          </li>
          <li>
            <a href={`mailto:${BIZ.email}`}>{BIZ.email}</a>
          </li>
          <li>
            <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
              Instagram {BIZ.instagramHandle}
            </a>
          </li>
          <li>
            <a href={BIZ.maps} target="_blank" rel="noopener noreferrer">
              {t({ en: 'Directions', fr: 'Itinéraire' })}
            </a>
          </li>
        </ul>
        <LangSwitch className="lang-foot" />
      </div>
      <div className="foot-base">
        <span>© {new Date().getFullYear()} Astou Touré · Astou Style &amp; Boutique</span>
        <span>
          {t({ en: 'Website by', fr: 'Site réalisé par' })}{' '}
          <a href="https://dalaltechnologies.com" target="_blank" rel="noopener noreferrer">
            Dalal Technologies
          </a>
        </span>
      </div>
    </footer>
  );
}
