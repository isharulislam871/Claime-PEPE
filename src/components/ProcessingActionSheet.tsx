'use client';

import { ActionSheet } from 'antd-mobile';

interface ProcessingActionSheetProps {
  visible: boolean;
  processingStep: number;
  withdrawalSuccess: boolean;
  withdrawalFailed: boolean;
  errorMessage?: string;
  onClose: () => void;
  formData: {
    amount: string;
    currency: string;
    network: string;
  };
}

export default function ProcessingActionSheet({
  visible,
  processingStep,
  withdrawalSuccess,
  withdrawalFailed,
  errorMessage,
  onClose,
  formData
}: ProcessingActionSheetProps) {
  return (
    <ActionSheet
      visible={visible}
      onClose={() => {}}
      closeOnAction={false}
      closeOnMaskClick={false}
      actions={[]}
      extra={
        <div style={{ padding: '32px 24px', textAlign: 'center', minHeight: '300px' }}>
          {processingStep === 1 && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>
                Validating Transaction
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Please wait while we validate your withdrawal request...
              </p>
            </>
          )}
          
          {processingStep === 2 && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>
                Processing Withdrawal
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Your withdrawal is being processed. This may take a few moments...
              </p>
            </>
          )}
          
          {processingStep === 3 && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>
                Confirming on Blockchain
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Broadcasting transaction to the {formData.network} network...
              </p>
            </>
          )}
          
          {processingStep === 4 && withdrawalSuccess && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: '#10B981', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <span style={{ color: 'white', fontSize: '32px' }}>✓</span>
                </div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#10B981' }}>
                Withdrawal Successful!
              </h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                Your {formData.amount} {formData.currency} has been sent successfully.
              </p>
              <div style={{ 
                backgroundColor: '#F3F4F6', 
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666'
              }}>
                <div>Transaction ID: 0x{Math.random().toString(16).substr(2, 40)}</div>
                <div style={{ marginTop: '4px' }}>Network: {formData.network}</div>
              </div>
            </>
          )}

          {processingStep === 4 && withdrawalFailed && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: '#EF4444', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <span style={{ color: 'white', fontSize: '32px' }}>✗</span>
                </div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#EF4444' }}>
                Withdrawal Failed
              </h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                {errorMessage || 'Your withdrawal could not be processed. Please try again.'}
              </p>
              <div style={{ 
                backgroundColor: '#FEF2F2', 
                border: '1px solid #FECACA',
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '12px',
                color: '#991B1B',
                marginBottom: '24px'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>Common reasons:</div>
                <div>• Insufficient balance</div>
                <div>• Invalid wallet address</div>
                <div>• Network congestion</div>
                <div>• Minimum withdrawal not met</div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </>
          )}
        </div>
      }
    />
  );
}
