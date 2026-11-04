import { useEffect, useRef, useState, type FormEvent, type ReactElement } from 'react';
import { BIZ, CATS, type CatId } from '../content';
import { useI18n, type L } from '../i18n';
import { Icon } from './ui';

/**
 * Appointment REQUEST (never a confirmed booking).
 * VITE_FORMS_MODE=demo (default): validates, then hands the request to the visitor's email app,
 *   addressed to Astou. Nothing is stored or sent by the website itself, and the page says so.
 * VITE_FORMS_MODE=netlify: submits to Netlify Forms ("appointment-request"); Netlify emails Astou.
 */
export const FORMS_MODE: 'demo' | 'netlify' = import.meta.env.VITE_FORMS_MODE === 'netlify' ? 'netlify' : 'demo';

type Kind = 'salon' | 'location';

const T = {
  required: { en: 'Required.', es: 'Campo obligatorio.', fr: 'Champ requis.' },
  email: { en: 'Please enter a valid email, e.g. name@email.com.', es: 'Escribe un correo válido, por ejemplo nombre@email.com.', fr: 'Adresse e-mail invalide, ex. nom@email.com.' },
  phone: { en: 'Please enter a phone number we can call or text.', es: 'Escribe un número al que podamos llamarte o enviarte un mensaje.', fr: 'Indiquez un numéro joignable par appel ou SMS.' },
  date: { en: 'Please choose a date from today onwards.', es: 'Elige una fecha a partir de hoy.', fr: 'Choisissez une date à partir d’aujourd’hui.' },
  file: { en: 'Please choose an image under 8 MB (JPG, PNG, HEIC or WebP).', es: 'Elige una imagen de menos de 8 MB (JPG, PNG, HEIC o WebP).', fr: 'Choisissez une image de moins de 8 Mo (JPG, PNG, HEIC ou WebP).' },
  consent: { en: 'Please confirm you understand this is a request.', es: 'Confirma que entiendes que es una solicitud.', fr: 'Merci de confirmer qu’il s’agit d’une demande.' },
  fix: { en: 'Please check the highlighted fields.', es: 'Revisa los campos marcados.', fr: 'Vérifiez les champs signalés, s’il vous plaît.' },
  fast: { en: 'That was quick — please check your details and send again.', es: '¡Qué rápido! Revisa tus datos y vuelve a enviarlo.', fr: 'Envoi un peu trop rapide : vérifiez vos informations, puis réessayez.' },
  sending: { en: 'Sending…', es: 'Enviando…', fr: 'Envoi…' },
  error: {
    en: 'Your request could not be sent. Please try again, or call or email Astou directly.',
    es: 'No pudimos enviar tu solicitud. Inténtalo de nuevo, o llama o escribe directamente a Astou.',
    fr: 'La demande n’a pas pu être envoyée. Réessayez, ou contactez Astou par téléphone ou e-mail.',
  },
} satisfies Record<string, L>;

