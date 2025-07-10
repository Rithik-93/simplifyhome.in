import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Home Type', description: 'Select your home type and area' },
    { id: 2, title: 'Furniture', description: 'Choose furniture items' },
    { id: 3, title: 'Services', description: 'Select optional services' },
    { id: 4, title: 'Your Details', description: 'Provide contact information' },
    { id: 5, title: 'Estimate', description: 'Review your final estimate' },
  ]

  return (
    <div className="w-full mx-auto px-4 mb-6">
      <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-yellow-400">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2 transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
                >
                  {currentStep > step.id ? <Check size={16} /> : step.id}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-xs font-bold ${
                    currentStep >= step.id ? 'text-black' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-3 transition-all duration-300 ${
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