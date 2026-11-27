import Wavy from '@/components/Wavy';
import Doodle from '@/components/Doodle';
import { SocialIcon } from '@/components/Social';
import { PageHero, WaveSection, Faq, BookingBand } from '@/components/Sections';
import { ADDRESS, EMAIL, INSTAGRAM, INSTAGRAM_HANDLE, MAPS, PHONES, PHONE_LABEL, wa } from '@/lib/site';

export const metadata = { title: 'Contact', description: 'How to reach Mulki Surf Brothers in Mulki, Karnataka: WhatsApp, phone, email, and getting here by train, bus or plane.' };

const FAQ = [
  ['What are the check-in and check-out times?', 'Check-in from 1:00 PM, check-out by 11:00 AM. Arriving early? Tell us and we’ll keep your bags safe.'],
  ['Can I work remotely from here?', 'Yes. There’s high-speed fiber Wi-Fi across the hostel and riverside deck, and afternoons are quiet once the morning session is done.'],
  ['When is the surf season?', 'September to May. June to August is monsoon, when the sea is too rough for lessons.'],
  ['How do I pay?', 'Send a booking request and we confirm availability on WhatsApp. Surf Only needs full payment to confirm (no refund after booking). Stay & Surf needs a \u20b92,000 advance per person (non-refundable), and the rest is paid at check-in.'],
  ['Can you arrange an airport or station pickup?', 'Yes, on request. Tell us your arrival time and we’ll arrange a cab from Mangaluru airport or the station.'],
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
              <li><Doodle name="wave" /><div><b>Email</b><a href={`mailto:${EMAIL.value}`}>{EMAIL.value}</a></div></li>
              <li><SocialIcon kind="maps" size={40} /><div><b>Address</b>{ADDRESS.join(', ')}<br /><a href={MAPS}>Open in Google Maps</a></div></li>
              <li><SocialIcon kind="instagram" size={40} /><div><b>Instagram</b><a href={INSTAGRAM}>{INSTAGRAM_HANDLE}</a></div></li>
            </ul>
          </div>
          <div className="reveal">
            <Wavy as="p" className="label eyebrow">{"Getting here"}</Wavy>
            <div className="schedule">
              <div><time>By air</time><div><h3>Mangaluru airport (IXE)</h3><p>About 25 minutes north by road on NH66. Take a prepaid taxi (around ₹800–1,100) or ask us to arrange a pickup.</p></div></div>
              <div><time>By train</time><div><h3>Mulki or Surathkal station</h3><p>5–15 minutes away. Trains from Goa, Mumbai, Bengaluru and Kerala stop here. Autos wait outside.</p></div></div>
              <div><time>By bus</time><div><h3>NH66, Mulki bus stand</h3><p>Overnight sleeper buses from Bengaluru and Mumbai drop you at Mulki, about 3 minutes from the river.</p></div></div>
            </div>
          </div>
        </div>
      </WaveSection>
      <Faq items={FAQ} title="Good to know" bg="var(--sb-white)" />
      <BookingBand figure="kayaker" title={<>See you<br />in Mulki.</>} />
    </>
  );
}