const TIMES: { v: string; l: L }[] = [
  { v: 'morning', l: { en: 'Morning (before 12 pm)', es: 'Mañana (antes de las 12 pm)', fr: 'Matin (avant 12 h)' } },
  { v: 'afternoon', l: { en: 'Afternoon (12–5 pm)', es: 'Tarde (12–5 pm)', fr: 'Après-midi (12 h – 17 h)' } },
  { v: 'evening', l: { en: 'Evening (after 5 pm)', es: 'Noche (después de las 5 pm)', fr: 'Soir (après 17 h)' } },
  { v: 'flexible', l: { en: 'I’m flexible', es: 'Me da igual, soy flexible', fr: 'Je suis flexible' } },
];
const PLACES: { v: string; l: L }[] = [
  { v: 'home', l: { en: 'Private home', es: 'Casa particular', fr: 'Domicile' } },
  { v: 'hotel', l: { en: 'Hotel', es: 'Hotel', fr: 'Hôtel' } },
  { v: 'venue', l: { en: 'Event venue', es: 'Salón de eventos', fr: 'Lieu de réception' } },
  { v: 'studio', l: { en: 'Photo or video studio', es: 'Estudio de foto o video', fr: 'Studio photo ou vidéo' } },
  { v: 'other', l: { en: 'Other', es: 'Otro', fr: 'Autre' } },
];
const EVENTS: { v: string; l: L }[] = [
  { v: 'everyday', l: { en: 'Everyday / protective style', es: 'Día a día / peinado protector', fr: 'Quotidien / coiffure protectrice' } },
  { v: 'wedding', l: { en: 'Wedding', es: 'Boda', fr: 'Mariage' } },
  { v: 'celebration', l: { en: 'Celebration or party', es: 'Fiesta o celebración', fr: 'Fête ou célébration' } },
  { v: 'shoot', l: { en: 'Photo shoot or editorial', es: 'Sesión de fotos o editorial', fr: 'Séance photo ou éditorial' } },
  { v: 'stage', l: { en: 'Stage or performance', es: 'Escenario o espectáculo', fr: 'Scène ou spectacle' } },
  { v: 'other', l: { en: 'Other', es: 'Otro', fr: 'Autre' } },
];
const STYLE_ORDER: CatId[] = ['nappy', 'boho', 'sculptural', 'braiding', 'editorial'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type Status = 'idle' | 'invalid' | 'fast' | 'sending' | 'sent' | 'ready' | 'error';

export function RequestForm({ preset }: { preset?: { kind?: Kind; style?: string; look?: L; photo?: string; n: number } }) {
  const { t, lang } = useI18n();
  const [kind, setKind] = useState<Kind>(preset?.kind ?? 'salon');
  const [style, setStyle] = useState(preset?.style ?? '');
  const [look, setLook] = useState<L | undefined>(preset?.look);
  const [refPhoto, setRefPhoto] = useState<string | undefined>(preset?.photo);
  const [errors, setErrors] = useState<Record<string, L>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [summary, setSummary] = useState<{ name: string; mailto: string } | null>(null);
  const started = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // Apply presets coming from "Request this style" buttons.
  const presetKey = preset?.n ?? 0;
  useEffect(() => {
    if (!preset || !presetKey) return;
    if (preset.kind) setKind(preset.kind);
    if (preset.style) setStyle(preset.style);
    setLook(preset.look);
    setRefPhoto(preset.photo);
    setStatus('idle');
    setSummary(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  const label = (v: string, list: { v: string; l: L }[]) => t(list.find((x) => x.v === v)?.l ?? { en: v, es: v, fr: v });
  const styleLabel = (v: string) => (v === 'other' ? t({ en: 'Something else / not sure', es: 'Otra cosa / todavía no lo sé', fr: 'Autre / je ne sais pas encore' }) : CATS[v as CatId] ? t(CATS[v as CatId].title) : v);

  const validate = (fd: FormData) => {
    const e: Record<string, L> = {};
    const v = (k: string) => String(fd.get(k) ?? '').trim();
    for (const k of ['full-name', 'phone', 'email', 'hairstyle', 'preferred-date', 'preferred-time', 'details']) if (!v(k)) e[k] = T.required;
    if (kind === 'location') for (const k of ['service-city', 'service-state', 'service-place']) if (!v(k)) e[k] = T.required;
    if (v('email') && !EMAIL_RE.test(v('email'))) e.email = T.email;
    if (v('phone') && v('phone').replace(/\D/g, '').length < 7) e.phone = T.phone;
    if (v('preferred-date') && v('preferred-date') < today()) e['preferred-date'] = T.date;
    const f = fd.get('inspiration');
    if (f instanceof File && f.size > 0 && (f.size > 8 * 1024 * 1024 || !/^image\//.test(f.type || 'image/'))) e.inspiration = T.file;
    if (!fd.get('contact-consent')) e['contact-consent'] = T.consent;
    return e;
  };

  const buildMail = (fd: FormData) => {
    const v = (k: string) => String(fd.get(k) ?? '').trim();
    const where =
      kind === 'salon'
        ? `${BIZ.venue}, ${BIZ.street}, ${BIZ.city}`
        : `${v('service-city')}, ${v('service-state')} — ${label(v('service-place'), PLACES)}`;
    const lines =
      lang === 'es'
        ? [
            'Hola Astou:',
            '',
            'Me gustaría pedir una cita.',
            '',
            `Tipo: ${kind === 'salon' ? 'Cita en el salón (Bronx)' : 'Cita privada a domicilio / en el lugar'}`,
            `Peinado: ${styleLabel(v('hairstyle'))}`,
            look ? `Look de referencia: ${t(look)}` : null,
            refPhoto ? `Foto de referencia: ${refPhoto ? `${window.location.origin}${refPhoto}` : ''}` : null,
            `Fecha que prefiero: ${v('preferred-date')}`,
            `Horario: ${label(v('preferred-time'), TIMES)}`,
            `Lugar: ${where}`,
            v('event-type') ? `Ocasión: ${label(v('event-type'), EVENTS)}` : null,
            v('hair-notes') ? `Cabello (largo, textura): ${v('hair-notes')}` : null,
            v('discretion') ? `Privacidad / discreción: ${v('discretion')}` : null,
            '',
            `Detalles: ${v('details')}`,
            '',
            `${v('full-name')} · ${v('phone')} · ${v('email')}`,
            '',
            '(Adjunto una foto de inspiración si tengo una.)',
          ]
        : lang === 'fr'
        ? [
            'Bonjour Astou,',
            '',
            'Je souhaite demander un rendez-vous :',
            '',
            `Type : ${kind === 'salon' ? 'Rendez-vous au salon (Bronx)' : 'Rendez-vous privé à domicile / sur place'}`,
            `Coiffure : ${styleLabel(v('hairstyle'))}`,
            look ? `Look de référence : ${t(look)}` : null,
            refPhoto ? `Photo de référence : ${refPhoto ? `${window.location.origin}${refPhoto}` : ''}` : null,
            `Date souhaitée : ${v('preferred-date')}`,
            `Horaire : ${label(v('preferred-time'), TIMES)}`,
            `Lieu : ${where}`,
            v('event-type') ? `Occasion : ${label(v('event-type'), EVENTS)}` : null,
            v('hair-notes') ? `Cheveux (longueur, texture) : ${v('hair-notes')}` : null,
            v('discretion') ? `Confidentialité / discrétion : ${v('discretion')}` : null,
            '',
            `Détails : ${v('details')}`,
            '',
            `${v('full-name')} · ${v('phone')} · ${v('email')}`,
            '',
            '(Je joins une photo d’inspiration si j’en ai une.)',
          ]
        : [
            'Hello Astou,',
            '',
            'I would like to request an appointment:',
            '',
            `Type: ${kind === 'salon' ? 'Salon appointment (Bronx)' : 'Private on-location appointment'}`,
            `Hairstyle: ${styleLabel(v('hairstyle'))}`,
            look ? `Reference look: ${t(look)}` : null,
            refPhoto ? `Reference photo: ${refPhoto ? `${window.location.origin}${refPhoto}` : ''}` : null,
            `Preferred date: ${v('preferred-date')}`,
            `Preferred time: ${label(v('preferred-time'), TIMES)}`,
            `Location: ${where}`,
            v('event-type') ? `Occasion: ${label(v('event-type'), EVENTS)}` : null,
            v('hair-notes') ? `Hair (length, texture): ${v('hair-notes')}` : null,
            v('discretion') ? `Privacy / discretion: ${v('discretion')}` : null,
            '',
            `Details: ${v('details')}`,
            '',
            `${v('full-name')} · ${v('phone')} · ${v('email')}`,
            '',
            '(I’ll attach an inspiration photo if I have one.)',
          ];
    const subject = lang === 'es' ? `Solicitud de cita — ${v('full-name')}` : lang === 'fr' ? `Demande de rendez-vous — ${v('full-name')}` : `Appointment request — ${v('full-name')}`;
    return `mailto:${BIZ.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.filter((x): x is string => x !== null).join('\n'))}`;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus('invalid');
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }
    if (fd.get('bot-field')) return;
    if (Date.now() - started.current < 3000) return setStatus('fast');
    const name = String(fd.get('full-name')).trim().split(/\s+/)[0];

    if (FORMS_MODE === 'demo') {
      setSummary({ name, mailto: buildMail(fd) });
      setStatus('ready');
      return;
    }
    setStatus('sending');
    try {
      fd.set('form-name', 'appointment-request');
      fd.set('language', lang);
      if (look) fd.set('reference-look', look.en);
      if (refPhoto) fd.set('reference-photo', `${window.location.origin}${refPhoto}`);
      if (kind === 'salon') fd.set('service-place', `${BIZ.venue} (salon)`);
      const res = await fetch('/', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setSummary({ name, mailto: '' });
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  const err = (k: string) => errors[k];
  const field = (k: string, lab: L, input: ReactElement, opts: { full?: boolean; optional?: boolean; hint?: L } = {}) => (
    <div className={`field${opts.full ? ' is-full' : ''}${err(k) ? ' has-err' : ''}`}>
      <label htmlFor={`rq-${k}`}>
        {t(lab)}
        {opts.optional ? <span className="opt"> — {t({ en: 'optional', es: 'opcional', fr: 'facultatif' })}</span> : <span aria-hidden="true"> *</span>}
      </label>
      {input}
      {opts.hint && !err(k) && (
        <p className="hint" id={`rq-${k}-hint`}>
          {t(opts.hint)}
        </p>
      )}
      {err(k) && (
        <p className="field-err" id={`rq-${k}-err`}>
          {t(err(k))}
        </p>
      )}
    </div>
  );
  const a = (k: string, hint = false) => ({
    id: `rq-${k}`,
    name: k,
    'aria-invalid': !!err(k),
    'aria-describedby': err(k) ? `rq-${k}-err` : hint ? `rq-${k}-hint` : undefined,
  });

  if ((status === 'ready' || status === 'sent') && summary) {
    return (
      <div className="rq-done" role="status" aria-live="polite">
        <p className="rq-done-k">{status === 'sent' ? t({ en: 'Request sent', es: 'Solicitud enviada', fr: 'Demande envoyée' }) : t({ en: 'One last step', es: 'Un último paso', fr: 'Dernière étape' })}</p>
        <h3 className="rq-done-h">
          {t({ en: 'Thank you', es: 'Gracias', fr: 'Merci' })}, {summary.name}.
        </h3>
        {status === 'sent' ? (
          <p>
            {t({
              en: 'Your request has been sent to Astou. It is not a confirmed appointment yet: Astou or her team will contact you by phone or email to confirm her availability and a personalised quote.',
              es: 'Tu solicitud le llegó a Astou. Todavía no es una cita confirmada: Astou o su equipo te contactará por teléfono o correo para confirmar su disponibilidad y darte un presupuesto a tu medida.',
              fr: 'Votre demande a été transmise à Astou. Ce n’est pas encore un rendez-vous confirmé : Astou ou son équipe vous contactera par téléphone ou e-mail pour confirmer sa disponibilité et vous proposer un devis personnalisé.',
            })}
          </p>
        ) : (
          <>
            <p>
              {t({
                en: 'Your request is ready. Tap below to send it to Astou from your email app — everything you entered is already written for you. You can attach your inspiration photo there.',
                es: 'Tu solicitud está lista. Toca el botón para enviársela a Astou desde tu correo: todo lo que escribiste ya está redactado. Ahí mismo puedes adjuntar tu foto de inspiración.',
                fr: 'Votre demande est prête. Touchez le bouton ci-dessous pour l’envoyer à Astou depuis votre messagerie : tout ce que vous avez saisi est déjà rédigé. Vous pourrez y joindre votre photo d’inspiration.',
              })}
            </p>
            <a className="btn btn-gold" href={summary.mailto}>
              {Icon.mail} {t({ en: 'Send my request by email', es: 'Enviar mi solicitud por correo', fr: 'Envoyer ma demande par e-mail' })}
            </a>
            <p className="rq-small">
              {t({
                en: 'Nothing has been sent or stored by this website. A request is not a confirmed appointment: Astou or her team will reply to confirm availability and a personalised quote.',
                es: 'Este sitio no ha enviado ni guardado nada. Una solicitud no es una cita confirmada: Astou o su equipo te responderá para confirmar su disponibilidad y un presupuesto a tu medida.',
                fr: 'Ce site n’a rien envoyé ni enregistré. Une demande n’est pas un rendez-vous confirmé : Astou ou son équipe vous répondra pour confirmer sa disponibilité et vous proposer un devis personnalisé.',
              })}
            </p>
          </>
        )}
        <p className="rq-alt">
          {t({ en: 'Prefer to talk?', es: '¿Prefieres hablar?', fr: 'Vous préférez en parler ?' })}{' '}
          <a href={BIZ.tel}>{BIZ.phoneDisplay}</a>
        </p>
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setStatus('idle');
            setSummary(null);
            started.current = Date.now();
          }}
        >
          {t({ en: '← Edit or start a new request', es: '← Cambiar o hacer otra solicitud', fr: '← Modifier ou faire une nouvelle demande' })}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="rq" name="appointment-request" encType="multipart/form-data" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="appointment-request" />
      <input type="hidden" name="appointment-type" value={kind === 'salon' ? 'Salon — 9 East 167th Street, Bronx' : 'Private on-location'} />
      <p className="hp" aria-hidden="true">
        <label>
          Leave empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <fieldset className="rq-kind">
        <legend className="rq-step">
          <span>01</span> {t({ en: 'Where would you like your appointment?', es: '¿Dónde quieres tu cita?', fr: 'Où souhaitez-vous votre rendez-vous ?' })}
        </legend>
        <div className="kind-grid">
          <label className={`kind ${kind === 'salon' ? 'is-on' : ''}`}>
            <input type="radio" name="kind" value="salon" checked={kind === 'salon'} onChange={() => setKind('salon')} />
            <span className="kind-h">{t({ en: 'At the salon', es: 'En el salón', fr: 'Au salon' })}</span>
            <span className="kind-p">
              {BIZ.venue} · {BIZ.street}, Bronx
            </span>
          </label>
          <label className={`kind ${kind === 'location' ? 'is-on' : ''}`}>
            <input type="radio" name="kind" value="location" checked={kind === 'location'} onChange={() => setKind('location')} />
            <span className="kind-h">{t({ en: 'Private, on location', es: 'Privada, donde tú estés', fr: 'En privé, là où vous êtes' })}</span>
            <span className="kind-p">
              {t({ en: 'Astou comes to you — local or out of state, subject to availability.', es: 'Astou va a donde estés, en Nueva York o fuera del estado, según disponibilidad.', fr: 'Astou se déplace chez vous, à New York ou hors de l’État, selon ses disponibilités.' })}
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="rq-set">
        <legend className="rq-step">
          <span>02</span> {t({ en: 'Your style', es: 'Tu estilo', fr: 'Votre coiffure' })}
        </legend>
        <div className="form-grid">
          {field(
            'hairstyle',
            { en: 'Requested hairstyle', es: 'Peinado que quieres', fr: 'Coiffure souhaitée' },
            <select {...a('hairstyle')} value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="" disabled>
                {t({ en: 'Choose a style', es: 'Elige un estilo', fr: 'Choisir une coiffure' })}
              </option>
              {STYLE_ORDER.map((c) => (
                <option key={c} value={c}>
                  {t(CATS[c].title)}
                </option>
              ))}
              <option value="other">{t({ en: 'Something else / not sure', es: 'Otra cosa / todavía no lo sé', fr: 'Autre / je ne sais pas encore' })}</option>
            </select>,
          )}
          {look && (
            <p className="rq-look is-full">
              {refPhoto && <img className="rq-look-img" src={refPhoto.endsWith('.jpg') ? refPhoto.replace(/\.jpg$/, '-480.webp') : refPhoto} alt="" width="44" height="56" />}
              <span>{t({ en: 'Reference look', es: 'Look de referencia', fr: 'Look de référence' })}:</span> <strong>{t(look)}</strong>
              <button type="button" className="rq-look-x" onClick={() => { setLook(undefined); setRefPhoto(undefined); }}>
                {t({ en: 'Remove', es: 'Quitar', fr: 'Retirer' })}
              </button>
            </p>
          )}
          {field(
            'event-type',
            { en: 'Occasion', es: 'Ocasión', fr: 'Occasion' },
            <select {...a('event-type')} defaultValue="">
              <option value="">—</option>
              {EVENTS.map((o) => (
                <option key={o.v} value={o.v}>
                  {t(o.l)}
                </option>
              ))}
            </select>,
            { optional: true },
          )}
          {field(
            'hair-notes',
            { en: 'Your hair: length and texture', es: 'Tu cabello: largo y textura', fr: 'Vos cheveux : longueur et texture' },
            <input {...a('hair-notes', true)} type="text" autoComplete="off" />,
            { optional: true, full: true, hint: { en: 'e.g. shoulder-length, 4C natural hair', es: 'p. ej. hasta los hombros, cabello natural 4C', fr: 'ex. aux épaules, cheveux naturels 4C' } },
          )}
          {field(
            'inspiration',
            { en: 'Inspiration photo', es: 'Foto de inspiración', fr: 'Photo d’inspiration' },
            <input {...a('inspiration', true)} type="file" accept="image/*" />,
            {
              optional: true,
              full: true,
              hint:
                FORMS_MODE === 'netlify'
                  ? { en: 'One image, up to 8 MB.', es: 'Una imagen, hasta 8 MB.', fr: 'Une image, 8 Mo maximum.' }
                  : { en: 'You’ll attach it to the email in the last step.', es: 'La adjuntarás al correo en el último paso.', fr: 'Vous la joindrez à l’e-mail à la dernière étape.' },
            },
          )}
        </div>
      </fieldset>

      <fieldset className="rq-set">
        <legend className="rq-step">
          <span>03</span> {t({ en: 'When and where', es: 'Cuándo y dónde', fr: 'Quand et où' })}
        </legend>
        <div className="form-grid">
          {field('preferred-date', { en: 'Preferred date', es: 'Fecha que prefieres', fr: 'Date souhaitée' }, <input {...a('preferred-date')} type="date" min={today()} />)}
          {field(
            'preferred-time',
            { en: 'Preferred time', es: 'Horario que prefieres', fr: 'Horaire souhaité' },
            <select {...a('preferred-time')} defaultValue="">
              <option value="" disabled>
                —
              </option>
              {TIMES.map((o) => (
                <option key={o.v} value={o.v}>
                  {t(o.l)}
                </option>
              ))}
            </select>,
          )}
          {kind === 'salon' ? (
            <div className="field is-full salon-loc">
              <span className="salon-loc-k">{t({ en: 'Location', es: 'Lugar', fr: 'Lieu' })}</span>
              <span>
                {BIZ.venue}, {BIZ.street}, {BIZ.city}
              </span>
            </div>
          ) : (
            <>
              {field('service-city', { en: 'City', es: 'Ciudad', fr: 'Ville' }, <input {...a('service-city')} type="text" autoComplete="address-level2" />)}
              {field('service-state', { en: 'State', es: 'Estado', fr: 'État' }, <input {...a('service-state')} type="text" autoComplete="address-level1" />)}
              {field(
                'service-place',
                { en: 'Type of place', es: 'Tipo de lugar', fr: 'Type de lieu' },
                <select {...a('service-place', true)} defaultValue="">
                  <option value="" disabled>
                    —
                  </option>
                  {PLACES.map((o) => (
                    <option key={o.v} value={o.v}>
                      {t(o.l)}
                    </option>
                  ))}
                </select>,
                { full: true, hint: { en: 'No street address needed yet — city and state are enough for a quote.', es: 'No hace falta la dirección exacta todavía: con la ciudad y el estado basta para el presupuesto.', fr: 'Pas besoin d’adresse précise pour l’instant : la ville et l’État suffisent pour un devis.' } },
              )}
            </>
          )}
        </div>
      </fieldset>

      <fieldset className="rq-set">
        <legend className="rq-step">
          <span>04</span> {t({ en: 'About you', es: 'Sobre ti', fr: 'Vos coordonnées' })}
        </legend>
        <div className="form-grid">
          {field('full-name', { en: 'Full name', es: 'Nombre completo', fr: 'Nom complet' }, <input {...a('full-name')} type="text" autoComplete="name" />, { full: true })}
          {field('phone', { en: 'Phone', es: 'Teléfono', fr: 'Téléphone' }, <input {...a('phone')} type="tel" inputMode="tel" autoComplete="tel" />)}
          {field('email', { en: 'Email', es: 'Correo electrónico', fr: 'E-mail' }, <input {...a('email')} type="email" inputMode="email" autoComplete="email" />)}
          {field(
            'details',
            { en: 'Additional details', es: 'Más detalles', fr: 'Précisions' },
            <textarea {...a('details', true)} rows={4} />,
            { full: true, hint: { en: 'Length, colour, timing, number of people, anything Astou should know.', es: 'Largo, color, fecha límite, cuántas personas… todo lo que Astou deba saber.', fr: 'Longueur, couleur, délai, nombre de personnes : tout ce qu’Astou doit savoir.' } },
          )}
          {field(
            'discretion',
            { en: 'Privacy or discretion', es: 'Privacidad o discreción', fr: 'Confidentialité ou discrétion' },
            <input {...a('discretion', true)} type="text" />,
            { full: true, hint: { en: 'For example: discreet arrival, no photos, a name to use on arrival.', es: 'Por ejemplo: llegada discreta, sin fotos, un nombre para la llegada.', fr: 'Par exemple : arrivée discrète, pas de photos, un nom à utiliser à l’arrivée.' } },
          )}
          <div className={`field field-check is-full${err('contact-consent') ? ' has-err' : ''}`}>
            <input id="rq-consent" type="checkbox" name="contact-consent" value="yes" aria-invalid={!!err('contact-consent')} aria-describedby={err('contact-consent') ? 'rq-consent-err' : undefined} />
            <label htmlFor="rq-consent">
              {t({
                en: 'I understand this is a request, not a confirmed appointment. Astou or her team will contact me to confirm availability and a personalised quote.',
                es: 'Entiendo que es una solicitud y no una cita confirmada. Astou o su equipo me contactará para confirmar su disponibilidad y un presupuesto a mi medida.',
                fr: 'Je comprends qu’il s’agit d’une demande et non d’un rendez-vous confirmé. Astou ou son équipe me contactera pour confirmer sa disponibilité et vous proposer un devis personnalisé.',
              })}
            </label>
            {err('contact-consent') && (
              <p className="field-err" id="rq-consent-err">
                {t(err('contact-consent'))}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="rq-foot">
        <button className="btn btn-gold btn-lg" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? t(T.sending) : t({ en: 'Request an appointment', es: 'Pedir una cita', fr: 'Demander un rendez-vous' })}
        </button>
        <p className="rq-small">
          {t({
            en: 'Your details are used only to answer your request. No payment is taken online. Pricing is personalised after Astou understands your style, hair and location.',
            es: 'Tus datos solo se usan para responder a tu solicitud. No se cobra nada en línea. El precio se calcula para ti cuando Astou conoce tu estilo, tu cabello y el lugar.',
            fr: 'Vos informations servent uniquement à répondre à votre demande. Aucun paiement en ligne. Le tarif est établi sur mesure, une fois votre coiffure, vos cheveux et le lieu connus.',
          })}
        </p>
      </div>
      <p className={`rq-status is-${status}`} role="status" aria-live="polite">
        {status === 'invalid' ? t(T.fix) : status === 'fast' ? t(T.fast) : status === 'error' ? t(T.error) : ''}
      </p>
    </form>
  );
}
