import { useEffect, useRef, useState } from 'react';
import { CLIP_GROUPS, type Clip } from '../content';
import { useI18n } from '../i18n';
import { Kicker, goTo } from '../components/ui';

const src = (c: Clip) => `/media/video/${c.file}.mp4`;
const poster = (c: Clip) => `/media/video/${c.file}.webp`;

/**
 * 04 — The artistry in motion. One video plays at a time, only after a tap, starting muted;
 * the visitor turns the sound on. Leaving the card, or the tab, pauses it. Nothing preloads.
 */
export function Motion() {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const [sound, setSound] = useState(false);

  return (
    <section id="motion" className="mo sec" aria-labelledby="mo-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="04">{t({ en: 'Videos', es: 'Videos', fr: 'Vidéos' })}</Kicker>
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
            <ul className="mo-strip">
              {g.clips.map((c, i) => (
                <li key={c.file} className="mo-card">
                  <VideoCard
                    clip={c}
                    n={i + 1}
                    playing={active === c.file}
                    sound={sound}
                    onPlay={() => setActive(c.file)}
                    onStop={() => setActive((a) => (a === c.file ? null : a))}
                    onSound={setSound}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="note">
          {t({
            en: 'Filmed in the salon by Astou and her team. Colour lightly adjusted; the phone audio is replaced by an original instrumental.',
            es: 'Grabados en el salón por Astou y su equipo. Color ligeramente ajustado; el audio del teléfono se sustituyó por una pieza instrumental original.',
            fr: 'Filmées au salon par Astou et son équipe. Couleurs légèrement ajustées ; le son du téléphone est remplacé par une musique instrumentale originale.',
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
}: {
  clip: Clip;
  n: number;
  playing: boolean;
  sound: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSound: (s: boolean) => void;
}) {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const title = t(clip.title);

  // Start when activated; keep the muted state in sync with the shared sound toggle.
  useEffect(() => {
    const v = vid.current;
    if (!playing || !v) return;
    v.muted = !sound;
    v.play().catch(() => {
      // Some browsers refuse unmuted playback; fall back to muted rather than failing.
      v.muted = true;
      onSound(false);
      v.play().catch(() => undefined);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  useEffect(() => {
    if (vid.current) vid.current.muted = !sound;
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
            muted={!sound}
            preload="metadata"
            width={clip.w}
            height={clip.h}
            aria-label={title}
            onEnded={onStop}
            onVolumeChange={(e) => {
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
        {playing && (
          <div className="vc-tools">
            <button type="button" className="vc-tool" aria-pressed={sound} onClick={() => onSound(!sound)}>
              {sound ? t({ en: 'Sound off', es: 'Quitar sonido', fr: 'Couper le son' }) : t({ en: 'Sound on', es: 'Activar sonido', fr: 'Activer le son' })}
            </button>
            <button type="button" className="vc-tool" onClick={fullscreen}>
              {t({ en: 'Full screen', es: 'Pantalla completa', fr: 'Plein écran' })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
