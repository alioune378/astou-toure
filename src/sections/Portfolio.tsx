import { useMemo, useState } from 'react';
import { CATS, KIND_LABEL, PHOTOS, type CatId, type Photo } from '../content';
import { useI18n } from '../i18n';
import { Img, Kicker } from '../components/ui';

const FILTERS: ('all' | CatId)[] = ['all', 'sculptural', 'braiding', 'editorial'];

/** 02 — Portfolio: an asymmetric editorial grid, filterable, every image opens full screen. */
export function Portfolio({ onOpen }: { onOpen: (items: Photo[], i: number) => void }) {
  const { t } = useI18n();
  const [f, setF] = useState<'all' | CatId>('all');
  const items = useMemo(() => (f === 'all' ? PHOTOS : PHOTOS.filter((p) => p.cats.includes(f))), [f]);
  return (
    <section id="portfolio" className="pf sec" aria-labelledby="pf-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="02">{t({ en: 'Portfolio', fr: 'Portfolio' })}</Kicker>
            <h2 id="pf-h" className="h2">
              {t({ en: 'The work,', fr: 'Le travail,' })} <em>{t({ en: 'up close', fr: 'de près' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Real styles by Astou: on clients, and as sculptural studies on mannequin heads. Tap any image to see it full screen.',
              fr: 'De vraies coiffures signées Astou : sur ses clientes, et en études sculpturales sur têtes d’exposition. Touchez une image pour l’afficher en plein écran.',
            })}
          </p>
        </header>

        <div className="pills" role="group" aria-label={t({ en: 'Filter by style', fr: 'Filtrer par style' })}>
          {FILTERS.map((x) => (
            <button key={x} type="button" aria-pressed={f === x} className={f === x ? 'is-on' : ''} onClick={() => setF(x)}>
              {x === 'all' ? t({ en: 'All work', fr: 'Tout' }) : t(CATS[x].title)}
              <span className="pill-n">{x === 'all' ? PHOTOS.length : PHOTOS.filter((p) => p.cats.includes(x)).length}</span>
            </button>
          ))}
        </div>

        <ul className="grid" aria-live="polite">
          {items.map((p, i) => (
            <li key={p.file} className={`g g-${i % 7}`}>
              <button type="button" onClick={() => onOpen(items, i)}>
                <Img p={p} sizes="(max-width: 699px) 50vw, (max-width: 1199px) 33vw, 28vw" />
                <span className="g-cap">
                  <span className="g-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="g-t">{t(p.title)}</span>
                  <span className="g-k">{t(KIND_LABEL[p.kind])}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="note">
          {t({
            en: 'Photographs are shown as taken, with light colour correction and cropping only.',
            fr: 'Les photographies sont présentées telles quelles, avec seulement une légère correction de couleur et un recadrage.',
          })}
        </p>
      </div>
    </section>
  );
}
