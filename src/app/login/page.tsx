'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Check existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl);
        setCheckingSession(false);
        return;
      }
      setCheckingSession(false);
    };

    checkExistingSession();
  }, [router, callbackUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else if (result?.ok) {
         router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-15 animate-float top-1/5 left-1/10" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-30 h-30 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-15 animate-float top-3/5 right-1/6" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-15 h-15 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-15 animate-float bottom-1/5 left-1/5" style={{ animationDelay: '4s' }}></div>
        <div className="absolute w-25 h-25 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-15 animate-float top-1/10 right-1/4" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative backdrop-blur-sm border border-white/20 animate-slideUp z-10">
        {/* Logo/Header Section */}
        <div className="text-center mb-9">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11H16V18H8V11H9.2V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.4 8.7 10.4 10V11H13.6V10C13.6 8.7 12.8 8.2 12 8.2Z" />
            </svg>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-green-500 bg-clip-text text-transparent">Admin Panel</h1>
          </div>
          <p className="text-gray-500 text-base font-medium">TaskUp Management Dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-800 text-sm">  Email</label>
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your   email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full py-4 pl-12 pr-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 focus:-translate-y-px"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-800 text-sm">Password</label>
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 focus:-translate-y-px"
              />
              <button
                type="button"
                className="absolute right-4 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
            <label className="flex items-center cursor-pointer text-sm text-gray-500">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded mr-2 relative transition-all duration-300 ${
                formData.rememberMe ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
              }`}>
                {formData.rememberMe && (
                  <svg className="absolute inset-0 w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              Remember me
            </label>
            <a href="#" className="text-blue-500 text-sm font-medium hover:text-green-500 transition-colors duration-300">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Additional Options */}
        <div className="text-center">
          <div className="relative my-6 text-gray-400 text-sm">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
            <span className="bg-white px-4 relative">or</span>
          </div>
          
        

          <p className="text-gray-400 text-sm">
            Need help? <a href="#" className="text-blue-500 font-medium hover:text-green-500">Contact Support</a>
          </p>
        </div>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-5 text-center text-gray-400 text-xs z-10">
        <p>Version 1.0.0 | © 2024 TaskUp Admin</p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
