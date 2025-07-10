import { Lock } from 'lucide-react'
import type { UserDetails } from '../../types'

interface UserDetailsStepProps {
  userDetails: UserDetails
  onUpdate: (userDetails: UserDetails) => void
  onNext: () => void
  onPrev: () => void
}

const UserDetailsStep: React.FC<UserDetailsStepProps> = ({ 
  userDetails, 
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  const updateField = (field: keyof UserDetails, value: string) => {
    onUpdate({ ...userDetails, [field]: value })
  }

  const isValid = userDetails.name && userDetails.mobile && userDetails.email && userDetails.city

  const handleSubmit = () => {
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="w-full mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-yellow-400 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black mb-4">
            Share Your Details
          </h2>
          <p className="text-gray-700 text-lg">
            Get your final home interior estimate
          </p>
        </div>

        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-lg font-bold text-black mb-3">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-lg"
              style={{ 
                borderColor: userDetails.name ? '#FFBD01' : undefined,
                boxShadow: userDetails.name ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
              }}
              required
            />
          </div>

          {/* Mobile Field */}
          <div>
            <label className="block text-lg font-bold text-black mb-3">
              Your Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={userDetails.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-lg"
              style={{ 
                borderColor: userDetails.mobile ? '#FFBD01' : undefined,
                boxShadow: userDetails.mobile ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
              }}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-lg font-bold text-black mb-3">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-lg"
              style={{ 
                borderColor: userDetails.email ? '#FFBD01' : undefined,
                boxShadow: userDetails.email ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
              }}
              required
            />
          </div>

          {/* City Field */}
          <div>
            <label className="block text-lg font-bold text-black mb-3">
              Your City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userDetails.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Enter your city"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-lg"
              style={{ 
                borderColor: userDetails.city ? '#FFBD01' : undefined,
                boxShadow: userDetails.city ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
              }}
              required
            />
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 bg-yellow-50 rounded-xl p-6 border-2 border-yellow-400">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4 flex items-center justify-center">
              <Lock size={32} className="text-yellow-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-black mb-2">
                Privacy Assurance
              </h4>
              <p className="text-base text-gray-700">
                Your personal information is secure with us. We'll use these details only to provide you with your interior design estimate and follow-up services.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-6 bg-black rounded-xl p-6 border-2 border-yellow-400">
          <h4 className="text-lg font-bold text-yellow-400 mb-4">
            What you'll get:
          </h4>
          <ul className="text-base text-yellow-100 space-y-3">
            <li className="flex items-center">
              <span className="text-yellow-400 mr-3 text-xl">✓</span>
              Detailed cost breakdown
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-3 text-xl">✓</span>
              Material specifications
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-3 text-xl">✓</span>
              Free consultation call
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-3 text-xl">✓</span>
              Design recommendations
            </li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrev}
            className="px-8 py-4 text-lg font-bold rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1"
          >
            ← Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-12 py-4 text-xl font-bold rounded-xl transition-all duration-300 transform ${
              isValid
                ? 'bg-black text-yellow-400 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{ 
              backgroundColor: isValid ? '#000000' : undefined,
              color: isValid ? '#FFBD01' : undefined
            }}
          >
            Get My Estimate →
          </button>
        </div>

        {!isValid && (
          <p className="text-center text-red-500 text-lg mt-4 font-medium">
            Please fill in all required fields to continue
          </p>
        )}
      </div>
    </div>
  )
}

export default UserDetailsStep 