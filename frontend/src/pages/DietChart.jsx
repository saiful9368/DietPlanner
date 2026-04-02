import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import FoodCard from '../components/FoodCard'

const DOSHA_COLORS = {
  Vata: '#7B9EC7',
  Pitta: '#E8732A',
  Kapha: '#5A8A76',
  'Vata+Pitta': '#B084B4',
  'Pitta+Kapha': '#C4A035',
  'Vata+Kapha': '#6BA3A0',
}

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
}

export default function DietChart() {
  const navigate = useNavigate()
  const [dosha, setDosha] = useState('')
  const [isVegetarian, setIsVegetarian] = useState(true)
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('ayurdiet_dosha')
    if (saved) {
      setDosha(saved)
    }
  }, [])

  useEffect(() => {
    if (dosha) {
      fetchDiet()
    }
  }, [dosha, isVegetarian])

  const fetchDiet = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/generate-diet', {
        dosha,
        is_vegetarian: isVegetarian,
        meals_per_day: 3,
      })
      setMealPlan(res.data)
      // Save food list for nutrient analysis
      const allFoods = [
        ...(res.data.breakfast || []),
        ...(res.data.lunch || []),
        ...(res.data.dinner || []),
        ...(res.data.snacks || []),
      ]
      localStorage.setItem('ayurdiet_foods', JSON.stringify(allFoods))
    } catch {
      setError('Failed to generate diet. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyse = () => {
    navigate('/nutrients')
  }

  const handlePrint = () => {
    window.print()
  }

  if (!dosha) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No Dosha Selected</h2>
        <p className="text-gray-500 mb-6">
          Please complete the Prakriti Assessment first to determine your Dosha.
        </p>
        <button
          onClick={() => navigate('/assessment')}
          className="px-6 py-3 rounded-xl text-white font-semibold cursor-pointer"
          style={{ backgroundColor: '#E8732A' }}
        >
          Take Assessment
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Your Ayurvedic Diet Chart</h2>
        <div className="flex items-center justify-center gap-3">
          <span
            className="px-4 py-1 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: DOSHA_COLORS[dosha] || '#666' }}
          >
            {dosha} Dosha
          </span>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
              className="rounded cursor-pointer"
            />
            Vegetarian only
          </label>
        </div>
      </div>

      {error && <p className="text-center text-red-600 mb-4">{error}</p>}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
          <p className="mt-3 text-gray-500">Generating your personalized diet chart...</p>
        </div>
      )}

      {mealPlan && !loading && (
        <>
          {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => {
            const items = mealPlan[meal]
            if (!items || items.length === 0) return null
            return (
              <section key={meal} className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#2D4A3E' }}>
                  <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#E8732A' }} />
                  {MEAL_LABELS[meal]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((food, idx) => (
                    <FoodCard key={idx} {...food} />
                  ))}
                </div>
              </section>
            )
          })}

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8 no-print">
            <button
              onClick={fetchDiet}
              className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors cursor-pointer"
              style={{ borderColor: '#2D4A3E', color: '#2D4A3E' }}
            >
              Regenerate
            </button>
            <button
              onClick={handleAnalyse}
              className="px-5 py-2.5 rounded-xl text-white font-medium shadow-md cursor-pointer"
              style={{ backgroundColor: '#E8732A' }}
            >
              Analyse Nutrients
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl text-white font-medium shadow-md cursor-pointer"
              style={{ backgroundColor: '#2D4A3E' }}
            >
              Print
            </button>
          </div>
        </>
      )}
    </div>
  )
}
