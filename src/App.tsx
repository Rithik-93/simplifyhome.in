import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import type { AppState, FurnitureItem, ServiceItem, UserDetails } from './types'
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

// Transform CMSItem to FurnitureItem (map new CMS shape)
const transformToFurnitureItem = (cmsItem: any): FurnitureItem => ({
  id: cmsItem.id || cmsItem._id,
  name: cmsItem.name,
  category: cmsItem?.category?.name || 'General',
  type: cmsItem?.category?.type?.name || 'Miscellaneous', // Fixed: category.type.name
  selected: false,
  quantity: 1,
  basePrice: cmsItem.pricePerSqFt || 0,
  pricePerSqFt: cmsItem.pricePerSqFt || 0, // Add this line to map API pricePerSqFt
  userPrice: 0,
});

const transformToServiceItem = (item: FurnitureItem): ServiceItem => ({
  id: item.id,
  name: item.name,
  selected: item.selected,
  userPrice: item.userPrice,
  description: (item as any).description || '',
});

function MainApp() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 1,
    homeDetails: { homeType: '', qualityTier: '', carpetArea: 0 },
    items: [],
    userDetails: { name: '', mobile: '', email: '', city: '' },
    estimate: [],
    finalPrice: 0,
  });

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch items from API on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('Fetching items from API...')
        const response = await cmsApi.getItems({ limit: 1000 }); // Fetch all items
        
        console.log('API Response:', response)
        console.log('Items data:', response.data)
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format: data is not an array')
        }
        
        const allItems = response.data.map(transformToFurnitureItem);
        console.log('Transformed items:', allItems)

        setAppState(prev => ({
          ...prev,
          items: allItems,
        }));
      } catch (err) {
        console.error('Error fetching items:', err)
        setError(`Failed to load items: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
  const updateItems = useCallback((items: FurnitureItem[]) => {
    setAppState(prev => ({ ...prev, items }));
  }, []);

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
            items={appState.items}
            homeDetails={appState.homeDetails}
            onUpdateItems={updateItems}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <ServicesStep
            serviceItems={appState.items.filter(item => item.type === 'Service').map(transformToServiceItem)}
            homeDetails={appState.homeDetails}
            carpetArea={appState.homeDetails.carpetArea}
            onUpdate={(updatedItems) => {
              const newItems = appState.items.map(item => {
                const updated = updatedItems.find(u => u.id === item.id);
                if (updated) {
                  return { ...item, ...updated };
                }
                return item;
              });
              updateItems(newItems);
            }}
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
