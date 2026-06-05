import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { HeartPulse, Wind, Scale } from 'lucide-react';
import HeartRateECGChart from './HeartRateECGChart';

function BaseChart({ title, data, dataKey, color, fillOpacity = 0.2, domain = ['auto', 'auto'], customTicks, icon: Icon, currentValue, currentUnit, dotRadius = 2 }) {
  return (
    <div className="bg-[#1c2128] rounded-xl p-4 flex flex-col h-[280px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          {title}
        </h3>
        {currentValue && (
          <div className="text-sm font-bold" style={{ color }}>
            {currentValue} <span className="font-normal text-xs">{currentUnit}</span>
          </div>
        )}
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={fillOpacity} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#2d333b" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dx={-5}
              domain={domain}
              ticks={customTicks}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#111319', borderColor: '#2d333b', color: '#fff', fontSize: '12px' }}
            />
            <Area 
              type="linear" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2} 
              fill={`url(#color-${dataKey})`} 
              isAnimationActive={false} 
              activeDot={{ r: dotRadius + 2, fill: color, stroke: '#1c2128', strokeWidth: 2 }}
              dot={{ r: dotRadius, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ChartsSection({ graphData, weightGraphData, bpm, respiratory, weight }) {
  // Extract custom ticks for Y axis to match the image approximately
  const respTicks = [24, 25, 26, 27, 28, 29, 30, 31];
  const weightTicks = [3.25, 3.30, 3.35, 3.40, 3.45];

  return (
    <div className="grid grid-cols-3 gap-5">
      <HeartRateECGChart 
        title="Heart Rate (BPM)" 
        bpm={bpm} 
        color="#ef4444" 
        icon={HeartPulse} 
      />
      <BaseChart 
        title="Respiratory Rate Trend" 
        data={graphData} 
        dataKey="respiratory" 
        color="#3b82f6" 
        fillOpacity={0.15}
        domain={[0, 60]}
        customTicks={[0, 15, 30, 45, 60]}
        icon={Wind}
        currentValue={graphData[graphData.length - 1]?.respiratory || respiratory}
        currentUnit="rpm"
      />
      <BaseChart 
        title="Weight Trend" 
        data={weightGraphData} 
        dataKey="weight" 
        color="#3b82f6" 
        fillOpacity={0.2}
        domain={[2.80, 3.60]}
        customTicks={[2.80, 3.00, 3.20, 3.40, 3.60]}
        icon={Scale}
        currentValue={weight?.toFixed(2) || '3.45'}
        currentUnit="kg"
        dotRadius={5}
      />
    </div>
  );
}
