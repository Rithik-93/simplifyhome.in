import { useState } from 'react'
import { Home, Building, Building2, Castle } from 'lucide-react'
import type { HomeDetails } from '../../types'

interface HomeTypeStepProps {
  homeDetails: HomeDetails
  onUpdate: (homeDetails: HomeDetails) => void
  onNext: () => void
}

const HomeTypeStep: React.FC<HomeTypeStepProps> = ({ homeDetails, onUpdate, onNext }) => {
  const [carpetAreaInput, setCarpetAreaInput] = useState(homeDetails.carpetArea.toString())

  const homeTypes = [
    { value: '1BHK', label: '1 BHK', icon: Home },
    { value: '2BHK', label: '2 BHK', icon: Building },
    { value: '3BHK', label: '3 BHK', icon: Building2 },
    { value: '4BHK', label: '4 BHK', icon: Castle },
  ] as const

  const handleHomeTypeSelect = (homeType: HomeDetails['homeType']) => {
    onUpdate({ ...homeDetails, homeType })
  }

  const handleCarpetAreaChange = (value: string) => {
    setCarpetAreaInput(value)
    const numValue = parseFloat(value) || 0
    onUpdate({ ...homeDetails, carpetArea: numValue })
  }

  const handleNext = () => {
    if (homeDetails.homeType && homeDetails.carpetArea > 0) {
      onNext()
    }
  }

  const isValid = homeDetails.homeType && homeDetails.carpetArea > 0

  return (
    <div className="w-full mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-yellow-400 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black mb-4">
            Select Your Home Type
          </h2>
          <p className="text-gray-700 text-lg">
            Choose your home configuration and provide the carpet area
          </p>
        </div>

        {/* Home Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-6">
            Home Configuration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {homeTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <button
                  key={type.value}
                  onClick={() => handleHomeTypeSelect(type.value)}
                  className={`p-6 rounded-xl border-3 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    homeDetails.homeType === type.value
                      ? 'border-yellow-400 bg-yellow-50 text-black shadow-lg'
                      : 'border-gray-300 hover:border-yellow-300 bg-white'
                  }`}
                >
                  <div className="mb-3 flex justify-center">
                    <IconComponent 
                      size={48} 
                      className={`${
                        homeDetails.homeType === type.value 
                          ? 'text-yellow-600' 
                          : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="font-bold text-lg">{type.label}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Carpet Area Input */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-6">
            Carpet Area <span className="text-red-500">*</span>
          </h3>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="number"
                value={carpetAreaInput}
                onChange={(e) => handleCarpetAreaChange(e.target.value)}
                placeholder="Enter carpet area"
                className={`w-full px-6 py-4 border-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 pr-20 text-lg font-medium transition-all duration-200 ${
                  carpetAreaInput ? 'border-yellow-400 focus:border-yellow-400' : 'border-gray-300 focus:border-yellow-400'
                }`}
              />
              <div className="absolute right-4 top-4 text-gray-600 font-bold text-lg">
                Sq. ft
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              Enter the total carpet area of your home in square feet
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className={`px-12 py-4 text-xl font-bold rounded-xl transition-all duration-300 transform ${
              isValid
                ? 'bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Furniture Selection →
          </button>
        </div>

        {!isValid && (
          <p className="text-center text-red-500 text-lg mt-4 font-medium">
            Please select a home type and enter the carpet area to continue
          </p>
        )}
      </div>
    </div>
  )
}

export default HomeTypeStep 