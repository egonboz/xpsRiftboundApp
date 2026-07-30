import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { PlayerDetailsPage } from '@/features/players/pages/PlayerDetailsPage'
import { TournamentPage } from '@/features/tournament/pages/TournamentPage'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tournament" element={<TournamentPage />} />
        <Route path="/tournament/:eventId" element={<TournamentPage />} />
        <Route path="/player/:id" element={<PlayerDetailsPage />} />
      </Routes>
      <BottomNavigation />
    </BrowserRouter>
  )
}
