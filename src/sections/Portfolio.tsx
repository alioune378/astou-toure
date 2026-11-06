import { useEffect, useMemo, useState } from 'react';
import { KIND_LABEL, STYLES, type CatId, type Photo, type Style } from '../content';
import { useI18n, type L } from '../i18n';
import { Img, Kicker, goTo, openView } from '../components/ui';

type F = 'all' | 'braiding' | 'sculptural' | 'editorial';
const FILTERS: F[] = ['all', 'sculptural', 'editorial', 'braiding'];
const FILTER_LABEL: Record<Exclude<F, 'all'>, L> = {
  sculptural: { en: 'Sculptural Hair Art', es: 'Arte capilar escultural', fr: 'Art capillaire sculptural' },
  braiding: { en: 'Braids & Protective Styling', es: 'Trenzas y peinados protectores', fr: 'Tresses & coiffures protectrices' },
  editorial: { en: 'Bridal & Special Occasions', es: 'Novias y ocasiones especiales', fr: 'Mariage & grandes occasions' },
};
const FILTER_TEXT: Record<Exclude<F, 'all'>, L> = {
  sculptural: {
    en: 'Braids built into crowns, rolls, loops and knots. Many are sculptural studies on mannequin heads, labelled as such.',
    es: 'Trenzas convertidas en coronas, rollos, lazos y nudos. Muchos son estudios esculturales en cabezas de maniquí, indicados como tales.',
    fr: 'Des tresses construites en couronnes, rouleaux, boucles et nœuds. Beaucoup sont des études sculpturales sur têtes d’exposition, indiquées comme telles.',
  },
  braiding: {
    en: 'Box braids, cornrows, patterned parts and braided units: protective styles drawn for each face and lifestyle. Client work and mannequin studies are labelled.',
    es: 'Box braids, trenzas pegadas, rayas con diseño y unidades trenzadas: peinados protectores pensados para cada cara y estilo de vida. Se indica qué es trabajo en clientas y qué son estudios en maniquí.',
    fr: 'Box braids, nattes collées, raies dessinées et perruques tressées : des coiffures protectrices pensées pour chaque visage et chaque quotidien. Coiffures de clientes et études sur tête d’exposition sont indiquées.',
  },
  editorial: {
    en: 'Polished updos and chignons, some finished with hair ornaments, for weddings, celebrations and events. Shown as styles, not as records of specific weddings.',
    es: 'Recogidos y moños pulidos, algunos con adornos para el cabello, para bodas, fiestas y eventos. Se muestran como estilos, no como registros de bodas concretas.',
    fr: 'Chignons et coiffures soignées, parfois ornés de bijoux de tête, pour les mariages, les fêtes et les événements. Présentés comme des styles, non comme des souvenirs de mariages précis.',
  },
};

