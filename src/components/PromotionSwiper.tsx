'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, Skeleton } from 'antd-mobile';
import { toast } from 'react-toastify';
 

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  color: string;
  action: () => void;
}

 



export default function PromotionSwiper( ) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);

  // Fetch promotions from API
    useEffect(() => {
      const fetchPromotions = async () => {
        try {
          setPromotionsLoading(true);
          const response = await fetch('/api/promotions');
          const data = await response.json();
          
          if (data.success) {
            // Map API promotions to include action functions
            const mappedPromotions = data.promotions.map((promo: any) => ({
              ...promo
             
            }));
            setPromotions(mappedPromotions);
          } else {
            toast.error('Failed to load promotions');
          }
        } catch (error) {
          console.error('Error fetching promotions:', error);
          toast.error('Failed to load promotions');
        } finally {
          setPromotionsLoading(false);
        }
      };
  
      fetchPromotions();
    }, []);

  // Skeleton component for individual promotion items
  const PromotionSkeleton = () => (
    <div className="relative overflow-hidden rounded-xl bg-gray-200 p-6 mx-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton.Title className="mb-2" />
          <Skeleton.Title className="mb-1" />
          <Skeleton.Paragraph lineCount={2} className="mb-3" />
          <div className="inline-flex items-center px-4 py-2 bg-gray-300 rounded-full">
            <Skeleton.Title className="w-20" />
          </div>
        </div>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-300 rounded-full"></div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-200 rounded-full"></div>
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
                className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${promotion.color} p-6 mx-2 cursor-pointer transform transition-transform duration-200 active:scale-95`}
                onClick={promotion.action}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-4xl mb-2">{promotion.image}</div>
                    <h3 className="text-white font-bold text-lg mb-1">{promotion.title}</h3>
                    <p className="text-white/90 text-sm mb-3 leading-relaxed">{promotion.description}</p>
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                      <span className="text-white font-semibold text-sm">{promotion.buttonText}</span>
                      <span className="ml-2 text-white">→</span>
                    </div>
                  </div>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export type { Promotion };
