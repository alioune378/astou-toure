import { ED_CREDITS, ED_CREDIT_LINES, ED_FEATURE, ED_GALLERY, ED_PAGE, type Photo } from '../content';
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
          <Kicker n="03">{t({ en: 'Beyond the salon', fr: 'Au-delà du salon' })}</Kicker>
          <h2 id="ed-h" className="h2 ed-h">
            {t({ en: 'Hair beyond beauty.', fr: 'La coiffure au-delà de la beauté.' })}
            <br />
            <em>{t({ en: 'Art beyond convention.', fr: 'L’art au-delà des conventions.' })}</em>
          </h2>
          <p className="ed-sub">{t({ en: 'Editorial artistry & creative collaborations', fr: 'Créations éditoriales & collaborations' })}</p>
        </header>

        {/* ---------- Case study: the credited, published project ---------- */}
        <article className="case" aria-labelledby="case-h">
          <Reveal className="case-main">
            <button type="button" onClick={() => onOpen(evidence, 0)} aria-label={t({ en: 'Enlarge the credited editorial page', fr: 'Agrandir la page éditoriale créditée' })}>
              <Img p={ED_FEATURE} sizes="(max-width: 899px) 100vw, 46vw" />
            </button>
          </Reveal>
          <div className="case-copy">
            <p className="case-k">{t({ en: 'Published credit', fr: 'Crédit publié' })}</p>
            <h3 id="case-h" className="case-h">Fractal Affinities</h3>
            <p className="case-text">
              {t({
                en: 'For this published editorial, the artist Anna Craycroft designed four hairstyles, each drawn from a diagram of a scientific principle. Working alongside the creative team, Astou Touré was one of the hair artists who brought them to life on four models.',
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
                fr: 'Crédits retranscrits tels qu’imprimés sur la page. Crédit coiffure partagé avec Thomas Dunkin.',
              })}
            </p>
            <div className="case-docs">
              <button type="button" className="doc" onClick={() => onOpen(evidence, 1)}>
                <Img p={ED_CREDITS} sizes="96px" />
                <span>{t({ en: 'Read the printed credits', fr: 'Lire les crédits imprimés' })}</span>
              </button>
              <button type="button" className="doc" onClick={() => onOpen(evidence, 2)}>
                <Img p={ED_PAGE} sizes="96px" />
                <span>{t({ en: 'See the article page', fr: 'Voir la page de l’article' })}</span>
              </button>
            </div>
          </div>
        </article>

        {/* ---------- Editorial gallery ---------- */}
        <div className="edg-head">
          <p className="case-k">{t({ en: 'Editorial gallery', fr: 'Galerie éditoriale' })}</p>
          <p className="edg-lede">
            {t({
              en: 'From Astou’s editorial collaborations: sculpted volume, natural texture and graphic form in fashion and art imagery.',
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
        <p className="ed-foot">
          {t({
            en: 'Editorial images supplied by Astou Touré and shown as published. Hair on collaborative productions is credited jointly where printed. Publication details are being confirmed. These images show editorial work and are not examples of the salon’s bookable styles.',
            fr: 'Images éditoriales fournies par Astou Touré et présentées telles que publiées. Sur les productions collectives, la coiffure est créditée conjointement lorsque c’est imprimé. Les détails de publication sont en cours de confirmation. Ces images montrent un travail éditorial et ne sont pas des exemples des coiffures réservables au salon.',
          })}
        </p>
      </div>
    </section>
  );
}
