import { CATS, ED_GALLERY, photo, type CatId } from '../content';
import { useI18n } from '../i18n';
import { NAV } from '../components/Chrome';
import { Img, goTo } from '../components/ui';

/** Opening spread: a magazine cover. The wordmark is the masthead; Astou's work is the cover image. */
export function Cover({ onStyle }: { onStyle: (c: CatId) => void }) {
  const { t } = useI18n();
  // Hero: a real client's braided crown. The small inset previews the sculptural studies.
  const hero = photo('07');
  const second = photo('13');
  const lines: CatId[] = ['nappy', 'boho', 'sculptural'];
  return (
    <section id="top" className="cover" aria-labelledby="mast">
      <div className="cover-issue">
        <span>{t({ en: 'No. 01', es: 'N.º 01', fr: 'N° 01' })}</span>
        <span className="cover-issue-mid">{t({ en: 'The Art of Hair', es: 'El arte del cabello', fr: 'L’art de la coiffure' })}</span>
        <span>New York</span>
      </div>

      <h1 id="mast" className="mast">
        <span className="mast-a">Astou</span>
        <span className="mast-b">Touré</span>
        <span className="sr-only"> — {t({ en: 'The Art of Hair. Hair artist and braider, Bronx, New York.', es: 'El arte del cabello. Artista del cabello y trenzadora en el Bronx, Nueva York.', fr: 'L’art de la coiffure. Coiffeuse et tresseuse, Bronx, New York.' })}</span>
      </h1>

      <div className="cover-body">
        <figure className="cover-photo">
          <Img p={hero} sizes="(max-width: 899px) 100vw, 40vw" eager />
          <figcaption className="cover-cap">{t({ en: 'Braided crown — on a client', es: 'Corona trenzada, en una clienta', fr: 'Couronne tressée — sur une cliente' })}</figcaption>
          <p className="cover-overline" aria-hidden="true">
            <em>{t({ en: 'The Art', es: 'El arte', fr: 'L’art' })}</em> {t({ en: 'of Hair', es: 'del cabello', fr: 'de la coiffure' })}
          </p>
        </figure>

        <ol className="coverlines" aria-label={t({ en: 'Specialties', es: 'Especialidades', fr: 'Spécialités' })}>
          {lines.map((c, i) => (
            <li key={c}>
              <button type="button" onClick={() => onStyle(c)}>
                <span className="cl-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="cl-t">{t(CATS[c].title)}</span>
              </button>
            </li>
          ))}
          <li className="cl-ed">
            <button type="button" onClick={() => goTo('editorial')}>
              <span className="cl-thumb" aria-hidden="true">
                <Img p={ED_GALLERY[1]} sizes="64px" />
              </span>
              <span className="cl-ed-t">
                <span className="cl-ed-k">{t({ en: 'Beyond the salon', es: 'Más allá del salón', fr: 'Au-delà du salon' })}</span>
                <span className="cl-t">{t({ en: 'Into the world of fashion', es: 'Hacia el mundo de la moda', fr: 'Dans l’univers de la mode' })}</span>
              </span>
            </button>
          </li>
        </ol>

        <div className="cover-aside">
          <p className="cover-title">
            <em>{t({ en: 'The Art', es: 'El arte', fr: 'L’art' })}</em>
            <br />
            {t({ en: 'of Hair', es: 'del cabello', fr: 'de la coiffure' })}
          </p>
          <p className="cover-motto">
            {t({ en: 'Your beauty. Her signature.', es: 'Tu belleza. Su firma.', fr: 'Votre beauté. Sa signature.' })}
          </p>
          <p className="cover-sub">
            {t({
              en: 'Hair is her art: intricate braids, elegant protective styles, sculptural updos and creative beauty rooted in culture and personal expression.',
              es: 'El cabello es su arte: trenzas minuciosas, peinados protectores elegantes, recogidos esculturales y una belleza creativa con raíces en la cultura y la expresión personal.',
              fr: 'La coiffure est son art : tresses minutieuses, coiffures protectrices élégantes, chignons sculpturaux et une beauté créative ancrée dans la culture et l’expression personnelle.',
            })}
          </p>
          <div className="cover-ctas">
            <button type="button" className="btn btn-onyx" onClick={() => goTo('request')}>
              {t({ en: 'Book your experience', es: 'Reserva tu experiencia', fr: 'Réservez votre expérience' })}
            </button>
            <button type="button" className="btn btn-line" onClick={() => goTo('looks')}>
              {t({ en: 'Explore her work', es: 'Descubre su trabajo', fr: 'Découvrir son travail' })}
            </button>
          </div>
          <figure className="cover-inset">
            <Img p={second} sizes="(max-width: 899px) 40vw, 14vw" />
            <figcaption>{t({ en: 'Sculptural study, on a mannequin', es: 'Estudio escultural, en maniquí', fr: 'Étude sculpturale, sur tête d’exposition' })}</figcaption>
          </figure>
          <p className="cover-sign">Astou Style &amp; Boutique</p>
        </div>
      </div>
    </section>
  );
}

/** "In this issue" — the table of contents doubles as the page index. */
export function Contents() {
  const { t } = useI18n();
  const items = [{ id: 'request', label: { en: 'Request an appointment', es: 'Pedir una cita', fr: 'Demander un rendez-vous' } }, ...NAV.filter((n) => n.id !== 'visit')];
  const order = ['signature', 'looks', 'portfolio', 'motion', 'editorial', 'artist', 'private', 'request', 'boutique'];
  return (
    <nav className="contents" aria-label={t({ en: 'In this issue', es: 'En esta edición', fr: 'Dans ce numéro' })}>
      <p className="contents-k">{t({ en: 'In this issue', es: 'En esta edición', fr: 'Dans ce numéro' })}</p>
      <ol>
        {order.map((id, i) => {
          const it = items.find((x) => x.id === id)!;
          return (
            <li key={id}>
              <button type="button" onClick={() => goTo(id)}>
                <span className="ct-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ct-t">{t(it.label)}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
