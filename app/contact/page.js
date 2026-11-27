import Wavy from '@/components/Wavy';
import Doodle, { DoodleSvg } from '@/components/Doodle';
import { SocialIcon } from '@/components/Social';
import { PageHero, WaveSection, Faq, BookingBand } from '@/components/Sections';
import { ADDRESS, EMAIL, INSTAGRAM, INSTAGRAM_HANDLE, MAPS, PHONES, PHONE_LABEL, wa } from '@/lib/site';

export const metadata = { title: 'Contact', description: 'How to reach Mulki Surf Brothers in Mulki, Karnataka: WhatsApp, phone, email, and getting here by train, bus or plane.' };

const FAQ = [
  ['What are the check-in and check-out times?', 'Check-in from 1:00 PM, check-out by 11:00 AM. Arriving early? Tell us and we’ll keep your bags safe.'],
  ['Can I work remotely from here?', 'Yes. There’s high-speed fiber Wi-Fi across the hostel and riverside deck, and afternoons are quiet once the morning session is done.'],
  ['When is the surf season?', 'September to May. June to August is monsoon, when the sea is too rough for lessons.'],
  ['How do I pay?', 'Book online on the Book page. Surf Only needs full payment to confirm (no refund after booking). Stay & Surf needs a \u20b92,000 advance per person (non-refundable), and the rest is paid at check-in.'],
  ['Can you arrange an airport or station pickup?', 'Yes, on request. Tell us your arrival time and we’ll arrange a cab from Mangaluru airport or the station.'],
];

const GETTING = [
  ['by air', 'plane', '25–45', 'min by road', 'Mangaluru airport (IXE)', 'Take a prepaid taxi (around ₹800–1,100) north on NH66, or ask us to arrange a pickup.'],
  ['by train', 'train', '5–15', 'min by auto', 'Mulki or Surathkal station', 'Trains from Goa, Mumbai, Bengaluru and Kerala stop here. Autos wait outside.'],
  ['by bus', 'bus', '~10', 'min by auto', 'Mulki bus stand, NH66', 'Overnight sleeper buses from Bengaluru and Mumbai drop you in Mulki town, a short auto ride away.'],
];

export default function Contact() {
  return (
    <>
      <PageHero band="band-lime" label="Contact" lines={['Say hi.', 'We reply fast.']} doodle="pin"
        lead="The quickest way to reach us is WhatsApp. We usually reply within 15 minutes, between tides."
        img="/img/mulki-road.jpg" alt="A palm-lined road in Mulki" />
      <WaveSection bg="--sb-offwhite" n={1}>
        <div className="two-col" style={{ marginTop: '3rem' }}>
          <div className="reveal">
            <Wavy as="p" className="label eyebrow">{"Talk to us"}</Wavy>
            <ul className="contact-list">
              <li><SocialIcon kind="whatsapp" size={40} /><div><b>WhatsApp</b><a href={wa('Hi Mulki Surf Brothers!')}>{PHONE_LABEL}</a></div></li>
              <li><SocialIcon kind="call" size={40} /><div><b>Call</b>{PHONES.map(([n, l], i) => <span key={n}>{i > 0 && ' · '}<a href={`tel:+${n}`}>{l}</a></span>)}</div></li>
              <li><span className="mail-badge"><DoodleSvg name="mail" /></span><div><b>Email</b><a href={`mailto:${EMAIL.value}`}>{EMAIL.value}</a></div></li>
              <li><SocialIcon kind="maps" size={40} /><div><b>Address</b>{ADDRESS.join(', ')}<br /><a href={MAPS}>Open in Google Maps</a></div></li>
              <li><SocialIcon kind="instagram" size={40} /><div><b>Instagram</b><a href={INSTAGRAM}>{INSTAGRAM_HANDLE}</a></div></li>
            </ul>
          </div>
          <div className="reveal contact-photo"><figure><img src="/img/boat-sunset.jpg" alt="Sunset from a boat on the river" loading="lazy" /><Wavy as="figcaption">see you out here</Wavy></figure></div>
        </div>
      </WaveSection>
      <section className="section getting-here" aria-labelledby="gh-title">
        <div className="wrap">
          <Wavy as="p" className="label eyebrow">getting here</Wavy>
          <h2 id="gh-title" style={{ fontSize: 'var(--fs-h2)' }}>Three ways to reach the waves</h2>
          <div className="gh-route">
            <svg className="gh-line draw" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 20 C150 0 250 40 400 20 S650 0 800 20 S950 40 1000 20" /></svg>
            {GETTING.map(([mode, icon, time, unit, title, text], k) => (
              <article className={`gh-card gh-${k}`} key={mode}>
                <span className="gh-icon"><DoodleSvg name={icon} /></span>
                <Wavy as="p" className="gh-mode">{mode}</Wavy>
                <p className="gh-time"><b>{time}</b> {unit}</p>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
            <div className="gh-dest"><span className="gh-icon"><DoodleSvg name="house" /></span><Wavy>you made it</Wavy><small>Surf Brothers, Bappanadu</small></div>
          </div>
        </div>
      </section>
      <Faq items={FAQ} title="Good to know" bg="var(--sb-white)" />
      <BookingBand figure="kayaker" title={<>See you<br />in Mulki.</>} />
    </>
  );
}
