import { BIZ, CATS, STYLES, photo, type CatId, type Photo } from '../content';
import { useI18n } from '../i18n';
import { Icon, Img, Kicker, Reveal, goTo } from '../components/ui';

type Open = (items: Photo[], i: number) => void;
type Ask = (c: CatId) => void;

/** 01 — Signature Hair Artistry. Nappy and Boho lead; photographed categories follow as editorial features. */
export function Signature({ onOpen, onAsk }: { onOpen: Open; onAsk: Ask }) {
  const { t } = useI18n();
  return (
    <section id="signature" className="sig sec" aria-labelledby="sig-h">
      <div className="wrap">
        <header className="sec-head">
          <Kicker n="01">{t({ en: 'Specialties', es: 'Especialidades', fr: 'Spécialités' })}</Kicker>
          <h2 id="sig-h" className="h2">
            {t({ en: 'Signature', es: 'Arte capilar', fr: 'Art capillaire' })} <em>{t({ en: 'hair artistry', es: 'de autor', fr: 'signature' })}</em>
          </h2>
          <p className="lede">
            {t({
              en: 'Every style is made for one person. No menu of fixed looks, no fixed prices: tell Astou what you imagine, and she will tell you how she would build it.',
              es: 'Cada estilo se hace para una sola persona. Sin catálogo de looks ni precios fijos: cuéntale a Astou lo que imaginas y ella te dirá cómo lo construiría.',
              fr: 'Chaque coiffure est faite pour une seule personne. Pas de catalogue figé ni de prix fixes : dites à Astou ce que vous imaginez, elle vous dira comment elle le construirait.',
            })}
          </p>
        </header>
      </div>

      <div className="spec" id="nappy-boho">
        {(['nappy', 'boho'] as const).map((c, i) => (
          <Reveal key={c} as="article" className={`spec-panel spec-${c}`} delay={i * 120}>
            <p className="spec-n">0{i + 1}</p>
            <h3 className="spec-word">
              {c === 'nappy' ? 'Nappy' : t({ en: 'Boho', es: 'Boho', fr: 'Bohème' })}
              <span>.</span>
            </h3>
            <p className="spec-title">{t(CATS[c].title)}</p>
            <p className="spec-text">{t(CATS[c].text)}</p>
            <ul className="spec-how" aria-label={t({ en: 'How to request', es: 'Cómo pedirlo', fr: 'Comment demander' })}>
              <li>{t({ en: 'Describe your texture and length', es: 'Describe tu textura y tu largo', fr: 'Décrivez votre texture et votre longueur' })}</li>
              <li>{t({ en: 'Add an inspiration photo to your request', es: 'Agrega una foto de inspiración a tu solicitud', fr: 'Ajoutez une photo d’inspiration à votre demande' })}</li>
              <li>{t({ en: 'Receive a personalised quote', es: 'Recibe un presupuesto a tu medida', fr: 'Recevez un devis personnalisé' })}</li>
            </ul>
            <button type="button" className="btn btn-gold" onClick={() => onAsk(c)}>
              {t({ en: 'Request this style', es: 'Pedir este estilo', fr: 'Demander ce style' })}
            </button>
            <p className="spec-note">
              {c === 'boho'
                ? t({ en: 'See braids with soft curly ends in the videos below, or Astou’s latest work on', es: 'Mira trenzas con puntas rizadas en los videos de abajo, o los trabajos más recientes de Astou en', fr: 'Voyez des tresses aux pointes bouclées dans les vidéos plus bas, ou les dernières créations d’Astou sur' })
                : t({ en: 'Astou shares her latest natural-texture work on', es: 'Astou comparte sus trabajos más recientes de textura natural en', fr: 'Astou partage ses dernières créations sur cheveux naturels sur' })}{' '}
              <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
                {Icon.ig} Instagram
              </a>
              .
            </p>
          </Reveal>
        ))}
      </div>

      <div className="wrap feats">
        {(
          [
            ['sculptural', ['16'], 'a'],
            ['braiding', ['10'], 'b'],
            ['editorial', ['12'], 'c'],
          ] as [CatId, string[], string][]
        ).map(([c, ids, layout], i) => {
          // One small preview per specialty; the full set lives in the portfolio, grouped by hairstyle.
          const gallery = STYLES.filter((st) => st.photos[0].cats.includes(c)).flatMap((st) => st.photos);
          const nStyles = STYLES.filter((st) => st.photos[0].cats.includes(c)).length;
          const shown = ids.map(photo);
          return (
            <article key={c} id={`style-${c}`} className={`feat feat-${layout}`}>
              <Reveal className="feat-copy">
                <p className="feat-n">0{i + 3}</p>
                <h3 className="h3">{t(CATS[c].title)}</h3>
                <p className="feat-text">{t(CATS[c].text)}</p>
                <div className="feat-actions">
                  <button type="button" className="btn btn-onyx" onClick={() => onAsk(c)}>
                    {t({ en: 'Request this style', es: 'Pedir este estilo', fr: 'Demander ce style' })}
                  </button>
                  <button type="button" className="link-btn" onClick={() => onOpen(gallery, 0)}>
                    {t({ en: `View ${nStyles} creations`, es: `Ver ${nStyles} creaciones`, fr: `Voir ${nStyles} créations` })}
                  </button>
                </div>
              </Reveal>
              <div className="feat-imgs">
                {shown.map((p, k) => (
                  <Reveal key={p.id} className={`feat-img fi-${k}`} delay={k * 90}>
                    <button type="button" onClick={() => onOpen(gallery, gallery.indexOf(p))} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(p.title)}`}>
                      <Img p={p} sizes="(max-width: 899px) 40vw, 220px" />
                    </button>
                  </Reveal>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/** Black-and-gold typographic interlude around the manifesto line (no photographs, so no image repeats here). */
export function Atelier() {
  const { t } = useI18n();
  return (
    <section className="atelier atelier-type" aria-labelledby="atelier-q">
      <div className="atelier-in">
        <p className="atelier-k">{t({ en: 'The atelier', es: 'El taller', fr: 'L’atelier' })}</p>
        <blockquote id="atelier-q" className="atelier-q">
          {t({
            en: '“Where hair becomes an expression of individuality, beauty, and artistry.”',
            es: '“Donde el cabello se convierte en expresión de personalidad, belleza y arte.”',
            fr: '« Là où la coiffure devient une expression de beauté, de personnalité et d’art. »',
          })}
        </blockquote>
        <p className="atelier-sign" aria-hidden="true">
          Astou
        </p>
        <button type="button" className="btn btn-line atelier-btn" onClick={() => goTo('motion')}>
          {t({ en: 'Watch the work in motion', es: 'Ver el trabajo en movimiento', fr: 'Voir le travail en mouvement' })}
        </button>
      </div>
    </section>
  );
}
