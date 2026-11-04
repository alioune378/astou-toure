import { BIZ, PORTRAIT, photo, whatsappLink, type CatId } from '../content';
import { useI18n, type L } from '../i18n';
import { RequestForm } from '../components/RequestForm';
import { Icon, Img, Kicker, Reveal } from '../components/ui';

/* ============================================================ 03 — Meet Astou */

export function Artist() {
  const { t } = useI18n();
  const principles: [L, L][] = [
    [
      { en: 'Listen first', es: 'Primero, escuchar', fr: 'D’abord écouter' },
      { en: 'Every style begins with a conversation about your hair, your face and how you want to feel.', es: 'Cada estilo empieza con una conversación sobre tu cabello, tu cara y cómo te quieres sentir.', fr: 'Chaque coiffure commence par une conversation : vos cheveux, votre visage, ce que vous voulez ressentir.' },
    ],
    [
      { en: 'Build with precision', es: 'Construir con precisión', fr: 'Construire avec précision' },
      { en: 'Clean parts, even tension and lines that hold their shape — the craft behind the art.', es: 'Rayas limpias, tensión pareja y líneas que mantienen su forma: el oficio detrás del arte.', fr: 'Des raies nettes, une tension régulière et des lignes qui tiennent : le métier derrière l’art.' },
    ],
    [
      { en: 'Finish like a portrait', es: 'Terminar como un retrato', fr: 'Finir comme un portrait' },
      { en: 'Each style is considered from every angle, as if it were about to be photographed.', es: 'Cada estilo se piensa desde todos los ángulos, como si estuviera a punto de ser fotografiado.', fr: 'Chaque coiffure est pensée sous tous les angles, comme si elle allait être photographiée.' },
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
            <span className="ap-role">{t({ en: 'Hair artist · Bronx, New York', es: 'Artista del cabello · Bronx, Nueva York', fr: 'Artiste capillaire · Bronx, New York' })}</span>
          </figcaption>
        </figure>
        <div className="artist-copy">
          <Kicker n="06">{t({ en: 'Meet the artist', es: 'Conoce a la artista', fr: 'Rencontrez l’artiste' })}</Kicker>
          <h2 id="artist-h" className="h2 artist-h">
            {t({ en: 'The hands', es: 'Las manos', fr: 'Les mains' })}
            <br />
            <em>{t({ en: 'behind the work', es: 'detrás de la obra', fr: 'derrière l’œuvre' })}</em>
          </h2>
          <p className="artist-lede">
            {t({
              en: 'Astou Touré is a hair artist and specialist braider in the Bronx, New York. Her work moves from everyday protective styles to sculptural pieces built like architecture — and it always starts with the person in her chair.',
              es: 'Astou Touré es artista del cabello y trenzadora especializada en el Bronx, Nueva York. Su trabajo va de los peinados protectores del día a día a piezas esculturales construidas como arquitectura, y siempre empieza por la persona sentada en su silla.',
              fr: 'Astou Touré est artiste capillaire et tresseuse dans le Bronx, à New York. Son travail va des coiffures protectrices du quotidien à des pièces sculpturales construites comme de l’architecture, et commence toujours par la personne assise dans son fauteuil.',
            })}
          </p>
          <p>
            {t({
              en: 'She approaches each style as a one-off creation, with patience and an eye shaped by editorial beauty and fashion: natural texture celebrated as it is, braids drawn to the face, updos that hold their shape from every angle.',
              es: 'Trata cada estilo como una creación única, con paciencia y una mirada formada por la belleza editorial y la moda: la textura natural celebrada tal como es, trenzas pensadas para tu cara, recogidos que mantienen su forma desde todos los ángulos.',
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
    [{ en: 'Private hairstyling', es: 'Peinado privado', fr: 'Coiffure privée' }, { en: 'One-to-one appointments, in a setting of your choice.', es: 'Citas individuales, en el lugar que elijas.', fr: 'Des rendez-vous en tête-à-tête, dans le lieu de votre choix.' }],
    [{ en: 'Event styling', es: 'Peinado para eventos', fr: 'Coiffure d’événement' }, { en: 'Weddings, celebrations and gatherings — for one guest or several.', es: 'Bodas, fiestas y reuniones, para una invitada o para varias.', fr: 'Mariages, fêtes et réceptions : pour une invitée ou plusieurs.' }],
    [{ en: 'Editorial sessions', es: 'Sesiones editoriales', fr: 'Séances éditoriales' }, { en: 'Hair for photo shoots, campaigns, video and stage.', es: 'Peinado para sesiones de fotos, campañas, video y escenario.', fr: 'Coiffure pour séances photo, campagnes, vidéo et scène.' }],
    [{ en: 'Special occasions', es: 'Ocasiones especiales', fr: 'Grandes occasions' }, { en: 'Statement styles for the days you want to remember.', es: 'Peinados que dejan huella para los días que quieres recordar.', fr: 'Des coiffures marquantes pour les jours qui comptent.' }],
    [{ en: 'On-location services', es: 'Servicio a domicilio', fr: 'Déplacements' }, { en: 'At home, in a hotel or at your venue, in New York or beyond, subject to availability.', es: 'En tu casa, en un hotel o en el lugar de tu evento, en Nueva York o más allá, según disponibilidad.', fr: 'À domicile, à l’hôtel ou sur le lieu de l’événement, à New York ou ailleurs, selon disponibilité.' }],
    [{ en: 'Travelling clients', es: 'Clientas que viajan', fr: 'Clientes de passage' }, { en: 'Visiting New York, or planning an event out of state? Send your dates and location for a personal quote.', es: '¿Estás de visita en Nueva York o tienes un evento fuera del estado? Envía tus fechas y el lugar para un presupuesto personal.', fr: 'De passage à New York, ou un événement hors de l’État ? Envoyez vos dates et le lieu pour un devis personnalisé.' }],
  ];
  return (
    <section id="private" className="private sec" aria-labelledby="private-h">
      {/* A real client's special-occasion style; not presented as a record of a private appointment. */}
      <figure className="private-photo">
        <Img p={photo('20')} sizes="(max-width: 899px) 100vw, 45vw" />
        <figcaption className="private-cap">{t({ en: 'Rolled updo, on a client', es: 'Recogido de rizos, en una clienta', fr: 'Chignon roulé, sur une cliente' })}</figcaption>
      </figure>
      <div className="wrap private-in">
        <Kicker n="07">{t({ en: 'Private clientele', es: 'Clientela privada', fr: 'Clientèle privée' })}</Kicker>
        <h2 id="private-h" className="h2">
          {t({ en: 'By appointment.', es: 'Con cita previa.', fr: 'Sur rendez-vous.' })} <em>{t({ en: 'Wherever you are.', es: 'Donde tú estés.', fr: 'Où que vous soyez.' })}</em>
        </h2>
        <p className="lede">
          {t({
            en: 'For the days that matter, Astou can come to you. Every private request is considered individually, with discretion and care, and quoted for your style, your guests and your location.',
            es: 'Para los días importantes, Astou puede ir a ti. Cada solicitud privada se atiende de forma personal, con discreción y cuidado, y se cotiza según tu estilo, tus invitadas y el lugar.',
            fr: 'Pour les jours importants, Astou peut venir à vous. Chaque demande privée est étudiée au cas par cas, avec discrétion et soin, et chiffrée selon votre coiffure, vos invitées et le lieu.',
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
          {t({ en: 'Request a custom quote', es: 'Pide un presupuesto a tu medida', fr: 'Demander un devis personnalisé' })}
        </button>
      </div>
    </section>
  );
}

/* ============================================================ 05 — Request */

export function Request({ preset }: { preset?: { kind?: 'salon' | 'location'; style?: CatId; look?: L; photo?: string; n: number } }) {
  const { t } = useI18n();
  const steps: L[] = [
    { en: 'Send your request with the style, date and place you have in mind.', es: 'Envía tu solicitud con el estilo, la fecha y el lugar que tienes en mente.', fr: 'Envoyez votre demande avec la coiffure, la date et le lieu envisagés.' },
    { en: 'Astou or her team replies to confirm availability and a quote made for you.', es: 'Astou o su equipo te responde para confirmar la disponibilidad y un presupuesto hecho para ti.', fr: 'Astou ou son équipe vous répond pour confirmer la disponibilité et vous proposer un devis sur mesure.' },
    { en: 'Your appointment is confirmed only once you have both agreed.', es: 'Tu cita queda confirmada solo cuando Astou y tú estén de acuerdo.', fr: 'Le rendez-vous n’est confirmé qu’une fois que vous êtes d’accord, Astou et vous.' },
  ];
  return (
    <section id="request" className="request sec" aria-labelledby="req-h">
      <div className="wrap req-grid">
        <div className="req-intro">
          <Kicker n="08">{t({ en: 'Appointments', es: 'Citas', fr: 'Rendez-vous' })}</Kicker>
          <h2 id="req-h" className="h2">
            {t({ en: 'Request a', es: 'Pide una', fr: 'Demander un' })} <em>{t({ en: 'private appointment', es: 'cita privada', fr: 'rendez-vous privé' })}</em>
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
            <p className="req-direct-k">{t({ en: 'Or contact Astou directly', es: 'O contacta a Astou directamente', fr: 'Ou contactez Astou directement' })}</p>
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
              <a href={whatsappLink(t({ en: 'Hello Astou, I would like to request an appointment.', es: 'Hola Astou, me gustaría pedir una cita.', fr: 'Bonjour Astou, je souhaite demander un rendez-vous.' }))} target="_blank" rel="noopener noreferrer">
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
    ['dress', { en: 'Dresses', es: 'Vestidos', fr: 'Robes' }, { en: 'Pieces chosen to be worn with a statement style.', es: 'Piezas elegidas para lucir con un peinado que destaca.', fr: 'Des pièces choisies pour sublimer une coiffure qui s’affirme.' }],
    ['scarf', { en: 'Scarves', es: 'Pañuelos', fr: 'Foulards' }, { en: 'Colour, print and silk-touch textures to frame the face.', es: 'Color, estampados y texturas suaves como la seda para enmarcar la cara.', fr: 'Couleurs, imprimés et matières douces pour encadrer le visage.' }],
    ['acc', { en: 'Accessories', es: 'Accesorios', fr: 'Accessoires' }, { en: 'The finishing details of a look, from hair to hand.', es: 'Los toques finales de un look, del cabello a las manos.', fr: 'Les derniers détails d’une silhouette, des cheveux aux mains.' }],
  ];
  return (
    <section id="boutique" className="boutique sec" aria-labelledby="bq-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="09">{t({ en: 'Boutique', es: 'Boutique', fr: 'Boutique' })}</Kicker>
            <h2 id="bq-h" className="h2">
              {t({ en: 'The coming', es: 'La próxima', fr: 'La collection' })} <em>{t({ en: 'collection', es: 'colección', fr: 'à venir' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Astou Style & Boutique also brings together fashion pieces to wear with your hair. The first selection is being prepared.',
              es: 'Astou Style & Boutique también reúne piezas de moda para lucir con tu peinado. La primera selección se está preparando.',
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
              <span className="tag">{t({ en: 'Coming soon', es: 'Muy pronto', fr: 'Bientôt' })}</span>
            </Reveal>
          ))}
        </ul>
        <a className="btn btn-line" href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
          {Icon.ig} {t({ en: 'First look on Instagram', es: 'Primeras vistas en Instagram', fr: 'En avant-première sur Instagram' })}
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
          <p className="kicker-s">{t({ en: 'Visit the salon', es: 'Visita el salón', fr: 'Venir au salon' })}</p>
          <h2 id="visit-h" className="visit-h">{BIZ.venue}</h2>
          <address className="visit-addr">
            {BIZ.street}
            <br />
            {BIZ.city}
          </address>
          <p className="visit-note">
            {t({
              en: 'Appointments are arranged directly with Astou — please request or call before visiting.',
              es: 'Las citas se acuerdan directamente con Astou: haz tu solicitud o llama antes de venir.',
              fr: 'Les rendez-vous se prennent directement avec Astou : merci de faire une demande ou d’appeler avant de venir.',
            })}
          </p>
          <a className="btn btn-gold" href={BIZ.maps} target="_blank" rel="noopener noreferrer">
            {Icon.pin} {t({ en: 'Get directions', es: 'Cómo llegar', fr: 'Itinéraire' })}
          </a>
        </div>
        <ul className="visit-links">
          <li>
            <span>{t({ en: 'Astou · call or text', es: 'Astou · llamada o mensaje', fr: 'Astou · appel ou SMS' })}</span>
            <a href={BIZ.tel}>{BIZ.phoneIntl}</a>
          </li>
          <li>
            <span>
              {t({ en: 'Style partner', es: 'Estilista asociada', fr: 'Styliste partenaire' })} · {BIZ.partner.name}
            </span>
            <a href={BIZ.partner.tel}>{BIZ.partner.phoneIntl}</a>
          </li>
          <li>
            <span>{t({ en: 'Email', es: 'Correo', fr: 'E-mail' })}</span>
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
