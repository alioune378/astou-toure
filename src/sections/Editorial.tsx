import { ED_CREDITS, ED_CREDIT_LINES, ED_FEATURE, ED_GALLERY, ED_PAGE, ED_CHAPTERS, type EdChapter, type Photo } from '../content';
import { useI18n } from '../i18n';
import { Img, Kicker, Reveal, goTo } from '../components/ui';

type Open = (items: Photo[], i: number) => void;

/**
 * 03 — Beyond the salon. Published editorial work, kept separate from the bookable specialties.
 * Only printed credits are stated; nothing about the publication or the people photographed is added.
 */
const SCULPTURAL_TITLE = { en: 'Sculptural hair artistry', es: 'Arte capilar escultural', fr: 'Coiffure sculpturale' };

export function Editorial({ onOpen }: { onOpen: Open }) {
  const { t } = useI18n();
  const evidence = [ED_FEATURE, ED_CREDITS, ED_PAGE];
  return (
    <section id="editorial" className="ed sec" aria-labelledby="ed-h">
      <div className="wrap">
        <header className="ed-head">
          <Kicker n="05">{t({ en: 'Editorial & legacy', es: 'Editorial y trayectoria', fr: 'Éditorial & parcours' })}</Kicker>
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

        <nav className="ed-index" aria-label={t({ en: 'Editorial chapters', es: 'Capítulos editoriales', fr: 'Chapitres éditoriaux' })}>
          <ol>
            <li>
              <button type="button" onClick={() => goTo('ed-sculptural')}>
                <span className="ed-index-n">01</span> {t(SCULPTURAL_TITLE)}
              </button>
            </li>
            {ED_CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <button type="button" onClick={() => goTo(`ed-${c.id}`)}>
                  <span className="ed-index-n">{String(i + 2).padStart(2, '0')}</span> {t(c.title)}
                  {c.items.length === 0 && <span className="ed-index-s">{t({ en: 'In preparation', es: 'En preparación', fr: 'En préparation' })}</span>}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ed-chap-head" id="ed-sculptural">
          <p className="ed-chap-n">01</p>
          <h3 className="ed-chap-h">{t(SCULPTURAL_TITLE)}</h3>
          <p className="ed-chap-t">
            {t({
              en: 'Hair treated as sculpture: volume, line and texture built for the camera.',
              es: 'El cabello tratado como escultura: volumen, línea y textura construidos para la cámara.',
              fr: 'La coiffure traitée comme une sculpture : volume, ligne et texture construits pour l’objectif.',
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
          <p className="case-k">{t({ en: 'Editorial gallery', es: 'Galería editorial', fr: 'Galerie éditoriale' })}</p>
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
        {/* ---------- Further chapters: shown with their images once approved, otherwise a neutral line ---------- */}
        {ED_CHAPTERS.map((c, i) => (
          <Chapter key={c.id} c={c} n={i + 2} onOpen={onOpen} />
        ))}

        <p className="ed-foot">
          {t({
            en: 'All images supplied by Astou Touré and shown with her authorization. Hair on collaborative productions is credited jointly where printed. Several images are digitally enhanced copies, not original prints or magazine scans. These images show editorial work and are not examples of the salon’s bookable styles.',
            es: 'Todas las imágenes fueron proporcionadas por Astou Touré y se muestran con su autorización. En las producciones colectivas, el peinado se acredita en conjunto cuando así aparece impreso. Varias imágenes son copias mejoradas digitalmente, no copias originales ni escaneos de revista. Estas imágenes muestran trabajo editorial y no son ejemplos de los estilos que se reservan en el salón.',
            fr: 'Toutes les images sont fournies par Astou Touré et présentées avec son autorisation. Sur les productions collectives, la coiffure est créditée conjointement lorsque la page l’indique. Plusieurs images sont des copies retouchées numériquement, et non des tirages originaux ou des scans de magazine. Ces images montrent un travail éditorial et ne sont pas des exemples des coiffures réservables au salon.',
          })}
        </p>
      </div>
    </section>
  );
}

function Chapter({ c, n, onOpen }: { c: EdChapter; n: number; onOpen: Open }) {
  const { t } = useI18n();
  const photos = c.items.map((x) => x.photo);
  return (
    <section className={`ed-chap ${c.items.length ? '' : 'is-pending'}`} id={`ed-${c.id}`} aria-labelledby={`ed-${c.id}-h`}>
      <div className="ed-chap-head">
        <p className="ed-chap-n">{String(n).padStart(2, '0')}</p>
        <h3 id={`ed-${c.id}-h`} className="ed-chap-h">
          {t(c.title)}
        </h3>
        <p className="ed-chap-t">{t(c.intro)}</p>
      </div>
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
    </section>
  );
}
