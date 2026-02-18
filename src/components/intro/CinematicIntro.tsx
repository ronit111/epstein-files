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
      {/* Film grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          zIndex: 100,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Ambient background — scattered dim points representing the network */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              backgroundColor: '#a1a1aa',
              opacity: Math.random() * 0.2 + 0.03,
              animation: `pulse-glow ${4 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: Math.random() * 4 + 's',
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
          <div className="intro-content max-w-3xl mx-auto px-6 sm:px-8 text-center">
            <h2
              className="text-3xl sm:text-5xl lg:text-7xl font-medium mb-6 text-[var(--color-text-primary)]"
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
              <p className="text-base sm:text-xl lg:text-2xl text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto">
                {section.body}
              </p>
            )}
            {section.stat && (
              <div className="mt-4">
                <span
                  className="text-4xl sm:text-6xl lg:text-8xl font-bold text-[var(--color-text-primary)] block mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {section.stat.value}
                </span>
                <p className="text-base sm:text-xl text-[var(--color-text-secondary)]">
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
            className="text-2xl sm:text-4xl lg:text-6xl font-medium mb-8 text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Begin Investigation
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-12">
            Explore the network. Follow the connections. Read the documents.
          </p>
          <button
            onClick={handleBeginInvestigation}
            className="group relative px-12 py-4 border border-[var(--color-accent)] text-[var(--color-accent)] text-lg tracking-wider uppercase transition-all duration-500 hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="relative z-10">Enter</span>
            <div className="absolute inset-0 bg-[var(--color-accent-glow)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
