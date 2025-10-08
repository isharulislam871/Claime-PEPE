'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from "next-auth/react";
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, SafetyOutlined, ThunderboltOutlined, BarChartOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';
import { API_CALL , generateSignature   } from 'auth-fingerprint';


const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Check existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl     );
        setCheckingSession(false);
        return;
      }
      setCheckingSession(false);
    };

    checkExistingSession();
  }, [router, callbackUrl]);

  const handleSubmit = async (values?: { email: string; password: string;  }) => {
    setIsLoading(true);
    setError('');

    // Use formData for the mobile form
    const submitData = values || formData;
    const { hash , timestamp , signature } = generateSignature(JSON.stringify({ ...formData }) , process.env.NEXTAUTH_SECRET ||  'app')
      localStorage.setItem('admin' , JSON.stringify({ ...formData }));
      const  { response  , status } = await API_CALL({ url : '/auth/valid_auth', method : 'POST' , body : { hash , timestamp , signature  }});
      if(status === 200){
         toast.success(response.message);
         setIsLoading(false)
          router.push(`/auth/otp?type=login`);
        return;
      }
      toast.error(response.error);
      setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value   } = e.target;
 
    setFormData(prev => ({
      ...prev,
      [name]:  value
    }));
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // Show loading spinner while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 -right-10 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-yellow-300/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
                <SafetyOutlined className="text-2xl text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Stter Admin Panel</h1>
            <p className="text-gray-400">Sign in to your dashboard</p>
          </div>

          {/* Mobile Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <form onSubmit={handleMobileSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <UserOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <LockOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </div>



              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl })}
                  className="flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white hover:bg-gray-600/50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => signIn('github', { callbackUrl })}
                  className="flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white hover:bg-gray-600/50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <SafetyOutlined className="mr-1" />
                Enterprise-grade encryption
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300/3 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        {/* Login Panel - Enhanced */}
        <div className="w-full flex items-center justify-center min-h-screen p-8">
          <div className="relative z-10 w-full max-w-md mx-auto">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-400/20">
                  <SafetyOutlined className="text-3xl text-black" />
                </div>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to Stter Admin Panel</p>
            </div>

            {/* Enhanced Form */}
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl shadow-black/20">
              <form onSubmit={handleMobileSubmit} className="space-y-4">


                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-20 pointer-events-none">
                      <UserOutlined className="text-lg" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/70 focus:bg-gray-700/50 transition-all duration-300 text-base relative z-10"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-20 pointer-events-none">
                      <LockOutlined className="text-lg" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 py-4 bg-gray-700/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/70 focus:bg-gray-700/50 transition-all duration-300 text-base relative z-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors z-20"
                    >
                      {showPassword ? <EyeOutlined className={`text-lg ${showPassword ? 'hidden' : 'block'}`} /> : <EyeInvisibleOutlined className={`text-lg ${showPassword ? 'block' : 'hidden'}`} />}


                    </button>
                  </div>
                </div>

                <div className="flex item-end justify-between">

                  <div></div>
                  <a href="/auth/password" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-400/25 text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-800/60 text-gray-400 font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl })}
                    className="group flex items-center justify-center px-4 py-3 border border-gray-600/30 rounded-xl bg-gray-700/20 text-white hover:bg-gray-600/30 hover:border-gray-500/50 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => signIn('github', { callbackUrl })}
                    className="group flex items-center justify-center px-4 py-3 border border-gray-600/30 rounded-xl bg-gray-700/20 text-white hover:bg-gray-600/30 hover:border-gray-500/50 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-700/30">
                <div className="flex items-center justify-center text-sm text-gray-400">
                  <SafetyOutlined className="mr-2 text-yellow-400" />
                  <span>Secured with enterprise-grade encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default function AdminLogin() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
};
