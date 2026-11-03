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
  required: { en: 'Required.', fr: 'Champ requis.' },
  email: { en: 'Please enter a valid email, e.g. name@email.com.', fr: 'Adresse e-mail invalide, ex. nom@email.com.' },
  phone: { en: 'Please enter a phone number we can call or text.', fr: 'Indiquez un numéro joignable par appel ou SMS.' },
  date: { en: 'Please choose a date from today onwards.', fr: 'Choisissez une date à partir d’aujourd’hui.' },
  file: { en: 'Please choose an image under 8 MB (JPG, PNG, HEIC or WebP).', fr: 'Choisissez une image de moins de 8 Mo (JPG, PNG, HEIC ou WebP).' },
  consent: { en: 'Please confirm you understand this is a request.', fr: 'Merci de confirmer qu’il s’agit d’une demande.' },
  fix: { en: 'Please check the highlighted fields.', fr: 'Merci de vérifier les champs signalés.' },
  fast: { en: 'That was quick — please check your details and send again.', fr: 'Envoi très rapide : vérifiez vos informations puis renvoyez.' },
  sending: { en: 'Sending…', fr: 'Envoi…' },
  error: {
    en: 'Your request could not be sent. Please try again, or call or email Astou directly.',
    fr: 'La demande n’a pas pu être envoyée. Réessayez, ou contactez Astou par téléphone ou e-mail.',
  },
} satisfies Record<string, L>;

const TIMES: { v: string; l: L }[] = [
  { v: 'morning', l: { en: 'Morning (before 12 pm)', fr: 'Matin (avant 12 h)' } },
  { v: 'afternoon', l: { en: 'Afternoon (12–5 pm)', fr: 'Après-midi (12 h – 17 h)' } },
  { v: 'evening', l: { en: 'Evening (after 5 pm)', fr: 'Soir (après 17 h)' } },
  { v: 'flexible', l: { en: 'I’m flexible', fr: 'Je suis flexible' } },
];
const PLACES: { v: string; l: L }[] = [
  { v: 'home', l: { en: 'Private home', fr: 'Domicile' } },
  { v: 'hotel', l: { en: 'Hotel', fr: 'Hôtel' } },
  { v: 'venue', l: { en: 'Event venue', fr: 'Lieu de réception' } },
  { v: 'studio', l: { en: 'Photo or video studio', fr: 'Studio photo ou vidéo' } },
  { v: 'other', l: { en: 'Other', fr: 'Autre' } },
];
const EVENTS: { v: string; l: L }[] = [
  { v: 'everyday', l: { en: 'Everyday / protective style', fr: 'Quotidien / coiffure protectrice' } },
  { v: 'wedding', l: { en: 'Wedding', fr: 'Mariage' } },
  { v: 'celebration', l: { en: 'Celebration or party', fr: 'Fête ou célébration' } },
  { v: 'shoot', l: { en: 'Photo shoot or editorial', fr: 'Séance photo ou éditorial' } },
  { v: 'stage', l: { en: 'Stage or performance', fr: 'Scène ou spectacle' } },
  { v: 'other', l: { en: 'Other', fr: 'Autre' } },
];
const STYLE_ORDER: CatId[] = ['nappy', 'boho', 'sculptural', 'braiding', 'editorial'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type Status = 'idle' | 'invalid' | 'fast' | 'sending' | 'sent' | 'ready' | 'error';

export function RequestForm({ preset }: { preset?: { kind?: Kind; style?: string; n: number } }) {
  const { t, lang } = useI18n();
  const [kind, setKind] = useState<Kind>(preset?.kind ?? 'salon');
  const [style, setStyle] = useState(preset?.style ?? '');
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
    setStatus('idle');
    setSummary(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  const label = (v: string, list: { v: string; l: L }[]) => t(list.find((x) => x.v === v)?.l ?? { en: v, fr: v });
  const styleLabel = (v: string) => (v === 'other' ? t({ en: 'Something else / not sure', fr: 'Autre / je ne sais pas encore' }) : CATS[v as CatId] ? t(CATS[v as CatId].title) : v);

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
      lang === 'fr'
        ? [
            'Bonjour Astou,',
            '',
            'Je souhaite demander un rendez-vous :',
            '',
            `Type : ${kind === 'salon' ? 'Rendez-vous au salon (Bronx)' : 'Rendez-vous privé à domicile / sur place'}`,
            `Coiffure : ${styleLabel(v('hairstyle'))}`,
            `Date souhaitée : ${v('preferred-date')}`,
            `Horaire : ${label(v('preferred-time'), TIMES)}`,
            `Lieu : ${where}`,
            v('event-type') ? `Occasion : ${label(v('event-type'), EVENTS)}` : null,
            v('hair-notes') ? `Cheveux (longueur, texture) : ${v('hair-notes')}` : null,
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
            `Preferred date: ${v('preferred-date')}`,
            `Preferred time: ${label(v('preferred-time'), TIMES)}`,
            `Location: ${where}`,
            v('event-type') ? `Occasion: ${label(v('event-type'), EVENTS)}` : null,
            v('hair-notes') ? `Hair (length, texture): ${v('hair-notes')}` : null,
            '',
            `Details: ${v('details')}`,
            '',
            `${v('full-name')} · ${v('phone')} · ${v('email')}`,
            '',
            '(I’ll attach an inspiration photo if I have one.)',
          ];
    const subject = lang === 'fr' ? `Demande de rendez-vous — ${v('full-name')}` : `Appointment request — ${v('full-name')}`;
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
        {opts.optional ? <span className="opt"> — {t({ en: 'optional', fr: 'facultatif' })}</span> : <span aria-hidden="true"> *</span>}
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
        <p className="rq-done-k">{status === 'sent' ? t({ en: 'Request sent', fr: 'Demande envoyée' }) : t({ en: 'One last step', fr: 'Dernière étape' })}</p>
        <h3 className="rq-done-h">
          {t({ en: 'Thank you', fr: 'Merci' })}, {summary.name}.
        </h3>
        {status === 'sent' ? (
          <p>
            {t({
              en: 'Your request has been sent to Astou. It is not a confirmed appointment yet: she will contact you by phone or email to confirm her availability and a personalised quote.',
              fr: 'Votre demande a été transmise à Astou. Ce n’est pas encore un rendez-vous confirmé : elle vous contactera par téléphone ou e-mail pour confirmer sa disponibilité et un devis personnalisé.',
            })}
          </p>
        ) : (
          <>
            <p>
              {t({
                en: 'Your request is ready. Tap below to send it to Astou from your email app — everything you entered is already written for you. You can attach your inspiration photo there.',
                fr: 'Votre demande est prête. Touchez le bouton ci-dessous pour l’envoyer à Astou depuis votre messagerie : tout ce que vous avez saisi est déjà rédigé. Vous pourrez y joindre votre photo d’inspiration.',
              })}
            </p>
            <a className="btn btn-gold" href={summary.mailto}>
              {Icon.mail} {t({ en: 'Send my request by email', fr: 'Envoyer ma demande par e-mail' })}
            </a>
            <p className="rq-small">
              {t({
                en: 'Nothing has been sent or stored by this website. A request is not a confirmed appointment: Astou will reply to confirm availability and a personalised quote.',
                fr: 'Ce site n’a rien envoyé ni enregistré. Une demande n’est pas un rendez-vous confirmé : Astou vous répondra pour confirmer sa disponibilité et un devis personnalisé.',
              })}
            </p>
          </>
        )}
        <p className="rq-alt">
          {t({ en: 'Prefer to talk?', fr: 'Vous préférez en parler ?' })}{' '}
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
          {t({ en: '← Edit or start a new request', fr: '← Modifier ou faire une nouvelle demande' })}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="rq" name="appointment-request" encType="multipart/form-data" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="appointment-request" />
      <input type="hidden" name="appointment-type" value={kind === 'salon' ? 'Salon — Bliss Beauty World, Bronx' : 'Private on-location'} />
      <p className="hp" aria-hidden="true">
        <label>
          Leave empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <fieldset className="rq-kind">
        <legend className="rq-step">
          <span>01</span> {t({ en: 'Where would you like your appointment?', fr: 'Où souhaitez-vous votre rendez-vous ?' })}
        </legend>
        <div className="kind-grid">
          <label className={`kind ${kind === 'salon' ? 'is-on' : ''}`}>
            <input type="radio" name="kind" value="salon" checked={kind === 'salon'} onChange={() => setKind('salon')} />
            <span className="kind-h">{t({ en: 'At the salon', fr: 'Au salon' })}</span>
            <span className="kind-p">
              {BIZ.venue} · {BIZ.street}, Bronx
            </span>
          </label>
          <label className={`kind ${kind === 'location' ? 'is-on' : ''}`}>
            <input type="radio" name="kind" value="location" checked={kind === 'location'} onChange={() => setKind('location')} />
            <span className="kind-h">{t({ en: 'Private, on location', fr: 'Privé, sur place' })}</span>
            <span className="kind-p">
              {t({ en: 'Astou comes to you — local or out of state, subject to availability.', fr: 'Astou se déplace — à New York ou hors de l’État, selon disponibilité.' })}
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="rq-set">
        <legend className="rq-step">
          <span>02</span> {t({ en: 'Your style', fr: 'Votre coiffure' })}
        </legend>
        <div className="form-grid">
          {field(
            'hairstyle',
            { en: 'Requested hairstyle', fr: 'Coiffure souhaitée' },
            <select {...a('hairstyle')} value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="" disabled>
                {t({ en: 'Choose a style', fr: 'Choisir une coiffure' })}
              </option>
              {STYLE_ORDER.map((c) => (
                <option key={c} value={c}>
                  {t(CATS[c].title)}
                </option>
              ))}
              <option value="other">{t({ en: 'Something else / not sure', fr: 'Autre / je ne sais pas encore' })}</option>
            </select>,
          )}
          {field(
            'event-type',
            { en: 'Occasion', fr: 'Occasion' },
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
            { en: 'Your hair: length and texture', fr: 'Vos cheveux : longueur et texture' },
            <input {...a('hair-notes', true)} type="text" autoComplete="off" />,
            { optional: true, full: true, hint: { en: 'e.g. shoulder-length, 4C natural hair', fr: 'ex. aux épaules, cheveux naturels 4C' } },
          )}
          {field(
            'inspiration',
            { en: 'Inspiration photo', fr: 'Photo d’inspiration' },
            <input {...a('inspiration', true)} type="file" accept="image/*" />,
            {
              optional: true,
              full: true,
              hint:
                FORMS_MODE === 'netlify'
                  ? { en: 'One image, up to 8 MB.', fr: 'Une image, 8 Mo maximum.' }
                  : { en: 'You’ll attach it to the email in the last step.', fr: 'Vous la joindrez à l’e-mail à la dernière étape.' },
            },
          )}
        </div>
      </fieldset>

      <fieldset className="rq-set">
        <legend className="rq-step">
          <span>03</span> {t({ en: 'When and where', fr: 'Quand et où' })}
        </legend>
        <div className="form-grid">
          {field('preferred-date', { en: 'Preferred date', fr: 'Date souhaitée' }, <input {...a('preferred-date')} type="date" min={today()} />)}
          {field(
            'preferred-time',
            { en: 'Preferred time', fr: 'Horaire souhaité' },
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
              <span className="salon-loc-k">{t({ en: 'Location', fr: 'Lieu' })}</span>
              <span>
                {BIZ.venue}, {BIZ.street}, {BIZ.city}
              </span>
            </div>
          ) : (
            <>
              {field('service-city', { en: 'City', fr: 'Ville' }, <input {...a('service-city')} type="text" autoComplete="address-level2" />)}
              {field('service-state', { en: 'State', fr: 'État' }, <input {...a('service-state')} type="text" autoComplete="address-level1" />)}
              {field(
                'service-place',
                { en: 'Type of place', fr: 'Type de lieu' },
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
                { full: true, hint: { en: 'No street address needed yet — city and state are enough for a quote.', fr: 'Pas besoin d’adresse précise pour l’instant : la ville et l’État suffisent pour un devis.' } },
              )}
            </>
          )}
        </div>
      </fieldset>

      <fieldset className="rq-set">
        <legend className="rq-step">
          <span>04</span> {t({ en: 'About you', fr: 'Vos coordonnées' })}
        </legend>
        <div className="form-grid">
          {field('full-name', { en: 'Full name', fr: 'Nom complet' }, <input {...a('full-name')} type="text" autoComplete="name" />, { full: true })}
          {field('phone', { en: 'Phone', fr: 'Téléphone' }, <input {...a('phone')} type="tel" inputMode="tel" autoComplete="tel" />)}
          {field('email', { en: 'Email', fr: 'E-mail' }, <input {...a('email')} type="email" inputMode="email" autoComplete="email" />)}
          {field(
            'details',
            { en: 'Additional details', fr: 'Précisions' },
            <textarea {...a('details', true)} rows={4} />,
            { full: true, hint: { en: 'Length, colour, timing, number of people, anything Astou should know.', fr: 'Longueur, couleur, délai, nombre de personnes : tout ce qu’Astou doit savoir.' } },
          )}
          <div className={`field field-check is-full${err('contact-consent') ? ' has-err' : ''}`}>
            <input id="rq-consent" type="checkbox" name="contact-consent" value="yes" aria-invalid={!!err('contact-consent')} aria-describedby={err('contact-consent') ? 'rq-consent-err' : undefined} />
            <label htmlFor="rq-consent">
              {t({
                en: 'I understand this is a request, not a confirmed appointment. Astou will contact me to confirm availability and a personalised quote.',
                fr: 'Je comprends qu’il s’agit d’une demande et non d’un rendez-vous confirmé. Astou me contactera pour confirmer sa disponibilité et un devis personnalisé.',
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
          {status === 'sending' ? t(T.sending) : t({ en: 'Request an appointment', fr: 'Demander un rendez-vous' })}
        </button>
        <p className="rq-small">
          {t({
            en: 'Your details are used only to answer your request. No payment is taken online. Pricing is personalised after Astou understands your style, hair and location.',
            fr: 'Vos informations servent uniquement à répondre à votre demande. Aucun paiement en ligne. Le prix est personnalisé une fois votre style, vos cheveux et le lieu connus.',
          })}
        </p>
      </div>
      <p className={`rq-status is-${status}`} role="status" aria-live="polite">
        {status === 'invalid' ? t(T.fix) : status === 'fast' ? t(T.fast) : status === 'error' ? t(T.error) : ''}
      </p>
    </form>
  );
}
