"use client"

import { useState, useCallback, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import type { AppState, FurnitureItem, UserDetails, HomeDetails } from "./types"
import HomeTypeStep from "./components/steps/HomeTypeStep"
import FurnitureStep from "./components/steps/FurnitureStep"
import UserDetailsStep from "./components/steps/UserDetailsStep"
import EstimateStep from "./components/steps/EstimateStep"
import StepIndicator from "./components/StepIndicator"
import Header from "./components/Header"
import Disclaimer from "./components/Disclaimer"
import CMSApp from "./components/cms/CMSApp"
import { cmsApi } from "./services/cmsApi"
import LoadingSpinner from "./components/loader"

// Transform CMSItem to FurnitureItem (map new CMS shape)
const transformToFurnitureItem = (cmsItem: any, qualityTier = "premium"): FurnitureItem => {
  // Handle items that may not have categories (single line items and add ons)
  // For Woodwork items: type info is in category.type.name, for others it's in type.name
  const itemType = cmsItem.category?.type?.name || cmsItem.type?.name || "Miscellaneous"
  const itemCategory = cmsItem.category?.name || itemType // Use type name as category if no category

  // Check if this is an Add Ons item (has BHK-specific pricing)
  const isAddOnsItem = itemType === "Add Ons"

  let pricePerSqFt = 0
  let basePrice = 0

  if (isAddOnsItem) {
    // For Add Ons items, use BHK-specific pricing based on home type
    // This will be handled in the frontend based on home details
    pricePerSqFt = 0 // Add ons don't use per sq ft pricing
    basePrice = 0 // Will be calculated based on BHK and quality tier
  } else {
    // For regular items, use quality tier to determine which price to use
    pricePerSqFt =
      qualityTier === "luxury" && cmsItem.luxuryPricePerSqFt
        ? cmsItem.luxuryPricePerSqFt
        : cmsItem.premiumPricePerSqFt || 0
    basePrice = pricePerSqFt
  }

  return {
    id: cmsItem.id || cmsItem._id,
    name: cmsItem.name,
    category: itemCategory,
    type: itemType,
    selected: false,
    quantity: 1,
    basePrice: basePrice,
    pricePerSqFt: pricePerSqFt,
    userPrice: 0,
    // Add the new AddonPricing structure for Add Ons items
    addonPricing: cmsItem.addonPricing || [],
  }
}

function MainApp() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 1,
    homeDetails: { homeType: "", qualityTier: "", carpetArea: 0 },
    items: [],
    userDetails: { name: "", mobile: "", email: "", city: "" },
    estimate: [],
    finalPrice: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching items from API...")
        const response = await cmsApi.getItems({ limit: 1000 }) // Fetch all items

        console.log("API Response:", response)
        console.log("Items data:", response.data)

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response format: data is not an array")
        }

        const allItems = response.data.map((cmsItem) =>
          transformToFurnitureItem(cmsItem, appState.homeDetails.qualityTier),
        )
        console.log("Transformed items:", allItems)

        setAppState((prev) => ({
          ...prev,
          items: allItems,
        }))
      } catch (err) {
        console.error("Error fetching items:", err)
        setError(`Failed to load items: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])



  // Function to refresh items when quality tier changes
  const refreshItemsWithQualityTier = useCallback(async (qualityTier: string) => {
    try {
      const response = await cmsApi.getItems({ limit: 1000 })
      if (response.data && Array.isArray(response.data)) {
        const allItems = response.data.map((cmsItem) => transformToFurnitureItem(cmsItem, qualityTier))
        setAppState((prev) => ({ ...prev, items: allItems }))
      }
    } catch (err) {
      console.error("Error refreshing items with new quality tier:", err)
    }
  }, [])

  // Create stable update functions using useCallback
  const updateItems = useCallback((items: FurnitureItem[]) => {
    setAppState((prev) => ({ ...prev, items }))
  }, [])

  const updateUserDetails = useCallback((userDetails: UserDetails) => {
    setAppState((prev) => ({ ...prev, userDetails }))
  }, [])

  // Update home details and refresh items if quality tier changes
  const updateHomeDetails = useCallback(
    (homeDetails: HomeDetails) => {
      setAppState((prev) => {
        // If quality tier changed, refresh items
        if (prev.homeDetails.qualityTier !== homeDetails.qualityTier) {
          refreshItemsWithQualityTier(homeDetails.qualityTier)
        }
        return { ...prev, homeDetails }
      })
    },
    [refreshItemsWithQualityTier],
  )

  const nextStep = useCallback(() => {
    setAppState((prev) => (prev.currentStep < 4 ? { ...prev, currentStep: prev.currentStep + 1 } : prev))
  }, [])

  const prevStep = useCallback(() => {
    setAppState((prev) => (prev.currentStep > 1 ? { ...prev, currentStep: prev.currentStep - 1 } : prev))
  }, [])

  const restartApp = useCallback(() => {
    setAppState((prev) => ({ ...prev, currentStep: 1 }))
  }, [])

  const renderCurrentStep = () => {
    switch (appState.currentStep) {
      case 1:
        return <HomeTypeStep homeDetails={appState.homeDetails} onUpdate={updateHomeDetails} onNext={nextStep} />
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
          <UserDetailsStep
            userDetails={appState.userDetails}
            onUpdate={updateUserDetails}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return <EstimateStep appState={appState} onPrev={prevStep} onRestart={restartApp} />
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
            <LoadingSpinner />
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
