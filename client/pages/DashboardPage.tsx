
import React from 'react';
import DashboardCard from '../components/DashboardCard';
import EnvironmentWidget from '../components/EnvironmentWidget';
import EcoScore from '../components/EcoScore';
import InsightsList from '../components/InsightsList';
import { SensorStatus, OutdoorWeather, SmartInsight, ResourceType } from '../types';

interface DashboardPageProps {
  sensors: SensorStatus[];
  indoorData: any;
  outdoorData: OutdoorWeather;
  insights: SmartInsight[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  sensors, 
  indoorData, 
  outdoorData, 
  insights 
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm">Welcome back! Real-time status of your environment.</p>
      </div>

      {/* Top Grid: Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {sensors.map(sensor => (
          <div key={sensor.id} className="h-40">
             <DashboardCard data={sensor} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Environment & Score */}
        <div className="lg:col-span-1 space-y-6">
           <EnvironmentWidget indoor={indoorData} outdoor={outdoorData} />
           <EcoScore score={72} co2Saved={14.2} />
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-2 self-stretch min-h-[500px]">
           <InsightsList insights={insights} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
