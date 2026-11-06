import { BIZ, BOUTIQUE, ED_CHAPTERS, ED_FEATURE, ED_STATUS, KIND_LABEL, PRESS, SIGNATURE_IDS, STYLES, photo, type Photo } from '../content';
import { useI18n, type L } from '../i18n';
import { Icon, Img, Kicker, Reveal, openView } from '../components/ui';

type Open = (items: Photo[], i: number) => void;

/* ============================================================ Signature work (homepage: a few standout hairstyles) */

export function SignatureWork({ onOpen }: { onOpen: Open }) {
  const { t } = useI18n();
  const picks = SIGNATURE_IDS.map(photo);
  // Each pick opens with every view of its hairstyle.
  const viewsOf = (p: Photo) => STYLES.find((s) => s.photos.includes(p))?.photos ?? [p];
  const cats: { id: string; label: L }[] = [
    { id: 'sculptural', label: { en: 'Sculptural Hair Art', es: 'Arte capilar escultural', fr: 'Art capillaire sculptural' } },
    { id: 'editorial', label: { en: 'Bridal & Special Occasions', es: 'Novias y ocasiones especiales', fr: 'Mariage & grandes occasions' } },
    { id: 'braiding', label: { en: 'Braids & Protective Styling', es: 'Trenzas y peinados protectores', fr: 'Tresses & coiffures protectrices' } },
    { id: 'press', label: { en: 'Editorial & Fashion', es: 'Editorial y moda', fr: 'Éditorial & mode' } },
  ];
  return (
    <section id="work" className="sw sec" aria-labelledby="sw-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="02">{t({ en: 'Signature work', es: 'Obra destacada', fr: 'Créations signature' })}</Kicker>
            <h2 id="sw-h" className="h2">
              {t({ en: 'The Art', es: 'El arte', fr: 'L’art' })} <em>{t({ en: 'of Astou', es: 'de Astou', fr: 'd’Astou' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Five hairstyles, chosen from her portfolio. Each one is built by hand, line by line, and finished to be seen from every angle.',
              es: 'Cinco peinados elegidos de su portafolio. Cada uno está hecho a mano, línea por línea, y terminado para verse desde todos los ángulos.',
              fr: 'Cinq coiffures choisies dans son portfolio. Chacune est construite à la main, ligne après ligne, et pensée pour être vue sous tous les angles.',
            })}
          </p>
        </header>
        <ul className="sw-grid">
          {picks.map((p, i) => {
            const views = viewsOf(p);
            return (
              <Reveal as="li" key={p.id} className={`sw-i sw-${i}`} delay={(i % 3) * 90}>
                <button type="button" onClick={() => onOpen(views, 0)}>
                  <Img p={p} sizes={i === 0 ? '(max-width: 899px) 100vw, 46vw' : '(max-width: 899px) 50vw, 25vw'} />
                  <span className="sw-cap">
                    <span className="sw-t">{t(STYLES.find((s) => s.photos.includes(p))?.title ?? p.title)}</span>
                    <span className="sw-k">
                      {t(KIND_LABEL[p.kind])}
                      {views.length > 1 && ` · ${views.length} ${t({ en: 'views', es: 'vistas', fr: 'vues' })}`}
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </ul>
        <nav className="sw-cats" aria-label={t({ en: 'Portfolio collections', es: 'Colecciones del portafolio', fr: 'Collections du portfolio' })}>
          {cats.map((c) => (
            <button key={c.id} type="button" onClick={() => (c.id === 'press' ? openView('editorial') : openView('portfolio', `cat-${c.id}`))}>
              {t(c.label)} <span aria-hidden="true">→</span>
            </button>
          ))}
        </nav>
        <button type="button" className="btn btn-onyx" onClick={() => openView('portfolio')}>
          {t({ en: 'Open the full portfolio', es: 'Ver el portafolio completo', fr: 'Ouvrir le portfolio complet' })}
        </button>
      </div>
    </section>
  );
}

/* ============================================================ In print: Salon Digest */

export function InPrint({ onOpen }: { onOpen: Open }) {
  const { t } = useI18n();
  const pages = [PRESS.cover, PRESS.feature];
  return (
    <section id="in-print" className="inprint sec" aria-labelledby="ip-h">
      <div className="wrap ip-grid">
        <div className="ip-pages">
          <Reveal className="ip-cover">
            <button type="button" onClick={() => onOpen(pages, 0)} aria-label={t({ en: 'Enlarge the magazine cover', es: 'Ampliar la portada de la revista', fr: 'Agrandir la couverture du magazine' })}>
              <Img p={PRESS.cover} sizes="(max-width: 899px) 78vw, 36vw" style={{ aspectRatio: `${PRESS.cover.w} / ${PRESS.cover.h}` }} />
            </button>
          </Reveal>
          <Reveal className="ip-feature" delay={140}>
            <button type="button" onClick={() => onOpen(pages, 1)} aria-label={t({ en: 'Enlarge the feature page', es: 'Ampliar la página del reportaje', fr: 'Agrandir la page du sujet' })}>
              <Img p={PRESS.feature} sizes="(max-width: 899px) 52vw, 22vw" style={{ aspectRatio: `${PRESS.feature.w} / ${PRESS.feature.h}` }} />
            </button>
          </Reveal>
        </div>
        <div className="ip-copy">
          <Kicker n="03">{t({ en: 'In print', es: 'En papel', fr: 'Sur papier' })}</Kicker>
          <h2 id="ip-h" className="h2">
            {t({ en: 'In print —', es: 'En papel:', fr: 'Sur papier —' })} <em>{t({ en: 'a legacy of artistry', es: 'un legado de arte', fr: 'un héritage d’artiste' })}</em>
          </h2>
          <p className="lede">
            {t({
              en: 'Years before today’s digital beauty culture, Astou’s work was already appearing in print. Her sculptural styling was featured in Salon Digest’s New York/New Jersey edition, reflecting a creative vision shaped by craftsmanship, precision and imagination.',
              es: 'Años antes de la cultura digital de la belleza, el trabajo de Astou ya aparecía en papel. Su peinado escultural fue publicado en la edición Nueva York/Nueva Jersey de Salon Digest, reflejo de una visión creativa formada por el oficio, la precisión y la imaginación.',
              fr: 'Bien avant la culture numérique de la beauté, le travail d’Astou paraissait déjà dans la presse. Sa coiffure sculpturale a été publiée dans l’édition New York/New Jersey de Salon Digest, reflet d’une vision créative façonnée par le métier, la précision et l’imagination.',
            })}
          </p>
          <p className="ip-pub">
            <span className="ip-name">{PRESS.publication}</span>
            <span>{t(PRESS.edition)}</span>
            <span>{t(PRESS.issue)}</span>
          </p>
          <dl className="credits">
            {PRESS.credits.map(([k, v]) => (
              <div key={k} className={k === 'Stylist' ? 'is-hair' : ''}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="case-note">
            {t({
              en: 'Credits as printed on the feature page. Cover and page shown as published, without retouching of their design or text.',
              es: 'Créditos tal como aparecen impresos en la página del reportaje. Portada y página mostradas tal como se publicaron, sin retocar su diseño ni su texto.',
              fr: 'Crédits tels qu’imprimés sur la page du sujet. Couverture et page présentées telles que publiées, sans retouche de leur mise en page ni de leur texte.',
            })}
          </p>
          <button type="button" className="link-btn" onClick={() => openView('editorial')}>
            {t({ en: 'More editorial and fashion work', es: 'Más trabajo editorial y de moda', fr: 'Plus de travail éditorial et de mode' })} →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ Editorial & notable encounters (a glimpse) */

export function Encounters({ onOpen }: { onOpen: Open }) {
  const { t } = useI18n();
  const enc = ED_CHAPTERS.find((c) => c.id === 'encounters');
  const items: { p: Photo; status: keyof typeof ED_STATUS; label: L; who?: L }[] = [
    { p: ED_FEATURE, status: 'credited', label: { en: 'Garage Magazine, Spring/Summer 2012', es: 'Garage Magazine, primavera/verano 2012', fr: 'Garage Magazine, printemps-été 2012' } },
    ...(enc?.items.slice(0, 2).map((it) => ({ p: it.photo, status: 'encounter' as const, label: it.photo.title, who: it.who })) ?? []),
  ];
  const all = items.map((x) => x.p);
  return (
    <section id="encounters" className="enc sec" aria-labelledby="enc-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="04">{t({ en: 'Editorial & notable encounters', es: 'Editorial y encuentros notables', fr: 'Éditorial & rencontres marquantes' })}</Kicker>
            <h2 id="enc-h" className="h2">
              {t({ en: 'A career', es: 'Una carrera', fr: 'Une carrière' })} <em>{t({ en: 'beyond the chair', es: 'más allá de la silla', fr: 'au-delà du fauteuil' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Published fashion work, and moments with people met along the way. Each image says what it is: a printed credit, or a photograph of an encounter.',
              es: 'Trabajo de moda publicado y momentos con personas conocidas en el camino. Cada imagen indica lo que es: un crédito impreso o la fotografía de un encuentro.',
              fr: 'Des travaux de mode publiés, et des moments partagés avec des personnes rencontrées en chemin. Chaque image dit ce qu’elle est : un crédit imprimé, ou la photographie d’une rencontre.',
            })}
          </p>
        </header>
        <ul className="enc-grid">
          {items.map((x, i) => (
            <Reveal as="li" key={x.p.file} delay={i * 90}>
              <button type="button" onClick={() => onOpen(all, i)} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(x.label)}`}>
                <Img p={x.p} sizes="(max-width: 899px) 100vw, 30vw" style={{ aspectRatio: '4 / 5' }} />
              </button>
              <p className={`enc-status is-${x.status}`}>{t(ED_STATUS[x.status])}</p>
              <p className="ed-item-h">{t(x.label)}</p>
              {x.who && <p className="ed-item-who">{t(x.who)}</p>}
            </Reveal>
          ))}
        </ul>
        <button type="button" className="btn btn-line" onClick={() => openView('editorial')}>
          {t({ en: 'The full editorial archive', es: 'El archivo editorial completo', fr: 'Toutes les archives éditoriales' })}
        </button>
      </div>
    </section>
  );
}

/* ============================================================ Astou Boutique */

export function AstouBoutique({ onAsk }: { onAsk: (collection: L) => void }) {
  const { t } = useI18n();
  const count = (n: number) => `${n} ${n === 1 ? t({ en: 'piece', es: 'pieza', fr: 'pièce' }) : t({ en: 'pieces', es: 'piezas', fr: 'pièces' })}`;
  return (
    <section id="boutique" className="boutique sec" aria-labelledby="bq-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="05">Astou Boutique</Kicker>
            <h2 id="bq-h" className="h2">
              {t({ en: 'Style', es: 'Estilo', fr: 'Le style' })} <em>{t({ en: 'beyond the salon', es: 'más allá del salón', fr: 'au-delà du salon' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Discover a carefully selected collection of fashion essentials, elegant dresses, headwear and accessories that celebrate personal expression.',
              es: 'Descubre una colección cuidadosamente seleccionada de básicos de moda, vestidos elegantes, tocados y accesorios que celebran la expresión personal.',
              fr: 'Découvrez une sélection soignée d’essentiels de mode, de robes élégantes, de coiffes et d’accessoires qui célèbrent l’expression personnelle.',
            })}
          </p>
        </header>
        <ul className="bq">
          {BOUTIQUE.map((c, i) => (
            <Reveal as="li" key={c.id} className={`bq-item bq-${c.id}`} delay={i * 100}>
              {c.items[0] ? (
                <button type="button" className="bq-cover" onClick={() => openView('boutique', `bq-${c.id}`)} aria-label={`${t(c.title)} — ${count(c.items.length)}`}>
                  <Img p={c.items[0].photo} sizes="(max-width: 759px) 100vw, 30vw" />
                  <span className="bq-count">{count(c.items.length)}</span>
                </button>
              ) : (
                <div className="bq-vis" aria-hidden="true">
                  <span className="bq-num">0{i + 1}</span>
                </div>
              )}
              <h3>{t(c.title)}</h3>
              <p>{t(c.text)}</p>
              {c.items.length ? (
                <button type="button" className="link-btn" onClick={() => openView('boutique', `bq-${c.id}`)}>
                  {t({ en: 'See the pieces', es: 'Ver las piezas', fr: 'Voir les pièces' })} →
                </button>
              ) : (
                <button type="button" className="link-btn" onClick={() => onAsk(c.title)}>
                  {t({ en: 'Ask about this collection', es: 'Preguntar por esta colección', fr: 'Se renseigner sur cette collection' })} →
                </button>
              )}
            </Reveal>
          ))}
        </ul>
        <p className="note">
          {t({
            en: 'No online checkout: ask Astou about availability, prices and sizes, and she or her team will reply.',
            es: 'No hay compra en línea: pregunta a Astou por la disponibilidad, los precios y las tallas, y ella o su equipo te responderá.',
            fr: 'Pas d’achat en ligne : demandez à Astou les disponibilités, les prix et les tailles, elle ou son équipe vous répondra.',
          })}
        </p>
        <div className="bq-ctas">
          <button type="button" className="btn btn-onyx" onClick={() => openView('boutique')}>
            {t({ en: 'Explore the boutique', es: 'Explorar la boutique', fr: 'Découvrir la boutique' })}
          </button>
          <a className="btn btn-line" href={BIZ.instagram} target="_blank" rel="noopener noreferrer">
            {Icon.ig} Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ Page head for the portfolio and editorial pages */

export function PageHead({ id, kicker, title, em, lede }: { id: string; kicker: L; title: L; em: L; lede: L }) {
  const { t } = useI18n();
  return (
    <header id={id} className="pagehead wrap">
      <button type="button" className="link-btn pagehead-back" onClick={() => openView('home')}>
        ← {t({ en: 'Home', es: 'Inicio', fr: 'Accueil' })}
      </button>
      <p className="kicker-s">{t(kicker)}</p>
      <h1 className="h1-page">
        {t(title)} <em>{t(em)}</em>
      </h1>
      <p className="lede">{t(lede)}</p>
    </header>
  );
}
