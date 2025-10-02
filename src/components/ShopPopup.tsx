'use client';

import React, { useState } from 'react';
import { Popup, Button, Card, Badge, Tabs, SearchBar, Grid } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { ShoppingOutlined, GiftOutlined, CrownOutlined, StarOutlined, FireOutlined, ThunderboltOutlined, HeartOutlined  } from '@ant-design/icons';
import { closePopup, selectIsShopPopupVisible } from '@/modules';
import { useDispatch, useSelector } from 'react-redux';
 

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  icon: React.ReactNode;
  category: 'boosters' | 'premium' | 'cosmetics' | 'special';
  popular?: boolean;
  limited?: boolean;
  discount?: number;
}

export default function ShopPopup( ) {
  const [activeTab, setActiveTab] = useState('boosters');
  const [searchValue, setSearchValue] = useState('');

  const shopItems: ShopItem[] = [
    // Boosters
    {
      id: 'double-points',
      name: '2x Points Booster',
      description: 'Double your points for 1 hour',
      price: 500,
      icon: <ThunderboltOutlined className="text-yellow-500" />,
      category: 'boosters',
      popular: true
    },
    {
      id: 'task-multiplier',
      name: 'Task Multiplier',
      description: 'Get 3x rewards from tasks for 30 minutes',
      price: 750,
      icon: <FireOutlined className="text-red-500" />,
      category: 'boosters'
    },
    {
      id: 'ad-skip',
      name: 'Ad Skip Pack',
      description: 'Skip 10 ads and get instant rewards',
      price: 300,
      icon: <StarOutlined className="text-blue-500" />,
      category: 'boosters'
    },
    
    // Premium Features
    {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      description: 'Unlock premium features for 30 days',
      price: 2500,
      originalPrice: 3000,
      discount: 17,
      icon: <CrownOutlined className="text-purple-500" />,
      category: 'premium',
      popular: true
    },
    {
      id: 'vip-status',
      name: 'VIP Status',
      description: 'Exclusive VIP benefits and priority support',
      price: 5000,
      icon: <HeartOutlined className="text-pink-500" /> ,//<DiamondOutlined className="text-cyan-500" />,
      category: 'premium'
    },
    { 
      id: 'auto-checkin',
      name: 'Auto Check-in',
      description: 'Automatic daily check-ins for 7 days',
      price: 1200,
      icon: <HeartOutlined className="text-pink-500" />,
      category: 'premium'
    },

    // Cosmetics
    {
      id: 'golden-badge',
      name: 'Golden Badge',
      description: 'Show off with a golden profile badge',
      price: 800,
      icon: <StarOutlined className="text-yellow-600" />,
      category: 'cosmetics'
    },
    {
      id: 'rainbow-theme',
      name: 'Rainbow Theme',
      description: 'Colorful rainbow app theme',
      price: 600,
      icon: <HeartOutlined className="text-pink-400" />,
      category: 'cosmetics'
    },

    // Special Offers
    {
      id: 'starter-pack',
      name: 'Starter Pack',
      description: 'Perfect bundle for new users',
      price: 999,
      originalPrice: 1500,
      discount: 33,
      icon: <GiftOutlined className="text-green-500" />,
      category: 'special',
      limited: true,
      popular: true
    },
    {
      id: 'mega-booster',
      name: 'Mega Booster Pack',
      description: '5x points for 2 hours + extras',
      price: 1800,
      originalPrice: 2200,
      discount: 18,
      icon: <FireOutlined className="text-orange-500" />,
      category: 'special',
      limited: true
    }
  ];

  const userPoints = 8750;

  const filteredItems = shopItems.filter(item => 
    activeTab === 'all' || item.category === activeTab
  ).filter(item =>
    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handlePurchase = (item: ShopItem) => {
    if (userPoints >= item.price) {
      // Handle purchase logic here
      console.log(`Purchasing ${item.name} for ${item.price} points`);
    }
  };

  const renderShopItem = (item: ShopItem) => (
    <Card key={item.id} className="mb-3 relative">
      {item.popular && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge content="Popular" style={{ backgroundColor: '#FF6B35' }} />
        </div>
      )}
      {item.limited && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge content="Limited" style={{ backgroundColor: '#8B5CF6' }} />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              {item.discount && (
                <Badge 
                  content={`-${item.discount}%`} 
                  style={{ backgroundColor: '#10B981', marginLeft: '8px' }} 
                />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <div className="flex items-center">
              <span className="text-lg font-bold text-purple-600">{item.price}</span>
              <span className="text-sm text-gray-500 ml-1">points</span>
              {item.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  {item.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="ml-3">
          <Button
            size="small"
            onClick={() => handlePurchase(item)}
            disabled={userPoints < item.price}
            style={{
              backgroundColor: userPoints >= item.price ? '#8B5CF6' : '#D1D5DB',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            {userPoints >= item.price ? 'Buy' : 'Not enough'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const tabItems = [
    { key: 'boosters', title: 'Boosters' },
    { key: 'premium', title: 'Premium' },
    { key: 'cosmetics', title: 'Cosmetics' },
    { key: 'special', title: 'Special' }
  ];

  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(closePopup('isShopPopupVisible'))
  };
  const isOpen = useSelector(selectIsShopPopupVisible);
  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      bodyStyle={{
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#f8f9fa',
        overflow: 'auto'
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <ShoppingOutlined className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Shop</h2>
              <p className="text-sm text-gray-500">Spend your points on amazing items</p>
            </div>
          </div>
          <Button
            fill="none"
            size="small"
            onClick={onClose}
            style={{ padding: '4px' }}
          >
            <CloseOutline fontSize={20} />
          </Button>
        </div>

        {/* Points Balance */}
        <Card className="mb-4">
          <div className="text-center py-3">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {userPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Available Points</div>
          </div>
        </Card>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            placeholder="Search items..."
            value={searchValue}
            onChange={setSearchValue}
            style={{ backgroundColor: 'white' }}
          />
        </div>

        {/* Featured Items */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <FireOutlined className="text-orange-500 mr-2" />
            Featured Items
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {shopItems.filter(item => item.popular).slice(0, 2).map(item => (
              <Card key={item.id} className="text-center p-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-gray-800 mb-1">{item.name}</div>
                <div className="text-xs text-gray-600 mb-2">{item.description}</div>
                <div className="text-purple-600 font-bold">{item.price} pts</div>
                <Button
                  size="mini"
                  className="mt-2"
                  disabled={userPoints < item.price}
                  style={{
                    backgroundColor: userPoints >= item.price ? '#8B5CF6' : '#D1D5DB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Buy
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {tabItems.map(tab => (
            <Tabs.Tab title={tab.title} key={tab.key}>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800 capitalize">{tab.title} Items</h3>
                  <Badge 
                    content={filteredItems.filter(item => item.category === tab.key).length} 
                    style={{ backgroundColor: '#8B5CF6' }} 
                  />
                </div>
                
                {filteredItems.filter(item => item.category === tab.key).map(renderShopItem)}
                
                {filteredItems.filter(item => item.category === tab.key).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingOutlined className="text-4xl mb-2" />
                    <div>No items found</div>
                  </div>
                )}
              </div>
            </Tabs.Tab>
          ))}
        </Tabs>
      </div>
    </Popup>
  );
}
