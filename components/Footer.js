import Link from 'next/link';
import Wave from './Wave';
import { Shaka } from './kit/Kit';
import { SocialIcon, SocialRow, SocialLink } from './Social';
import { NAV, ADDRESS, PHONES, PHONE_LABEL, EMAIL, INSTAGRAM, INSTAGRAM_HANDLE, MAPS, TAGLINE, wa } from '@/lib/site';

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <Wave color="var(--sb-charcoal)" n={2} />
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <img className="footer-logo" src="/img/logo-mark.png" alt="Mulki Surf Brothers logo" width="128" height="125" loading="lazy" />
              <p className="small" style={{ color: 'rgba(245,243,236,.75)' }}>Surf lessons, riverside stays and good people in Mulki, Karnataka.</p>
              <SocialRow size={42} className="footer-social" />
            </div>
            <div>
              <h4>Visit</h4>
              <ul className="small"><li>{ADDRESS.map((l, i) => <span key={l}>{l}{i < ADDRESS.length - 1 && <br />}</span>)}</li><li><SocialLink kind="maps" href={MAPS}>Open in Google Maps</SocialLink></li></ul>
            </div>
            <div>
              <h4>Talk to us</h4>
              <ul className="small">
                <li><SocialLink kind="whatsapp" href={wa('Hi Mulki Surf Brothers!')}>WhatsApp {PHONE_LABEL}</SocialLink></li>
                {PHONES.map(([n, l]) => <li key={n}><SocialLink kind="call" href={`tel:+${n}`}>Call {l}</SocialLink></li>)}
                {/* placeholder: confirm this inbox exists */}
                <li><SocialLink kind="email" href={`mailto:${EMAIL.value}`}>{EMAIL.value}</SocialLink></li>
                <li><SocialLink kind="instagram" href={INSTAGRAM}>{INSTAGRAM_HANDLE}</SocialLink></li>
              </ul>
            </div>
            <div>
              <h4>Explore</h4>
              <ul className="small">{NAV.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Mulki Surf Brothers</span>
            <span className="footer-tag"><Shaka tone="dark" size={34} title="Shaka" />{TAGLINE}</span>
          </div>
        </div>
      </footer>
      <a className="wa-float" href={wa('Hi Mulki Surf Brothers! I have a question.')} aria-label="Chat on WhatsApp">
        <SocialIcon kind="whatsapp" size={58} />
      </a>
    </>
  );
}
