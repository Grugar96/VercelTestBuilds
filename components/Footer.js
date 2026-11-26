import Link from 'next/link';
import Wave from './Wave';
import { NAV, ADDRESS, PHONES, PHONE_LABEL, EMAIL, INSTAGRAM, INSTAGRAM_HANDLE, MAPS, TAGLINE, wa } from '@/lib/site';

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <Wave color="var(--sb-charcoal)" n={2} />
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <img className="footer-logo" src="/img/logo.png" alt="Mulki Surf Brothers logo" width="96" height="96" loading="lazy" />
              <p className="small" style={{ color: 'rgba(245,243,236,.75)' }}>Surf lessons, riverside stays and good people in Mulki, Karnataka.</p>
            </div>
            <div>
              <h4>Visit</h4>
              <ul className="small"><li>{ADDRESS.map((l, i) => <span key={l}>{l}{i < ADDRESS.length - 1 && <br />}</span>)}</li><li><a href={MAPS}>Open in Google Maps</a></li></ul>
            </div>
            <div>
              <h4>Talk to us</h4>
              <ul className="small">
                <li><a href={wa('Hi Mulki Surf Brothers!')}>WhatsApp {PHONE_LABEL}</a></li>
                {PHONES.map(([n, l]) => <li key={n}><a href={`tel:+${n}`}>Call {l}</a></li>)}
                {/* placeholder: confirm this inbox exists */}
                <li><a href={`mailto:${EMAIL.value}`}>{EMAIL.value}</a></li>
                <li><a href={INSTAGRAM}>Instagram {INSTAGRAM_HANDLE}</a></li>
              </ul>
            </div>
            <div>
              <h4>Explore</h4>
              <ul className="small">{NAV.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Mulki Surf Brothers</span>
            <span>{TAGLINE}</span>
          </div>
        </div>
      </footer>
      <a className="wa-float" href={wa('Hi Mulki Surf Brothers! I have a question.')} aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.5 9.8 10.2 5.2 16 5.2s10.5 4.6 10.5 10.4S21.8 26 16 26zm5.8-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5c-.1-.2-.3-.3-.6-.4z" /></svg>
      </a>
    </>
  );
}
