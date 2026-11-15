import React from 'react';

export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-campus-lg border border-[#EEEEEC] p-5 shadow-subtle animate-pulse space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEEEEC]" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-[#EEEEEC] rounded w-1/3" />
              <div className="h-3 bg-[#F8F8F6] rounded w-1/4" />
            </div>
          </div>
          <div className="h-3 bg-[#EEEEEC] rounded w-full" />
          <div className="h-3 bg-[#EEEEEC] rounded w-4/5" />
        </div>
      ))}
    </div>
  );
};

