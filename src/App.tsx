import { useEffect } from 'react'
import { useInvestigationStore } from '@/store/investigation'
import { CinematicIntro } from '@/components/intro/CinematicIntro'
import { InvestigationBoard } from '@/components/board/InvestigationBoard'
import { getEntity } from '@/data/loader'

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
      {!skipIntro && <CinematicIntro />}
      {skipIntro && <InvestigationBoard />}
    </div>
  )
}
