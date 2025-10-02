'use client';

import React from 'react';
import {
  Popup
} from 'antd-mobile';
import {
  CloseOutline
} from 'antd-mobile-icons';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, selectCreatedWithdrawal, selectCreateWithdrawalSuccess } from '@/modules';
import { PendingWithdrawal, FailedWithdrawal } from './withdrawal';
import { selectShowResult } from '@/modules/private/swap';
import { selectFormData } from '@/modules/private/withdrawalForm';


export default function WithdrawalResultPopup({ onClose }: { onClose: () => void }) {

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };


  const formData = useSelector(selectFormData);

  const { currency, network, amount, address } = formData;


  const selectWithdrawal = useSelector(selectCreatedWithdrawal);

  const showResult = useSelector(selectShowResult);

  return (
    <Popup
      visible={showResult}
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
          <h2 className="text-xl font-bold text-gray-900">
            Withdrawal Status
          </h2>
          <CloseOutline
            className="text-gray-500 cursor-pointer text-xl"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">


          {
            selectWithdrawal?.status === 'pending' ? (
              <PendingWithdrawal />
            ) : (
              <FailedWithdrawal
                currency={currency}
                network={network}
                amount={amount}
                address={address}
                formatAddress={formatAddress}
                withdrawal={selectWithdrawal}
              />
            )
          }



        </div>


      </div>
    </Popup>
  );
}
