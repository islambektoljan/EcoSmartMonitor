
import React, { useEffect, useState } from 'react';
import { Leaf, Award, TrendingUp } from 'lucide-react';

interface EcoScoreProps {
  score: number; // 0 to 100
  co2Saved: number; // in kg
}

const EcoScore: React.FC<EcoScoreProps> = ({ score, co2Saved }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Determine effective score for the circle (0 initially, then actual score)
  // If score prop changes later, it updates directly, and CSS handles transition.
  const animatedScore = mounted ? score : 0;

  // Calculate color based on the actual score
  const scoreColor = score >= 80 ? 'text-eco-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const strokeColor = score >= 80 ? '#34d399' : score >= 50 ? '#facc15' : '#f87171';
  
  // Circle geometry for the gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm flex flex-col relative overflow-hidden group hover:border-slate-600 transition-all duration-300">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-eco-500/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-2 z-10 shrink-0">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Leaf className="w-5 h-5 text-eco-400" />
          Eco Score
        </h2>
        <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md uppercase tracking-wide">Today</span>
      </div>

      {/* Gauge - Centered Flex Area */}
      <div className="flex-1 flex items-center justify-center relative py-4">
        {/* Interactive Container: Scales on hover */}
        <div className="relative w-48 h-48 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105 cursor-default">
            <svg className="transform -rotate-90 w-full h-full drop-shadow-2xl">
              {/* Background Circle */}
              <circle
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50%"
                  cy="50%"
              />
              {/* Progress Circle with Animation */}
              <circle
                  className="transition-all duration-[1500ms] ease-out" 
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  stroke={strokeColor}
                  fill="transparent"
                  r={radius}
                  cx="50%"
                  cy="50%"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center inset-0 pointer-events-none">
                <span className={`text-5xl font-bold ${scoreColor} transition-all duration-300 group-hover:scale-110`}>
                  {score}
                </span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Points</span>
            </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="w-full grid grid-cols-2 gap-4 z-10 shrink-0 mt-2">
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-800/60 transition-colors">
          <TrendingUp className="w-4 h-4 text-blue-400 mb-2" />
          <span className="text-xl font-bold text-white">{co2Saved}</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">KG CO₂ Saved</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-800/60 transition-colors">
          <Award className="w-4 h-4 text-yellow-400 mb-2" />
          <span className="text-xl font-bold text-white">Top 5%</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Rank</span>
        </div>
      </div>
    </div>
  );
};

export default EcoScore;
