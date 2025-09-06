'use client';

import React, { useState } from 'react';
import { 
  Popup,
  List,
  Empty,
  PullToRefresh
} from 'antd-mobile';
import { 
  CloseOutline,
  EyeOutline
} from 'antd-mobile-icons';
import { timeAgo } from '@/lib/timeAgo';
import { useSelector, useDispatch } from 'react-redux';
import { selectActivities, fetchActivitiesRequest } from '@/modules';

interface AdHistoryPopupProps {
  visible: boolean;
  onClose: () => void;
 
}

export default function AdHistoryPopup({ visible, onClose  }: AdHistoryPopupProps) {
  const dispatch = useDispatch();
  const activities = useSelector(selectActivities);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchActivitiesRequest({ type: 'ad_view', limit: 50 }));
    // Simulate network delay for better UX
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        height: '100vh',
        borderRadius: '0px',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Ad History</h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <PullToRefresh
            onRefresh={handleRefresh}
          >
            <div className="p-4">
              {activities.length > 0 ? (
                <List>
                  {activities.map((_data, index) => (
                    <List.Item
                      key={index}
                      prefix={
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <EyeOutline className="text-green-600" />
                        </div>
                      }
                      extra={
                        <div className="text-right">
                          <div className="text-green-600 font-semibold">+{_data.reward} pts</div>
                          <div className="text-xs text-gray-500">{timeAgo(_data.createdAt)}</div>
                        </div>
                      }
                    >
                      <div>
                        <div className="font-semibold">Video Ad Watched</div>
                        <div className="text-sm text-gray-600">
                          Earned {_data.reward} points for watching advertisement
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(_data.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </List.Item>
                  ))}
                </List>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Empty description="No ad history found" />
                  <p className="text-gray-500 text-sm mt-2">
                    Start watching ads to earn points and build your history
                  </p>
                </div>
              )}
            </div>
          </PullToRefresh>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Total ads watched: {activities.length}</span>
          </div>
        </div>
      </div>
    </Popup>
  );
}
