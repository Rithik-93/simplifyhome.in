
import type { FurnitureItem } from '../../types'

interface FurnitureStepProps {
  furnitureItems: FurnitureItem[]
  onUpdate: (furnitureItems: FurnitureItem[]) => void
  onNext: () => void
  onPrev: () => void
}

const FurnitureStep: React.FC<FurnitureStepProps> = ({ 
  furnitureItems, 
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  const toggleFurnitureItem = (itemId: string) => {
    const updatedItems = furnitureItems.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    )
    onUpdate(updatedItems)
  }

  const updateFurnitureDimensions = (itemId: string, field: 'length' | 'width', value: number) => {
    const updatedItems = furnitureItems.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    )
    onUpdate(updatedItems)
  }

  const categories = [
    'Foyer & Outside Area',
    'Living Room',
    'Bedroom 01'
  ]

  const getItemsByCategory = (category: string) => {
    return furnitureItems.filter(item => item.category === category)
  }

  const hasSelectedItems = furnitureItems.some(item => item.selected)

  const FurnitureItemCard = ({ item }: { item: FurnitureItem }) => (
    <div className="bg-white rounded-lg p-3 border border-gray-300 hover:border-yellow-400 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <label className="flex items-start cursor-pointer flex-1">
          <div className="relative">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => toggleFurnitureItem(item.id)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              item.selected 
                ? 'bg-yellow-400 border-yellow-400' 
                : 'bg-white border-gray-300 hover:border-yellow-400'
            }`}>
              {item.selected && (
                <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <div className="ml-3 flex-1">
            <span className="text-sm font-medium text-gray-900 leading-tight">
              {item.name}
            </span>
            <div className="text-xs text-yellow-600 font-medium mt-1">
              ₹{item.pricePerSqFt}/sq.ft
            </div>
          </div>
        </label>
      </div>
      
      {item.selected && (
        <div className="space-y-2 animate-fadeIn border-t border-yellow-200 pt-2 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Length (ft)
              </label>
              <input
                type="number"
                value={item.length}
                onChange={(e) => updateFurnitureDimensions(item.id, 'length', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Width (ft)
              </label>
              <input
                type="number"
                value={item.width}
                onChange={(e) => updateFurnitureDimensions(item.id, 'width', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
                min="0"
                step="0.1"
              />
            </div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-xs text-yellow-400">
              Area: {(item.length * item.width).toFixed(1)} sq.ft
            </div>
            <div className="text-sm text-yellow-400 font-medium">
              Price: ₹{Math.round(item.length * item.width * item.pricePerSqFt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const CategoryColumn = ({ category }: { category: string }) => {
    const categoryItems = getItemsByCategory(category)
    return (
      <div className="bg-gray-50 rounded-lg p-4 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {category}
        </h3>
        <div className="space-y-3">
          {categoryItems.map((item) => (
            <FurnitureItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-yellow-400 max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Select Furniture Items
          </h2>
          <p className="text-gray-600">
            Choose the furniture items you want and specify their dimensions
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {categories.map((category) => (
            <CategoryColumn key={category} category={category} />
          ))}
        </div>

        {/* Selected Items Summary */}
        {hasSelectedItems && (
          <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Selected Items Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {furnitureItems.filter(item => item.selected).map((item) => (
                <div key={item.id} className="bg-white rounded p-3 border border-yellow-400 shadow-sm">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-600">
                    {item.length} × {item.width} ft = {(item.length * item.width).toFixed(1)} sq.ft
                  </div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    ₹{Math.round(item.length * item.width * item.pricePerSqFt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onPrev}
            className="flex items-center px-6 py-3 text-base font-medium rounded-lg border-2 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home Type
          </button>
          <button
            onClick={onNext}
            className="flex items-center px-6 py-3 text-base font-medium rounded-lg bg-black text-yellow-400 hover:bg-gray-800 transition-all duration-200"
          >
            Continue to Services
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FurnitureStep 