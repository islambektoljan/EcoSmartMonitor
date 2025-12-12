
import React from 'react';
import { Zap, Droplets, Flame, Thermometer, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { SensorStatus, ResourceType } from '../types';
import { RESOURCE_RATES } from '../constants';

interface DashboardCardProps {
  data: SensorStatus;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ data }) => {
  // Determine icon and color based on resource type
  const getResourceConfig = () => {
    switch (data.type) {
      case ResourceType.ELECTRICITY: 
        return { icon: <Zap className="w-5 h-5 text-yellow-400" />, bg: 'bg-yellow-400/10', label: 'ELECTRICITY' };
      case ResourceType.WATER: 
        return { icon: <Droplets className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-400/10', label: 'WATER' };
      case ResourceType.GAS: 
        return { icon: <Flame className="w-5 h-5 text-orange-400" />, bg: 'bg-orange-400/10', label: 'GAS' };
      case ResourceType.HEAT: 
        return { icon: <Thermometer className="w-5 h-5 text-red-400" />, bg: 'bg-red-400/10', label: 'HEAT' };
      default: 
        return { icon: <Zap className="w-5 h-5" />, bg: 'bg-slate-700', label: 'UNKNOWN' };
    }
  };

  const config = getResourceConfig();

  // Determine trend icon and color
  const isTrendGood = data.trend === 'down';
  const trendColor = data.trend === 'stable' ? 'text-slate-400' : isTrendGood ? 'text-green-400' : 'text-red-400'; 
  
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up': return <ArrowUp className={`w-3 h-3 ${data.status === 'warning' || data.status === 'critical' ? 'text-orange-400' : 'text-slate-400'}`} />;
      case 'down': return <ArrowDown className="w-3 h-3 text-green-400" />;
      default: return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const trendTextClass = data.trend === 'down' ? 'text-green-400' : (data.status === 'warning' || data.status === 'critical') ? 'text-orange-400' : 'text-slate-400';

  // Progress Bar Colors
  const progressBarColor = data.status === 'critical' ? 'bg-red-500' 
                         : data.status === 'warning' ? 'bg-orange-500'
                         : 'bg-eco-500';

  // Cost Calculation (KZ Rates)
  const rate = RESOURCE_RATES[data.type];
  const cost = data.value * rate;
  const isPower = data.type === ResourceType.ELECTRICITY;

  return (
    <div className="relative p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-between h-full group hover:border-slate-700 transition-all duration-300">
      
      {/* Top Row: Icon and Trend */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${config.bg}`}>
          {config.icon}
        </div>
        
        {data.trend !== 'stable' && (
           <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800">
             {getTrendIcon()}
             <span className={`text-[10px] font-bold uppercase ${trendTextClass}`}>{data.trend}</span>
           </div>
        )}
      </div>
      
      {/* Middle: Label and Value with Cost */}
      <div className="mb-4 flex justify-between items-end">
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{config.label}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">{data.value.toFixed(2)}</h3>
            <span className="text-slate-500 text-xs font-medium">{data.unit}</span>
          </div>
        </div>
        
        {/* Cost Display */}
        <div className="text-right pb-0.5">
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Est. Cost</p>
           <p className="text-sm font-bold text-white">
             {cost.toFixed(2)} ₸
             {isPower && <span className="text-[10px] text-slate-400 font-medium">/h</span>}
           </p>
        </div>
      </div>

      {/* Bottom: Progress bar */}
      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBarColor}`}
          style={{ width: `${Math.min((data.value / (data.threshold * 1.2)) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default DashboardCard;
