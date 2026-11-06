import { PRESS, photo, type CatId } from '../content';
import { useI18n } from '../i18n';
import { Img, goTo, openView } from '../components/ui';

/** Opening spread: a magazine cover. The wordmark is the masthead; Astou's work is the cover image. */
export function Cover(_: { onStyle?: (c: CatId) => void }) {
  const { t } = useI18n();
  // Hero: a real client's long braids with curved cornrows (owner's choice).
  const hero = photo('08');
  const lines: { label: { en: string; es: string; fr: string }; go: () => void }[] = [
    { label: { en: 'The Art of Astou', es: 'El arte de Astou', fr: 'L’art d’Astou' }, go: () => goTo('work') },
    { label: { en: 'Editorial & notable encounters', es: 'Editorial y encuentros notables', fr: 'Éditorial & rencontres' }, go: () => goTo('encounters') },
    { label: { en: 'Astou Boutique', es: 'Astou Boutique', fr: 'Astou Boutique' }, go: () => goTo('boutique') },
  ];
  return (
    <section id="top" className="cover" aria-labelledby="mast">
      <div className="cover-issue">
        <span>{t({ en: 'No. 01', es: 'N.º 01', fr: 'N° 01' })}</span>
        <span className="cover-issue-mid">{t({ en: 'The Art of Astou', es: 'El arte de Astou', fr: 'L’art d’Astou' })}</span>
        <span>New York</span>
      </div>

      <h1 id="mast" className="mast">
        <span className="mast-a">Astou</span>
        <span className="mast-b">Touré</span>
        <span className="sr-only"> — {t({ en: 'Hair as Art. Style as Identity. Hair artist, Bronx, New York.', es: 'El cabello como arte. El estilo como identidad. Artista del cabello, Bronx, Nueva York.', fr: 'La coiffure comme art. Le style comme identité. Artiste capillaire, Bronx, New York.' })}</span>
      </h1>

      <div className="cover-body">
        <figure className="cover-photo">
          <Img p={hero} sizes="(max-width: 899px) 100vw, 40vw" eager />
          <figcaption className="cover-cap">{t({ en: 'Long braids, drawn parts — on a client', es: 'Trenzas largas con rayas dibujadas, en una clienta', fr: 'Longues tresses, raies dessinées — sur une cliente' })}</figcaption>
          <p className="cover-overline" aria-hidden="true">
            <em>{t({ en: 'Hair', es: 'Cabello', fr: 'Coiffure' })}</em> {t({ en: 'as Art', es: 'como arte', fr: 'comme art' })}
          </p>
        </figure>

        <ol className="coverlines" aria-label={t({ en: 'In this issue', es: 'En esta edición', fr: 'Dans ce numéro' })}>
          {lines.map((l, i) => (
            <li key={i}>
              <button type="button" onClick={l.go}>
                <span className="cl-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="cl-t">{t(l.label)}</span>
              </button>
            </li>
          ))}
          <li className="cl-ed">
            <button type="button" onClick={() => goTo('in-print')}>
              <span className="cl-thumb" aria-hidden="true">
                <Img p={PRESS.cover} sizes="64px" />
              </span>
              <span className="cl-ed-t">
                <span className="cl-ed-k">{t({ en: 'In print · 2007–2008', es: 'En papel · 2007–2008', fr: 'Dans la presse · 2007–2008' })}</span>
                <span className="cl-t">Salon Digest</span>
              </span>
            </button>
          </li>
        </ol>

        <div className="cover-aside">
          <p className="cover-title">
            <em>{t({ en: 'Hair as Art.', es: 'El cabello como arte.', fr: 'La coiffure comme art.' })}</em>
            <br />
            {t({ en: 'Style as Identity.', es: 'El estilo como identidad.', fr: 'Le style comme identité.' })}
          </p>
          <p className="cover-sub">
            {t({
              en: 'Sculptural updos, intricate braids and occasion hair, shaped by a New York hair artist whose work has appeared in print.',
              es: 'Recogidos esculturales, trenzas minuciosas y peinados de ocasión, creados por una artista del cabello de Nueva York cuyo trabajo ha aparecido en revistas.',
              fr: 'Chignons sculpturaux, tresses minutieuses et coiffures de cérémonie, signés par une artiste capillaire new-yorkaise dont le travail a paru dans la presse.',
            })}
          </p>
          <div className="cover-ctas">
            <button type="button" className="btn btn-onyx" onClick={() => goTo('request')}>
              {t({ en: 'Book your experience', es: 'Reserva tu experiencia', fr: 'Réservez votre expérience' })}
            </button>
            <button type="button" className="btn btn-line" onClick={() => openView('portfolio')}>
              {t({ en: 'Explore her work', es: 'Descubre su trabajo', fr: 'Découvrir son travail' })}
            </button>
          </div>
          <p className="cover-sign">Astou Style &amp; Boutique</p>
        </div>
      </div>
    </section>
  );
}
