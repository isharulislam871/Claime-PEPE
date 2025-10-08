'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserOutlined, ArrowLeftOutlined, SafetyOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const PasswordResetPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300/3 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Password Reset Panel */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-400/20">
                <SafetyOutlined className="text-3xl text-black" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </h1>
            <p className="text-gray-400">
              {emailSent 
                ? 'We\'ve sent a password reset link to your email address'
                : 'Enter your email address and we\'ll send you a reset link'
              }
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl shadow-black/20">
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-20 pointer-events-none">
                    <UserOutlined className="text-lg" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/70 focus:bg-gray-700/50 transition-all duration-300 text-base relative z-10"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-400/25 text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                      Sending Reset Link...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">Reset link sent!</p>
                  <p className="text-gray-400 text-sm">
                    Check your email <span className="text-yellow-400">{email}</span> for the password reset link.
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setEmailSent(false)}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    try again
                  </button>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-700/30">
              <button
                onClick={handleBackToLogin}
                className="flex items-center justify-center w-full text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeftOutlined className="mr-2" />
                Back to Sign In
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center text-sm text-gray-400">
                <SafetyOutlined className="mr-2 text-yellow-400" />
                <span>Secured with enterprise-grade encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
