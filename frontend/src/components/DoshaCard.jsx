export default function DoshaCard({ name, description, confidence, color }) {
  return (
    <div
      className="rounded-2xl p-6 text-white shadow-lg"
      style={{ backgroundColor: color }}
    >
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-sm opacity-90 mb-4">{description}</p>
      {confidence !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Confidence</span>
            <span>{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-white transition-all duration-700"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
