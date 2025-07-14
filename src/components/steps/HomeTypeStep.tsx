import { useState } from 'react'
import { Building, Building2, Crown, Gem, Home } from 'lucide-react'
import type { HomeDetails } from '../../types'

interface HomeTypeStepProps {
  homeDetails: HomeDetails
  onUpdate: (homeDetails: HomeDetails) => void
  onNext: () => void
}

const HomeTypeStep: React.FC<HomeTypeStepProps> = ({ homeDetails, onUpdate, onNext }) => {
  const [carpetAreaInput, setCarpetAreaInput] = useState(homeDetails.carpetArea.toString())

  const qualityTiers = [
    { value: 'Premium', label: 'Premium', icon: Crown, description: 'High-quality materials and finishes' },
    { value: 'Luxury', label: 'Luxury', icon: Gem, description: 'Ultra-premium materials' },
  ] as const

  const homeTypes = [
    { value: '2BHK', label: '2 BHK', icon: Building },
    { value: '3BHK', label: '3 BHK', icon: Building2 },
  ] as const

  const handleQualityTierSelect = (qualityTier: HomeDetails['qualityTier']) => {
    onUpdate({ ...homeDetails, qualityTier })
  }

  const handleHomeTypeSelect = (homeType: HomeDetails['homeType']) => {
    onUpdate({ ...homeDetails, homeType })
  }

  const handleCarpetAreaChange = (value: string) => {
    setCarpetAreaInput(value)
    const numValue = parseInt(value) || 0
    onUpdate({ ...homeDetails, carpetArea: numValue })
  }

  const handleNext = () => {
    if (homeDetails.homeType && homeDetails.qualityTier && homeDetails.carpetArea > 0) {
      onNext()
    }
  }

  const isValid = homeDetails.homeType && homeDetails.qualityTier && homeDetails.carpetArea > 0

    return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 overflow-x-hidden">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-3 sm:p-5 border-2 border-yellow-400 max-w-2xl mx-auto w-full overflow-x-hidden">
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-black mb-1 sm:mb-2">
            Select Your Home Type
          </h2>
          <p className="text-gray-700 text-sm">
            Choose quality tier, configuration, and area
          </p>
        </div>

        {/* Quality Tier Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-black mb-2 sm:mb-3 flex items-center">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
              Quality Tier <span className="text-red-500 ml-1">*</span>
            </h3>
            <div className="space-y-2 sm:space-y-4">
              {qualityTiers.map((tier) => {
                const IconComponent = tier.icon
                return (
                  <div key={tier.value} className="px-1 sm:px-2 py-1">
                    <button
                      onClick={() => handleQualityTierSelect(tier.value)}
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 sm:space-x-3 ${
                        homeDetails.qualityTier === tier.value
                          ? 'border-yellow-400 bg-yellow-50 text-black shadow-md transform scale-105'
                          : 'border-gray-300 hover:border-yellow-300 bg-white hover:shadow-sm'
                      }`}
                    >
                      <IconComponent 
                        size={20} 
                        className={`sm:w-6 sm:h-6 ${
                          homeDetails.qualityTier === tier.value 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                        }`}
                      />
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm sm:text-base">{tier.label}</div>
                        <div className="text-xs sm:text-sm text-gray-600 leading-tight">{tier.description}</div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-black mb-2 sm:mb-3 flex items-center">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
              Configuration <span className="text-red-500 ml-1">*</span>
            </h3>
            <div className="space-y-2 sm:space-y-4">
              {homeTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <div key={type.value} className="px-1 sm:px-2 py-1">
                    <button
                      onClick={() => handleHomeTypeSelect(type.value)}
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 sm:space-x-3 ${
                        homeDetails.homeType === type.value
                          ? 'border-yellow-400 bg-yellow-50 text-black shadow-md transform scale-105'
                          : 'border-gray-300 hover:border-yellow-300 bg-white hover:shadow-sm'
                      }`}
                    >
                      <IconComponent 
                        size={20} 
                        className={`sm:w-6 sm:h-6 ${
                          homeDetails.homeType === type.value 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                        }`}
                      />
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm sm:text-base">{type.label}</div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Carpet Area Section - Only show if home type is selected */}
        {homeDetails.homeType && (
          <div className="mb-4 sm:mb-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <h3 className="text-sm sm:text-base font-semibold text-black mb-2 sm:mb-3 flex items-center">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
                Carpet Area <span className="text-red-500 ml-1">*</span>
              </h3>
              <div className="px-1 sm:px-2 py-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Enter carpet area"
                    value={carpetAreaInput}
                    onChange={(e) => handleCarpetAreaChange(e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors text-sm sm:text-base"
                    min="100"
                    max="10000"
                  />
                  <span className="text-sm sm:text-base text-gray-600 font-medium">sq. ft</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Enter the carpet area of your {homeDetails.homeType} home
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform min-h-[44px] ${
              isValid
                ? 'bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Furniture Selection →
          </button>
        </div>

        {!isValid && (
          <p className="text-center text-red-500 text-xs mt-2 font-medium">
            Please select quality tier, home type, and enter carpet area
          </p>
        )}
      </div>
    </div>
  )
}

export default HomeTypeStep 