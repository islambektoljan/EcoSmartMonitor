
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChartDataPoint, TimeRange, ResourceType } from '../types';
import { Zap, Droplets, Flame, Thermometer } from 'lucide-react';

interface EnergyChartProps {
  data: ChartDataPoint[];
  timeRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  activeResource: ResourceType;
  onResourceChange: (resource: ResourceType) => void;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ 
  data, 
  timeRange, 
  onRangeChange,
  activeResource,
  onResourceChange
}) => {

  // Configuration map for colors and icons
  const resourceConfig = {
    [ResourceType.ELECTRICITY]: { color: '#facc15', unit: 'kWh', icon: Zap },
    [ResourceType.WATER]: { color: '#60a5fa', unit: 'm³', icon: Droplets },
    [ResourceType.GAS]: { color: '#fb923c', unit: 'm³', icon: Flame },
    [ResourceType.HEAT]: { color: '#f87171', unit: 'Gcal', icon: Thermometer },
  };

  const currentConfig = resourceConfig[activeResource];
  const MainIcon = currentConfig.icon;

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm shadow-xl h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
             Consumption Trends
          </h2>
          <p className="text-slate-400 text-sm">
            Tracking {activeResource} usage ({currentConfig.unit})
          </p>
        </div>
        
        {/* Toggle Switch */}
        <div className="bg-slate-700/50 p-1 rounded-lg flex text-sm">
          <button
            onClick={() => onRangeChange('week')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              timeRange === 'week' 
                ? 'bg-slate-600 text-white shadow-sm font-medium' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onRangeChange('month')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              timeRange === 'month' 
                ? 'bg-slate-600 text-white shadow-sm font-medium' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Resource Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        {Object.values(ResourceType).map((type) => {
          const config = resourceConfig[type];
          const Icon = config.icon;
          const isActive = activeResource === type;
          
          return (
            <button
              key={type}
              onClick={() => onResourceChange(type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${
                isActive 
                  ? 'bg-slate-700 border-slate-600 text-white shadow-md' 
                  : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? '' : 'opacity-70'}`} style={{ color: isActive ? config.color : undefined }} />
              {type}
            </button>
          );
        })}
      </div>

      <div className="flex-1 w-full min-h-[250px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            key={activeResource} // Force re-render on resource change to animate transition
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderColor: '#334155', 
                color: '#f8fafc',
                borderRadius: '8px'
              }}
              itemStyle={{ color: currentConfig.color }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              formatter={(value: number) => [`${value} ${currentConfig.unit}`, activeResource]}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={currentConfig.color}
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={800}
            />
            {/* Dashed line for average comparison */}
            <Area
              type="monotone"
              dataKey="avg"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              tooltipType="none" // Hide from tooltip for cleaner view
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyChart;
