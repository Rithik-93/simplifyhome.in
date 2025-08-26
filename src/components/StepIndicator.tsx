import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Home', shortTitle: 'Home', description: 'Select your home type and area' },
    { id: 2, title: 'Furniture', shortTitle: 'Furniture', description: 'Choose furniture items' },
    { id: 3, title: 'Details', shortTitle: 'Details', description: 'Provide contact information' },
    { id: 4, title: 'Estimate', shortTitle: 'Estimate', description: 'Review your final estimate' },
  ]

  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 mb-4 sm:mb-6 overflow-x-hidden">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-2 sm:p-4 border-2 border-yellow-400 w-full max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between w-full max-w-full overflow-x-hidden">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center w-full min-w-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm md:text-base border-2 transition-all duration-300 flex-shrink-0 ${
                    currentStep >= step.id
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
                >
                  {currentStep > step.id ? <Check size={14} className="sm:w-4 sm:h-4" /> : step.id}
                </div>
                <div className="text-center mt-1 sm:mt-2 w-full min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold leading-tight truncate ${
                    currentStep >= step.id ? 'text-black' : 'text-gray-400'
                  }`}>
                    <span className="sm:hidden">{step.shortTitle}</span>
                    <span className="hidden sm:inline">{step.title}</span>
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 md:mx-3 transition-all duration-300 min-w-0 ${
                    currentStep > step.id ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepIndicator 