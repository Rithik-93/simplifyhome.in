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
    const qualityTier = homeDetails.qualityTier.toLowerCase()
    
    return serviceItems.filter(service => {
      // Always show general services (electrical, false-ceiling, etc.)
      const generalServices = ['electrical', 'false-ceiling', 'sofa-dining', 'full-house-painting']
      if (generalServices.includes(service.id)) {
        return true
      }
      
      // For additional add-ins, only show items matching the selected quality tier
      if (service.id.includes('-premium') || service.id.includes('-luxury')) {
        return service.id.includes(`-${qualityTier}`)
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
      'sofa-luxury': Sofa,
      'dining-table-premium': UtensilsCrossed,
      'dining-table-luxury': UtensilsCrossed,
      'carpets-premium': Home,
      'carpets-luxury': Home,
      'designer-lights-premium': Lightbulb,
      'designer-lights-luxury': Lightbulb
    }
    return icons[serviceId] || Settings
  }

  const ServiceCard = ({ service }: { service: ServiceItem }) => {
    const IconComponent = getServiceIcon(service.id)
    
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200 hover:border-yellow-400 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center flex-1 min-w-0">
            <div className="mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0">
              <IconComponent 
                size={24} 
                className="sm:w-8 sm:h-8 text-yellow-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-black leading-tight truncate">{service.name}</h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-tight truncate">{service.description}</p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer ml-2 flex-shrink-0">
            <input
              type="checkbox"
              checked={service.selected}
              onChange={() => toggleServiceItem(service.id)}
              className="w-5 h-5 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
            />
          </label>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          {service.basePrice > 0 && (
            <div className="text-xs sm:text-sm text-gray-700 truncate">
              <span className="font-bold">Base Price:</span> ₹{service.basePrice.toLocaleString()}
            </div>
          )}
          <div className="text-sm sm:text-base font-bold text-black bg-yellow-100 px-2 sm:px-3 py-1 rounded-lg">
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
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2 sm:mb-3">
            Optional Services
          </h2>
          <p className="text-sm sm:text-base text-gray-700">
            Select additional services to enhance your interior design
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full max-w-full overflow-x-hidden">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <div className="mb-4 sm:mb-6 bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-yellow-400">
            <h4 className="text-sm sm:text-base font-bold text-black mb-2 sm:mb-3">
              Selected Services Summary
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center bg-white rounded-lg p-2 sm:p-3 border-2 border-yellow-300 shadow-md">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base text-black">{service.name}</div>
                    <div className="text-xs sm:text-sm text-gray-700 truncate">{service.description}</div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className="font-bold text-sm sm:text-base text-black">
                      ₹{calculateServicePrice(service).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t-2 border-yellow-400 pt-2 sm:pt-3">
                <div className="flex justify-between items-center bg-black rounded-lg p-2 sm:p-3">
                  <div className="text-sm sm:text-base font-bold text-yellow-400">
                    Total Services Cost:
                  </div>
                  <div className="text-base sm:text-lg font-bold text-yellow-400">
                    ₹{totalServiceCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Details */}
        <div className="mb-4 sm:mb-6 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200">
          <h4 className="text-sm sm:text-base font-bold text-black mb-2 sm:mb-3">
            Service Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
            <div>
              <div className="font-bold">Carpet Area:</div>
              <div className="text-sm sm:text-base font-medium">{carpetArea} sq.ft</div>
            </div>
            <div>
              <div className="font-bold">Applicable Services:</div>
              <div>Electrical & Painting are per sq.ft</div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <button
            onClick={onPrev}
            className="px-4 sm:px-6 py-3 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="px-4 sm:px-6 py-3 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
          >
            Continue to Details →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServicesStep 