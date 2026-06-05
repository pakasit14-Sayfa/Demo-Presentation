import React from 'react';
import { Wifi, Cloud, Radio, BatteryMedium } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="bg-[#1c2128] border-t border-[#2d333b] py-2 px-6 flex justify-between items-center text-[10px] text-gray-400 font-medium shrink-0">
      {/* Left side info */}
      <div className="flex items-center gap-4">
        <span>System Status: <span className="text-green-500 font-bold">Online</span></span>
        <span className="w-px h-3 bg-gray-700" />
        <span>Uptime: 14d 6h 22m</span>
      </div>

      {/* Right side icons/signals */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5" title="Sensor Connection">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span>Sensors: Active</span>
        </div>
        
        <div className="flex items-center gap-1.5" title="Cloud Sync">
          <Cloud className="w-3.5 h-3.5 text-cyan-400" />
          <span>Synced</span>
        </div>
        
        <div className="flex items-center gap-1.5" title="WiFi Signal">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strong (92%)</span>
        </div>

        <div className="flex items-center gap-1.5" title="Battery Level">
          <BatteryMedium className="w-3.5 h-3.5 text-green-500" />
          <span>100% AC Power</span>
        </div>
      </div>
    </div>
  );
}
