'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Slide = {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  copy: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlay: string; // css gradient on top of hero_bg.png
};

const SLIDES: Slide[] = [
  {
    eyebrow: '🌿 Pure. Natural. Potent.',
    titleTop: 'Natural Luxury.',
    titleAccent: 'Redefined.',
    copy: 'Experience the finest essential oils, raw butters, and luxury powders sourced directly from nature.',
    primaryCta: { label: 'Shop Collection', href: '#products' },
    secondaryCta: { label: 'Create Account', href: '/register' },
    overlay:
      'linear-gradient(135deg, rgba(250,248,246,0.97) 0%, rgba(237,232,228,0.92) 100%)',
  },
  {
    eyebrow: '✨ Bulgarian · Moroccan · Ceylon',
    titleTop: 'Sourced at the',
    titleAccent: 'Origin.',
    copy: 'Single-origin essential oils and raw butters, cold-pressed and unrefined. Traceable from grower to bottle.',
    primaryCta: { label: 'Browse Essential Oils', href: '#products' },
    overlay:
      'linear-gradient(135deg, rgba(237,232,228,0.92) 0%, rgba(208,152,162,0.55) 100%)',
  },
  {
    eyebrow: '🧴 Bulk &amp; Retail',
    titleTop: 'From 50ml',
    titleAccent: 'to a full Kilo.',
    copy: 'Whether you craft balms at your kitchen table or run a salon, every product ships in the size you need.',
    primaryCta: { label: 'See All Sizes', href: '#products' },
    overlay:
      'linear-gradient(135deg, rgba(51,39,26,0.55) 0%, rgba(159,119,38,0.45) 100%)',
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const goTo = (i: number) => setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative', overflow: 'hidden', minHeight: '520px' }}
      aria-roledescription="carousel"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          style={{
            position: i === index ? 'relative' : 'absolute',
            inset: 0,
            backgroundImage: `${slide.overlay}, url('/images/decorations/hero_bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '120px 0',
            textAlign: 'center',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.8s ease',
            pointerEvents: i === index ? 'auto' : 'none',
          }}
        >
          <div className="container">
            <p
              style={{
                color: 'var(--color-primary)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
              dangerouslySetInnerHTML={{ __html: slide.eyebrow }}
            />
            <h1
              style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                color: 'var(--color-dark)',
                marginBottom: '20px',
                fontWeight: 600,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.01em',
                lineHeight: 1.1,
              }}
            >
              {slide.titleTop}
              <br />
              <span style={{ color: 'var(--color-primary)' }}>{slide.titleAccent}</span>
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--color-text-muted)',
                marginBottom: '40px',
                maxWidth: '560px',
                margin: '0 auto 40px',
              }}
            >
              {slide.copy}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={slide.primaryCta.href} className="btn-primary" style={{ padding: '14px 36px', fontSize: '14px' }}>
                {slide.primaryCta.label}
              </Link>
              {slide.secondaryCta && (
                <Link href={slide.secondaryCta.href} className="btn-outline" style={{ padding: '14px 36px', fontSize: '14px' }}>
                  {slide.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        style={arrowStyle('left')}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        style={arrowStyle('right')}
      >
        ›
      </button>

      {/* Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 2,
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            style={{
              width: i === index ? '32px' : '10px',
              height: '10px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: i === index ? 'var(--color-primary)' : 'rgba(51,39,26,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: '16px',
    transform: 'translateY(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid var(--color-border)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: 'var(--color-dark)',
    fontSize: '28px',
    lineHeight: '40px',
    cursor: 'pointer',
    zIndex: 2,
    backdropFilter: 'blur(4px)',
  };
}
