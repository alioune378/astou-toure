import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** English first (New York audience), French second. No other language. */
export type Lang = 'en' | 'fr';
export type L = { en: string; fr: string };

const META: Record<Lang, { title: string; description: string; locale: string }> = {
  en: {
    title: 'Astou Touré — The Art of Hair · Hair Artist & Braider, Bronx NY',
    description:
      'Astou Touré, hair artist and specialist braider at Astou Style & Boutique, Bliss Beauty World, 9 East 167th Street, Bronx, NY. Nappy hairstyles, boho braids, sculptural braided updos and custom braiding. Request a private appointment.',
    locale: 'en_US',
  },
  fr: {
    title: 'Astou Touré — L’art de la coiffure · Coiffeuse et tresseuse, Bronx NY',
    description:
      'Astou Touré, artiste capillaire et tresseuse chez Astou Style & Boutique, Bliss Beauty World, 9 East 167th Street, Bronx, NY. Coiffures nappy, tresses bohèmes, chignons tressés sculpturaux et tresses sur mesure. Demandez un rendez-vous.',
    locale: 'fr_FR',
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: L) => string };
const I18n = createContext<Ctx | null>(null);
const KEY = 'astou-lang';

function initial(): Lang {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'fr' || q === 'en') return q;
  try {
    const s = localStorage.getItem(KEY);
    if (s === 'fr' || s === 'en') return s;
  } catch {
    /* storage unavailable */
  }
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setState] = useState<Lang>(initial);
  const setLang = useCallback((l: Lang) => {
    setState(l);
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
