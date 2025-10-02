'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Popup, Skeleton, Loading, List, Input, Button } from 'antd-mobile';
import { PlayOutline, GiftOutline, CheckCircleOutline, HistogramOutline, AddOutline } from 'antd-mobile-icons';
import { toast } from 'react-toastify';
import ConfirmationPopup from './ConfirmationPopup';
import { closePopup, selectIsVoucherPopupVisible } from '@/modules';
import { useDispatch, useSelector } from 'react-redux';
interface Voucher {
  id: string;
  title: string;
  description: string;
  expiryDate: string;
  category: 'shopping' | 'food' | 'entertainment' | 'travel' | 'gaming';
  pointsCost: number;
  image?: string;
  isRedeemed?: boolean;
  isExpired?: boolean;
  requiresAd?: boolean;
  adWatched?: boolean;
  isComingSoon?: boolean;
  expirestoday?: boolean;
}

interface RedemptionHistory {
  id: string;
  voucherTitle: string;
  code: string;
  redeemedAt: string;
  category: string;
  pointsUsed: number;
}
 
const VoucherPopup = ( ) => {
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'shopping' | 'food' | 'entertainment' | 'travel' | 'gaming'>('all');
  const [watchingAd, setWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [confirmVoucher, setConfirmVoucher] = useState<Voucher | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState('');
  
  // New states for code entry and history
  const [showCodeEntryPopup, setShowCodeEntryPopup] = useState(false);
  
  const [enteredCode, setEnteredCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistory[]>([]);
  const [currentView, setCurrentView] = useState<'vouchers' | 'history'>('vouchers');
 const dispatch = useDispatch ();
  // Mock voucher data
  const mockVouchers: Voucher[] = useMemo(() => [
    {
      id: '1',
      title: '50% Off Gaming Gear',
      description: 'Get 50% discount on gaming accessories and peripherals',
      expiryDate: '2025-09-30',
      category: 'gaming',
      pointsCost: 5000,
      image: '',
      requiresAd: true,
      adWatched: false
    },
    {
      id: '2',
      title: '20% Off Food Delivery',
      description: 'Get 20% discount on your next food order',
      expiryDate: '2024-11-30',
      category: 'food',
      pointsCost: 2000,
      image: '',
      requiresAd: false,
      adWatched: false
    },
    {
      id: '3',
      title: 'Free Movie Ticket',
      description: 'Get one free movie ticket for any show',
      expiryDate: '2024-12-15',
      category: 'entertainment',
      pointsCost: 8000,
      image: '',
      requiresAd: true,
      adWatched: false
    },
    {
      id: '4',
      title: 'Expired Shopping Deal',
      description: '30% off on all electronics - This offer has expired',
      expiryDate: '2024-01-15',
      category: 'shopping',
      pointsCost: 3000,
      image: '',
      requiresAd: false,
      adWatched: false
    },
    {
      id: '5',
      title: 'Future Travel Discount',
      description: '25% off on flight bookings - Coming soon!',
      expiryDate: '2025-06-30',
      category: 'travel',
      pointsCost: 6000,
      image: '',
      requiresAd: true,
      adWatched: false
    }
  ], []);

  // Mock redemption history
  const mockHistory: RedemptionHistory[] = useMemo(() => [
    {
      id: '1',
      voucherTitle: '10% Off Shopping',
      code: 'SHO1234ABC',
      redeemedAt: '2024-01-15T10:30:00Z',
      category: 'shopping',
      pointsUsed: 1500
    },
    {
      id: '2',
      voucherTitle: 'Free Coffee',
      code: 'FOO5678DEF',
      redeemedAt: '2024-01-10T14:20:00Z',
      category: 'food',
      pointsUsed: 500
    }
  ], []);

  const isOpen = useSelector(selectIsVoucherPopupVisible);
  const onClose = () => {
    dispatch(closePopup('isVoucherPopupVisible'))
  };

  // Helper function to check voucher expiry status
  const getVoucherStatus = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expiryDay = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    
    if (expiryDay < today) {
      return 'expired';
    } else if (expiryDay > today) {
      // Check if it's more than 30 days in the future (coming soon)
      const diffTime = expiryDay.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 30 ? 'coming-soon' : 'active';
    } else {
      return 'expires-today';
    }
  };

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const filteredVouchers = activeCategory === 'all' 
        ? mockVouchers 
        : mockVouchers.filter(voucher => voucher.category === activeCategory);
      
      // Add expiry status to vouchers
      const vouchersWithStatus = filteredVouchers.map(voucher => ({
        ...voucher,
        isExpired: getVoucherStatus(voucher.expiryDate) === 'expired',
        isComingSoon: getVoucherStatus(voucher.expiryDate) === 'coming-soon',
        expirestoday: getVoucherStatus(voucher.expiryDate) === 'expires-today'
      }));
      
      setVouchers(vouchersWithStatus);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, mockVouchers]);

  useEffect(() => {
    if (isOpen) {
      fetchVouchers();
      setRedemptionHistory(mockHistory);
    }
  }, [isOpen, activeCategory, fetchVouchers, mockHistory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shopping': return '🛍️';
      case 'food': return '🍔';
      case 'entertainment': return '🎬';
      case 'travel': return '✈️';
      case 'gaming': return '🎮';
      default: return '🎫';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shopping': return 'bg-pink-100 text-pink-600';
      case 'food': return 'bg-orange-100 text-orange-600';
      case 'entertainment': return 'bg-red-100 text-red-600';
      case 'travel': return 'bg-blue-100 text-blue-600';
      case 'gaming': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Generate random voucher code
  const generateVoucherCode = (voucher: Voucher): string => {
    const prefix = voucher.category.toUpperCase().slice(0, 3);
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${randomNum}${suffix}`;
  };

  const handleWatchAd = async (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setWatchingAd(true);
    setAdProgress(0);
    
    // Simulate ad watching progress
    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setWatchingAd(false);
          
          // Generate unique code for this voucher
          const newCode = generateVoucherCode(voucher);
          setGeneratedCodes(newCode);
          
          // Mark ad as watched for this voucher
          setVouchers(prevVouchers => 
            prevVouchers.map(v => 
              v.id === voucher.id ? { ...v, adWatched: true } : v
            )
          );
          
          toast.success(`Ad completed! Code generated: ${newCode}`);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleRedeemVoucher = (voucher: Voucher) => {
    // Check if voucher is expired
    if (voucher.isExpired) {
      toast.error('This voucher has expired and cannot be redeemed.');
      return;
    }
    
    // Check if voucher is coming soon
    if (voucher.isComingSoon) {
      toast.error('This voucher is not yet available for redemption.');
      return;
    }
    
    if (voucher.requiresAd && !voucher.adWatched) {
      handleWatchAd(voucher);
      return;
    }
 

    // If ad was watched and code is generated, show code directly
    if (voucher.requiresAd && voucher.adWatched && generatedCodes) {
      setSelectedVoucher(voucher);
      setShowSuccessPopup(true);
      return;
    }
    
    setConfirmVoucher(voucher);
    setShowConfirmPopup(true);
  };

  const handleCodeEntry = async () => {
    if (!enteredCode.trim()) {
      toast.error('Please enter a voucher code');
      return;
    }

    setIsValidatingCode(true);
    try {
      // Simulate API call to validate code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - check if code follows expected format
      const isValidFormat = /^[A-Z]{3}\d{4}[A-Z]{3}$/.test(enteredCode.toUpperCase());
      
      if (isValidFormat) {
        // Add to redemption history
        const newRedemption: RedemptionHistory = {
          id: Date.now().toString(),
          voucherTitle: 'Manual Code Entry',
          code: enteredCode.toUpperCase(),
          redeemedAt: new Date().toISOString(),
          category: 'general',
          pointsUsed: 0
        };
        
        setRedemptionHistory(prev => [newRedemption, ...prev]);
        setEnteredCode('');
        setShowCodeEntryPopup(false);
        toast.success(`Code ${enteredCode.toUpperCase()} redeemed successfully!`);
      } else {
        toast.error('Invalid code format. Please check and try again.');
      }
    } catch (error) {
      toast.error('Failed to validate code. Please try again.');
    } finally {
      setIsValidatingCode(false);
    }
  };

  const CategoryButton = ({ 
    category, 
    label, 
    isActive 
  }: { 
    category: 'all' | 'shopping' | 'food' | 'entertainment' | 'travel' | 'gaming'; 
    label: string; 
    isActive: boolean 
  }) => (
    <button
      onClick={() => setActiveCategory(category)}
      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
        isActive 
          ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
          : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <Popup
        visible={ isOpen }
        onMaskClick={onClose}
        onClose={onClose}
        bodyStyle={{
          height: '100vh',
          overflow: 'hidden',
          padding: '0'
        }}
      >
        <div className="h-full bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="text-purple-600 text-2xl">{currentView === 'vouchers' ? '🎫' : '📋'}</div>
              <h2 className="text-xl font-bold text-gray-800">{currentView === 'vouchers' ? 'Vouchers' : 'History'}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCodeEntryPopup(true)}
                className="p-2 rounded-full hover:bg-purple-100 transition-colors duration-200 text-purple-600"
                title="Enter Code"
              >
                <AddOutline style={{ fontSize: '20px' }} />
              </button>
              <button
                onClick={() => setCurrentView(currentView === 'vouchers' ? 'history' : 'vouchers')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title={currentView === 'vouchers' ? 'View History' : 'View Vouchers'}
              >
                {currentView === 'vouchers' ? (
                  <HistogramOutline style={{ fontSize: '20px' }} />
                ) : (
                  <GiftOutline style={{ fontSize: '20px' }} />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Tabs - Only show for vouchers view */}
          {currentView === 'vouchers' && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 px-4">
              <CategoryButton category="all" label="All" isActive={activeCategory === 'all'} />
              <CategoryButton category="shopping" label="Shopping" isActive={activeCategory === 'shopping'} />
              <CategoryButton category="food" label="Food" isActive={activeCategory === 'food'} />
              <CategoryButton category="entertainment" label="Movies" isActive={activeCategory === 'entertainment'} />
              <CategoryButton category="travel" label="Travel" isActive={activeCategory === 'travel'} />
              <CategoryButton category="gaming" label="Gaming" isActive={activeCategory === 'gaming'} />
            </div>
          )}

          {/* List Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {currentView === 'history' ? (
              // History View
              redemptionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Redemption History</h3>
                  <p className="text-gray-500">Your redeemed vouchers will appear here!</p>
                </div>
              ) : (
                <div className="overflow-y-auto h-full px-4">
                  <List>
                    {redemptionHistory.map((item) => (
                      <List.Item key={item.id}>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                {getCategoryIcon(item.category)} {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                              </span>
                              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <CheckCircleOutline style={{ fontSize: '10px' }} /> USED
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1">{item.voucherTitle}</h3>
                            <p className="text-sm text-gray-600 mb-2 font-mono">{item.code}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Redeemed: {new Date(item.redeemedAt).toLocaleDateString()}</span>
                              {item.pointsUsed > 0 && <span>{item.pointsUsed.toLocaleString()} pts used</span>}
                            </div>
                          </div>
                          <button
                            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(item.code);
                              toast.success('Code copied to clipboard!');
                            }}
                          >
                            Copy Code
                          </button>
                        </div>
                      </div>
                    </List.Item>
                    ))}
                  </List>
                </div>
              )
            ) : loading ? (
              <div className="overflow-y-auto h-full px-4">
                <List>
                {[...Array(5)].map((_, index) => (
                  <List.Item key={index}>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Skeleton 
                              animated 
                              style={{ width: '24px', height: '24px', borderRadius: '4px' }} 
                            />
                            <Skeleton.Title animated style={{ fontSize: '16px', width: '150px' }} />
                          </div>
                          <Skeleton.Title animated style={{ fontSize: '14px', width: '200px', marginBottom: '8px' }} />
                          <div className="flex items-center gap-4">
                            <Skeleton.Title animated style={{ fontSize: '12px', width: '80px' }} />
                            <Skeleton.Title animated style={{ fontSize: '12px', width: '100px' }} />
                          </div>
                        </div>
                        <div className="text-right">
                          <Skeleton.Title animated style={{ fontSize: '18px', width: '60px', marginBottom: '8px' }} />
                          <Skeleton 
                            animated 
                            style={{ width: '80px', height: '32px', borderRadius: '8px' }} 
                          />
                        </div>
                      </div>
                    </div>
                  </List.Item>
                  ))}
                </List>
              </div>
            ) : vouchers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">🎫</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Vouchers Available</h3>
                <p className="text-gray-500">Check back later for new voucher offers!</p>
              </div>
            ) : (
              <div className="overflow-y-auto h-full px-4">
                <List>
                  {vouchers.map((voucher) => (
                    <List.Item key={voucher.id}>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(voucher.category)}`}>
                              {getCategoryIcon(voucher.category)} {voucher.category.charAt(0).toUpperCase() + voucher.category.slice(1)}
                            </span>
                           
                            {voucher.isExpired && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                ⏰ EXPIRED
                              </span>
                            )}
                            
                            {voucher.isComingSoon && (
                              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                🚀 COMING SOON
                              </span>
                            )}
                            
                            {voucher.expirestoday && (
                              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                ⚡ EXPIRES TODAY
                              </span>
                            )}
                           
                            {!voucher.isExpired && !voucher.isComingSoon && voucher.requiresAd && !voucher.adWatched && (
                              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <PlayOutline style={{ fontSize: '10px' }} /> AD
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-1">{voucher.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{voucher.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className={voucher.isExpired ? 'text-red-500 font-medium' : voucher.expirestoday ? 'text-yellow-600 font-medium' : ''}>
                              {voucher.isExpired ? 'Expired: ' : voucher.expirestoday ? 'Expires Today: ' : 'Expires: '}
                              {new Date(voucher.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-purple-600 mb-2">
                            {voucher.pointsCost.toLocaleString()} pts
                          </div>
                          {voucher.isRedeemed ? (
                            <button
                              className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 opacity-60 cursor-not-allowed"
                              disabled
                            >
                              <CheckCircleOutline style={{ fontSize: '14px' }} /> Redeemed
                            </button>
                          ) : voucher.isExpired ? (
                            <button
                              className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 opacity-60 cursor-not-allowed"
                              disabled
                            >
                              ⏰ Expired
                            </button>
                          ) : voucher.isComingSoon ? (
                            <button
                              className="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 opacity-60 cursor-not-allowed"
                              disabled
                            >
                              🚀 Coming Soon
                            </button>
                          ) : voucher.requiresAd && !voucher.adWatched ? (
                            <button
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors duration-200 active:scale-95"
                              onClick={() => handleRedeemVoucher(voucher)}
                            >
                              <PlayOutline style={{ fontSize: '14px' }} /> Watch Ad
                            </button>
                          ) : voucher.requiresAd && voucher.adWatched && generatedCodes ? (
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors duration-200 active:scale-95 shadow-md hover:shadow-lg"
                              onClick={() => handleRedeemVoucher(voucher)}
                            >
                              <GiftOutline style={{ fontSize: '14px' }} /> Show Code
                            </button>
                          ) : (
                            <button
                              className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors duration-200 active:scale-95 shadow-md hover:shadow-lg ${
                                voucher.expirestoday 
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                              onClick={() => handleRedeemVoucher(voucher)}
                            >
                              <GiftOutline style={{ fontSize: '14px' }} /> {voucher.expirestoday ? 'Claim Now!' : 'Claim'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </List.Item>
                  ))}
                </List>
              </div>
            )}

       
          </div>
        </div>
      </Popup>

      {/* Ad Watching Popup */}
      <Popup
        visible={watchingAd}
        onClose={() => {}}
        closeOnMaskClick={false}
        bodyStyle={{
          borderRadius: '12px',
          padding: '0'
        }}
      >
        <div className="text-center py-6 px-4">
          <div className="text-4xl mb-4">📺</div>
          <h3 className="font-bold text-lg mb-4">Watching Ad...</h3>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${adProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{Math.round(adProgress)}% Complete</p>
          <p className="text-xs text-gray-500">Please wait while the ad plays...</p>
          <Loading color="primary" className="mt-4" />
        </div>
      </Popup>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        visible={showConfirmPopup}
        title="Confirm Redemption"
        message={`Redeem "${confirmVoucher?.title}" for ${confirmVoucher?.pointsCost.toLocaleString()} points?`}
        confirmText="Redeem Now"
        cancelText="Cancel"
        loading={isRedeeming}
        onConfirm={async () => {
          if (!confirmVoucher) return;
          setIsRedeeming(true);
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const finalCode = generatedCodes || generateVoucherCode(confirmVoucher);
            setGeneratedCodes(finalCode);
            
            // Add to redemption history
            const newRedemption: RedemptionHistory = {
              id: Date.now().toString(),
              voucherTitle: confirmVoucher.title,
              code: finalCode,
              redeemedAt: new Date().toISOString(),
              category: confirmVoucher.category,
              pointsUsed: confirmVoucher.pointsCost
            };
            setRedemptionHistory(prev => [newRedemption, ...prev]);
            
            toast.success(`Voucher redeemed! Code: ${finalCode}`);
            setShowConfirmPopup(false);
            setShowSuccessPopup(true);
          } catch (error) {
            toast.error('Failed to redeem voucher. Please try again.');
          } finally {
            setIsRedeeming(false);
          }
        }}
        onCancel={() => {
          if (!isRedeeming) {
            setShowConfirmPopup(false);
          }
        }}
      />

      {/* Success Popup */}
      <Popup
        visible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        bodyStyle={{
          borderRadius: '12px',
          padding: '0'
        }}
      >
        <div className="p-6">
          <div className="text-center py-4">
            <div className="text-green-600 text-4xl mb-4">🎉</div>
            <h3 className="font-bold text-lg mb-2">Voucher Redeemed!</h3>
            <h4 className="font-semibold text-gray-800 mb-4">{selectedVoucher?.title}</h4>
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Voucher Code:</p>
              <p className="font-mono font-bold text-xl text-purple-600">{generatedCodes}</p>
            </div>
            <p className="text-sm text-gray-600 mb-6">Copy this code and use it at checkout!</p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setShowSuccessPopup(false)}
              >
                Close
              </button>
              <button
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                onClick={() => {
                  if (generatedCodes) {
                    navigator.clipboard.writeText(generatedCodes);
                    toast.success('Code copied to clipboard!');
                  }
                  setShowSuccessPopup(false);
                }}
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </Popup>

      {/* Code Entry Popup */}
      <Popup
        visible={showCodeEntryPopup}
        onClose={() => {
          if (!isValidatingCode) {
            setShowCodeEntryPopup(false);
            setEnteredCode('');
          }
        }}
        bodyStyle={{
          borderRadius: '12px',
          padding: '0'
        }}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-purple-600 text-4xl mb-4">🎫</div>
            <h3 className="font-bold text-lg mb-2">Enter Voucher Code</h3>
            <p className="text-sm text-gray-600">Enter your voucher code to redeem it</p>
          </div>
          
          <div className="mb-6">
            <Input
              placeholder="Enter code (e.g., GAM1234ABC)"
              value={enteredCode}
              onChange={(value) => setEnteredCode(value.toUpperCase())}
              style={{
                '--font-size': '16px',
                '--text-align': 'center',
                fontFamily: 'monospace'
              }}
              maxLength={10}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              block
              fill="outline"
              onClick={() => {
                if (!isValidatingCode) {
                  setShowCodeEntryPopup(false);
                  setEnteredCode('');
                }
              }}
              disabled={isValidatingCode}
            >
              Cancel
            </Button>
            <Button
              block
              color="primary"
              onClick={handleCodeEntry}
              loading={isValidatingCode}
              disabled={!enteredCode.trim()}
            >
              {isValidatingCode ? 'Validating...' : 'Redeem Code'}
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default VoucherPopup;
