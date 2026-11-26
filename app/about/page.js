import { PageHero, WaveSection, CrewGrid, Testimonials, BookingBand } from '@/components/Sections';
import HandLine from '@/components/HandLine';

export const metadata = { title: 'About', description: 'Mulki Surf Brothers is a surf school and riverside hostel in Mulki, Karnataka, run by a crew that feels like family.' };

export default function About() {
  return (
    <>
      <PageHero band="band-charcoal" label="About us" lines={['A community,', 'not a holiday ad.']} doodle="smile"
        lead="Mulki Surf Brothers is a surf school and riverside hostel where the river meets the ocean. Come for a session, stay a little longer, leave with stories."
        img="/img/falls-crew.jpg" alt="The Surf Brothers crew sitting together at a waterfall" />
      <WaveSection bg="--sb-offwhite" n={2}>
        <div className="two-col" style={{ marginTop: '3rem' }}>
          <div className="reveal"><p className="intro-big">Learn to surf. Stay a little longer. Make friends. Explore Mulki. Leave with stories.</p></div>
          <div className="reveal">
            <p className="lead">It started in 2023 with a couple of foam boards and a rack on the sand. Today it's a riverside home where beginners learn without fear and nobody gets shouted at for falling off.</p>
            <p className="muted">Everybody falls off. That's the fun part.</p>
            <HandLine text="Find your flow" />
          </div>
        </div>
      </WaveSection>
      <CrewGrid link={false} />
      <Testimonials />
      <BookingBand title={<>Come join<br />the crew.</>} />
    </>
  );
}
