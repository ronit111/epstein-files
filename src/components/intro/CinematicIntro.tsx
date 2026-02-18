import { useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInvestigationStore } from '@/store/investigation'

gsap.registerPlugin(ScrollTrigger)

const introSections = [
  {
    id: 'intro-1',
    headline: 'Jeffrey Epstein',
    subtext: '1953 – 2019',
    body: 'Financier. Convicted sex offender. At the center of one of the most far-reaching abuse and trafficking networks ever documented.',
  },
  {
    id: 'intro-2',
    headline: 'The Network',
    stat: { value: 'Hundreds', label: 'of documented connections to powerful figures across finance, politics, royalty, and media' },
  },
  {
    id: 'intro-3',
    headline: 'The Victims',
    body: 'Dozens of women and girls came forward. Their testimony, preserved in court documents and depositions, forms the backbone of what we know.',
  },
  {
    id: 'intro-4',
    headline: 'The Failure',
    body: 'In 2008, a plea deal gave Epstein 13 months for crimes that should have meant life in prison. The deal was later ruled to have violated federal law.',
  },
  {
    id: 'intro-5',
    headline: 'Still Unfolding',
    body: 'Court documents continue to be unsealed. Names continue to surface. Investigations remain open. The full picture is still emerging.',
  },
]

export function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setIntroComplete = useInvestigationStore((s) => s.setIntroComplete)

  const handleBeginInvestigation = useCallback(() => {
    setIntroComplete(true)
    window.location.hash = '#board'
  }, [setIntroComplete])

  useGSAP(() => {
    if (!containerRef.current) return

    const sections = containerRef.current.querySelectorAll('.intro-section')

    sections.forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll('.intro-content > *'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="relative">
      {/* Ambient background — scattered dots that represent the network */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              backgroundColor: '#f59e0b',
              opacity: Math.random() * 0.3 + 0.05,
              animation: `pulse-glow ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* Intro sections */}
      {introSections.map((section) => (
        <section
          key={section.id}
          className="intro-section min-h-screen flex items-center justify-center relative"
          style={{ zIndex: 1 }}
        >
          <div className="intro-content max-w-3xl mx-auto px-8 text-center">
            <h2
              className="text-5xl md:text-7xl font-medium mb-6 text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {section.headline}
            </h2>
            {section.subtext && (
              <p
                className="text-lg tracking-widest text-[var(--color-text-muted)] mb-8 uppercase"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {section.subtext}
              </p>
            )}
            {section.body && (
              <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto">
                {section.body}
              </p>
            )}
            {section.stat && (
              <div className="mt-4">
                <span
                  className="text-6xl md:text-8xl font-bold text-[var(--color-amber-accent)] block mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {section.stat.value}
                </span>
                <p className="text-xl text-[var(--color-text-secondary)]">
                  {section.stat.label}
                </p>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Final section — Begin Investigation */}
      <section className="intro-section min-h-screen flex items-center justify-center relative" style={{ zIndex: 1 }}>
        <div className="intro-content text-center">
          <h2
            className="text-4xl md:text-6xl font-medium mb-8 text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Begin Investigation
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-12">
            Explore the network. Follow the connections. Read the documents.
          </p>
          <button
            onClick={handleBeginInvestigation}
            className="group relative px-12 py-4 border border-[var(--color-amber-accent)] text-[var(--color-amber-accent)] text-lg tracking-wider uppercase transition-all duration-500 hover:bg-[var(--color-amber-accent)] hover:text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="relative z-10">Enter</span>
            <div className="absolute inset-0 bg-[var(--color-amber-glow)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>
  )
}