/** 03 — Portfolio: one entry per hairstyle (its other views open with it), filterable, full screen. */
export function Portfolio({ onOpen, onAsk }: { onOpen: (items: Photo[], i: number) => void; onAsk: (cat: CatId, look: L) => void }) {
  const { t } = useI18n();
  const [f, setF] = useState<F>('all');
  const [all, setAll] = useState(false);
  // The homepage links straight to a collection ("cat-sculptural" …).
  useEffect(() => {
    const on = (e: Event) => {
      const v = (e as CustomEvent<string>).detail as F;
      if (FILTERS.includes(v)) setF(v);
    };
    window.addEventListener('astou:filter', on);
    return () => window.removeEventListener('astou:filter', on);
  }, []);
  const inCat = (st: Style, c: F) => c === 'all' || st.photos[0].cats.includes(c);
  const styles = useMemo(() => STYLES.filter((st) => inCat(st, f)), [f]);
  const flat = useMemo(() => styles.flatMap((st) => st.photos), [styles]);
  const nPhotos = flat.length;
  return (
    <section id="portfolio" className="pf sec" aria-labelledby="pf-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="01">{t({ en: 'Collections', es: 'Colecciones', fr: 'Collections' })}</Kicker>
            <h2 id="pf-h" className="h3">
              {t({ en: 'Every creation,', es: 'Cada creación,', fr: 'Chaque création,' })} <em>{t({ en: 'up close', es: 'de cerca', fr: 'de près' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Client work and sculptural studies on mannequin heads, each labelled. Open a creation to see every view of it full screen.',
              es: 'Trabajos en clientas y estudios esculturales en cabezas de maniquí, cada uno indicado. Abre una creación para ver todas sus vistas en pantalla completa.',
              fr: 'Coiffures de clientes et études sculpturales sur têtes d’exposition, chacune indiquée. Ouvrez une création pour en voir toutes les vues en plein écran.',
            })}
          </p>
        </header>

        <div className="pills" role="group" aria-label={t({ en: 'Filter by style', es: 'Filtrar por estilo', fr: 'Filtrer par style' })}>
          {FILTERS.map((x) => (
            <button key={x} id={`cat-${x}`} type="button" aria-pressed={f === x} className={f === x ? 'is-on' : ''} onClick={() => setF(x)}>
              {x === 'all' ? t({ en: 'All creations', es: 'Todas las creaciones', fr: 'Toutes les créations' }) : t(FILTER_LABEL[x])}
              <span className="pill-n">{STYLES.filter((st) => inCat(st, x)).length}</span>
            </button>
          ))}
          <button type="button" onClick={() => openView('editorial')}>
            {t({ en: 'Editorial & Fashion', es: 'Editorial y moda', fr: 'Éditorial & mode' })} →
          </button>
        </div>
        {f !== 'all' && (
          <div className="pf-cat">
            <p>{t(FILTER_TEXT[f])}</p>
            <button type="button" className="btn btn-onyx btn-sm" onClick={() => onAsk(f, FILTER_LABEL[f])}>
              {t({ en: 'Request this style', es: 'Pedir este estilo', fr: 'Demander ce style' })}
            </button>
          </div>
        )}
        <p className="pf-also">
          {t({ en: 'Also:', es: 'También:', fr: 'Aussi :' })}{' '}
          <button type="button" onClick={() => goTo('nappy-boho')}>{t({ en: 'Nappy & natural texture', es: 'Nappy y textura natural', fr: 'Nappy & texture naturelle' })}</button>
          {' · '}
          <button type="button" onClick={() => goTo('nappy-boho')}>{t({ en: 'Boho braids', es: 'Trenzas boho', fr: 'Tresses bohèmes' })}</button>
          {' · '}
          <button type="button" onClick={() => goTo('editorial')}>{t({ en: 'Fashion & editorial work', es: 'Moda y trabajo editorial', fr: 'Mode & travail éditorial' })}</button>
        </p>
        <p className="pf-count">
          {t({
            en: `${styles.length} creations · ${nPhotos} photographs`,
            es: `${styles.length} creaciones · ${nPhotos} fotografías`,
            fr: `${styles.length} créations · ${nPhotos} photographies`,
          })}
        </p>

        <ul className={`grid ${all || styles.length <= 8 ? 'is-all' : ''}`} id="pf-grid" aria-live="polite">
          {styles.map((st, i) => {
            const p = st.photos[0];
            return (
              <li key={st.id} className={`g g-${i % 7}`}>
                <button type="button" onClick={() => onOpen(flat, flat.indexOf(p))}>
                  <Img p={p} sizes="(max-width: 699px) 50vw, (max-width: 1199px) 33vw, 28vw" />
                  <span className="g-cap">
                    <span className="g-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="g-t">{t(st.title)}</span>
                    <span className="g-k">
                      {t(KIND_LABEL[p.kind])}
                      {st.photos.length > 1 && ` · ${st.photos.length} ${t({ en: 'views', es: 'vistas', fr: 'vues' })}`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {!all && styles.length > 8 && (
          <button type="button" className="btn btn-line pf-more" aria-controls="pf-grid" onClick={() => setAll(true)}>
            {t({ en: `Show all ${styles.length} creations`, es: `Ver las ${styles.length} creaciones`, fr: `Voir les ${styles.length} créations` })}
          </button>
        )}
        <p className="note">
          {t({
            en: 'Real styles by Astou. Edits are limited to colour, light, sharpness and cropping; no hair, faces or details are generated.',
            es: 'Estilos reales de Astou. Solo se ajustaron color, luz, nitidez y encuadre; no se generó ningún cabello, rostro ni detalle.',
            fr: 'De vraies coiffures signées Astou. Seuls la couleur, la lumière, la netteté et le cadrage ont été retouchés ; aucun cheveu, visage ni détail n’a été généré.',
          })}
        </p>
      </div>
    </section>
  );
}
