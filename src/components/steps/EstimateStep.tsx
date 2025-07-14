import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { AppState, EstimateItem } from '../../types'

interface EstimateStepProps {
  appState: AppState
  onPrev: () => void
  onRestart: () => void
}

const EstimateStep: React.FC<EstimateStepProps> = ({ 
  appState, 
  onPrev, 
  onRestart 
}) => {
  const [estimate, setEstimate] = useState<EstimateItem[]>([])
  const [finalPrice, setFinalPrice] = useState(0)

  useEffect(() => {
    calculateEstimate()
  }, [appState])

  const calculateEstimate = () => {
    const newEstimate: EstimateItem[] = []
    let totalPrice = 0

    // Group furniture items by category
    const furnitureByCategory = appState.furnitureItems
      .filter(item => item.selected)
      .reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        // Use the totalPrice that was calculated in FurnitureStep
        const price = item.totalPrice || 0
        acc[item.category].push({ name: item.name, price })
        return acc
      }, {} as { [key: string]: { name: string; price: number }[] })

    // Add furniture categories to estimate
    Object.entries(furnitureByCategory).forEach(([category, items]) => {
      const categoryTotal = items.reduce((sum, item) => sum + item.price, 0)
      newEstimate.push({
        category,
        items,
        totalPrice: categoryTotal
      })
      totalPrice += categoryTotal
    })

    // Add services to estimate
    const selectedServices = appState.serviceItems.filter(service => service.selected)
    if (selectedServices.length > 0) {
      const serviceItems = selectedServices.map(service => {
        const price = service.pricePerSqFt > 0 
          ? service.basePrice + (service.pricePerSqFt * appState.homeDetails.carpetArea)
          : service.basePrice
        return { name: service.name, price }
      })
      const servicesTotal = serviceItems.reduce((sum, item) => sum + item.price, 0)
      newEstimate.push({
        category: 'Services',
        items: serviceItems,
        totalPrice: servicesTotal
      })
      totalPrice += servicesTotal
    }

    setEstimate(newEstimate)
    setFinalPrice(totalPrice)
  }

  // const downloadEstimate = () => {
  //   const estimateData = {
  //     userDetails: appState.userDetails,
  //     homeDetails: appState.homeDetails,
  //     estimate,
  //     finalPrice,
  //     timestamp: new Date().toISOString()
  //   }
    
  //   const dataStr = JSON.stringify(estimateData, null, 2)
  //   const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
  //   const exportFileDefaultName = `SimplifyHomes_Estimate_${appState.userDetails.name.replace(/\s+/g, '_')}.json`
    
  //   const linkElement = document.createElement('a')
  //   linkElement.setAttribute('href', dataUri)
  //   linkElement.setAttribute('download', exportFileDefaultName)
  //   linkElement.click()
  // }

  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 overflow-x-hidden">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl border-2 border-yellow-400 overflow-hidden max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="bg-black text-yellow-400 p-3 sm:p-6 w-full max-w-full overflow-x-hidden">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
              Your Interior Estimate
            </h2>
            <p className="text-yellow-200 text-sm sm:text-base">
              Complete cost breakdown for your {appState.homeDetails.homeType} home
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="p-3 sm:p-4 bg-yellow-50 border-b-2 border-yellow-400 w-full max-w-full overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm w-full max-w-full overflow-x-hidden">
            <div className="min-w-0">
              <div className="font-bold text-black">Name</div>
              <div className="text-gray-800 truncate">{appState.userDetails.name}</div>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-black">Mobile</div>
              <div className="text-gray-800 truncate">{appState.userDetails.mobile}</div>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-black">Email</div>
              <div className="text-gray-800 truncate">{appState.userDetails.email}</div>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-black">City</div>
              <div className="text-gray-800 truncate">{appState.userDetails.city}</div>
            </div>
          </div>
        </div>

        {/* Home Details */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b-2 border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div>
              <div className="font-bold text-black">Home Type</div>
              <div className="text-black text-base sm:text-lg font-bold">{appState.homeDetails.homeType}</div>
            </div>
            <div>
              <div className="font-bold text-black">Quality Tier</div>
              <div className="text-black text-base sm:text-lg font-bold">{appState.homeDetails.qualityTier}</div>
            </div>
            <div>
              <div className="font-bold text-black">Carpet Area</div>
              <div className="text-black text-base sm:text-lg font-bold">{appState.homeDetails.carpetArea} sq.ft</div>
            </div>
          </div>
        </div>

        {/* Estimate Details */}
        <div className="p-3 sm:p-4 w-full max-w-full overflow-x-hidden">
          <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">
            Estimate Details
          </h3>
          
          <div className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
            {estimate.map((categoryEstimate, index) => (
              <div key={index} className="border-2 border-yellow-400 rounded-lg sm:rounded-xl p-3 sm:p-4 w-full max-w-full min-w-0 overflow-hidden">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h4 className="text-sm sm:text-base font-bold text-black flex-1 truncate pr-2">
                    {categoryEstimate.category}
                  </h4>
                  <div className="text-sm sm:text-base font-bold text-black bg-yellow-100 px-2 sm:px-3 py-1 rounded-lg flex-shrink-0">
                    ₹{categoryEstimate.totalPrice.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1 sm:space-y-2 w-full max-w-full overflow-x-hidden">
                  {categoryEstimate.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-200 pb-1 w-full max-w-full">
                      <span className="text-gray-700 font-medium flex-1 truncate pr-2">{item.name}</span>
                      <span className="font-bold text-black flex-shrink-0">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Final Price */}
          <div className="mt-4 sm:mt-6 bg-black rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-yellow-400">
            <div className="flex justify-between items-center">
              <div className="text-base sm:text-xl font-bold text-yellow-400">
                Final Price
              </div>
              <div className="text-lg sm:text-2xl font-bold text-yellow-400">
                ₹{finalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Material Details */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t-2 border-gray-200">
          <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">
            Material Details
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-black">Base Material:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Moisture Resistance ISI Grade Plywood</span>
                </div>
                <div>
                  <span className="font-bold text-black">Furniture Internal:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">0.8mm White Laminate</span>
                </div>
                <div>
                  <span className="font-bold text-black">Furniture Outside:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">1mm Color Laminate (₹1,000 - ₹1,400 per sheet)</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-black">Hardware:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Ebco and Moda Germany (Normal Close)</span>
                </div>
                <div>
                  <span className="font-bold text-black">Paint:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Asian Royal Paint - Royal Shine</span>
                </div>
                <div>
                  <span className="font-bold text-black">Electrical:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Polycab Wire with Labour</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 bg-white border-t-2 border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onPrev}
              className="px-4 sm:px-6 py-3 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
            >
              ← Edit Details
            </button>
            <button
              onClick={onRestart}
              className="px-4 sm:px-6 py-3 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 min-h-[44px]"
              style={{ backgroundColor: '#000000', color: '#FFBD01' }}
            >
              <RotateCcw size={16} />
              New Estimate
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-3 sm:p-4 bg-yellow-50 border-t-2 border-yellow-400">
          <div className="text-center">
            <h4 className="text-sm sm:text-base font-bold text-black mb-2 sm:mb-3">
              Ready to Get Started?
            </h4>
            <p className="text-gray-700 mb-2 sm:mb-3 text-xs sm:text-sm">
              Contact our design experts for a free consultation
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
              <div className="text-black">
                <span className="font-bold">Website:</span> simplifyhomes.in
              </div>
              <div className="text-black">
                <span className="font-bold">Email:</span> info@simplifyhomes.in
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstimateStep 