import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CLIP_GROUPS, type CatId, type Clip, type ClipGroup } from '../content';
import { useI18n, type L } from '../i18n';
import { Kicker, goTo } from '../components/ui';

const src = (c: Clip) => `/media/video/${c.file}.mp4`;
const poster = (c: Clip) => `/media/video/${c.file}.webp`;

/**
 * 04 — The artistry in motion. One video plays at a time, only after a tap, starting muted;
 * the visitor turns the sound on. Leaving the card, or the tab, pauses it. Nothing preloads.
 */
export function Motion({ onAsk }: { onAsk: (cat: CatId, look: L, photo: string) => void }) {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const [sound, setSound] = useState(false);

  return (
    <section id="motion" className="mo sec" aria-labelledby="mo-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="03">{t({ en: 'Videos', es: 'Videos', fr: 'Vidéos' })}</Kicker>
            <h2 id="mo-h" className="h2">
              {t({ en: 'The artistry', es: 'El arte', fr: 'L’art' })} <em>{t({ en: 'in motion', es: 'en movimiento', fr: 'en mouvement' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Watch precision, creativity and craftsmanship come to life. Tap a video to play it; the sound stays off until you turn it on.',
              es: 'Mira cómo la precisión, la creatividad y el oficio cobran vida. Toca un video para verlo; el sonido queda apagado hasta que tú lo actives.',
              fr: 'La précision, la créativité et le savoir-faire prennent vie. Touchez une vidéo pour la lancer ; le son reste coupé jusqu’à ce que vous l’activiez.',
            })}
          </p>
        </header>

        {CLIP_GROUPS.map((g) => (
          <div key={g.id} className="mo-group" role="group" aria-labelledby={`mo-${g.id}-h`}>
            <div className="mo-ghead">
              <h3 id={`mo-${g.id}-h`} className="mo-gh">
                {t(g.title)}
              </h3>
              <p className="mo-gt">{t(g.text)}</p>
            </div>
            <ClipStrip
              group={g}
              render={(c, i) => (
                <VideoCard
                  clip={c}
                  n={i + 1}
                  playing={active === c.file}
                  sound={sound}
                  onPlay={() => setActive(c.file)}
                  onStop={() => setActive((a) => (a === c.file ? null : a))}
                  onSound={setSound}
                  onAsk={() => onAsk(c.cat ?? g.cat, c.title, poster(c))}
                />
              )}
            />
          </div>
        ))}

        <p className="note">
          {t({
            en: 'Filmed by Astou and her team. Colour lightly adjusted. Where a clip has sound, the phone audio is replaced by an original instrumental; the others play without sound.',
            es: 'Grabados por Astou y su equipo. Color ligeramente ajustado. Cuando un video tiene sonido, el audio del teléfono se sustituyó por una pieza instrumental original; los demás se reproducen sin sonido.',
            fr: 'Filmées par Astou et son équipe. Couleurs légèrement ajustées. Quand une vidéo a du son, celui du téléphone est remplacé par une musique instrumentale originale ; les autres sont muettes.',
          })}
        </p>
      </div>

      <div className="mo-cta">
        <div className="wrap mo-cta-in">
          <p className="mo-cta-h">
            {t({ en: 'Your look.', es: 'Tu look.', fr: 'Votre style.' })} <em>{t({ en: 'Her artistry.', es: 'Su arte.', fr: 'Son art.' })}</em>
          </p>
          <p className="mo-cta-t">
            {t({
              en: 'Whether you have intricate braids, an elegant updo or a completely personal style in mind, begin your experience with Astou.',
              es: 'Ya sea que sueñes con trenzas detalladas, un recogido elegante o un estilo totalmente tuyo, empieza tu experiencia con Astou.',
              fr: 'Tresses minutieuses, chignon élégant ou coiffure entièrement personnelle : commencez votre expérience avec Astou.',
            })}
          </p>
          <button type="button" className="btn btn-gold" onClick={() => goTo('request')}>
            {t({ en: 'Request your appointment', es: 'Pide tu cita', fr: 'Demander votre rendez-vous' })}
          </button>
        </div>
      </div>
    </section>
  );
}

