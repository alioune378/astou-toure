import { LOOKS, type CatId, type Photo } from '../content';
import { useI18n, type L } from '../i18n';
import { Icon, Img, Kicker, Reveal } from '../components/ui';

type Open = (items: Photo[], i: number) => void;

/** 02 — The art of the finished look: featured collections of real work, each with a path to a similar request. */
export function Looks({ onOpen, onAsk }: { onOpen: Open; onAsk: (cat: CatId, look: L) => void }) {
  const { t } = useI18n();
  return (
    <section id="looks" className="lk sec" aria-labelledby="lk-h">
      <div className="wrap">
        <header className="sec-head sec-head-row">
          <div>
            <Kicker n="02">{t({ en: 'The finished look', es: 'El resultado', fr: 'Le résultat' })}</Kicker>
            <h2 id="lk-h" className="h2">
              {t({ en: 'The art of the', es: 'El arte del', fr: 'L’art de la' })} <em>{t({ en: 'finished look', es: 'acabado', fr: 'finition' })}</em>
            </h2>
          </div>
          <p className="lede">
            {t({
              en: 'Every detail matters, from the precision of each parting to the beauty of the final silhouette.',
              es: 'Cada detalle cuenta: desde la precisión de cada raya hasta la belleza de la silueta final.',
              fr: 'Chaque détail compte, de la précision de chaque raie à la beauté de la silhouette finale.',
            })}
          </p>
        </header>

        <div className="lk-list">
          {LOOKS.map((lk, n) => (
            <article key={lk.id} className={`lk-item lk-${lk.id}`} aria-labelledby={`lk-${lk.id}-h`}>
              <ul className={`lk-photos lk-n${lk.photos.length}`}>
                {lk.photos.map((p, i) => (
                  <Reveal as="li" key={p.file} delay={i * 90}>
                    <button type="button" onClick={() => onOpen(lk.photos, i)} aria-label={`${t({ en: 'Enlarge', es: 'Ampliar', fr: 'Agrandir' })}: ${t(p.title)}`}>
                      <Img p={p} sizes={lk.photos.length === 1 ? '(max-width: 899px) 100vw, 40vw' : lk.photos.length === 2 ? '(max-width: 899px) 50vw, 26vw' : '(max-width: 899px) 33vw, 18vw'} />
                    </button>
                  </Reveal>
                ))}
              </ul>
              <div className="lk-copy">
                <p className="lk-n">{String(n + 1).padStart(2, '0')}</p>
                <h3 id={`lk-${lk.id}-h`} className="lk-h">
                  {t(lk.title)}
                </h3>
                <p className="lk-text">{t(lk.text)}</p>
                {lk.note && <p className="lk-note">{t(lk.note)}</p>}
                <div className="lk-ask">
                  <p>{t({ en: 'Inspired by this look?', es: '¿Te inspira este look?', fr: 'Ce look vous inspire ?' })}</p>
                  <button type="button" className="btn btn-line" onClick={() => onAsk(lk.cat, lk.title)}>
                    {t({ en: 'Inquire about a similar style', es: 'Pide un estilo parecido', fr: 'Demander un style similaire' })} {Icon.arrow}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
