import { useCallback } from 'react'
import type { ServiceItem, HomeDetails } from '../../types'

interface ServicesStepProps {
  serviceItems: ServiceItem[]
  homeDetails: HomeDetails
  carpetArea: number
  onUpdate: (serviceItems: ServiceItem[]) => void
  onNext: () => void
  onPrev: () => void
}

const ServicesStep: React.FC<ServicesStepProps> = ({ 
  serviceItems, 
  homeDetails,
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  // Filter services based on quality tier
  const getFilteredServices = useCallback(() => {
    return serviceItems.filter(() => {
      // Always show all services
      return true
    })
  }, [serviceItems])

  const filteredServices = getFilteredServices()

  const toggleServiceItem = useCallback((itemId: string) => {
    const updatedItems = serviceItems.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    )
    onUpdate(updatedItems)
  }, [serviceItems, onUpdate])

  // Update service item price - using stable functions from parent
  const updateServicePrice = useCallback((itemId: string, price: number) => {
    const updatedItems = serviceItems.map(item => 
      item.id === itemId ? { ...item, userPrice: price } : item
    )
    onUpdate(updatedItems)
  }, [serviceItems, onUpdate])

  const calculateServicePrice = useCallback((service: ServiceItem) => {
    // Use user input price directly
    return service.userPrice
  }, [])



  // Generate dynamic description based on home type
  const getDynamicDescription = useCallback((service: ServiceItem) => {
    return (service.description || '').replace('your home', homeDetails.homeType)
  }, [homeDetails.homeType])

  // Generate dynamic service name based on quality tier
  const getDynamicServiceName = useCallback((service: ServiceItem) => {
    // For new service format, append quality tier
    if (homeDetails.qualityTier) {
      return `${service.name} (${homeDetails.qualityTier})`
    }
    return service.name
  }, [homeDetails.qualityTier])

  const ServiceCard = ({ service }: { service: ServiceItem }) => {
    return (
      <div className="bg-white rounded-lg p-2 border border-gray-200 hover:border-yellow-400 transition-all duration-200 hover:shadow-sm w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-black leading-tight truncate">{getDynamicServiceName(service)}</h3>
              <p className="text-xs text-gray-700 truncate">
                {getDynamicDescription(service)}
              </p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer ml-2 flex-shrink-0">
            <input
              type="checkbox"
              checked={service.selected}
              onChange={() => toggleServiceItem(service.id)}
              className="w-4 h-4 text-yellow-400 hover:cursor-pointer bg-gray-100 border-gray-300 rounded"
            />
          </label>
        </div>
        
        {/* Price Input - Always rendered but shown/hidden with CSS */}
        <div className={`flex gap-2 ${service.selected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Price (₹)</label>
            <input
              key={`service-price-${service.id}`}
              type="number"
              value={service.userPrice || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                updateServicePrice(service.id, value)
              }}
              onBlur={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                updateServicePrice(service.id, value)
              }}
              placeholder="Enter price"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
              min="0"
              tabIndex={service.selected ? 0 : -1}
            />
          </div>
          <div className={`flex items-end ${service.userPrice > 0 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-xs font-medium text-black bg-gray-100 px-2 py-1 rounded">
              ₹{calculateServicePrice(service).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedServices = filteredServices.filter(service => service.selected)
  const totalServiceCost = selectedServices.reduce((total, service) => total + calculateServicePrice(service), 0)

  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 overflow-x-hidden">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-3 sm:p-6 border-2 border-yellow-400 max-w-5xl mx-auto w-full overflow-x-hidden">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black mb-2 sm:mb-3">
            Optional Services
          </h2>
          <p className="text-sm sm:text-base text-gray-700">
            Select additional services and enter their prices
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4 w-full max-w-full pt-2 overflow-x-hidden">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <div className="mb-4 sm:mb-6 bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-yellow-400">
            <h4 className="text-sm sm:text-base font-semibold text-black mb-2 sm:mb-3">
              Selected Services Summary
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center bg-white rounded-lg p-2 sm:p-3 border-2 border-yellow-300 shadow-md">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base text-black">{getDynamicServiceName(service)}</div>
                    <div className="text-xs sm:text-sm text-gray-700 truncate">{getDynamicDescription(service)}</div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className="font-semibold text-sm sm:text-base text-black">
                      ₹{calculateServicePrice(service).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t-2 border-yellow-400 pt-2 sm:pt-3">
                <div className="flex justify-between items-center bg-black rounded-lg p-2 sm:p-3">
                  <div className="text-sm sm:text-base font-semibold text-yellow-400">
                    Total Services Cost:
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-yellow-400">
                    ₹{totalServiceCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <button
            onClick={onPrev}
            className="order-2 sm:order-1 px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="order-1 sm:order-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
          >
            Continue to Details →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServicesStep 