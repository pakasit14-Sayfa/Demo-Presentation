import React from 'react';

/**
 * VitalCardSmall
 * Minimal card matching the 4x2 grid shown in the image.
 */
export default function VitalCardSmall({ title, value, unit, range, colorClass, trend, isAlert, icon: Icon }) {
  return (
    <div className={`rounded-xl p-4 flex flex-col justify-between transition-colors duration-300 ${isAlert ? 'bg-red-900/40 border border-red-500 animate-pulse' : 'bg-[#1c2128] border border-transparent'}`}>
      <h3 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
        {title} {unit && <span className="text-gray-400 font-normal">({unit})</span>}
      </h3>
      
      <div className={`text-[32px] font-bold leading-none mt-2 mb-2 ${colorClass}`}>
        {value}
      </div>

      <div className="text-[10px] text-gray-400 font-medium flex gap-2 items-center">
        {range && <span>Range: {range}</span>}
        {trend && (
          <span className="text-green-500 flex items-center gap-0.5">
            Trend ▲ {trend}
          </span>
        )}
      </div>
    </div>
  );
}
