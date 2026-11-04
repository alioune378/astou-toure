import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** English (default) and French are the primary languages; Spanish is kept as a courtesy for Bronx clients. */
export type Lang = 'en' | 'es' | 'fr';
export type L = { en: string; es: string; fr: string };
export const LANGS: readonly Lang[] = ['en', 'fr', 'es'];
const isLang = (v: string | null): v is Lang => v === 'en' || v === 'es' || v === 'fr';

const META: Record<Lang, { title: string; description: string; locale: string }> = {
  en: {
    title: 'Astou Touré — The Art of Hair · Hair Artist & Braider, Bronx NY',
    description:
      'Astou Touré, hair artist and specialist braider at Astou Style & Boutique, 9 East 167th Street, Bronx, NY. Nappy hairstyles, boho braids, sculptural braided updos and custom braiding. Request a private appointment.',
    locale: 'en_US',
  },
  es: {
    title: 'Astou Touré — El arte del cabello · Trenzas y peinados en el Bronx, NY',
    description:
      'Astou Touré, artista del cabello y trenzadora en Astou Style & Boutique, 9 East 167th Street, Bronx, NY. Peinados nappy, trenzas boho, recogidos trenzados esculturales y trenzas a la medida. Pide tu cita privada.',
    locale: 'es_US',
  },
  fr: {
    title: 'Astou Touré — L’art de la coiffure · Coiffeuse et tresseuse, Bronx NY',
    description:
      'Astou Touré, artiste capillaire et tresseuse chez Astou Style & Boutique, 9 East 167th Street, Bronx, NY. Coiffures nappy, tresses bohèmes, chignons tressés sculpturaux et tresses sur mesure. Demandez un rendez-vous.',
    locale: 'fr_FR',
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: L) => string };
const I18n = createContext<Ctx | null>(null);
const KEY = 'astou-lang';

function initial(): Lang {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (isLang(q)) return q;
  try {
    const s = localStorage.getItem(KEY);
    if (isLang(s)) return s;
  } catch {
    /* storage unavailable */
  }
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setState] = useState<Lang>(initial);
  const setLang = useCallback((l: Lang) => {
    // Keep the visitor where they are: text lengths differ between languages, so re-anchor on the element at the top of the screen.
    const probe = document.elementFromPoint(window.innerWidth / 2, 96);
    const anchor = probe?.closest('h2, h3, figure, li, p, section') ?? null;
    const before = anchor?.getBoundingClientRect().top ?? 0;
    setState(l);
    if (anchor)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const d = anchor.getBoundingClientRect().top - before;
          if (Math.abs(d) > 1) window.scrollBy(0, d);
        }),
      );
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    if (l === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', l);
    window.history.replaceState(null, '', url.toString());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = META[lang].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', META[lang].description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', META[lang].locale);
  }, [lang]);

  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (v) => v[lang] }), [lang, setLang]);
  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error('useI18n must be used inside I18nProvider');
  return c;
}
