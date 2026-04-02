import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import DietChart from './pages/DietChart'
import NutrientReport from './pages/NutrientReport'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/assessment', label: 'Prakriti Assessment' },
  { path: '/diet-chart', label: 'Diet Chart' },
  { path: '/nutrients', label: 'Nutrient Report' },
]

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF6EE', color: '#2D4A3E' }}>
      <nav className="shadow-lg" style={{ backgroundColor: '#2D4A3E' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
            <span className="text-2xl">&#x1F33F;</span>
            AyurDiet Pro
          </Link>
          <div className="flex gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                style={
                  location.pathname === link.path
                    ? { backgroundColor: '#E8732A' }
                    : {}
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/diet-chart" element={<DietChart />} />
          <Route path="/nutrients" element={<NutrientReport />} />
        </Routes>
      </main>
    </div>
  )
}
