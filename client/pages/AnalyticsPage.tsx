import React, { useState } from 'react';
import EnergyChart from '../components/EnergyChart';
import HistoryViewer from '../components/HistoryViewer';
import { ChartDataPoint, ResourceType, TimeRange } from '../types';
import { CHART_DATA } from '../constants';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [chartResource, setChartResource] = useState<ResourceType>(ResourceType.ELECTRICITY);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics & History</h1>
        <p className="text-slate-400 text-sm">Deep dive into consumption trends and historical logs.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Chart Section */}
        <div className="h-[500px]">
          <EnergyChart 
            data={CHART_DATA[chartResource][timeRange]}
            timeRange={timeRange}
            onRangeChange={setTimeRange}
            activeResource={chartResource}
            onResourceChange={setChartResource}
          />
        </div>

        {/* History Table Section */}
        <div className="min-h-[450px]">
          <HistoryViewer />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;