'use client';

import { useState } from 'react';
import { Card } from 'antd-mobile';
import { UpOutline, DownOutline } from 'antd-mobile-icons';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules';
import CheckListPopup from './CheckListPopup';

interface PointSelectionProps {
  selectedAmount: string;
  onAmountChange: (amount: string) => void;
  title?: string;
  className?: string;
  minAmount?: number;
  maxAmount?: number;
}

export default function PointSelection({
  selectedAmount,
  onAmountChange,
  title = "Points Amount",
  className = "mb-4",
  minAmount = 1000,
  maxAmount
}: PointSelectionProps) {
  const [showAmountSheet, setShowAmountSheet] = useState(false);
  const user = useSelector(selectCurrentUser);
  
  const userBalance = user?.balance || 0;
  const effectiveMaxAmount = maxAmount || userBalance;

  const quickAmounts = [
    { 
      id: '1000', 
      title: '1K Points', 
      description: '1,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '5000', 
      title: '5K Points', 
      description: '5,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '10000', 
      title: '10K Points', 
      description: '10,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '25000', 
      title: '25K Points', 
      description: '25,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '50000', 
      title: '50K Points', 
      description: '50,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
    { 
      id: '100000', 
      title: '100K Points', 
      description: '100,000 points',
      category: 'Fixed Amounts',
      icon: '🎯'
    },
   
  ] ///.filter(amount => parseInt(amount.id) >= minAmount && parseInt(amount.id) <= effectiveMaxAmount);

  const handleAmountSelect = (selectedIds: string[]) => {
    if (selectedIds.length > 0) {
      onAmountChange(selectedIds[0]);
    }
    setShowAmountSheet(false);
  };

  const formatPoints = (points: number): string => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
    return points.toString();
  };


  return (
    <>
      <Card title={title} className={className}>
        <div className="space-y-3">
          {/* Quick Amount Selector */}
          <div
            onClick={() => setShowAmountSheet(true)}
            className="
              px-4 py-3
              border border-gray-300 rounded-md
              bg-white cursor-pointer
              flex justify-between items-center
              hover:bg-gray-50
            "
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">P</span>
              </div>
              <div>
                <div className="font-bold">
                  {selectedAmount ? `${formatPoints(parseInt(selectedAmount))} Points Selected` : 'Select Amount'}
                </div>
                <div className="text-xs text-gray-600">
                  {selectedAmount ? `${parseInt(selectedAmount).toLocaleString()} points` : 'Choose from preset amounts'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center text-gray-400">
              <UpOutline className="text-xs" />
              <DownOutline className="text-xs" />
            </div>
          </div>

        
        </div>
      </Card>

      {/* Point Amount CheckList */}
      <CheckListPopup
        visible={showAmountSheet}
        onClose={() => setShowAmountSheet(false)}
        title="Select Point Amount"
        items={quickAmounts}
        selectedItems={selectedAmount ? [selectedAmount] : []}
        onSelectionChange={handleAmountSelect}
        searchPlaceholder="Search amounts..."
        allowMultiple={false}
        showCategories={true}
      />
    </>
  );
}
