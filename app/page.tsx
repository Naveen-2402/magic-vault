'use client';

import { useState, useEffect, useRef } from 'react';
import SecretGate from '@/components/SecretGate';

export default function HomePage() {
  const [clickCount, setClickCount] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    if (newCount === 3) {
      setShowGate(true);
      setClickCount(0);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      setClickCount(newCount);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setClickCount(0), 2000);
    }
  };

  const capabilities = [
    {
      index: '01',
      title: 'Precision Analytics',
      desc: 'Navigate market turbulence with signal-to-noise intelligence. Our models surface what matters before your competitors see it.',
    },
    {
      index: '02',
      title: 'Rapid Deployment',
      desc: 'Elastic infrastructure that breathes with your demand. From zero to global in hours — your roadmap, unblocked.',
    },
    {
      index: '03',
      title: 'Enterprise Security',
      desc: 'Zero-trust by architecture, not afterthought. Every layer hardened, every access verified, every audit pristine.',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ns-root {
          --ink: #0e0e0d;
          --ink-2: #3a3a36;
          --ink-3: #7a7a73;
          --ink-4: #b5b5ac;
          --paper: #f5f4f0;
          --paper-2: #eeecea;
          --paper-3: #e4e2de;
          --gold: #b89a5e;
          --gold-light: #d4b87a;
          --serif: 'Cormorant Garamond', Georgia, serif;
          --sans: 'DM Sans', system-ui, sans-serif;
          font-family: var(--sans);
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* NAV */
        .ns-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          padding: 0 2.5rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.4s, border-color 0.4s;
        }
        .ns-nav.scrolled {
          background: rgba(245,244,240,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--paper-3);
        }
        .ns-logo {
          display: flex;
          align-items: baseline;
          gap: 0.15rem;
          text-decoration: none;
        }
        .ns-logo-mark {
          font-family: var(--serif);
          font-size: 1.55rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .ns-logo-sub {
          font-family: var(--sans);
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-left: 0.4rem;
        }
        .ns-nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        .ns-nav-links a {
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-2);
          transition: color 0.2s;
        }
        .ns-nav-links a:hover { color: var(--gold); }
        .ns-nav-cta {
          font-family: var(--sans);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--paper);
          background: var(--ink);
          border: none;
          padding: 0.65rem 1.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ns-nav-cta:hover { background: var(--ink-2); }

        /* HERO */
        .ns-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 68px;
        }
        .ns-hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5rem 4rem 5rem 5rem;
          border-right: 1px solid var(--paper-3);
        }
        .ns-eyebrow {
          font-size: 0.68rem;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .ns-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: var(--gold);
        }
        .ns-headline {
          font-family: var(--serif);
          font-size: clamp(3rem, 5.5vw, 5.5rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 2rem;
        }
        .ns-headline em {
          font-style: italic;
          color: var(--ink-2);
        }
        .ns-subline {
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.7;
          color: var(--ink-3);
          max-width: 42ch;
          margin-bottom: 3.5rem;
        }
        .ns-hero-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .ns-btn-primary {
          font-family: var(--sans);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: var(--ink);
          color: var(--paper);
          border: 1px solid var(--ink);
          padding: 1rem 2.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ns-btn-primary:hover {
          background: transparent;
          color: var(--ink);
        }
        .ns-btn-ghost {
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--ink-3);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }
        .ns-btn-ghost:hover { color: var(--ink); }
        .ns-btn-ghost svg { transition: transform 0.2s; }
        .ns-btn-ghost:hover svg { transform: translateX(4px); }

        /* Hero right - visual panel */
        .ns-hero-right {
          position: relative;
          background: var(--ink);
          overflow: hidden;
        }
        .ns-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
          mix-blend-mode: luminosity;
        }
        .ns-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(14,14,13,0.6) 0%, rgba(14,14,13,0.1) 100%);
        }
        .ns-hero-stat-group {
          position: absolute;
          bottom: 3rem;
          left: 3rem;
          right: 3rem;
          display: flex;
          gap: 2.5rem;
        }
        .ns-stat {
          border-top: 1px solid rgba(245,244,240,0.2);
          padding-top: 1rem;
        }
        .ns-stat-num {
          font-family: var(--serif);
          font-size: 2.2rem;
          font-weight: 300;
          color: var(--paper);
          line-height: 1;
          margin-bottom: 0.35rem;
        }
        .ns-stat-label {
          font-size: 0.68rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,244,240,0.45);
        }
        .ns-badge {
          position: absolute;
          top: 2.5rem;
          right: 2.5rem;
          border: 1px solid rgba(184,154,94,0.4);
          padding: 0.6rem 1rem;
        }
        .ns-badge-text {
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold-light);
        }

        /* DIVIDER */
        .ns-divider {
          display: flex;
          align-items: center;
          padding: 0 5rem;
          gap: 2rem;
          border-top: 1px solid var(--paper-3);
          border-bottom: 1px solid var(--paper-3);
        }
        .ns-divider-label {
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ink-4);
          white-space: nowrap;
          padding: 1.2rem 0;
        }
        .ns-divider-line {
          flex: 1;
          height: 1px;
          background: var(--paper-3);
        }
        .ns-trust-logos {
          display: flex;
          gap: 3rem;
          align-items: center;
          padding: 1.2rem 0;
        }
        .ns-trust-logo {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ink-4);
        }

        /* CAPABILITIES */
        .ns-capabilities {
          padding: 7rem 5rem;
        }
        .ns-section-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 5rem;
          align-items: end;
          border-bottom: 1px solid var(--paper-3);
          padding-bottom: 3rem;
        }
        .ns-section-label {
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.25rem;
        }
        .ns-section-title {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 3.5vw, 3.5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--ink);
        }
        .ns-secret-word {
          cursor: default;
          user-select: none;
        }
        .ns-section-body {
          font-size: 0.95rem;
          font-weight: 300;
          line-height: 1.8;
          color: var(--ink-3);
          max-width: 44ch;
          align-self: end;
        }

        /* Capability rows */
        .ns-cap-list {
          display: flex;
          flex-direction: column;
        }
        .ns-cap-item {
          display: grid;
          grid-template-columns: 4rem 1fr auto;
          align-items: start;
          gap: 2rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--paper-3);
          transition: background 0.2s;
          cursor: default;
        }
        .ns-cap-item:first-child { border-top: 1px solid var(--paper-3); }
        .ns-cap-item:hover { background: var(--paper-2); margin: 0 -5rem; padding: 2.5rem 5rem; }
        .ns-cap-index {
          font-family: var(--serif);
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--ink-4);
          padding-top: 0.25rem;
        }
        .ns-cap-title {
          font-family: var(--serif);
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 0.6rem;
        }
        .ns-cap-desc {
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.7;
          color: var(--ink-3);
          max-width: 52ch;
        }
        .ns-cap-arrow {
          width: 36px;
          height: 36px;
          border: 1px solid var(--paper-3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-3);
          transition: all 0.2s;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .ns-cap-item:hover .ns-cap-arrow {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }

        /* CTA BAND */
        .ns-cta-band {
          background: var(--ink);
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .ns-cta-left {
          padding: 6rem 5rem;
          border-right: 1px solid rgba(245,244,240,0.08);
        }
        .ns-cta-eyebrow {
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.5rem;
        }
        .ns-cta-title {
          font-family: var(--serif);
          font-size: clamp(2rem, 3vw, 3rem);
          font-weight: 300;
          line-height: 1.15;
          color: var(--paper);
          margin-bottom: 2.5rem;
        }
        .ns-btn-light {
          font-family: var(--sans);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: var(--paper);
          color: var(--ink);
          border: 1px solid var(--paper);
          padding: 1rem 2.25rem;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-block;
        }
        .ns-btn-light:hover {
          background: transparent;
          color: var(--paper);
        }
        .ns-cta-right {
          padding: 6rem 5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ns-cta-quote {
          font-family: var(--serif);
          font-size: 1.25rem;
          font-weight: 300;
          font-style: italic;
          line-height: 1.6;
          color: rgba(245,244,240,0.7);
          margin-bottom: 2rem;
          position: relative;
          padding-left: 1.5rem;
          border-left: 1px solid var(--gold);
        }
        .ns-cta-attribution {
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(245,244,240,0.3);
        }

        /* FOOTER */
        .ns-footer {
          padding: 4rem 5rem;
          border-top: 1px solid var(--paper-3);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 3rem;
          align-items: end;
        }
        .ns-footer-brand {
          font-family: var(--serif);
          font-size: 1.4rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 0.75rem;
        }
        .ns-footer-tagline {
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--ink-3);
          line-height: 1.6;
        }
        .ns-footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ns-footer-links a {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--ink-3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .ns-footer-links a:hover { color: var(--ink); }
        .ns-footer-legal {
          font-size: 0.72rem;
          color: var(--ink-4);
          line-height: 1.6;
          text-align: right;
        }

        /* MODAL OVERLAY */
        .ns-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(14,14,13,0.85);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 900px) {
          .ns-hero { grid-template-columns: 1fr; min-height: auto; }
          .ns-hero-left { padding: 3rem 2rem; border-right: none; border-bottom: 1px solid var(--paper-3); }
          .ns-hero-right { min-height: 50vw; }
          .ns-section-header { grid-template-columns: 1fr; }
          .ns-capabilities { padding: 4rem 2rem; }
          .ns-cap-item { grid-template-columns: 2.5rem 1fr; }
          .ns-cap-arrow { display: none; }
          .ns-cap-item:hover { margin: 0; padding: 2.5rem 0; }
          .ns-cta-band { grid-template-columns: 1fr; }
          .ns-cta-left { padding: 4rem 2rem; border-right: none; border-bottom: 1px solid rgba(245,244,240,0.08); }
          .ns-cta-right { padding: 4rem 2rem; }
          .ns-footer { grid-template-columns: 1fr; }
          .ns-footer-legal { text-align: left; }
          .ns-divider { padding: 0 2rem; }
          .ns-trust-logos { gap: 1.5rem; }
          .ns-nav { padding: 0 1.5rem; }
          .ns-nav-links { display: none; }
        }
      `}</style>

      <div className="ns-root">
        {showGate && (
          <div className="ns-modal-overlay" onClick={() => setShowGate(false)}>
            <div onClick={e => e.stopPropagation()}>
              <SecretGate onClose={() => setShowGate(false)} />
            </div>
          </div>
        )}

        {/* NAV */}
        <header className={`ns-nav${scrolled ? ' scrolled' : ''}`}>
          <a href="#" className="ns-logo">
            <span className="ns-logo-mark">Nexus</span>
            <span className="ns-logo-sub">Systems</span>
          </a>
          <nav>
            <ul className="ns-nav-links">
              {['Solutions', 'Industries', 'About', 'Careers'].map(item => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </nav>
          <button className="ns-nav-cta">Request Demo</button>
        </header>

        {/* HERO */}
        <section className="ns-hero">
          <div className="ns-hero-left">
            <p className="ns-eyebrow">Digital Transformation 2.0</p>
            <h1 className="ns-headline">
              Engineering the<br />
              <em>future of</em> scalable<br />
              digital enterprise.
            </h1>
            <p className="ns-subline">
              Nexus Systems integrates advanced cloud orchestration with cutting-edge intelligence to accelerate your business velocity — at any altitude.
            </p>
            <div className="ns-hero-actions">
              <button className="ns-btn-primary">Get Started</button>
              <button className="ns-btn-ghost">
                Explore Platform
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="ns-hero-right">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1400&auto=format&fit=crop"
              alt="Global infrastructure"
              className="ns-hero-img"
            />
            <div className="ns-hero-overlay" />
            <div className="ns-badge">
              <p className="ns-badge-text">Est. 2014 · Palo Alto</p>
            </div>
            <div className="ns-hero-stat-group">
              {[['340+', 'Enterprise clients'], ['99.99%', 'Uptime SLA'], ['14ms', 'Avg. response']].map(([n, l]) => (
                <div key={l} className="ns-stat">
                  <p className="ns-stat-num">{n}</p>
                  <p className="ns-stat-label">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST DIVIDER */}
        <div className="ns-divider">
          <p className="ns-divider-label">Trusted by</p>
          <div className="ns-divider-line" />
          <div className="ns-trust-logos">
            {['Meridian Capital', 'Orbis Group', 'Stratos Bank', 'Helios Corp'].map(name => (
              <span key={name} className="ns-trust-logo">{name}</span>
            ))}
          </div>
        </div>

        {/* CAPABILITIES */}
        <section className="ns-capabilities">
          <div className="ns-section-header">
            <div>
              <p className="ns-section-label">Core Competencies</p>
              <h2 className="ns-section-title">
                Mastering technological{' '}
                <span
                  className="ns-secret-word"
                  onClick={handleSecretClick}
                >
                  complexity.
                </span>
              </h2>
            </div>
            <p className="ns-section-body">
              We simplify the intricate, allowing you to focus on strategic growth and innovation — while we handle the infrastructure that powers it.
            </p>
          </div>

          <div className="ns-cap-list">
            {capabilities.map((cap) => (
              <div key={cap.index} className="ns-cap-item">
                <span className="ns-cap-index">{cap.index}</span>
                <div>
                  <h3 className="ns-cap-title">{cap.title}</h3>
                  <p className="ns-cap-desc">{cap.desc}</p>
                </div>
                <div className="ns-cap-arrow">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BAND */}
        <section className="ns-cta-band">
          <div className="ns-cta-left">
            <p className="ns-cta-eyebrow">Work with us</p>
            <h2 className="ns-cta-title">
              Ready to compress<br />
              your timeline to scale?
            </h2>
            <button className="ns-btn-light">Request a Consultation</button>
          </div>
          <div className="ns-cta-right">
            <p className="ns-cta-quote">
              "Nexus didn't just modernise our infrastructure — they fundamentally changed how we think about velocity."
            </p>
            <p className="ns-cta-attribution">— CTO, Meridian Capital Group</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ns-footer">
          <div>
            <p className="ns-footer-brand">Nexus Systems</p>
            <p className="ns-footer-tagline">
              Global cloud orchestration and intelligence infrastructure.<br />
              Palo Alto · London · Singapore
            </p>
          </div>
          <div className="ns-footer-links">
            {['Solutions', 'Industries', 'About', 'Careers', 'Press'].map(item => (
              <a key={item} href="#">{item}</a>
            ))}
          </div>
          <p className="ns-footer-legal">
            © {new Date().getFullYear()} Nexus Systems International.<br />
            All rights reserved.<br />
            Privacy · Terms · Security
          </p>
        </footer>
      </div>
    </>
  );
}