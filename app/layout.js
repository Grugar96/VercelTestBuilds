import { Oswald, Roboto, Caveat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollEffects from '@/components/ScrollEffects';

const oswald = Oswald({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-oswald', display: 'swap' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], weight: ['600'], variable: '--font-caveat', display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'),
  title: { default: 'Mulki Surf Brothers — Surf school & riverside stay in Mulki', template: '%s — Mulki Surf Brothers' },
  description: 'Learn to surf in Mulki, Karnataka. Beginner surf lessons, riverside camping and dorms by the Shambhavi river, kayaking and a crew that feels like family.',
  openGraph: { title: 'Mulki Surf Brothers — Stay • Surf • Belong', description: 'Surf lessons, riverside stays and good people in Mulki, Karnataka.', images: ['/img/sunset-board.jpg'], type: 'website' },
};

export const viewport = { themeColor: '#3B96B5' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${oswald.variable} ${roboto.variable} ${caveat.variable}`}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollEffects />
      </body>
    </html>
  );
}
