import { ED_CREDITS, ED_CREDIT_LINES, ED_FEATURE, ED_GALLERY, ED_PAGE, ED_CHAPTERS, ED_STATUS, type EdChapter, type Photo } from '../content';
import { useI18n } from '../i18n';
import { Img, Kicker, Reveal, goTo } from '../components/ui';

type Open = (items: Photo[], i: number) => void;

/**
 * 03 — Beyond the salon. Published editorial work, kept separate from the bookable specialties.
 * Published credits are stated as printed; family-supplied information is labelled as such.
 */
const GARAGE_TITLE = { en: 'Garage Magazine', es: 'Garage Magazine', fr: 'Garage Magazine' };
const GARAGE_SUB = { en: 'The editorial work', es: 'El trabajo editorial', fr: 'Le travail éditorial' };
/** Collections after Garage. The Garage collection is the credited case study plus its extra images (the 'garage' entry). */
const OTHERS = ED_CHAPTERS.filter((c) => c.id !== 'garage');
const GARAGE = ED_CHAPTERS.find((c) => c.id === 'garage');

export function Editorial({ onOpen }: { onOpen: Open }) {
  const { t } = useI18n();
  const evidence = [ED_FEATURE, ED_CREDITS, ED_PAGE];
  return (
    <section id="editorial" className="ed sec" aria-labelledby="ed-h">
      <div className="wrap">
        <header className="ed-head">
          <Kicker n="02">{t({ en: 'Editorial & legacy', es: 'Editorial y trayectoria', fr: 'Éditorial & parcours' })}</Kicker>
          <h2 id="ed-h" className="h2 ed-h">
            {t({ en: 'Beyond the salon.', es: 'Más allá del salón.', fr: 'Au-delà du salon.' })}
            <br />
            <em>{t({ en: 'Into the world of fashion.', es: 'Hacia el mundo de la moda.', fr: 'Dans l’univers de la mode.' })}</em>
          </h2>
          <p className="ed-sub">
            {t({
              en: 'An artistic journey through hair, culture and fashion.',
              es: 'Un recorrido artístico por el cabello, la cultura y la moda.',
              fr: 'Un parcours artistique entre coiffure, culture et mode.',
            })}
          </p>
        </header>

        <nav className="ed-index" id="ed-index" aria-label={t({ en: 'Editorial chapters', es: 'Capítulos editoriales', fr: 'Chapitres éditoriaux' })}>
          <ol>
            <li>
              <button type="button" onClick={() => goTo('ed-garage')}>
                <span className="ed-index-img" aria-hidden="true">
                  <Img p={ED_FEATURE} sizes="(max-width: 899px) 30vw, 22vw" />
                </span>
                <span className="ed-index-n">01</span> {t(GARAGE_TITLE)}
                <span className="ed-index-s">{t(GARAGE_SUB)}</span>
              </button>
            </li>
            {OTHERS.map((c, i) => (
              <li key={c.id}>
                <button type="button" onClick={() => goTo(`ed-${c.id}`)}>
                  {c.items[0] && (
                    <span className="ed-index-img" aria-hidden="true">
                      <Img p={c.items[0].photo} sizes="(max-width: 899px) 30vw, 22vw" />
                    </span>
                  )}
                  <span className="ed-index-n">{String(i + 2).padStart(2, '0')}</span> {t(c.title)}
                  {c.sub && <span className="ed-index-s">{t(c.sub)}</span>}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ed-chap-head" id="ed-garage">
          <p className="ed-chap-n">01</p>
          <h3 className="ed-chap-h">
            {t(GARAGE_TITLE)}
            <span className="ed-chap-sub">{t(GARAGE_SUB)}</span>
          </h3>
          <p className="ed-chap-t">
            {t({
              en: 'Spring/Summer 2012. One editorial, “Fractal Affinities”: four hairstyles drawn from scientific diagrams, sculpted for the camera.',
              es: 'Primavera/verano 2012. Un editorial, “Fractal Affinities”: cuatro peinados inspirados en diagramas científicos, esculpidos para la cámara.',
              fr: 'Printemps-été 2012. Un éditorial, « Fractal Affinities » : quatre coiffures tirées de diagrammes scientifiques, sculptées pour l’objectif.',
            })}
          </p>
        </div>

        {/* ---------- Case study: the credited, published project ---------- */}
        <article className="case" aria-labelledby="case-h">
          <Reveal className="case-main">
            <button type="button" onClick={() => onOpen(evidence, 0)} aria-label={t({ en: 'Enlarge the credited editorial page', es: 'Ampliar la página editorial con créditos', fr: 'Agrandir la page éditoriale créditée' })}>
              <Img p={ED_FEATURE} sizes="(max-width: 899px) 100vw, 46vw" />
            </button>
          </Reveal>
          <div className="case-copy">
            <p className="case-k">{t({ en: 'Published credit', es: 'Crédito publicado', fr: 'Crédit publié' })}</p>
            <p className="enc-status is-credited">{t(ED_STATUS.credited)}</p>
            <h3 id="case-h" className="case-h">Fractal Affinities</h3>
            <p className="case-text">
              {t({
                en: 'For this published editorial, the artist Anna Craycroft designed four hairstyles, each drawn from a diagram of a scientific principle. Working alongside the creative team, Astou Touré was one of the hair artists who brought them to life on four models.',
                es: 'Para este editorial publicado, la artista Anna Craycroft diseñó cuatro peinados, cada uno inspirado en el diagrama de un principio científico. Junto al equipo creativo, Astou Touré fue una de las estilistas que les dio vida en cuatro modelos.',
                fr: 'Pour cet éditorial publié, l’artiste Anna Craycroft a conçu quatre coiffures, chacune tirée du diagramme d’un principe scientifique. Aux côtés de l’équipe créative, Astou Touré fait partie des coiffeurs qui leur ont donné vie sur quatre mannequins.',
              })}
            </p>
            <dl className="credits">
              {ED_CREDIT_LINES.map(([k, v]) => (
                <div key={k} className={k === 'Hair' ? 'is-hair' : ''}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="case-note">
              {t({
                en: 'Credits transcribed as printed on the page. Hair credit shared with Thomas Dunkin.',
                es: 'Créditos transcritos tal como aparecen impresos. Crédito de peinado compartido con Thomas Dunkin.',
                fr: 'Crédits retranscrits tels qu’imprimés sur la page. Crédit coiffure partagé avec Thomas Dunkin.',
              })}
            </p>
            <div className="case-docs">
              <button type="button" className="doc" onClick={() => onOpen(evidence, 1)}>
                <Img p={ED_CREDITS} sizes="96px" />
                <span>{t({ en: 'Read the printed credits', es: 'Leer los créditos impresos', fr: 'Lire les crédits imprimés' })}</span>
              </button>
              <button type="button" className="doc" onClick={() => onOpen(evidence, 2)}>
                <Img p={ED_PAGE} sizes="96px" />
                <span>{t({ en: 'See the article page', es: 'Ver la página del artículo', fr: 'Voir la page de l’article' })}</span>
              </button>
            </div>
          </div>
        </article>

        {/* ---------- Editorial gallery ---------- */}
        <div className="edg-head">
          <p className="case-k">{t({ en: 'From the editorial', es: 'Del editorial', fr: 'Extraits de l’éditorial' })}</p>
          <p className="edg-lede">
            {t({
              en: 'From Astou’s editorial collaborations: sculpted volume, natural texture and graphic form in fashion and art imagery.',
              es: 'De las colaboraciones editoriales de Astou: volumen esculpido, textura natural y forma gráfica en imágenes de moda y arte.',
              fr: 'Issues des collaborations éditoriales d’Astou : volume sculpté, texture naturelle et forme graphique dans l’image de mode et d’art.',
            })}
          </p>
        </div>
        <ul className="edg">
          {ED_GALLERY.map((p, i) => (
            <Reveal as="li" key={p.file} className={`edg-i edg-${i}`} delay={(i % 3) * 90}>
              <button type="button" onClick={() => onOpen(ED_GALLERY, i)}>
                <Img p={p} sizes={i === 0 ? '(max-width: 899px) 100vw, 40vw' : '(max-width: 899px) 50vw, 26vw'} />
                <span className="edg-cap">
                  <span className="edg-n">{String(i + 1).padStart(2, '0')}</span>
                  <span>{t(p.title)}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
        {/* ---------- More images from the same Garage editorial (same assignment, not a second credit) ---------- */}
        {GARAGE && <Chapter c={GARAGE} n={0} onOpen={onOpen} inline />}

        {/* ---------- Further collections ---------- */}
        {OTHERS.map((c, i) => (
          <Chapter key={c.id} c={c} n={i + 2} onOpen={onOpen} />
        ))}

        <p className="ed-foot">
          {t({
            en: 'All images supplied by Astou Touré and shown with her authorization. Hair on collaborative productions is credited jointly where printed. The images in this section are digitally enhanced copies, not original prints or magazine scans; originals or faithful restorations will replace them where available. These images show editorial work and are not examples of the salon’s bookable styles.',
            es: 'Todas las imágenes fueron proporcionadas por Astou Touré y se muestran con su autorización. En las producciones colectivas, el peinado se acredita en conjunto cuando así aparece impreso. Las imágenes de esta sección son copias mejoradas digitalmente, no copias originales ni escaneos de revista; se reemplazarán por originales o restauraciones fieles cuando estén disponibles. Estas imágenes muestran trabajo editorial y no son ejemplos de los estilos que se reservan en el salón.',
            fr: 'Toutes les images sont fournies par Astou Touré et présentées avec son autorisation. Sur les productions collectives, la coiffure est créditée conjointement lorsque la page l’indique. Les images de cette section sont des copies retouchées numériquement, et non des tirages originaux ou des scans de magazine ; elles seront remplacées par les originaux ou des restaurations fidèles dès que possible. Ces images montrent un travail éditorial et ne sont pas des exemples des coiffures réservables au salon.',
          })}
        </p>
      </div>
    </section>
  );
}

function Chapter({ c, n, onOpen, inline }: { c: EdChapter; n: number; onOpen: Open; inline?: boolean }) {
  const { t } = useI18n();
  const photos = c.items.map((x) => x.photo);
  return (
    <section className={`ed-chap ${c.items.length ? '' : 'is-pending'} ${inline ? 'is-inline' : ''}`} id={inline ? undefined : `ed-${c.id}`} aria-labelledby={`ed-${c.id}-h`}>
      {inline ? (
        <div className="edg-head">
          <p className="case-k" id={`ed-${c.id}-h`}>
            {t(c.title)}
          </p>
          <p className="edg-lede">{t(c.intro)}</p>
        </div>
      ) : (
        <div className="ed-chap-head">
          <p className="ed-chap-n">{String(n).padStart(2, '0')}</p>
          <h3 id={`ed-${c.id}-h`} className="ed-chap-h">
            {t(c.title)}
            {c.sub && <span className="ed-chap-sub">{t(c.sub)}</span>}
          </h3>
          <p className="ed-chap-t">{t(c.intro)}</p>
          {c.status && <p className={`enc-status is-${c.status}`}>{t(ED_STATUS[c.status])}</p>}
        </div>
      )}
      {c.items.length ? (
        <ul className={`ed-items ed-items-${Math.min(c.items.length, 3)} ed-items-${c.id}`}>
          {c.items.map((it, i) => (
            <Reveal as="li" key={it.photo.file} delay={(i % 3) * 90}>
              <button type="button" onClick={() => onOpen(photos, i)} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(it.photo.title)}`}>
                {/* Shown in each photograph's own proportions, so nothing important is cropped. */}
                <Img p={it.photo} sizes="(max-width: 899px) 100vw, 40vw" style={{ aspectRatio: `${it.photo.w} / ${it.photo.h}` }} />
              </button>
              <p className="ed-item-h">{t(it.photo.title)}</p>
              {it.who && <p className="ed-item-who">{t(it.who)}</p>}
              <p className="ed-item-c">{t(it.caption)}</p>
              {it.credit && <p className="ed-item-cr">{t(it.credit)}</p>}
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="ed-pending">{t(c.pending)}</p>
      )}
      {c.credits && (
        <dl className="credits ed-chap-credits">
          {c.credits.map(([k, v]) => (
            <div key={v} className={v.startsWith('Astou') ? 'is-hair' : ''}>
              <dt>{t(k)}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {c.note && <p className="ed-chap-note">{t(c.note)}</p>}
      {!inline && (
        <button type="button" className="ed-back" onClick={() => goTo('ed-index')}>
          ↑ {t({ en: 'All collections', es: 'Todas las colecciones', fr: 'Toutes les collections' })}
        </button>
      )}
    </section>
  );
}
