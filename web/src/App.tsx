import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './contexts/AuthContext'
import { RequireAuth } from './components/RequireAuth'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { TripsPage } from './pages/TripsPage'
import { TripDetailPage } from './pages/TripDetailPage'
import { ExpensesPage } from './pages/ExpensesPage'
import { BudgetPage } from './pages/BudgetPage'
import { ItineraryPage } from './pages/ItineraryPage'
import { LogisticsPage } from './pages/LogisticsPage'
import { CurrencyCalculatorPage } from './pages/CurrencyCalculatorPage'
import { PriceWatchesPage } from './pages/PriceWatchesPage'
import { PriceWatchDetailPage } from './pages/PriceWatchDetailPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
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
            <Route
              path="/trips/:tripId/logistica"
              element={
                <RequireAuth>
                  <AppLayout>
                    <LogisticsPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/trips/:tripId/cambio"
              element={
                <RequireAuth>
                  <AppLayout>
                    <CurrencyCalculatorPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/trips/:tripId/passagens"
              element={
                <RequireAuth>
                  <AppLayout>
                    <PriceWatchesPage />
                  </AppLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/trips/:tripId/passagens/:watchId"
              element={
                <RequireAuth>
                  <AppLayout>
                    <PriceWatchDetailPage />
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
