'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Icons (you can replace these with your preferred icon library)
const DollarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
  </svg>
);

const ApiIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const GlobalIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
  </svg>
);

interface AdsSettingsProps {
  onSave?: (values: any) => void;
  loading?: boolean;
}

export default function AdsSettings({ onSave, loading = false }: AdsSettingsProps) {
  const [loadingState, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [monetagEnabled, setMonetagEnabled] = useState(false);
  const [gigapubEnabled, setGigapubEnabled] = useState(false);
  const [formData, setFormData] = useState({
    defaultAdsReward: 100,
    adsRewardMultiplier: 1.0,
    adsWatchLimit: 10,
    minWatchTime: 15,
    gigapubEnabled: false,
    gigapubPublisherId: '',
    monetagEnabled: false,
    monetagPublisherId: ''
  });

  // Fetch initial values from API
  useEffect(() => {
    const fetchAdsSettings = async () => {
      try {
        setInitialLoading(true);
        const response = await fetch('/api/admin/ads');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setFormData(result.data);
            setMonetagEnabled(result.data?.monetagEnabled || false);
            setGigapubEnabled(result.data?.gigapubEnabled || false);
          }
        }
      } catch (error) {
        console.error('Error fetching ads settings:', error);
        toast.error('Failed to load ads settings');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAdsSettings();
  }, []);

  const handleMonetagToggle = (checked: boolean) => {
    setMonetagEnabled(checked);
    setFormData(prev => ({ ...prev, monetagEnabled: checked }));
  };

  const handleGigaPubToggle = (checked: boolean) => {
    setGigapubEnabled(checked);
    setFormData(prev => ({ ...prev, gigapubEnabled: checked }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAdsSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Ads settings saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save ads settings');
      }
    } catch (error) {
      console.error('Error saving ads settings:', error);
      toast.error('Failed to save ads settings');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-gray-600">Loading ads settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSaveAdsSettings} className="w-full space-y-6">
        {/* Default Ads Reward Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <DollarIcon />
            <span className="text-lg font-semibold text-gray-900">Ads Reward Configuration</span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Ads Reward
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={formData.defaultAdsReward}
                    onChange={(e) => handleInputChange('defaultAdsReward', parseInt(e.target.value))}
                    placeholder="Enter reward amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">pts</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Amount of pts awarded for watching an advertisement</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward Multiplier
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    step={0.1}
                    value={formData.adsRewardMultiplier}
                    onChange={(e) => handleInputChange('adsRewardMultiplier', parseFloat(e.target.value))}
                    placeholder="Enter multiplier"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">x</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Multiplier applied to base reward for special events</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Watch Limit
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.adsWatchLimit}
                    onChange={(e) => handleInputChange('adsWatchLimit', parseInt(e.target.value))}
                    placeholder="Enter daily limit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">ads/day</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum number of ads a user can watch per day</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Watch Time
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={formData.minWatchTime}
                    onChange={(e) => handleInputChange('minWatchTime', parseInt(e.target.value))}
                    placeholder="Enter watch time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">seconds</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum time user must watch ad to receive reward</p>
              </div>
            </div>
          </div>
        </div>

        {/* GigaPub Ads Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ApiIcon />
              <span className="text-lg font-semibold text-gray-900">GigaPub Configuration</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={gigapubEnabled}
                onChange={(e) => handleGigaPubToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {gigapubEnabled ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher ID
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.gigapubPublisherId}
                    onChange={(e) => handleInputChange('gigapubPublisherId', e.target.value)}
                    placeholder="Enter GigaPub publisher ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={gigapubEnabled}
                  />
                  <p className="text-xs text-gray-500 mt-1">Your GigaPub publisher identifier</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-gray-500">
                Enable GigaPub to configure ad settings
              </span>
            </div>
          )}
        </div>

        {/* Monetag Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <GlobalIcon />
              <span className="text-lg font-semibold text-gray-900">Monetag Configuration</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={monetagEnabled}
                onChange={(e) => handleMonetagToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          {monetagEnabled ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher ID
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.monetagPublisherId}
                    onChange={(e) => handleInputChange('monetagPublisherId', e.target.value)}
                    placeholder="Enter publisher ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required={monetagEnabled}
                  />
                  <p className="text-xs text-gray-500 mt-1">Your Monetag publisher identifier</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-gray-500">
                Enable Monetag to configure ad settings
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingState || loading}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loadingState || loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span className="ml-2">Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}