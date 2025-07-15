import { Zap, Home, Sofa, Paintbrush2, Settings, UtensilsCrossed, Lightbulb } from 'lucide-react'
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
  carpetArea, 
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  // Filter services based on quality tier
  const getFilteredServices = () => {
    return serviceItems.filter(service => {
      // Always show general services (electrical, false-ceiling, etc.)
      const generalServices = ['electrical', 'false-ceiling', 'sofa-dining', 'full-house-painting']
      if (generalServices.includes(service.id)) {
        return true
      }
      
      // For additional add-ins with dynamic pricing, show all items
      // The pricing will be calculated based on the selected quality tier
      if (service.pricing) {
        return true
      }
      
      return true
    })
  }

  const filteredServices = getFilteredServices()

  const toggleServiceItem = (itemId: string) => {
    const updatedItems = serviceItems.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    )
    onUpdate(updatedItems)
  }

  const calculateServicePrice = (service: ServiceItem) => {
    // If service has dynamic pricing, use it
    if (service.pricing && homeDetails.homeType && homeDetails.qualityTier) {
      const homeTypePrice = service.pricing[homeDetails.homeType]
      if (homeTypePrice && homeTypePrice[homeDetails.qualityTier] !== undefined) {
        return homeTypePrice[homeDetails.qualityTier]
      }
    }
    
    // Otherwise, use the standard pricing
    if (service.pricePerSqFt > 0) {
      return service.basePrice + (service.pricePerSqFt * carpetArea)
    }
    return service.basePrice
  }

  const getServiceIcon = (serviceId: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'electrical': Zap,
      'false-ceiling': Home,
      'sofa-dining': Sofa,
      'full-house-painting': Paintbrush2,
      'sofa-premium': Sofa,
      'dining-table-premium': UtensilsCrossed,
      'carpets-premium': Home,
      'designer-lights-premium': Lightbulb
    }
    return icons[serviceId] || Settings
  }

  // Generate dynamic description based on home type
  const getDynamicDescription = (service: ServiceItem) => {
    return service.description.replace('3BHK', homeDetails.homeType)
  }

  // Generate dynamic service name based on quality tier
  const getDynamicServiceName = (service: ServiceItem) => {
    if (service.pricing && homeDetails.qualityTier) {
      // For services with dynamic pricing, show the quality tier in the name
      if (service.id.includes('-premium')) {
        return service.name.replace('(Premium)', `(${homeDetails.qualityTier})`)
      }
    }
    return service.name
  }

  const ServiceCard = ({ service }: { service: ServiceItem }) => {
    const IconComponent = getServiceIcon(service.id)
    
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-1 border-gray-200 hover:border-yellow-400 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center flex-1 min-w-0">
            <div className="mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0">
              <IconComponent 
                size={24} 
                className="sm:w-8 sm:h-8 text-yellow-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-black leading-tight truncate">{getDynamicServiceName(service)}</h3>
              <p className="text-[10px] sm:text-xs text-gray-700 mt-1 leading-tight truncate">
  {getDynamicDescription(service)}
</p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer ml-2 flex-shrink-0">
            <input
              type="checkbox"
              checked={service.selected}
              onChange={() => toggleServiceItem(service.id)}
              className="w-5 h-5 text-yellow-400 hover:cursor-pointer bg-gray-100 border-gray-300 rounded"
            />
          </label>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          {service.basePrice > 0 && (
            <div className="text-xs sm:text-sm text-gray-700 truncate">
              <span className="font-semibold">Base Price:</span> ₹{service.basePrice.toLocaleString()}
            </div>
          )}
          <div className="text-sm sm:text-base font-medium text-black bg-gray-100 px-2 sm:px-3 py-1 rounded-lg">
            Total: ₹{calculateServicePrice(service).toLocaleString()}
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
            Select additional services to enhance your interior design
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full max-w-full pt-2 overflow-x-hidden">
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

        {/* Service Details */}
        

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