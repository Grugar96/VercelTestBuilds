import { PageHero, WaveSection, CrewGrid, Testimonials, BookingBand } from '@/components/Sections';
import HandLine from '@/components/HandLine';
import { WarliCircle } from '@/components/kit/Warli';

export const metadata = { title: 'About', description: 'Mulki Surf Brothers is a surf school and riverside hostel in Mulki, Karnataka, run by a crew that feels like family.' };

export default function About() {
  return (
    <>
      <PageHero band="band-charcoal" label="About us" lines={['A community,', 'not a holiday ad.']} doodle="smile"
        lead="We're a surf school and a riverside hostel in Mulki, on the strip of sand between the Shambhavi river and the sea."
        img="/img/falls-crew.jpg" alt="The Surf Brothers crew sitting together at a waterfall" />
      <WaveSection bg="--sb-offwhite" n={2}>
        <div className="two-col" style={{ marginTop: '3rem' }}>
          <div className="reveal"><p className="intro-big">Most people come for one lesson. A lot of them end up staying the week.</p><WarliCircle size={220} className="about-circle" title="Friends dancing around the bonfire" /></div>
          <div className="reveal">
            <p className="lead">It started in 2023 with a couple of foam boards and a rack on the sand. Today it's a riverside home where beginners learn without fear and nobody gets shouted at for falling off.</p>
            <p className="muted">Everybody falls off. That's the fun part.</p>
            <HandLine text="Find your flow" />
          </div>
        </div>
      </WaveSection>
      <CrewGrid link={false} />
      <Testimonials />
      <BookingBand surfer="woman" title={<>Come join<br />the crew.</>} />
    </>
  );
}
