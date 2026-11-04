import { useCallback, useEffect, useState } from 'react';
import type { CatId, Photo } from './content';
import type { L } from './i18n';
import { Footer, Header, MobileBar } from './components/Chrome';
import { Lightbox, goTo } from './components/ui';
import { Contents, Cover } from './sections/Cover';
import { Atelier, Signature } from './sections/Signature';
import { Portfolio } from './sections/Portfolio';
import { Editorial } from './sections/Editorial';
import { Looks } from './sections/Looks';
import { Motion } from './sections/Motion';
import { Artist, Boutique, Private, Request, Visit } from './sections/More';

type Preset = { kind?: 'salon' | 'location'; style?: CatId; look?: L; photo?: string; n: number };

export function App() {
  const [lb, setLb] = useState<{ items: Photo[]; i: number } | null>(null);
  const [preset, setPreset] = useState<Preset | undefined>();

  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  const open = useCallback((items: Photo[], i: number) => setLb({ items, i: Math.max(0, i) }), []);
  const ask = useCallback((p: Omit<Preset, 'n'>) => {
    setPreset((old) => ({ ...p, n: (old?.n ?? 0) + 1 }));
    window.setTimeout(() => goTo('request'), 40);
  }, []);
  const askStyle = useCallback((c: CatId) => ask({ style: c }), [ask]);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Cover onStyle={(c) => (c === 'nappy' || c === 'boho' ? goTo('nappy-boho') : goTo(`style-${c}`))} />
        <Contents />
        <Signature onOpen={open} onAsk={askStyle} />
        <Atelier />
        <Looks onOpen={open} onAsk={(style, look, photo) => ask({ style, look, photo })} />
        <Portfolio onOpen={open} onAsk={(style, look) => ask({ style, look })} />
        <Motion onAsk={(style, look, photo) => ask({ style, look, photo })} />
        <Editorial onOpen={open} />
        <Artist />
        <Private onAsk={() => ask({ kind: 'location' })} />
        <Request preset={preset} />
        <Boutique />
        <Visit />
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
