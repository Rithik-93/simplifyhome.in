
import { useState, useCallback, useEffect } from 'react'
import type { FurnitureItem, SingleLineItem, RoomSizeSelection, HomeDetails } from '../../types'
import { ROOM_DIMENSIONS } from '../../types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface FurnitureStepProps {
  furnitureItems: FurnitureItem[]
  singleLineItems: SingleLineItem[]
  homeDetails: HomeDetails
  onUpdateFurniture: (furnitureItems: FurnitureItem[]) => void
  onUpdateSingleLine: (singleLineItems: SingleLineItem[]) => void
  onNext: () => void
  onPrev: () => void
}

const FurnitureStep: React.FC<FurnitureStepProps> = ({ 
  furnitureItems, 
  singleLineItems,
  homeDetails,
  onUpdateFurniture,
  onUpdateSingleLine,
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

  // Calculate total price for furniture items based on user input (price per sqft * room area * quantity)
  const calculateItemTotalPrice = useCallback((item: FurnitureItem) => {
    const roomDimensions = ROOM_DIMENSIONS[item.category as keyof typeof ROOM_DIMENSIONS]
    const selectedDimension = roomDimensions[roomSizes[item.category]]
    const roomArea = selectedDimension.length * selectedDimension.width
    return item.userPrice * roomArea * item.quantity
  }, [roomSizes])

  // Calculate total price for single line items based on user input and carpet area
  const calculateSingleLineTotalPrice = useCallback((item: SingleLineItem) => {
    return item.userPrice * homeDetails.carpetArea
  }, [homeDetails.carpetArea])

  // Update furniture item price - using stable functions from parent
  const updateFurniturePrice = useCallback((itemId: string, price: number) => {
    const updatedItems = furnitureItems.map(item => 
      item.id === itemId ? { ...item, userPrice: price } : item
    )
    onUpdateFurniture(updatedItems)
  }, [furnitureItems, onUpdateFurniture])

  // Update single line item price - using stable functions from parent
  const updateSingleLinePrice = useCallback((itemId: string, price: number) => {
    const updatedItems = singleLineItems.map(item => 
      item.id === itemId ? { ...item, userPrice: price } : item
    )
    onUpdateSingleLine(updatedItems)
  }, [singleLineItems, onUpdateSingleLine])

  // Update furniture item quantity - using stable functions from parent
  const updateFurnitureQuantity = useCallback((itemId: string, quantity: number) => {
    const updatedItems = furnitureItems.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
    onUpdateFurniture(updatedItems)
  }, [furnitureItems, onUpdateFurniture])

  // Update both price and quantity in a single operation to avoid race condition
  const updateFurniturePriceAndQuantity = useCallback((itemId: string, price: number, quantity: number) => {
    const updatedItems = furnitureItems.map(item => {
      if (item.id === itemId) {
        return { ...item, userPrice: price, quantity: Math.max(1, quantity) }
      }
      return item
    })
    onUpdateFurniture(updatedItems)
  }, [furnitureItems, onUpdateFurniture])

  const toggleFurnitureItem = useCallback((itemId: string) => {
    const updatedItems = furnitureItems.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    )
    onUpdateFurniture(updatedItems)
  }, [furnitureItems, onUpdateFurniture])

  const toggleSingleLineItem = useCallback((itemId: string) => {
    const updatedItems = singleLineItems.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    )
    onUpdateSingleLine(updatedItems)
  }, [singleLineItems, onUpdateSingleLine])

  const updateRoomSize = useCallback((category: string, dimensionIndex: number) => {
    const newRoomSizes = { ...roomSizes, [category]: dimensionIndex }
    setRoomSizes(newRoomSizes)
  }, [roomSizes])

  const getRoomArea = useCallback((category: string) => {
    const roomDimensions = ROOM_DIMENSIONS[category as keyof typeof ROOM_DIMENSIONS]
    const selectedDimension = roomDimensions[roomSizes[category]]
    return selectedDimension.length * selectedDimension.width
  }, [roomSizes])

  // Filter categories based on home type
  const categories = [
    'Master Bedroom',
    'Children Bedroom',
    ...(homeDetails.homeType === '3BHK' ? ['Guest Bedroom'] : []),
    'Living Room',
    'Pooja Room',
    'Modular Kitchen'
  ]

  const getItemsByCategory = useCallback((category: string) => {
    return furnitureItems.filter(item => item.category === category)
  }, [furnitureItems])

  const hasSelectedItems = furnitureItems.some(item => item.selected) || singleLineItems.some(item => item.selected)

  const FurnitureItemCard = ({ item }: { item: FurnitureItem }) => {
    const [localPrice, setLocalPrice] = useState(item.userPrice.toString())
    const [localQty, setLocalQty] = useState(item.quantity.toString())
    const [showInputPanel, setShowInputPanel] = useState(false)
  
    useEffect(() => {
      setLocalPrice(item.userPrice.toString())
      setLocalQty(item.quantity.toString())
    }, [item.userPrice, item.quantity])
  
          const commitPrice = () => {
        const price = Number.parseFloat(localPrice) || 0
        updateFurniturePrice(item.id, price)
      }
  
    const commitQty = () => {
      const qty = Math.max(1, Number.parseInt(localQty) || 1)
      updateFurnitureQuantity(item.id, qty)
    }
  
          const handleSave = () => {
        const price = Number.parseFloat(localPrice) || 0
        const qty = Math.max(1, Number.parseInt(localQty) || 1)
        
        // Update both price and quantity in a single operation to avoid race condition
        updateFurniturePriceAndQuantity(item.id, price, qty)
        setShowInputPanel(false)
      }
  
          const getButtonText = () => {
        if (item.userPrice > 0 && item.quantity > 0) {
          return `₹${item.userPrice}/sq.ft × ${item.quantity}`
        }
        if (item.userPrice > 0) {
          return `₹${item.userPrice}/sq.ft`
        }
        return "Set Price & Qty"
      }
  
          return (
        <div 
          id={`item-${item.id}`} 
          className="bg-white rounded-lg p-2 border border-gray-300 hover:border-yellow-400 transition-all duration-200 hover:shadow-sm w-full max-w-full min-w-0 relative"
        >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => toggleFurnitureItem(item.id)}
            className="w-4 h-4 text-yellow-400 hover:cursor-pointer bg-gray-100 border-gray-300 rounded flex-shrink-0"
            data-item-id={item.id}
            data-item-name={item.name}
            data-item-category={item.category}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
            <div className="text-xs text-gray-600 truncate">{getRoomArea(item.category).toFixed(0)} sq.ft</div>
          </div>
  
          {item.selected && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInputPanel(!showInputPanel)}
                className="h-7 px-2 text-xs border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
              >
                {getButtonText()}
              </Button>
            </div>
          )}
        </div>
  
                 {showInputPanel && item.selected && (
           <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-56">
             <div className="space-y-3">
               <div>
                 <label className="text-xs font-medium text-gray-700 block mb-1">Price per sq.ft</label>
                 <Input
                   type="number"
                   value={localPrice}
                   onChange={(e) => setLocalPrice(e.target.value)}
                   className="h-8 text-sm"
                   placeholder="Enter price per sq.ft"
                   min="0"
                   autoFocus
                   onKeyDown={(e) => {
                     if (e.key === "Enter") handleSave()
                     if (e.key === "Escape") setShowInputPanel(false)
                   }}
                 />
               </div>

               <div>
                 <label className="text-xs font-medium text-gray-700 block mb-1">Quantity</label>
                 <Input
                   type="number"
                   value={localQty}
                   onChange={(e) => setLocalQty(e.target.value)}
                   className="h-8 text-sm"
                   placeholder="Qty"
                   min="1"
                   onKeyDown={(e) => {
                     if (e.key === "Enter") handleSave()
                     if (e.key === "Escape") setShowInputPanel(false)
                   }}
                 />
               </div>
               
               <div className="text-xs text-gray-600">
                 Room area: {getRoomArea(item.category).toFixed(0)} sq.ft
               </div>

               <div className="flex gap-2 pt-1">
                 <Button size="sm" onClick={handleSave} className="h-7 px-3 bg-yellow-500 hover:bg-yellow-600 text-white">
                   Save
                 </Button>
                 <Button size="sm" variant="outline" onClick={() => setShowInputPanel(false)} className="h-7 px-3">
                   Cancel
                 </Button>
               </div>
             </div>
           </div>
         )}
  
        {item.selected && item.userPrice > 0 && (
          <div className="mt-1 text-xs text-yellow-600 font-medium text-right">
            ₹{calculateItemTotalPrice(item).toLocaleString()}
          </div>
        )}
      </div>
    )
  }

  const SingleLineItemCard3 = ({ item }: { item: SingleLineItem }) => {
    const [localPrice, setLocalPrice] = useState(item.userPrice.toString())
    const [showPriceInput, setShowPriceInput] = useState(false)
  
    useEffect(() => {
      setLocalPrice(item.userPrice.toString())
    }, [item.userPrice])
  
    const commitPrice = () => {
      const price = Number.parseFloat(localPrice) || 0
      updateSingleLinePrice(item.id, price)
      setShowPriceInput(false)
    }
  
    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 relative">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => toggleSingleLineItem(item.id)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
  
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
            <div className="text-xs text-gray-500 truncate">× {homeDetails.carpetArea.toLocaleString()} sq.ft</div>
          </div>
  
          {item.selected && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPriceInput(!showPriceInput)}
                className="h-8 px-3 text-xs"
              >
                {item.userPrice > 0 ? `₹${item.userPrice}` : "Set Price"}
              </Button>
            </div>
          )}
        </div>
  
                 {showPriceInput && item.selected && (
           <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48">
             <div className="space-y-2">
               <label className="text-xs font-medium text-gray-700">Price per sq.ft</label>
               <div className="flex gap-2">
                 <Input
                   type="number"
                   value={localPrice}
                   onChange={(e) => setLocalPrice(e.target.value)}
                   className="h-8 text-sm"
                   placeholder="Enter price"
                   autoFocus
                   onKeyDown={(e) => {
                     if (e.key === "Enter") commitPrice()
                     if (e.key === "Escape") setShowPriceInput(false)
                   }}
                 />
                 <Button size="sm" onClick={commitPrice} className="h-8 px-3">
                   Save
                 </Button>
               </div>
             </div>
           </div>
         )}
  
        {item.selected && item.userPrice > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-right">
              <span className="text-gray-500">Total: </span>
              <span className="font-semibold text-blue-600">₹{calculateSingleLineTotalPrice(item).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const CategoryColumn = ({ category }: { category: string }) => {
    const categoryItems = getItemsByCategory(category)
    const roomDimensions = ROOM_DIMENSIONS[category as keyof typeof ROOM_DIMENSIONS]
    const selectedDimension = roomDimensions[roomSizes[category]]
    
    return (
      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
          {category}
        </h3>
        
        {/* Room Size Selector */}
          <div className="flex items-center gap-1">
          <select
            value={roomSizes[category]}
            onChange={(e) => updateRoomSize(category, parseInt(e.target.value))}
              className="px-1 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 text-xs"
          >
            {roomDimensions.map((option, index) => (
              <option key={index} value={index}>
                {option.label}
              </option>
            ))}
          </select>
            <span className="text-xs text-gray-600">
              {(selectedDimension.length * selectedDimension.width).toFixed(0)} sq.ft
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          {categoryItems.map((item) => (
            <FurnitureItemCard key={`${item.category}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 overflow-x-hidden">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-3 sm:p-6 border-2 border-yellow-400 max-w-6xl mx-auto w-full overflow-x-hidden">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">
            Select Furniture Items
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Choose the furniture items you want and enter their prices
          </p>
        </div>

        {/* Single Line Items Section */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-md text-sm mr-2">1</span>
            Single Line Items
          </h3>
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">
              These items are calculated based on your carpet area of {homeDetails.carpetArea} sq.ft
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {singleLineItems.map((item) => (
                <SingleLineItemCard3 key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Wood Work Section */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-md text-sm mr-2">2</span>
            Wood Work
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-full overflow-x-hidden">
            {categories.map((category) => (
              <CategoryColumn key={category} category={category} />
            ))}
          </div>
        </div>

        {/* Selected Items Summary */}
        {hasSelectedItems && (
          <div className="mt-4 sm:mt-6 bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-300 w-full max-w-full overflow-x-hidden">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
              Selected Items Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 w-full max-w-full overflow-x-hidden">
              {/* Single Line Items */}
              {singleLineItems.filter(item => item.selected).map((item) => (
                <div key={item.id} className="bg-white rounded p-2 sm:p-3 border border-yellow-400 shadow-sm min-w-0 overflow-hidden">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-600 truncate">
                    Rate: ₹{item.userPrice}/sq.ft × {homeDetails.carpetArea} sq.ft
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900 mt-1">
                    ₹{Math.round(calculateSingleLineTotalPrice(item)).toLocaleString()}
                  </div>
                </div>
              ))}
              {/* Furniture Items */}
              {furnitureItems.filter(item => item.selected).map((item) => {
                const totalPrice = calculateItemTotalPrice(item)
                const roomDimensions = ROOM_DIMENSIONS[item.category as keyof typeof ROOM_DIMENSIONS]
                const selectedDimension = roomDimensions[roomSizes[item.category]]
                const roomArea = selectedDimension.length * selectedDimension.width
                return (
                  <div key={item.id} className="bg-white rounded p-2 sm:p-3 border border-yellow-400 shadow-sm min-w-0 overflow-hidden">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-600 truncate">
                      ₹{item.userPrice}/sq.ft × {roomArea.toFixed(0)} sq.ft × {item.quantity} qty
                      </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 mt-1">
                      ₹{Math.round(totalPrice).toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-3 sm:gap-0 w-full max-w-full">
          <button
            onClick={onPrev}
            className="order-2 sm:order-1 flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base font-medium rounded-lg border-2 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 transition-all duration-200 min-h-[44px]"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home Type
          </button>
          <button
            onClick={onNext}
            className="order-1 sm:order-2 flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-black text-yellow-400 hover:bg-gray-800 transition-all duration-200 min-h-[44px]"
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