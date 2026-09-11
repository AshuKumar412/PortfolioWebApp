import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import './Hero.css';

export function Hero({ profile, socialLinks }) {
  const p = profile || {};
  const name = p.name || 'Your Name';
  const bio  = p.bio  || 'Passionate developer who builds elegant, high-performance applications. I turn complex problems into clean, user-friendly solutions.';
  const titles = [p.title || 'Full-Stack Developer', 'Problem Solver', 'Open Source Enthusiast'];

  const [typedText, setTypedText] = useState('');
  const [titleIdx,  setTitleIdx]  = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setTypedText(titles[titleIdx]); return; }

    let i = 0;
    let direction = 1;
    let tid;
    const current = titles[titleIdx];

    const tick = () => {
      if (direction === 1) {
        i++;
        setTypedText(current.slice(0, i));
        if (i >= current.length) { direction = -1; tid = setTimeout(tick, 1800); return; }
      } else {
        i--;
        setTypedText(current.slice(0, i));
        if (i <= 0) { setTitleIdx(idx => (idx + 1) % titles.length); return; }
      }
      tid = setTimeout(tick, direction === 1 ? 70 : 40);
    };

    tid = setTimeout(tick, 400);
    return () => clearTimeout(tid);
  }, [titleIdx]);

  const github   = socialLinks?.find(s => s.platform?.toLowerCase() === 'github')?.url   || p.github_url;
  const linkedin = socialLinks?.find(s => s.platform?.toLowerCase() === 'linkedin')?.url || p.linkedin_url;
  const email    = p.email;

  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />
      <div className="hero__orb hero__orb--3" aria-hidden="true" />
      <div className="hero__grid"             aria-hidden="true" />

      <div className="hero__content container">
        <div className="hero__text">
          {p.is_available !== false && (
            <div className="hero__available" role="status">
              <span className="hero__available-dot" aria-hidden="true" />
              Available for opportunities
            </div>
          )}

          <h1 className="hero__name">
            Hi, I&apos;m <span className="gradient-text">{name}</span>
          </h1>

          <p className="hero__title" aria-live="polite">
            <span className="hero__typed">{typedText}</span>
            <span className="hero__cursor" aria-hidden="true" />
          </p>

          <p className="hero__bio">{bio}</p>

          <div className="hero__actions">
            <Button as="a" href="#projects" size="lg" variant="primary">
              View Projects
            </Button>
            {p.resume_url ? (
              <Button as="a" href={p.resume_url} target="_blank" rel="noopener noreferrer" size="lg" variant="secondary">
                ↓ Download Resume
              </Button>
            ) : (
              <Button as="a" href="#contact" size="lg" variant="secondary">
                Get In Touch
              </Button>
            )}
          </div>

          <div className="hero__socials">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="GitHub profile">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn profile">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="hero__social-link" aria-label="Send email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </a>
            )}
          </div>
        </div>

        <div className="hero__visual">
          {p.avatar_url ? (
            <div className="hero__avatar-wrap">
              <img
                src={p.avatar_url}
                alt={`${name} - profile photo`}
                className="hero__avatar-img"
                fetchpriority="high"
                width="380"
                height="380"
              />
              <div className="hero__avatar-ring" aria-hidden="true" />
            </div>
          ) : (
            <div className="hero__avatar-wrap">
              <div className="hero__avatar-placeholder" aria-label="Profile photo placeholder">
                <span aria-hidden="true">{name[0] || 'A'}</span>
              </div>
              <div className="hero__avatar-ring" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      <a href="#about" className="hero__scroll-cue" aria-label="Scroll to About section">
        <div className="hero__scroll-mouse" aria-hidden="true">
          <div className="hero__scroll-dot" />
        </div>
      </a>
    </section>
  );
}
