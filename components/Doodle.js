// Hand-drawn style icons in one 2.5px stroke. Swap these paths for the illustrator's final SVGs.
const D = {
  wave: <><path d="M4 28c4-5 8-5 11 0s8 5 11 0 8-5 11 0 6 4 7 3" /><path d="M6 36c4-3 7-3 10 0s7 3 10 0 7-3 10 0" /></>,
  board: <><path d="M13 43c-4-3 1-21 11-32 4-4 9-7 10-6 2 1-1 6-4 10-9 11-12 31-17 28z" /><path d="M18 35l5 3" /><path d="M22 26c3-6 6-10 9-13" /></>,
  sun: <><circle cx="24" cy="24" r="8.5" /><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4 4M33.5 33.5l4 4M37.5 10.5l-4 4M14.5 33.5l-4 4" /></>,
  kayak: <><path d="M3 30c9 6 33 6 42 0-9-5-33-5-42 0z" /><path d="M11 13l26 29" /><path d="M8 9c2 0 5 3 5 5-2 0-5-3-5-5zM40 46c-2 0-5-3-5-5 2 0 5 3 5 5z" /></>,
  palm: <><path d="M25 45c0-9 2-17-1-27" /><path d="M24 18c-5-6-12-6-17-2 6-1 11 1 13 5" /><path d="M24 18c4-7 12-8 17-4-6 0-11 2-13 6" /><path d="M24 18c-2-6-1-11 3-14 0 5 0 9-1 13" /><path d="M16 45h18" /></>,
  fire: <><path d="M24 38c-7 0-10-5-9-10 1-5 5-6 6-12 5 4 9 9 9 13 2-1 2-4 2-6 3 3 4 8 2 11s-5 4-10 4z" /><path d="M10 43l28-5M10 38l28 5" /></>,
  smile: <><path d="M24 5c11 0 19 8 19 19s-8 19-19 19S5 35 5 24 13 5 24 5z" /><path d="M17 19v3M31 19v3" /><path d="M15 29c4 6 14 6 18 0" /></>,
  pin: <><path d="M24 44S11 31 11 20a13 13 0 0 1 26 0c0 11-13 24-13 24z" /><circle cx="24" cy="20" r="4.5" /></>,
  sparkle: <><path d="M18 6c1 8 3 10 11 11-8 1-10 3-11 11-1-8-3-10-11-11 8-1 10-3 11-11z" /><path d="M36 26c.6 4 1.6 5 5.6 5.6-4 .6-5 1.6-5.6 5.6-.6-4-1.6-5-5.6-5.6 4-.6 5-1.6 5.6-5.6z" /></>,
  arrow: <><path d="M6 30c10-14 24-18 34-12" /><path d="M33 13l7 5-6 7" /></>,
  house: <><path d="M8 26l16-14 16 14M12 23v16h24V23M21 39v-9h6v9" /></>,
};

export function DoodleSvg({ name, className = 'doodle' }) {
  return <svg className={className} viewBox="0 0 48 48" aria-hidden="true">{D[name]}</svg>;
}

export default function Doodle({ name, className = '', style }) {
  return <span className={className} style={style}><DoodleSvg name={name} /></span>;
}

export const DOODLE_PATHS = D;
