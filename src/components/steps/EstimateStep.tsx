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
    <div className="w-full mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl border-2 border-yellow-400 overflow-hidden max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-black text-yellow-400 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">
              Your Interior Estimate
            </h2>
            <p className="text-yellow-200 text-base">
              Complete cost breakdown for your {appState.homeDetails.homeType} home
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="p-4 bg-yellow-50 border-b-2 border-yellow-400">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="font-bold text-black">Name</div>
              <div className="text-gray-800">{appState.userDetails.name}</div>
            </div>
            <div>
              <div className="font-bold text-black">Mobile</div>
              <div className="text-gray-800">{appState.userDetails.mobile}</div>
            </div>
            <div>
              <div className="font-bold text-black">Email</div>
              <div className="text-gray-800">{appState.userDetails.email}</div>
            </div>
            <div>
              <div className="font-bold text-black">City</div>
              <div className="text-gray-800">{appState.userDetails.city}</div>
            </div>
          </div>
        </div>

        {/* Home Details */}
        <div className="p-4 bg-gray-50 border-b-2 border-gray-200">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="font-bold text-black">Home Type</div>
              <div className="text-black text-lg font-bold">{appState.homeDetails.homeType}</div>
            </div>
            <div>
              <div className="font-bold text-black">Quality Tier</div>
              <div className="text-black text-lg font-bold">{appState.homeDetails.qualityTier}</div>
            </div>
            <div>
              <div className="font-bold text-black">Carpet Area</div>
              <div className="text-black text-lg font-bold">{appState.homeDetails.carpetArea} sq.ft</div>
            </div>
          </div>
        </div>

        {/* Estimate Details */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-black mb-4">
            Estimate Details
          </h3>
          
          <div className="space-y-4">
            {estimate.map((categoryEstimate, index) => (
              <div key={index} className="border-2 border-yellow-400 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-bold text-black">
                    {categoryEstimate.category}
                  </h4>
                  <div className="text-base font-bold text-black bg-yellow-100 px-3 py-1 rounded-lg">
                    ₹{categoryEstimate.totalPrice.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {categoryEstimate.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center text-sm border-b border-gray-200 pb-1">
                      <span className="text-gray-700 font-medium">{item.name}</span>
                      <span className="font-bold text-black">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Final Price */}
          <div className="mt-6 bg-black rounded-xl p-4 border-2 border-yellow-400">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-yellow-400">
                Final Price
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                ₹{finalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Material Details */}
        <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
          <h3 className="text-lg font-bold text-black mb-4">
            Material Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-black">Base Material:</span>
                  <span className="text-gray-800 ml-2">Moisture Resistance ISI Grade Plywood</span>
                </div>
                <div>
                  <span className="font-bold text-black">Furniture Internal:</span>
                  <span className="text-gray-800 ml-2">0.8mm White Laminate</span>
                </div>
                <div>
                  <span className="font-bold text-black">Furniture Outside:</span>
                  <span className="text-gray-800 ml-2">1mm Color Laminate (₹1,000 - ₹1,400 per sheet)</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-black">Hardware:</span>
                  <span className="text-gray-800 ml-2">Ebco and Moda Germany (Normal Close)</span>
                </div>
                <div>
                  <span className="font-bold text-black">Paint:</span>
                  <span className="text-gray-800 ml-2">Asian Royal Paint - Royal Shine</span>
                </div>
                <div>
                  <span className="font-bold text-black">Electrical:</span>
                  <span className="text-gray-800 ml-2">Polycab Wire with Labour</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t-2 border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={onPrev}
              className="px-6 py-3 text-base font-bold rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1"
            >
              ← Edit Details
            </button>
            {/* <button
              onClick={downloadEstimate}
              className="px-6 py-3 text-base font-bold rounded-xl bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              style={{ backgroundColor: '#FFBD01', color: '#000000' }}
            >
              <Download size={16} />
              Download Estimate
            </button> */}
            <button
              onClick={onRestart}
              className="px-6 py-3 text-base font-bold rounded-xl bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              style={{ backgroundColor: '#000000', color: '#FFBD01' }}
            >
              <RotateCcw size={16} />
              New Estimate
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-yellow-50 border-t-2 border-yellow-400">
          <div className="text-center">
            <h4 className="text-base font-bold text-black mb-3">
              Ready to Get Started?
            </h4>
            <p className="text-gray-700 mb-3 text-sm">
              Contact our design experts for a free consultation
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
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