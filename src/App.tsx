import { useInvestigationStore } from '@/store/investigation'
import { CinematicIntro } from '@/components/intro/CinematicIntro'
import { InvestigationBoard } from '@/components/board/InvestigationBoard'

export default function App() {
  const introComplete = useInvestigationStore((s) => s.introComplete)

  // Check URL hash for direct board access
  const skipIntro = introComplete || window.location.hash === '#board'

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {!skipIntro && <CinematicIntro />}
      {skipIntro && <InvestigationBoard />}
    </div>
  )
}
