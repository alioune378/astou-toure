import { BIZ, PORTRAIT, photo, whatsappLink, type CatId } from '../content';
import { useI18n, type L } from '../i18n';
import { RequestForm } from '../components/RequestForm';
import { Icon, Img, Kicker, Reveal } from '../components/ui';

/* ============================================================ 03 — Meet Astou */

export function Artist() {
  const { t } = useI18n();
  const principles: [L, L][] = [
    [
      { en: 'Listen first', fr: 'D’abord écouter' },
      { en: 'Every style begins with a conversation about your hair, your face and how you want to feel.', fr: 'Chaque coiffure commence par une conversation : vos cheveux, votre visage, ce que vous voulez ressentir.' },
    ],
    [
      { en: 'Build with precision', fr: 'Construire avec précision' },
      { en: 'Clean parts, even tension and lines that hold their shape — the craft behind the art.', fr: 'Des raies nettes, une tension régulière et des lignes qui tiennent : le métier derrière l’art.' },
    ],
    [
      { en: 'Finish like a portrait', fr: 'Finir comme un portrait' },
      { en: 'Each style is considered from every angle, as if it were about to be photographed.', fr: 'Chaque coiffure est pensée sous tous les angles, comme si elle allait être photographiée.' },
    ],
  ];
  return (
    <section id="artist" className="artist sec" aria-labelledby="artist-h">
      <div className="wrap artist-grid">
        <figure className="artist-portrait">
          <Reveal className="ap-main">
            <Img p={PORTRAIT} sizes="(max-width: 959px) 100vw, 44vw" />
          </Reveal>
          <figcaption className="ap-cap">
            <span className="ap-name">Astou Touré</span>
            <span className="ap-role">{t({ en: 'Hair artist · Bronx, New York', fr: 'Artiste capillaire · Bronx, New York' })}</span>
          </figcaption>
          <Reveal className="ap-detail" delay={140}>
            <Img p={photo('02')} sizes="(max-width: 959px) 36vw, 13vw" />
          </Reveal>
        </figure>
        <div className="artist-copy">
          <Kicker n="04">{t({ en: 'Meet the artist', fr: 'Rencontrez l’artiste' })}</Kicker>
          <h2 id="artist-h" className="h2 artist-h">
            {t({ en: 'The hands', fr: 'Les mains' })}
            <br />
            <em>{t({ en: 'behind the work', fr: 'derrière l’œuvre' })}</em>
          </h2>
          <p className="artist-lede">
            {t({
              en: 'Astou Touré is a hair artist and specialist braider in the Bronx, New York. Her work moves from everyday protective styles to sculptural pieces built like architecture — and it always starts with the person in her chair.',
              fr: 'Astou Touré est artiste capillaire et tresseuse dans le Bronx, à New York. Son travail va des coiffures protectrices du quotidien à des pièces sculpturales construites comme de l’architecture, et commence toujours par la personne assise dans son fauteuil.',
            })}
          </p>
          <p>
            {t({
              en: 'She approaches each style as a one-off creation, with patience and an eye shaped by editorial beauty and fashion: natural texture celebrated as it is, braids drawn to the face, updos that hold their shape from every angle.',
              fr: 'Elle aborde chaque coiffure comme une création unique, avec patience et un regard nourri par la beauté éditoriale et la mode : la texture naturelle célébrée telle qu’elle est, des tresses dessinées pour le visage, des chignons qui tiennent sous tous les angles.',
            })}
          </p>
          <ol className="principles">
            {principles.map(([h, p], i) => (
              <li key={i}>
                <span className="pr-n">{['I', 'II', 'III'][i]}</span>
                <h3>{t(h)}</h3>
                <p>{t(p)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ 04 — Private clientele */

export function Private({ onAsk }: { onAsk: () => void }) {
  const { t } = useI18n();
  const services: [L, L][] = [
    [{ en: 'Private hairstyling', fr: 'Coiffure privée' }, { en: 'One-to-one appointments, in a setting of your choice.', fr: 'Des rendez-vous en tête-à-tête, dans le lieu de votre choix.' }],
    [{ en: 'Event styling', fr: 'Coiffure d’événement' }, { en: 'Weddings, celebrations and gatherings — for one guest or several.', fr: 'Mariages, fêtes et réceptions : pour une invitée ou plusieurs.' }],
    [{ en: 'Editorial sessions', fr: 'Séances éditoriales' }, { en: 'Hair for photo shoots, campaigns, video and stage.', fr: 'Coiffure pour séances photo, campagnes, vidéo et scène.' }],
    [{ en: 'Special occasions', fr: 'Grandes occasions' }, { en: 'Statement styles for the days you want to remember.', fr: 'Des coiffures fortes pour les jours qui comptent.' }],
    [{ en: 'On-location services', fr: 'Déplacements' }, { en: 'At home, in a hotel or at your venue — in New York or beyond, subject to availability.', fr: 'À domicile, à l’hôtel ou sur le lieu de l’événement, à New York ou ailleurs, selon disponibilité.' }],
  ];
  return (
    <section id="private" className="private sec" aria-labelledby="private-h">
      <div className="private-photo" aria-hidden="true">
        <Img p={photo('11')} sizes="(max-width: 899px) 100vw, 45vw" />
      </div>
      <div className="wrap private-in">
        <Kicker n="05">{t({ en: 'Private clientele', fr: 'Clientèle privée' })}</Kicker>
        <h2 id="private-h" className="h2">
          {t({ en: 'By appointment,', fr: 'Sur rendez-vous,' })} <em>{t({ en: 'wherever you are', fr: 'où que vous soyez' })}</em>
        </h2>
        <p className="lede">
          {t({
            en: 'For the days that matter, Astou can come to you. Every private request is considered personally, with discretion and care, and quoted for your style, your guests and your location.',
            fr: 'Pour les jours importants, Astou peut venir à vous. Chaque demande privée est étudiée personnellement, avec discrétion et soin, et chiffrée selon votre coiffure, vos invitées et le lieu.',
          })}
        </p>
        <ol className="svc">
          {services.map(([h, p], i) => (
            <Reveal as="li" key={i} delay={i * 70}>
              <span className="svc-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t(h)}</h3>
              <p>{t(p)}</p>
            </Reveal>
          ))}
        </ol>
        <button type="button" className="btn btn-gold" onClick={onAsk}>
          {t({ en: 'Request a custom quote', fr: 'Demander un devis personnalisé' })}
        </button>
      </div>
    </section>
  );
}

/* ============================================================ 05 — Request */

export function Request({ preset }: { preset?: { kind?: 'salon' | 'location'; style?: CatId; n: number } }) {
  const { t } = useI18n();
  const steps: L[] = [
    { en: 'Send your request with the style, date and place you have in mind.', fr: 'Envoyez votre demande avec la coiffure, la date et le lieu envisagés.' },
    { en: 'Astou replies personally to confirm her availability and a quote made for you.', fr: 'Astou vous répond personnellement pour confirmer sa disponibilité et un devis sur mesure.' },
    { en: 'Your appointment is confirmed only once you have both agreed.', fr: 'Le rendez-vous n’est confirmé qu’une fois que vous êtes toutes deux d’accord.' },
  ];
  return (
    <section id="request" className="request sec" aria-labelledby="req-h">
      <div className="wrap req-grid">
        <div className="req-intro">
          <Kicker n="06">{t({ en: 'Appointments', fr: 'Rendez-vous' })}</Kicker>
          <h2 id="req-h" className="h2">
            {t({ en: 'Request a', fr: 'Demander un' })} <em>{t({ en: 'private appointment', fr: 'rendez-vous privé' })}</em>
          </h2>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                <p>{t(s)}</p>
              </li>
            ))}
          </ol>
          <div className="req-direct">
            <p className="req-direct-k">{t({ en: 'Or contact Astou directly', fr: 'Ou contactez Astou directement' })}</p>
            <a href={BIZ.tel}>
              {Icon.phone} {BIZ.phoneIntl}
            </a>
            <a href={`mailto:${BIZ.email}`}>
              {Icon.mail} {BIZ.email}
            </a>
            <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
              {Icon.ig} {BIZ.instagramHandle}
            </a>
            {BIZ.whatsapp && (
              <a href={whatsappLink(t({ en: 'Hello Astou, I would like to request an appointment.', fr: 'Bonjour Astou, je souhaite demander un rendez-vous.' }))} target="_blank" rel="noopener noreferrer">
                {Icon.phone} WhatsApp
              </a>
            )}
          </div>
        </div>
        <div className="req-form">
          <RequestForm preset={preset} />
        </div>
      </div>
    </section>
  );
}

/* ============================================================ 06 — Boutique */

export function Boutique() {
  const { t } = useI18n();
  const items: [string, L, L][] = [
    ['dress', { en: 'Dresses', fr: 'Robes' }, { en: 'Pieces chosen to be worn with a statement style.', fr: 'Des pièces choisies pour accompagner une coiffure forte.' }],
    ['scarf', { en: 'Scarves', fr: 'Foulards' }, { en: 'Colour, print and silk-touch textures to frame the face.', fr: 'Couleurs, imprimés et matières douces pour encadrer le visage.' }],
    ['acc', { en: 'Accessories', fr: 'Accessoires' }, { en: 'The finishing details of a look, from hair to hand.', fr: 'Les derniers détails d’une silhouette, des cheveux aux mains.' }],
  ];
  return (
    <section id="boutique" className="boutique sec" aria-labelledby="bq-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="07">{t({ en: 'Boutique', fr: 'Boutique' })}</Kicker>
            <h2 id="bq-h" className="h2">
              {t({ en: 'The coming', fr: 'La collection' })} <em>{t({ en: 'collection', fr: 'à venir' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Astou Style & Boutique also brings together fashion pieces to wear with your hair. The first selection is being prepared.',
              fr: 'Astou Style & Boutique réunit aussi des pièces de mode à porter avec votre coiffure. La première sélection est en préparation.',
            })}
          </p>
        </header>
        <ul className="bq">
          {items.map(([k, h, p], i) => (
            <Reveal as="li" key={k} className={`bq-item bq-${k}`} delay={i * 100}>
              <div className="bq-vis" aria-hidden="true">
                <span className="bq-num">0{i + 1}</span>
              </div>
              <h3>{t(h)}</h3>
              <p>{t(p)}</p>
              <span className="tag">{t({ en: 'Coming soon', fr: 'Bientôt' })}</span>
            </Reveal>
          ))}
        </ul>
        <a className="btn btn-line" href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
          {Icon.ig} {t({ en: 'First look on Instagram', fr: 'En avant-première sur Instagram' })}
        </a>
      </div>
    </section>
  );
}

/* ============================================================ Visit */

export function Visit() {
  const { t } = useI18n();
  return (
    <section id="visit" className="visit sec" aria-labelledby="visit-h">
      <div className="wrap visit-grid">
        <div>
          <p className="kicker-s">{t({ en: 'Visit the salon', fr: 'Venir au salon' })}</p>
          <h2 id="visit-h" className="visit-h">{BIZ.venue}</h2>
          <address className="visit-addr">
            {BIZ.street}
            <br />
            {BIZ.city}
          </address>
          <p className="visit-note">
            {t({
              en: 'Appointments are arranged directly with Astou — please request or call before visiting.',
              fr: 'Les rendez-vous se prennent directement avec Astou : merci de faire une demande ou d’appeler avant de venir.',
            })}
          </p>
          <a className="btn btn-gold" href={BIZ.maps} target="_blank" rel="noopener noreferrer">
            {Icon.pin} {t({ en: 'Get directions', fr: 'Itinéraire' })}
          </a>
        </div>
        <ul className="visit-links">
          <li>
            <span>{t({ en: 'Call or text', fr: 'Appel ou SMS' })}</span>
            <a href={BIZ.tel}>{BIZ.phoneIntl}</a>
          </li>
          <li>
            <span>Email</span>
            <a href={`mailto:${BIZ.email}`}>{BIZ.email}</a>
          </li>
          <li>
            <span>Instagram</span>
            <a href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
              {BIZ.instagramHandle}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
