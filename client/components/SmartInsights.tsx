
import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, Bot, ArrowRight } from 'lucide-react';
import { Insight } from '../types';

interface SmartInsightsProps {
  insights: Insight[];
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  const getConfig = (type: Insight['type']) => {
    switch (type) {
      case 'alert': 
        return { 
          icon: <AlertTriangle className="w-4 h-4 text-red-500" />, 
          label: 'ALERT', 
          color: 'text-red-500', 
          borderColor: 'border-red-500/20' 
        };
      case 'saving': 
        return { 
          icon: <Lightbulb className="w-4 h-4 text-yellow-500" />, 
          label: 'SAVING', 
          color: 'text-yellow-500', 
          borderColor: 'border-yellow-500/20' 
        };
      case 'achievement': 
        return { 
          icon: <CheckCircle2 className="w-4 h-4 text-eco-500" />, 
          label: 'ACHIEVEMENT', 
          color: 'text-eco-500', 
          borderColor: 'border-eco-500/20' 
        };
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Bot className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Smart Insights</h2>
          <p className="text-slate-400 text-xs">AI-Generated Optimization Tips</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const config = getConfig(insight.type);
          
          return (
            <div 
              key={insight.id} 
              className="group p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300"
            >
              {/* Header: Icon + Label */}
              <div className="flex items-center gap-2 mb-2">
                {config.icon}
                <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                  {config.label}
                </span>
              </div>
              
              {/* Message */}
              <p className="text-slate-300 text-sm mb-4 leading-relaxed font-medium">
                {insight.message}
              </p>
              
              {/* Action Button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition-colors">
                  {insight.impact}
                  {/* For specific style like 'Check for leaks' vs '-$0.45', we just use impact text */}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartInsights;
