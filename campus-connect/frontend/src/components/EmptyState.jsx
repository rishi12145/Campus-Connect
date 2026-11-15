import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There are currently no records available in this section.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-campus-lg border border-dashed border-[#D8D8D5] my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#F8F8F6] border border-[#EEEEEC] flex items-center justify-center text-[#111111] mb-4">
        <Icon className="w-7 h-7 text-[#777777]" />
      </div>
      <h3 className="text-base font-bold text-[#111111] mb-1">{title}</h3>
      <p className="text-sm text-[#777777] max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-lime text-xs px-4 py-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

