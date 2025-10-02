'use client';

import { useEffect } from 'react';
import { Card } from 'antd-mobile';
import { UpOutline, DownOutline } from 'antd-mobile-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules';
import { AppDispatch } from '@/modules/store';
import {
  selectShowAmountSheet,
  selectQuickAmounts,
  selectFilteredQuickAmounts,
  setShowAmountSheet
} from '../modules/private/pointSelection';
import CheckListPopup from './CheckListPopup';

interface PointSelectionProps {
  selectedAmount: string;
  onAmountChange: (amount: string) => void;
  title?: string;
  className?: string;
  minAmount?: number;
  maxAmount?: number;
  defaultAmount?: string;
}

export default function PointSelection({
  selectedAmount,
  onAmountChange,
  title = "Points Amount",
  className = "mb-4",
  minAmount = 25000,
  maxAmount,
  defaultAmount
}: PointSelectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);
  
  // Redux state selectors
  const showAmountSheet = useSelector(selectShowAmountSheet);
  const quickAmounts = useSelector(selectFilteredQuickAmounts(minAmount, maxAmount));
 
   
  // Set default amount if none is selected
  useEffect(() => {
    if (!selectedAmount && defaultAmount) {
      onAmountChange(defaultAmount);
    }
  }, [selectedAmount, defaultAmount, onAmountChange]);

  // Quick amounts are now managed by Redux

  const handleAmountSelect = (selectedIds: string[]) => {
    if (selectedIds.length > 0) {
      onAmountChange(selectedIds[0]);
    }
    dispatch(setShowAmountSheet(false));
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
            onClick={() => dispatch(setShowAmountSheet(true))}
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
        onClose={() => dispatch(setShowAmountSheet(false))}
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
