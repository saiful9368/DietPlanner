import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import NutrientBar from '../components/NutrientBar'

const NUTRIENT_LABELS = {
  energy_kcal: { label: 'Calories', unit: 'kcal' },
  protein_g: { label: 'Protein', unit: 'g' },
  carbs_g: { label: 'Carbohydrates', unit: 'g' },
  fat_g: { label: 'Fat', unit: 'g' },
  fiber_g: { label: 'Fiber', unit: 'g' },
  calcium_mg: { label: 'Calcium', unit: 'mg' },
  iron_mg: { label: 'Iron', unit: 'mg' },
  vitc_mg: { label: 'Vitamin C', unit: 'mg' },
  folate_ug: { label: 'Folate', unit: 'ug' },
}

const TOTAL_KEY_MAP = {
  energy_kcal: 'total_calories',
  protein_g: 'total_protein',
  carbs_g: 'total_carbs',
  fat_g: 'total_fat',
  fiber_g: 'total_fiber',
  calcium_mg: 'total_calcium',
  iron_mg: 'total_iron',
  vitc_mg: 'total_vitc',
  folate_ug: 'total_folate',
}

function getBarColor(pct) {
  if (pct >= 70) return '#27AE60'
  if (pct >= 40) return '#F39C12'
  return '#E74C3C'
}

export default function NutrientReport() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState('adult_male')

  useEffect(() => {
    fetchReport()
  }, [profile])

  const fetchReport = async () => {
    const saved = localStorage.getItem('ayurdiet_foods')
    if (!saved) {
      setError('No diet chart found. Please generate a diet chart first.')
      return
    }

    const foods = JSON.parse(saved)
    const items = foods.map((f) => ({
      food_name: f.name,
      quantity_grams: 100,
    }))

    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/analyse-nutrients', { items, profile })
      setReport(res.data)
    } catch {
      setError('Failed to analyse nutrients. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (error && !report) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Nutrient Report</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => navigate('/diet-chart')}
          className="px-6 py-3 rounded-xl text-white font-semibold cursor-pointer"
          style={{ backgroundColor: '#E8732A' }}
        >
          Go to Diet Chart
        </button>
      </div>
    )
  }

  if (loading || !report) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
        <p className="mt-3 text-gray-500">Analysing nutrients...</p>
      </div>
    )
  }

  const chartData = Object.entries(NUTRIENT_LABELS).map(([key, { label }]) => ({
    name: label,
    percentage: report.rda_comparison[key] || 0,
  }))

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Nutrient Analysis Report</h2>
        <p className="text-gray-500 mb-4">Based on your current diet chart (per 100g each item)</p>
        <div className="flex justify-center gap-3">
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
          >
            <option value="adult_male">Adult Male</option>
            <option value="adult_female">Adult Female</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Calories', value: report.total_calories, unit: 'kcal', color: '#E8732A' },
          { label: 'Protein', value: report.total_protein, unit: 'g', color: '#5A8A76' },
          { label: 'Carbs', value: report.total_carbs, unit: 'g', color: '#7B9EC7' },
          { label: 'Fat', value: report.total_fat, unit: 'g', color: '#C4A035' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 text-center">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold" style={{ color: card.color }}>
              {card.value.toFixed(1)}
            </p>
            <p className="text-xs text-gray-400">{card.unit}</p>
          </div>
        ))}
      </div>

      {/* RDA progress bars */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D4A3E' }}>
          RDA Comparison
        </h3>
        {Object.entries(NUTRIENT_LABELS).map(([key, { label, unit }]) => (
          <NutrientBar
            key={key}
            label={label}
            value={report[TOTAL_KEY_MAP[key]]?.toFixed(1) || '0'}
            unit={unit}
            percentage={report.rda_comparison[key] || 0}
          />
        ))}
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#27AE60' }} />
            Good (&ge;70%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#F39C12' }} />
            Partial (40-70%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#E74C3C' }} />
            Deficient (&lt;40%)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D4A3E' }}>
          % of Recommended Daily Allowance Met
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} unit="%" />
            <Tooltip formatter={(val) => `${val.toFixed(1)}%`} />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={getBarColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per item breakdown */}
      {report.per_item && report.per_item.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D4A3E' }}>
            Per Item Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">Food Item</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">Qty (g)</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">Cal</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">Protein</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">Carbs</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">Fat</th>
                </tr>
              </thead>
              <tbody>
                {report.per_item.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-amber-50">
                    <td className="py-2 pr-4">
                      {item.food_name}
                      {!item.found && (
                        <span className="text-xs text-red-400 ml-1">(not found)</span>
                      )}
                    </td>
                    <td className="text-right py-2 px-2">{item.quantity_grams}</td>
                    <td className="text-right py-2 px-2">{item.nutrients?.energy_kcal?.toFixed(1) || '-'}</td>
                    <td className="text-right py-2 px-2">{item.nutrients?.protein_g?.toFixed(1) || '-'}</td>
                    <td className="text-right py-2 px-2">{item.nutrients?.carbs_g?.toFixed(1) || '-'}</td>
                    <td className="text-right py-2 px-2">{item.nutrients?.fat_g?.toFixed(1) || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 no-print">
        <button
          onClick={() => navigate('/diet-chart')}
          className="px-5 py-2.5 rounded-xl font-medium border-2 cursor-pointer"
          style={{ borderColor: '#2D4A3E', color: '#2D4A3E' }}
        >
          Back to Diet Chart
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-xl text-white font-medium shadow-md cursor-pointer"
          style={{ backgroundColor: '#2D4A3E' }}
        >
          Print Report
        </button>
      </div>
    </div>
  )
}
