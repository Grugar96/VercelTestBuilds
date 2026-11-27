import { SocialIcon } from '@/components/Social';
import Wavy from '@/components/Wavy';
import { PageHero, WaveSection, BookingBand } from '@/components/Sections';
import GalleryGrid from '@/components/GalleryGrid';
import { INSTAGRAM, INSTAGRAM_HANDLE } from '@/lib/site';

export const metadata = { title: 'Gallery', description: 'Photos from Mulki Surf Brothers: surf sessions, the riverside hostel, kayaking and crew days out.' };

export default function Gallery() {
  return (
    <>
      <PageHero band="band-ocean" label="Gallery" lines={['Life between', 'river & ocean.']} doodle="sun"
        lead="Real days at Surf Brothers. No stock photos, no filters beyond a little sunset."
        img="/img/sunset-surfers.jpg" alt="Surfers waiting for waves at sunset" />
      <WaveSection bg="--sb-offwhite" n={0}>
        <GalleryGrid />
        <a className="insta-cta" href={INSTAGRAM} aria-label="More on Instagram"><SocialIcon kind="instagram" size={52} /><span><Wavy>more every week on</Wavy><b>{INSTAGRAM_HANDLE}</b></span></a>
      </WaveSection>
      <BookingBand figure="skater" title={<>Want to be<br />in the next one?</>} />
    </>
  );
}
