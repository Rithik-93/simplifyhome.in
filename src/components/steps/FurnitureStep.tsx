import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import type { FurnitureItem, HomeDetails } from '../../types'
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
      
      // For Add Ons items, show them if they're relevant to the selected BHK
      if (type === 'Add Ons') {
        const homeType = homeDetails.homeType;
        // Show Add Ons if BHK is selected and item has pricing for that BHK
        if (homeType === '2BHK' || homeType === '3BHK') {
          const hasPricing = item.addonPricing && item.addonPricing.some(pricing => 
            (homeType === '2BHK' && pricing.roomType === 'BHK_2') ||
            (homeType === '3BHK' && pricing.roomType === 'BHK_3')
          );
          
          if (hasPricing) {
            if (!groups[type]) {
              groups[type] = {};
            }
            if (!groups[type][category]) {
              groups[type][category] = [];
            }
            groups[type][category].push(item);
          }
        }
        // Don't show Add Ons for other BHK types or if no BHK is selected
      } else {
        // For non-Add Ons items, show them normally
        if (!groups[type]) {
          groups[type] = {};
        }
        if (!groups[type][category]) {
          groups[type][category] = [];
        }
        groups[type][category].push(item);
      }
    });
    
    return groups;
  }, [items, homeDetails.homeType]);

  // Ensure Add Ons appears last by sorting types
  const itemTypes = useMemo(() => {
    const types = Object.keys(groupedItems);
    return types.sort((a, b) => {
      // Put Add Ons last
      if (a === 'Add Ons') return 1;
      if (b === 'Add Ons') return -1;
      return 0;
    });
  }, [groupedItems]);

  // State for user-entered dimensions
  const [userDimensions, setUserDimensions] = useState<{[itemId: string]: {length: number, width: number}}>({})

  // Update user dimensions
  const updateUserDimensions = useCallback((itemId: string, length: number, width: number) => {
    setUserDimensions(prev => ({
      ...prev,
      [itemId]: { length, width }
    }))
    
    // Also update the items to include dimensions for the estimate step
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, userDimensions: { length, width } }
      }
      return item
    })
    onUpdateItems(updatedItems)
  }, [items, onUpdateItems])

  // Get default price for Add Ons items based on BHK and quality tier
  const getDefaultAddOnsPrice = useCallback((item: FurnitureItem) => {
    if (item.type !== 'Add Ons' || !item.addonPricing) return 0;
    
    const homeType = homeDetails.homeType;
    const qualityTier = homeDetails.qualityTier;
    
    // Find the pricing for the selected BHK
    const pricing = item.addonPricing.find(p => 
      (homeType === '2BHK' && p.roomType === 'BHK_2') ||
      (homeType === '3BHK' && p.roomType === 'BHK_3')
    );
    
    if (pricing) {
      return qualityTier === 'Luxury' ? pricing.luxuryPrice : pricing.premiumPrice;
    }
    
    return 0;
  }, [homeDetails.homeType, homeDetails.qualityTier]);

  // Get user-entered dimensions for an item
  const getUserDimensions = useCallback((itemId: string) => {
    return userDimensions[itemId] || { length: 0, width: 0 }
  }, [userDimensions])

  // Calculate estimated price based on API price per sqft and user dimensions or carpet area
  const calculateEstimatedPrice = useCallback((item: FurnitureItem) => {
    const isAddOnsItem = item.type === 'Add Ons';
    const isSingleLineItem = item.type === 'Single Line';
    
    if (isAddOnsItem) {
      return getDefaultAddOnsPrice(item);
    } else if (isSingleLineItem) {
      if (item.pricePerSqFt && !isNaN(item.pricePerSqFt)) {
        return item.pricePerSqFt * homeDetails.carpetArea;
      }
    } else {
      // For woodwork items, use user dimensions
      const userDims = getUserDimensions(item.id);
      if (userDims.length > 0 && userDims.width > 0) {
        const roomArea = userDims.length * userDims.width;
        if (item.pricePerSqFt && !isNaN(item.pricePerSqFt)) {
          return item.pricePerSqFt * roomArea;
        }
      }
    }
    return 0;
  }, [getUserDimensions, getDefaultAddOnsPrice, homeDetails.carpetArea]);

  // Get effective price (user price or estimated price if user price is 0)
  const getEffectivePrice = useCallback((item: FurnitureItem) => {
    if (item.userPrice > 0) {
      return item.userPrice;
    }
    // If user price is 0, calculate estimated price per unit
    const estimatedTotal = calculateEstimatedPrice(item);
    const isAddOnsItem = item.type === 'Add Ons';
    const isSingleLineItem = item.type === 'Single Line';
    
    if (isAddOnsItem) {
      return estimatedTotal; // Fixed price for add-ons
    } else if (isSingleLineItem) {
      return item.pricePerSqFt || 0; // Price per sq ft
    } else {
      return item.pricePerSqFt || 0; // Price per sq ft for woodwork
    }
  }, [calculateEstimatedPrice]);

  // Calculate total price for an item in summary
  const calculateItemTotalPrice = useCallback((item: FurnitureItem) => {
    const effectivePrice = getEffectivePrice(item);
    const isAddOnsItem = item.type === 'Add Ons';
    const isSingleLineItem = item.type === 'Single Line Items';
    
    if (isAddOnsItem) {
      return effectivePrice; // Fixed price
    } else if (isSingleLineItem) {
      return effectivePrice * homeDetails.carpetArea;
    } else {
      // For woodwork items, use user dimensions
      const userDims = getUserDimensions(item.id);
      const roomArea = userDims.length * userDims.width;
      return effectivePrice * roomArea;
    }
  }, [getEffectivePrice, getUserDimensions, homeDetails.carpetArea]);

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

  const FurnitureItemRow = React.memo(({ item }: { item: FurnitureItem }) => {
    const [localPrice, setLocalPrice] = useState(item.userPrice.toString())
    const [localLength, setLocalLength] = useState(userDimensions[item.id]?.length?.toString() || "")
    const [localWidth, setLocalWidth] = useState(userDimensions[item.id]?.width?.toString() || "")
  
    // Check if this is a single line item or add ons item (no dimensions needed)
    const isSingleLineItem = item.type === 'Single Line Items'
    const isAddOnsItem = item.type === 'Add Ons'
    const needsDimensions = !isSingleLineItem && !isAddOnsItem
  
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
      if (isAddOnsItem) {
        // For Add Ons items, use BHK-specific pricing based on home type
        const homeType = homeDetails.homeType;
        const qualityTier = homeDetails.qualityTier;
        
        if (item.addonPricing) {
          const pricing = item.addonPricing.find(p => 
            (homeType === '2BHK' && p.roomType === 'BHK_2') ||
            (homeType === '3BHK' && p.roomType === 'BHK_3')
          );
          
          if (pricing) {
            const price = qualityTier === 'Luxury' ? pricing.luxuryPrice : pricing.premiumPrice;
            return `₹${price.toLocaleString()}`;
          }
        }
        return "Select home type"
      } else if (isSingleLineItem) {
        // For single line items, use carpet area
        if (item.pricePerSqFt && !isNaN(item.pricePerSqFt)) {
          return `₹${(item.pricePerSqFt * homeDetails.carpetArea).toLocaleString()}`
        }
        return "Invalid price data"
      } else {
        // For woodwork items, use user dimensions
        const userDims = getUserDimensions(item.id)
        if (userDims.length > 0 && userDims.width > 0) {
          if (item.pricePerSqFt && !isNaN(item.pricePerSqFt)) {
            return `₹${calculateEstimatedPrice(item).toLocaleString()}`
          }
          return "Invalid price data"
        }
        return "Enter dimensions"
      }
    }, [item, userArea, isSingleLineItem, isAddOnsItem, homeDetails.carpetArea, homeDetails.homeType, homeDetails.qualityTier])
  
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
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{item.name}</span>
              {/* Price per sq ft information below item name */}
              <div className="text-xs text-gray-500 mt-1">
                {isAddOnsItem ? (
                  // For Add Ons items, show BHK-specific pricing
                  <span className="text-yellow-400 font-medium">
                    Fixed Price Item
                  </span>
                ) : isSingleLineItem ? (
                  // For single line items, show per sq ft pricing
                  <span>
                    ₹{item.pricePerSqFt}/sq.ft
                  </span>
                ) : (
                  // For woodwork items, show per sq ft pricing
                  <span>
                    ₹{item.pricePerSqFt}/sq.ft
                  </span>
                )}
              </div>
            </div>
          </div>
  
          {/* Dimension Inputs - Hidden for single line items and add ons */}
          {needsDimensions ? (
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
          ) : isSingleLineItem ? (
            <div className="min-w-[120px] text-center">
              <div className="text-xs text-gray-600">Carpet Area</div>
              <div className="text-sm font-medium text-gray-900">{homeDetails.carpetArea} sq.ft</div>
            </div>
          ) : (
            <div className="min-w-[120px] text-center">
              <div className="text-xs text-gray-600">Fixed Price</div>
              <div className="text-sm font-medium text-gray-900">Per Item</div>
            </div>
          )}
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
            <label className="text-xs font-medium text-gray-700 mb-1 mr-2">Rs.</label>
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
          {/* Header Row - Now matches FurnitureItemRow structure exactly */}
          <div className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-lg">
            {/* Left side - matches FurnitureItemRow left structure */}
            <div className="flex items-center gap-4">
              <div className="min-w-[200px] flex items-center gap-3">
                <div className="w-4"></div> {/* Space for checkbox */}
                <span className="text-sm font-medium text-gray-700">Item Name</span>
              </div>
              <div className="min-w-[120px] text-center">
                <span className="text-sm font-medium text-gray-700">Dimensions</span>
              </div>
            </div>
  
            {/* Right side - matches FurnitureItemRow right structure */}
            <div className="flex items-center gap-6">
              <div className="min-w-[200px]">
                <span className="text-sm font-medium text-gray-700">Estimated Price</span>
              </div>
              <div className="min-w-[120px] text-right">
                <span className="text-sm font-medium text-gray-700">Your Price</span>
              </div>
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
            Choose the items you want. For woodwork items, enter dimensions and prices. For single line items, just enter your price. Add ons have fixed pricing per BHK.
          </p>
        </div>

        {itemTypes.map((type, index) => (
          <div key={type} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-yellow-400 text-white px-3 py-1 rounded-md text-sm mr-3">{index + 1}</span>
              {type}
            </h3>
            
            {/* Special message for Add Ons when no BHK is selected */}
            {type === 'Add Ons' && !['2BHK', '3BHK'].includes(homeDetails.homeType) && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Add Ons are only available for 2BHK and 3BHK homes. Please select a home type to see available add-ons.
                </p>
              </div>
            )}
            
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

        {/* Selected Items Summary - FIXED */}
        {hasSelectedItems && (
          <div className="mt-8 bg-yellow-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Items Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Single Line Items (False Ceiling, Painting, etc.) */}
              {items.filter(item => item.selected && item.type === 'Single Line Items').map((item) => {
                const effectivePrice = getEffectivePrice(item);
                const totalPrice = calculateItemTotalPrice(item);
                return (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-xs text-gray-600 truncate">
                      Rate: ₹{effectivePrice}/sq.ft × {homeDetails.carpetArea} sq.ft
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-2">
                      ₹{Math.round(totalPrice).toLocaleString()}
                    </div>
                    {item.userPrice === 0 && (
                      <div className="text-xs text-blue-600 mt-1">Using estimated price</div>
                    )}
                  </div>
                );
              })}
              
              {/* Add Ons Items (Fixed pricing per BHK) */}
              {items.filter(item => {
                if (item.selected && item.type === 'Add Ons') {
                  const homeType = homeDetails.homeType;
                  // Only show Add Ons items that are relevant to the selected BHK
                  if (homeType === '2BHK' || homeType === '3BHK') {
                    return item.addonPricing && item.addonPricing.some(pricing => 
                      (homeType === '2BHK' && pricing.roomType === 'BHK_2') ||
                      (homeType === '3BHK' && pricing.roomType === 'BHK_3')
                    );
                  }
                  return false; // Don't show Add Ons for other BHK types
                }
                return false;
              }).map((item) => {
                const totalPrice = calculateItemTotalPrice(item);
                return (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-xs text-gray-600 truncate">
                      Fixed Price: ₹{totalPrice}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-2">
                      ₹{totalPrice.toLocaleString()}
                    </div>
                    {item.userPrice === 0 && (
                      <div className="text-xs text-blue-600 mt-1">Using estimated price</div>
                    )}
                  </div>
                );
              })}
              
              {/* Furniture Items (Woodwork, etc.) */}
              {items.filter(item => item.selected && item.type !== 'Single Line Items' && item.type !== 'Add Ons').map((item) => {
                const userDims = getUserDimensions(item.id);
                const roomArea = userDims.length > 0 && userDims.width > 0 
                  ? userDims.length * userDims.width 
                  : 0;
                const effectivePrice = getEffectivePrice(item);
                const totalPrice = calculateItemTotalPrice(item);
                
                return (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-xs text-gray-600 truncate">
                      ₹{effectivePrice}/sq.ft × {roomArea.toFixed(1)} sq.ft
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-2">
                      ₹{Math.round(totalPrice).toLocaleString()}
                    </div>
                    {item.userPrice === 0 && (
                      <div className="text-xs text-blue-600 mt-1">Using estimated price</div>
                    )}
                  </div>
                );
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
            className="order-1 sm:order-2 flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-medium rounded-lg bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-lg transition-all duration-200 min-h-[44px]"
          >
            Continue to Details →
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