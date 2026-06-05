import React from 'react';
import { HeartPulse, Wind, Thermometer, Droplet, Cloud, Waves, Scale, Activity } from 'lucide-react';
import VitalCardSmall from './VitalCardSmall';

export default function VitalGrid({ bpm, respiratory, bodyTemp, weight, hrChange, co2, humidity, spO2, anomalies }) {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
      {/* Row 1 */}
      <VitalCardSmall title="Heart Rate" unit="BPM" value={bpm} range="80 - 180" colorClass="text-[#ef4444]" isAlert={anomalies?.bpm} icon={HeartPulse} />
      <VitalCardSmall title="Respiratory Rate" value={respiratory} range="15 - 40" colorClass="text-[#3b82f6]" isAlert={anomalies?.respiratory} icon={Wind} />
      <VitalCardSmall title="Temperature" unit="°F" value={bodyTemp} range="100.0 - 102.5" colorClass="text-[#f97316]" isAlert={anomalies?.bodyTemp} icon={Thermometer} />
      <VitalCardSmall title="SpO₂" unit="%" value={spO2 || 97} range="95 - 100" colorClass="text-[#06b6d4]" isAlert={anomalies?.spO2} icon={Droplet} />

      {/* Row 2 */}
      <VitalCardSmall title="CO₂" unit="ppm" value={co2} range="300 - 500" colorClass="text-white" isAlert={anomalies?.co2} icon={Cloud} />
      <VitalCardSmall title="Humidity" unit="%" value={humidity || 50} range="40 - 60" colorClass="text-[#3b82f6]" icon={Waves} />
      <VitalCardSmall title="Weight" unit="kg" value={weight} trend="0.02" colorClass="text-white" icon={Scale} />
      <VitalCardSmall 
        title="Rate of Heart Change" 
        value={`${hrChange > 0 ? '+' : ''}${hrChange}`} 
        unit="BPM/min" 
        colorClass="text-[#ef4444]" 
        icon={Activity}
      />
    </div>
  );
}
