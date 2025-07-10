import { Zap, Home, Sofa, Paintbrush2, Settings } from 'lucide-react'
import type { ServiceItem } from '../../types'

interface ServicesStepProps {
  serviceItems: ServiceItem[]
  carpetArea: number
  onUpdate: (serviceItems: ServiceItem[]) => void
  onNext: () => void
  onPrev: () => void
}

const ServicesStep: React.FC<ServicesStepProps> = ({ 
  serviceItems, 
  carpetArea, 
  onUpdate, 
  onNext, 
  onPrev 
}) => {
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
      'full-house-painting': Paintbrush2
    }
    return icons[serviceId] || Settings
  }

  const ServiceCard = ({ service }: { service: ServiceItem }) => {
    const IconComponent = getServiceIcon(service.id)
    
    return (
      <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-yellow-400 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="mr-3 flex items-center justify-center">
              <IconComponent 
                size={32} 
                className="text-yellow-600"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">{service.name}</h3>
              <p className="text-sm text-gray-700 mt-1">{service.description}</p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={service.selected}
              onChange={() => toggleServiceItem(service.id)}
              className="w-5 h-5 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
            />
          </label>
        </div>
        
        <div className="space-y-2">
          {service.basePrice > 0 && (
            <div className="text-sm text-gray-700">
              <span className="font-bold">Base Price:</span> ₹{service.basePrice.toLocaleString()}
            </div>
          )}
          <div className="text-base font-bold text-black bg-yellow-100 px-3 py-1 rounded-lg">
            Total: ₹{calculateServicePrice(service).toLocaleString()}
          </div>
        </div>
      </div>
    )
  }

  const selectedServices = serviceItems.filter(service => service.selected)
  const totalServiceCost = selectedServices.reduce((total, service) => total + calculateServicePrice(service), 0)

  return (
    <div className="w-full mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-yellow-400 max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black mb-3">
            Optional Services
          </h2>
          <p className="text-gray-700 text-base">
            Select additional services to enhance your interior design
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {serviceItems.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <div className="mb-6 bg-yellow-50 rounded-xl p-4 border-2 border-yellow-400">
            <h4 className="text-base font-bold text-black mb-3">
              Selected Services Summary
            </h4>
            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center bg-white rounded-lg p-3 border-2 border-yellow-300 shadow-md">
                  <div>
                    <div className="font-bold text-base text-black">{service.name}</div>
                    <div className="text-sm text-gray-700">{service.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base text-black">
                      ₹{calculateServicePrice(service).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t-2 border-yellow-400 pt-3">
                <div className="flex justify-between items-center bg-black rounded-lg p-3">
                  <div className="text-base font-bold text-yellow-400">
                    Total Services Cost:
                  </div>
                  <div className="text-lg font-bold text-yellow-400">
                    ₹{totalServiceCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Details */}
        <div className="mb-6 bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <h4 className="text-base font-bold text-black mb-3">
            Service Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div>
              <div className="font-bold">Carpet Area:</div>
              <div className="text-base font-medium">{carpetArea} sq.ft</div>
            </div>
            <div>
              <div className="font-bold">Applicable Services:</div>
              <div>Electrical & Painting are per sq.ft</div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onPrev}
            className="px-6 py-3 text-base font-bold rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 text-base font-bold rounded-xl bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue to Details →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServicesStep 