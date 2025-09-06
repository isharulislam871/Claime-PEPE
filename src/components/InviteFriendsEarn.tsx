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
  Toast
} from 'antd-mobile';
import { 
  CloseOutline,
   
  CheckOutline,
  GiftOutline,
  UserOutline,
  StarOutline
} from 'antd-mobile-icons';
 
import { selectCurrentUser } from '@/modules';
import { CopyFilled, ShareAltOutlined } from '@ant-design/icons';
import { getCurrentUser } from '@/lib/api';

interface InviteFriendsEarnProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  recentReferrals: Array<{
    id: string;
    username: string;
    joinedAt: string;
    earnings: number;
    status: 'active' | 'inactive';
  }>;
}

export default function InviteFriendsEarn({ isOpen, onClose }: InviteFriendsEarnProps) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    recentReferrals: []
  });

  const currentUser = getCurrentUser();
  const referralLink = `https://t.me/TaskUpBot?start=${currentUser.telegramId}`;

  useEffect(() => {
    if (isOpen) {
      fetchReferralStats();
    }
  }, [isOpen]);

  const fetchReferralStats = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setReferralStats({
          totalReferrals: user?.referralCount || 0,
          totalEarnings: user?.referralEarnings || 0,
          recentReferrals: [
            {
              id: '1',
              username: 'Alice Johnson',
              joinedAt: '2024-01-15',
              earnings: 500,
              status: 'active'
            },
            {
              id: '2', 
              username: 'Bob Smith',
              joinedAt: '2024-01-14',
              earnings: 250,
              status: 'active'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    Toast.show({
      content: 'Referral link copied!',
      icon: 'success'
    });
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join TaskUp and Earn!',
        text: 'Join me on TaskUp and start earning rewards by completing simple tasks!',
        url: referralLink
      });
    } else {
      copyReferralLink();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <div className="flex-1 overflow-auto px-4 py-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="py-4">
                <UserOutline className="text-3xl mb-2 mx-auto" />
                <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
                <div className="text-sm opacity-90">Total Referrals</div>
              </div>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="py-4">
                <StarOutline className="text-3xl mb-2 mx-auto" />
                <div className="text-2xl font-bold">{referralStats.totalEarnings}</div>
                <div className="text-sm opacity-90">Points Earned</div>
              </div>
            </Card>
          </div>

          {/* How it Works */}
          <Card title="How it Works" className="mb-6">
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
                  <div className="text-sm text-gray-600">You both get 500 bonus points!</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Referral Link */}
          <Card title="Your Referral Link" className="mb-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="text-sm text-gray-600 break-all">{referralLink}</div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  block 
                  color="primary" 
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
          </Card>

          {/* Recent Referrals */}
          <Card title="Recent Referrals" className="mb-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-8">
                <SpinLoading color='primary' />
                <p className="text-gray-500 mt-4">Loading referrals...</p>
              </div>
            ) : referralStats.recentReferrals.length === 0 ? (
              <Empty 
                description="No referrals yet"
                imageStyle={{ width: 80, height: 80 }}
              />
            ) : (
              <List>
                {referralStats.recentReferrals.map((referral) => (
                  <List.Item
                    key={referral.id}
                    prefix={
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserOutline className="text-blue-600" />
                      </div>
                    }
                    description={
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Joined {formatDate(referral.joinedAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-semibold">
                            +{referral.earnings} pts
                          </span>
                          {referral.status === 'active' && (
                            <CheckOutline className="text-green-500 text-sm" />
                          )}
                        </div>
                      </div>
                    }
                  >
                    <div className="font-semibold">{referral.username}</div>
                  </List.Item>
                ))}
              </List>
            )}
          </Card>
        </div>
      </div>
    </Popup>
  );
}
