'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Popup,
  List,
  Button,
  Empty,
  SpinLoading,
  Card,
  Space,
  PullToRefresh,
  Skeleton
} from 'antd-mobile';
import {
  CloseOutline,
  CheckOutline,
  GiftOutline,
  UserOutline,
  StarOutline,
  RedoOutline
} from 'antd-mobile-icons';

import { closePopup, createUserRequest, fetchBotConfigRequest, selectBotConfig, selectBotLoading, selectCurrentUser, selectIsInviteFriendsOpen, selectAuthLoading, fetchUserRequest } from '@/modules';
import { CopyFilled, ShareAltOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';


export default function InviteFriendsEarn() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const botConfig = useSelector(selectBotConfig);

  const AuthLoading = useSelector(selectAuthLoading);
  const BotLoading = useSelector(selectBotLoading);
  const loading = BotLoading || AuthLoading;
  const referralLink = `https://t.me/${botConfig?.username}?startapp=${user?.referralCode}`;
  const isOpen = useSelector(selectIsInviteFriendsOpen);
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBotConfigRequest());
    }
  }, [isOpen, dispatch]);

  const handleRefresh = async () => {
    dispatch(fetchUserRequest())
    dispatch(fetchBotConfigRequest());
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const shareReferralLink = () => {
    // Check if we're in Telegram WebApp
    if (window.Telegram?.WebApp) {
      // Use Telegram WebApp sharing
      const shareText = `🎉 Join me on  ${botConfig?.username.replace(/_?bot$/, "")} and start earning rewards!\n\n💰 Complete simple tasks and earn points\n💎 I earn 10% commission from your activities\n\n👇 Click here to start:\n${referralLink}`;

      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else if (navigator.share) {
      // Use native Web Share API
      navigator.share({
        title: `Join ${botConfig?.username.replace(/_?bot$/, "")} and Earn!`,
        text: `🎉 Join me on  ${botConfig?.username.replace(/_?bot$/, "")} and start earning rewards by completing simple tasks! I earn 10% commission from your activities. 💰💎`,
        url: referralLink
      });
    } else {
      // Fallback to copy
      copyReferralLink();
    }
  };

  const onClose = () => {
    dispatch(closePopup('isInviteFriendsEarn'))
  }

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '100vh', backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <GiftOutline className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Invite & Earn</h2>
                <p className="text-sm text-gray-500">Share and earn rewards together</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                fill='none'
                size='small'
                onClick={handleRefresh}
                className="!p-2 hover:bg-gray-100 rounded-full transition-colors"
                loading={loading}
              >
                <RedoOutline className="text-gray-600" />
              </Button>
              <Button
                fill='none'
                size='small'
                onClick={onClose}
                className="!p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseOutline className="text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600">
                <div className="py-3">
                  {loading ? (
                    <>
                      <Skeleton.Title animated className="!mb-2 !mx-auto !w-6 !h-6 !rounded-full" />
                      <Skeleton.Title animated className="!mb-1 !w-12 !h-6" />
                      <Skeleton.Title animated className="!w-16 !h-3" />
                    </>
                  ) : (
                    <>
                      <UserOutline className="text-2xl mb-1 mx-auto text-black" />
                      <div className="text-lg font-bold text-black">{user?.referralCount}</div>
                      <div className="text-xs opacity-90 text-black">Referrals</div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="text-center bg-gradient-to-br from-green-500 to-green-600">
                <div className="py-3">
                  {loading ? (
                    <>
                      <Skeleton.Title animated className="!mb-2 !mx-auto !w-6 !h-6 !rounded-full" />
                      <Skeleton.Title animated className="!mb-1 !w-12 !h-6" />
                      <Skeleton.Title animated className="!w-16 !h-3" />
                    </>
                  ) : (
                    <>
                      <StarOutline className="text-2xl mb-1 mx-auto text-black" />
                      <div className="text-lg font-bold text-black">{user?.referralEarnings || 0}</div>
                      <div className="text-xs opacity-90 text-black">Commission</div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="text-center bg-gradient-to-br from-purple-500 to-purple-600">
                <div className="py-3">
                  {loading ? (
                    <>
                      <Skeleton.Title animated className="!mb-2 !mx-auto !w-6 !h-6 !rounded-full" />
                      <Skeleton.Title animated className="!mb-1 !w-12 !h-6" />
                      <Skeleton.Title animated className="!w-16 !h-3" />
                    </>
                  ) : (
                    <>
                      <GiftOutline className="text-2xl mb-1 mx-auto text-black" />
                      <div className="text-lg font-bold text-black">10%</div>
                      <div className="text-xs opacity-90 text-black">Rate</div>
                    </>
                  )}
                </div>
              </Card>
            </div>


            {/* How it Works */}
            <Card title="How it Works" className="mb-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Skeleton.Title animated className="!w-6 !h-6 !rounded-full !flex-shrink-0 !mt-1" />
                      <div className="flex-1">
                        <Skeleton.Title animated className="!w-24 !h-5 !mb-2" />
                        <Skeleton.Title animated className="!w-32 !h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Share Your Link</div>
                      <div className="text-sm text-gray-600">Send your referral link to friends</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Friend Joins</div>
                      <div className="text-sm text-gray-600">They sign up using your link</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Start Earning</div>
                      <div className="text-sm text-gray-600">They start completing tasks and earning points</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-sm font-bold">4</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Earn 10% Commission</div>
                      <div className="text-sm text-gray-600">Get 10% of their ad earnings forever!</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Commission Info */}
            <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <StarOutline className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Lifetime Commission</h3>
                    <p className="text-sm text-gray-600">Earn 10% from every ad your referrals watch</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">10%</div>
                    <div className="text-sm text-gray-600">Commission Rate</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Example: Friend earns 100 pts → You get 10 pts
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Referral Link - Binance Style */}
            <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <GiftOutline className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Your Referral Link</h3>
                    <p className="text-sm text-gray-600">Share with friends to earn commissions</p>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
                      <Skeleton.Title animated className="!w-full !h-4" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton.Title animated className="!h-12 !rounded-xl" />
                      <Skeleton.Title animated className="!h-12 !rounded-xl" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Link Display */}
                    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-yellow-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full -mr-8 -mt-8 opacity-50"></div>
                      <div className="relative">
                        <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Referral Link</div>
                        <div className="text-sm font-mono text-gray-800 break-all bg-gray-50 p-2 rounded-lg">
                          {referralLink}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        block
                        onClick={copyReferralLink}
                        className="!h-12 !bg-gradient-to-r !from-gray-600 !to-gray-700 !border-0 !text-white !font-semibold !rounded-xl !shadow-lg hover:!from-gray-700 hover:!to-gray-800 !transition-all !duration-200"
                      >
                        <CopyFilled className="mr-2 text-lg" />
                        Copy Link
                      </Button>

                      <Button
                        block
                        onClick={shareReferralLink}
                        className="!h-12 !bg-gradient-to-r !from-yellow-400 !to-orange-500 !border-0 !text-white !font-semibold !rounded-xl !shadow-lg hover:!from-yellow-500 hover:!to-orange-600 !transition-all !duration-200"
                      >
                        <ShareAltOutlined className="mr-2 text-lg" />
                        Share Now
                      </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white p-3 rounded-xl border border-yellow-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Commission Rate</span>
                        <span className="font-bold text-yellow-600">10%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Total Earned</span>
                        <span className="font-bold text-green-600">{user?.referralEarnings || 0} pts</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

        </div>
      </div>
    </Popup>
  );
}
