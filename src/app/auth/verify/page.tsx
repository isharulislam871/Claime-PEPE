'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined, SafetyOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

// Loading component for Suspense fallback
const VerifyPageLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
    <div className="text-white text-lg">Loading...</div>
  </div>
);

// Main verify component that uses useSearchParams
const VerifyContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus('failed');
        return;
      }

      try {
        // Simulate API call to verify token
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        const isValid = Math.random() > 0.3; // 70% success rate
        
        if (isValid) {
          setVerificationStatus('success');
          setTimeout(() => setShowPasswordForm(true), 1000);
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        setVerificationStatus('failed');
      }
    };

    verifyToken();
  }, [token]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Password validation functions
  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      match: passwords.confirmPassword ? password === passwords.confirmPassword : true
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(passwords.newPassword);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean) && passwords.confirmPassword;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    setIsUpdating(true);

    try {
      // Simulate API call to update password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password updated successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const renderVerificationStatus = () => {
    if (verificationStatus === 'loading') {
      return (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">Verifying your request...</p>
            <p className="text-gray-400 text-sm">Please wait while we verify your reset token</p>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'failed') {
      return (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CloseCircleOutlined className="text-3xl text-red-400" />
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">Verification Failed</p>
            <p className="text-gray-400 text-sm">
              The reset link is invalid or has expired. Please request a new password reset.
            </p>
          </div>
          <button
            onClick={() => router.push('/auth/password')}
            className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-400/25"
          >
            Request New Reset Link
          </button>
        </div>
      );
    }

    if (verificationStatus === 'success' && !showPasswordForm) {
      return (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleOutlined className="text-3xl text-green-400" />
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">Verification Successful!</p>
            <p className="text-gray-400 text-sm">Redirecting to password reset form...</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300/3 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Verification Panel */}
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
              {showPasswordForm ? 'Set New Password' : 'Verify Reset Link'}
            </h1>
            <p className="text-gray-400">
              {showPasswordForm 
                ? 'Create a strong password for your account'
                : 'Verifying your password reset request'
              }
            </p>
          </div>

          {/* Content */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl shadow-black/20">
            {showPasswordForm ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* New Password */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-20 pointer-events-none">
                    <LockOutlined className="text-lg" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-700/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/70 focus:bg-gray-700/50 transition-all duration-300 text-base relative z-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors z-20"
                  >
                    {showNewPassword ? <EyeInvisibleOutlined className="text-lg" /> : <EyeOutlined className="text-lg" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-20 pointer-events-none">
                    <LockOutlined className="text-lg" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-700/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/70 focus:bg-gray-700/50 transition-all duration-300 text-base relative z-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors z-20"
                  >
                    {showConfirmPassword ? <EyeInvisibleOutlined className="text-lg" /> : <EyeOutlined className="text-lg" />}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="text-sm space-y-3">
                  <p className="font-medium text-gray-300">Password requirements:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className={`flex items-center transition-colors ${passwordRequirements.length ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 ${passwordRequirements.length ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center transition-colors ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 ${passwordRequirements.uppercase ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      One uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center transition-colors ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 ${passwordRequirements.lowercase ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      One lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center transition-colors ${passwordRequirements.number ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 ${passwordRequirements.number ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      One number (0-9)
                    </div>
                    <div className={`flex items-center transition-colors ${passwordRequirements.special ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 ${passwordRequirements.special ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      One special character (!@#$%^&*)
                    </div>
                    <div className={`flex items-center transition-colors ${passwordRequirements.match && passwords.confirmPassword ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 ${passwordRequirements.match && passwords.confirmPassword ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      Passwords match
                    </div>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">Password Strength</span>
                      <span className={`text-xs font-medium ${
                        Object.values(passwordRequirements).filter(Boolean).length >= 5 ? 'text-green-400' :
                        Object.values(passwordRequirements).filter(Boolean).length >= 3 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {Object.values(passwordRequirements).filter(Boolean).length >= 5 ? 'Strong' :
                         Object.values(passwordRequirements).filter(Boolean).length >= 3 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          Object.values(passwordRequirements).filter(Boolean).length >= 5 ? 'bg-green-400 w-full' :
                          Object.values(passwordRequirements).filter(Boolean).length >= 3 ? 'bg-yellow-400 w-2/3' : 'bg-red-400 w-1/3'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating || !isPasswordValid}
                  className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-400/25 text-base"
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                      Updating Password...
                    </div>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            ) : (
              renderVerificationStatus()
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-700/30">
              <button
                onClick={handleBackToLogin}
                className="flex items-center justify-center w-full text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
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

// Main page component with Suspense wrapper
const VerifyPage = () => {
  return (
    <Suspense fallback={<VerifyPageLoading />}>
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
