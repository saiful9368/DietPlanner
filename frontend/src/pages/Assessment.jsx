import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DoshaCard from '../components/DoshaCard'

const DOSHA_COLORS = {
  Vata: '#7B9EC7',
  Pitta: '#E8732A',
  Kapha: '#5A8A76',
  'Vata+Pitta': '#B084B4',
  'Pitta+Kapha': '#C4A035',
  'Vata+Kapha': '#6BA3A0',
}

const DOSHA_DESCRIPTIONS = {
  Vata: 'Air & Space — Creative, quick-thinking, energetic. Needs warm, grounding, nourishing foods.',
  Pitta: 'Fire & Water — Focused, ambitious, strong digestion. Needs cooling, calming foods.',
  Kapha: 'Earth & Water — Calm, loyal, steady. Needs light, warm, stimulating foods.',
  'Vata+Pitta': 'Dual constitution combining Air and Fire qualities. Benefits from balanced, moderately warm foods.',
  'Pitta+Kapha': 'Dual constitution combining Fire and Earth qualities. Benefits from light, cooling foods.',
  'Vata+Kapha': 'Dual constitution combining Air and Earth qualities. Benefits from warm, light, well-spiced foods.',
}

const SECTIONS = [
  {
    title: 'Physical Characteristics',
    questions: [
      { key: 'body_size', label: 'Body Size', options: ['Slim', 'Medium', 'Large'] },
      { key: 'body_weight', label: 'Body Weight', options: ['Low - difficulties in gaining weight', 'Moderate - no difficulties in gaining or losing weight', 'Heavy - difficulties in losing weight'] },
      { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'] },
      { key: 'bone_structure', label: 'Bone Structure', options: ['Light, Small bones, prominent joints', 'Medium bone structure', 'Large, broad shoulders, heavy bone structure'] },
      { key: 'complexion', label: 'Complexion', options: ['Fair-skin sunburns easily', 'White, pale, tans easily', 'Dark-Complexion, tans easily'] },
    ],
  },
  {
    title: 'Skin & Hair',
    questions: [
      { key: 'general_feel_of_skin', label: 'General Feel of Skin', options: ['Dry and thin, cool to touch, rough', 'Smooth and warm, oily T-zone', 'Thick and moist/greasy, cold'] },
      { key: 'texture_of_skin', label: 'Texture of Skin', options: ['Dry, pigments and aging', 'Oily', 'Freckles, many moles, redness and rashes'] },
      { key: 'hair_color', label: 'Hair Color', options: ['Black/Brown,dull', 'Red, light brown, yellow', 'Brown'] },
      { key: 'appearance_of_hair', label: 'Appearance of Hair', options: ['Dry, frizzy', 'Normal', 'Oily, thick'] },
    ],
  },
  {
    title: 'Face & Features',
    questions: [
      { key: 'shape_of_face', label: 'Shape of Face', options: ['Long, angular face', 'Oval, pointed chin', 'Round, full face'] },
      { key: 'eyes', label: 'Eyes', options: ['Small, dark, active', 'Medium, penetrating, green/grey', 'Large, beautiful, blue/white'] },
      { key: 'eyelashes', label: 'Eyelashes', options: ['Thin', 'Medium', 'Thick'] },
      { key: 'blinking_of_eyes', label: 'Blinking of Eyes', options: ['Frequent', 'Moderate', 'Rare'] },
      { key: 'cheeks', label: 'Cheeks', options: ['Sunken', 'Flat', 'Chubby'] },
      { key: 'nose', label: 'Nose', options: ['Thin, crooked', 'Medium, pointed', 'Broad, large'] },
      { key: 'teeth_and_gums', label: 'Teeth and Gums', options: ['Irregular, protruding teeth', 'Medium, yellowish', 'Strong, white'] },
      { key: 'lips', label: 'Lips', options: ['Thin, dry', 'Medium, soft', 'Thick, oily'] },
      { key: 'nails', label: 'Nails', options: ['Dry, rough, brittle', 'Medium, pink', 'Thick, oily, smooth'] },
    ],
  },
  {
    title: 'Digestive Profile',
    questions: [
      { key: 'appetite', label: 'Appetite', options: ['Variable, irregular', 'Strong, cannot skip meals', 'Slow, steady'] },
      { key: 'liking_tastes', label: 'Liking Tastes', options: ['Sweet, sour, salty', 'Sweet, bitter, astringent', 'Pungent, bitter, astringent'] },
      { key: 'metabolism_type', label: 'Metabolism Type', options: ['Fast', 'Medium', 'Slow'] },
      { key: 'digestion_quality', label: 'Digestion Quality', options: ['weak', 'moderate', 'strong'] },
    ],
  },
  {
    title: 'Lifestyle & Habits',
    questions: [
      { key: 'climate_preference', label: 'Climate Preference', options: ['Warm', 'Moderate', 'Cool'] },
      { key: 'stress_levels', label: 'Stress Levels', options: ['High', 'Medium', 'Low'] },
      { key: 'sleep_patterns', label: 'Sleep Patterns', options: ['Light, interrupted', 'Moderate', 'Heavy, prolonged'] },
      { key: 'dietary_habits', label: 'Dietary Habits', options: ['Irregular', 'Regular', 'Very Regular'] },
      { key: 'physical_activity_level', label: 'Physical Activity Level', options: ['Low', 'Moderate', 'High'] },
      { key: 'water_intake', label: 'Water Intake', options: ['low', 'moderate', 'high'] },
      { key: 'skin_sensitivity', label: 'Skin Sensitivity', options: ['sensitive', 'normal', 'insensitive'] },
    ],
  },
]

const ALL_KEYS = SECTIONS.flatMap((s) => s.questions.map((q) => q.key))

export default function Assessment() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const sectionComplete = SECTIONS[currentSection].questions.every((q) => answers[q.key])
  const allComplete = ALL_KEYS.every((k) => answers[k])

  const handleSubmit = async () => {
    if (!allComplete) {
      setError('Please answer all 29 questions before submitting.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/predict-dosha', answers)
      setResult(res.data)
      localStorage.setItem('ayurdiet_dosha', res.data.dosha)
    } catch (err) {
      setError('Failed to predict dosha. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateDiet = () => {
    navigate('/diet-chart')
  }

  const section = SECTIONS[currentSection]
  const answeredInSection = section.questions.filter((q) => answers[q.key]).length
  const totalAnswered = ALL_KEYS.filter((k) => answers[k]).length

  if (result) {
    const sortedConfidence = Object.entries(result.confidence).sort((a, b) => b[1] - a[1])

    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Your Prakriti Result</h2>
        <p className="text-center text-gray-500 mb-8">Based on your 29 responses</p>

        <div className="mb-8">
          <DoshaCard
            name={result.dosha}
            description={DOSHA_DESCRIPTIONS[result.dosha] || ''}
            confidence={result.confidence[result.dosha]}
            color={DOSHA_COLORS[result.dosha] || '#666'}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 mb-8">
          <h3 className="font-semibold mb-4">Confidence Across All Doshas</h3>
          {sortedConfidence.map(([dosha, conf]) => (
            <div key={dosha} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{dosha}</span>
                <span>{(conf * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${conf * 100}%`,
                    backgroundColor: DOSHA_COLORS[dosha] || '#999',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerateDiet}
            className="px-8 py-3 rounded-xl text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            style={{ backgroundColor: '#E8732A' }}
          >
            Generate My Diet Chart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Prakriti Assessment</h2>
      <p className="text-center text-gray-500 mb-6">
        Answer 29 questions to determine your Ayurvedic body constitution
      </p>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>{totalAnswered} of 29 answered</span>
          <span>Section {currentSection + 1} of {SECTIONS.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${(totalAnswered / 29) * 100}%`, backgroundColor: '#E8732A' }}
          />
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {SECTIONS.map((s, i) => {
          const done = s.questions.every((q) => answers[q.key])
          return (
            <button
              key={i}
              onClick={() => setCurrentSection(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                i === currentSection
                  ? 'text-white'
                  : done
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={i === currentSection ? { backgroundColor: '#2D4A3E' } : {}}
            >
              {s.title}
              {done && i !== currentSection && ' \u2713'}
            </button>
          )
        })}
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 mb-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D4A3E' }}>
          {section.title}
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({answeredInSection}/{section.questions.length})
          </span>
        </h3>
        <div className="space-y-5">
          {section.questions.map((q) => (
            <div key={q.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {q.label}
              </label>
              <select
                value={answers[q.key] || ''}
                onChange={(e) => handleChange(q.key, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#E8732A' }}
              >
                <option value="">-- Select --</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentSection((p) => Math.max(0, p - 1))}
          disabled={currentSection === 0}
          className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentSection < SECTIONS.length - 1 ? (
          <button
            onClick={() => setCurrentSection((p) => p + 1)}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
            style={{ backgroundColor: '#2D4A3E' }}
          >
            Next Section
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allComplete || loading}
            className="px-6 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            style={{ backgroundColor: '#E8732A' }}
          >
            {loading ? 'Analysing...' : 'Submit Assessment'}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 text-center text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
}
