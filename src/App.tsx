import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import type { AppState, FurnitureItem, SingleLineItem, ServiceItem, UserDetails } from './types'
// Remove hardcoded imports since we'll fetch from API
// import { DEFAULT_FURNITURE_ITEMS, DEFAULT_SINGLE_LINE_ITEMS, DEFAULT_SERVICE_ITEMS } from './types'
import HomeTypeStep from './components/steps/HomeTypeStep'
import FurnitureStep from './components/steps/FurnitureStep'
import ServicesStep from './components/steps/ServicesStep'
import UserDetailsStep from './components/steps/UserDetailsStep'
import EstimateStep from './components/steps/EstimateStep'
import StepIndicator from './components/StepIndicator'
import Header from './components/Header'
import Disclaimer from './components/Disclaimer'
import CMSApp from './components/cms/CMSApp'
import { cmsApi } from './services/cmsApi'

// Transform CMSItem to FurnitureItem
const transformToFurnitureItem = (cmsItem: any): FurnitureItem => ({
  id: cmsItem.id || cmsItem._id,
  name: cmsItem.name,
  category: cmsItem.category,
  selected: false,
  quantity: 1,
  userPrice: 0 // User will enter price manually
})

// Transform CMSItem to SingleLineItem  
const transformToSingleLineItem = (cmsItem: any): SingleLineItem => ({
  id: cmsItem.id || cmsItem._id,
  name: cmsItem.name,
  selected: false,
  userPrice: 0 // User will enter price manually
})

// Transform CMSItem to ServiceItem
const transformToServiceItem = (cmsItem: any): ServiceItem => ({
  id: cmsItem.id || cmsItem._id,
  name: cmsItem.name,
  selected: false,
  userPrice: 0, // User will enter price manually
  description: cmsItem.description || ''
})

function MainApp() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 1,
    homeDetails: { homeType: '', qualityTier: '', carpetArea: 0 },
    furnitureItems: [],
    singleLineItems: [],
    serviceItems: [],
    userDetails: { name: '', mobile: '', email: '', city: '' },
    estimate: [],
    finalPrice: 0
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch items from API on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [furnitureData, singleLineData, serviceData] = await Promise.all([
          cmsApi.getActiveFurnitureItems(),
          cmsApi.getActiveSingleLineItems(),
          cmsApi.getActiveServiceItems()
        ])

        // Transform API data to frontend format
        const furnitureItems = furnitureData.map(transformToFurnitureItem)
        const singleLineItems = singleLineData.map(transformToSingleLineItem)
        const serviceItems = serviceData.map(transformToServiceItem)

        setAppState(prev => ({
          ...prev,
          furnitureItems,
          singleLineItems,
          serviceItems
        }))
      } catch (err) {
        console.error('Error fetching items:', err)
        setError('Failed to load items. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  const updateAppState = useCallback((updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }, [])

  // Create stable update functions using useCallback
  const updateFurnitureItems = useCallback((furnitureItems: FurnitureItem[]) => {
    setAppState(prev => ({ ...prev, furnitureItems }))
  }, [])

  const updateSingleLineItems = useCallback((singleLineItems: SingleLineItem[]) => {
    setAppState(prev => ({ ...prev, singleLineItems }))
  }, [])

  const updateServiceItems = useCallback((serviceItems: ServiceItem[]) => {
    setAppState(prev => ({ ...prev, serviceItems }))
  }, [])

  const updateUserDetails = useCallback((userDetails: UserDetails) => {
    setAppState(prev => ({ ...prev, userDetails }))
  }, [])

  const nextStep = useCallback(() => {
    setAppState(prev => prev.currentStep < 5 ? { ...prev, currentStep: prev.currentStep + 1 } : prev)
  }, [])

  const prevStep = useCallback(() => {
    setAppState(prev => prev.currentStep > 1 ? { ...prev, currentStep: prev.currentStep - 1 } : prev)
  }, [])

  const restartApp = useCallback(() => {
    setAppState(prev => ({ ...prev, currentStep: 1 }))
  }, [])

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
            onUpdateFurniture={updateFurnitureItems}
            onUpdateSingleLine={updateSingleLineItems}
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
            onUpdate={updateServiceItems}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <UserDetailsStep
            userDetails={appState.userDetails}
            onUpdate={updateUserDetails}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 5:
        return (
          <EstimateStep
            appState={appState}
            onPrev={prevStep}
            onRestart={restartApp}
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
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Loading items...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            renderCurrentStep()
          )}
        </div>
        <Disclaimer />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/cms" element={<CMSApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