function VideoCard({
  clip,
  n,
  playing,
  sound,
  onPlay,
  onStop,
  onSound,
  onAsk,
}: {
  clip: Clip;
  n: number;
  playing: boolean;
  sound: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSound: (s: boolean) => void;
  onAsk: () => void;
}) {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const title = t(clip.title);

  // Start when activated; keep the muted state in sync with the shared sound toggle.
  useEffect(() => {
    const v = vid.current;
    if (!playing || !v) return;
    v.muted = clip.silent ? true : !sound;
    v.play().catch(() => {
      // Some browsers refuse unmuted playback; fall back to muted rather than failing.
      v.muted = true;
      onSound(false);
      v.play().catch(() => undefined);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  useEffect(() => {
    if (vid.current && !clip.silent) vid.current.muted = !sound;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound]);

  // Pause when the card leaves the screen or the page is hidden.
  useEffect(() => {
    if (!playing) return;
    const el = box.current;
    const v = vid.current;
    let io: IntersectionObserver | undefined;
    if (el && v && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => {
        if (e.intersectionRatio < 0.3 && !document.fullscreenElement) v.pause();
      }, { threshold: [0, 0.3] });
      io.observe(el);
    }
    const onVis = () => document.hidden && v?.pause();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [playing]);

  const fullscreen = () => {
    const v = vid.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  };

  return (
    <div className={`vc ${playing ? 'is-playing' : ''}`} ref={box}>
      <div className="vc-frame">
        {playing ? (
          <video
            ref={vid}
            src={src(clip)}
            poster={poster(clip)}
            controls
            playsInline
            loop={clip.loop}
            muted={clip.silent ? true : !sound}
            preload="metadata"
            width={clip.w}
            height={clip.h}
            aria-label={title}
            onEnded={onStop}
            onVolumeChange={(e) => {
              if (clip.silent) return;
              const m = (e.target as HTMLVideoElement).muted;
              if (m === sound) onSound(!m);
            }}
          />
        ) : (
          <button type="button" className="vc-poster" onClick={onPlay} aria-label={`${t({ en: 'Play video', es: 'Ver video', fr: 'Lire la vidéo' })}: ${title} (${clip.dur})`}>
            <img src={poster(clip)} alt="" width={clip.w} height={clip.h} loading="lazy" decoding="async" />
            <span className="vc-play" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22">
                <path d="M7 4.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span className="vc-dur" aria-hidden="true">
              {clip.dur}
            </span>
          </button>
        )}
      </div>
      <div className="vc-bar">
        <p className="vc-t">
          <span className="vc-n">{String(n).padStart(2, '0')}</span> {title}
        </p>
        {clip.rel && <p className="vc-rel">{t(clip.rel)}</p>}
        <button type="button" className="vc-ask" onClick={onAsk}>
          {t({ en: 'Request this style', es: 'Pedir este estilo', fr: 'Demander ce style' })} <span aria-hidden="true">→</span>
          <span className="sr-only">: {title}</span>
        </button>
        {playing && (
          <div className="vc-tools">
            {clip.silent ? (
              <span className="vc-tool is-static">{t({ en: 'No sound', es: 'Sin sonido', fr: 'Sans son' })}</span>
            ) : (
              <button type="button" className="vc-tool" aria-pressed={sound} onClick={() => onSound(!sound)}>
                {sound ? t({ en: 'Sound off', es: 'Quitar sonido', fr: 'Couper le son' }) : t({ en: 'Sound on', es: 'Activar sonido', fr: 'Activer le son' })}
              </button>
            )}
            <button type="button" className="vc-tool" onClick={fullscreen}>
              {t({ en: 'Full screen', es: 'Pantalla completa', fr: 'Plein écran' })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Phones: one full card per slide (no clipped neighbours), with previous/next buttons and a counter. Desktop: a grid. */
function ClipStrip({ group, render }: { group: ClipGroup; render: (c: Clip, i: number) => ReactNode }) {
  const { t } = useI18n();
  const ref = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);
  const n = group.clips.length;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);
  const go = (d: number) => {
    const el = ref.current;
    if (!el) return;
    const k = Math.min(n - 1, Math.max(0, i + d));
    el.scrollTo({ left: k * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <>
      <ul className="mo-strip" ref={ref} aria-label={t(group.title)}>
        {group.clips.map((c, k) => (
          <li key={c.file} className="mo-card" aria-roledescription="slide" aria-label={`${k + 1} / ${n}`}>
            {render(c, k)}
          </li>
        ))}
      </ul>
      {n > 1 && (
        <div className="mo-nav">
          <button type="button" className="mo-nav-b" onClick={() => go(-1)} disabled={i <= 0} aria-label={t({ en: 'Previous video', es: 'Video anterior', fr: 'Vidéo précédente' })}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M12.5 4L6.5 10l6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <span className="mo-nav-c" aria-live="polite">
            {String(i + 1).padStart(2, '0')} <i>/</i> {String(n).padStart(2, '0')}
          </span>
          <button type="button" className="mo-nav-b" onClick={() => go(1)} disabled={i >= n - 1} aria-label={t({ en: 'Next video', es: 'Video siguiente', fr: 'Vidéo suivante' })}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
