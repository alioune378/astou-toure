import { ED_CREDITS, ED_CREDIT_LINES, ED_FEATURE, ED_GALLERY, ED_PAGE, ED_SCULPTURAL, ENCOUNTERS, type Photo } from '../content';
import { useI18n } from '../i18n';
import { Img, Kicker, Reveal } from '../components/ui';

type Open = (items: Photo[], i: number) => void;

/**
 * 03 — Beyond the salon. Published editorial work, kept separate from the bookable specialties.
 * Only printed credits are stated; nothing about the publication or the people photographed is added.
 */
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
        {/* ---------- Feature: sculptural beauty (same credited shoot) ---------- */}
        <figure className="ed-feat">
          <Reveal className="ed-feat-img">
            <button type="button" onClick={() => onOpen([ED_SCULPTURAL], 0)} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(ED_SCULPTURAL.title)}`}>
              <Img p={ED_SCULPTURAL} sizes="(max-width: 899px) 100vw, 44vw" />
            </button>
          </Reveal>
          <figcaption className="ed-feat-cap">
            <p className="case-k">{t({ en: 'Editorial hair artistry', es: 'Arte capilar editorial', fr: 'Coiffure éditoriale' })}</p>
            <p className="ed-feat-h">{t(ED_SCULPTURAL.title)}</p>
            <p className="ed-feat-q">
              {t({
                en: '“Bold textures and dramatic silhouettes reveal the expressive possibilities of hair.”',
                es: '“Texturas audaces y siluetas dramáticas que revelan todo lo que el cabello puede expresar.”',
                fr: '« Des textures audacieuses et des silhouettes spectaculaires révèlent tout ce que la coiffure peut exprimer. »',
              })}
            </p>
            <p className="ed-feat-note">
              {t({
                en: 'From the same editorial shoot as the credited page above.',
                es: 'De la misma sesión editorial que la página con créditos de arriba.',
                fr: 'Issue de la même séance éditoriale que la page créditée ci-dessus.',
              })}
            </p>
          </figcaption>
        </figure>

        {/* ---------- Notable encounters: renders only once Astou has confirmed each photograph ---------- */}
        {ENCOUNTERS.length > 0 && (
          <div className="enc" aria-labelledby="enc-h">
            <p className="case-k" id="enc-h">
              {t({ en: 'Memorable encounters', es: 'Encuentros memorables', fr: 'Rencontres marquantes' })}
            </p>
            <ul className="enc-list">
              {ENCOUNTERS.map((e, i) => (
                <li key={e.photo.file}>
                  <button type="button" onClick={() => onOpen(ENCOUNTERS.map((x) => x.photo), i)}>
                    <Img p={e.photo} sizes="(max-width: 899px) 100vw, 44vw" />
                  </button>
                  <p className="ed-feat-h">{t(e.title)}</p>
                  <p className="edg-lede">{t(e.caption)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="ed-foot">
          {t({
            en: 'Editorial images supplied by Astou Touré and shown as published. Hair on collaborative productions is credited jointly where printed. Publication details are being confirmed. These images show editorial work and are not examples of the salon’s bookable styles.',
            es: 'Imágenes editoriales proporcionadas por Astou Touré y mostradas tal como se publicaron. En las producciones colectivas, el peinado se acredita en conjunto cuando así aparece impreso. Los datos de la publicación se están confirmando. Estas imágenes muestran trabajo editorial y no son ejemplos de los estilos que se reservan en el salón.',
            fr: 'Images éditoriales fournies par Astou Touré et présentées telles que publiées. Sur les productions collectives, la coiffure est créditée conjointement lorsque la page l’indique. Les détails de publication sont en cours de confirmation. Ces images montrent un travail éditorial et ne sont pas des exemples des coiffures réservables au salon.',
          })}
        </p>
      </div>
    </section>
  );
}
