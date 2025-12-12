
import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Bot, 
  Coins 
} from 'lucide-react';
import { SmartInsight, InsightPriority } from '../types';

interface InsightsListProps {
  insights: SmartInsight[];
}

const InsightsList: React.FC<InsightsListProps> = ({ insights }) => {
  
  const getStyleConfig = (priority: InsightPriority) => {
    switch (priority) {
      case 'critical':
        return {
          icon: AlertOctagon,
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          badge: 'bg-red-500/20 text-red-300',
          hover: 'hover:border-red-500/50'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          badge: 'bg-yellow-500/20 text-yellow-300',
          hover: 'hover:border-yellow-500/50'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bg: 'bg-eco-500/10',
          border: 'border-eco-500/30',
          text: 'text-eco-400',
          badge: 'bg-eco-500/20 text-eco-300',
          hover: 'hover:border-eco-500/50'
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
          <h2 className="text-lg font-semibold text-white">Smart Insights Engine</h2>
          <p className="text-slate-400 text-xs">Logic-Driven Recommendations</p>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        {insights.map((insight) => {
          const style = getStyleConfig(insight.priority);
          const Icon = style.icon;

          return (
            <div 
              key={insight.id} 
              className={`p-4 rounded-xl border transition-all duration-300 ${style.bg} ${style.border} ${style.hover}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${style.text}`} />
                  <h3 className={`text-sm font-bold uppercase tracking-wide ${style.text}`}>
                    {insight.title}
                  </h3>
                </div>
                {insight.potentialSavingsKZT && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/40 border border-slate-700/50">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] font-bold text-slate-300">
                      ~{insight.potentialSavingsKZT} ₸
                    </span>
                  </div>
                )}
              </div>

              <p className="text-slate-300 text-sm font-medium mb-3 leading-relaxed">
                {insight.message}
              </p>

              <div className="flex justify-end">
                <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg border border-transparent transition-colors ${style.badge} hover:brightness-110`}>
                  {insight.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsList;
