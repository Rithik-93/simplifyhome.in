import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { AppState, EstimateItem } from '../../types'
import { getRoomDimensions } from '../../types'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
  const pdfRef = useRef<HTMLDivElement>(null)
  const pdfHiddenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    calculateEstimate()
  }, [appState])

  const calculateEstimate = () => {
    const newEstimate: EstimateItem[] = []
    let totalPrice = 0

    // Add single line items to estimate
    const selectedSingleLineItems = appState.singleLineItems.filter(item => item.selected)
    if (selectedSingleLineItems.length > 0) {
      const singleLineItemsFormatted = selectedSingleLineItems.map(item => {
        const price = item.userPrice * appState.homeDetails.carpetArea
        return { name: item.name, price }
      })
      const singleLineTotal = singleLineItemsFormatted.reduce((sum, item) => sum + item.price, 0)
      newEstimate.push({
        category: 'Single Line Items',
        items: singleLineItemsFormatted,
        totalPrice: singleLineTotal
      })
      totalPrice += singleLineTotal
    }

    // Group furniture items by category using userPrice * roomArea * quantity
    const furnitureByCategory = appState.furnitureItems
      .filter(item => item.selected)
      .reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        
        // Calculate room area (using default room size since user's selection isn't stored in AppState)
        // TODO: Store user's room size selections in AppState for accurate estimates
        const roomDimensions = getRoomDimensions(item.category)
        const defaultDimension = roomDimensions[0]
        const roomArea = (defaultDimension?.length ?? 10) * (defaultDimension?.width ?? 10)
        
        const price = item.userPrice * roomArea * item.quantity
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

    // Helper function to calculate service price
    const calculateServicePrice = (service: any) => service.userPrice

    // Add services to estimate
    const selectedServices = appState.serviceItems.filter(service => service.selected)
    if (selectedServices.length > 0) {
      const serviceItems = selectedServices.map(service => {
        const price = calculateServicePrice(service)
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

  const downloadPDF = async () => {
    const target = pdfHiddenRef.current || pdfRef.current
    if (!target) return

    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const margin = 8
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = margin

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      pdf.addPage()
      position = heightLeft - imgHeight + margin
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const safeName = (appState.userDetails.name || 'Estimate').replace(/[^a-z0-9_-]+/gi, '_')
    const dateStr = new Date().toISOString().slice(0, 10)
    pdf.save(`Interior_Estimate_${safeName}_${dateStr}.pdf`)
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
    
  //   const exportFileDefaultName = `Interior_Estimate_${appState.userDetails.name.replace(/\s+/g, '_')}.json`
    
  //   const linkElement = document.createElement('a')
  //   linkElement.setAttribute('href', dataUri)
  //   linkElement.setAttribute('download', exportFileDefaultName)
  //   linkElement.click()
  // }

  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 overflow-x-hidden">
      <div ref={pdfRef} className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl border-2 border-yellow-400 overflow-hidden max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="bg-black text-yellow-400 p-3 sm:p-6 w-full max-w-full overflow-x-hidden">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">
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
              <div className="font-semibold text-black">Name</div>
              <div className="text-gray-800 truncate">{appState.userDetails.name}</div>
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-black">Mobile</div>
              <div className="text-gray-800 truncate">{appState.userDetails.mobile}</div>
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-black">Email</div>
              <div className="text-gray-800 truncate">{appState.userDetails.email}</div>
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-black">City</div>
              <div className="text-gray-800 truncate">{appState.userDetails.city}</div>
            </div>
          </div>
        </div>

        {/* Home Details */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b-2 border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div>
              <div className="font-semibold text-black">Home Type</div>
              <div className="text-black text-base sm:text-lg font-semibold">{appState.homeDetails.homeType}</div>
            </div>
            <div>
              <div className="font-semibold text-black">Quality Tier</div>
              <div className="text-black text-base sm:text-lg font-semibold">{appState.homeDetails.qualityTier}</div>
            </div>
            <div>
              <div className="font-semibold text-black">Carpet Area</div>
              <div className="text-black text-base sm:text-lg font-semibold">{appState.homeDetails.carpetArea} sq.ft</div>
            </div>
          </div>
        </div>

        {/* Estimate Details */}
        <div className="p-3 sm:p-4 w-full max-w-full overflow-x-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">
            Estimate Details
          </h3>
          
          <div className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
            {estimate.map((categoryEstimate, index) => (
              <div key={index} className="border-2 border-yellow-400 rounded-lg sm:rounded-xl p-3 sm:p-4 w-full max-w-full min-w-0 overflow-hidden">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h4 className="text-sm sm:text-base font-semibold text-black flex-1 truncate pr-2">
                    {categoryEstimate.category}
                  </h4>
                  <div className="text-sm sm:text-base font-semibold text-black bg-yellow-100 px-2 sm:px-3 py-1 rounded-lg flex-shrink-0">
                    ₹{categoryEstimate.totalPrice.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1 sm:space-y-2 w-full max-w-full overflow-x-hidden">
                  {categoryEstimate.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-200 pb-1 w-full max-w-full">
                      <span className="text-gray-700 font-medium flex-1 truncate pr-2">{item.name}</span>
                      <span className="font-semibold text-black flex-shrink-0">
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
              <div className="text-base sm:text-xl font-semibold text-yellow-400">
                Final Price
              </div>
              <div className="text-lg sm:text-2xl font-semibold text-yellow-400">
                ₹{finalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Material Details */}
        {/* <div className="p-3 sm:p-4 bg-gray-50 border-t-2 border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">
            Material Details
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-black">Base Material:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Moisture Resistance ISI Grade Plywood</span>
                </div>
                <div>
                  <span className="font-semibold text-black">Furniture Internal:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">0.8mm White Laminate</span>
                </div>
                <div>
                  <span className="font-semibold text-black">Furniture Outside:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">1mm Color Laminate (₹1,000 - ₹1,400 per sheet)</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-black">Hardware:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Ebco and Moda Germany (Normal Close)</span>
                </div>
                <div>
                  <span className="font-semibold text-black">Paint:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Asian Royal Paint - Royal Shine</span>
                </div>
                <div>
                  <span className="font-semibold text-black">Electrical:</span>
                  <span className="text-gray-800 ml-2 block sm:inline">Polycab Wire with Labour</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 bg-white border-t-2 border-gray-200" data-html2canvas-ignore="true">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onPrev}
              className="order-2 sm:order-1 px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
            >
              ← Edit Details
            </button>
            <button
              onClick={downloadPDF}
              className="order-3 px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
              aria-label="Download estimate as PDF"
            >
              Download PDF
            </button>
            <button
              onClick={onRestart}
              className="order-1 sm:order-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 min-h-[44px]"
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
            <h4 className="text-sm sm:text-base font-semibold text-black mb-2 sm:mb-3">
              Ready to Get Started?
            </h4>
            <p className="text-gray-700 mb-2 sm:mb-3 text-xs sm:text-sm">
              Use this estimate to plan your interior design project
            </p>
          </div>
        </div>
      </div>

      {/* Hidden PDF-friendly content (inline styles only; no Tailwind to avoid oklch) */}
      <div
        ref={pdfHiddenRef}
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: '800px',
          background: '#ffffff',
          color: '#000000',
          padding: '24px',
          fontFamily: 'Inter, Arial, sans-serif'
        }}
      >
        <div
          style={{
            background: '#000000',
            color: '#FFBD01',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Your Interior Estimate</div>
          <div style={{ fontSize: '12px', color: '#FFE08A' }}>
            Complete cost breakdown for your {appState.homeDetails.homeType} home
          </div>
        </div>

        {/* User Details */}
        <div style={{ background: '#FFF9DB', border: '2px solid #FFBD01', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div>
              <div style={{ fontWeight: 700 }}>Name</div>
              <div>{appState.userDetails.name}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Mobile</div>
              <div>{appState.userDetails.mobile}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Email</div>
              <div>{appState.userDetails.email}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>City</div>
              <div>{appState.userDetails.city}</div>
            </div>
          </div>
        </div>

        {/* Home Details */}
        <div style={{ background: '#F7F7F7', border: '2px solid #E5E5E5', borderRadius: '8px', padding: '12px', marginBottom: '12px', fontSize: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 700 }}>Home Type</div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{appState.homeDetails.homeType}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Quality Tier</div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{appState.homeDetails.qualityTier}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Carpet Area</div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{appState.homeDetails.carpetArea} sq.ft</div>
            </div>
          </div>
        </div>

        {/* Estimate Details */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Estimate Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {estimate.map((categoryEstimate, index) => (
              <div key={index} style={{ border: '2px solid #FFBD01', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700 }}>{categoryEstimate.category}</div>
                  <div style={{ fontWeight: 700, background: '#FFF3B0', padding: '4px 8px', borderRadius: '6px' }}>
                    ₹{categoryEstimate.totalPrice.toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {categoryEstimate.items.map((item, itemIndex) => (
                    <div key={itemIndex} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5', paddingBottom: '4px' }}>
                      <span style={{ color: '#333333' }}>{item.name}</span>
                      <span style={{ fontWeight: 700 }}>₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Price */}
        <div style={{ background: '#000000', color: '#FFBD01', border: '2px solid #FFBD01', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>Final Price</div>
            <div style={{ fontWeight: 800, fontSize: '22px' }}>₹{finalPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstimateStep 