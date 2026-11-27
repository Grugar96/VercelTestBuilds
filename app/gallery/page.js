import { PageHero, WaveSection, BookingBand } from '@/components/Sections';
import GalleryGrid from '@/components/GalleryGrid';
import { INSTAGRAM } from '@/lib/site';

export const metadata = { title: 'Gallery', description: 'Photos from Mulki Surf Brothers: surf sessions, the riverside hostel, kayaking and crew days out.' };

export default function Gallery() {
  return (
    <>
      <PageHero band="band-ocean" label="Gallery" lines={['Life between', 'river & ocean.']} doodle="sun"
        lead="Real days at Surf Brothers. No stock photos, no filters beyond a little sunset."
        img="/img/sunset-surfers.jpg" alt="Surfers waiting for waves at sunset" />
      <WaveSection bg="--sb-offwhite" n={0}>
        <GalleryGrid />
        <p className="fineprint">More every week on <a href={INSTAGRAM}>Instagram</a>.</p>
      </WaveSection>
      <BookingBand figure="skater" title={<>Want to be<br />in the next one?</>} />
    </>
  );
}
