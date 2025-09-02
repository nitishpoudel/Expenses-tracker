import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '../src/config/api.js';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState(() => {
    // Get email from localStorage if available (from signup)
    return localStorage.getItem('pendingVerificationEmail') || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Check if token is in URL (for direct link verification)
  const tokenFromUrl = searchParams.get('token');

  useEffect(() => {
    // If token is in URL, verify automatically
    if (tokenFromUrl) {
      verifyEmail(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyEmail = async (token) => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.VERIFY_EMAIL}/${token}`, {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        // Clear pending verification email from localStorage
        localStorage.removeItem('pendingVerificationEmail');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setIsError(true);
        setErrorMessage(result.message || 'Verification failed');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerification = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the verification code');
      setIsError(true);
      return;
    }
    await verifyEmail(verificationCode);
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      setIsError(true);
      return;
    }

    setIsResending(true);
    setIsError(false);
    
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCountdown(60); // 60 second cooldown
        setErrorMessage('Verification email sent! Please check your inbox.');
        setIsError(false);
      } else {
        setErrorMessage(result.message || 'Failed to resend verification email');
        setIsError(true);
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      setIsError(true);
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now log in to your account.</p>
          <div className="text-sm text-gray-500">
            Redirecting to login page in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">Enter the verification code sent to your email</p>
        </div>

        <form onSubmit={handleManualVerification} className="space-y-6">
          {/* Verification Code Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter verification code"
              disabled={isLoading}
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || !verificationCode.trim()}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              isLoading || !verificationCode.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-200'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
        </div>

        {/* Resend Verification */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={handleResendVerification}
            disabled={isResending || countdown > 0}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isResending || countdown > 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 focus:ring-4 focus:ring-green-200'
            }`}
          >
            {isResending ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Sending...</span>
              </div>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              'Resend Verification Email'
            )}
          </button>
        </div>

        {/* Error/Success Messages */}
        {isError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
