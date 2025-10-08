'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { 
  SafetyOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  MailOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  SecurityScanOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';


import { 
  verifyOTPRequest, 
  resendOTPRequest, 
  resendOTPSuccess, 
  resendOTPFailure, 
  clearOTPError
} from '@/modules/public/otp/actions';
import {
  selectIsVerifying,
  selectIsResending,
  selectCanResend,
  selectVerificationSuccess
} from '@/modules/public/otp/selectors';
import { AppDispatch } from '@/modules/store';
import { getSession } from 'next-auth/react';

// Loading component for Suspense fallback
const OTPPageLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
    <div className="text-white text-lg">Loading...</div>
  </div>
);

// Main OTP component that uses useSearchParams
const OTPVerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  // URL parameters
  const  email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'login'; // login, register, password-reset
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
  
  // Local state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [otpValue, setOtpValue] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
   
  
  // OTP input refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Redux state
  const isVerifying = useSelector(selectIsVerifying);
  const isResending = useSelector(selectIsResending);
  const canResend = useSelector(selectCanResend);
  const verificationSuccess = useSelector(selectVerificationSuccess);
  
 

    // Check existing session on component mount
    useEffect(() => {
      const checkExistingSession = async () => {
        const session = await getSession();
        if (session) {
          router.push(callbackUrl     );
        
          return;
        }
      };
  
      checkExistingSession();
    }, [router, callbackUrl]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearOTPError());
  }, [dispatch]);

  // OTP Input Handlers
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Check if all digits are filled
    if (newDigits.every(digit => digit !== '')) {
      const completeOTP = newDigits.join('');
      setOtpValue(completeOTP);
      handleOTPComplete(completeOTP);
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtpDigits(newDigits);
    
    if (pastedData.length === 6) {
      setOtpValue(pastedData);
      handleOTPComplete(pastedData);
    }
  };
    
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPComplete = async (otp: string) => {
   

    // Clear any existing errors
    dispatch(clearOTPError());
    setOtpValue(otp);
  
    // Dispatch verify OTP request
    dispatch(verifyOTPRequest({ 
      type: type as 'login' | 'register' | 'password-reset', 
      otp, 
      callbackUrl
    }));
  };

  const handleResendOTP = async () => {
    // Clear any existing errors
    dispatch(clearOTPError());
    
    // Reset OTP inputs
    setOtpDigits(['', '', '', '', '', '']);
    setOtpValue('');
    
    // Dispatch resend OTP request
    dispatch(resendOTPRequest({
      type: type as 'login' | 'register' | 'password-reset',
      email
    }));
 
    setTimeLeft(300);

    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch(resendOTPSuccess({
        success: true,
        message: 'New OTP sent successfully!',
        newHash: `new-hash-${Date.now()}`,
        expiresAt: new Date(Date.now() + 300000).toISOString() // 5 minutes
      }));
      
      toast.success('New OTP sent successfully!');
    } catch (error) {
      dispatch(resendOTPFailure('Failed to resend OTP. Please try again.'));
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };


  const getPageTitle = () => {
    switch (type) {
      case 'register':
        return 'Verify Your Account';
      case 'password-reset':
        return 'Reset Password Verification';
      default:
        return 'Two-Factor Authentication';
    }
  };

  const getPageDescription = () => {
    switch (type) {
      case 'register':
        return 'Complete your account setup by verifying your email';
      case 'password-reset':
        return 'Verify your identity to reset your password';
      default:
        return 'Enter the verification code to secure your login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-yellow-300/3 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8 lg:p-12">
        {/* Header - Mobile Only */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
            <span className="hidden sm:inline">Back to Login</span>
            <span className="sm:hidden">Back</span>
          </button>
          
        </div>

        {/* OTP Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
            {/* Binance-style Compact Form Container */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl">
              
              {/* Compact Header Section */}
              <div className="text-center mb-6 lg:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-2 lg:mb-4">
                  {getPageDescription()}
                </p>
                <p className="text-yellow-400 text-sm lg:text-base font-medium">
                  Code sent to: {email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
                </p>
              </div>

              {/* Compact OTP Input */}
              <div className="mb-6 lg:mb-8">
                <div className="flex justify-center space-x-3 lg:space-x-4 mb-4 lg:mb-6" onPaste={handleOTPPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-center text-lg md:text-xl lg:text-2xl font-bold bg-white/10 border border-white/20 rounded-xl lg:rounded-2xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all hover:bg-white/15"
                      disabled={isVerifying}
                    />
                  ))}
                </div>
              </div>

              {/* Compact Timer and Resend */}
              <div className="text-center mb-6 lg:mb-8">
                <div className="flex items-center justify-center text-gray-400 mb-3 lg:mb-4">
                  <ClockCircleOutlined className="mr-2 lg:text-lg" />
                  <span className="text-sm lg:text-base">
                    Code expires in: <span className="text-yellow-400 font-medium">{formatTime(timeLeft)}</span>
                  </span>
                </div>
                
                <button
                  onClick={handleResendOTP}
                  disabled={timeLeft > 0 || isResending}
                  className="text-yellow-400 hover:text-yellow-300 text-sm lg:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? (
                    <>
                      <ReloadOutlined className="animate-spin mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Sending New Code...</span>
                      <span className="sm:hidden">Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Resend Verification Code</span>
                      <span className="sm:hidden">Resend Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Compact Loading State */}
              {isVerifying && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center text-yellow-400 lg:text-lg">
                    <ReloadOutlined className="animate-spin mr-2 lg:mr-3" />
                    <span className="hidden sm:inline">Verifying your code...</span>
                    <span className="sm:hidden">Verifying...</span>
                  </div>
                </div>
              )}

              

              {/* Compact Security Notice */}
              <div className="mt-6 lg:mt-8 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
                <div className="flex items-center text-yellow-400 text-xs lg:text-sm">
                  <SafetyOutlined className="mr-2 flex-shrink-0" />
                  <span>Your account is protected with enterprise-grade encryption</span>
                </div>
              </div>
            </div>

            {/* Compact Help Text */}
            <div className="mt-6 lg:mt-8 text-center">
              <p className="text-gray-500 text-xs lg:text-sm">
                Didn't receive the code? Check your spam folder or{' '}
                <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                  contact support
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense wrapper
const OTPVerificationPage = () => {
  return (
    <Suspense fallback={<OTPPageLoading />}>
      <OTPVerificationContent />
    </Suspense>
  );
};

export default OTPVerificationPage;
