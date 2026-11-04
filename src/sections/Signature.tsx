import { BIZ, CATS, PHOTOS, photo, type CatId, type Photo } from '../content';
import { useI18n } from '../i18n';
import { Icon, Img, Kicker, Reveal } from '../components/ui';

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
              {t({ en: 'Dedicated photographs of this specialty are being prepared. Astou shares her latest work on', es: 'Se están preparando fotografías de esta especialidad. Astou comparte sus trabajos más recientes en', fr: 'Des photographies dédiées à cette spécialité sont en préparation. Astou partage ses dernières créations sur' })}{' '}
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
            ['sculptural', ['07', '15', '03'], 'a'],
            ['braiding', ['08', '10', '09'], 'b'],
            ['editorial', ['13', '12', '11'], 'c'],
          ] as [CatId, string[], string][]
        ).map(([c, ids, layout], i) => {
          const gallery = PHOTOS.filter((p) => p.cats.includes(c));
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
                    {t({ en: 'View the gallery', es: 'Ver la galería', fr: 'Voir la galerie' })} <span className="mono-n">({gallery.length})</span>
                  </button>
                </div>
              </Reveal>
              <div className="feat-imgs">
                {shown.map((p, k) => (
                  <Reveal key={p.id} className={`feat-img fi-${k}`} delay={k * 90}>
                    <button type="button" onClick={() => onOpen(gallery, gallery.indexOf(p))} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(p.title)}`}>
                      <Img p={p} sizes={k === 0 ? '(max-width: 899px) 90vw, 34vw' : '(max-width: 899px) 45vw, 17vw'} />
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

/** Cinematic black-and-gold interlude: a photographic collage around the manifesto line. */
export function Atelier({ onOpen }: { onOpen: Open }) {
  const { t } = useI18n();
  const set = [photo('15'), photo('02'), photo('12'), photo('19')];
  return (
    <section className="atelier" aria-labelledby="atelier-q">
      <div className="atelier-in">
        <p className="atelier-k">{t({ en: 'The atelier', es: 'El taller', fr: 'L’atelier' })}</p>
        <blockquote id="atelier-q" className="atelier-q">
          {t({
            en: '“Where hair becomes an expression of individuality, beauty, and artistry.”',
            es: '“Donde el cabello se convierte en expresión de personalidad, belleza y arte.”',
            fr: '« Là où la coiffure devient une expression de beauté, de personnalité et d’art. »',
          })}
        </blockquote>
        <div className="collage">
          {set.map((p, i) => (
            <Reveal key={p.id} className={`cl cl-${i}`} delay={i * 110}>
              <button type="button" onClick={() => onOpen(set, i)} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(p.title)}`}>
                <Img p={p} sizes={i === 0 ? '(max-width: 899px) 70vw, 36vw' : '(max-width: 899px) 40vw, 20vw'} />
              </button>
            </Reveal>
          ))}
          <p className="collage-word" aria-hidden="true">
            Astou
          </p>
        </div>
      </div>
    </section>
  );
}
