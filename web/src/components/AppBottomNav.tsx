import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BottomNav } from './ui'

const TRIP_NAV_ITEMS = [
  { value: 'trip', label: 'Viagem', icon: '🧭', path: '' },
  { value: 'gastos', label: 'Gastos', icon: '💸', path: '/gastos' },
  { value: 'orcamento', label: 'Orçamento', icon: '📊', path: '/orcamento' },
  { value: 'roteiro', label: 'Roteiro', icon: '🗺️', path: '/roteiro' },
  { value: 'logistica', label: 'Logística', icon: '🛏️', path: '/logistica' },
]

/** Ponte entre o BottomNav (controlado via value/onChange) e as rotas de uma viagem. */
export function AppBottomNav() {
  const { tripId } = useParams<{ tripId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  if (!tripId) return null

  const base = `/trips/${tripId}`
  const current =
    TRIP_NAV_ITEMS.find((it) => it.path !== '' && location.pathname.startsWith(base + it.path))?.value ?? 'trip'

  return (
    <BottomNav
      items={TRIP_NAV_ITEMS}
      value={current}
      onChange={(v) => {
        const item = TRIP_NAV_ITEMS.find((it) => it.value === v)!
        navigate(base + item.path)
      }}
    />
  )
}
