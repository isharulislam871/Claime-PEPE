'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, Skeleton, Image } from 'antd-mobile';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/modules/store';
import { 
  fetchPromotionsRequest,
  selectPromotions,
  selectPromotionsLoading,
  selectPromotionsError,
  Promotion
} from '@/modules/private/promotions';
import { openPopup } from '@/modules';

 



export default function PromotionSwiper() {
  const dispatch = useDispatch<AppDispatch>();
  const promotions = useSelector(selectPromotions);
  const promotionsLoading = useSelector(selectPromotionsLoading);
  const promotionsError = useSelector(selectPromotionsError);

  // Fetch promotions from Redux
  useEffect(() => {
    dispatch(fetchPromotionsRequest());
  }, [dispatch]);

  // Show error toast when there's an error
  useEffect(() => {
    if (promotionsError) {
      toast.error(promotionsError);
    }
  }, [promotionsError]);

  // Handle promotion action
  const handlePromotionAction = (promotion: Promotion) => {
    // Handle different action types based on promotion.actionType
    switch (promotion.actionType) {
      case 'navigate':
        // Handle navigation
        console.log('Navigate to:', promotion.actionData);
        break;
      case 'external':
        // Handle external link
        if (promotion.actionData?.url) {
          window.open(promotion.actionData.url, '_blank');
        }
        break;
      case 'popup':
         dispatch(openPopup(promotion.actionData.type));
        break;
      default:
        console.log('Custom action for promotion:', promotion.id);
    }
  };

  // Skeleton component for individual promotion items
  const PromotionSkeleton = () => (
    <div className="relative overflow-hidden rounded-xl bg-gray-200 mx-2 h-40">
      <div className="w-full h-full bg-gray-300 animate-pulse rounded-xl"></div>
      {/* Skeleton content overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="h-4 bg-gray-400 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-400 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="h-6 w-12 bg-gray-400 rounded-full animate-pulse ml-2"></div>
        </div>
        <div className="flex justify-between items-end">
          <div className="h-3 bg-gray-400 rounded animate-pulse w-1/3"></div>
          <div className="h-6 w-16 bg-gray-400 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      {promotionsLoading ? (
        // Show skeleton loading for multiple items
        <Swiper
          indicator={(total, current) => (
            <div className="flex justify-center mt-3 gap-1">
              {Array.from({ length: total }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === current ? 'bg-blue-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        >
          {/* Show 3 skeleton items while loading */}
          {Array.from({ length: 3 }).map((_, index) => (
            <Swiper.Item key={`skeleton-${index}`}>
              <PromotionSkeleton />
            </Swiper.Item>
          ))}
        </Swiper>
      ) : (
        <Swiper
          loop
          autoplay
          indicator={(total, current) => (
            <div className="flex justify-center mt-3 gap-1">
              {Array.from({ length: total }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === current ? 'bg-blue-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        >
          {promotions.map((promotion) => (
            <Swiper.Item key={promotion.id}>
              <div 
                className="relative overflow-hidden rounded-xl mx-2 cursor-pointer transform transition-transform duration-200 active:scale-95 h-40"
                onClick={() => handlePromotionAction(promotion)}
              >
                {/* Background Image */}
                <Image
                  src={promotion.image} 
                  alt={promotion.title}
                  className="w-full h-full object-cover rounded-xl"
                  style={{ height: '10rem', width: '100%' }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent rounded-xl" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 leading-tight">
                        {promotion.title}
                      </h3>
                      {promotion.description && (
                        <p className="text-sm text-gray-200 opacity-90 leading-tight">
                          {promotion.description}
                        </p>
                      )}
                    </div>
                    {promotion.badge && (
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0">
                        {promotion.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Bottom Section */}
                  <div className="flex justify-between items-end">
                    <div>
                      {promotion.subtitle && (
                        <p className="text-xs text-gray-300 mb-1">
                          {promotion.subtitle}
                        </p>
                      )}
                      {promotion.reward && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-sm font-semibold">
                            🎁 {promotion.reward}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* CTA Button */}
                    <div className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors duration-200 flex-shrink-0">
                      {promotion.ctaText || 'Claim Now'}
                    </div>
                  </div>
                </div>
                
                {/* Binance-style corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-xl" />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      )}
    </div>
  );
}

