'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV } from '@/lib/site';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtn = useRef(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.current?.focus();
  }, [open]);

  const links = NAV.map(([href, label]) => (
    <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>
  ));

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap">
          <Link className="brand" href="/" aria-label="Mulki Surf Brothers home">
            <img src="/img/logo-mark.png" alt="Mulki Surf Brothers" width="96" height="94" />
          </Link>
          <nav className="nav" aria-label="Main">{links}</nav>
          <Link className="btn btn-primary header-cta" href="/book">Book</Link>
          <button ref={menuBtn} className="menu-btn" type="button" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 7c6-1.5 12 1.5 18 0M3 12h18M3 17c6 1.5 12-1.5 18 0" /></svg>
          </button>
        </div>
      </header>
      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu"
        onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); } }}>
        <button ref={closeBtn} className="close" type="button" aria-label="Close menu" onClick={() => { setOpen(false); menuBtn.current?.focus(); }}>×</button>
        <nav aria-label="Mobile">{links}<Link href="/">Home</Link></nav>
        <Link className="btn btn-primary" href="/book">Plan your stay</Link>
      </div>
    </>
  );
}
