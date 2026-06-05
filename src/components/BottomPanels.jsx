import React, { useState } from 'react';
import { Loader, Cloud, Fan, Server, Leaf, Bell, CheckCircle2, AlertTriangle, Info, Brain, Cpu, TrendingUp, RefreshCw, X } from 'lucide-react';

export default function BottomPanels({ 
  alerts = [], 
  envStatus = { oxygen: 21.0, co2: 38, airflow: 25, isAdjustingO2: false, isFlushingCO2: false }, 
  aiInterventions = { monitoring: 'Active', digitalTwin: 'Active', predictive: 'Active', closedLoop: 'Active', isActive: false } 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Panel 1: Environmental Monitoring */}
      <div className="bg-[#1c2128] rounded-xl p-5 flex flex-col">
        <h3 className="text-sm font-bold text-white mb-4">Environmental Monitoring</h3>
        <div className="flex gap-2 h-full">
          {[
            { label: 'Air Quality', icon: <Loader className="w-7 h-7 text-green-500 mb-2" />, value: 'Good', color: 'text-green-500', subtext: 'AQI 18' },
            { label: 'Oxygen Control', icon: <div className="text-blue-400 text-[26px] font-semibold mb-1 leading-none tracking-tighter">O<span className="text-[14px]">₂</span></div>, value: `${envStatus.oxygen}%`, color: envStatus.isAdjustingO2 ? 'text-[#f97316] animate-pulse' : 'text-green-500', subtext: 'Set: 21%' },
            { label: 'CO₂ Level', icon: <Cloud className="w-7 h-7 text-blue-400 mb-2" />, value: `${envStatus.co2} mmHg`, color: envStatus.isFlushingCO2 ? 'text-[#f97316] animate-pulse' : 'text-green-500', subtext: 'Normal' },
            { label: 'Airflow', icon: <Fan className="w-7 h-7 text-blue-400 mb-2" />, value: `${envStatus.airflow} L/min`, color: (envStatus.isAdjustingO2 || envStatus.isFlushingCO2) ? 'text-[#3b82f6] animate-pulse' : 'text-green-500', subtext: 'Optimal' },
            { label: 'Filter Status', icon: <Server className="w-7 h-7 text-gray-400 mb-2" />, value: '98%', color: 'text-green-500', subtext: 'Life Remaining' },
          ].map((item, idx) => (
            <div key={idx} className="flex-1 bg-[#111319]/50 rounded-lg flex flex-col items-center justify-between p-3 border border-[#2d333b]/50 text-center">
              <span className="text-[10px] text-gray-300 font-semibold mb-2">{item.label}</span>
              {item.icon}
              <div className="flex flex-col items-center mt-1">
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                <span className="text-[9px] text-gray-400 mt-0.5">{item.subtext}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 2: Alerts */}
      <div className="bg-[#1c2128] rounded-xl p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-300" /> Alerts
          </h3>
          <button onClick={() => setIsModalOpen(true)} className="text-[11px] text-blue-400 font-medium hover:underline focus:outline-none">View All</button>
        </div>
        <div className="flex flex-col gap-2 h-full overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <div className="flex justify-between items-center text-xs font-medium border-b border-gray-700/50 pb-2">
              <span className="text-green-500">Stable - No active alerts</span>
              <span className="text-gray-400">Now</span>
            </div>
          ) : (
            alerts.slice(0, 3).map((alert) => {
              let Icon = CheckCircle2;
              let iconColor = 'text-green-500';
              if (alert.type === 'warning') { Icon = AlertTriangle; iconColor = 'text-red-500'; }
              if (alert.type === 'info') { Icon = Info; iconColor = 'text-blue-400'; }
              if (alert.type === 'success') { Icon = CheckCircle2; iconColor = 'text-green-500'; }
              
              return (
                <div key={alert.id} className="bg-[#111319]/80 rounded-lg p-3 flex justify-between items-start border border-[#2d333b]/30">
                  <div className="flex gap-3 items-start">
                    <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-200">{alert.title}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{alert.message}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap ml-2 mt-0.5">{alert.time}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Panel 3: Smart Recovery Intelligence */}
      <div className="bg-[#1c2128] rounded-xl p-5 flex flex-col">
        <h3 className="text-sm font-bold text-white mb-4">Smart Recovery Intelligence</h3>
        <div className="grid grid-cols-2 gap-3 h-full">
          {[
            { label: 'AI Monitoring', status: aiInterventions.monitoring, color: 'text-green-500', icon: Brain },
            { label: 'Digital Twin', status: aiInterventions.digitalTwin, color: 'text-green-500', icon: Cpu },
            { label: 'Predictive Control', status: aiInterventions.predictive, color: 'text-green-500', icon: TrendingUp },
            { label: 'Closed-loop Control', status: aiInterventions.closedLoop, color: aiInterventions.isActive ? 'text-[#f97316] animate-pulse' : 'text-green-500', icon: RefreshCw },
          ].map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div key={idx} className="bg-[#111319]/50 rounded-lg p-3 border border-[#2d333b]/50 flex flex-col justify-center relative overflow-hidden">
                <ItemIcon className="absolute right-2 top-2 w-8 h-8 text-white/5" />
                <span className="text-[11px] text-white font-bold mb-1 z-10">{item.label}</span>
                <span className={`text-[10px] font-semibold z-10 ${item.color}`}>{item.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts History Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1c2128] border border-[#2d333b] rounded-xl w-[500px] max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-[#2d333b]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" /> Alerts History
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
              {alerts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No alerts recorded yet.</div>
              ) : (
                alerts.map((alert) => {
                  let Icon = CheckCircle2;
                  let iconColor = 'text-green-500';
                  if (alert.type === 'warning') { Icon = AlertTriangle; iconColor = 'text-red-500'; }
                  if (alert.type === 'info') { Icon = Info; iconColor = 'text-blue-400'; }
                  if (alert.type === 'success') { Icon = CheckCircle2; iconColor = 'text-green-500'; }
                  
                  return (
                    <div key={alert.id} className="bg-[#111319] rounded-lg p-3 flex justify-between items-start border border-[#2d333b]">
                      <div className="flex gap-3 items-start">
                        <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-200">{alert.title}</span>
                          <span className="text-xs text-gray-400 mt-0.5">{alert.message}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-2 mt-0.5">{alert.time}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
