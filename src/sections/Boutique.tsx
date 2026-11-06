import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BIZ, BOUTIQUE, type Photo } from '../content';
import { useI18n, type L } from '../i18n';
import { Icon, Img, Kicker, Reveal, goTo } from '../components/ui';
import { FORMS_MODE } from '../components/RequestForm';

type Open = (items: Photo[], i: number) => void;

/**
 * The boutique page (#/boutique): every piece once, by collection, each with an inquiry button.
 * No prices, sizes, materials or stock are shown (none are confirmed), and there is no checkout:
 * an inquiry goes to Netlify Forms ("boutique-inquiry"), or, in demo mode, to the visitor's email app.
 */
export function BoutiqueCatalog({ onOpen, onAsk }: { onOpen: Open; onAsk: (file: string) => void }) {
  const { t } = useI18n();
  return (
    <section id="bq-catalog" className="bqc sec" aria-label={t({ en: 'Boutique collections', es: 'Colecciones de la boutique', fr: 'Collections de la boutique' })}>
      <div className="wrap">
        {BOUTIQUE.filter((c) => c.items.length).map((c, ci) => {
          const photos = c.items.map((it) => it.photo);
          return (
            <section key={c.id} id={`bq-${c.id}`} className="bqc-col" aria-labelledby={`bq-${c.id}-h`}>
              <header className="bqc-head">
                <Kicker n={String(ci + 1).padStart(2, '0')}>{t({ en: 'Collection', es: 'Colección', fr: 'Collection' })}</Kicker>
                <h2 id={`bq-${c.id}-h`} className="h2">
                  {t(c.title)}
                </h2>
                <p className="lede">{t(c.text)}</p>
              </header>
              <ul className={`bqc-grid bqc-${c.id}`}>
                {c.items.map((it, i) => (
                  <Reveal as="li" key={it.photo.file} className="bqc-item" delay={(i % 3) * 80}>
                    <button type="button" className="bqc-img" onClick={() => onOpen(photos, i)} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(it.photo.title)}`}>
                      <Img p={it.photo} sizes="(max-width: 599px) 50vw, (max-width: 1099px) 33vw, 25vw" />
                    </button>
                    <h3 className="bqc-name">{t(it.photo.title)}</h3>
                    <p className="bqc-desc">{t(it.desc)}</p>
                    <button type="button" className="link-btn bqc-ask" onClick={() => onAsk(it.photo.file)}>
                      {t({ en: 'Ask about this piece', es: 'Preguntar por esta pieza', fr: 'Se renseigner sur cette pièce' })} <span aria-hidden="true">→</span>
                      <span className="sr-only">: {t(it.photo.title)}</span>
                    </button>
                  </Reveal>
                ))}
              </ul>
            </section>
          );
        })}
        <p className="note bqc-note">
          {t({
            en: 'Pieces are shown from photographs; colours can vary slightly on screen. Prices, sizes, materials and availability are given on request: there is no online checkout. Accessories, scarves and bonnets are also in the boutique at 9 East 167th Street.',
            es: 'Las piezas se muestran en fotografías; los colores pueden variar un poco en pantalla. Los precios, tallas, materiales y la disponibilidad se indican a petición: no hay compra en línea. También hay accesorios, pañuelos y gorros en la boutique del 9 East 167th Street.',
            fr: 'Les pièces sont présentées en photo ; les couleurs peuvent légèrement varier à l’écran. Prix, tailles, matières et disponibilités sur demande : pas d’achat en ligne. Accessoires, foulards et bonnets vous attendent aussi à la boutique du 9 East 167th Street.',
          })}
        </p>
      </div>
    </section>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTHER = 'other';
type Status = 'idle' | 'invalid' | 'fast' | 'sending' | 'sent' | 'ready' | 'error';

export function BoutiqueInquiry({ preset }: { preset?: { file: string; n: number } }) {
  const { t, lang } = useI18n();
  const items = BOUTIQUE.flatMap((c) => c.items.map((it) => ({ file: it.photo.file, name: it.photo.title, col: c.title })));
  const [piece, setPiece] = useState(preset?.file ?? '');
  const [errors, setErrors] = useState<Record<string, L>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [done, setDone] = useState<{ name: string; mailto: string } | null>(null);
  const started = useRef(Date.now());

  useEffect(() => {
    if (preset?.file) setPiece(preset.file);
    setStatus('idle');
    setDone(null);
  }, [preset?.n, preset?.file]);

  const nameOf = (file: string) => {
    const it = items.find((x) => x.file === file);
    return it ? it.name : file === OTHER ? { en: 'Something else in the boutique', es: 'Otra cosa de la boutique', fr: 'Autre chose à la boutique' } : null;
  };

  const validate = (fd: FormData) => {
    const e: Record<string, L> = {};
    const v = (k: string) => String(fd.get(k) ?? '').trim();
    if (!v('piece')) e.piece = { en: 'Please choose a piece, or “something else”.', es: 'Elige una pieza, u “otra cosa”.', fr: 'Choisissez une pièce, ou « autre chose ».' };
    if (!v('full-name')) e['full-name'] = { en: 'Required.', es: 'Campo obligatorio.', fr: 'Champ requis.' };
    if (!v('phone') && !v('email')) e.phone = { en: 'Please give a phone number or an email address.', es: 'Indica un teléfono o un correo electrónico.', fr: 'Indiquez un téléphone ou une adresse e-mail.' };
    if (v('phone') && v('phone').replace(/\D/g, '').length < 7) e.phone = { en: 'Please enter a phone number we can call or text.', es: 'Escribe un número al que podamos llamarte o enviarte un mensaje.', fr: 'Indiquez un numéro joignable par appel ou SMS.' };
    if (v('email') && !EMAIL_RE.test(v('email'))) e.email = { en: 'Please enter a valid email, e.g. name@email.com.', es: 'Escribe un correo válido, por ejemplo nombre@email.com.', fr: 'Adresse e-mail invalide, ex. nom@email.com.' };
    if (!fd.get('contact-consent')) e['contact-consent'] = { en: 'Please confirm you understand this is an inquiry.', es: 'Confirma que entiendes que es una consulta.', fr: 'Merci de confirmer qu’il s’agit d’une demande de renseignements.' };
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus('invalid');
      form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    if (fd.get('bot-field')) return;
    if (Date.now() - started.current < 3000) return setStatus('fast');
    const name = String(fd.get('full-name')).trim().split(/\s+/)[0];
    const pieceName = nameOf(String(fd.get('piece')));
    const lines = [
      `Piece: ${pieceName ? pieceName.en : String(fd.get('piece'))}`,
      `Name: ${fd.get('full-name')}`,
      fd.get('phone') ? `Phone: ${fd.get('phone')}` : null,
      fd.get('email') ? `Email: ${fd.get('email')}` : null,
      fd.get('message') ? `Message: ${fd.get('message')}` : null,
    ].filter(Boolean);

    if (FORMS_MODE === 'demo') {
      const mailto = `mailto:${BIZ.email}?subject=${encodeURIComponent(`Boutique inquiry — ${pieceName?.en ?? ''}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
      setDone({ name, mailto });
      setStatus('ready');
      return;
    }
    setStatus('sending');
    try {
      const body = new URLSearchParams();
      body.set('form-name', 'boutique-inquiry');
      body.set('piece', pieceName ? pieceName.en : String(fd.get('piece')));
      if (piece && piece !== OTHER) body.set('piece-photo', `${window.location.origin}/photos/${piece}.jpg`);
      for (const k of ['full-name', 'phone', 'email', 'message', 'contact-consent', 'bot-field']) body.set(k, String(fd.get(k) ?? ''));
      body.set('language', lang);
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (!res.ok) throw new Error(String(res.status));
      setDone({ name, mailto: '' });
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  const err = (k: string) => errors[k];
  const a = (k: string) => ({ id: `bi-${k}`, name: k, 'aria-invalid': !!err(k), 'aria-describedby': err(k) ? `bi-${k}-err` : undefined });
  const errP = (k: string) =>
    err(k) && (
      <p className="field-err" id={`bi-${k}-err`}>
        {t(err(k))}
      </p>
    );

  return (
    <section id="bq-inquiry" className="request sec" aria-labelledby="bi-h">
      <div className="wrap req-grid">
        <div className="req-intro">
          <Kicker n="03">{t({ en: 'Inquiries', es: 'Consultas', fr: 'Renseignements' })}</Kicker>
          <h2 id="bi-h" className="h2">
            {t({ en: 'Ask about', es: 'Pregunta por', fr: 'Se renseigner sur' })} <em>{t({ en: 'a piece', es: 'una pieza', fr: 'une pièce' })}</em>
          </h2>
          <p className="lede">
            {t({
              en: 'Tell Astou which piece you like. She or her team will reply with availability, sizes and the price.',
              es: 'Dile a Astou qué pieza te gusta. Ella o su equipo te responderá con la disponibilidad, las tallas y el precio.',
              fr: 'Dites à Astou quelle pièce vous plaît. Elle ou son équipe vous répondra : disponibilité, tailles et prix.',
            })}
          </p>
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
          </div>
        </div>

        {(status === 'sent' || status === 'ready') && done ? (
          <div className="rq-done" role="status" aria-live="polite">
            <p className="rq-done-k">{status === 'sent' ? t({ en: 'Inquiry received', es: 'Consulta recibida', fr: 'Demande reçue' }) : t({ en: 'One last step', es: 'Un último paso', fr: 'Dernière étape' })}</p>
            <h3 className="rq-done-h">
              {t({ en: 'Thank you', es: 'Gracias', fr: 'Merci' })}, {done.name}.
            </h3>
            {status === 'sent' ? (
              <p>
                {t({
                  en: 'Your inquiry has been received and saved for Astou. She or her team will reply by phone or email with availability, sizes and the price. Nothing has been reserved or charged.',
                  es: 'Tu consulta fue recibida y guardada para Astou. Ella o su equipo te responderá por teléfono o correo con la disponibilidad, las tallas y el precio. No se ha reservado ni cobrado nada.',
                  fr: 'Votre demande a bien été reçue et enregistrée pour Astou. Elle ou son équipe vous répondra par téléphone ou e-mail : disponibilité, tailles et prix. Rien n’a été réservé ni débité.',
                })}
              </p>
            ) : (
              <>
                <p>{t({ en: 'Tap below to send your inquiry to Astou from your email app. Nothing has been sent or stored by this website.', es: 'Toca el botón para enviar tu consulta a Astou desde tu correo. Este sitio no ha enviado ni guardado nada.', fr: 'Touchez le bouton pour envoyer votre demande à Astou depuis votre messagerie. Ce site n’a rien envoyé ni enregistré.' })}</p>
                <a className="btn btn-gold" href={done.mailto}>
                  {Icon.mail} {t({ en: 'Send my inquiry by email', es: 'Enviar mi consulta por correo', fr: 'Envoyer ma demande par e-mail' })}
                </a>
              </>
            )}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setStatus('idle');
                setDone(null);
                started.current = Date.now();
              }}
            >
              {t({ en: '← Ask about another piece', es: '← Preguntar por otra pieza', fr: '← Demander une autre pièce' })}
            </button>
          </div>
        ) : (
          <form className="rq bq-form" name="boutique-inquiry" noValidate onSubmit={onSubmit}>
            <p hidden>
              <label>
                Leave empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            <div className="form-grid">
              <div className={`field is-full${err('piece') ? ' has-err' : ''}`}>
                <label htmlFor="bi-piece">
                  {t({ en: 'Piece', es: 'Pieza', fr: 'Pièce' })}
                  <span aria-hidden="true"> *</span>
                </label>
                <select {...a('piece')} value={piece} onChange={(e) => setPiece(e.target.value)}>
                  <option value="" disabled>
                    —
                  </option>
                  {BOUTIQUE.filter((c) => c.items.length).map((c) => (
                    <optgroup key={c.id} label={t(c.title)}>
                      {c.items.map((it) => (
                        <option key={it.photo.file} value={it.photo.file}>
                          {t(it.photo.title)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value={OTHER}>{t({ en: 'Something else in the boutique', es: 'Otra cosa de la boutique', fr: 'Autre chose à la boutique' })}</option>
                </select>
                {errP('piece')}
              </div>
              <div className={`field is-full${err('full-name') ? ' has-err' : ''}`}>
                <label htmlFor="bi-full-name">
                  {t({ en: 'Full name', es: 'Nombre completo', fr: 'Nom complet' })}
                  <span aria-hidden="true"> *</span>
                </label>
                <input {...a('full-name')} type="text" autoComplete="name" />
                {errP('full-name')}
              </div>
              <div className={`field${err('phone') ? ' has-err' : ''}`}>
                <label htmlFor="bi-phone">{t({ en: 'Phone', es: 'Teléfono', fr: 'Téléphone' })}</label>
                <input {...a('phone')} type="tel" inputMode="tel" autoComplete="tel" />
                {errP('phone')}
              </div>
              <div className={`field${err('email') ? ' has-err' : ''}`}>
                <label htmlFor="bi-email">{t({ en: 'Email', es: 'Correo electrónico', fr: 'E-mail' })}</label>
                <input {...a('email')} type="email" inputMode="email" autoComplete="email" />
                {errP('email')}
              </div>
              <p className="hint is-full bi-hint">{t({ en: 'A phone number or an email is enough.', es: 'Basta con un teléfono o un correo.', fr: 'Un téléphone ou un e-mail suffit.' })}</p>
              <div className="field is-full">
                <label htmlFor="bi-message">
                  {t({ en: 'Message', es: 'Mensaje', fr: 'Message' })}
                  <span className="opt"> — {t({ en: 'optional', es: 'opcional', fr: 'facultatif' })}</span>
                </label>
                <textarea id="bi-message" name="message" rows={4} />
                <p className="hint">{t({ en: 'Your usual size, a colour you prefer, or a date you need it by.', es: 'Tu talla habitual, un color que prefieras o la fecha en que lo necesitas.', fr: 'Votre taille habituelle, une couleur préférée ou la date à laquelle il vous le faut.' })}</p>
              </div>
              <div className={`field field-check is-full${err('contact-consent') ? ' has-err' : ''}`}>
                <input id="bi-contact-consent" type="checkbox" name="contact-consent" value="yes" aria-invalid={!!err('contact-consent')} aria-describedby={err('contact-consent') ? 'bi-contact-consent-err' : undefined} />
                <label htmlFor="bi-contact-consent">
                  {t({
                    en: 'I understand this is an inquiry, not a purchase or reservation. Astou or her team will contact me.',
                    es: 'Entiendo que es una consulta, no una compra ni una reserva. Astou o su equipo me contactará.',
                    fr: 'Je comprends qu’il s’agit d’une demande de renseignements, ni d’un achat ni d’une réservation. Astou ou son équipe me contactera.',
                  })}
                </label>
                {errP('contact-consent')}
              </div>
            </div>
            <div className="rq-foot">
              <button className="btn btn-gold btn-lg" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? t({ en: 'Sending…', es: 'Enviando…', fr: 'Envoi…' }) : t({ en: 'Send my inquiry', es: 'Enviar mi consulta', fr: 'Envoyer ma demande' })}
              </button>
              <p className="rq-small">
                {t({ en: 'Your details are used only to answer your inquiry. No payment is taken online.', es: 'Tus datos solo se usan para responder a tu consulta. No se cobra nada en línea.', fr: 'Vos informations servent uniquement à répondre à votre demande. Aucun paiement en ligne.' })}
              </p>
            </div>
            <p className={`rq-status is-${status}`} role="status" aria-live="polite">
              {status === 'invalid'
                ? t({ en: 'Please check the highlighted fields.', es: 'Revisa los campos marcados.', fr: 'Vérifiez les champs signalés, s’il vous plaît.' })
                : status === 'fast'
                  ? t({ en: 'That was quick — please check your details and send again.', es: '¡Qué rápido! Revisa tus datos y vuelve a enviarlo.', fr: 'Envoi un peu trop rapide : vérifiez vos informations, puis réessayez.' })
                  : status === 'error'
                    ? t({ en: 'Your inquiry could not be sent. Please try again, or call or email Astou directly.', es: 'No pudimos enviar tu consulta. Inténtalo de nuevo, o llama o escribe directamente a Astou.', fr: 'La demande n’a pas pu être envoyée. Réessayez, ou contactez Astou par téléphone ou e-mail.' })
                    : ''}
            </p>
          </form>
        )}
      </div>
      <p className="wrap bq-back">
        <button type="button" className="link-btn" onClick={() => goTo('request')}>
          {t({ en: 'Booking a hair appointment instead?', es: '¿Prefieres pedir una cita de peinado?', fr: 'Plutôt un rendez-vous coiffure ?' })} →
        </button>
      </p>
    </section>
  );
}
