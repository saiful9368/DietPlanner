import { Link } from 'react-router-dom'
import DoshaCard from '../components/DoshaCard'

const DOSHAS = [
  {
    name: 'Vata',
    color: '#7B9EC7',
    description:
      'Governs movement and communication. Characterized by qualities of air and space — light, dry, cold, mobile. Vata types are creative, quick-thinking, and energetic.',
  },
  {
    name: 'Pitta',
    color: '#E8732A',
    description:
      'Governs digestion and metabolism. Characterized by qualities of fire and water — hot, sharp, intense. Pitta types are focused, ambitious, and strong leaders.',
  },
  {
    name: 'Kapha',
    color: '#5A8A76',
    description:
      'Governs structure and lubrication. Characterized by qualities of earth and water — heavy, slow, steady, solid. Kapha types are calm, loyal, and nurturing.',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '#2D4A3E' }}>
          AyurDiet Pro
        </h1>
        <p className="text-xl mb-2" style={{ color: '#E8732A' }}>
          Ayurvedic Nutrition. Scientifically Delivered.
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Discover your Prakriti (body constitution), receive personalized Ayurvedic diet plans,
          and track your nutritional intake — all backed by modern nutritional science and
          classical Ayurvedic wisdom.
        </p>
        <Link
          to="/assessment"
          className="inline-block px-8 py-4 rounded-xl text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          style={{ backgroundColor: '#E8732A' }}
        >
          Start Prakriti Assessment
        </Link>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#2D4A3E' }}>
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { step: '1', title: 'Take Assessment', desc: 'Answer 29 questions about your body and lifestyle' },
            { step: '2', title: 'Know Your Dosha', desc: 'ML model predicts your Ayurvedic body type' },
            { step: '3', title: 'Get Diet Chart', desc: 'Personalized meals aligned with your Dosha' },
            { step: '4', title: 'Track Nutrients', desc: 'Detailed nutrient analysis against RDA values' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3"
                style={{ backgroundColor: '#E8732A' }}
              >
                {item.step}
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doshas */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#2D4A3E' }}>
          The Three Doshas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOSHAS.map((d) => (
            <DoshaCard key={d.name} name={d.name} description={d.description} color={d.color} />
          ))}
        </div>
      </section>
    </div>
  )
}
