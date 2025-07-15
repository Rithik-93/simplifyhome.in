import { useState } from 'react'
import { Lock, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { UserDetails } from '../../types'

interface UserDetailsStepProps {
  userDetails: UserDetails
  onUpdate: (userDetails: UserDetails) => void
  onNext: () => void
  onPrev: () => void
}

interface OTPState {
  sent: boolean
  verified: boolean
  otp: string
  loading: boolean
  error: string | null
  attemptsLeft: number
}

const UserDetailsStep: React.FC<UserDetailsStepProps> = ({ 
  userDetails, 
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  const [otpState, setOtpState] = useState<OTPState>({
    sent: false,
    verified: false,
    otp: '',
    loading: false,
    error: null,
    attemptsLeft: 3
  })

  const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL

  const updateField = (field: keyof UserDetails, value: string) => {
    const updatedDetails = { ...userDetails, [field]: value }
    onUpdate(updatedDetails)
    
    // Reset OTP state when mobile number changes
    if (field === 'mobile') {
      setOtpState(prev => ({
        ...prev,
        sent: false,
        verified: false,
        otp: '',
        error: null,
        attemptsLeft: 3
      }))
    }
  }

  const isValidMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^[+]?[1-9]\d{1,14}$/
    return mobileRegex.test(mobile)
  }

  const sendOTP = async () => {
    if (!isValidMobileNumber(userDetails.mobile)) {
      setOtpState(prev => ({ ...prev, error: 'Please enter a valid mobile number' }))
      return
    }

    setOtpState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: userDetails.mobile
        })
      })

      const data = await response.json()

      if (data.success) {
        setOtpState(prev => ({
          ...prev,
          sent: true,
          loading: false,
          error: null
        }))
        
        // In development, show the OTP in console
        if (process.env.NODE_ENV === 'development' && data.data.otp) {
          console.log('OTP for testing:', data.data.otp)
        }
      } else {
        setOtpState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to send OTP'
        }))
      }
    } catch (error) {
      setOtpState(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.'
      }))
    }
  }

  const verifyOTP = async () => {
    if (!otpState.otp || otpState.otp.length !== 6) {
      setOtpState(prev => ({ ...prev, error: 'Please enter a valid 6-digit OTP' }))
      return
    }

    setOtpState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: userDetails.mobile,
          otp: otpState.otp
        })
      })

      const data = await response.json()

      if (data.success) {
        setOtpState(prev => ({
          ...prev,
          verified: true,
          loading: false,
          error: null
        }))
      } else {
        setOtpState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Invalid OTP',
          attemptsLeft: data.attemptsLeft || prev.attemptsLeft
        }))
      }
    } catch (error) {
      setOtpState(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.'
      }))
    }
  }

  const resendOTP = async () => {
    setOtpState(prev => ({ ...prev, loading: true, error: null, otp: '' }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: userDetails.mobile
        })
      })

      const data = await response.json()

      if (data.success) {
        setOtpState(prev => ({
          ...prev,
          loading: false,
          error: null,
          attemptsLeft: 3
        }))
        
        if (process.env.NODE_ENV === 'development' && data.data.otp) {
          console.log('Resent OTP for testing:', data.data.otp)
        }
      } else {
        setOtpState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to resend OTP'
        }))
      }
    } catch (error) {
      setOtpState(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.'
      }))
    }
  }

  const isValid = userDetails.name && userDetails.mobile && userDetails.email && userDetails.city && otpState.verified

  const handleSubmit = () => {
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 overflow-x-hidden">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-3 sm:p-6 border-2 border-yellow-400 max-w-2xl mx-auto w-full overflow-x-hidden">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2 sm:mb-3">
            Share Your Details
          </h2>
          <p className="text-sm sm:text-base text-gray-700">
            Get your final home interior estimate
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-sm sm:text-base min-h-[44px]"
              style={{ 
                borderColor: userDetails.name ? '#FFBD01' : undefined,
                boxShadow: userDetails.name ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
              }}
              required
            />
          </div>

          {/* Mobile Field with OTP Verification */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
              Your Mobile <span className="text-red-500">*</span>
              {otpState.verified && (
                <span className="ml-2 text-green-600 text-sm font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={userDetails.mobile}
                onChange={(e) => updateField('mobile', e.target.value)}
                placeholder="Enter your mobile number"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-sm sm:text-base min-h-[44px]"
                style={{ 
                  borderColor: userDetails.mobile ? '#FFBD01' : undefined,
                  boxShadow: userDetails.mobile ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
                }}
                required
                disabled={otpState.verified}
              />
              {!otpState.verified && (
                <button
                  onClick={sendOTP}
                  disabled={!userDetails.mobile || otpState.loading || otpState.sent}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 min-h-[44px] flex items-center ${
                    !userDetails.mobile || otpState.loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : otpState.sent
                      ? 'bg-green-600 text-white'
                      : 'bg-black text-yellow-400 hover:bg-gray-800'
                  }`}
                >
                  {otpState.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : otpState.sent ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                  <span className="ml-1 sm:ml-2">
                    {otpState.sent ? 'Sent' : 'Send OTP'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* OTP Input Field */}
          {otpState.sent && !otpState.verified && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 sm:p-4">
              <label className="block text-sm sm:text-base font-bold text-black mb-2">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otpState.otp}
                  onChange={(e) => setOtpState(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-sm sm:text-base min-h-[44px] text-center tracking-widest"
                  maxLength={6}
                />
                <button
                  onClick={verifyOTP}
                  disabled={!otpState.otp || otpState.otp.length !== 6 || otpState.loading}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 min-h-[44px] flex items-center ${
                    !otpState.otp || otpState.otp.length !== 6 || otpState.loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-yellow-400 hover:bg-gray-800'
                  }`}
                >
                  {otpState.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={resendOTP}
                  disabled={otpState.loading}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Resend OTP
                </button>
                <span className="text-xs text-gray-600">
                  Attempts left: {otpState.attemptsLeft}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {otpState.error && (
            <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3 flex items-center">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-600">{otpState.error}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-sm sm:text-base min-h-[44px]"
              style={{ 
                borderColor: userDetails.email ? '#FFBD01' : undefined,
                boxShadow: userDetails.email ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
              }}
              required
            />
          </div>

          {/* City Field */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
              Your City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userDetails.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Enter your city"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 text-sm sm:text-base min-h-[44px]"
              style={{ 
                borderColor: userDetails.city ? '#FFBD01' : undefined,
                boxShadow: userDetails.city ? '0 0 0 3px rgba(255, 189, 1, 0.1)' : undefined
              }}
              required
            />
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 sm:mt-6 bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-yellow-400">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-2 sm:mr-3 flex items-center justify-center">
              <Lock size={20} className="sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-black mb-1 sm:mb-2">
                Privacy Assurance
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-tight">
                Your personal information is secure with us. We'll use these details only to provide you with your interior design estimate and follow-up services.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-3 sm:mt-4 bg-black rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-yellow-400">
          <h4 className="text-sm sm:text-base font-bold text-yellow-400 mb-2 sm:mb-3">
            What you'll get:
          </h4>
          <ul className="text-xs sm:text-sm text-yellow-100 space-y-1 sm:space-y-2">
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2 text-sm sm:text-base">✓</span>
              Detailed cost breakdown
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2 text-sm sm:text-base">✓</span>
              Material specifications
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2 text-sm sm:text-base">✓</span>
              Free consultation call
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2 text-sm sm:text-base">✓</span>
              Design recommendations
            </li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3 sm:gap-0">
          <button
            onClick={onPrev}
            className="order-2 sm:order-1 px-4 sm:px-6 py-3 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl border-2 border-black text-black hover:bg-black hover:text-yellow-400 transition-all duration-300 transform hover:-translate-y-1 min-h-[44px]"
          >
            ← Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`order-1 sm:order-2 px-6 sm:px-8 py-3 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl transition-all duration-300 transform min-h-[44px] ${
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
          <p className="text-center text-red-500 text-xs sm:text-sm mt-3 font-medium">
            {!otpState.verified && userDetails.mobile ? 
              'Please verify your mobile number to continue' : 
              'Please fill in all required fields and verify your mobile number'
            }
          </p>
        )}
      </div>
    </div>
  )
}

export default UserDetailsStep 