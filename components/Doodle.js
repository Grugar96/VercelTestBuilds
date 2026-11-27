// Site icons in the Warli-inspired paint style: solid flat shapes (class "f"), a few thin painted lines
// (class "s"), one colour, with the shared paint-grain filter (#sb-paint, defined once in the layout).
const D = {
  wave: <>
    <path className="f" d="M3 36c6-1 9-4 11-9 3-9 9-15 18-15 8 0 13 6 12 12-1 5-6 7-9 4-2-2 0-5 2-5-1-3-5-4-8-2-5 3-5 11-1 15H3z" />
    <path className="s" d="M3 42c5-3 9-3 14 0s9 3 14 0 9-3 14 0" />
  </>,
  board: <>
    <path className="f" d="M33 4c6 3 4 14-3 24S16 44 12 44c-4-1-3-9 3-19S28 2 33 4z" />
    <path className="cut" d="M30 9C24 17 18 29 14 39" />
    <path className="f" d="M15 37l-4 5 6-2z" />
  </>,
  sun: <>
    <circle className="f" cx="24" cy="24" r="9" />
    <path className="f" d="M24 3l3 8h-6zM24 45l-3-8h6zM3 24l8-3v6zM45 24l-8 3v-6zM9 9l8 4-4 4zM39 39l-8-4 4-4zM39 9l-4 8-4-4zM9 39l4-8 4 4z" />
  </>,
  kayak: <>
    <path className="f" d="M3 31c10-3 32-3 42 0-6 7-36 7-42 0z" />
    <path className="f" d="M18 18h12l-6 11z" />
    <circle className="f" cx="24" cy="12" r="4.2" />
    <path className="s" d="M8 34L40 14" />
    <path className="f" d="M5 36c-1-3 1-5 4-5 1 3-1 5-4 5zM43 12c1 3-1 5-4 5-1-3 1-5 4-5z" />
  </>,
  palm: <>
    <path className="f" d="M22 14c1 10 1 20-3 31h5c3-11 3-21 1-31z" />
    <path className="s" d="M23 13c-5-5-12-5-18-1M23 13c5-6 13-6 19-1M23 13c-3-5-1-9 3-11M23 13c-4 3-6 8-6 13M23 13c4 3 7 7 8 12" />
    <circle className="f" cx="21" cy="16" r="2.6" /><circle className="f" cx="26" cy="16" r="2.6" />
  </>,
  fire: <>
    <path className="f" d="M24 4c7 8 11 14 8 22-1 4-5 7-8 7s-8-3-9-8c-1-5 2-8 4-11 0 4 1 6 3 7 0-6-1-11 2-17z" />
    <path className="f" d="M8 36l32 6-1 3L7 39zM40 36L8 42l1 3 32-6z" />
  </>,
  smile: <>
    <circle className="f" cx="24" cy="8" r="4.6" />
    <path className="f" d="M16 15h16l-8 12zM24 27l-7 11h14z" />
    <path className="s" d="M17 16l-7-8M31 16l7-7M20 38l-3 7M28 38l3 7" />
  </>,
  pin: <>
    <path className="f" fillRule="evenodd" d="M24 45S10 30 10 19a14 14 0 0 1 28 0c0 11-14 26-14 26zm0-20a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
  </>,
  sparkle: <>
    <path className="f" d="M18 4c1 9 4 12 12 13-8 1-11 4-12 13-1-9-4-12-12-13 8-1 11-4 12-13z" />
    <path className="f" d="M36 26c.7 5 2 6.3 7 7-5 .7-6.3 2-7 7-.7-5-2-6.3-7-7 5-.7 6.3-2 7-7z" />
  </>,
  arrow: <>
    <path className="s" d="M6 31c10-14 24-18 34-12" />
    <path className="f" d="M41 19l-10-5 3 6-3 6z" />
  </>,
  house: <>
    <path className="f" d="M4 24L24 7l20 17z" />
    <path className="f" fillRule="evenodd" d="M10 24h28v18H10zm11 18v-10h6v10z" />
  </>,
};

export function DoodleSvg({ name, className = 'doodle' }) {
  return <svg className={className} viewBox="0 0 48 48" aria-hidden="true">{D[name]}</svg>;
}

export default function Doodle({ name, className = '', style }) {
  return <span className={className} style={style}><DoodleSvg name={name} /></span>;
}

export const DOODLE_PATHS = D;
