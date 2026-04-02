const RASA_COLORS = {
  Madhura: '#A67B5B',
  Amla: '#C4A035',
  Lavana: '#8B8BAE',
  Katu: '#C0392B',
  Tikta: '#27AE60',
  Kashaya: '#8E6F47',
  Unknown: '#999',
}

export default function FoodCard({ name, rasa, virya, energy_kcal, protein_g, carbs_g, fat_g }) {
  return (
    <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-3 min-h-[2.5rem]">
        {name}
      </h4>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: RASA_COLORS[rasa] || RASA_COLORS.Unknown }}
        >
          {rasa}
        </span>
        {virya && virya !== 'Unknown' && (
          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
            virya === 'Ushna' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {virya}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Calories</span>
          <span className="font-medium text-gray-800">{energy_kcal}</span>
        </div>
        <div className="flex justify-between">
          <span>Protein</span>
          <span className="font-medium text-gray-800">{protein_g}g</span>
        </div>
        <div className="flex justify-between">
          <span>Carbs</span>
          <span className="font-medium text-gray-800">{carbs_g}g</span>
        </div>
        <div className="flex justify-between">
          <span>Fat</span>
          <span className="font-medium text-gray-800">{fat_g}g</span>
        </div>
      </div>
    </div>
  )
}
