import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { KIND_LABEL, type Photo } from '../content';
import { useI18n } from '../i18n';

/* ------------------------------------------------------------- helpers */

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  window.setTimeout(() => {
    const off = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (Math.abs(el.getBoundingClientRect().top - off) > 12) el.scrollIntoView({ behavior: 'auto' });
  }, 1300);
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

/* ------------------------------------------------------------- Img */

export function Img({ p, sizes, eager, className, style }: { p: Photo; sizes: string; eager?: boolean; className?: string; style?: CSSProperties }) {
  const { t } = useI18n();
  const set = p.widths.map((w) => `/photos/${p.file}-${w}.webp ${w}w`).join(', ');
  return (
    <picture className={`img ${className ?? ''}`} style={{ ...style, ['--focus' as string]: p.focus ?? '50% 35%' }}>
      <source type="image/webp" srcSet={set} sizes={sizes} />
      <img
        src={`/photos/${p.file}.jpg`}
        alt={t(p.alt)}
        width={p.w}
        height={p.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchpriority: 'high' } : {})}
      />
    </picture>
  );
}

/* ------------------------------------------------------------- Reveal (content is visible without JS / with reduced motion) */

export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'figure' | 'header' | 'article'; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setIn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIn(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const El = Tag as 'div';
  return (
    <El ref={ref as RefObject<HTMLDivElement>} className={`rv ${inView ? 'is-in' : ''} ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>
      {children}
    </El>
  );
}

/* ------------------------------------------------------------- Monogram tile (approved art on onyx) */

export function Monogram({ size = 'm' }: { size?: 's' | 'm' | 'l' }) {
  return (
    <span className={`mono-tile mono-${size}`} aria-hidden="true">
      <img src="/brand/monogram-gold-220.webp" alt="" width="220" height="147" />
    </span>
  );
}

/* ------------------------------------------------------------- Section head */

export function Kicker({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="kicker">
      <span className="kicker-n">{n}</span>
      <span className="kicker-rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------- Lightbox (full screen, swipe, keys) */

export function Lightbox({ items, index, onClose, onIndex }: { items: Photo[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const { t } = useI18n();
  const open = index !== null;
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const opener = useRef<Element | null>(null);
  useScrollLock(open);

  const go = useCallback((d: number) => index !== null && onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    ref.current?.querySelector<HTMLElement>('.lb-close')?.focus();
    return () => (opener.current as HTMLElement | null)?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('button')];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, go, onClose]);

  if (index === null) return null;
  const p = items[index];
  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={t({ en: 'Photo viewer', fr: 'Visionneuse de photos' })}
      ref={ref}
      onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        const s = start.current;
        start.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) onClose();
      }}
    >
      <div className="lb-top">
        <span className="lb-count">
          {String(index + 1).padStart(2, '0')} <i>/</i> {String(items.length).padStart(2, '0')}
        </span>
        <button type="button" className="lb-close" onClick={onClose} aria-label={t({ en: 'Close', fr: 'Fermer' })}>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      <figure className="lb-fig" key={p.file}>
        <Img p={p} sizes="100vw" eager className="lb-img" />
        <figcaption>
          <span className="lb-kind">{t(KIND_LABEL[p.kind])}</span>
          <span className="lb-title">{t(p.title)}</span>
          <span className="lb-alt">{t(p.alt)}</span>
        </figcaption>
      </figure>
      {items.length > 1 && (
        <>
          <button type="button" className="lb-nav lb-prev" onClick={() => go(-1)} aria-label={t({ en: 'Previous photo', fr: 'Photo précédente' })}>
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
              <path d="M18 4L8 14l10 10" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <button type="button" className="lb-nav lb-next" onClick={() => go(1)} aria-label={t({ en: 'Next photo', fr: 'Photo suivante' })}>
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
              <path d="M10 4l10 10-10 10" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Icons */

export const Icon = {
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.6 3.5l2.6 4-1.7 2.1a12 12 0 0 0 6.9 6.9l2.1-1.7 4 2.6-1 3.1c-.2.6-.8 1-1.5 1C9.6 21.2 2.8 14.4 2.5 6c0-.7.4-1.3 1-1.5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  ig: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 6l8.5 7 8.5-7" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7-6.4-7-11.5a7 7 0 0 1 14 0C19 14.6 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
};
