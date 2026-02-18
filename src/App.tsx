import { useEffect, lazy, Suspense } from 'react'
import { useInvestigationStore } from '@/store/investigation'
import { getEntity } from '@/data/loader'

// Code-split heavy components — CinematicIntro (GSAP ~50KB) and
// InvestigationBoard (react-force-graph-2d + d3 ~400KB) load on demand
const CinematicIntro = lazy(() => import('@/components/intro/CinematicIntro').then(m => ({ default: m.CinematicIntro })))
const InvestigationBoard = lazy(() => import('@/components/board/InvestigationBoard').then(m => ({ default: m.InvestigationBoard })))

export default function App() {
  const introComplete = useInvestigationStore((s) => s.introComplete)
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId)
  const selectEntity = useInvestigationStore((s) => s.selectEntity)
  const navigateToEntity = useInvestigationStore((s) => s.navigateToEntity)
  const setIntroComplete = useInvestigationStore((s) => s.setIntroComplete)

  // Deep linking: read entity from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash === 'board') return
    if (hash && getEntity(hash)) {
      setIntroComplete(true)
      navigateToEntity(hash)
    }
  }, [])

  // Deep linking: update URL hash when entity changes
  useEffect(() => {
    if (selectedEntityId) {
      window.location.hash = selectedEntityId
    } else if (introComplete) {
      window.location.hash = 'board'
    }
  }, [selectedEntityId, introComplete])

  // Keyboard navigation: Escape closes detail panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEntityId) {
        selectEntity(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedEntityId, selectEntity])

  const skipIntro = introComplete || window.location.hash.slice(1) !== ''

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Skip to content link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-[var(--color-surface-raised)] focus:text-[var(--color-text-primary)] focus:border focus:border-[var(--color-ink-lighter)] focus:rounded focus:text-sm"
      >
        Skip to main content
      </a>
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-xs text-[var(--color-text-muted)] tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              Loading
            </span>
          </div>
        </div>
      }>
        {!skipIntro && <CinematicIntro />}
        {skipIntro && <InvestigationBoard />}
      </Suspense>
    </div>
  )
}
