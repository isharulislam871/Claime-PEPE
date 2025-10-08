'use client';

import React, { useState } from 'react';
import { Popup, Skeleton } from 'antd-mobile';
import { QrcodeOutlined, CopyOutlined, CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, QRCode, message } from 'antd';
import { useSelector } from 'react-redux';
import { selectBotConfig } from '@/modules';

interface TelegramOpenPopupProps {
  visible: boolean;
}

export default function TelegramOpenPopup({ visible }: TelegramOpenPopupProps) {
  const [copied, setCopied] = useState(false);
  const botConfig = useSelector(selectBotConfig);
  const telegramBotUrl = `https://t.me/${botConfig?.username}?start`;
  const isLoading = !botConfig?.username;

  const handleOpenTelegram = () => {
    if (!isLoading) {
      window.open(telegramBotUrl, '_blank');
    }
  };

  const handleCopyLink = async () => {
    if (!isLoading) {
      try {
        await navigator.clipboard.writeText(telegramBotUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy link');
      }
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="bg-white min-h-screen w-full">
        {/* Telegram-style Header */}
        <div className="bg-[#0088cc] text-white px-4 py-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-1.41-1.41L10.17 14H4v-4h6.17l-1.58-1.59L10 7l5 5-5 5z"/>
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-1">Open in Telegram</h2>
            <p className="text-white/80 text-sm">
              For the best experience
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* QR Code Section - Telegram style */}
          <div className="bg-[#f7f7f7] rounded-lg p-6 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <QrcodeOutlined className="text-xl text-[#0088cc]" />
                {isLoading ? (
                  <Skeleton.Title animated style={{ width: '120px', height: '20px' }} />
                ) : (
                  <span className="text-[#222] font-medium">Scan QR Code</span>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
                {isLoading ? (
                  <Skeleton animated style={{ width: '180px', height: '180px' }} />
                ) : (
                  <QRCode 
                    value={telegramBotUrl} 
                    size={180}
                    errorLevel="H"
                    color="#0088cc"
                    bgColor="#ffffff"
                    bordered={false}
                  />
                )}
              </div>
              
              {isLoading ? (
                <Skeleton.Paragraph animated lineCount={1} style={{ marginTop: '12px' }} />
              ) : (
                <p className="text-[#707579] text-sm mt-3">
                  Open Telegram and scan this code
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons - Telegram style */}
          <div className="space-y-3 mb-6">
            {isLoading ? (
              <>
                <Skeleton animated style={{ width: '100%', height: '48px', borderRadius: '8px' }} />
                <Skeleton animated style={{ width: '100%', height: '48px', borderRadius: '8px' }} />
              </>
            ) : (
              <>
                <button
                  onClick={handleOpenTelegram}
                  className="w-full bg-[#0088cc] text-white py-3 px-4 rounded-lg font-medium text-base flex items-center justify-center gap-2 hover:bg-[#0077b3] transition-colors active:bg-[#006699]"
                >
                  Open Telegram
                  <ArrowRightOutlined className="text-sm" />
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-base flex items-center justify-center gap-2 transition-all ${
                    copied 
                      ? 'bg-[#4caf50] text-white' 
                      : 'bg-[#f1f3f4] text-[#0088cc] hover:bg-[#e8eaed] active:bg-[#dadce0]'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckOutlined className="text-sm" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyOutlined className="text-sm" />
                      Copy Link
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Instructions - Telegram style */}
          <div className="bg-[#f7f7f7] rounded-lg p-4 mb-4">
            {isLoading ? (
              <>
                <Skeleton.Title animated style={{ width: '100px', height: '16px', marginBottom: '12px' }} />
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Skeleton animated style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                      <Skeleton.Paragraph animated lineCount={1} style={{ flex: 1 }} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h4 className="text-[#222] font-medium mb-3 text-sm">How to open:</h4>
                <div className="space-y-3">
                  {[
                    'Open the Telegram app',
                    'Search for our bot or scan the QR code',
                    'Tap "Start" to begin using the app'
                  ].map((text, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-[#0088cc] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-[#222] text-sm leading-relaxed">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Note - Telegram style */}
          <div className="text-center">
            {isLoading ? (
              <Skeleton.Paragraph animated lineCount={2} style={{ textAlign: 'center' }} />
            ) : (
              <p className="text-[#707579] text-xs leading-relaxed">
                Some features may not work properly<br />
                when accessed outside of Telegram
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
