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
  tick: <>
    <path className="f" d="M5 25c3-3 6-3 9 0l6 6C26 20 33 11 41 5c3-2 5 0 3 3C35 17 28 28 23 40c-1 3-4 3-6 1L5 30c-2-2-2-3 0-5z" />
  </>,
  cycle: <>
    <circle className="s" cx="12" cy="33" r="8" /><circle className="s" cx="36" cy="33" r="8" />
    <path className="s" d="M12 33l8-14h12l4 14M20 19l6 14h-14M30 12h6" />
    <circle className="f" cx="25" cy="9" r="3.4" /><path className="f" d="M21 13h8l-4 6z" />
  </>,
  snow: <>
    <path className="s" d="M24 4v40M7 14l34 20M41 14L7 34" />
    <path className="s" d="M19 7l5 5 5-5M19 41l5-5 5 5M6 20l7-2-2-7M42 28l-7 2 2 7M42 20l-7-2 2-7M6 28l7 2-2 7" />
    <circle className="f" cx="24" cy="24" r="4" />
  </>,
  wifi: <>
    <path className="s" d="M6 19c10-9 26-9 36 0M12 26c7-6 17-6 24 0M18 32c4-3 8-3 12 0" />
    <circle className="f" cx="24" cy="38" r="3.6" />
  </>,
  clock: <>
    <circle className="f" cx="24" cy="25" r="18" />
    <path className="cut" style={{ strokeWidth: 3 }} d="M24 14v12l7 5" />
    <path className="f" d="M18 3h12v4H18z" />
  </>,
  group: <>
    <circle className="f" cx="14" cy="9" r="4" /><path className="f" d="M7 15h14l-7 10zM14 25l-6 9h12z" />
    <circle className="f" cx="34" cy="9" r="4" /><path className="f" d="M27 15h14l-7 10zM34 25l-6 9h12z" />
    <path className="s" d="M20 17l7 0M11 34l-2 9M17 34l2 9M31 34l-2 9M37 34l2 9M8 16l-4 7M40 16l4 7" />
  </>,
  plane: <>
    <path className="f" d="M44 6c2 2 0 6-3 9l-7 7 5 20-4 3-9-15-8 8 1 7-3 2-4-8-8-4 2-3 7 1 8-8-15-9 3-4 20 5 7-7c3-3 7-5 9-3z" />
  </>,
  train: <>
    <path className="f" fillRule="evenodd" d="M12 6h24c3 0 5 2 5 5v20c0 3-2 5-5 5H12c-3 0-5-2-5-5V11c0-3 2-5 5-5zm1 6v9h22v-9zm2 15a3 3 0 1 0 0.1 0zm18 0a3 3 0 1 0 0.1 0z" />
    <path className="s" d="M14 36l-6 9M34 36l6 9M10 43h28" />
  </>,
  bus: <>
    <path className="f" fillRule="evenodd" d="M9 7h30c2 0 4 2 4 4v24c0 2-2 4-4 4H9c-2 0-4-2-4-4V11c0-2 2-4 4-4zm1 5v10h12V12zm16 0v10h12V12zm-14 17a2.5 2.5 0 1 0 .1 0zm24 0a2.5 2.5 0 1 0 .1 0z" />
    <circle className="f" cx="14" cy="41" r="4" /><circle className="f" cx="34" cy="41" r="4" />
  </>,
  pot: <>
    <path className="f" d="M7 20h34v4c0 10-7 17-17 17S7 34 7 24z" />
    <path className="f" d="M4 19h40v4H4z" />
    <path className="s" d="M17 13c-2-3 2-5 0-8M24 13c-2-3 2-5 0-8M31 13c-2-3 2-5 0-8" />
  </>,
  lock: <>
    <path className="s" d="M15 21v-6a9 9 0 0 1 18 0v6" />
    <path className="f" fillRule="evenodd" d="M9 21h30v22H9zm15 7a3 3 0 0 0-1.5 5.6V37h3v-3.4A3 3 0 0 0 24 28z" />
  </>,
  drop: <>
    <path className="f" d="M24 4C18 14 11 21 11 30a13 13 0 0 0 26 0c0-9-7-16-13-26z" />
  </>,
  camera: <>
    <path className="f" fillRule="evenodd" d="M8 14h8l3-5h10l3 5h8c2 0 4 2 4 4v19c0 2-2 4-4 4H8c-2 0-4-2-4-4V18c0-2 2-4 4-4zm16 6a8 8 0 1 0 .1 0z" />
  </>,
  mail: <>
    <path className="f" fillRule="evenodd" d="M5 11h38v26H5zm4 4v.6l15 11 15-11V15L24 26z" />
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
