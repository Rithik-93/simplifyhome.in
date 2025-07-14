import { useState } from 'react'
import type { AppState, FurnitureItem, SingleLineItem, ServiceItem, UserDetails } from './types'
import { DEFAULT_FURNITURE_ITEMS, DEFAULT_SINGLE_LINE_ITEMS, DEFAULT_SERVICE_ITEMS } from './types'
import HomeTypeStep from './components/steps/HomeTypeStep'
import FurnitureStep from './components/steps/FurnitureStep'
import ServicesStep from './components/steps/ServicesStep'
import UserDetailsStep from './components/steps/UserDetailsStep'
import EstimateStep from './components/steps/EstimateStep'
import StepIndicator from './components/StepIndicator'
import Header from './components/Header'

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 1,
    homeDetails: { homeType: '', qualityTier: '', carpetArea: 0 },
    furnitureItems: DEFAULT_FURNITURE_ITEMS,
    singleLineItems: DEFAULT_SINGLE_LINE_ITEMS,
    serviceItems: DEFAULT_SERVICE_ITEMS,
    userDetails: { name: '', mobile: '', email: '', city: '' },
    estimate: [],
    finalPrice: 0
  })

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (appState.currentStep < 5) {
      setAppState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))
    }
  }

  const prevStep = () => {
    if (appState.currentStep > 1) {
      setAppState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }))
    }
  }

  const renderCurrentStep = () => {
    switch (appState.currentStep) {
      case 1:
        return (
          <HomeTypeStep
            homeDetails={appState.homeDetails}
            onUpdate={(homeDetails) => updateAppState({ homeDetails })}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <FurnitureStep
            furnitureItems={appState.furnitureItems}
            singleLineItems={appState.singleLineItems}
            homeDetails={appState.homeDetails}
            onUpdateFurniture={(furnitureItems: FurnitureItem[]) => updateAppState({ furnitureItems })}
            onUpdateSingleLine={(singleLineItems: SingleLineItem[]) => updateAppState({ singleLineItems })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <ServicesStep
            serviceItems={appState.serviceItems}
            homeDetails={appState.homeDetails}
            carpetArea={appState.homeDetails.carpetArea}
            onUpdate={(serviceItems: ServiceItem[]) => updateAppState({ serviceItems })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <UserDetailsStep
            userDetails={appState.userDetails}
            onUpdate={(userDetails: UserDetails) => updateAppState({ userDetails })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 5:
        return (
          <EstimateStep
            appState={appState}
            onPrev={prevStep}
            onRestart={() => setAppState(prev => ({ ...prev, currentStep: 1 }))}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 overflow-x-hidden">
      <Header />
      <div className="w-full max-w-full mx-auto px-2 sm:px-4 py-2 sm:py-4 overflow-x-hidden">
        <StepIndicator currentStep={appState.currentStep} />
        <div className="mt-2 sm:mt-4 w-full max-w-full overflow-x-hidden">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  )
}

export default App
