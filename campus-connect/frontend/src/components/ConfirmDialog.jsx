import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            isDestructive ? 'bg-red-50 text-red-600' : 'bg-[#EEEEEC] text-[#111111]'
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h4 className="text-lg font-bold text-[#111111] mb-2">{title}</h4>
        <p className="text-sm text-[#777777] mb-6">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#EEEEEC] text-[#111111] font-semibold text-sm hover:bg-[#EEEEEC] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              isDestructive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#111111] text-[#B7F34A] hover:bg-[#191919]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

