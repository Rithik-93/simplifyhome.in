
import { useState, useEffect } from 'react'
import type { FurnitureItem, RoomSizeSelection, HomeDetails } from '../../types'
import { ROOM_DIMENSIONS } from '../../types'

interface FurnitureStepProps {
  furnitureItems: FurnitureItem[]
  homeDetails: HomeDetails
  onUpdate: (furnitureItems: FurnitureItem[]) => void
  onNext: () => void
  onPrev: () => void
}

const FurnitureStep: React.FC<FurnitureStepProps> = ({ 
  furnitureItems, 
  homeDetails,
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  // State for room size selections for each category
  const [roomSizes, setRoomSizes] = useState<RoomSizeSelection>({
    'Master Bedroom': 0,
    'Children Bedroom': 0,
    'Guest Bedroom': 0,
    'Living Room': 0,
    'Pooja Room': 0,
    'Modular Kitchen': 0
  })

  const calculateItemPrice = (item: FurnitureItem, dimensionIndex: number) => {
    const roomDimensions = ROOM_DIMENSIONS[item.category as keyof typeof ROOM_DIMENSIONS]
    const selectedDimension = roomDimensions[dimensionIndex]
    const roomSizeKey = selectedDimension.label
    const qualityTier = homeDetails.qualityTier.toLowerCase() as 'luxury' | 'premium'
    
    if (item.pricing[roomSizeKey]) {
      return item.pricing[roomSizeKey].price[qualityTier]
    }
    return 0
  }

  // Calculate initial prices for all items when component mounts
  useEffect(() => {
    // Only update if items don't already have totalPrice calculated
    const needsUpdate = furnitureItems.some(item => item.totalPrice === undefined)
    if (needsUpdate) {
      const updatedItems = furnitureItems.map(item => ({
        ...item,
        totalPrice: calculateItemPrice(item, roomSizes[item.category])
      }))
      onUpdate(updatedItems)
    }
  }, [homeDetails.qualityTier]) // Recalculate when quality tier changes

  const toggleFurnitureItem = (itemId: string) => {
    // Capture current scroll position and target element
    const scrollPosition = window.scrollY
    const targetElement = document.getElementById(`item-${itemId}`)
    const targetOffset = targetElement?.getBoundingClientRect().top || 0
    
    const updatedItems = furnitureItems.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    )
    onUpdate(updatedItems)
    
    // Use requestAnimationFrame for better timing with DOM updates
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Calculate new scroll position to keep target element in same position
        if (targetElement) {
          const newTargetOffset = targetElement.getBoundingClientRect().top
          const scrollDiff = newTargetOffset - targetOffset
          window.scrollTo(0, scrollPosition + scrollDiff)
        } else {
          window.scrollTo(0, scrollPosition)
        }
      })
    })
  }



  const updateRoomSize = (category: string, dimensionIndex: number) => {
    const newRoomSizes = { ...roomSizes, [category]: dimensionIndex }
    setRoomSizes(newRoomSizes)
    
    // Update all items in this category with new pricing
    const updatedItems = furnitureItems.map(item => 
      item.category === category ? { 
        ...item, 
        totalPrice: calculateItemPrice(item, dimensionIndex)
      } : item
    )
    onUpdate(updatedItems)
  }

  const getItemArea = (item: FurnitureItem, category: string) => {
    const roomDimensions = ROOM_DIMENSIONS[category as keyof typeof ROOM_DIMENSIONS]
    const selectedDimension = roomDimensions[roomSizes[category]]
    const roomSizeKey = selectedDimension.label
    const qualityTier = homeDetails.qualityTier.toLowerCase() as 'luxury' | 'premium'
    
    if (item.pricing[roomSizeKey]) {
      return item.pricing[roomSizeKey].area[qualityTier]
    }
    return 0
  }

  const getRoomArea = (category: string) => {
    const roomDimensions = ROOM_DIMENSIONS[category as keyof typeof ROOM_DIMENSIONS]
    const selectedDimension = roomDimensions[roomSizes[category]]
    return selectedDimension.length * selectedDimension.width
  }

  const categories = [
    'Master Bedroom',
    'Children Bedroom',
    'Guest Bedroom',
    'Living Room',
    'Pooja Room',
    'Modular Kitchen'
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
            <div className="text-xs text-gray-600 mt-1">
              Area: {getItemArea(item, item.category)} sq.ft ({homeDetails.qualityTier})
            </div>
            <div className="text-xs text-yellow-600 font-medium">
              ₹{calculateItemPrice(item, roomSizes[item.category]).toLocaleString()}
            </div>
          </div>
        </label>
      </div>
      

    </div>
  )

  const CategoryColumn = ({ category }: { category: string }) => {
    const categoryItems = getItemsByCategory(category)
    const roomDimensions = ROOM_DIMENSIONS[category as keyof typeof ROOM_DIMENSIONS]
    const selectedDimension = roomDimensions[roomSizes[category]]
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
          {category}
        </h3>
        
        {/* Room Size Selector */}
        <div className="mb-4 p-3 bg-white rounded-lg border border-yellow-300">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Room Size
          </label>
          <select
            value={roomSizes[category]}
            onChange={(e) => updateRoomSize(category, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
          >
            {roomDimensions.map((option, index) => (
              <option key={index} value={index}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-600 mt-1">
            Area: {(selectedDimension.length * selectedDimension.width).toFixed(0)} sq.ft
          </div>
        </div>
        
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

        {/* Category Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
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
              {furnitureItems.filter(item => item.selected).map((item) => {
                const itemArea = getItemArea(item, item.category)
                const totalPrice = calculateItemPrice(item, roomSizes[item.category])
                return (
                  <div key={item.id} className="bg-white rounded p-3 border border-yellow-400 shadow-sm">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-600">
                      Area: {itemArea} sq.ft ({homeDetails.qualityTier})
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      ₹{Math.round(totalPrice).toLocaleString()}
                    </div>
                  </div>
                )
              })}
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