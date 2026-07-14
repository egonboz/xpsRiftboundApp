import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { PlayerDetailsPage } from '@/features/players/pages/PlayerDetailsPage'
import { BottomNavigation } from '@/components/layout/BottomNavigation'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/player/:id" element={<PlayerDetailsPage />} />
      </Routes>
      <BottomNavigation />
    </BrowserRouter>
  )
}
