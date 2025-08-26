import { useState, useEffect } from "react"

const LoadingSpinner = () => {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
      {/* Main spinner container */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>

        {/* Inner pulsing circle - properly centered */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-80"></div>

        {/* Center icon - properly centered */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
      </div>

      {/* Loading text with animated dots - fixed width container for dots */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-xl font-semibold text-gray-700">Setting up your space</h3>
          <span className="inline-block w-6 text-xl font-semibold text-gray-700 text-left">{dots}</span>
        </div>
        <p className="text-gray-500 max-w-md mx-auto">
          We're loading all the furniture and service options to help you create your perfect home
        </p>
      </div>

      {/* Animated progress indicators */}
      <div className="flex items-center justify-center space-x-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>

      {/* Subtle background decoration - properly positioned */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-8 right-8 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-8 left-8 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  )
}

export default LoadingSpinner