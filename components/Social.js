// Social / contact icons in the Surf Brothers style: a round painted badge in the platform's own colour
// (softened to sit with our palette), an off-white hand-drawn glyph, and the same light paint grain as the Warli kit.
import { PHONES, INSTAGRAM, INSTAGRAM_HANDLE, MAPS, wa } from '@/lib/site';

export const SOCIAL = {
  whatsapp: { label: 'WhatsApp', bg: '#2DB866' },
  instagram: { label: 'Instagram', bg: '#D6407A', spot: '#E1A748' },
  call: { label: 'Call', bg: '#CFDE58', ink: '#231F20' },
  maps: { label: 'Google Maps', bg: '#D4533F' },
  email: { label: 'Email', bg: '#1F6F8B' },
};

const GLYPH = {
  whatsapp: (
    <>
      <path className="g-stroke" d="M24 9.5c8 0 14.5 6.2 14.5 14S32 37.5 24 37.5c-2.6 0-5-.6-7.1-1.8L10 38l2.2-6.5A13.6 13.6 0 0 1 9.5 23.5C9.5 15.7 16 9.5 24 9.5Z" />
      <path className="g-fill" d="M18.6 17.2c.5-.5 1.3-.5 1.7.1l1.6 2.6c.3.5.2 1.1-.2 1.5l-.9.9c.8 1.9 2.4 3.6 4.4 4.5l.9-.9c.4-.4 1-.5 1.5-.2l2.6 1.6c.6.4.7 1.2.2 1.7l-1.1 1.1c-.9.9-2.3 1.2-3.5.7-4.2-1.7-7.4-4.9-9.1-9.1-.5-1.2-.2-2.6.7-3.5Z" />
    </>
  ),
  instagram: (
    <>
      <rect className="g-stroke" x="11.5" y="11.5" width="25" height="25" rx="7.5" />
      <circle className="g-stroke" cx="24" cy="24" r="6" />
      <circle className="g-fill" cx="31.2" cy="16.8" r="1.8" />
    </>
  ),
  call: (
    <path className="g-fill" d="M15.2 11.6c.9-.9 2.3-.8 3 .2l2.9 4.1c.6.8.5 1.9-.2 2.6l-1.7 1.7c1.5 3.3 4.2 6 7.5 7.5l1.7-1.7c.7-.7 1.8-.8 2.6-.2l4.1 2.9c1 .7 1.1 2.1.2 3l-1.9 1.9c-1.5 1.5-3.8 2-5.8 1.2-7.1-2.8-12.6-8.3-15.4-15.4-.8-2-.3-4.3 1.2-5.8Z" />
  ),
  email: (
    <>
      <rect className="g-stroke" x="11" y="15" width="26" height="18" rx="3" />
      <path className="g-stroke" d="M12.5 17l11.5 8.5 11.5-8.5" />
    </>
  ),
  maps: (
    <>
      <path className="g-fill" d="M24 9c-6 0-10.5 4.6-10.5 10.3C13.5 27 24 39 24 39s10.5-12 10.5-19.7C34.5 13.6 30 9 24 9Z" />
      <circle cx="24" cy="19.5" r="4.2" fill="var(--icon-bg)" />
    </>
  ),
};

export function SocialIcon({ kind, size = 44, title }) {
  const s = SOCIAL[kind];
  const id = `paint-${kind}`;
  return (
    <svg className={`social-icon si-${kind}`} viewBox="0 0 48 48" width={size} height={size} style={{ '--icon-bg': s.bg, '--icon-ink': s.ink || '#F5F3EC' }}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <defs>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="5" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 18.4" result="speck" />
          <feComposite in="SourceGraphic" in2="speck" operator="in" />
        </filter>
        <clipPath id={`${id}-c`}><circle cx="24" cy="24" r="22" /></clipPath>
      </defs>
      <g filter={`url(#${id})`}>
        <circle cx="24" cy="24" r="22" fill={s.bg} />
        {s.spot && <circle cx="8" cy="42" r="15" fill={s.spot} clipPath={`url(#${id}-c)`} opacity=".9" />}
        <g className="glyph" transform={kind === 'whatsapp' ? 'translate(-.6 1.4)' : undefined}>{GLYPH[kind]}</g>
      </g>
    </svg>
  );
}

// Each phone as its own row: number, then Call and WhatsApp icon buttons. Wraps cleanly on small screens.
export function ContactNumbers({ tone = 'dark' }) {
  return (
    <ul className={`contact-numbers ${tone}`}>
      {PHONES.map(([n, l]) => (
        <li key={n}>
          <span className="num">{l}</span>
          <a href={`tel:+${n}`} aria-label={`Call ${l}`}><SocialIcon kind="call" size={40} /></a>
          <a href={wa("Hi Mulki Surf Brothers! I'd like to book.", n)} aria-label={`WhatsApp ${l}`}><SocialIcon kind="whatsapp" size={40} /></a>
        </li>
      ))}
    </ul>
  );
}

export function SocialRow({ size = 44, className = '' }) {
  const items = [
    ['whatsapp', wa('Hi Mulki Surf Brothers!'), 'WhatsApp us'],
    ['instagram', INSTAGRAM, `Instagram ${INSTAGRAM_HANDLE}`],
    ['call', `tel:+${PHONES[0][0]}`, `Call ${PHONES[0][1]}`],
    ['maps', MAPS, 'Find us on Google Maps'],
  ];
  return (
    <div className={`social-row ${className}`}>
      {items.map(([k, href, label]) => (
        <a key={k} href={href} aria-label={label} title={label}><SocialIcon kind={k} size={size} /></a>
      ))}
    </div>
  );
}

// Inline text link with its platform icon in front. Use for any WhatsApp / Instagram / email / call / maps link in body text.
export function SocialLink({ kind, href, children, size = 22, className = '' }) {
  return <a className={`social-link ${className}`} href={href}><SocialIcon kind={kind} size={size} /><span>{children}</span></a>;
}
