'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/modules/store';
import {
  fetchBotConfigRequest,
  updateBotConfigRequest,
  selectBotConfig,
  selectBotLoading,
  selectBotError,
  selectBotIsActive
} from '@/modules/private/bot';

const BotConfigManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select bot state from Redux store
  const botConfig = useSelector(selectBotConfig);
  const loading = useSelector(selectBotLoading);
  const error = useSelector(selectBotError);
  const isActive = useSelector(selectBotIsActive);

  // Fetch bot config on component mount
  useEffect(() => {
    dispatch(fetchBotConfigRequest());
  }, [dispatch]);

  const handleToggleBotStatus = () => {
    if (botConfig) {
      dispatch(updateBotConfigRequest({
        ...botConfig,
        isActive: !isActive
      }));
    }
  };

  const handleRefreshConfig = () => {
    dispatch(fetchBotConfigRequest());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading bot configuration...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-500 font-medium">Error:</div>
          <div className="ml-2 text-red-700">{error}</div>
        </div>
        <button
          onClick={handleRefreshConfig}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Bot Configuration</h2>
      
      {botConfig ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot Username
              </label>
              <div className="p-2 bg-gray-50 rounded border">
                {botConfig.botUsername || 'Not set'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className={`p-2 rounded border ${isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <div className="p-2 bg-gray-50 rounded border text-sm">
                {botConfig.webhookUrl || 'Not set'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot Token
              </label>
              <div className="p-2 bg-gray-50 rounded border text-sm">
                {botConfig.botToken ? '••••••••••••••••' : 'Not set'}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleToggleBotStatus}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isActive ? 'Deactivate Bot' : 'Activate Bot'}
            </button>
            
            <button
              onClick={handleRefreshConfig}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
            >
              Refresh Config
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No bot configuration found</p>
          <button
            onClick={handleRefreshConfig}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
          >
            Load Configuration
          </button>
        </div>
      )}
    </div>
  );
};

export default BotConfigManager;
