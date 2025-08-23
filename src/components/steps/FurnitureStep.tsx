
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import type { FurnitureItem, RoomSizeSelection, HomeDetails } from '../../types'
import { Input } from '../ui/input'

interface FurnitureStepProps {
  items: FurnitureItem[];
  homeDetails: HomeDetails;
  onUpdateItems: (items: FurnitureItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FurnitureStep: React.FC<FurnitureStepProps> = ({ 
  items, 
  homeDetails,
  onUpdateItems,
  onNext, 
  onPrev 
}) => {
  // Group items by type and then by category
  const groupedItems = useMemo(() => {
    const groups: { [type: string]: { [category: string]: FurnitureItem[] } } = {};
    
    items.forEach(item => {
      const { type, category } = item;
      if (!groups[type]) {
        groups[type] = {};
      }
      if (!groups[type][category]) {
        groups[type][category] = [];
      }
      groups[type][category].push(item);
    });
    
    return groups;
  }, [items]);

  const itemTypes = useMemo(() => Object.keys(groupedItems), [groupedItems]);

  // State for user-entered dimensions
  const [userDimensions, setUserDimensions] = useState<{[itemId: string]: {length: number, width: number}}>({})

  // Update user dimensions
  const updateUserDimensions = useCallback((itemId: string, length: number, width: number) => {
    setUserDimensions(prev => ({
      ...prev,
      [itemId]: { length, width }
    }))
  }, [])

  // Calculate total price for furniture items based on user input (price per sqft * room area)
  const calculateItemTotalPrice = useCallback((item: FurnitureItem) => {
    // Use user-entered dimensions if available
    const userDimensions = getUserDimensions(item.id)
    if (userDimensions.length > 0 && userDimensions.width > 0) {
      const roomArea = userDimensions.length * userDimensions.width
      return item.userPrice * roomArea
    }
    
    // Return 0 if no dimensions entered
    return 0
  }, [])

  // Get user-entered dimensions for an item
  const getUserDimensions = useCallback((itemId: string) => {
    return userDimensions[itemId] || { length: 0, width: 0 }
  }, [userDimensions])

  // Calculate total price for single line items based on user input and carpet area
  const calculateSingleLineTotalPrice = useCallback((item: FurnitureItem) => {
    return item.userPrice * homeDetails.carpetArea
  }, [homeDetails.carpetArea])

  // Update price in a single operation
  const updateFurniturePrice = useCallback((itemId: string, price: number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, userPrice: price }
      }
      return item
    })
    onUpdateItems(updatedItems)
  }, [items, onUpdateItems])

  const toggleItem = useCallback((itemId: string) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );
    onUpdateItems(updatedItems);
  }, [items, onUpdateItems]);

  const hasSelectedItems = items.some(item => item.selected)

  // Calculate estimated price based on API price per sqft and user dimensions
  const calculateEstimatedPrice = useCallback((item: FurnitureItem) => {
    const userDims = getUserDimensions(item.id)
    if (userDims.length > 0 && userDims.width > 0) {
      const roomArea = userDims.length * userDims.width
      // Check if pricePerSqFt is valid
      if (item.pricePerSqFt && !isNaN(item.pricePerSqFt)) {
        return item.pricePerSqFt * roomArea
      }
    }
    return 0
  }, [getUserDimensions])

  const FurnitureItemRow = React.memo(({ item }: { item: FurnitureItem }) => {
    const [localPrice, setLocalPrice] = useState(item.userPrice.toString())
    const [localLength, setLocalLength] = useState(userDimensions[item.id]?.length?.toString() || "")
    const [localWidth, setLocalWidth] = useState(userDimensions[item.id]?.width?.toString() || "")
  
    // Debounce refs
    const dimensionUpdateTimeout = useRef<NodeJS.Timeout | null>(null)
    const priceUpdateTimeout = useRef<NodeJS.Timeout | null>(null)
  
    useEffect(() => {
      setLocalPrice(item.userPrice.toString())
    }, [item.userPrice])
  
    useEffect(() => {
      setLocalLength(userDimensions[item.id]?.length?.toString() || "")
      setLocalWidth(userDimensions[item.id]?.width?.toString() || "")
    }, [userDimensions, item.id])
  
    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        if (dimensionUpdateTimeout.current) clearTimeout(dimensionUpdateTimeout.current)
        if (priceUpdateTimeout.current) clearTimeout(priceUpdateTimeout.current)
      }
    }, [])
  
    // Debounced dimension update - only called on blur/enter, not onChange
    const saveDimensions = useCallback(() => {
      if (dimensionUpdateTimeout.current) {
        clearTimeout(dimensionUpdateTimeout.current)
      }
      
      const lengthNum = Number.parseFloat(localLength) || 0
      const widthNum = Number.parseFloat(localWidth) || 0
      updateUserDimensions(item.id, lengthNum, widthNum)
    }, [localLength, localWidth, item.id])
  
    // Debounced price update
    const savePrice = useCallback(() => {
      if (priceUpdateTimeout.current) {
        clearTimeout(priceUpdateTimeout.current)
      }
      
      const price = Number.parseFloat(localPrice) || 0
      updateFurniturePrice(item.id, price)
    }, [localPrice, item.id])
  
    // Stable event handlers using useCallback
    const handleLengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalLength(e.target.value)
    }, [])
  
    const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalWidth(e.target.value)
    }, [])
  
    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalPrice(e.target.value)
    }, [])
  
    const handleToggle = useCallback(() => {
      toggleItem(item.id)
    }, [item.id])
  
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, saveFunction: () => void) => {
      if (e.key === "Enter") {
        saveFunction()
        e.currentTarget.blur()
      }
    }, [])
  
    // Calculate area based on user dimensions
    const userArea = useMemo(() => {
      return (Number.parseFloat(localLength) || 0) * (Number.parseFloat(localWidth) || 0)
    }, [localLength, localWidth])
  
    // Calculate estimated price
    const estimatedPriceDisplay = useMemo(() => {
      const userDims = getUserDimensions(item.id)
      if (userDims.length > 0 && userDims.width > 0) {
        if (item.pricePerSqFt && !isNaN(item.pricePerSqFt)) {
          return `₹${calculateEstimatedPrice(item).toLocaleString()}`
        }
        return "Invalid price data"
      }
      return "Enter dimensions"
    }, [item, userArea])
  
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200">
        {/* Left side: Item Name, Checkbox, and Dimensions */}
        <div className="flex items-center gap-4">
          {/* Item Name and Checkbox */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={handleToggle}
              className="w-4 h-4 text-yellow-400 hover:cursor-pointer bg-gray-100 border-gray-300 rounded flex-shrink-0"
              data-item-id={item.id}
              data-item-name={item.name}
              data-item-category={item.category}
            />
            <span className="text-sm font-medium text-gray-900">{item.name}</span>
          </div>
  
          {/* Dimension Inputs - FIXED with stable keys and no onChange updates */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <Input
              key={`length-${item.id}`}
              type="number"
              value={localLength}
              onChange={handleLengthChange}
              onBlur={saveDimensions}
              onKeyDown={(e) => handleKeyDown(e, saveDimensions)}
              className="h-8 w-16 text-sm border border-gray-300 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 rounded transition-colors"
              placeholder="L"
              min="0"
              step="0.1"
              onFocus={(e) => e.target.select()}
              autoComplete="off"
            />
            <span className="text-sm text-gray-500">×</span>
            <Input
              key={`width-${item.id}`}
              type="number"
              value={localWidth}
              onChange={handleWidthChange}
              onBlur={saveDimensions}
              onKeyDown={(e) => handleKeyDown(e, saveDimensions)}
              className="h-8 w-16 text-sm border border-gray-300 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 rounded transition-colors"
              placeholder="W"
              min="0"
              step="0.1"
              onFocus={(e) => e.target.select()}
              autoComplete="off"
            />
          </div>
        </div>
  
        {/* Right side: Prices */}
        <div className="flex items-center gap-6">
          {/* Estimated Price (from API pricePerSqFt) */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-sm text-gray-600">Est:</span>
            <span className="text-sm font-medium text-gray-900">
              {estimatedPriceDisplay}
            </span>
          </div>
  
          {/* User Price Input - FIXED */}
          <div className="min-w-[120px] flex items-center">
            <label className="text-xs font-medium text-gray-700 mb-1">Your Price/sq.ft</label>
            <Input
              key={`price-${item.id}`}
              type="number"
              value={localPrice}
              onChange={handlePriceChange}
              onBlur={savePrice}
              onKeyDown={(e) => handleKeyDown(e, savePrice)}
              className="h-8 text-sm"
              placeholder="0"
              min="0"
              onFocus={(e) => e.target.select()}
              autoComplete="off"
            />
          </div>
  
          {/* Total Price Display */}
          {item.selected && item.userPrice > 0 && userArea > 0 && (
            <div className="min-w-[120px] text-right">
              <div className="text-xs text-gray-600">Total:</div>
              <div className="text-sm font-medium text-yellow-400">
                ₹{(item.userPrice * userArea).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  })
  
  // Add display name for debugging
  FurnitureItemRow.displayName = 'FurnitureItemRow'
  const CategorySection = ({ category, items }: { category: string; items: FurnitureItem[] }) => {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        {/* Category Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
        </div>
  
        {/* Items Displayed in Rows */}
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 p-3 bg-gray-100 border border-gray-200 rounded-lg font-medium text-sm text-gray-700">
            {/* Left section - matches checkbox + name + dimensions in FurnitureItemRow */}
            <div className="flex items-center gap-4">
              <div className="min-w-[200px]">Item Name</div>
              <div className="min-w-[120px] text-center">Dimensions (ft)</div>
            </div>
  
            {/* Right section - matches price columns in FurnitureItemRow */}
            <div className="flex items-center gap-4">
              <div className="min-w-[120px] text-right">Est. Price</div>
              <div className="min-w-[120px] text-center">Your Price/sq.ft</div>
              <div className="min-w-[120px] text-right">Total Price</div>
            </div>
          </div>
  
          {items.map((item) => (
            <FurnitureItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full mx-auto px-4 overflow-x-hidden">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Select Items
          </h2>
          <p className="text-gray-600">
            Choose the items you want and enter their dimensions and prices
          </p>
        </div>

        {itemTypes.map((type, index) => (
          <div key={type} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm mr-3">{index + 1}</span>
              {type}
            </h3>
            <div className="space-y-6">
              {Object.keys(groupedItems[type]).map(category => (
                <CategorySection 
                  key={category} 
                  category={category} 
                  items={groupedItems[type][category]} 
                />
              ))}
            </div>
          </div>
        ))}

        {/* Selected Items Summary */}
        {hasSelectedItems && (
          <div className="mt-8 bg-yellow-40 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Items Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Single Line Items (False Ceiling, Painting, etc.) */}
              {items.filter(item => item.selected && item.type === 'Single Line Items').map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-600 truncate">
                    Rate: ₹{item.userPrice}/sq.ft × {homeDetails.carpetArea} sq.ft
                  </div>
                  <div className="text-sm font-medium text-gray-900 mt-2">
                    ₹{Math.round(calculateSingleLineTotalPrice(item)).toLocaleString()}
                  </div>
                </div>
              ))}
              {/* Furniture Items (Woodwork, etc.) */}
              {items.filter(item => item.selected && item.type !== 'Single Line Items').map((item) => {
                const totalPrice = calculateItemTotalPrice(item)
                const userDims = getUserDimensions(item.id)
                const roomArea = userDims.length > 0 && userDims.width > 0 
                  ? userDims.length * userDims.width 
                  : 0
                return (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-xs text-gray-600 truncate">
                      ₹{item.userPrice}/sq.ft × {roomArea.toFixed(0)} sq.ft
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-2">
                      ₹{Math.round(totalPrice).toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <button
            onClick={onPrev}
            className="order-2 sm:order-1 flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-medium rounded-lg border-2 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 transition-all duration-200 min-h-[44px]"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home Type
          </button>
          <button
            onClick={onNext}
            className="order-1 sm:order-2 flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-medium rounded-lg bg-yellow-400 text-white hover:bg-yellow-700 transition-all duration-200 min-h-[44px]"
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