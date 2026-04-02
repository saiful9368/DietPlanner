export default function NutrientBar({ label, value, unit, percentage }) {
  const getColor = (pct) => {
    if (pct >= 70) return '#27AE60'
    if (pct >= 40) return '#F39C12'
    return '#E74C3C'
  }

  const color = getColor(percentage)
  const clampedWidth = Math.min(percentage, 100)

  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {value} {unit}
          <span className="ml-2 font-semibold" style={{ color }}>
            ({percentage}% RDA)
          </span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${clampedWidth}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
