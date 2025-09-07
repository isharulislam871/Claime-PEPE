'use client';

import { ActionSheet, Space } from 'antd-mobile';

interface ConfirmationActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  formData: {
    currency: string;
    network: string;
    address: string;
    amount: string;
  };
  getCurrentFee: () => number;
  getReceiveAmount: () => number;
}

export default function ConfirmationActionSheet({
  visible,
  onClose,
  onConfirm,
  isLoading,
  formData,
  getCurrentFee,
  getReceiveAmount
}: ConfirmationActionSheetProps) {
  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      actions={[
        {
          key: 'cancel',
          text: 'Cancel',
          onClick: onClose
        },
        {
          key: 'confirm',
          text: isLoading ? 'Processing...' : 'Confirm',
          disabled: isLoading,
          onClick: onConfirm
        }
      ]}
      extra={
        <div style={{ padding: '16px 20px 12px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '12px', 
            textAlign: 'center',
            color: '#1a1a1a'
          }}>
            Confirm Withdrawal
          </h3>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            padding: '12px',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Currency</span>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{formData.currency}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Network</span>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{formData.network}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Address</span>
              <span style={{ fontSize: '11px', fontWeight: '500', fontFamily: 'monospace' }}>
                {formData.address.slice(0, 8)}...{formData.address.slice(-6)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Amount</span>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{formData.amount} {formData.currency}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Network Fee</span>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{getCurrentFee()} {formData.currency}</span>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '8px 0',
            borderTop: '1px solid #eee'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>You'll Receive</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#F0B90B' }}>
              {getReceiveAmount().toFixed(4)} {formData.currency}
            </span>
          </div>
        </div>
      }
    />
  );
}
