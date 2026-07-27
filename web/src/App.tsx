import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './contexts/AuthContext'
import { RequireAuth } from './components/RequireAuth'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { TripsPage } from './pages/TripsPage'
import { TripDetailPage } from './pages/TripDetailPage'
import { ExpensesPage } from './pages/ExpensesPage'
import { BudgetPage } from './pages/BudgetPage'
import { ItineraryPage } from './pages/ItineraryPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppLayout>
                    <TripsPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/trips/:tripId"
              element={
                <RequireAuth>
                  <AppLayout>
                    <TripDetailPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/trips/:tripId/gastos"
              element={
                <RequireAuth>
                  <AppLayout>
                    <ExpensesPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/trips/:tripId/orcamento"
              element={
                <RequireAuth>
                  <AppLayout>
                    <BudgetPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/trips/:tripId/roteiro"
              element={
                <RequireAuth>
                  <AppLayout>
                    <ItineraryPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
