import { useCallback, useEffect, useState } from 'react';
import type { CatId, Photo } from './content';
import type { L } from './i18n';
import { Footer, Header, MobileBar } from './components/Chrome';
import { Lightbox, flushPending, goTo, viewFromHash, type View } from './components/ui';
import { Cover } from './sections/Cover';
import { Signature } from './sections/Signature';
import { Portfolio } from './sections/Portfolio';
import { Editorial } from './sections/Editorial';
import { Looks } from './sections/Looks';
import { Motion } from './sections/Motion';
import { Artist, Private, Request, Visit } from './sections/More';
import { AstouBoutique, Encounters, InPrint, PageHead, SignatureWork } from './sections/Home';

export type Kind = 'salon' | 'location' | 'event';
type Preset = { kind?: Kind; style?: CatId; look?: L; photo?: string; n: number };

/**
 * Three pages (hash-addressed, so links can be shared and the back button works):
 *   home       — the story: opening, artist, signature work, in print, encounters, boutique, private styling, booking.
 *   portfolio  — The Art of Astou in full: every hairstyle by collection, featured looks, videos, specialties.
 *   editorial  — the editorial archive: published credits, couture headwear, notable encounters.
 */
export function App() {
  const [view, setView] = useState<View>(viewFromHash);
  const [lb, setLb] = useState<{ items: Photo[]; i: number } | null>(null);
  const [preset, setPreset] = useState<Preset | undefined>();

  useEffect(() => {
    document.documentElement.classList.add('js');
    const on = () => setView(viewFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  // After a page change, scroll to the requested section (or the top).
  useEffect(() => {
    flushPending();
  }, [view]);

  const open = useCallback((items: Photo[], i: number) => setLb({ items, i: Math.max(0, i) }), []);
  const ask = useCallback((p: Omit<Preset, 'n'>) => {
    setPreset((old) => ({ ...p, n: (old?.n ?? 0) + 1 }));
    window.setTimeout(() => goTo('request'), 40);
  }, []);
  const askStyle = useCallback((c: CatId) => ask({ style: c }), [ask]);

  return (
    <>
      <Header view={view} />
      <main id="main" tabIndex={-1}>
        {view === 'home' && (
          <>
            <Cover />
            <Artist />
            <SignatureWork onOpen={open} />
            <InPrint onOpen={open} />
            <Encounters onOpen={open} />
            <AstouBoutique onAsk={(collection) => ask({ look: collection })} />
            <Private onAsk={() => ask({ kind: 'location' })} onAskEvent={() => ask({ kind: 'event' })} />
            <Request preset={preset} />
            <Visit />
          </>
        )}
        {view === 'portfolio' && (
          <>
            <PageHead
              id="portfolio-top"
              kicker={{ en: 'Portfolio', es: 'Portafolio', fr: 'Portfolio' }}
              title={{ en: 'The Art', es: 'El arte', fr: 'L’art' }}
              em={{ en: 'of Astou', es: 'de Astou', fr: 'd’Astou' }}
              lede={{
                en: 'Sculptural hair art, bridal and special-occasion styles, braids and protective styling: every hairstyle in the portfolio, with client work and mannequin studies labelled.',
                es: 'Arte capilar escultural, peinados de novia y de ocasión, trenzas y peinados protectores: todos los peinados del portafolio, con el trabajo en clientas y los estudios en maniquí indicados.',
                fr: 'Art capillaire sculptural, coiffures de mariage et de cérémonie, tresses et coiffures protectrices : toutes les coiffures du portfolio, avec les clientes et les études sur tête d’exposition indiquées.',
              }}
            />
            <Portfolio onOpen={open} onAsk={(style, look) => ask({ style, look })} />
            <Looks onOpen={open} onAsk={(style, look, photo) => ask({ style, look, photo })} />
            <Motion onAsk={(style, look, photo) => ask({ style, look, photo })} />
            <Signature onOpen={open} onAsk={askStyle} />
            <Request preset={preset} />
          </>
        )}
        {view === 'editorial' && (
          <>
            <PageHead
              id="editorial-top"
              kicker={{ en: 'Editorial & notable encounters', es: 'Editorial y encuentros notables', fr: 'Éditorial & rencontres marquantes' }}
              title={{ en: 'Beyond', es: 'Más allá', fr: 'Au-delà' }}
              em={{ en: 'the salon', es: 'del salón', fr: 'du salon' }}
              lede={{
                en: 'Published fashion work, couture headwear and personal photographs. Each collection states what it documents: a printed credit, an attribution still being confirmed, or an encounter.',
                es: 'Trabajo de moda publicado, tocados de alta costura y fotografías personales. Cada colección indica lo que documenta: un crédito impreso, una atribución aún por confirmar o un encuentro.',
                fr: 'Travaux de mode publiés, coiffes couture et photographies personnelles. Chaque collection précise ce qu’elle documente : un crédit imprimé, une attribution en cours de confirmation ou une rencontre.',
              }}
            />
            <Editorial onOpen={open} />
            <Request preset={preset} />
          </>
        )}
      </main>
      <Footer />
      <MobileBar />
      <Lightbox items={lb?.items ?? []} index={lb ? lb.i : null} onClose={() => setLb(null)} onIndex={(i) => setLb((s) => (s ? { ...s, i } : s))}
        onAsk={(p) => {
          setLb(null);
          ask({ style: p.cats[0], look: p.title, photo: `/photos/${p.file}.jpg` });
        }}
      />
    </>
  );
}
