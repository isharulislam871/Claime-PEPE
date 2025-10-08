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
  StarOutline
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
      const shareText = `🎉 Join me on  ${botConfig?.username.replace(/_?bot$/, "")} and start earning rewards!\n\n💰 Complete simple tasks and earn points\n🎁 Get 1000 bonus pts when you join!\n\n👇 Click here to start:\n${referralLink}`;

      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`);
    } else if (navigator.share) {
      // Use native Web Share API
      navigator.share({
        title: `Join ${botConfig?.username.replace(/_?bot$/, "")} and Earn!`,
        text: `🎉 Join me on  ${botConfig?.username.replace(/_?bot$/, "")} and start earning rewards by completing simple tasks! Get 1000 bonus points when you join! 💰`,
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

        {/* Content */}
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="flex-1 overflow-auto px-4 py-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600">
                <div className="py-4">
                  {loading ? (
                    <>
                      <Skeleton.Title animated className="!mb-2 !mx-auto !w-8 !h-8 !rounded-full" />
                      <Skeleton.Title animated className="!mb-1 !w-16 !h-8" />
                      <Skeleton.Title animated className="!w-20 !h-4" />
                    </>
                  ) : (
                    <>
                      <UserOutline className="text-3xl mb-2 mx-auto text-black" />
                      <div className="text-2xl font-bold text-black">{user?.referralCount}</div>
                      <div className="text-sm opacity-90 text-black">Total Referrals</div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="text-center bg-gradient-to-br from-green-500 to-green-600">
                <div className="py-4">
                  {loading ? (
                    <>
                      <Skeleton.Title animated className="!mb-2 !mx-auto !w-8 !h-8 !rounded-full" />
                      <Skeleton.Title animated className="!mb-1 !w-16 !h-8" />
                      <Skeleton.Title animated className="!w-20 !h-4" />
                    </>
                  ) : (
                    <>
                      <StarOutline className="text-3xl mb-2 mx-auto text-black" />
                      <div className="text-2xl font-bold text-black">{user?.totalEarned}</div>
                      <div className="text-sm opacity-90 text-black">Points Earned</div>
                    </>
                  )}
                </div>
              </Card>
            </div>


            {/* How it Works */}
            <Card title="How it Works" className="mb-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
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
                      <div className="font-semibold text-gray-900">Earn Together</div>
                      <div className="text-sm text-gray-600">You both get 1000 bonus pts!</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Referral Link */}
            <Card title="Your Referral Link" className="mb-6">
              <div className="space-y-4">
                {loading ? (
                  <>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <Skeleton.Title animated className="!w-full !h-4" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Skeleton.Title animated className="!flex-1 !h-10 !rounded-lg" />
                        <Skeleton.Title animated className="!flex-1 !h-10 !rounded-lg" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <div className="text-sm text-gray-600 break-all">{referralLink}</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          block
                          color="default"
                          onClick={copyReferralLink}
                          className="flex-1"
                        >
                          <CopyFilled className="mr-2" />
                          Copy Link
                        </Button>

                        <Button
                          block
                          color="success"
                          onClick={shareReferralLink}
                          className="flex-1"
                        >
                          <ShareAltOutlined className="mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

          </div>
        </PullToRefresh>
      </div>
    </Popup>
  );
}
