'use client';

import React from 'react';
import { Popup } from 'antd-mobile';

interface ConfirmationPopupProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false
}) => {
  return (
    <Popup
      visible={visible}
      onClose={onCancel}
      bodyStyle={{
        borderRadius: '12px',
        padding: '0'
      }}
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">{title}</h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ConfirmationPopup;
