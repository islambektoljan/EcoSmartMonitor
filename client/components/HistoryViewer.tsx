
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Table, Calendar, BarChart3, Download } from 'lucide-react';
import { ResourceType, HistoricalDataPoint } from '../types';
import { RESOURCE_RATES } from '../constants';

// Helper to generate mock historical data
const generateHistory = (type: ResourceType, startStr: string, endStr: string): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const start = new Date(startStr);
  const end = new Date(endStr);
  const loop = new Date(start);

  // Configuration for random generation using imported RATES
  const config = {
    [ResourceType.ELECTRICITY]: { base: 12, variance: 5, unit: 'kWh', costPerUnit: RESOURCE_RATES[ResourceType.ELECTRICITY] },
    [ResourceType.WATER]: { base: 0.35, variance: 0.1, unit: 'm³', costPerUnit: RESOURCE_RATES[ResourceType.WATER] },
    [ResourceType.GAS]: { base: 1.2, variance: 0.4, unit: 'm³', costPerUnit: RESOURCE_RATES[ResourceType.GAS] },
    [ResourceType.HEAT]: { base: 0.05, variance: 0.02, unit: 'Gcal', costPerUnit: RESOURCE_RATES[ResourceType.HEAT] },
  }[type];

  while (loop <= end) {
    const isWeekend = loop.getDay() === 0 || loop.getDay() === 6;
    // Weekends have higher usage
    const weekendMultiplier = isWeekend ? 1.2 : 1.0; 
    
    // Random fluctuation
    const randomVal = (Math.random() - 0.5) * config.variance;
    
    const value = Math.max(0, (config.base * weekendMultiplier) + randomVal);

    data.push({
      id: loop.toISOString(),
      date: loop.toISOString().split('T')[0], // YYYY-MM-DD
      value: parseFloat(value.toFixed(2)),
      unit: config.unit,
      cost: parseFloat((value * config.costPerUnit).toFixed(2))
    });

    const newDate = loop.setDate(loop.getDate() + 1);
    loop.setTime(newDate);
  }

  return data;
};

const HistoryViewer: React.FC = () => {
  // Default to last 7 days
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState<string>(lastWeek.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);
  const [resource, setResource] = useState<ResourceType>(ResourceType.ELECTRICITY);
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('table');
  const [data, setData] = useState<HistoricalDataPoint[]>([]);

  // Regenerate data when inputs change
  useEffect(() => {
    if (startDate && endDate) {
      const history = generateHistory(resource, startDate, endDate);
      setData(history);
    }
  }, [startDate, endDate, resource]);

  const getColor = (r: ResourceType) => {
    switch (r) {
      case ResourceType.ELECTRICITY: return '#facc15';
      case ResourceType.WATER: return '#60a5fa';
      case ResourceType.GAS: return '#fb923c';
      case ResourceType.HEAT: return '#f87171';
      default: return '#fff';
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;

    // Define CSV headers
    const headers = ['Date', 'Usage', 'Unit', 'Estimated Cost (KZT)'];
    
    // Map data to CSV rows
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.date,
        row.value,
        row.unit,
        row.cost.toFixed(2)
      ].join(','))
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EcoSmart_History_${resource}_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
             <Calendar className="w-5 h-5 text-indigo-400" />
             Historical Analysis
          </h2>
          <p className="text-slate-400 text-sm">Review past consumption and costs</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
           {/* Resource Select */}
           <select 
            value={resource} 
            onChange={(e) => setResource(e.target.value as ResourceType)}
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
           >
             {Object.values(ResourceType).map(t => (
               <option key={t} value={t}>{t}</option>
             ))}
           </select>

           {/* Date Inputs */}
           <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
             <input 
               type="date" 
               value={startDate}
               onChange={(e) => setStartDate(e.target.value)}
               className="bg-transparent text-white text-sm p-1.5 focus:outline-none [color-scheme:dark]" 
             />
             <span className="text-slate-500">-</span>
             <input 
               type="date" 
               value={endDate}
               onChange={(e) => setEndDate(e.target.value)}
               className="bg-transparent text-white text-sm p-1.5 focus:outline-none [color-scheme:dark]" 
             />
           </div>

           {/* View Toggle */}
           <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
             <button
                onClick={() => setViewMode('graph')}
                className={`p-2 rounded-md transition-all ${viewMode === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Graph View"
             >
               <BarChart3 className="w-4 h-4" />
             </button>
             <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Table View"
             >
               <Table className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>

      {/* Content Area - Fixed height to avoid Recharts 0 height warning */}
      <div className="h-[350px] w-full bg-slate-900/40 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
        
        {viewMode === 'graph' ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                tickFormatter={(val) => val.slice(5)} // Show MM-DD
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                formatter={(val: number) => [`${val} ${data[0]?.unit}`, resource]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={`${resource} Usage`}
                stroke={getColor(resource)} 
                strokeWidth={3} 
                dot={{ fill: '#1e293b', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto h-full max-h-[350px] scrollbar-thin">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Usage</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-white">{row.date}</td>
                    <td className="px-6 py-4">{row.value}</td>
                    <td className="px-6 py-4 text-slate-500">{row.unit}</td>
                    <td className="px-6 py-4 text-right font-mono text-eco-400">{row.cost.toFixed(2)} ₸</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="text-center py-10 text-slate-500">No data available for selected range</div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          disabled={data.length === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default HistoryViewer;
