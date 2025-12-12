
import React from 'react';
import { Wind, CloudFog, Home, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { OutdoorWeather } from '../types';

interface EnvironmentWidgetProps {
  indoor: {
    temp: number;
    humidity: number;
    co2: number;
    windowOpen: boolean;
  };
  outdoor: OutdoorWeather;
}

const EnvironmentWidget: React.FC<EnvironmentWidgetProps> = ({ indoor, outdoor }) => {
  
  // Helper to determine AQI Status
  const getAQIStatus = (aqi: number) => {
    if (aqi <= 20) return { label: 'Good', color: 'text-eco-400', bg: 'bg-eco-400/10' };
    if (aqi <= 40) return { label: 'Fair', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (aqi <= 60) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (aqi <= 80) return { label: 'Poor', color: 'text-orange-400', bg: 'bg-orange-400/10' };
    return { label: 'Hazardous', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  // Helper for Indoor CO2
  const getCO2Status = (co2: number) => {
    if (co2 < 800) return { label: 'Fresh', color: 'text-eco-400', bg: 'bg-eco-400/10' };
    if (co2 < 1000) return { label: 'Ok', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { label: 'Stuffy', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const aqiStatus = getAQIStatus(outdoor.aqi);
  const co2Status = getCO2Status(indoor.co2);

  // Decision Logic for Alerts
  let alertConfig = {
    show: false,
    title: "Conditions are optimal",
    message: "Environment is balanced.",
    colorClass: "text-eco-400",
    bgClass: "bg-eco-500/10",
    borderClass: "border-eco-500/20",
    icon: CheckCircle
  };
  
  if (indoor.co2 > 1000) {
    alertConfig.show = true;
    if (outdoor.aqi > 60) {
      // Dilemma: Inside is bad, Outside is bad
      alertConfig = {
        show: true,
        title: "Use Air Purifier",
        message: "High CO₂ detected, but outdoor air quality is poor.",
        colorClass: "text-orange-400",
        bgClass: "bg-orange-500/10",
        borderClass: "border-orange-500/20",
        icon: ShieldAlert
      };
    } else {
      // Standard: Inside bad, Outside good
      alertConfig = {
        show: true,
        title: "Open Window",
        message: "Indoor CO₂ levels are high. Fresh air recommended.",
        colorClass: "text-blue-400",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/20",
        icon: Wind
      };
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Wind className="w-5 h-5 text-sky-400" />
        <h2 className="text-lg font-semibold text-white">Environment Control</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        {/* Indoor Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Indoor</span>
          </div>
          
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
             <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500">Temp</span>
                <span className="text-sm font-bold text-white">{indoor.temp}°C</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Humidity</span>
                <span className="text-sm font-bold text-white">{indoor.humidity}%</span>
             </div>
          </div>

          <div className={`p-3 rounded-xl border border-slate-800 flex justify-between items-center ${co2Status.bg}`}>
             <div>
               <div className="text-[10px] text-slate-500 uppercase font-bold">CO₂ Level</div>
               <div className={`text-base font-bold ${co2Status.color}`}>{indoor.co2} <span className="text-[10px]">ppm</span></div>
             </div>
             <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/50 border border-slate-700/50 font-medium ${co2Status.color}`}>
                {co2Status.label}
             </span>
          </div>
        </div>

        {/* Outdoor Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <CloudFog className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Outdoor</span>
          </div>

          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
             {outdoor.loading ? (
                <div className="h-10 flex items-center justify-center text-xs text-slate-500">Loading...</div>
             ) : (
               <>
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500">Temp</span>
                    <span className="text-sm font-bold text-white">{outdoor.temp}°C</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Humidity</span>
                    <span className="text-sm font-bold text-white">{outdoor.humidity}%</span>
                 </div>
               </>
             )}
          </div>

          <div className={`p-3 rounded-xl border border-slate-800 flex justify-between items-center ${outdoor.loading ? 'bg-slate-900/40' : aqiStatus.bg}`}>
             {outdoor.loading ? (
                 <div className="text-xs text-slate-500 mx-auto">Checking...</div>
             ) : (
                <>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Air Quality</div>
                    <div className={`text-base font-bold ${aqiStatus.color}`}>{outdoor.aqi} <span className="text-[10px]">AQI</span></div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/50 border border-slate-700/50 font-medium ${aqiStatus.color}`}>
                      {aqiStatus.label}
                  </span>
                </>
             )}
          </div>
        </div>
      </div>

      {/* Dynamic Alert Box */}
      <div className={`mt-auto p-3 rounded-xl flex gap-3 items-start border ${alertConfig.bgClass} ${alertConfig.borderClass}`}>
         <div className={`p-1.5 rounded-lg shrink-0 bg-slate-950/20`}>
            <alertConfig.icon className={`w-4 h-4 ${alertConfig.colorClass}`} />
         </div>
         <div>
            <h4 className={`text-sm font-bold mb-0.5 ${alertConfig.colorClass}`}>{alertConfig.title}</h4>
            <p className="text-xs text-slate-400 leading-snug">{alertConfig.message}</p>
         </div>
      </div>

    </div>
  );
};

export default EnvironmentWidget;
