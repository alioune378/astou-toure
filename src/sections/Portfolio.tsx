import { useMemo, useState } from 'react';
import { KIND_LABEL, STYLES, type Photo, type Style } from '../content';
import { useI18n, type L } from '../i18n';
import { Img, Kicker } from '../components/ui';

type F = 'all' | 'braiding' | 'sculptural' | 'editorial';
const FILTERS: F[] = ['all', 'braiding', 'sculptural', 'editorial'];
const FILTER_LABEL: Record<Exclude<F, 'all'>, L> = {
  braiding: { en: 'Braids & protective styles', es: 'Trenzas y peinados protectores', fr: 'Tresses & coiffures protectrices' },
  sculptural: { en: 'Sculptural updos', es: 'Recogidos esculturales', fr: 'Chignons sculpturaux' },
  editorial: { en: 'Special occasions', es: 'Ocasiones especiales', fr: 'Grandes occasions' },
};

/** 03 — Portfolio: one entry per hairstyle (its other views open with it), filterable, full screen. */
export function Portfolio({ onOpen }: { onOpen: (items: Photo[], i: number) => void }) {
  const { t } = useI18n();
  const [f, setF] = useState<F>('all');
  const [all, setAll] = useState(false);
  const inCat = (st: Style, c: F) => c === 'all' || st.photos[0].cats.includes(c);
  const styles = useMemo(() => STYLES.filter((st) => inCat(st, f)), [f]);
  const flat = useMemo(() => styles.flatMap((st) => st.photos), [styles]);
  const nPhotos = flat.length;
  return (
    <section id="portfolio" className="pf sec" aria-labelledby="pf-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="03">{t({ en: 'Portfolio', es: 'Portafolio', fr: 'Portfolio' })}</Kicker>
            <h2 id="pf-h" className="h2">
              {t({ en: 'The work,', es: 'El trabajo,', fr: 'Le travail,' })} <em>{t({ en: 'up close', es: 'de cerca', fr: 'de près' })}</em>
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
            <button key={x} type="button" aria-pressed={f === x} className={f === x ? 'is-on' : ''} onClick={() => setF(x)}>
              {x === 'all' ? t({ en: 'All creations', es: 'Todas las creaciones', fr: 'Toutes les créations' }) : t(FILTER_LABEL[x])}
              <span className="pill-n">{STYLES.filter((st) => inCat(st, x)).length}</span>
            </button>
          ))}
        </div>
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
