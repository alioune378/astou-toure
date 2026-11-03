import { useCallback, useEffect, useState } from 'react';
import type { CatId, Photo } from './content';
import { Footer, Header, MobileBar } from './components/Chrome';
import { Lightbox, goTo } from './components/ui';
import { Contents, Cover } from './sections/Cover';
import { Atelier, Signature } from './sections/Signature';
import { Portfolio } from './sections/Portfolio';
import { Editorial } from './sections/Editorial';
import { Artist, Boutique, Private, Request, Visit } from './sections/More';

type Preset = { kind?: 'salon' | 'location'; style?: CatId; n: number };

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
        <Atelier onOpen={open} />
        <Portfolio onOpen={open} />
        <Editorial onOpen={open} />
        <Artist />
        <Private onAsk={() => ask({ kind: 'location' })} />
        <Request preset={preset} />
        <Boutique />
        <Visit />
      </main>
      <Footer />
      <MobileBar />
      <Lightbox items={lb?.items ?? []} index={lb ? lb.i : null} onClose={() => setLb(null)} onIndex={(i) => setLb((s) => (s ? { ...s, i } : s))} />
    </>
  );
}
